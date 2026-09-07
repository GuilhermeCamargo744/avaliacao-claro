import { db } from './db.js';
import type { TaskStatus } from '../tasks/domain/task.js';

interface SeedTask {
  title: string;
  description: string | null;
  status: TaskStatus;
  dueDate: string | null;
  teams: string[];
}

const teams = [
  { name: 'Produto', colorHex: '#2563EB', description: 'Discovery e roadmap' },
  { name: 'Engenharia', colorHex: '#16A34A', description: 'Plataforma e API' },
  { name: 'Design', colorHex: '#DB2777', description: 'Interface e pesquisa' },
];

const tasks: SeedTask[] = [
  {
    title: 'Mapear jornada de onboarding',
    description: 'Levantar as telas do fluxo atual',
    status: 'done',
    dueDate: '2026-09-10T12:00:00Z',
    teams: ['Produto'],
  },
  {
    title: 'Priorizar backlog do trimestre',
    description: null,
    status: 'in_progress',
    dueDate: '2026-09-15T12:00:00Z',
    teams: ['Produto'],
  },
  {
    title: 'Revisar contrato da API de tarefas',
    description: 'Alinhar filtros e paginação com o app',
    status: 'in_progress',
    dueDate: null,
    teams: ['Produto', 'Engenharia'],
  },
  {
    title: 'Configurar pipeline de deploy',
    description: 'Build da imagem e migrations no release',
    status: 'pending',
    dueDate: '2026-09-30T12:00:00Z',
    teams: ['Engenharia'],
  },
  {
    title: 'Cobrir listagem de tarefas com testes',
    description: null,
    status: 'pending',
    dueDate: null,
    teams: ['Engenharia'],
  },
  {
    title: 'Investigar lentidão na busca',
    description: 'Avaliar índice para o filtro por texto',
    status: 'pending',
    dueDate: '2026-10-05T12:00:00Z',
    teams: ['Engenharia'],
  },
  {
    title: 'Definir paleta de cores dos times',
    description: 'Garantir contraste no chip da tarefa',
    status: 'done',
    dueDate: '2026-09-08T12:00:00Z',
    teams: ['Design'],
  },
  {
    title: 'Prototipar tela de detalhe da tarefa',
    description: 'Ações rápidas de status e exclusão',
    status: 'in_progress',
    dueDate: '2026-09-20T12:00:00Z',
    teams: ['Design', 'Produto'],
  },
  {
    title: 'Ajustar espaçamento da lista de times',
    description: null,
    status: 'pending',
    dueDate: null,
    teams: ['Design'],
  },
  {
    title: 'Escrever changelog da primeira entrega',
    description: 'Ainda sem time responsável',
    status: 'pending',
    dueDate: null,
    teams: [],
  },
];

async function clear() {
  for (const { taskId, teamId } of await db.orm.public.TaskTeam.select(
    'taskId',
    'teamId',
  ).all()) {
    await db.orm.public.TaskTeam.where({ taskId, teamId }).delete();
  }
  for (const { id } of await db.orm.public.Task.select('id').all()) {
    await db.orm.public.Task.where({ id }).delete();
  }
  for (const { id } of await db.orm.public.Team.select('id').all()) {
    await db.orm.public.Team.where({ id }).delete();
  }
}

async function seed() {
  await clear();

  const teamIds = new Map<string, string>();

  for (const team of teams) {
    const created = await db.orm.public.Team.create(team);
    teamIds.set(team.name, created.id);
  }

  for (const { teams: names, ...fields } of tasks) {
    const created = await db.orm.public.Task.create(fields);

    for (const name of names) {
      await db.orm.public.TaskTeam.create({
        taskId: created.id,
        teamId: teamIds.get(name)!,
      });
    }
  }

  console.log(`${teams.length} times e ${tasks.length} tarefas criados`);
}

await seed();
await db.close();
