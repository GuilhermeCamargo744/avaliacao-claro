# ADR 0004 — Arquitetura hexagonal nos módulos do back-end

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** back-end-team-management

## Contexto

O scaffold do Nest gera um módulo com controller e service lado a lado, e o service
conversando direto com o banco. Isso funciona, mas amarra a regra de negócio ao ORM: o
caso de uso só é testável com um banco de pé, e trocar a persistência significa reescrever
o service.

Como o Prisma 8 ainda é release candidate ([ADR 0003](0003-postgresql-com-prisma-next.md)),
o custo de estar preso a ele é concreto, não hipotético.

## Decisão

Cada módulo de domínio do back-end segue **portas e adaptadores** (arquitetura hexagonal),
em três camadas:

```
src/teams/
├── domain/           entidade e a porta (interface do repositório)
├── application/      casos de uso
├── infrastructure/   adaptadores: Prisma (saída) e controller HTTP (entrada)
└── teams.module.ts   liga a porta ao adaptador
```

A regra de dependência aponta para dentro: `domain` não importa nada, `application`
importa `domain`, `infrastructure` importa os dois.

## Justificativa

- **O caso de uso não conhece o Prisma.** O `TeamsService` depende da interface
  `TeamRepository`; o `PrismaTeamRepository` é um detalhe de infraestrutura.
- **Testes sem banco.** O teste do service injeta um repositório em memória de poucas
  linhas — sem mock framework, sem container, sem fixture.
- **A troca de persistência é local.** O único ponto que conhece as duas pontas é o
  módulo: `{ provide: TEAM_REPOSITORY, useClass: PrismaTeamRepository }`.

## Consequências

- Mais arquivos por módulo. Para um CRUD pequeno isso parece excesso; o retorno aparece
  quando a regra de negócio cresce ou quando o adaptador precisa mudar.
- A porta precisa de um **token de injeção** (`TEAM_REPOSITORY`), porque interfaces do
  TypeScript não existem em tempo de execução e o Nest não consegue resolvê-las sozinho.
- O módulo `teams` é a referência: `tasks` deve seguir a mesma divisão.
