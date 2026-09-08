import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { ColorField } from '../components/color-field/color-field';
import { ColorPicker } from '../components/color-picker/color-picker';
import { createNewTeamStyles } from './styles';

import { Icon } from '@/components/icon';
import type { TeamTone } from '@/constants/team-colors';

export type CreateNewTeamViewProps = {
  name: string;
  tone: TeamTone;
  isColorPickerOpen: boolean;
  isSubmitting: boolean;
  canSubmit: boolean;
  onChangeName: (value: string) => void;
  onSubmit: () => void;
  onOpenColorPicker: () => void;
  onCloseColorPicker: () => void;
  onSelectTone: (tone: TeamTone) => void;
  onBack: () => void;
};

export const CreateNewTeamView = ({
  name,
  tone,
  isColorPickerOpen,
  isSubmitting,
  canSubmit,
  onChangeName,
  onSubmit,
  onOpenColorPicker,
  onCloseColorPicker,
  onSelectTone,
  onBack,
}: CreateNewTeamViewProps) => {
  const styles = createNewTeamStyles({ submitDisabled: !canSubmit });

  return (
    <KeyboardAvoidingView behavior="padding" className={styles.base()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={onBack}
        className={styles.backButton()}>
        <Icon name="chevron-back" size={28} className={styles.backIcon()} />
      </Pressable>

      <ScrollView
        className={styles.content()}
        contentContainerClassName={styles.contentContainer()}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className={styles.hero()}>
          <Icon name="people-outline" size={56} className={styles.heroIcon()} />
          <Text className={styles.title()}>Novo Time</Text>
          <Text className={styles.subtitle()}>crie seu time para gerenciar as tarefas</Text>
        </View>

        <View className={styles.form()}>
          <TextInput
            className={styles.input()}
            placeholder="Nome do time"
            value={name}
            onChangeText={onChangeName}
            autoCapitalize="words"
            returnKeyType="done"
            maxLength={60}
          />

          <ColorField label="Cor do time" tone={tone} onPress={onOpenColorPicker} />

          <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled: !canSubmit, busy: isSubmitting }}
            disabled={!canSubmit}
            onPress={onSubmit}
            className={styles.submit()}>
            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Text className={styles.submitLabel()}>Criar</Text>
            )}
          </Pressable>
        </View>
      </ScrollView>

      <ColorPicker
        visible={isColorPickerOpen}
        selected={tone}
        onSelect={onSelectTone}
        onClose={onCloseColorPicker}
      />
    </KeyboardAvoidingView>
  );
};
