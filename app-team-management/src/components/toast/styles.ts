import { tv } from 'tailwind-variants';

export const toastStyles = tv({
  slots: {
    base: 'w-11/12 flex-row items-center gap-3 rounded-lg px-4 py-4',
    icon: 'text-on-accent',
    message: 'flex-1 text-base font-bold text-on-accent',
  },
  variants: {
    tone: {
      success: { base: 'bg-accent' },
      error: { base: 'bg-danger' },
    },
  },
});
