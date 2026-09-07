# ADR 0001 — Uso do npm como gerenciador de pacotes

- **Status:** Aceito
- **Data:** 2026-09-06
- **Escopo:** Monorepo (`app-team-management` e `back-end-team-management`)

## Contexto

O monorepo tem dois projetos JavaScript/TypeScript (app mobile em Expo e API em NestJS)
e precisa de um gerenciador de pacotes único para instalar dependências e rodar scripts.
As alternativas consideradas foram npm, yarn e pnpm.

## Decisão

Utilizamos o **npm** como gerenciador de pacotes dos dois projetos.

## Justificativa

- **Facilidade:** o npm já vem instalado junto com o Node.js, então todo desenvolvedor
  JavaScript o tem disponível na máquina — não exige instalação nem configuração extra
  para rodar o projeto.
- **Versatilidade:** cobre bem as necessidades do projeto (instalação de dependências,
  scripts, `npx`) sem adicionar uma ferramenta a mais na stack.
- **Onboarding:** qualquer pessoa clona o repositório e roda `npm install` sem passos
  prévios.

## Consequências

- Os comandos documentados no README usam `npm install` / `npm run`.
- O lockfile oficial é o `package-lock.json`; não versionamos `yarn.lock` nem `pnpm-lock.yaml`.
- Abrimos mão de ganhos de performance e de economia de disco que pnpm ou yarn poderiam
  trazer — trade-off aceito em favor da simplicidade.
