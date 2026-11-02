import { config } from '../config.js';
import { createCache } from '../lib/cache.js';
import { HttpError } from '../lib/http-error.js';
import { geocodeAddress } from './nominatim.js';
import { fetchAddressByCep } from './viacep.js';

const cache = createCache({ ttlMs: config.cacheTtlMs });
const CEP_PATTERN = /^\d{8}$/;

function normalizeCep(value) {
  return String(value ?? '').replace(/\D/g, '');
}

export async function lookupCep(rawCep) {
  const cep = normalizeCep(rawCep);

  if (!CEP_PATTERN.test(cep)) {
    throw new HttpError(400, 'CEP inválido. Informe exatamente 8 dígitos.');
  }

  const cached = cache.get(cep);
  if (cached) return cached;

  const address = await fetchAddressByCep(cep);
  const location = await geocodeAddress(address);

  if (!location) {
    throw new HttpError(
      422,
      'O CEP foi encontrado, mas não foi possível obter as coordenadas do endereço.',
      {
        cep: address.cep ?? cep,
        logradouro: address.logradouro || null,
        bairro: address.bairro || null,
        localidade: address.localidade || null,
        uf: address.uf || null,
      },
    );
  }

  const result = {
    cep: address.cep ?? `${cep.slice(0, 5)}-${cep.slice(5)}`,
    cepDigits: cep,
    logradouro: address.logradouro || '',
    complemento: address.complemento || '',
    unidade: address.unidade || '',
    bairro: address.bairro || '',
    localidade: address.localidade || '',
    uf: address.uf || '',
    estado: address.estado || '',
    regiao: address.regiao || '',
    ibge: address.ibge || '',
    ddd: address.ddd || '',
    coordinates: { lat: location.lat, lng: location.lng },
    formattedAddress: location.displayName,
    geocoding: {
      provider: 'OpenStreetMap Nominatim',
      osmType: location.osmType,
      osmId: location.osmId,
      boundingBox: location.boundingBox,
    },
    mapUrl: `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=17/${location.lat}/${location.lng}`,
  };

  cache.set(cep, result);
  return result;
}
