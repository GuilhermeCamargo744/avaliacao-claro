# avaliacao-claro

Monorepo da avaliação Claro, com o app mobile (Expo) e o back-end (NestJS).

## Estrutura

```
avaliacao-claro/
├── adr/                        # Registro das decisões técnicas (ADRs)
├── app-team-management/        # App mobile (Expo + React Native)
└── back-end-team-management/   # API (NestJS)
```

## App mobile

```bash
cd app-team-management
npm install
npx expo start
```

## Back-end

A API depende de um PostgreSQL 15+. O `docker-compose.yml` sobe o banco e a API
juntos, então o caminho mais curto é:

```bash
cd back-end-team-management
cp .env.example .env
npm run db:up          # sobe Postgres e API (docker compose up -d)
npm install            # dependências locais, para rodar o CLI do Prisma
npm run db:migrate     # aplica as migrations no banco
```

A API fica em `http://localhost:3000` e o Postgres em `localhost:5432`.
Para derrubar tudo: `npm run db:down` (o volume com os dados é preservado;
`docker compose down -v` apaga também os dados).

### Rodando a API fora do container

Útil no dia a dia, com hot reload. Deixe só o banco no Docker:

```bash
cd back-end-team-management
docker compose up -d postgres
npm install
npm run db:migrate
npm run start:dev
```

> O CLI do Docker do Docker Desktop fica em `~/.docker/bin`. Se `docker` não for
> encontrado no terminal, adicione `export PATH="$HOME/.docker/bin:$PATH"` ao seu
> `~/.zshrc` (ou habilite *Settings → Advanced → Install CLI tools* no app).

### Banco de dados

O schema é declarado em `src/prisma/contract.prisma` (Prisma Next + PostgreSQL).
Ao alterá-lo:

```bash
npm run db:emit                     # regenera contract.json e contract.d.ts
npm run db:plan -- --name <slug>    # cria a migration em migrations/app/
npm run db:migrate                  # aplica no banco
```

As migrations são versionadas no repositório: quem clona o projeto sobe o
container e roda `db:migrate` para chegar exatamente ao mesmo schema.

### Erros da API

Toda falha responde com o mesmo envelope:

```json
{ "error": { "code": "BAD_REQUEST", "message": "Os dados enviados são inválidos", "details": ["name deve ter no mínimo 3 caracteres"] } }
```

| Situação | Status | `code` |
| --- | --- | --- |
| Corpo inválido ou campo desconhecido | 400 | `BAD_REQUEST` |
| `id` fora do formato UUID | 400 | `BAD_REQUEST` |
| Recurso não encontrado | 404 | `NOT_FOUND` |
| Falha inesperada | 500 | `INTERNAL_SERVER_ERROR` |

`details` só aparece em erro de validação, com uma mensagem por campo. Em falhas
inesperadas o cliente recebe uma mensagem genérica e o motivo real vai para o log do
servidor — detalhe interno não vaza na resposta.

## Decisões do projeto

Registro das decisões técnicas tomadas ao longo do desenvolvimento, com o motivo por trás de cada uma.
O detalhamento de cada decisão fica em [`adr/`](adr/) (Architecture Decision Records).

### 1. Gerenciador de pacotes: npm

Optamos pelo **npm** como gerenciador de pacotes dos dois projetos do monorepo.

**Motivo:** facilidade e versatilidade. O npm já vem instalado junto com o Node.js, então todo desenvolvedor JavaScript o tem disponível na máquina — não exige nenhuma instalação ou configuração extra para rodar o projeto.

Detalhes: [ADR 0001](adr/0001-uso-do-npm-como-gerenciador-de-pacotes.md)

### 2. Framework do back-end: NestJS

A API é um **NestJS 12** sobre Node 22, em TypeScript `strict` e ESM.

**Motivo:** a avaliação cobra clareza arquitetural, e o Nest entrega módulos por domínio,
injeção de dependência, pipes de validação e ferramental de teste já padronizados — com
Express ou Fastify puros, cada um desses pontos viraria convenção caseira. A injeção de
dependência também é o que sustenta a arquitetura hexagonal descrita adiante. O custo
aceito é a cerimônia de decorators e um módulo por domínio.

Detalhes: [ADR 0002](adr/0002-nestjs-como-framework-do-back-end.md)

### 3. Persistência: PostgreSQL com Prisma Next

O banco é **PostgreSQL 17** e a camada de dados é o **Prisma Next (Prisma 8)**.

**Motivo:** o domínio é relacional — uma tarefa pertence a zero ou mais times, e o banco
garante essa integridade com chave estrangeira e cascade em vez de deixá-la na aplicação.
Filtro, ordenação e paginação são o trabalho natural de um banco relacional, e o Prisma
gera o cliente tipado a partir do schema, então erro de coluna quebra no `tsc`. As
migrations são versionadas com hash de conteúdo e o banco guarda o hash do contrato
aplicado, o que permite detectar divergência entre código e banco.

**Modelo de dados:** `Team ──< TaskTeam >── Task`. A junção é explícita (o Prisma Next não
aceita muitos-para-muitos implícito) e tem chave primária composta com cascade nas duas
pontas. O `status` da tarefa é um enum (`pending`, `in_progress`, `done`) protegido por
`CHECK` no banco.

Detalhes e o modelo completo: [ADR 0003](adr/0003-postgresql-com-prisma-next.md)

### 4. Organização do back-end: arquitetura hexagonal

Cada módulo de domínio é dividido em `domain` (entidade e porta), `application` (casos de
uso) e `infrastructure` (adaptadores Prisma e HTTP), com as dependências apontando sempre
para dentro.

**Motivo:** manter a regra de negócio livre do ORM. O caso de uso depende de uma interface
de repositório, não do Prisma, o que torna o teste possível com um repositório em memória
— sem banco e sem mock framework — e reduz a troca de persistência a uma linha no módulo.
Isso pesa porque o Prisma 8 ainda é release candidate. O custo aceito é o número maior de
arquivos por módulo.

Detalhes: [ADR 0004](adr/0004-arquitetura-hexagonal-no-back-end.md)

### 5. Ambiente local: Docker Compose

Banco e API sobem juntos com `docker compose`, a partir de um `Dockerfile` multi-stage.

**Motivo:** reprodutibilidade. Quem avalia roda um comando e recebe a mesma versão de
Postgres com as mesmas credenciais, sem instalar nada além do Docker. O serviço da API só
inicia depois do healthcheck do banco, o que elimina a corrida entre os dois.

Detalhes: [ADR 0005](adr/0005-docker-compose-para-o-ambiente-local.md)
