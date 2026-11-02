import styled, { keyframes } from 'styled-components'

type SearchFieldProps = {
  id?: string
  label: string
  value: string
  onChange: (value: string) => void
  loading?: boolean
  hint?: string
  placeholder?: string
  maxLength?: number
  autoComplete?: string
  inputMode?: 'numeric' | 'text'
}

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.label`
  color: ${({ theme }) => theme.colors.body};
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
`

const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border: 1px solid ${({ theme }) => theme.colors.lineStrong};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.search};
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.accentStrong};
    box-shadow: ${({ theme }) => theme.shadows.searchFocus};
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    padding: 11px 14px;
  }
`

const SearchIcon = styled.svg`
  flex: none;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.faint};
`

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.ink};
  font-size: 20px;
  font-weight: 600;
  letter-spacing: 0.06em;

  &::placeholder {
    color: ${({ theme }) => theme.colors.lineStrong};
    font-weight: 500;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints.small}) {
    font-size: 18px;
  }
`

const Spinner = styled.span<{ $loading: boolean }>`
  flex: none;
  width: 18px;
  height: 18px;
  border: 2px solid ${({ theme }) => theme.colors.accentBorder};
  border-top-color: ${({ theme }) => theme.colors.accent};
  border-radius: 50%;
  opacity: ${({ $loading }) => ($loading ? 1 : 0)};
  animation: ${spin} 0.8s linear infinite;
`

const Hint = styled.p`
  min-height: 18px;
  margin: 0 2px;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 12.5px;
  line-height: 1.4;
`

export function SearchField({
  id = 'cep',
  label,
  value,
  onChange,
  loading = false,
  hint,
  placeholder = '00000-000',
  maxLength = 9,
  autoComplete = 'postal-code',
  inputMode = 'numeric',
}: SearchFieldProps) {
  const hintId = `${id}-hint`

  return (
    <Wrapper>
      <Label htmlFor={id}>{label}</Label>
      <Field>
        <SearchIcon viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle
            cx="11"
            cy="11"
            r="6.5"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m16 16 4.5 4.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </SearchIcon>
        <Input
          id={id}
          type="text"
          inputMode={inputMode}
          autoComplete={autoComplete}
          maxLength={maxLength}
          placeholder={placeholder}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={hintId}
          aria-busy={loading}
        />
        <Spinner $loading={loading} aria-hidden="true" />
      </Field>
      <Hint id={hintId} aria-live="polite">
        {hint ?? '\u00A0'}
      </Hint>
    </Wrapper>
  )
}
