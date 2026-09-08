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
npm run db:only              # sobe só o Postgres
npm install
npm run db:migrate
npm run start:dev
```

Se a API do Docker já estiver no ar (de um `npm run db:up` anterior), pare-a com
`docker compose stop api` antes.

Os dois modos disputam a porta 3000, então só um pode estar no ar por vez. Se o
`start:dev` falhar com `EADDRINUSE`, é o container da API que está ocupando a porta.

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

### Dados iniciais

```bash
npm run seed
```

Popula o banco com 3 times e 10 tarefas — status variados, tarefas em mais de um time e
uma sem time nenhum, para exercitar os filtros. O script **apaga tarefas e times antes de
inserir**, então rodar duas vezes deixa sempre o mesmo resultado. Não rode contra um banco
com dados que você queira manter.

### Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| POST | `/teams` | Cria um time |
| GET | `/teams` | Lista os times |
| GET | `/teams/:id` | Busca um time |
| PATCH | `/teams/:id` | Atualiza um time |
| DELETE | `/teams/:id` | Remove um time (204) |
| POST | `/tasks` | Cria uma tarefa, opcionalmente vinculada a times |
| GET | `/tasks` | Lista as tarefas, com filtros e paginação |
| GET | `/tasks/:id` | Busca uma tarefa |
| PATCH | `/tasks/:id` | Atualiza a tarefa (inclusive o status e os times) |
| DELETE | `/tasks/:id` | Remove uma tarefa (204) |

`GET /teams` aceita `search` (nome e descrição), `limit` (1–100, padrão 20) e `offset`
(padrão 0), e devolve os times ordenados por nome.

`GET /tasks` aceita `teamId`, `status` (`pending` \| `in_progress` \| `done`), `search`
(procura em título e descrição), `sort` (`createdAt` \| `dueDate` \| `title`), `order`
(`asc` \| `desc`), `limit` (1–100, padrão 20) e `offset` (padrão 0).

As duas listagens respondem com o mesmo envelope de paginação:

```json
{ "data": [ ... ], "meta": { "total": 42, "limit": 20, "offset": 0 } }
```

Cada tarefa carrega os times vinculados já com a cor, para o app desenhar o chip sem uma
segunda chamada:

```json
{ "id": "...", "title": "Ajustar layout", "status": "pending", "dueDate": null,
  "teams": [{ "id": "...", "name": "Time Alpha", "colorHex": "#2563EB" }] }
```

### Exemplos de requisições

Com a API no ar em `http://localhost:3000`:

```bash
# criar um time
curl -X POST http://localhost:3000/teams \
  -H 'Content-Type: application/json' \
  -d '{"name":"Time Alpha","colorHex":"#2563EB","description":"Squad de produto"}'

# listar, com busca e paginação
curl "http://localhost:3000/teams?search=produto&limit=20&offset=0"

# buscar por id
curl http://localhost:3000/teams/<id>

# atualizar
curl -X PATCH http://localhost:3000/teams/<id> \
  -H 'Content-Type: application/json' \
  -d '{"name":"Time Beta"}'

# remover (204, sem corpo)
curl -X DELETE http://localhost:3000/teams/<id>
```

```bash
# criar uma tarefa vinculada a um time
curl -X POST http://localhost:3000/tasks \
  -H 'Content-Type: application/json' \
  -d '{"title":"Ajustar layout","description":"chip de cor","teamIds":["<teamId>"]}'

# listar com filtro, busca, ordenação e paginação
curl "http://localhost:3000/tasks?teamId=<teamId>&status=pending&search=layout&sort=title&order=asc&limit=20&offset=0"

# marcar como concluída
curl -X PATCH http://localhost:3000/tasks/<id> \
  -H 'Content-Type: application/json' \
  -d '{"status":"done"}'

# trocar os times da tarefa
curl -X PATCH http://localhost:3000/tasks/<id> \
  -H 'Content-Type: application/json' \
  -d '{"teamIds":["<teamId>"]}'

# remover (204, sem corpo)
curl -X DELETE http://localhost:3000/tasks/<id>
```

A collection do Postman com todas as chamadas, incluindo os casos de erro, está em
[`postman/`](back-end-team-management/postman/). Importe o arquivo no Postman ou rode a
suíte inteira pela linha de comando:

```bash
cd back-end-team-management
npx newman run postman/team-management.postman_collection.json
```

O `Criar time` guarda o id na variável `{{teamId}}`, então as chamadas seguintes usam o
time recém-criado — dá para rodar a collection inteira de ponta a ponta sem editar nada.

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

## O que faria diferente em produção

O projeto roda local e é otimizado para ser avaliado rápido. Estes são os pontos que
mudariam antes de ir para produção — os quatro primeiros são falhas conhecidas e
verificadas neste código, não hipóteses.

**Resiliência de conexão.** Hoje, se o Postgres reinicia, a API não se recupera sozinha: o
pool fica com conexões mortas e só volta quando o processo reinicia. Em produção isso é
indisponibilidade silenciosa. Entraria um health check (`/health`) que valida o banco de
verdade, restart automático pelo orquestrador quando ele falha, e retry com backoff nas
queries.

**Segurança.** Não há autenticação: qualquer um cria e apaga times e tarefas. Entraria
autenticação com JWT, autorização por dono do recurso e rate limiting. As credenciais do
banco hoje vivem em `.env` e no `docker-compose.yml` em texto puro — em produção viriam de
um gerenciador de segredos, nunca do repositório. E CORS precisa ser configurado com a
lista de origens permitidas (hoje está desligado, o que já impede o Expo Web de chamar
a API).

**Logs e observabilidade.** O log é o padrão do Nest, sem correlação entre requisições.
Entraria log estruturado em JSON com request id propagado, métricas de latência e taxa de
erro por rota, e alarme para o 500. O filtro de exceção já separa o que o cliente vê do que
vai para o log — é a base para isso.

**Cache.** Nada é cacheado. Times mudam pouco e são lidos em toda tela: um cache curto com
invalidação na escrita reduziria bastante a carga. No cliente, o React Query já cumpre esse
papel; no servidor, entraria Redis quando houver mais de uma instância.

**Escalabilidade.** A API é stateless, então escala horizontalmente sem mudança. O gargalo
apareceria primeiro no banco: hoje o filtro `search` usa `ILIKE '%termo%'`, que não usa
índice — com volume, viraria busca full-text do Postgres (`tsvector` + índice GIN). A
paginação por `offset` degrada em páginas distantes; trocaria por cursor, que o Prisma já
suporta.

**Entrega.** Falta pipeline. Entraria CI rodando lint, testes e build a cada PR, com as
migrations aplicadas no release antes de subir a nova versão da imagem.

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

### 6. React Query

**React Query** é dono do estado de servidor: listagens, detalhe e mutações. A tela chama
o hook; o hook chama `src/models/`. Depois de escrever, a mutation invalida o cache.

**Motivo:** é uma biblioteca estável, organiza as requisições do app e o cache deixa a
navegação mais rápida — a home não busca de novo a cada volta.

Detalhes: [ADR 0006](adr/0006-react-query-para-requisicoes-e-cache.md)

### 7. Estilização: NativeWind

As telas usam **NativeWind 5** com **tailwind-variants**. Classes ficam em `view/styles.ts`,
nunca inline no JSX. Cores são tokens semânticos (`bg-surface`, `text-content-muted`).

**Motivo:** é a biblioteca que mais tem ganhado espaço no front hoje, leva Tailwind ao
React Native (o enunciado proíbe styled-components) e deixa a responsividade mais fácil
de ajustar do que StyleSheet ou Dripsy.

Detalhes: [ADR 0007](adr/0007-nativewind-para-estilizacao.md)

### 8. Arquitetura em ecossistemas no mobile

O app é separado por domínio (`screens/teams/`, `screens/team-tasks/`, `screens/home/`).
Cada tela é um trio: `index.tsx` (container) + `use-[tela].ts` (lógica) + `view/`
(apresentação). O que duas telas usam sobe para `src/components/`, `src/hooks/` ou
`src/models/`. A view não chama API e não rompe camada.

**Motivo:** cada ecossistema tem a sua região; arquivo, componente e tela têm uma
responsabilidade; a hierarquia se mantém. Camadas globais existem para integrar o que é
compartilhado, não para a tela pular direto ao axios.

Detalhes: [ADR 0008](adr/0008-arquitetura-em-ecossistemas-no-mobile.md)

### 9. Redux Toolkit

**Redux Toolkit** guarda só estado global de UI. Hoje é o termo de busca da home. Dado de
servidor não entra no store.

**Motivo:** é uma das bibliotecas de estado global mais estáveis e confiáveis do mercado.
É verbosa, mas organizada, e tem suporte forte da comunidade. Zustand cobriria o mesmo
caso com menos cerimônia; o custo aqui é um slice de uma string.

Detalhes: [ADR 0009](adr/0009-redux-toolkit-para-estado-global.md)
