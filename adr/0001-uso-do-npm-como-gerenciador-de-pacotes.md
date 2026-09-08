# ADR 0001 — Uso do npm como gerenciador de pacotes

- **Status:** Aceito
- **Data:** 2026-09-06
- **Escopo:** Monorepo (`app-team-management` e `back-end-team-management`)

## Contexto

O monorepo tem dois projetos JavaScript/TypeScript (app mobile em Expo e API em NestJS)
e precisa de um gerenciador de pacotes único para instalar dependências e rodar scripts.
As alternativas consideradas foram npm, yarn e pnpm.

## Decisão

Optei pelo **npm** nos dois projetos do monorepo.

## Justificativa

- **Facilidade.** O npm já vem com o Node.js. Quem avalia não precisa instalar yarn nem
  pnpm só para clonar e rodar.
- **Versatilidade.** `npm install`, `npm run` e `npx` cobrem o que o projeto pede.
- **Onboarding.** Pensei no testador: um gerenciador a menos na lista de pré-requisitos.

Yarn e pnpm trariam lockfile mais previsível ou disco menor. Abri mão disso de propósito.

## Consequências

- Os comandos do README usam `npm install` / `npm run`.
- O lockfile oficial é o `package-lock.json`; não versiono `yarn.lock` nem `pnpm-lock.yaml`.
- Abri mão de performance e economia de disco que pnpm ou yarn poderiam trazer — o
  trade-off foi simplicidade para quem avalia.
