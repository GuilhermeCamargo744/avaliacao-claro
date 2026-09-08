# Como rodar o projeto

Passo a passo da primeira execução — a ordem em que eu mesmo subo o projeto para
avaliar: API com seed primeiro, app no celular pelo Expo Go.

## O que você precisa

- Git, Node.js 22, Docker Desktop (aberto)
- Celular com [Expo Go](https://expo.dev/go) (mesma Wi-Fi do computador)
- Não use o navegador (Expo Web): a API não tem CORS

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

## 4. Abrir no celular

Instale o Expo Go e leia o QR do terminal.

Na home devem aparecer os times do seed (Produto, Engenharia, Design). **Todas as tarefas** lista as 10 tarefas, inclusive a sem time.
