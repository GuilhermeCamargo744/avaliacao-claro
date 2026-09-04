# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v57.0.0/ before writing any code.

## Estilos de tela (`src/screens/`)

Cada tela é um trio `index.tsx` (container) + `use-<screen>.ts` (hook) +
`view/<screen>-view.tsx` (apresentação). As classes NativeWind da view moram em
`view/styles.ts`, **nunca inline no JSX**.

`view/styles.ts` exporta um único `tv()` com slots, nomeado `<screen>Styles`:

```ts
import { tv } from 'tailwind-variants';

export const homeStyles = tv({
  slots: {
    base: 'flex-1 items-center justify-center gap-2 bg-background p-4',
    title: 'text-2xl font-semibold text-text',
  },
});
```

A view consome chamando o factory no corpo do componente:

```tsx
export const HomeView = () => {
  const styles = homeStyles();
  return <View className={styles.base()} />;
};
```

Regras:

- **`tv()` é sempre chamado em escopo de módulo.** Chamar dentro do componente recria o
  cache do merger a cada render — o React Compiler não evita isso. Já `homeStyles()` no
  corpo do componente é memoizado pelo compiler (não tem dependência reativa) e continua
  funcionando quando a tela ganhar variants.
- **Toda classe é um literal completo.** `` `bg-${cor}` `` não é detectado pelo scanner do
  Tailwind e o estilo some sem erro. Use `variants` para alternar.
- **Slot raiz sempre `base`**; os demais com nome semântico (`title`, `emptyState`).
- **Nunca nomeie um slot ou valor de variant como um utilitário Tailwind** (`container`,
  `flex`, `border`, `rounded`, `shadow`, `hidden`, `absolute`, `truncate`…): o scanner lê
  as chaves do objeto e gera regras CSS mortas. É por isso que o slot raiz é `base`.
- `styles.ts` guarda só classe estática. Valor calculado em runtime (medida de layout,
  valor animado, aritmética com `Spacing`) continua em `style={}`.
- **Override de classe passa por `styles.slot({ class: className })`**, nunca por
  concatenação em template string: o `react-native-css` ordena as regras por índice na
  stylesheet, não pela ordem da string, então `"bg-red-500 bg-background"` não é
  "o último vence". O merger do `tv` é o que restaura essa semântica.
- `tailwind-variants@3` traz o merger embutido — **não** instale `tailwind-merge`.
- Se `src/global.css` ganhar um token `--text-*`, `--font-*`, `--leading-*` ou
  `--tracking-*`, crie `src/styles/tv.ts` com
  `createTV({ twMergeConfig: { extend: { theme: … } } })` e importe `tv` de lá. Sem isso o
  merger trata `text-title` como cor (fallback `isAny`) e o descarta ao lado de
  `text-text` — o heading perde o tamanho silenciosamente.

`src/components/` continua em `StyleSheet.create` + `useTheme()` + `Spacing`. Não misture
as duas stacks no mesmo componente. Atenção: `ThemedText` / `ThemedView` / `HintRow` **não
aceitam nem repassam `className`**, então apontar um slot `tv` para eles é no-op silencioso.
