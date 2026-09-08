# Handoff Cowork → Cursor: o que aconteceu no deploy da API

Documento de passagem de bastão. Escrito pelo agente **Cowork**, que operou o
navegador e o painel do Render, para o agente **Cursor**, que escreve o código.

Data: 08/09/2026. Branch: `feat/render-deploy`. Commit publicado: `c49e016`.

---

## 1. Estado atual, em uma linha

**A API está no ar e respondendo.** Falta o seed, que é um passo manual do
Guilherme por limitação do plano gratuito — não é bug.

```text
URL          https://team-management-api-9w3j.onrender.com
/health      200 · {"status":"ok"}
/teams       200 · {"data":[],"meta":{"total":0,...}}   ← vazio, esperado
/tasks       200 · {"data":[],"meta":{"total":0,...}}   ← vazio, esperado
```

---

## 2. O plano mudou no meio do caminho. Duas vezes.

### 2.1 A branch não estava no `origin`

A primeira tentativa parou antes de qualquer clique no Render. A
`feat/render-deploy` existia só no Mac (`.git/refs/heads/feat/render-deploy`
presente, `origin/feat/render-deploy` ausente, e a busca por "render" na lista
de branches do GitHub não retornava nada).

Regra aplicada: **não publicar a `main`**. O deploy ficou bloqueado até o push.

### 2.2 Northflank foi avaliado e descartado

O `render.yaml` original não declarava `plan`. Pela referência do Blueprint,
omitir o campo cai no **pago** (`0.5c-512mb` no web, tier pago no banco), o que
daria cerca de US$13/mês. O Guilherme pediu alternativa gratuita.

Alternativas pesquisadas, com o motivo de cada descarte:

| Plataforma | Veredito |
| --- | --- |
| **Northflank Sandbox** | Melhor no papel: always-on, 2 serviços + 1 banco grátis, Postgres 17, build por Dockerfile. **Descartado:** exige cartão cadastrado para liberar o Sandbox ("cartão só para verificação, sem cobrança"). O agente não preenche cartão, e o Guilherme não quis cadastrar por um teste técnico. |
| **Koyeb** | Postgres free tem só **5 horas ativas por mês**. Inútil para uma URL de avaliação. |
| **Fly.io** | Sem free tier. |
| **Neon (banco) + Render free (web)** | Banco permanente, sem cartão. **Descartado** depois de achar na doc do Render que ele pode suspender web service free que faz muito tráfego externo, citando literalmente *"Accessing an external database"* como exemplo. Escolher Neon seria escolher exatamente o cenário que a doc marca como risco. |
| **Render free (web + banco)** ✅ | Escolhido. Tráfego banco↔API é interno, `DATABASE_URL` é injetada pelo Render, ninguém manipula credencial. |

Northflank ficou com uma conta e um projeto vazios, sem custo. Podem ser
apagados. **Não sugira voltar para lá.**

---

## 3. As duas restrições do plano free que mudaram o código

Vieram da doc oficial (`render.com/docs/free`, seção "Other limitations"), não
de tentativa e erro:

1. **`plan: free` é obrigatório e explícito.** Sem ele o Blueprint tenta criar
   recurso pago numa conta sem cartão e falha.

2. **Free não roda one-off jobs nem tem Shell.** Isso matou os dois caminhos de
   seed de uma vez: o `initialDeployHook` (que é um one-off job pós-deploy) e o
   plano B documentado de rodar `node dist/prisma/seed.js` pelo Shell do painel.

O que **não** mudou, e é importante não mexer: as migrations rodam no
`docker-entrypoint.sh`, dentro do start do container. Isso não é job, funciona
normalmente no free, e foi confirmado em produção.

Você já aplicou essas mudanças no commit `c49e016`:

- `plan: free` no `databases` e no `services`
- `initialDeployHook` removido
- `DEPLOY-RENDER.md` reescrito: seed manual, TLS, aviso de cold start, aviso de
  expiração em 30 dias

---

## 4. O que está criado no Render

```text
Workspace     My Workspace (conta pré-existente do Guilherme)
Blueprint     team-management  ·  branch feat/render-deploy  ·  commit c49e016
Web service   team-management-api   srv-dag16mqfngtc73etqmn0
              Docker · Oregon · plano free
Database      team-management-db    dpg-dag15oafngtc73etpc7g-a
              PostgreSQL 17 · Oregon · plano free · databaseName team_management
Build         2m26s  ·  evento "Deploy live for c49e016"  ·  08/09 10:55
```

A branch no painel é `feat/render-deploy`, não `main`. Auto-deploy está ligado
pela integração GitHub: **um push nessa branch dispara redeploy sozinho.**

---

## 5. Riscos que você levantou e que já morreram

Três hipóteses de falha estavam na mesa antes do build. Todas passaram. Registro
aqui para ninguém "consertar" o que está funcionando:

- **`npm ci --ignore-scripts --no-optional` no `node:22-alpine` com Prisma 8 RC**
  — buildou sem problema. O Prisma Next não trouxe engine nativo que quebrasse
  com `--no-optional`.
- **`prisma db migrate` carregando `prisma.config.ts` (TypeScript) na imagem
  runtime** — funcionou. O `node_modules` completo vindo do estágio de build
  (com devDeps) dá conta.
- **Health check 503 por banco não pronto no primeiro boot** — não ocorreu.

O `/health` responder `{"status":"ok"}` é a prova mais forte que temos: ele faz
`prisma.ping()` antes de responder. Imagem buildou, migrations aplicaram e a
conexão com o Postgres está viva. E `/teams` devolver o envelope
`{data, meta}` com `total: 0` em vez de erro prova que as tabelas existem — o
banco está **vazio, não quebrado**.

---

## 6. O que ainda não foi validado

O critério de sucesso original era `/teams` com 3 times e `/tasks` com 10
tarefas. Isso só dá para conferir depois do seed.

O seed roda na máquina do Guilherme, contra a External Database URL:

```bash
cd back-end-team-management
DATABASE_URL='<EXTERNAL_URL>?sslmode=require' npm run seed
```

Você documentou o porquê do `sslmode=require` no `DEPLOY-RENDER.md`: o
`@prisma/orm-postgres` repassa a URL para o `pg`, que honra `sslmode` na query
string, e conexão externa ao Render exige TLS. Se isso se provar errado na
prática, o ajuste é seu.

---

## 7. Pendências que sobraram para você

Nada urgente, nada que impeça a avaliação. Em ordem de valor:

1. **Aviso de cold start no `README.md` da branch.** Hoje está só no
   `DEPLOY-RENDER.md`. O avaliador abre o README primeiro, e o próprio painel do
   Render avisa que o free "can delay requests by 50 seconds or more". Sem esse
   aviso, a primeira requisição parece API fora do ar.

2. **Expiração do banco.** O Postgres free morre 30 dias depois de criado — ou
   seja, por volta de **08/10/2026**. Se a correção passar disso, a URL para de
   funcionar. Vale a data escrita no doc.

3. **Nada mais.** Não mexa no `Dockerfile`, no `docker-entrypoint.sh` nem no
   `render.yaml` sem motivo — os três foram validados em produção agora.

---

## 8. Regras que continuam valendo

- `main` intocada. Ela é o artefato do teste técnico local (clone + Docker +
  Expo Go). Sem merge, sem force-push.
- Deploy vive só na `feat/render-deploy`.
- Sem autenticação, sem CORS, sem Redis, sem domínio customizado, sem EAS. A API
  é consumida por React Native via Expo Go, que não precisa de CORS.
- `.env` não é versionado. Connection string não entra em arquivo do repositório,
  em README nem em commit.
- Você escreve código e dá push. Quem publica e valida no painel é o Cowork.

---

## 9. Se precisar de redeploy

Push na `feat/render-deploy` dispara sozinho. Se precisar forçar sem commit
novo, é pelo painel do serviço (`Manual Deploy`) — peça ao Cowork, não é preciso
commit vazio.

Se um build futuro falhar, o log do Render é a fonte da verdade. As hipóteses da
seção 5 já foram descartadas, então um erro novo provavelmente é consequência do
que mudou no commit, não da infraestrutura.
