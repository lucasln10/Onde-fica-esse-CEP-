import { useEffect, useRef } from 'react'
import {
  AttributionControl,
  Map as MapLibreMap,
  Marker,
  NavigationControl,
  Popup,
  setWorkerUrl,
} from 'maplibre-gl'
import type { StyleSpecification } from 'maplibre-gl'
import workerUrl from 'maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url'
import styled from 'styled-components'
import 'maplibre-gl/dist/maplibre-gl.css'
import { theme } from '../theme'
import type { CepResult } from '../types/cep'
import { Button } from './ui/Button'

setWorkerUrl(workerUrl)

const BRAZIL_CENTER: [number, number] = [-51.9253, -14.235]
const INITIAL_ZOOM = 3.6
const FOCUS_ZOOM = 16

const mapStyle: StyleSpecification = {
  version: 8,
  name: 'Mapa mundial com OpenStreetMap',
  sources: {
    osm: {
      type: 'raster',
      tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
      tileSize: 256,
      maxzoom: 19,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
    },
  },
  layers: [
    {
      id: 'osm',
      type: 'raster',
      source: 'osm',
      minzoom: 0,
      maxzoom: 19,
    },
  ],
}

const MapSection = styled.section`
  position: relative;
  min-height: 100vh;
  min-height: 100svh;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.map};
  scroll-margin-top: 8px;

  & .maplibregl-ctrl-group {
    overflow: hidden;
    border-radius: ${({ theme }) => theme.radii.sm};
    box-shadow: ${({ theme }) => theme.shadows.control} !important;
  }

  & .maplibregl-popup-content {
    padding: 12px 14px;
    border-radius: ${({ theme }) => theme.radii.sm};
    color: ${({ theme }) => theme.colors.ink};
    font-family: inherit;
    font-size: 13px;
    box-shadow: ${({ theme }) => theme.shadows.popup};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    min-height: 58svh;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    min-height: 62svh;
  }
`

const MapCanvas = styled.div`
  position: absolute;
  inset: 0;
`

const ResetMapButton = styled(Button)`
  position: absolute;
  top: max(12px, env(safe-area-inset-top));
  left: max(12px, env(safe-area-inset-left));
  z-index: 1;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
`

type MapViewProps = {
  result: CepResult | null
  ariaLabel?: string
  resetLabel?: string
}

export function MapView({
  result,
  ariaLabel = 'Mapa do endereço encontrado',
  resetLabel = 'Ver Brasil',
}: MapViewProps) {
  const sectionRef = useRef<HTMLElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<MapLibreMap | null>(null)
  const markerRef = useRef<Marker | null>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const map = new MapLibreMap({
      container: containerRef.current,
      style: mapStyle,
      center: BRAZIL_CENTER,
      zoom: INITIAL_ZOOM,
      maxZoom: 19,
      attributionControl: false,
    })

    map.addControl(
      new NavigationControl({ visualizePitch: true }),
      'top-right',
    )
    map.addControl(new AttributionControl({ compact: true }), 'bottom-right')

    mapRef.current = map

    return () => {
      markerRef.current?.remove()
      markerRef.current = null
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !result) return

    const coordinates: [number, number] = [
      result.coordinates.lng,
      result.coordinates.lat,
    ]

    const focusOnResult = () => {
      markerRef.current?.remove()

      const place = result.logradouro || result.localidade
      const popup = new Popup({
        offset: 26,
        closeButton: false,
      }).setText(`${place} — ${result.localidade}/${result.uf}`)

      markerRef.current = new Marker({ color: '#f43f5e' })
        .setLngLat(coordinates)
        .setPopup(popup)
        .addTo(map)

      map.flyTo({
        center: coordinates,
        zoom: FOCUS_ZOOM,
        speed: 1.5,
        curve: 1.42,
        essential: true,
      })
    }

    if (map.isStyleLoaded()) {
      focusOnResult()
    } else {
      map.once('load', focusOnResult)
    }

    return () => {
      map.off('load', focusOnResult)
      markerRef.current?.remove()
      markerRef.current = null
    }
  }, [result])

  useEffect(() => {
    if (!result || !window.matchMedia(`(max-width: ${theme.breakpoints.mobile})`).matches) {
      return
    }

    const frame = window.requestAnimationFrame(() => {
      sectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    })

    return () => window.cancelAnimationFrame(frame)
  }, [result])

  function resetMap() {
    mapRef.current?.flyTo({
      center: BRAZIL_CENTER,
      zoom: INITIAL_ZOOM,
      speed: 1.4,
      essential: true,
    })
  }

  return (
    <MapSection
      ref={sectionRef}
      data-testid="map-section"
      aria-label={ariaLabel}
    >
      <MapCanvas ref={containerRef} />
      <ResetMapButton type="button" onClick={resetMap} disabled={!result}>
        {resetLabel}
      </ResetMapButton>
    </MapSection>
  )
}
