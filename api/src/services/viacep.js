import { config } from '../config.js';
import { HttpError } from '../lib/http-error.js';

const VIACEP_BASE_URL = 'https://viacep.com.br/ws';

export async function fetchAddressByCep(cep) {
  let response;

  try {
    response = await fetch(`${VIACEP_BASE_URL}/${cep}/json/`, {
      headers: { Accept: 'application/json' },
      signal: AbortSignal.timeout(config.upstreamTimeoutMs),
    });
  } catch (error) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      throw new HttpError(504, 'A consulta ao ViaCEP excedeu o tempo limite.');
    }
    throw new HttpError(502, 'Não foi possível consultar o ViaCEP.');
  }

  if (response.status === 400) {
    throw new HttpError(400, 'CEP inválido para o ViaCEP.');
  }
  if (response.status === 404) {
    throw new HttpError(404, 'CEP não encontrado no ViaCEP.');
  }
  if (!response.ok) {
    throw new HttpError(
      502,
      `O ViaCEP respondeu com status ${response.status}.`,
    );
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new HttpError(502, 'O ViaCEP retornou uma resposta inválida.');
  }

  if (!data || data.erro) {
    throw new HttpError(404, 'CEP não encontrado.');
  }

  return data;
}
