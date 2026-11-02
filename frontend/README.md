# Frontend — ViaCEP no Mapa

Interface web do projeto **ViaCEP no Mapa**, construída com React 19, TypeScript, Vite, styled-components e MapLibre GL JS.

A documentação completa, incluindo arquitetura, API e instruções do backend, está no [README principal](../README.md).

## Responsabilidades

- Receber e formatar o CEP digitado.
- Buscar automaticamente quando os 8 dígitos estiverem completos.
- Aplicar debounce e cancelar requisições anteriores.
- Exibir estados de carregamento, erro e resultado vazio.
- Mostrar o endereço encontrado e as coordenadas.
- Exibir e focar a localização no mapa com marcador e popup.
- Adaptar o layout para desktop e celular.

## Scripts

```powershell
npm install
npm run dev      # servidor de desenvolvimento
npm run build    # typecheck + build de produção
npm run preview  # pré-visualização do build
npm run lint     # Oxlint
```

## API

Por padrão, o frontend chama a API no mesmo hostname da página, na porta `3001`:

```text
http://<host-atual>:3001/api/cep/:cep
```

Para usar outro endereço, crie um arquivo `.env.local`:

```env
VITE_API_URL=http://192.168.0.10:3001
```

## Estrutura

```text
src/
├── components/
│   ├── ui/Button.tsx
│   ├── AddressResultCard.tsx
│   ├── AppLayout.tsx
│   ├── BrandHeader.tsx
│   ├── EmptyState.tsx
│   ├── ErrorAlert.tsx
│   ├── MapView.tsx
│   ├── PanelFooter.tsx
│   ├── SearchField.tsx
│   └── index.ts
├── hooks/useCepSearch.ts
├── lib/
│   ├── api.ts
│   └── cep.ts
├── styles/GlobalStyle.ts
├── types/
│   ├── cep.ts
│   └── styled.d.ts
├── App.tsx
├── main.tsx
└── theme.ts
```
