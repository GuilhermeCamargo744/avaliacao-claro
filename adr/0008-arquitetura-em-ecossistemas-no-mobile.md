# ADR 0008 — Arquitetura em ecossistemas no mobile

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

O Expo Router trata cada arquivo em `src/app/` como rota. Se a tela inteira morar ali,
navegação, formulário e chamada de API ficam no mesmo arquivo — difícil de manter e fácil
de romper a hierarquia (view falando com axios, rota carregando regra de negócio).

## Decisão

O app é organizado em **ecossistemas**. Cada domínio tem a sua região:

```
src/screens/teams/          criar e editar time
src/screens/team-tasks/     listar, criar, ver e editar tarefa
src/screens/home/           lista de times
```

Dentro de cada tela, a responsabilidade é de um arquivo só:

```
index.tsx        container: chama o hook e espalha no view
use-[tela].ts    lógica (form, mutation, navegação)
schema.ts        zod, quando há formulário
view/            só apresentação + styles.ts
```

A lógica não entra na view. A view não rompe camada: não chama API, não conhece o store.
O `src/app/` só reexporta a tela.

O que nasce numa tela e passa a ser usado por uma segunda **sobe** para a camada global,
sem pular hierarquia:

- `src/components/` — UI compartilhada
- `src/hooks/` — React Query e hooks de app
- `src/models/` — chamadas HTTP e mapeamento da API

## Justificativa

- **Cada ecossistema tem a sua região.** Times e tarefas não se misturam em pastas; achar
  a tela de editar time é abrir `screens/teams/edit-team/`.
- **Manutenção mais fácil.** Um arquivo, uma responsabilidade: o view só desenha, o hook
  só decide, o model só fala com o servidor.
- **A hierarquia não se rompe.** A view recebe props; o hook usa models via hooks globais;
  o `app/` não guarda provider nem helper. Camadas globais existem justamente para
  integrar o que é compartilhado, não para a tela importar o axios direto.

## Consequências

- Mais arquivos por tela (quatro ou cinco em vez de um). Trade-off aceito porque as telas
  já divergem em loading, exclusão e teclado.
- Todo `.tsx` em `src/app/` vira rota — por isso o trio não mora lá.
- Formulário em React Native usa `<Controller>`. `register` depende de eventos de DOM e
  não funciona com `TextInput`.
