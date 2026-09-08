# ADR 0007 — NativeWind para estilização

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

A avaliação pede React Native com TypeScript e **proíbe styled-components**. As opções
citadas são NativeWind, Dripsy e TailwindRN. Eu precisava de um tema semântico (fundo,
texto, acento, status) que funcionasse no nativo, em tamanhos de tela diferentes.

## Decisão

Estilos de tela usam **NativeWind 5** (Tailwind no React Native) com **tailwind-variants**
(`tv()`). As classes de cada tela moram em `view/styles.ts`; no JSX eu só chamo
`styles.slot()`. Cores vivem em tokens semânticos em `src/styles/theme.css`.

O pacote ainda é preview (`5.0.0-preview`). Entrei mesmo assim: é o caminho que o
ecossistema Expo está tomando, e o enunciado já apontava NativeWind.

## Justificativa

- **É a biblioteca que mais tem ganhado espaço no front.** O time já lê Tailwind;
  NativeWind leva isso ao React Native sem styled-components, que o enunciado proíbe.
- **Responsividade mais simples que StyleSheet ou Dripsy.** Espaçamento, flex e `pt-safe`
  ficam na classe. Dripsy puxaria um design system Theme UI; TailwindRN é a mesma ideia,
  com menos tração hoje.
- **Token semântico, não paleta crua.** `bg-surface` / `text-content-muted` em vez de
  `bg-gray-700`, para trocar o tema numa linha.

## Consequências

- `tv()` fica em escopo de módulo. Chamar dentro do render recria o cache do merger a
  cada vez. Slot raiz é `base`.
- Classe dinâmica (`bg-${cor}`) não é detectada pelo scanner e some sem erro — variants
  no `tv()` resolvem isso. Foi assim que o chip do time ganhou tom a partir do hex.
- `SafeAreaView` e `Modal` não têm interop: `className` neles é ignorado no nativo. Layout
  usa `pt-safe` / `pb-safe` numa `View` normal.
- `ScrollView` não aceita `items-*` nem `justify-*` no `className`; isso vai em
  `contentContainerClassName`.
- Preview: API ainda pode mudar. Aceitei o risco para esta avaliação; em produto eu
  travaria a versão com mais cuidado.
