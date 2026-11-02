import { ThemeProvider } from 'styled-components'
import {
  AddressResultCard,
  AppLayout,
  BrandHeader,
  EmptyState,
  ErrorAlert,
  MapView,
  PanelFooter,
  SearchField,
  SidePanel,
} from './components'
import { useCepSearch } from './hooks/useCepSearch'
import { formatCep } from './lib/cep'
import { GlobalStyle } from './styles/GlobalStyle'
import { theme } from './theme'

type SearchHintOptions = {
  loading: boolean
  cepLength: number
  hasResult: boolean
  hasError: boolean
}

function getSearchHint({
  loading,
  cepLength,
  hasResult,
  hasError,
}: SearchHintOptions) {
  if (loading) return 'Consultando ViaCEP e geocodificando...'
  if (cepLength === 8 && hasResult) return 'Endereço localizado no mapa.'
  if (cepLength === 8 && !hasError) return 'Aguardando resposta da API...'
  if (hasError) return 'Revise o CEP ou tente novamente.'
  return 'A busca começa automaticamente ao completar 8 dígitos.'
}

function App() {
  const { cep, updateCep, result, error, loading } = useCepSearch()
  const hint = getSearchHint({
    loading,
    cepLength: cep.length,
    hasResult: Boolean(result),
    hasError: Boolean(error),
  })

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AppLayout>
        <SidePanel data-testid="side-panel">
          <BrandHeader
            eyebrow="ViaCEP + OpenStreetMap"
            title="Onde fica esse CEP?"
            description="Digite um CEP brasileiro. A API consulta o ViaCEP, converte o endereço em coordenadas e o mapa voa até o local."
          />

          <SearchField
            id="cep"
            label="Buscar CEP"
            value={formatCep(cep)}
            onChange={updateCep}
            loading={loading}
            hint={hint}
          />

          {error ? <ErrorAlert>{error}</ErrorAlert> : null}

          {result ? <AddressResultCard result={result} /> : null}

          {!result && !error ? (
            <EmptyState>
              O mapa começa no Brasil e dá zoom no endereço encontrado.
            </EmptyState>
          ) : null}

          <PanelFooter>
            Dados: ViaCEP • Geocodificação: Nominatim/OpenStreetMap
          </PanelFooter>
        </SidePanel>

        <MapView result={result} />
      </AppLayout>
    </ThemeProvider>
  )
}

export default App
