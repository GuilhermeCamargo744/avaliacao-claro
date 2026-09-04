import { tv } from 'tailwind-variants';

export const homeStyles = tv({
  slots: {
    base: 'flex-1 items-center justify-center gap-2 bg-background p-4',
    title: 'text-2xl font-semibold text-text',
    subtitle: 'text-base text-text-secondary',
  },
});
