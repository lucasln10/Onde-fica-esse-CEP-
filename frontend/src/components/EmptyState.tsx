import type { ReactNode } from 'react'
import styled from 'styled-components'

const Box = styled.div`
  margin-top: auto;
  padding: 20px;
  border: 1px dashed ${({ theme }) => theme.colors.lineStrong};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: rgba(255, 255, 255, 0.5);
  color: ${({ theme }) => theme.colors.muted};
  font-size: 13.5px;
  line-height: 1.5;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    margin-top: 4px;
  }
`

const Icon = styled.span`
  display: block;
  margin-bottom: 8px;
  color: ${({ theme }) => theme.colors.accent};
  font-size: 24px;
`

const Message = styled.p`
  margin: 0;
`

type EmptyStateProps = {
  icon?: ReactNode
  children: ReactNode
}

export function EmptyState({ icon = '⌖', children }: EmptyStateProps) {
  return (
    <Box>
      <Icon aria-hidden="true">{icon}</Icon>
      <Message>{children}</Message>
    </Box>
  )
}
