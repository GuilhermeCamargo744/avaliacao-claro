# app-team-management

Expo SDK 57, React Native 0.86, React 19 com React Compiler ligado, expo-router com
typedRoutes, TypeScript strict. Alias `@/*` → `./src/*`.

O Expo mudou bastante: leia a doc da versão exata em
https://docs.expo.dev/versions/v57.0.0/ antes de escrever código.

## Arquitetura

```
src/
  app/                        rotas do expo-router, só um wrapper fino da tela
  screens/[feature]/
    index.tsx                 container: chama o hook e espalha no view
    use-[feature].ts          lógica da tela
    view/
      [feature]-view.tsx      só apresentação, sem lógica
      styles.ts
    components/               componentes usados só nesta tela
    hooks/                    lógicas grandes que poluiriam o use-[feature]
      use-query-[feature].ts  react query das chamadas locais da tela
    model/[feature]/
      [metodo]-[feature].ts   chamadas de API exclusivas desta tela
      interface-[feature].ts
  models/                     chamadas de API reutilizáveis entre telas
    server-config.ts
    [feature]/
      [metodo]-[feature].ts
      interface-[feature].ts
  hooks/                      hooks reutilizáveis no app inteiro
    use-query-[feature].ts
  store/
    store.ts
    slices/[feature]-slice/
      [feature]-slice.ts
      interface-[feature]-slice.ts
  components/                 componentes compartilhados
  constants/
  styles/
```

Regra de promoção: componente, hook e chamada nascem dentro da tela. Quando uma segunda
tela precisar, sobem para a camada global. `teams` já nasceu em `src/models/` porque home
e create-new-team usam.

A view não tem lógica nem estado — nem dado de exemplo. Recebe tudo por props do
`index.tsx`, que só espalha o retorno do hook. A view declara o próprio `Props`; é o
espalhamento no container que valida o contrato.

## Camada de dados

React Query é dono do estado de servidor. Redux é dono de estado de UI global (hoje só o
termo de busca). Não duplique dado de servidor no store.

`models/` é camada anticorrupção: converte o formato do back-end para o do app e monta o
corpo da requisição campo a campo. Tela e hook nunca falam com o axios direto.

`server-config.ts` resolve a baseURL nesta ordem: `EXPO_PUBLIC_API_URL`, senão o host do
Metro via `Constants.expoConfig.hostUri` (é o que faz aparelho físico funcionar sem
configurar nada), senão `localhost`. Depois de editar o `.env`, rode `npx expo start -c`:
o Metro cacheia o valor inlined. Escreva `process.env.EXPO_PUBLIC_*` como acesso literal —
desestruturar devolve `undefined` em release.

### Back-end (NestJS em :3000)

- Datas vêm como timestamptz cru do Postgres (`2026-09-07 19:20:59.371063+00`), não
  ISO-8601. Passe por `toIsoTimestamp` ou o Hermes devolve `Invalid Date`.
- `forbidNonWhitelisted` está ligado: qualquer campo a mais no corpo vira 400. Monte o
  body campo a campo, nunca espalhe o estado do formulário.
- Erro sempre `{ error: { code, message, details? } }`. O interceptor já extrai o `message`.
- Sem CORS. Expo Web não consegue chamar a API; nativo não é afetado.
- `GET /teams` e `GET /tasks` respondem `{ data, meta }`. O `models/` desembrulha e o resto
  do app continua vendo array. Times já vêm ordenados por nome, então não ordene de novo.
- **Filtro e busca são sempre do servidor**, nas duas features. `GET /teams` aceita
  `search` (nome e descrição), `limit` e `offset`; `GET /tasks` aceita `teamId`, `status`,
  `search`, `sort`, `order`, `limit` e `offset`. Campo de busca passa por
  `useDebouncedValue` antes de virar query, senão sai uma requisição por tecla.
- Tarefa tem N:N com time (`teams[]` na resposta, `teamIds[]` no corpo).
- `colorHex` é `#RRGGBB` livre, o app usa tom da paleta. `constants/team-colors.ts` faz as
  duas conversões, com fallback para cor fora da paleta.

## Formulários

Todo formulário usa **react-hook-form** com **zod** via `@hookform/resolvers/zod`. Nada de
`useState` por campo nem validação escrita na mão.

O schema mora em `screens/[feature]/schema.ts` e é a única fonte da verdade das regras:

```ts
export const createTeamSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
});

export type CreateTeamForm = z.infer<typeof createTeamSchema>;
```

O `useForm` fica no `use-[feature].ts`, que devolve `control`, `errors` e o `onSubmit` já
com `handleSubmit` aplicado. A view continua sem lógica: recebe `control` e renderiza os
campos com `<Controller>`.

- Em React Native use sempre `<Controller>`. `register` depende de eventos de DOM e não
  funciona com `TextInput`.
- O schema espelha a validação do back-end (`name` ≥ 3, `colorHex` `#RRGGBB`). Quando as
  regras divergirem, o servidor manda: ele devolve o erro em `details[]`.
- Mensagem de erro vem do zod, em português, junto do campo. Erro que só o servidor sabe
  (conflito, indisponibilidade) continua em `errorMessage` na tela.
- `zodResolver` no `useForm`, e `mode: 'onTouched'` para não acusar erro antes de o usuário
  mexer no campo.

## Estilos

As classes NativeWind da view moram em `view/styles.ts`, nunca inline no JSX. O arquivo
exporta um `tv()` com slots, nomeado `<feature>Styles`:

```ts
export const homeStyles = tv({
  slots: {
    base: 'flex-1 bg-background px-6',
    title: 'text-2xl font-bold text-content',
  },
});
```

A view chama o factory no corpo do componente: `const styles = homeStyles()`.

- `tv()` sempre em escopo de módulo. Dentro do componente recria o cache do merger a cada
  render, e o React Compiler não evita isso.
- Toda classe é literal completo. `` `bg-${cor}` `` não é detectado pelo scanner do
  Tailwind e o estilo some sem erro — use `variants`.
- Slot raiz sempre `base`, os demais com nome semântico (`title`, `emptyState`).
- Nunca nomeie slot ou valor de variant como utilitário Tailwind (`container`, `flex`,
  `border`, `rounded`, `shadow`, `hidden`, `absolute`, `truncate`): o scanner lê as chaves
  do objeto e gera CSS morto. É por isso que o slot raiz é `base`.
- `styles.ts` guarda só classe estática. Valor calculado em runtime continua em `style={}`.
- Override de classe passa por `styles.slot({ class: className })`, nunca por concatenação:
  o react-native-css ordena as regras por índice na stylesheet, não pela ordem da string,
  então `"bg-red-500 bg-background"` não é "o último vence". O merger do `tv` é o que
  restaura essa semântica.
- `tailwind-variants@3` traz o merger embutido. Não instale `tailwind-merge`.
- Se `styles/theme.css` ganhar token `--text-*`, `--font-*`, `--leading-*` ou `--tracking-*`,
  crie `src/styles/tv.ts` com `createTV({ twMergeConfig: { extend: { theme: … } } })` e
  importe `tv` de lá. Sem isso o merger trata `text-title` como cor e descarta ao lado de
  `text-content`.

### Cores

Todas em `src/styles/theme.css`, em duas camadas: paleta base (`@theme`) com os tons crus e
tokens semânticos (`@theme inline`) com o papel da cor. Use sempre o semântico
(`bg-surface`, `text-content-muted`), nunca a paleta crua (`bg-gray-700`).

A paleta de times está duplicada em `constants/team-colors.ts` porque os hex precisam ir
para a API. Mudou num, muda no outro.

`src/components/` legado (`ThemedText`, `ThemedView`, `HintRow`) usa `StyleSheet.create` +
`useTheme()` e **não aceita nem repassa `className`** — apontar um slot `tv` para eles é
no-op silencioso.

## Armadilhas que já custaram debug

- **Não use `SafeAreaView` para layout.** Não é interop'd pelo react-native-css, então
  `className` nele é ignorado no nativo (na web funciona por acidente, o react-native-web
  repassa a prop pro DOM). Pior: ele escreve os insets como style inline e sobrescreve
  qualquer classe de padding. Use `pt-safe` / `pb-safe` / `px-safe` numa `View` normal.
- **`Modal` também não tem interop.** `className` só nas `View`s de dentro.
- **Componente de terceiro que precisa de `className` passa por `styled`** (de `nativewind`),
  como em `components/icon.tsx`. Mapeie para `style` (`{ className: 'style' }`), não para
  uma prop via `nativeStyleMapping`: esse campo só existe no nativo e na web é ignorado.
- **Não use `w-full` em filho de coluna flex.** O RN já estica os filhos e o `width: 100%`
  resolve contra a caixa errada, estourando o padding do pai.
- **Nunca ordene o array que veio do `useQuery`.** `data.sort()` muta o cache in-place e,
  com o React Compiler ligado, isso vira memo velha sem aviso. Ordene o array que o
  `filter` já alocou.
- **`useSelector` deve devolver primitivo.** Selector que devolve objeto novo re-renderiza
  a cada dispatch, e o compiler não conserta — ele roda fora da memoização do render.
- **`ScrollView` não aceita `items-*` nem `justify-*` no `className`.** O RN lança
  Invariant Violation exigindo que isso vá no `contentContainerClassName`. O
  react-native-web não valida, então o erro só aparece no device — verificação por web
  não pega. Regra: `className` leva só `flex-1`, o resto vai no container (com `grow`,
  senão o `justify-center` não tem efeito).
- **Todo `.tsx` em `src/app/` vira rota.** Provider e helper não moram lá.
- **O layout raiz precisa renderizar um navegador** (`<Stack>`/`<Slot>`), senão as rotas não
  montam e a tela fica branca.

## Estilo de código

Kebab-case nos arquivos, export nomeado (default só nas rotas em `src/app/`), 2 espaços,
aspas simples, ponto e vírgula. Imports em três grupos separados por linha em branco:
externos, relativos, alias `@/`.

Código simples e direto, sem comentário explicando o óbvio. Comentário só onde apagar
convida um bug — hoje são três: o parse de data, o `networkMode` do React Query e o
espelho da paleta.
