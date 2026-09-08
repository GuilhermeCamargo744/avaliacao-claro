import { tv } from 'tailwind-variants';

export const teamCardStyles = tv({
  slots: {
    base: 'flex-row items-center rounded-lg bg-surface pl-5',
    main: 'min-h-16 flex-1 flex-row items-center gap-4 py-6 pr-2 active:opacity-70',
    avatar: '',
    name: 'flex-1 text-base text-content',
    editButton: 'p-3 active:opacity-60',
    editIcon: 'text-content',
    chevronButton: 'py-6 pr-5 active:opacity-70',
    chevron: 'text-content',
  },
  variants: {
    tone: {
      green: { avatar: 'text-team-green' },
      yellow: { avatar: 'text-team-yellow' },
      blue: { avatar: 'text-team-blue' },
      purple: { avatar: 'text-team-purple' },
      orange: { avatar: 'text-team-orange' },
      pink: { avatar: 'text-team-pink' },
      cyan: { avatar: 'text-team-cyan' },
      red: { avatar: 'text-team-red' },
    },
  },
  defaultVariants: {
    tone: 'green',
  },
});
