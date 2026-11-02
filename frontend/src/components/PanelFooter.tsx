import type { ReactNode } from 'react'
import styled from 'styled-components'

const Footer = styled.footer`
  margin-top: auto;
  padding-top: 18px;
  border-top: 1px solid ${({ theme }) => theme.colors.line};
  color: ${({ theme }) => theme.colors.faint};
  font-size: 11.5px;
  line-height: 1.5;
`

export function PanelFooter({ children }: { children: ReactNode }) {
  return <Footer>{children}</Footer>
}
