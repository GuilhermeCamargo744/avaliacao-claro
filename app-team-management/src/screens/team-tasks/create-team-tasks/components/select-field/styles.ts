import { tv } from 'tailwind-variants';

export const selectFieldStyles = tv({
  slots: {
    base: 'flex-row items-center justify-between rounded-lg bg-sunken px-5 py-5 active:opacity-70',
    label: 'flex-1 text-base',
    icon: 'text-content-muted',
    backdrop: 'flex-1 justify-end bg-black/60',
    sheet: 'max-h-96 gap-2 rounded-t-2xl bg-surface px-6 pb-safe-offset-6 pt-6',
    sheetTitle: 'text-lg font-bold text-content',
    option: 'rounded-lg px-4 py-4 active:opacity-60',
    optionLabel: 'text-base text-content',
  },
  variants: {
    filled: {
      true: { label: 'text-content' },
      false: { label: 'text-content-muted' },
    },
    selected: {
      true: { option: 'bg-background' },
    },
  },
});
