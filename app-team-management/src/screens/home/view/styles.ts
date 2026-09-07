import { tv } from 'tailwind-variants';

export const homeStyles = tv({
  slots: {
    base: 'flex-1 bg-background px-6 pt-safe pb-safe',
    header: 'items-center gap-1 pb-8 pt-20',
    title: 'text-2xl font-bold text-content',
    subtitle: 'text-base text-content-muted',
    list: 'flex-1',
    listContent: 'gap-3 pb-2 pt-4',
    feedback: 'flex-1 items-center justify-center gap-3 px-4',
    feedbackText: 'text-center text-base text-content-muted',
    retryButton: 'rounded-lg bg-surface px-5 py-3 active:opacity-70',
    retryLabel: 'text-base font-bold text-content',
    footer: 'pb-4 pt-6',
    createButton: 'items-center rounded-lg bg-accent py-4 active:opacity-80',
    createButtonLabel: 'text-base font-bold text-on-accent',
  },
});
