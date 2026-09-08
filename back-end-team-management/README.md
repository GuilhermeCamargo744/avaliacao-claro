# back-end-team-management

API da avaliação (NestJS + PostgreSQL 17 + Prisma Next). O caminho que eu uso para
subir tudo:

```bash
cd back-end-team-management
cp .env.example .env
npm install
npm run db:up
npm run db:migrate
npm run seed
```

A API fica em `http://localhost:3000`. Endpoints, filtros, PATCH, seed e o raciocínio
das escolhas estão no [README da raiz](../README.md).
