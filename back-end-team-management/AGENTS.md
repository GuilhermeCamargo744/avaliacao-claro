# back-end-team-management

API REST de times e tarefas. NestJS 12 sobre Node 22, TypeScript `strict`, **ESM nativo**,
PostgreSQL 17 com Prisma Next 8. As decisões e o porquê de cada uma estão nos
[ADRs](../adr/); este arquivo é o como.

## Arquitetura

Cada módulo de domínio é hexagonal (portas e adaptadores):

```
src/
  common/                     filtro de exceção e tipos compartilhados
  prisma/
    contract.prisma           schema — fonte da verdade do banco
    contract.json/.d.ts       gerados por `npm run db:emit`, versionados, nunca editados
    db.ts                     cliente singleton
    prisma.service.ts         expõe o cliente e amarra o pool ao ciclo do Nest
  [feature]/
    domain/
      [feature].ts            entidade, sem dependência nenhuma
      [feature].repository.ts porta: interface + token de injeção
    application/
      [feature]s.service.ts   casos de uso; conhece só a porta
    infrastructure/
      prisma-[feature].repository.ts  adaptador de saída
      [feature]s.controller.ts        adaptador de entrada
      dto/                            entrada HTTP, com class-validator
    [feature]s.module.ts      liga a porta ao adaptador
```

A dependência aponta sempre para dentro: `domain` não importa nada, `application` importa
`domain`, `infrastructure` importa os dois. O service **nunca** menciona Prisma.

Interface de TypeScript não existe em runtime, então a porta precisa de um token:

```ts
export const TEAM_REPOSITORY = 'TEAM_REPOSITORY';

// no módulo
{ provide: TEAM_REPOSITORY, useClass: PrismaTeamRepository }

// no service
constructor(@Inject(TEAM_REPOSITORY) private readonly teams: TeamRepository) {}
```

O `import` da interface no construtor decorado precisa ser `import type`, senão o
`emitDecoratorMetadata` quebra com TS1272. O token, que é valor, vai em `import` normal.

### Módulo novo

1. `domain/` com a entidade e a porta.
2. `application/` com o service, que traduz ausência em `NotFoundException`.
3. `infrastructure/` com o adaptador Prisma, o controller e os DTOs.
4. Módulo declarando `{ provide: TOKEN, useClass: Adapter }` e importado no `app.module.ts`.
5. Teste do service com repositório em memória — sem banco, sem mock framework.

Precisa falar com outro domínio? Injete a **porta** do outro módulo (que o módulo dono
exporta), nunca o adaptador. É o que `TasksService` faz com `TEAM_REPOSITORY` para validar
os times de uma tarefa.

## Prisma Next (não é o Prisma 6/7)

O vocabulário mudou. `prisma migrate dev` **não existe**.

```bash
npm run db:emit                     # regenera contract.json/.d.ts após editar o contract
npm run db:plan -- --name <slug>    # planeja a migration (offline)
npm run db:migrate                  # aplica no banco
npm run db:verify                   # confere se o banco bate com o contract
npm run db:update                   # atalho de dev: aplica sem escrever migration
npm run seed                        # 3 times e 10 tarefas (apaga o que já existe)
```

O seed roda a partir do build (`dist/prisma/seed.js`), não do fonte: `node` não resolve
`./db.js` para o `.ts` durante o type stripping.

- Migration **não é `.sql`**. Cada uma é um pacote com `migration.ts` (renderizado pelo
  framework), `ops.json` (as operações, com o SQL dentro) e `migration.json` (hash). Editou
  o `.ts`? Rode `node migrations/app/<dir>/migration.ts` para re-emitir, senão o
  `db migrate` falha com `MIGRATION.HASH_MISMATCH`.
- Sempre `db:emit` depois de mexer no `contract.prisma`; sem isso o `tsc` e o planner
  enxergam o schema antigo.
- Acesso é `db.orm.public.<Model>` — o namespace `public` faz parte do caminho.
- Tabelas e colunas são camelCase (`"taskTeam"`, `"colorHex"`). Em SQL manual, aspas duplas.
- O schema `prisma_contract` guarda o marcador com o hash do contract aplicado. Não é do
  domínio e não se edita à mão.
- Muitos-para-muitos implícito é rejeitado: a junção (`TaskTeam`) é um model explícito.

### Armadilhas da API de query

- **`.all()` devolve um thenable, não uma `Promise`.** Um método tipado
  `Promise<T[]>` precisa de `return await ...`.
- **`.count()` solto não existe** — só dentro de `include()`. Para totalizar use
  `.aggregate((a) => ({ total: a.count() }))`.
- `and` / `or` / `not` vêm de `@prisma/orm-postgres/orm-client`.
- `.where({ id })` seguido de `.update(...)` / `.delete()` devolve a linha afetada ou
  `null` — é assim que o service distingue 404 de sucesso.
- Include aninhado funciona: `.include('teams', (t) => t.include('team'))`.
- Datas de colunas `TimestamptzString` voltam como string crua do Postgres
  (`2026-09-07 19:20:59.371063+00`), não ISO-8601. É o que o app consome; converter aqui
  quebraria o cliente.

## Entrada e erros

`main.ts` liga um `ValidationPipe` global com `whitelist`, `forbidNonWhitelisted`,
`transform` e `stopAtFirstError`, e o `HttpExceptionFilter` global.

- Toda resposta de erro é `{ error: { code, message, details? } }`. `details` só em
  validação, uma mensagem por campo.
- Mensagens de validação em português, escritas no DTO. **A mensagem nomeia o campo como o
  usuário o conhece, nunca a chave do objeto**: `title` vira "O título", `colorHex` vira
  "A cor", `limit` vira "A quantidade por página". A resposta é lida por pessoa, não por
  código. A única do `class-validator` que vaza em inglês (campo desconhecido) é traduzida
  no `exceptionFactory` — ali a chave crua fica, porque é justamente o nome que o cliente
  errou.
- Falha inesperada devolve mensagem genérica e loga o erro real no servidor. Detalhe
  interno não vai para a resposta.
- `:id` é uuid: valide com `ParseUUIDPipe`. Sem ele, id malformado viraria 404 confuso.
- Query string chega como texto. Number em DTO precisa de `@Type(() => Number)`.

## Ambiente local

```bash
npm run db:only      # sobe só o Postgres — é o modo do dia a dia
npm run db:migrate   # aplica as migrations
npm run start:dev    # API local com hot reload

npm run db:up        # sobe Postgres + API em Docker (modo "tudo em container")
```

- Os dois modos disputam a porta 3000. `db:up` sobe **também** a API, então rodar
  `start:dev` depois dá `EADDRINUSE`: use `db:only`, ou `docker compose stop api` se a do
  container já estiver no ar.
- **Adicionou dependência? Rode `npm run lock` antes de subir o container.** O lockfile
  gerado no macOS não descreve o subgrafo dos binários opcionais de Linux e o `npm ci` da
  imagem recusa — o build falha em `COPY . .` e o container velho continua no ar, o que
  parece "a alteração não pegou".
- O CLI do Docker Desktop fica em `~/.docker/bin`, fora do PATH padrão.

## Testes

```bash
npm test        # unitários
npm run test:e2e
```

ESM obriga `NODE_OPTIONS=--experimental-vm-modules` (já está nos scripts) e `ts-jest` em
`useESM`. O `moduleNameMapper` reescreve `./x.js` para o fonte `.ts`.

- Service se testa com repositório em memória implementando a porta.
- O e2e sobe o `AppModule` de verdade, e o `onModuleInit` do `PrismaService` conecta —
  **precisa do Postgres no ar**.
- Se o Jest abortar com erro de `libicudata`/`watchman`, é o watchman do Homebrew quebrado
  na máquina, não o projeto: rode com `--watchman=false`.

## Contrato da API

Formato atual, documentado no [README](../README.md): rotas sem prefixo (`/teams`,
`/tasks`), listagem de tarefas com `{ data, meta }` e listagem de times como array cru.

Exigências do teste que valem para código novo:

- CRUD de times e de tarefas.
- Tarefa pertence a zero ou mais times; a cor do time viaja junto da tarefa, porque o app
  desenha o chip.
- `GET /tasks` aceita `teamId`, `status`, `search`, `sort`, `order`, `limit` e `offset`, e
  responde com `meta.total` para a paginação.
- `status` é `pending | in_progress | done`.
- Toda entrada validada; `title` e `name` com mínimo de 3 caracteres.

## Estilo de código

Kebab-case nos arquivos, export nomeado, 2 espaços, aspas simples, ponto e vírgula.
Import relativo **sempre com extensão `.js`** — é ESM; sem a extensão o build compila e o
`node dist/main.js` morre com `ERR_MODULE_NOT_FOUND`.

Código simples e direto, sem comentário explicando o óbvio. Comentário só onde apagar
convida um bug.

## Pendências conhecidas

- `GET /teams` ainda não tem paginação, busca nem metadata — o app filtra no cliente.
  Mudar o formato para `{ data, meta }` quebra `models/teams` no app: é alteração
  coordenada entre os dois projetos.
- Sem CORS: o Expo Web não consegue chamar a API (nativo não é afetado).
- A API não se recupera sozinha se o Postgres reiniciar — o pool fica com conexões mortas e
  só volta com restart do processo. Falta retry/health check.
- `package-lock.json` está no `.gitignore` da raiz, mas o `Dockerfile` instala com
  `npm ci`. Numa clonagem limpa o build falha.
