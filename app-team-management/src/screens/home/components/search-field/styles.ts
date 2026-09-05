import { tv } from 'tailwind-variants';

export const searchFieldStyles = tv({
  slots: {
    base: 'flex-row items-center gap-3 rounded-lg bg-sunken px-5 py-4',
    input: 'flex-1 text-base text-content placeholder:text-content-muted',
    icon: 'text-accent',
  },
});
