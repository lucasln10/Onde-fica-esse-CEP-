export interface AppTheme {
  colors: {
    ink: string
    body: string
    muted: string
    faint: string
    canvas: string
    canvasWash: string
    surface: string
    white: string
    line: string
    lineStrong: string
    accent: string
    accentStrong: string
    accentSoft: string
    accentWash: string
    accentBorder: string
    success: string
    onDark: string
    onDarkMuted: string
    onDarkLine: string
    onDarkSurface: string
    map: string
  }
  fonts: {
    sans: string
    mono: string
  }
  radii: {
    sm: string
    md: string
    lg: string
    pill: string
  }
  shadows: {
    brand: string
    card: string
    search: string
    searchFocus: string
    control: string
    popup: string
  }
  breakpoints: {
    mobile: string
    small: string
  }
}

export const theme: AppTheme = {
  colors: {
    ink: '#0f172a',
    body: '#475569',
    muted: '#64748b',
    faint: '#94a3b8',
    canvas: '#f8fafc',
    canvasWash: '#f1f5f9',
    surface: '#ffffff',
    white: '#ffffff',
    line: '#e2e8f0',
    lineStrong: '#cbd5e1',
    accent: '#e11d48',
    accentStrong: '#f43f5e',
    accentSoft: '#fda4af',
    accentWash: '#fff1f2',
    accentBorder: '#fecdd3',
    success: '#34d399',
    onDark: '#f8fafc',
    onDarkMuted: '#94a3b8',
    onDarkLine: '#334155',
    onDarkSurface: '#1e293b',
    map: '#dbeafe',
  },
  fonts: {
    sans: "'Segoe UI', system-ui, -apple-system, BlinkMacSystemFont, 'Helvetica Neue', sans-serif",
    mono: 'ui-monospace, Consolas, monospace',
  },
  radii: {
    sm: '12px',
    md: '16px',
    lg: '20px',
    pill: '999px',
  },
  shadows: {
    brand: '0 14px 30px -12px rgba(15, 23, 42, 0.7)',
    card: '0 24px 50px -20px rgba(15, 23, 42, 0.55)',
    search: '0 10px 30px rgba(15, 23, 42, 0.06)',
    searchFocus:
      '0 0 0 4px rgba(244, 63, 94, 0.14), 0 12px 30px rgba(15, 23, 42, 0.08)',
    control: '0 6px 18px rgba(15, 23, 42, 0.12)',
    popup: '0 10px 30px rgba(15, 23, 42, 0.18)',
  },
  breakpoints: {
    mobile: '860px',
    small: '480px',
  },
}
