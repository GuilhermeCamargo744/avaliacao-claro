# ADR 0010 — Expo Go para validação local no dispositivo

- **Status:** Aceito
- **Data:** 2026-09-07
- **Escopo:** app-team-management

## Contexto

Quem avalia a atividade precisa rodar o app no celular, sem obrigar Android Studio, Xcode
ou um emulador. As alternativas eram:

- **Expo Go** — o validador instala o app da Expo, lê o QR do Metro e abre o projeto.
- **EAS Build** — gerar um binário (preview/production ou development client) no
  [expo.dev](https://expo.dev) e instalar o artefato no aparelho.

O `eas.json` já existe e o projeto já está no Expo (`projectId` em `app.json`). Cheguei a
configurar o caminho profissional (fila de build, store interna). Cada mudança, porém,
exigiria enviar um build, esperar e validar de novo — tempo demais para esta atividade.

## Decisão

O caminho da avaliação é **Expo Go + Metro local**. Quem valida instala o Expo Go, sobe o
bundler (`npx expo start`) e abre pelo QR, na mesma rede. Não envio build pela EAS para
validar a atividade.

## Justificativa

- **Barreira baixa para quem avalia.** Expo Go é um app de loja. Não pede toolchain
  nativa nem conta de desenvolvedor Apple/Google só para abrir o projeto.
- **O ciclo local é o que a atividade pede.** Alterar tela, recarregar, conferir no
  aparelho. Build na nuvem levaria o projeto a um nível de entrega de produto e
  consumiria o tempo da avaliação em fila de build, não em código.
- **A configuração profissional não se perde.** `eas.json` e o `projectId` ficam prontos
  se alguém for além da avaliação; só não entram no passo a passo obrigatório.

## Consequências

- Celular e máquina precisam estar na mesma rede. O app resolve a API pelo host do Metro
  (`Constants.expoConfig.hostUri` → porta 3000); a API tem de estar no ar na máquina.
- Bibliotecas fora do sandbox do Expo Go não entram neste app. Se no futuro um módulo
  nativo customizado for necessário, o caminho deixa de ser Expo Go e passa a ser
  development build / EAS.
- Expo Web não é o alvo da validação: a API está sem CORS, então o navegador não chama
  o back-end. O teste é nativo, pelo Expo Go.
