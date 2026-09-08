# Publicar a API no Render

Esta branch (`feat/render-deploy`) é só o deploy. A `main` continua o teste
técnico local, sem Render.

O Blueprint sobe um **Postgres 17 free** e a API **Docker free**. Sem cartão.

Limites do plano gratuito, para quem for avaliar:

- Depois de 15 min sem tráfego o web **dorme**. A primeira requisição leva cerca
  de 1 minuto para acordar — não é a API caída.
- O Postgres free **expira 30 dias** após a criação (1 GB de disco).

## 1. Subir no Render

1. [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Repositório `avaliacao-claro`, branch **`feat/render-deploy`**
3. Apply. Sobe o Postgres 17 free e a API a partir do `Dockerfile`

No boot o container aplica as migrations (`prisma db migrate` no entrypoint).
Elas são idempotentes: rodam a cada start e não recriam o que já existe.

O seed **não** roda no Render. O plano free não executa one-off jobs e não tem
Shell — o passo 4 é na sua máquina, contra a External Database URL.

A API fica em `https://team-management-api.onrender.com` (o subdomínio exato
aparece no dashboard). Confira:

```text
GET https://<seu-servico>.onrender.com/health
GET https://<seu-servico>.onrender.com/teams
```

`/health` precisa responder `{"status":"ok"}`. O Render usa essa rota para
saber se a instância está viva. Antes do seed, `/teams` vem com `data: []` —
isso é esperado.

Se a primeira chamada demorar ~1 minuto, é o cold start do plano free.

## 2. Apontar o app (continua local, pelo Expo Go)

Na `main` o app já lê `EXPO_PUBLIC_API_URL`. Na pasta `app-team-management/`,
crie um `.env` (não versione):

```bash
EXPO_PUBLIC_API_URL=https://<seu-servico>.onrender.com
```

Suba o Metro de novo (`npx expo start`) para a variável entrar. Sem ela, o app
continua falando com `http://<ip-do-metro>:3000`.

## 3. O que o Blueprint faz

- Imagem Docker da API (Node 22), plano `free`
- Postgres 17 gerenciado, plano `free` (`DATABASE_URL` interno só no painel)
- `prisma db migrate` em todo start do container (idempotente)
- Seed **não** entra no Blueprint — rode local (passo 4)

Não tem autenticação. Quem tiver a URL cria e apaga dados. Use a URL da
avaliação, não divulgue amplo.

## 4. Seed (manual, na sua máquina)

O plano free não roda one-off jobs e não oferece Shell no serviço. O seed é
local, apontando para a **External Database URL** do banco (Connect no painel
do Postgres).

Conexão externa exige TLS. `@prisma/orm-postgres` não liga TLS sozinho: ele
passa a URL para o `pg`, que honra `sslmode` na query string. Se a URL do
painel ainda não tiver esse parâmetro, acrescente `?sslmode=require` (ou
`&sslmode=require` se já houver query string).

O script **apaga times e tarefas** antes de inserir. Não rode contra um banco
com dados que você queira manter.

```bash
cd back-end-team-management
DATABASE_URL='postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require' npm run seed
```

Troque a URL pela External Database URL do dashboard. O `DATABASE_URL` da
linha de comando prevalece sobre o `.env` local (o `dotenv` não sobrescreve
variável já definida). Confira:

```text
GET https://<seu-servico>.onrender.com/teams
GET https://<seu-servico>.onrender.com/tasks
```

`/teams` deve devolver 3 times (Produto, Engenharia, Design) e `/tasks`, 10
tarefas (uma delas sem time).
