import { Pressable, Text, type PressableProps } from 'react-native';

import { colorFieldStyles } from './styles';

import { ColorSwatch } from '@/components/color-swatch';
import type { TeamTone } from '@/constants/team-colors';

export type ColorFieldProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  tone: TeamTone;
};

export const ColorField = ({ label, tone, ...rest }: ColorFieldProps) => {
  const styles = colorFieldStyles();

  return (
    <Pressable accessibilityRole="button" className={styles.base()} {...rest}>
      <Text className={styles.label()}>{label}</Text>
      <ColorSwatch tone={tone} />
    </Pressable>
  );
};
