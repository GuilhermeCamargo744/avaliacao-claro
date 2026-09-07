# avaliacao-claro

Monorepo da avaliação Claro, com o app mobile (Expo) e o back-end (NestJS).

## Estrutura

```
avaliacao-claro/
├── adr/                        # Registro das decisões técnicas (ADRs)
├── app-team-management/        # App mobile (Expo + React Native)
└── back-end-team-management/   # API (NestJS)
```

## App mobile

```bash
cd app-team-management
npm install
npx expo start
```

## Back-end

```bash
cd back-end-team-management
npm install
npm run start:dev
```

## Decisões do projeto

Registro das decisões técnicas tomadas ao longo do desenvolvimento, com o motivo por trás de cada uma.
O detalhamento de cada decisão fica em [`adr/`](adr/) (Architecture Decision Records).

### 1. Gerenciador de pacotes: npm

Optamos pelo **npm** como gerenciador de pacotes dos dois projetos do monorepo.

**Motivo:** facilidade e versatilidade. O npm já vem instalado junto com o Node.js, então todo desenvolvedor JavaScript o tem disponível na máquina — não exige nenhuma instalação ou configuração extra para rodar o projeto.

Detalhes: [ADR 0001](adr/0001-uso-do-npm-como-gerenciador-de-pacotes.md)
