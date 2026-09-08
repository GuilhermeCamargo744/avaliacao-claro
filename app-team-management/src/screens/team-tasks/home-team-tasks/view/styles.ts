import { tv } from 'tailwind-variants';

export const homeTeamTasksStyles = tv({
  slots: {
    base: 'flex-1 bg-background px-6 pt-safe pb-safe',
    backButton: '-ml-2 p-2 active:opacity-60',
    backIcon: 'text-content',
    topBar: 'flex-row items-center justify-between',
    editButton: '-mr-2 p-2 active:opacity-60',
    editIcon: 'text-content',
    header: 'items-center gap-1 pb-6 pt-4',
    title: 'text-2xl font-bold text-content',
    subtitle: 'text-base text-content-muted',
    list: 'flex-1',
    listContent: 'gap-4 pb-2',
    feedback: 'flex-1 items-center justify-center gap-3 px-4',
    feedbackText: 'text-center text-base text-content-muted',
    footer: 'pb-4 pt-6',
    newTaskButton: 'items-center rounded-lg bg-accent py-4 active:opacity-80',
    newTaskLabel: 'text-base font-bold text-on-accent',
  },
});
