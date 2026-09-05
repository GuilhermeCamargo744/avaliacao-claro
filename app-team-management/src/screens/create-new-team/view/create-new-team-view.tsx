import { Pressable, Text, TextInput, View } from 'react-native';

import { ColorField, type ColorFieldTone } from '../components/color-field/color-field';
import { createNewTeamStyles } from './styles';

import { Icon } from '@/components/icon';

export type CreateNewTeamViewProps = {
  tone: ColorFieldTone;
  onBack: () => void;
};

export const CreateNewTeamView = ({ tone, onBack }: CreateNewTeamViewProps) => {
  const styles = createNewTeamStyles();

  return (
    <View className={styles.base()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={onBack}
        className={styles.backButton()}>
        <Icon name="chevron-back" size={28} className={styles.backIcon()} />
      </Pressable>

      <View className={styles.content()}>
        <View className={styles.hero()}>
          <Icon name="people-outline" size={56} className={styles.heroIcon()} />
          <Text className={styles.title()}>Novo Time</Text>
          <Text className={styles.subtitle()}>crie seu time para gerenciar as tarefas</Text>
        </View>

        <View className={styles.form()}>
          <TextInput className={styles.input()} placeholder="Nome do time" />

          <ColorField label="Cor do time" tone={tone} />

          <Pressable accessibilityRole="button" className={styles.submit()}>
            <Text className={styles.submitLabel()}>Criar</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
