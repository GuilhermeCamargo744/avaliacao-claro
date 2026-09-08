import { tv } from 'tailwind-variants';

export const teamChipStyles = tv({
  slots: {
    base: 'flex-row items-center gap-1.5 rounded-full bg-sunken px-2.5 py-1',
    label: 'text-xs text-content',
  },
});
