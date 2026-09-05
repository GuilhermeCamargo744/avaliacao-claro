import { tv } from 'tailwind-variants';

export const colorFieldStyles = tv({
  slots: {
    base: 'flex-row items-center justify-between rounded-lg bg-sunken px-5 py-5 active:opacity-70',
    label: 'text-base text-content-muted',
    swatch: 'h-6 w-6 rounded-full',
  },
  variants: {
    tone: {
      green: { swatch: 'bg-team-green' },
      yellow: { swatch: 'bg-team-yellow' },
      blue: { swatch: 'bg-team-blue' },
    },
  },
  defaultVariants: {
    tone: 'yellow',
  },
});
