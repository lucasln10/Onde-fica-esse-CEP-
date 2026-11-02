import type { ApiError, CepResult } from '../types/cep'

const configuredApiUrl = (
  import.meta.env.VITE_API_URL as string | undefined
)?.trim()

export const API_URL = configuredApiUrl
  ? configuredApiUrl.replace(/\/$/, '')
  : `${window.location.protocol}//${window.location.hostname}:3001`

export async function fetchCep(cep: string, signal?: AbortSignal) {
  const response = await fetch(`${API_URL}/api/cep/${cep}`, {
    headers: { Accept: 'application/json' },
    signal,
  })

  const payload = (await response.json().catch(() => null)) as
    | CepResult
    | ApiError
    | null

  if (!response.ok) {
    const message =
      payload && 'error' in payload && payload.error
        ? payload.error
        : 'Não foi possível buscar este CEP.'
    throw new Error(message)
  }

  if (!payload || !('coordinates' in payload)) {
    throw new Error('A API retornou uma resposta inesperada.')
  }

  return payload
}
