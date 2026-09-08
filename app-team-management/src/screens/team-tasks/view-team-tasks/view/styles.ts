import { tv } from 'tailwind-variants';

export const viewTeamTasksStyles = tv({
  slots: {
    base: 'flex-1 bg-background px-6 pt-safe pb-safe',
    header: 'flex-row items-center justify-between',
    headerActions: 'flex-row items-center',
    headerButton: '-mx-2 p-2 active:opacity-60',
    backIcon: 'text-content',
    editIcon: 'text-content',
    deleteIcon: 'text-danger',
    body: 'flex-1 pt-6',
    bodyContent: 'gap-6 pb-12',
    title: 'text-2xl font-bold text-content',
    description: 'text-base text-content-muted',
    teams: 'text-sm text-content-muted',
    section: 'gap-2',
    sectionLabel: 'px-1 text-sm text-content-muted',
    statusOption: 'items-center rounded-lg bg-sunken py-4 active:opacity-80',
    statusOptionLabel: 'text-base font-bold text-content',
    feedback: 'flex-1 items-center justify-center px-4',
    feedbackText: 'text-center text-base text-content-muted',
  },
  variants: {
    selected: {
      true: {
        statusOption: 'bg-accent',
        statusOptionLabel: 'text-on-accent',
      },
    },
    optionDisabled: {
      true: { statusOption: 'opacity-50' },
    },
  },
});
