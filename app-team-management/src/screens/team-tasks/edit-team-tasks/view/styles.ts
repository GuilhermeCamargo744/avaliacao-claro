import { tv } from 'tailwind-variants';

export const editTeamTasksStyles = tv({
  slots: {
    base: 'flex-1 bg-background px-6 pt-safe pb-safe',
    header: 'flex-row items-center justify-between',
    headerButton: '-mx-2 p-2 active:opacity-60',
    backIcon: 'text-content',
    deleteIcon: 'text-danger',
    content: 'flex-1',
    contentContainer: 'grow justify-center pb-12',
    hero: 'items-center gap-1',
    heroIcon: 'mb-3 text-accent',
    title: 'text-2xl font-bold text-content',
    subtitle: 'text-base text-content-muted',
    form: 'gap-3 pt-10',
    input:
      'rounded-lg bg-sunken px-5 py-5 pl-5 text-base text-content placeholder:text-content-muted',
    textArea:
      'h-32 rounded-lg bg-sunken px-5 py-4 pl-5 text-base text-content placeholder:text-content-muted',
    fieldError: 'px-1 text-sm text-danger',
    feedback: 'flex-1 items-center justify-center px-4',
    feedbackText: 'text-center text-base text-content-muted',
    submit: 'mt-3 items-center justify-center rounded-lg bg-accent py-4 active:opacity-80',
    submitLabel: 'text-base font-bold text-on-accent',
  },
  variants: {
    submitDisabled: {
      true: { submit: 'opacity-50' },
    },
  },
});
