# ADR 0003 — PostgreSQL com Prisma Next

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** back-end-team-management

## Contexto

A escolha da persistência ficou em aberto na avaliação. O domínio tem duas entidades
(times e tarefas) com um relacionamento muitos-para-muitos entre elas, e a listagem de
tarefas precisa de filtros, ordenação e paginação. Também é exigida reprodutibilidade
local — quem clona o repositório precisa chegar ao mesmo schema.

## Decisão

Utilizamos **PostgreSQL 17** como banco e **Prisma Next (Prisma 8)** como camada de dados.

## Justificativa

- **O relacionamento é relacional.** Uma tarefa pertence a zero ou mais times; o banco
  garante a integridade com chave estrangeira e `ON DELETE CASCADE`, em vez de deixar
  isso na mão da aplicação.
- **Filtro, ordenação e paginação são o trabalho nativo de um banco relacional.** Índices
  em `status`, `dueDate` e `name` cobrem os acessos previstos.
- **O cliente é tipado a partir do schema.** O Prisma gera os tipos do contrato, então
  um nome de coluna errado quebra no `tsc` e não em produção.
- **As migrations são versionadas e verificáveis.** Cada migration é um pacote com hash
  de conteúdo, e o banco guarda um marcador com o hash do contrato aplicado — o que
  permite detectar drift entre código e banco (`prisma db verify`).

SQLite foi descartado por não representar bem o ambiente de produção; MongoDB, por
tornar manual a integridade de um relacionamento que é naturalmente relacional.

## Modelo de dados

```
Team ──< TaskTeam >── Task
```

- **Team** — `id` (uuid), `name`, `colorHex`, `description?`, `createdAt`, `updatedAt`.
- **Task** — `id` (uuid), `title`, `description?`, `status`, `dueDate?`, `createdAt`,
  `updatedAt`.
- **TaskTeam** — tabela de junção com chave primária composta (`taskId`, `teamId`) e
  cascade nas duas pontas.

`status` é um enum (`pending`, `in_progress`, `done`) armazenado como texto e protegido
por uma constraint `CHECK` gerada pelo próprio Prisma. A junção é explícita porque o
Prisma Next não aceita muitos-para-muitos implícito — e ela é o lugar natural para
atributos do vínculo, caso apareçam depois.

O schema é declarado em `src/prisma/contract.prisma`; `contract.json` e `contract.d.ts`
são gerados por `prisma contract emit` e versionados junto.

## Consequências

- O Prisma 8 está em **release candidate**. O ganho de tipagem e de verificação de drift
  compensou o risco, mas o vocabulário mudou em relação ao Prisma 6/7: `prisma migrate dev`
  não existe mais, e o par equivalente é `migration plan` + `db migrate`.
- **As migrations não são mais arquivos `.sql`.** Cada uma é um pacote com `migration.ts`
  (fonte renderizada pelo framework), `ops.json` (as operações, com o SQL dentro) e
  `migration.json` (manifesto e hash). Editar o `.ts` exige re-emitir o pacote, senão o
  `db migrate` falha com `MIGRATION.HASH_MISMATCH`.
- Os pacotes do Prisma Next são ESM puro, o que fixa o formato de módulo do projeto
  (ver [ADR 0002](0002-nestjs-como-framework-do-back-end.md)).
- O banco ganha um schema extra, `prisma_contract`, com a tabela de marcador. Ela não é
  do domínio e não deve ser editada à mão.
