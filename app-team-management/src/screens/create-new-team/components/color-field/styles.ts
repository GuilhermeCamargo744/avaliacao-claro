import { tv } from 'tailwind-variants';

export const colorFieldStyles = tv({
  slots: {
    base: 'flex-row items-center justify-between rounded-lg bg-sunken px-5 py-5 active:opacity-70',
    label: 'text-base text-content-muted',
  },
});
