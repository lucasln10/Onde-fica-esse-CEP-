import styled, { css } from 'styled-components'

type ButtonVariant = 'ghost' | 'solid'

type ButtonProps = {
  $variant?: ButtonVariant
}

export const Button = styled.button<ButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  min-height: 44px;
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: ${({ theme }) => theme.shadows.control};
  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    box-shadow 0.2s ease,
    transform 0.2s ease;

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.faint};
    background: ${({ theme }) => theme.colors.white};
  }

  &:active:not(:disabled) {
    transform: translateY(1px);
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.accentStrong};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.55;
    cursor: default;
  }

  ${({ $variant, theme }) =>
    $variant === 'solid' &&
    css`
      border-color: ${theme.colors.accent};
      background: ${theme.colors.accent};
      color: ${theme.colors.white};

      &:hover:not(:disabled) {
        border-color: ${theme.colors.accentStrong};
        background: ${theme.colors.accentStrong};
      }
    `}
`
