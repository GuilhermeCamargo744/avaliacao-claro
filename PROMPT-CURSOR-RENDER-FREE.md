# Prompt para o Cursor — ajustar o deploy para o plano free do Render

Você é um engenheiro de software sênior. Trabalha na branch `feat/render-deploy`
do repositório `GuilhermeCamargo744/avaliacao-claro`. A `main` é o artefato do
teste técnico local e **não** se toca.

Você está em dupla com o agente **Cowork**, que opera o navegador e o painel do
Render. Ele já leu o projeto, já validou a branch no `origin` e já bateu numa
parede: **o `render.yaml` atual não sobe no plano gratuito**. Este prompt é o
conserto. Ele não publica nada — só o Cowork publica.

---

## Contexto: o que aconteceu e por que estou pedindo isso

O plano era subir no Render com o Blueprint que você escreveu. Duas coisas
mudaram no caminho:

1. **O deploy vai ser gratuito.** O `render.yaml` atual não declara `plan`, e a
   referência do Blueprint diz que omitir o campo cai no pago (`0.5c-512mb` para
   web, tier pago para o banco). Sem `plan: free` explícito, o Blueprint tenta
   criar recurso pago numa conta sem cartão e falha.

2. **O plano free do Render não roda o seed.** A doc de free instances lista,
   entre os recursos que free **não** suporta:
   - *"Running one-off jobs"*
   - *"Shell access via SSH or the Render Dashboard"*

   O `initialDeployHook` é exatamente um one-off job pós-deploy, e o Shell era o
   plano B do `DEPLOY-RENDER.md`. Os dois caminhos de seed morreram juntos.

   As **migrations continuam funcionando**: elas rodam no `docker-entrypoint.sh`,
   dentro do processo de start do container, não são job. Não mexa nisso.

Fontes (verifique se quiser, não confie só em mim):
- https://render.com/docs/blueprint-spec — campo `plan`, aceita `free`; tier Free
  de Postgres existe com 1 GB de disco.
- https://render.com/docs/free — seção "Other limitations" e "Free Postgres".

Uma alternativa (Northflank, always-on e sem cold start) foi investigada e
**descartada**: o Sandbox gratuito exige cartão cadastrado para verificação, e o
Guilherme não vai cadastrar cartão por causa de um teste técnico. Não sugira
voltar para lá.

---

## Tarefa 1 — `render.yaml`

Estado alvo do arquivo inteiro:

```yaml
# Blueprint do Render — só esta branch (`feat/render-deploy`).
# A main permanece o teste técnico local, sem deploy.
#
# No dashboard: New → Blueprint → este repositório → branch feat/render-deploy.
#
# Plano gratuito: o web dorme após 15 min de inatividade (~1 min para acordar)
# e o Postgres free expira 30 dias após a criação.

databases:
  - name: team-management-db
    plan: free
    postgresMajorVersion: "17"
    databaseName: team_management

services:
  - type: web
    name: team-management-api
    runtime: docker
    plan: free
    branch: feat/render-deploy
    dockerfilePath: ./back-end-team-management/Dockerfile
    dockerContext: ./back-end-team-management
    healthCheckPath: /health
    envVars:
      - key: NODE_ENV
        value: production
      - key: DATABASE_URL
        fromDatabase:
          name: team-management-db
          property: connectionString
```

Ou seja: `plan: free` nos dois recursos e **remover** a linha
`initialDeployHook: node dist/prisma/seed.js`.

Não adicione `region` (o default `oregon` serve e mantém serviço e banco juntos).
Não adicione `preDeployCommand`. Não invente `env: docker` (campo depreciado).

> Se você encontrar documentação **atual e explícita** dizendo que
> `initialDeployHook` funciona em instância free, diga isso na resposta em vez de
> manter a linha calado. A decisão de remover é para ter um caminho determinístico,
> não porque a alternativa é impossível.

---

## Tarefa 2 — o seed passa a rodar local

Sem job e sem shell no Render, o seed vira um passo manual do Guilherme, da
máquina dele, apontando para a **External Database URL** que o Render mostra no
painel do banco.

O caminho já existe e não precisa de código novo: `src/prisma/db.ts` lê
`process.env.DATABASE_URL` e o `package.json` já tem
`"seed": "npm run build && node dist/prisma/seed.js"`.

O que eu preciso de você aqui é **investigar e documentar**, não refatorar:

- Conexão externa ao Postgres do Render **exige TLS**. Descubra se
  `@prisma/orm-postgres` liga TLS sozinho a partir da connection string ou se a
  URL precisa de `?sslmode=require` (ou equivalente na config do Prisma Next).
- Escreva no doc o comando exato que funciona, já com a resposta acima embutida.
- Deixe explícito que `seed.ts` é **destrutivo**: apaga times e tarefas antes de
  inserir.

Se descobrir que precisa de mudança de código para o TLS funcionar, faça a
mudança **mínima** e explique o porquê. Não troque de driver, não adicione
biblioteca, não crie camada de configuração.

---

## Tarefa 3 — `DEPLOY-RENDER.md`

O arquivo hoje está **errado em dois pontos** e vai enganar quem seguir:

- Diz que na primeira subida o seed roda sozinho (`initialDeployHook`). Não roda.
- A seção "4. Seed de novo (opcional)" manda usar o Shell do serviço no Render.
  Esse Shell não existe no plano free.

Reescreva essas partes para refletir a realidade:

- Blueprint sobe Postgres 17 free + API Docker free.
- Migrations aplicadas no start do container, a cada boot, idempotentes.
- Seed: passo manual, local, com a External Database URL, comando exato, aviso de
  que apaga os dados.
- Acrescente um aviso de **cold start**: depois de 15 min sem tráfego o serviço
  dorme e a primeira requisição leva cerca de 1 minuto. Quem avaliar precisa saber
  disso, senão vai achar que a API caiu.
- Acrescente que o Postgres free **expira em 30 dias** após a criação.

Mesmo cuidado no `README.md` desta branch, se o aviso do topo prometer algo que
mudou.

---

## O que NÃO fazer

- Não mexer na `main`. Não fazer merge. Não fazer force-push.
- Não adicionar autenticação, JWT, CORS, Redis, domínio customizado, EAS.
- Não mudar a arquitetura, o Dockerfile ou o `docker-entrypoint.sh` — eles estão
  corretos e já foram revisados.
- Não versionar `.env` nem colar connection string em arquivo do repositório.
- Não publicar nada no Render. Isso é do Cowork.

---

## Antes de dar push — checklist

- [ ] `render.yaml` é YAML válido e tem `plan: free` nos **dois** recursos.
- [ ] `initialDeployHook` não aparece mais no arquivo.
- [ ] `DEPLOY-RENDER.md` não menciona mais o Shell do Render como caminho de seed.
- [ ] `git status` limpo: nada de `.env`, `dist/`, `node_modules/` no commit.
- [ ] Está na branch `feat/render-deploy`, não na `main`.

Depois: commit e `git push origin feat/render-deploy`.

Na resposta, me diga em uma linha cada: o que mudou no `render.yaml`, o que
descobriu sobre TLS na conexão externa, e o hash do commit empurrado.

---

## Apêndice — falhas prováveis no build, para você já estar preparado

O Cowork vai aplicar o Blueprint e acompanhar os logs. Se quebrar, provavelmente
é um destes. Não são pedidos de mudança agora — são hipóteses para quando o log
aparecer.

| Sintoma no Render | Hipótese mais provável |
| --- | --- |
| Build falha no `npm ci` | `--ignore-scripts --no-optional` no Alpine com Prisma 8 RC; alguma dependência de plataforma ficou de fora |
| Build ok, container morre em `prisma db migrate` | CLI do Prisma 8 não consegue carregar `prisma.config.ts` (TypeScript) dentro da imagem runtime |
| Start ok, health check em 503 | Postgres ainda não aceitou conexão no primeiro boot, ou pool |
| Health 404 | branch errada foi publicada (`main` não tem `/health`) |
| Deploy verde e `/teams` com `data: []` | esperado — o seed é manual agora |
| Blueprint recusa o apply | `plan: free` escrito errado, ou algum campo que free não aceita |
