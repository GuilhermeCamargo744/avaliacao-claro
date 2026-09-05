import { Pressable, Text, View, type PressableProps } from 'react-native';

import { colorFieldStyles } from './styles';

export type ColorFieldTone = 'green' | 'yellow' | 'blue';

export type ColorFieldProps = Omit<PressableProps, 'children' | 'style'> & {
  label: string;
  tone?: ColorFieldTone;
};

export const ColorField = ({ label, tone, ...rest }: ColorFieldProps) => {
  const styles = colorFieldStyles({ tone });

  return (
    <Pressable accessibilityRole="button" className={styles.base()} {...rest}>
      <Text className={styles.label()}>{label}</Text>
      <View className={styles.swatch()} />
    </Pressable>
  );
};
