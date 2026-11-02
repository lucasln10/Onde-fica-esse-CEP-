import type { CepResult } from '../types/cep'

export function onlyDigits(value: string) {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatCep(digits: string) {
  return digits.length > 5
    ? `${digits.slice(0, 5)}-${digits.slice(5)}`
    : digits
}

export function formatAddress(result: CepResult) {
  return [
    result.logradouro,
    result.bairro,
    [result.localidade, result.uf].filter(Boolean).join(' - '),
  ]
    .filter(Boolean)
    .join(' • ')
}
