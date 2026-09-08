# Publicar a API no Render

Esta branch (`feat/render-deploy`) é só o deploy. A `main` continua o teste
técnico local, sem Render.

## 1. Subir no Render

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Repositório `avaliacao-claro`, branch **`feat/render-deploy`**
3. Apply. Sobe um Postgres 17 e a API a partir do `Dockerfile`

No primeiro boot o container aplica as migrations e, na primeira subida, o seed
(3 times e 10 tarefas). Deploys seguintes **não** rodam o seed de novo.

A API fica em `https://team-management-api.onrender.com` (o subdomínio exato
aparece no dashboard). Confira:

```text
GET https://<seu-servico>.onrender.com/health
GET https://<seu-servico>.onrender.com/teams
```

`/health` precisa responder `{"status":"ok"}`. O Render usa essa rota para
saber se a instância está viva.

## 2. Apontar o app (continua local, pelo Expo Go)

Na `main` o app já lê `EXPO_PUBLIC_API_URL`. Na pasta `app-team-management/`,
crie um `.env` (não versione):

```bash
EXPO_PUBLIC_API_URL=https://<seu-servico>.onrender.com
```

Suba o Metro de novo (`npx expo start`) para a variável entrar. Sem ela, o app
continua falando com `http://<ip-do-metro>:3000`.

## 3. O que o Blueprint faz

- Imagem Docker da API (Node 22)
- Postgres 17 gerenciado (`DATABASE_URL` só no painel)
- `prisma db migrate` em todo start (idempotente)
- Seed **uma vez**, no primeiro deploy (`initialDeployHook`)

Não tem autenticação. Quem tiver a URL cria e apaga dados. Use a URL da
avaliação, não divulgue amplo.

## 4. Seed de novo (opcional)

No Shell do serviço no Render:

```bash
node dist/prisma/seed.js
```

O script apaga times e tarefas antes de inserir.
