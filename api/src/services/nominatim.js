import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';

let lastRequestAt = 0;
let queue = Promise.resolve();

function throttle(task) {
  const run = queue.then(async () => {
    const waitMs = Math.max(
      0,
      config.nominatimMinIntervalMs - (Date.now() - lastRequestAt),
    );

    if (waitMs > 0) {
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }

    lastRequestAt = Date.now();
    return task();
  });

  queue = run.catch(() => {});
  return run;
}

async function search(params) {
  const url = `${config.nominatimUrl}?${params.toString()}`;
  let response;

  try {
    response = await throttle(() =>
      fetch(url, {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'pt-BR',
          'User-Agent': config.nominatimUserAgent,
        },
        signal: AbortSignal.timeout(config.upstreamTimeoutMs),
      }),
    );
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new HttpError(
        504,
        'A consulta ao serviço de geocodificação excedeu o tempo limite.',
      );
    }
    throw new HttpError(
      502,
      'Não foi possível consultar o serviço de geocodificação.',
    );
  }

  if (response.status === 429) {
    throw new HttpError(
      503,
      'O serviço de geocodificação está temporariamente limitado. Tente novamente em alguns segundos.',
    );
  }
  if (!response.ok) {
    throw new HttpError(
      502,
      `O serviço de geocodificação respondeu com status ${response.status}.`,
    );
  }

  let results;
  try {
    results = await response.json();
  } catch {
    throw new HttpError(
      502,
      'O serviço de geocodificação retornou uma resposta inválida.',
    );
  }

  if (!Array.isArray(results) || results.length === 0) {
    return null;
  }

  const hit = results[0];
  const lat = Number(hit.lat);
  const lng = Number(hit.lon);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return null;
  }

  return {
    lat,
    lng,
    displayName: hit.display_name ?? null,
    osmType: hit.osm_type ?? null,
    osmId: hit.osm_id ?? null,
    boundingBox: Array.isArray(hit.boundingbox)
      ? hit.boundingbox.map(Number)
      : null,
  };
}

function baseParams() {
  return new URLSearchParams({
    format: 'jsonv2',
    addressdetails: '1',
    limit: '1',
    countrycodes: 'br',
    'accept-language': 'pt-BR',
  });
}

function structuredQuery(address) {
  const params = baseParams();

  if (address.cep) {
    params.set('postalcode', String(address.cep).replace(/\D/g, ''));
  }
  if (address.logradouro) {
    params.set('street', address.logradouro);
  }
  if (address.localidade) {
    params.set('city', address.localidade);
  }
  if (address.estado) {
    params.set('state', address.estado);
  }

  return params;
}

function fullAddressQuery(address) {
  const params = baseParams();
  const city = [address.localidade, address.uf].filter(Boolean).join(' - ');
  const parts = [
    address.logradouro,
    address.bairro,
    city,
    address.cep,
    'Brasil',
  ].filter(Boolean);

  params.set('q', parts.join(', '));
  return params;
}

function cityQuery(address) {
  const params = baseParams();
  const city = [address.localidade, address.uf].filter(Boolean).join(' - ');
  params.set('q', `${city}, Brasil`);
  return params;
}

export async function geocodeAddress(address) {
  const candidates = [];

  if (address.cep) {
    candidates.push(structuredQuery(address));
  }
  if (address.logradouro) {
    candidates.push(fullAddressQuery(address));
  }
  if (address.localidade) {
    candidates.push(cityQuery(address));
  }

  const visited = new Set();

  for (const params of candidates) {
    const key = params.toString();
    if (visited.has(key)) continue;
    visited.add(key);

    const result = await search(params);
    if (result) return result;
  }

  return null;
}
