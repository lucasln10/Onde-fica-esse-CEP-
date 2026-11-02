export type CepResult = {
  cep: string
  cepDigits: string
  logradouro: string
  complemento: string
  unidade: string
  bairro: string
  localidade: string
  uf: string
  estado: string
  regiao: string
  ibge: string
  ddd: string
  coordinates: { lat: number; lng: number }
  formattedAddress: string | null
  geocoding: {
    provider: string
    osmType: string | null
    osmId: number | string | null
    boundingBox: number[] | null
  }
  mapUrl: string
}

export type ApiError = {
  error?: string
  details?: unknown
}
