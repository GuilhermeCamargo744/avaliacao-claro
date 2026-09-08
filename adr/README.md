# ADRs — Architecture Decision Records

Aqui está o raciocínio que fui tomando no desenvolvimento. Cada arquivo é uma decisão:
o que eu tinha na mesa, o que escolhi, por quê, e o que isso mudou no projeto.

Quando uma decisão muda, o ADR antigo não some: o status vira `Substituído por ADR NNNN`
e um novo arquivo entra na sequência.

## Índice

| ADR | Título | Status |
| --- | ------ | ------ |
| [0001](0001-uso-do-npm-como-gerenciador-de-pacotes.md) | Uso do npm como gerenciador de pacotes | Aceito |
| [0002](0002-nestjs-como-framework-do-back-end.md) | NestJS como framework do back-end | Aceito |
| [0003](0003-postgresql-com-prisma-next.md) | PostgreSQL com Prisma Next | Aceito |
| [0004](0004-arquitetura-hexagonal-no-back-end.md) | Arquitetura hexagonal nos módulos do back-end | Aceito |
| [0005](0005-docker-compose-para-o-ambiente-local.md) | Docker Compose para o ambiente local | Aceito |
| [0006](0006-react-query-para-requisicoes-e-cache.md) | React Query para requisições e cache | Aceito |
| [0007](0007-nativewind-para-estilizacao.md) | NativeWind para estilização | Aceito |
| [0008](0008-arquitetura-em-ecossistemas-no-mobile.md) | Arquitetura em ecossistemas no mobile | Aceito |
| [0009](0009-redux-toolkit-para-estado-global.md) | Redux Toolkit para estado global de UI | Aceito |
| [0010](0010-expo-go-para-validacao-local.md) | Expo Go para validação local no dispositivo | Aceito |
| [0011](0011-api-no-render-e-apk-de-preview.md) | API no Render e APK de preview para avaliação remota | Aceito |

## Como adicionar uma nova decisão

1. Copie o [template.md](template.md) para `NNNN-titulo-em-kebab-case.md`, usando o próximo
   número da sequência.
2. Preencha as seções (contexto, decisão, justificativa e consequências).
3. Adicione a linha correspondente no índice acima.
4. Registre o resumo da decisão também no [README principal](../README.md).

Decisões não são apagadas: quando uma decisão é revista, o ADR antigo passa a
`Substituído por ADR NNNN` e um novo ADR é criado.
