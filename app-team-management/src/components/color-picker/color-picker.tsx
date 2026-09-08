import { Modal, Pressable, Text, View } from 'react-native';

import { colorPickerStyles } from './styles';

import { ColorSwatch } from '@/components/color-swatch';
import { TEAM_TONES, type TeamTone } from '@/constants/team-colors';

export type ColorPickerProps = {
  visible: boolean;
  selected: TeamTone;
  onSelect: (tone: TeamTone) => void;
  onClose: () => void;
};

export const ColorPicker = ({ visible, selected, onSelect, onClose }: ColorPickerProps) => {
  const styles = colorPickerStyles();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable accessibilityLabel="Fechar" onPress={onClose} className={styles.backdrop()}>
        <Pressable className={styles.sheet()}>
          <View className={styles.handle()} />

          <Text className={styles.title()}>Cor do time</Text>

          <View className={styles.grid()}>
            {TEAM_TONES.map((tone) => (
              <Pressable
                key={tone}
                accessibilityRole="radio"
                accessibilityState={{ selected: tone === selected }}
                accessibilityLabel={tone}
                onPress={() => onSelect(tone)}
                className={styles.option()}>
                <ColorSwatch tone={tone} size="lg" selected={tone === selected} />
              </Pressable>
            ))}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};
