# ADR 0002 — NestJS como framework do back-end

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** back-end-team-management

## Contexto

O back-end precisa expor uma API REST com CRUD de times e tarefas, filtros, ordenação
e paginação, e a avaliação cobra clareza arquitetural. As alternativas consideradas
foram Express, Fastify e NestJS — todas viáveis em Node com TypeScript.

## Decisão

Utilizamos o **NestJS 12** sobre Node 22, com TypeScript em modo `strict` e módulos ESM.

## Justificativa

- **As camadas ficam explícitas sem convenção caseira.** Módulos por domínio, injeção
  de dependência, pipes de validação e filtros de exceção já vêm prontos e padronizados.
  Com Express ou Fastify puros, tudo isso seria montado à mão e cada projeto resolveria
  de um jeito.
- **A injeção de dependência é o que viabiliza o [ADR 0004](0004-arquitetura-hexagonal-no-back-end.md).**
  Trocar o adaptador de persistência é reconfigurar um provider, não reescrever código.
- **Ferramental de teste integrado.** O `@nestjs/testing` monta o container de DI com
  dependências substituídas, que é como os casos de uso são testados sem banco.

Fastify puro seria a escolha se a prioridade fosse latência bruta ou se a API tivesse
poucos endpoints. Ele continua acessível: o Nest roda sobre o adaptador Fastify
trocando uma linha no `main.ts`.

## Consequências

- Mais cerimônia inicial: decorators e um arquivo de módulo por domínio. Trade-off
  aceito porque o projeto cresce em número de domínios.
- O projeto é **ESM nativo** (`"type": "module"`), porque os pacotes do Prisma Next só
  publicam `.mjs`. Isso obriga `module`/`moduleResolution` em `nodenext` e extensão
  `.js` explícita nos imports relativos do código-fonte.
- Como consequência do ESM, o Jest roda com `NODE_OPTIONS=--experimental-vm-modules` e
  o `ts-jest` em modo `useESM`.
