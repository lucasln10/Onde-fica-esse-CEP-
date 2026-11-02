import type { ReactNode } from 'react'
import styled from 'styled-components'

const Alert = styled.div`
  padding: 12px 14px;
  border: 1px solid ${({ theme }) => theme.colors.accentBorder};
  border-radius: ${({ theme }) => theme.radii.sm};
  background: ${({ theme }) => theme.colors.accentWash};
  color: #9f1239;
  font-size: 14px;
  line-height: 1.45;
`

export function ErrorAlert({ children }: { children: ReactNode }) {
  return <Alert role="alert">{children}</Alert>
}
