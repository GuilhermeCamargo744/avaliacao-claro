import { tv } from 'tailwind-variants';

export const colorPickerStyles = tv({
  slots: {
    backdrop: 'flex-1 justify-end bg-black/60',
    sheet: 'gap-6 rounded-t-2xl bg-surface px-6 pb-safe-offset-8 pt-6',
    handle: 'h-1 w-10 self-center rounded-full bg-content-muted',
    title: 'text-lg font-bold text-content',
    grid: 'flex-row flex-wrap gap-4',
    option: 'rounded-full p-1 active:opacity-60',
  },
});
