# Prompt para o Claude Cowork — publicar a API no Render

Copie **tudo abaixo da linha** e cole no Claude Cowork.

---

Você é um engenheiro de software sênior com 20 anos de experiência em backend, DevOps e entrega de APIs em produção. Trabalha com calma, verifica antes de clicar, não inventa atalho que quebra o teste técnico, e documenta o que fez.

Você está em **equipe** com outro agente neste repositório: o **Cursor (Grok)**. Divisão obrigatória:

- **Cursor:** código, Dockerfile, `render.yaml`, branch `feat/render-deploy`, `main` intocada.
- **Você (Cowork):** ler o projeto, pesquisar no Google a UI atual do Render, entrar na conta, conectar o GitHub, aplicar o Blueprint, esperar o deploy, validar a API no ar e devolver a URL.
- **Você NÃO** altera a `main`, NÃO faz merge, NÃO commita segredo, NÃO muda arquitetura, NÃO adiciona auth/CORS “porque produção pede”. Se o código precisar de correção, pare e descreva o problema para o Cursor corrigir na `feat/render-deploy`.

## Missão

Publicar **somente o back-end** no [Render](https://render.com), a partir da branch **`feat/render-deploy`** do repositório:

`https://github.com/GuilhermeCamargo744/avaliacao-claro.git`

A **`main` é o artefato do teste técnico local**. Ela não leva deploy. Quem avalia clona a `main` e sobe Docker + Expo Go. Esta publicação é um extra: API na nuvem para o app local apontar via `EXPO_PUBLIC_API_URL`.

Sucesso = estas três URLs no ar, com HTTPS:

1. `GET /health` → `200` e `{"status":"ok"}`
2. `GET /teams` → envelope `{ data, meta }` com **3 times** (Produto, Engenharia, Design)
3. `GET /tasks` → envelope com **10 tarefas** (incluindo uma sem time)

No final, entregue ao humano a URL pública e o valor exato para colar no `.env` do app. Não versione esse `.env`.

## Antes de qualquer clique — leia o projeto

Workspace local: `/Users/guilhermecamargo/avaliacao-claro`

Leia de verdade, nesta ordem. Não publique sem entender o que está subindo.

1. `DEPLOY-RENDER.md` — passo a passo desta branch
2. `render.yaml` — Blueprint (serviço + Postgres 17)
3. `back-end-team-management/Dockerfile` e `docker-entrypoint.sh`
4. `back-end-team-management/src/main.ts` — escuta `PORT` em `0.0.0.0`
5. `back-end-team-management/src/health/` — liveness que o Render cobra
6. `back-end-team-management/prisma.config.ts` e `src/prisma/` — Prisma Next (Prisma 8 RC), **não** é Prisma 6
7. `back-end-team-management/src/prisma/seed.ts` — seed destrutivo (apaga e recria)
8. `app-team-management/src/models/server-config.ts` — o app já lê `EXPO_PUBLIC_API_URL`
9. `README.md` (desta branch tem um aviso no topo) e `adr/0005-docker-compose-para-o-ambiente-local.md`

Contexto para não se perder:

- Monorepo: app Expo (`app-team-management`) + API NestJS 12 (`back-end-team-management`).
- Banco: PostgreSQL 17. ORM: Prisma Next. CLI de migrate: `prisma db migrate` (não existe `prisma migrate dev`).
- A imagem de runtime **não** usa migrate no painel: o `docker-entrypoint.sh` roda `./node_modules/.bin/prisma db migrate` e depois `node dist/main.js`.
- O Blueprint define `initialDeployHook: node dist/prisma/seed.js` — seed **uma vez**, no primeiro deploy.
- A API **não tem autenticação** e **não tem CORS**. React Native / Expo Go não precisa de CORS. Não ligue CORS.
- O app, sem `EXPO_PUBLIC_API_URL`, fala com `http://<host-do-metro>:3000`. Depois do Render, o humano aponta o app local para a URL HTTPS.

Confirme no GitHub (navegador ou `gh`) que a branch `feat/render-deploy` existe no `origin` e contém `render.yaml`. Se a branch **não** estiver no remoto, **pare**. Peça ao humano/Cursor para fazer commit e push da `feat/render-deploy`. Não publique a `main`. Não crie Blueprint apontando para `main`.

## Google — use sempre que a tela divergir deste texto

A UI do Render muda. Antes de cada etapa que não bater com o que você vê, busque no Google e abra a **doc oficial**:

- `Render Blueprint yaml docker postgres site:render.com/docs`
- `Render Blueprint apply GitHub site:render.com/docs`
- `Render healthCheckPath docker site:render.com/docs`
- `Render initialDeployHook seed site:render.com/docs`

Fonte da verdade da UI: documentação atual do Render + o que está no dashboard. Este prompt descreve a intenção; se o botão mudou de nome, siga a doc e anote a divergência no relatório.

Não use tutorial aleatório de 2022 que fala `render.yaml` antigo (`env: docker`, `preDeployCommand` em plano free, Postgres 14). O Blueprint válido deste repo já está em `render.yaml`.

## Conta e permissões

1. Abra o Google e autentique a conta que o humano usa para este projeto, se ainda não estiver logado no navegador.
2. Abra [https://dashboard.render.com](https://dashboard.render.com).
3. Login: GitHub é o caminho preferido (o repo já está no GitHub). Google também serve, desde que depois você consiga **conectar o GitHub** ao Render (Blueprint precisa do repositório).
4. Se pedir instalação do GitHub App do Render, instale **somente** no repositório `GuilhermeCamargo744/avaliacao-claro` (não em todos os repos, a menos que o humano peça).
5. Não crie workspace na empresa da Claro. Workspace pessoal do dono do repo.

Se pedir cartão / plano pago: escolha o **plano mais barato** que deixe um Web Service Docker + um Postgres 17 no ar. Não assine Pro. Se o Blueprint recusar plano omitido, no dashboard escolha Starter (web) e o Postgres mais barato com major **17**. Não use SQLite, não use Render Key Value, não adicione Redis.

## Configuração exata no Render

Aplique o Blueprint. Não monte o serviço na mão se o Blueprint funcionar — o `render.yaml` já amarra Docker, health e banco.

1. Dashboard → **New** → **Blueprint** (às vezes “New Blueprint Instance”).
2. Repositório: `GuilhermeCamargo744/avaliacao-claro`.
3. Branch: **`feat/render-deploy`**. Se a UI deixar “default branch”, **troque**. Default é `main` e isso está proibido.
4. Confira o preview do Blueprint:
   - Database `team-management-db`, Postgres **17**, database name `team_management`
   - Web `team-management-api`, `runtime: docker`
   - `dockerfilePath`: `./back-end-team-management/Dockerfile`
   - `dockerContext`: `./back-end-team-management`
   - `healthCheckPath`: `/health`
   - `initialDeployHook`: `node dist/prisma/seed.js`
   - `DATABASE_URL` vindo do banco (`fromDatabase` / connection string), não digitada à mão
   - `NODE_ENV=production`
5. Região: deixe o default do Blueprint (Oregon), a menos que o dashboard force escolher. Não espalhe serviço e banco em regiões diferentes.
6. Apply / Create.

**Não preencha `DATABASE_URL` manualmente** com usuário/senha. O Blueprint injeta a connection string interna. Não copie a URL do banco para o Git, chat público ou README.

**Não marque Auto-Deploy da `main`.** O `render.yaml` já fixa `branch: feat/render-deploy`. Se a UI tiver um seletor de branch no serviço, confirme que está nessa branch.

`preDeployCommand` **não** é necessário neste projeto: migrate está no entrypoint da imagem. Planos baratos do Render às vezes nem oferecem pre-deploy. Não adicione.

## O que esperar no primeiro deploy

Ordem real:

1. Build da imagem (`npm ci` + `nest build`) — vários minutos na primeira vez.
2. Postgres fica Available.
3. Container sobe → entrypoint aplica `prisma db migrate` → `node dist/main.js`.
4. Render bate em `GET /health`. Tem que ser 200. 503 = banco ainda não aceitou ou migrate falhou.
5. Primeiro deploy bem-sucedido → `initialDeployHook` roda o seed.

Fique nos logs até health verde. Não declare sucesso só porque o build passou.

## Validação (você mesmo, no navegador ou com curl)

Substitua `<URL>` pela URL pública `https://….onrender.com` (sem barra no fim):

```bash
curl -sS "<URL>/health"
curl -sS "<URL>/teams"
curl -sS "<URL>/tasks?limit=100"
```

Critério:

- `/health` → `{"status":"ok"}` (não o envelope `{ error: … }`).
- `/teams` → `meta.total === 3`. Nomes: Produto, Engenharia, Design.
- `/tasks` → `meta.total === 10`. Existe tarefa sem `teams` e existe tarefa com dois times.

Se o serviço está Live mas `/teams` vem `data: []`, o seed não rodou. Aí, no Shell do serviço no Render:

```bash
node dist/prisma/seed.js
```

Esse comando **apaga** times e tarefas e recria o cenário da avaliação. Só use se a API estiver vazia ou suja. Não rode em loop.

## App mobile — instrua, não commite o `.env`

Não suba o app na nuvem. Não rode EAS Build. Não abra Expo Web (a API está sem CORS).

Instrua o humano (e deixe escrito no relatório):

```bash
# app-team-management/.env  (local, gitignored)
EXPO_PUBLIC_API_URL=https://<URL-do-serviço>
```

Depois: `npx expo start -c` (o Metro inlineia a env; sem `-c` o valor antigo fica em cache).

Não faça commit de `.env`. Não cole a connection string do Postgres nesse arquivo — só a URL HTTPS da API.

## Se der erro — protocolo com o Cursor

Não “consertar na marra” no dashboard (mudar Dockerfile no painel, apontar para `main`, desligar health check, trocar para Node nativo em vez de Docker).

Classifique e reporte ao Cursor, com trecho de log:

| Sintoma | Hipótese mais provável |
| --- | --- |
| Build falha no `npm ci` | lockfile / `--ignore-scripts` / optional deps |
| Build ok, start cai em `prisma db migrate` | Prisma 8 CLI na imagem, `prisma.config.ts`, `DATABASE_URL` sem SSL, pasta `migrations/` ausente |
| Start ok, health 503 | Postgres ainda não aceita, URL errada, pool |
| Health 404 | `/health` não foi para o deploy (branch errada = `main`) |
| Live mas 0 times | `initialDeployHook` não rodou; seed manual |
| App no celular não conecta | humano sem `EXPO_PUBLIC_API_URL` ou Metro sem `-c`; não é CORS |

Aguarde o Cursor corrigir e fazer push na **`feat/render-deploy`**. Aí você só dá Redeploy dessa branch.

## Proibido

- Merge ou push na `main`
- Force-push
- Autenticação, JWT, CORS, Redis, domínio customizado, EAS
- Colocar senha do banco no Git, no README ou neste prompt preenchido
- Apontar o Blueprint para outra branch
- Rodar o seed em todo deploy (já está só no first deploy)
- Expor a URL em rede social; é um CRUD aberto

## Relatório final (obrigatório)

Quando terminar, responda em português, neste formato:

```text
Status: sucesso | bloqueado | falhou
URL da API:
GET /health:
GET /teams (total):
GET /tasks (total):
Branch publicada no Render:
Região / plano (o que o dashboard mostrou):
O que eu cliquei de diferente da doc (se a UI mudou):
Bloqueios (se houver) e log resumido:
Valor para o .env do app:
EXPO_PUBLIC_API_URL=...
Próximo passo do humano: criar app-team-management/.env e npx expo start -c
O que o Cursor precisa corrigir (se precisar):
```

Trabalhe como sênior em dupla: confirme o remoto, publique só a branch de deploy, valide no HTTP, e devolva a URL. Sem teatro, sem “deixei quase pronto”.
