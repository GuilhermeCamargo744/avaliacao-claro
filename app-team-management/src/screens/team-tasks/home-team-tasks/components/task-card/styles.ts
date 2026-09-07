import { tv } from 'tailwind-variants';

export const taskCardStyles = tv({
  slots: {
    base: 'gap-3 rounded-lg bg-surface p-4 active:opacity-70',
    head: 'flex-row items-start justify-between gap-3',
    heading: 'flex-1 gap-0.5',
    title: 'text-base font-bold text-content',
    teamName: 'text-xs text-content-muted',
    badge: 'rounded-full px-3 py-1',
    badgeLabel: 'text-xs font-bold text-content',
    description: 'text-sm leading-5 text-content-muted',
  },
  variants: {
    status: {
      pending: { badge: 'bg-status-pending' },
      in_progress: { badge: 'bg-status-progress' },
      done: { badge: 'bg-status-done' },
    },
  },
  defaultVariants: {
    status: 'pending',
  },
});
