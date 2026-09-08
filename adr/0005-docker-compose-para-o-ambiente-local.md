# ADR 0005 — Docker Compose para o ambiente local

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** back-end-team-management

## Contexto

A API precisa de PostgreSQL ([ADR 0003](0003-postgresql-com-prisma-next.md)), e a
avaliação pede que o projeto suba a partir do README. Depender de um Postgres instalado
na máquina de quem avalia significa versão divergente, credenciais diferentes e um passo
a mais. O enunciado não fixou a versão; subi **17** (imagem `postgres:17-alpine`) porque
é a linha atual e cobre o que o Prisma pede.

## Decisão

O ambiente local sobe com **Docker Compose**: serviço `postgres` (`postgres:17-alpine`) e
serviço `api`, a partir de um `Dockerfile` multi-stage. Quem avalia não instala Postgres
na máquina.

## Justificativa

- **Um comando.** `npm run db:up` levanta banco e API com as credenciais que o
  `.env.example` já documenta.
- **Ordem garantida.** O serviço `api` declara `depends_on: condition: service_healthy`, e
  o Postgres tem um healthcheck com `pg_isready`. Sem isso a API sobe antes de o banco
  aceitar conexão e falha por corrida.
- **A mesma imagem serve para deploy.** O build multi-stage compila num estágio e copia só
  `dist` e as dependências de produção para a imagem final, que roda como usuário `node`.

## Consequências

- Docker passa a ser pré-requisito para rodar o projeto. Quem preferir um Postgres local
  só precisa apontar a `DATABASE_URL`; a aplicação não sabe a diferença.
- O `package-lock.json` **precisa estar versionado**, porque a imagem instala com `npm ci`.
  Isso reforça o que o [ADR 0001](0001-uso-do-npm-como-gerenciador-de-pacotes.md) já
  definia, e o arquivo foi retirado do `.gitignore`, onde estava por engano.
- O `npm ci` da imagem roda com `--ignore-scripts` (o `postinstall` é ferramenta de
  desenvolvimento) e `--no-optional`, porque o lockfile gerado no macOS não descreve o
  subgrafo dos binários opcionais de outras plataformas.
- Os dados ficam num volume nomeado e sobrevivem ao `db:down`; apagar de verdade é
  `docker compose down -v`.
- As migrations continuam sendo aplicadas a partir da máquina do desenvolvedor
  (`npm run db:migrate`), porque o CLI do Prisma é dependência de desenvolvimento e não
  entra na imagem final.
