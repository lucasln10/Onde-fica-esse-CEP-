import styled, { keyframes } from 'styled-components'
import { formatAddress } from '../lib/cep'
import type { CepResult } from '../types/cep'

const rise = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: none;
  }
`

const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 20px;
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.onDark};
  box-shadow: ${({ theme }) => theme.shadows.card};
  animation: ${rise} 0.35s ease-out both;
`

const Head = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Badge = styled.span`
  padding: 6px 10px;
  border: 1px solid rgba(244, 63, 94, 0.28);
  border-radius: ${({ theme }) => theme.radii.pill};
  background: rgba(244, 63, 94, 0.16);
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const StatusDot = styled.span`
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.success};
  box-shadow: 0 0 0 4px rgba(52, 211, 153, 0.16);
`

const Title = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.onDark};
  font-size: 22px;
  line-height: 1.15;
  letter-spacing: -0.02em;
`

const Address = styled.p`
  margin: -4px 0 0;
  color: ${({ theme }) => theme.colors.onDarkMuted};
  font-size: 13.5px;
  line-height: 1.5;
`

const Coordinates = styled.dl`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin: 6px 0 0;

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    grid-template-columns: 1fr;
  }
`

const Coordinate = styled.div`
  padding: 10px 12px;
  border: 1px solid ${({ theme }) => theme.colors.onDarkLine};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.onDarkSurface};
`

const Term = styled.dt`
  margin-bottom: 3px;
  color: ${({ theme }) => theme.colors.onDarkMuted};
  font-size: 10px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`

const Value = styled.dd`
  margin: 0;
  color: ${({ theme }) => theme.colors.onDark};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 13px;
`

const MapLink = styled.a`
  display: inline-flex;
  align-self: flex-start;
  align-items: center;
  gap: 6px;
  margin-top: 2px;
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 13px;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`

export function AddressResultCard({ result }: { result: CepResult }) {
  return (
    <Card data-testid="result-card" aria-live="polite">
      <Head>
        <Badge>CEP {result.cep}</Badge>
        <StatusDot aria-hidden="true" />
      </Head>

      <Title>{result.logradouro || result.localidade}</Title>
      <Address>{formatAddress(result)}</Address>

      <Coordinates data-testid="coordinates">
        <Coordinate>
          <Term>Latitude</Term>
          <Value>{result.coordinates.lat.toFixed(6)}</Value>
        </Coordinate>
        <Coordinate>
          <Term>Longitude</Term>
          <Value>{result.coordinates.lng.toFixed(6)}</Value>
        </Coordinate>
      </Coordinates>

      <MapLink href={result.mapUrl} target="_blank" rel="noreferrer">
        Abrir no OpenStreetMap <span aria-hidden="true">↗</span>
      </MapLink>
    </Card>
  )
}
