import { View } from 'react-native';
import { tv } from 'tailwind-variants';

import type { TeamTone } from '@/constants/team-colors';

const colorSwatchStyles = tv({
  base: 'rounded-full',
  variants: {
    tone: {
      green: 'bg-team-green',
      yellow: 'bg-team-yellow',
      blue: 'bg-team-blue',
      purple: 'bg-team-purple',
      orange: 'bg-team-orange',
      pink: 'bg-team-pink',
      cyan: 'bg-team-cyan',
      red: 'bg-team-red',
    },
    size: {
      md: 'h-6 w-6',
      lg: 'h-11 w-11',
    },
    selected: {
      true: 'border-2 border-content',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export type ColorSwatchProps = {
  tone: TeamTone;
  size?: 'md' | 'lg';
  selected?: boolean;
  className?: string;
};

export const ColorSwatch = ({ tone, size, selected, className }: ColorSwatchProps) => (
  <View className={colorSwatchStyles({ tone, size, selected, class: className })} />
);
