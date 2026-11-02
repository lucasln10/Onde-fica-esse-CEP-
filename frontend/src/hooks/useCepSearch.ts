import { useEffect, useState } from 'react'
import { fetchCep } from '../lib/api'
import { onlyDigits } from '../lib/cep'
import type { CepResult } from '../types/cep'

const SEARCH_DEBOUNCE_MS = 450

export function useCepSearch() {
  const [cep, setCep] = useState('')
  const [result, setResult] = useState<CepResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (cep.length !== 8) return

    const controller = new AbortController()

    const timer = window.setTimeout(async () => {
      setLoading(true)
      setError(null)

      try {
        setResult(await fetchCep(cep, controller.signal))
      } catch (requestError) {
        if (controller.signal.aborted) return

        setResult(null)
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Erro ao buscar o CEP.',
        )
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
      controller.abort()
    }
  }, [cep])

  function updateCep(value: string) {
    const nextCep = onlyDigits(value)

    setCep(nextCep)
    setError(null)
    setLoading(nextCep.length === 8)
  }

  return { cep, updateCep, result, error, loading }
}
