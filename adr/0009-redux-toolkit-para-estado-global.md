# ADR 0009 — Redux Toolkit para estado global de UI

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

A home tem um campo de busca cujo texto precisa continuar lá quando o usuário volta de
outra tela. Isso é estado de UI, não de servidor — não cabe no React Query
([ADR 0006](0006-react-query-para-requisicoes-e-cache.md)). As alternativas eram Zustand,
Context e Redux Toolkit.

## Decisão

**Redux Toolkit** guarda o estado global de UI. Hoje há um slice só: o termo de busca da
home (`searchTermChanged` / `selectSearchTerm`). Dado de servidor não entra no store.

## Justificativa

- **É uma das bibliotecas de estado global mais estáveis e confiáveis do mercado.** API
  estável, tipagem madura e histórico longo em apps de produção.
- **Mesmo sendo verbosa, é organizada.** Slice, action e selector ficam no mesmo lugar
  (`store/slices/teams-slice/`). Quem lê o store entende o que é global sem caçar
  `useState` espalhado.
- **Ótimo suporte da comunidade.** Documentação, DevTools e padrões prontos (selector
  primitivo, `configureStore`) reduzem decisão caseira.

Zustand cobriria este caso com menos cerimônia. O Toolkit entrou pela previsibilidade e
pelo suporte — o verboso aqui é um slice de uma string, custo aceitável.

## Consequências

- Duas bibliotecas de estado no app (React Query + Redux). O store permanece mínimo de
  propósito: se o dado veio da API, não é Redux.
- `useSelector` deve devolver primitivo. Selector que devolve objeto novo re-renderiza a
  cada dispatch; o React Compiler não cobre isso, porque o selector roda fora do render.
- O termo de busca só vira query depois de `useDebouncedValue`, senão sai uma requisição
  por tecla.
