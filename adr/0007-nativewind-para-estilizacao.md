# ADR 0007 — NativeWind para estilização

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

A avaliação pede React Native com TypeScript e **proíbe styled-components**. As opções
citadas são NativeWind, Dripsy e TailwindRN. O app precisa de um tema semântico (fundo,
texto, acento, status) que funcione no nativo, em tamanhos de tela diferentes.

## Decisão

Estilos de tela usam **NativeWind 5** (Tailwind no React Native) com **tailwind-variants**
(`tv()`). As classes de cada tela moram em `view/styles.ts`, nunca inline no JSX. Cores
vivem em tokens semânticos em `src/styles/theme.css`.

## Justificativa

- **É uma biblioteca que vem ganhando força no front-end.** O ecossistema Tailwind é o
  que a maior parte do time de front já lê; NativeWind leva isso para o React Native sem
  uma API de styled-components, que o enunciado descarta.
- **A responsividade é mais fácil de manipular do que nas alternativas.** Utilitários de
  espaçamento, flex e quebra (`flex-1`, `gap-*`, `pt-safe`) ficam na classe, não espalhados
  em `StyleSheet` ou em props de tema. Dripsy exigiria um design system Theme UI; o
  TailwindRN é a mesma ideia, com menos tração hoje.
- **Token semântico, não paleta crua.** `bg-surface` / `text-content-muted` em vez de
  `bg-gray-700`, para trocar o tema numa linha.

## Consequências

- `tv()` fica em escopo de módulo. Chamar dentro do render recria o cache do merger a
  cada vez. Slot raiz é `base`.
- Classe dinâmica (`bg-${cor}`) não é detectada pelo scanner e some sem erro — variants
  no `tv()` resolvem isso.
- `SafeAreaView` e `Modal` não têm interop: `className` neles é ignorado no nativo. Layout
  usa `pt-safe` / `pb-safe` numa `View` normal.
- `ScrollView` não aceita `items-*` nem `justify-*` no `className`; isso vai em
  `contentContainerClassName`.
