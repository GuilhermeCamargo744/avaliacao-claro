# ADR 0006 — React Query para requisições e cache

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

O app mobile consome a API REST de times e tarefas (listar, detalhar, criar, atualizar e
apagar). Sem uma biblioteca de server state, cada tela teria de montar loading, erro,
refetch e invalidação à mão. A avaliação pede React Query para esse papel.

## Decisão

**TanStack React Query** é dono de todo estado que vem do servidor.

- Detalhe (`useTaskQuery`, `useTeamQuery`) passa por `useQuery`.
- A lista de **tarefas** passa por `useInfiniteQuery`: `limit=10`, o resto no scroll
  (`offset` seguinte). Dez itens cabem na primeira tela; o restante não precisa vir
  de uma vez.
- A lista de **times** fica em `useQuery` com `limit=100`. Não paginei na UI: o
  catálogo é pequeno (o seed tem 3), e a home precisa da lista inteira no select de
  tarefa. A API pagina; o app pede o teto.

Escritas passam por `useMutation`. Depois de create/update/delete a mutation
**invalida** a query. Dado de servidor não entra no Redux; dado de formulário não
entra no React Query.

Filtro e busca de tarefas são sempre do servidor (`teamId`, `status`, `search` na
query string). Não filtro no cliente o que ainda não veio na página — senão a busca
acharia só o que já estava na memória. A busca dos times na home também é do
servidor, com debounce, pelo mesmo motivo.

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
- Não há optimistic update: a UI espera a resposta e depois invalida. Pensei em colocar,
  mas para o ciclo da avaliação preferi a lista bater com o servidor depois do 200.
- `networkMode: 'always'` está ligado porque, no Expo, o detector de rede do React Query
  às vezes marca o app como offline mesmo com internet.
