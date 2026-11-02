import styled from 'styled-components'

export const AppLayout = styled.main`
  display: grid;
  grid-template-columns: minmax(340px, 420px) 1fr;
  min-height: 100vh;
  min-height: 100svh;
  background: ${({ theme }) => theme.colors.canvas};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`

export const SidePanel = styled.aside`
  display: flex;
  flex-direction: column;
  gap: 18px;
  max-height: 100vh;
  max-height: 100svh;
  padding: clamp(24px, 3vw, 44px);
  overflow-y: auto;
  border-right: 1px solid ${({ theme }) => theme.colors.line};
  background:
    radial-gradient(
      circle at top left,
      ${({ theme }) => theme.colors.surface} 0%,
      ${({ theme }) => theme.colors.canvasWash} 72%
    ),
    ${({ theme }) => theme.colors.canvas};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    max-height: none;
    padding-bottom: max(24px, env(safe-area-inset-bottom));
    border-right: 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.line};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    gap: 14px;
    padding: 22px 18px max(22px, env(safe-area-inset-bottom));
  }
`
