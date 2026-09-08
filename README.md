# avaliacao-claro

> **Branch `feat/render-deploy`.** Esta branch é o deploy da API no Render
> (Postgres 17 free + API Docker free). A `main` permanece o teste técnico local,
> sem deploy. Seed é manual, na máquina, contra a External Database URL. Depois
> de 15 min sem tráfego o web dorme (~1 min para acordar). O Postgres free
> expira 30 dias após a criação. Passo a passo: [DEPLOY-RENDER.md](DEPLOY-RENDER.md).

Monorepo da avaliação Claro: app mobile (Expo) e API (NestJS).

Escrevi o passo a passo abaixo na ordem em que eu mesmo subo o projeto para testar —
API com seed primeiro, app depois. O mesmo texto está em
[COMO-RODAR-PROJETO.md](COMO-RODAR-PROJETO.md).

## Como rodar (primeira vez)

### O que você precisa

- Git, Node.js 22, Docker Desktop (aberto)
- Celular com [Expo Go](https://expo.dev/go) (mesma Wi-Fi do computador)
- Não use o navegador (Expo Web): a API não tem CORS

### 1. Clonar

```bash
git clone https://github.com/GuilhermeCamargo744/avaliacao-claro.git
cd avaliacao-claro
```

### 2. Subir API + banco (um terminal)

```bash
cd back-end-team-management
cp .env.example .env
npm install
npm run db:up
npm run db:migrate
npm run seed
```

Confira: no navegador ou no terminal, [http://localhost:3000/teams](http://localhost:3000/teams)
deve devolver `{ "data": [ ...3 times... ], "meta": { "total": 3, ... } }`.

### 3. Subir o app (outro terminal)

```bash
cd app-team-management
npm install
npx expo start
```

### 4. Abrir no celular

Instale o Expo Go, leia o QR do terminal.
Na home devem aparecer os times do seed (Produto, Engenharia, Design).
“Todas as tarefas” lista as 10 tarefas, inclusive a sem time.

Detalhes do ambiente (Docker vs `start:dev`, migrations, cURL, ADRs) ficam nas
seções seguintes.

## Estrutura

```
avaliacao-claro/
├── COMO-RODAR-PROJETO.md       # Passo a passo da primeira execução
├── adr/                        # Registro das decisões técnicas (ADRs)
├── app-team-management/        # App mobile (Expo + React Native)
└── back-end-team-management/   # API (NestJS)
```

## App mobile

Eu subi o app para avaliação pelo **Expo Go**: Metro na máquina, QR no celular. Quem
valida testa no próprio aparelho, sem Android Studio, Xcode ou emulador.

```bash
cd app-team-management
npm install
npx expo start
```

Instale o [Expo Go](https://expo.dev/go) no celular, na mesma rede da máquina, e leia o
QR do terminal. A API precisa estar no ar; o app usa o host do Metro para achar
`http://<host>:3000`, então aparelho físico funciona sem configurar URL.

O `eas.json` e o projeto no [expo.dev](https://expo.dev) já estão configurados. Não
envio build pela EAS neste fluxo: cada validação viraria espera de fila. O teste
permanece local (Metro + Expo Go). Detalhes em [ADR 0010](adr/0010-expo-go-para-validacao-local.md).

## Back-end

A API usa **PostgreSQL 17** (imagem `postgres:17-alpine`). O `docker-compose.yml` sobe o
banco e a API juntos. O caminho que eu uso para avaliar:

```bash
cd back-end-team-management
cp .env.example .env
npm install
npm run db:up          # sobe Postgres e API
npm run db:migrate     # aplica as migrations
npm run seed           # 3 times e 10 tarefas
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
| GET | `/health` | Liveness: `{ "status": "ok" }` se o banco responde |
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
(padrão 0), e devolve os times ordenados por nome. No app a home pede `limit=100` e
não pagina: o catálogo é pequeno. Quem pagina de verdade é a lista de tarefas.

`GET /tasks` aceita `teamId`, `status` (`pending` \| `in_progress` \| `done`), `search`
(procura em título e descrição), `sort` (`createdAt` \| `dueDate` \| `title`, padrão
`createdAt`), `order` (`asc` \| `desc`, padrão `desc`), `limit` (1–100, padrão 20) e
`offset` (padrão 0). No app a lista pede `limit=10` e carrega o resto no scroll
(`offset` seguinte).

Usei **PATCH**, não PUT: a atualização é parcial (só status, só nome, só os times). O
enunciado deixa o formato livre.

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

O projeto roda local e eu otimizei para ser avaliado rápido. Se fosse produção, eu
mudaria o que está abaixo. Os quatro primeiros eu já vi falhar neste código — não são
hipótese.

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
migrations aplicadas no release antes de subir a nova versão da imagem. No app, o
`eas.json` e o projeto no Expo já existem; em produção o passo seguinte seria EAS Build
— na avaliação o teste continua local, pelo Expo Go.

## Decisões do projeto

Abaixo está o raciocínio que segui durante o desenvolvimento. O detalhe de cada escolha
fica em [`adr/`](adr/).

### 1. Gerenciador de pacotes: npm

Optei pelo **npm** nos dois projetos do monorepo.

**Motivo:** já vem com o Node. Quem avalia não instala yarn nem pnpm só para clonar e
rodar. Abri mão de disco/performance do pnpm de propósito.

Detalhes: [ADR 0001](adr/0001-uso-do-npm-como-gerenciador-de-pacotes.md)

### 2. Framework do back-end: NestJS

A API é um **NestJS 12** sobre Node 22, TypeScript `strict` e ESM.

**Motivo:** a avaliação cobra clareza arquitetural. O Nest já traz módulo por domínio,
injeção, pipes e teste — com Express ou Fastify puros eu montaria isso à mão. A injeção
é o que sustenta a hexagonal. O custo que aceitei é a cerimônia dos decorators.

Detalhes: [ADR 0002](adr/0002-nestjs-como-framework-do-back-end.md)

### 3. Persistência: PostgreSQL com Prisma Next

O banco é **PostgreSQL 17** e a camada de dados é o **Prisma Next (Prisma 8)**.

**Motivo:** o domínio é relacional — uma tarefa pertence a zero ou mais times, e o banco
garante isso com FK e cascade. Filtro, ordenação e paginação são trabalho de SQL. O
Prisma gera o cliente tipado; coluna errada quebra no `tsc`. As migrations têm hash; o
banco guarda o hash do contrato aplicado.

**Modelo:** `Team ──< TaskTeam >── Task`. A junção é explícita (o Prisma Next não aceita
N:N implícito). `status` é enum (`pending`, `in_progress`, `done`) com `CHECK` no banco.

Na API a tarefa aceita `teamIds[]`. No form do app eu deixei **um time só**: o fluxo da
avaliação é criar a partir de um time, sem multi-select. A lista global ainda mostra
tarefa sem time e tarefa em dois times quando elas vêm do seed. Editar uma dessas
grava o primeiro time da lista — aceitei esse recorte de propósito.

Detalhes: [ADR 0003](adr/0003-postgresql-com-prisma-next.md)

### 4. Organização do back-end: arquitetura hexagonal

Cada módulo tem `domain` (entidade e porta), `application` (casos de uso) e
`infrastructure` (Prisma e HTTP). A dependência aponta para dentro.

**Motivo:** a regra de negócio não conhece o ORM. O teste do service usa repositório em
memória — sem banco e sem mock framework. Isso pesou porque o Prisma 8 ainda é RC. O
custo é mais arquivo por módulo.

Detalhes: [ADR 0004](adr/0004-arquitetura-hexagonal-no-back-end.md)

### 5. Ambiente local: Docker Compose

Banco e API sobem juntos com `docker compose`, a partir de um `Dockerfile` multi-stage.

**Motivo:** quem avalia não instala Postgres. Um comando, a mesma versão, as mesmas
credenciais. A API só sobe depois do healthcheck do banco.

Detalhes: [ADR 0005](adr/0005-docker-compose-para-o-ambiente-local.md)

### 6. React Query

**React Query** é dono do estado de servidor. Detalhe usa `useQuery`. A lista de
tarefas usa `useInfiniteQuery` (10 no primeiro request, o resto no scroll). A lista de
times fica em `useQuery` com `limit=100` — não paginei na UI porque o catálogo é
pequeno. Depois de escrever, a mutation invalida o cache. Filtro e busca de tarefa
vão na API, não no array em memória: senão a busca acharia só o que já tinha sido
baixado.

**Motivo:** biblioteca estável, a tela não fala com o axios, e o cache evita refetch a
cada volta na home. Não pus optimistic update: preferi a lista bater com o servidor
depois do 200.

Detalhes: [ADR 0006](adr/0006-react-query-para-requisicoes-e-cache.md)

### 7. Estilização: NativeWind

As telas usam **NativeWind 5** (ainda preview) com **tailwind-variants**. Classes em
`view/styles.ts`; no JSX eu só chamo `styles.slot()`. Cores são tokens (`bg-surface`,
`text-content-muted`). Entrei no preview porque o enunciado já apontava NativeWind.

**Motivo:** o enunciado proíbe styled-components. Tailwind é o que o front já lê;
NativeWind leva isso ao RN e a responsividade fica na classe, não no StyleSheet.

Detalhes: [ADR 0007](adr/0007-nativewind-para-estilizacao.md)

### 8. Arquitetura em ecossistemas no mobile

O app se separa por domínio (`screens/teams/`, `screens/team-tasks/`, `screens/home/`).
Cada tela é trio: `index.tsx` + `use-[tela].ts` + `view/`. Formulário entra com React
Hook Form + zod no hook, não na view.

`/tasks` e `/team-tasks/[id]` reusam a mesma lista. O `id` na rota vira o filtro de
time; o select de time só aparece na lista global. Busca e status sempre vão na API.
O que duas telas usam sobe para `src/components/`, `src/hooks/` ou `src/models/`
(`SearchField`, `TeamChip`). A view não chama API.

**Motivo:** cada ecossistema na sua pasta; um arquivo, uma responsabilidade. Camada
global existe para integrar o compartilhado, não para a tela importar o axios.

Detalhes: [ADR 0008](adr/0008-arquitetura-em-ecossistemas-no-mobile.md)

### 9. Redux Toolkit

**Redux Toolkit** guarda só estado de UI global. Hoje é o termo de busca da home —
precisa continuar lá quando a pessoa volta de outra tela. A busca da lista de tarefas
fica em `useState` na própria tela: se a pessoa sai, o filtro some, e isso me bastou.

Dado de servidor não entra no store.

**Motivo:** estável e organizado. Zustand cobriria o mesmo caso com menos cerimônia; o
custo aqui é um slice de uma string, e eu aceitei.

Detalhes: [ADR 0009](adr/0009-redux-toolkit-para-estado-global.md)

### 10. Entrega do app: Expo Go, teste local

Quem avalia roda o app no celular pelo **Expo Go**. Metro na máquina, QR no aparelho.
O `eas.json` e o projeto no Expo já estão configurados; **não** envio build pela EAS
neste fluxo.

**Motivo:** Expo Go evita Android Studio/Xcode. Build na nuvem seria passo de produto, e
cada mudança viraria fila de build. Mantive o teste local.

Detalhes: [ADR 0010](adr/0010-expo-go-para-validacao-local.md)
