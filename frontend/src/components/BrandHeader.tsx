import type { ReactNode } from 'react'
import styled from 'styled-components'

type BrandHeaderProps = {
  eyebrow: string
  title: string
  description?: string
  mark?: ReactNode
}

const Header = styled.header`
  display: flex;
  align-items: flex-start;
  gap: 14px;
`

const Mark = styled.div`
  display: grid;
  flex: none;
  width: 46px;
  height: 46px;
  place-items: center;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.ink};
  color: ${({ theme }) => theme.colors.accentSoft};
  font-size: 24px;
  box-shadow: ${({ theme }) => theme.shadows.brand};
`

const Content = styled.div`
  min-width: 0;
`

const Eyebrow = styled.p`
  margin: 0 0 4px;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`

const Title = styled.h1`
  margin: 0;
  color: ${({ theme }) => theme.colors.ink};
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.05;
  letter-spacing: -0.04em;
`

const Description = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.body};
  font-size: 15px;
  line-height: 1.6;
`

export function BrandHeader({
  eyebrow,
  title,
  description,
  mark = '◉',
}: BrandHeaderProps) {
  return (
    <Header>
      <Mark aria-hidden="true">{mark}</Mark>
      <Content>
        <Eyebrow>{eyebrow}</Eyebrow>
        <Title>{title}</Title>
        {description ? <Description>{description}</Description> : null}
      </Content>
    </Header>
  )
}
