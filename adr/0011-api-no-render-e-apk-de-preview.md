# ADR 0011 — API no Render e APK de preview para avaliação remota

- **Status:** Aceito
- **Data:** 2026-09-08
- **Escopo:** Monorepo

## Contexto

A [ADR 0010](0010-expo-go-para-validacao-local.md) continua valendo para o teste
local: clonar a `main`, subir Docker + Metro e abrir no Expo Go. Eu quis um
segundo caminho, para quem avalia não precisar deixar a API rodando na máquina:
API na nuvem e um APK Android instalável.

O deploy **não entra na `main`**. Ela permanece o artefato do teste técnico local
(clone + Docker + Expo Go). A publicação mora na branch `feat/render-deploy`.

Para hospedar a API eu precisava de Postgres 17 e de um web service que rodasse
o `Dockerfile` que já existia. Sem cadastrar cartão por causa de um teste técnico.

Alternativas que eu olhei:

| Plataforma | Por que não |
| --- | --- |
| Render **pago** (default do Blueprint) | Sem `plan` no YAML o Render cria web `0.5c-512mb` e banco pago (~US$13/mês) e a conta sem cartão falha. |
| Northflank Sandbox | Always-on, Postgres 17, build por Dockerfile. Exige cartão cadastrado só para “verificar” a conta. Não cadastrei. |
| Koyeb | Postgres free com 5 horas ativas por mês. Não serve para uma URL de avaliação. |
| Fly.io | Sem free tier. |
| Neon (banco) + Render free (web) | O Render pode suspender web free que faz tráfego externo demais, e a própria doc cita *accessing an external database* como exemplo. Eu estaria escolhendo o cenário que eles marcam como risco. |
| **Render free (web + Postgres)** | Escolhido. API e banco na mesma região (Oregon); o `DATABASE_URL` interno o próprio Render injeta. |

No plano free do Render duas coisas mudam o fluxo, e as duas estão na doc
(`render.com/docs/free`):

1. **`plan: free` tem de ser explícito** nos dois recursos. Sem isso o Blueprint
   tenta o pago.
2. **Free não roda one-off jobs e não tem Shell.** O seed não pode ir no
   `initialDeployHook` nem no terminal do painel. As **migrations seguem no
   `docker-entrypoint.sh`**, no start do container — isso não é job, e no ar
   funcionou.

O seed eu rodei da minha máquina, contra a External Database URL, com
`sslmode=require` (conexão externa ao Postgres do Render exige TLS; o
`@prisma/orm-postgres` só repassa a URL para o `pg`). O script apaga times e
tarefas antes de inserir.

No app, o APK de preview (EAS, perfil `preview`, Android) aponta para essa API
por `EXPO_PUBLIC_API_URL`. Sem o pin de `lightningcss@1.30.1` o bundle Android
quebrava no NativeWind 5 (`failed to deserialize … Specifier`). Yarn no EAS
ignora o `overrides` do npm, então o pin também está em `resolutions`.

## Decisão

Dois caminhos de avaliação, sem misturar:

1. **Local (`main`)** — Docker + Expo Go, como na ADR 0010. Não mudei o código
   desta branch para caber o deploy.
2. **Remoto** — API no Render (`https://team-management-api-9w3j.onrender.com`) e
   APK Android de preview no Expo. Quem avalia instala o APK e fala com a API
   na nuvem, sem Metro e sem Docker.

O APK está na nuvem do Expo:

- Página do build (baixar por aí):
  [expo.dev/…/builds/2935c01c-89f0-40d0-928e-7a2c6668eb79](https://expo.dev/accounts/guihc744/projects/app-team-management/builds/2935c01c-89f0-40d0-928e-7a2c6668eb79)
- Arquivo direto:
  [expo.dev/artifacts/eas/…apk](https://expo.dev/artifacts/eas/kvKWYqnx27eGjbu3A_bApqk3yJsfXT-GkzraRSHyybU.apk)

## Justificativa

- **Não cadastrar cartão.** Render free sobe web e Postgres 17 na mesma conta,
  com tráfego interno. Northflank era melhor no papel (sem cold start) e eu
  descartei por causa do cartão.
- **Não misturar `main` com deploy.** Quem clona a `main` continua no fluxo
  local. O YAML, o Dockerfile de produção e o hook de start ficam na
  `feat/render-deploy`.
- **APK só de preview, Android.** O ciclo do dia a dia continua Expo Go. O
  binário é para quem for validar sem subir o projeto. iOS não entra neste
  recorte.

## Consequências

- **Cold start.** No plano gratuito o web dorme depois de ~15 min sem tráfego.
  A primeira requisição leva cerca de 1 minuto (o painel do Render fala em 50 s
  ou mais). O axios do app estoura em 10 s, então a primeira abertura **vai
  parecer timeout**. Não é a API fora do ar: espera um pouco e dispara o GET de
  novo (puxar para atualizar na lista, ou fechar e abrir a tela).
- **Postgres free expira 30 dias** depois de criado — por volta de
  **08/10/2026**. Depois disso a URL para. Sem backup no plano free.
- O serviço é público e **não tem autenticação**. Quem tiver a URL cria e apaga
  dados. Usei a URL só para a avaliação.
- `/health` responde `{"status":"ok"}` quando o Postgres responde. `/teams` e
  `/tasks` já estão com o seed (3 times, 10 tarefas).
- Push na `feat/render-deploy` dispara redeploy sozinho. A `main` não publica
  nada.
