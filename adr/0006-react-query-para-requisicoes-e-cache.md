# ADR 0006 — React Query para requisições e cache

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

O app mobile consome a API REST de times e tarefas (listar, detalhar, criar, atualizar e
apagar). Sem uma biblioteca de server state, cada tela teria de montar loading, erro,
refetch e invalidação à mão. A avaliação pede React Query para esse papel.

## Decisão

**TanStack React Query** é dono de todo estado que vem do servidor. Listagens e detalhe
passam por `useQuery`; escritas, por `useMutation`. Depois de um create/update/delete a
mutation **invalida** a query correspondente. Dado de servidor não entra no Redux; dado de
formulário não entra no React Query.

## Justificativa

- **É uma biblioteca estável.** Tem API consolidada, tipagem boa em TypeScript e uso
  amplo em produção — o suficiente para não ser um risco neste projeto.
- **Facilita a estrutura das requisições.** Cada recurso tem um hook (`useTeamsQuery`,
  `useCreateTeamMutation`, …). A tela não fala com o axios: ela chama o hook, que chama
  `src/models/`. Loading e erro vêm do próprio React Query.
- **O cache deixa o app mais performático.** Listagens já vistas não disparam de novo na
  hora; `staleTime` de 30s e `placeholderData` na busca de times evitam flicker. Sem cache,
  cada volta para a home seria uma ida extra à API.

## Consequências

- Toda chamada HTTP reutilizável mora em `src/models/` e é exposta por `src/hooks/`. A
  tela não monta `fetch` direto.
- Não há optimistic update: a UI espera a resposta e depois invalida. Em volume maior
  isso apareceria como atraso percebido.
- `networkMode: 'always'` está ligado porque, no Expo, o detector de rede do React Query
  às vezes marca o app como offline mesmo com internet.
