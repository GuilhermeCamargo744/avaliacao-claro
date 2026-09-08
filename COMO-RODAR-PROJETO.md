# Como rodar o projeto

Passo a passo da primeira execução — a ordem em que eu mesmo subo o projeto para
avaliar: API com seed primeiro, app no celular pelo Expo Go.

## O que você precisa

- Git, Node.js 22, Docker Desktop (aberto)
- Celular com [Expo Go](https://expo.dev/go) (mesma Wi-Fi do computador)
- Não use o navegador (Expo Web): a API não tem CORS
- Se o celular não alcançar a API local: emulador do Android Studio **com Expo Go**
  (não precisa gerar build nativo)

## 1. Clonar

```bash
git clone https://github.com/GuilhermeCamargo744/avaliacao-claro.git
cd avaliacao-claro
```

## 2. Subir API + banco (um terminal)

```bash
cd back-end-team-management
cp .env.example .env
npm install
npm run db:up
npm run db:migrate
npm run seed
```

Confira: no navegador ou no terminal, [http://localhost:3000/teams](http://localhost:3000/teams) deve devolver `{ "data": [ ...3 times... ], "meta": { "total": 3, ... } }`.

A primeira vez o `db:up` constrói a imagem e pode demorar alguns minutos. A API fica em `http://localhost:3000`.

## 3. Subir o app (outro terminal)

```bash
cd app-team-management
npm install
npx expo start
```

Não defina `EXPO_PUBLIC_API_URL=http://localhost:3000`. No Expo Go do celular,
`localhost` é o aparelho, não o computador — a chamada nunca chega na API. Sem
essa variável o app pega o IP do Metro. Se você já tinha colocado `localhost` no
`.env`, apague e rode `npx expo start -c`.

## 4. Abrir no celular

Instale o Expo Go e leia o QR do terminal. Mesma Wi-Fi da máquina.

Na home devem aparecer os times do seed (Produto, Engenharia, Design). **Todas as tarefas** lista as 10 tarefas, inclusive a sem time.

Se o app no celular **não encontrar a API** (timeout / “não foi possível conectar
ao servidor”), a recomendação é o emulador do **Android Studio**, mantendo o
**Expo Go**:

1. Abra um AVD no Android Studio.
2. Instale o Expo Go no emulador (ou `npx expo start` e pressione `a`).
3. Leia o QR / abra o projeto pelo Expo Go. Continua o mesmo fluxo, sem EAS.

No emulador Android, o `localhost` do Mac é `http://10.0.2.2:3000`. Se ainda
falhar, no `.env` do app:

```bash
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

e `npx expo start -c`.
