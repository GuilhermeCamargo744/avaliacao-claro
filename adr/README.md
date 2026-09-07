# ADRs — Architecture Decision Records

Registro das decisões técnicas do projeto. Cada ADR é um arquivo numerado que descreve o
contexto, a decisão tomada, a justificativa e as consequências.

## Índice

| ADR | Título | Status |
| --- | ------ | ------ |
| [0001](0001-uso-do-npm-como-gerenciador-de-pacotes.md) | Uso do npm como gerenciador de pacotes | Aceito |
| [0002](0002-nestjs-como-framework-do-back-end.md) | NestJS como framework do back-end | Aceito |
| [0003](0003-postgresql-com-prisma-next.md) | PostgreSQL com Prisma Next | Aceito |
| [0004](0004-arquitetura-hexagonal-no-back-end.md) | Arquitetura hexagonal nos módulos do back-end | Aceito |
| [0005](0005-docker-compose-para-o-ambiente-local.md) | Docker Compose para o ambiente local | Aceito |

## Como adicionar uma nova decisão

1. Copie o [template.md](template.md) para `NNNN-titulo-em-kebab-case.md`, usando o próximo
   número da sequência.
2. Preencha as seções (contexto, decisão, justificativa e consequências).
3. Adicione a linha correspondente no índice acima.
4. Registre o resumo da decisão também no [README principal](../README.md).

Decisões não são apagadas: quando uma decisão é revista, o ADR antigo passa a
`Substituído por ADR NNNN` e um novo ADR é criado.
