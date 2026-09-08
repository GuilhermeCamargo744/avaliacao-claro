# ADR 0002 — NestJS como framework do back-end

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** back-end-team-management

## Contexto

O back-end precisa expor uma API REST com CRUD de times e tarefas, filtros, ordenação
e paginação, e a avaliação cobra clareza arquitetural. As alternativas consideradas
foram Express, Fastify e NestJS — todas viáveis em Node com TypeScript.

## Decisão

Escolhi o **NestJS 12** sobre Node 22, TypeScript `strict` e módulos ESM.

## Justificativa

- **Camadas explícitas sem convenção caseira.** A avaliação cobra clareza arquitetural.
  Módulo por domínio, injeção de dependência, pipes e filtro de exceção já vêm prontos.
  Com Express ou Fastify puros eu montaria isso à mão, e cada um resolveria de um jeito.
- **A injeção é o que viabiliza o [ADR 0004](0004-arquitetura-hexagonal-no-back-end.md).**
  Trocar o adaptador de persistência é reconfigurar um provider.
- **Teste integrado.** O `@nestjs/testing` monta o container com o repositório trocado —
  é assim que testo o caso de uso sem banco.

Fastify puro seria a escolha se a prioridade fosse latência bruta. Ele continua acessível:
o Nest troca o adaptador HTTP numa linha no `main.ts`.

## Consequências

- Mais cerimônia inicial: decorators e um arquivo de módulo por domínio. Aceitei porque
  o projeto cresce em número de domínios, não em um único arquivo.
- O projeto é **ESM nativo** (`"type": "module"`), porque os pacotes do Prisma Next só
  publicam `.mjs`. Isso obriga `module`/`moduleResolution` em `nodenext` e extensão
  `.js` explícita nos imports relativos.
- Por causa do ESM, o Jest roda com `NODE_OPTIONS=--experimental-vm-modules` e o
  `ts-jest` em modo `useESM`.
