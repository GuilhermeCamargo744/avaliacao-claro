import { tv } from 'tailwind-variants';

export const teamCardStyles = tv({
  slots: {
    base: 'flex-row items-center gap-4 rounded-lg bg-surface px-5 py-6 active:opacity-70',
    avatar: '',
    name: 'flex-1 text-base text-content',
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
