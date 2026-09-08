import { Text, View } from 'react-native';

import { teamChipStyles } from './styles';

import { ColorSwatch } from '@/components/color-swatch';
import { teamToneFromHex } from '@/constants/team-colors';

export type TeamChipProps = {
  name: string;
  colorHex: string;
};

export const TeamChip = ({ name, colorHex }: TeamChipProps) => {
  const styles = teamChipStyles();

  return (
    <View className={styles.base()}>
      <ColorSwatch tone={teamToneFromHex(colorHex)} size="sm" />
      <Text className={styles.label()}>{name}</Text>
    </View>
  );
};
