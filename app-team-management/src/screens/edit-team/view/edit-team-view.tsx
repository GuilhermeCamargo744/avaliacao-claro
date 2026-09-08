import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { EditTeamForm } from '../schema';
import { editTeamStyles } from './styles';

import { ColorField } from '@/components/color-field/color-field';
import { ColorPicker } from '@/components/color-picker/color-picker';
import { Icon } from '@/components/icon';
import type { TeamTone } from '@/constants/team-colors';

export type EditTeamViewProps = {
  control: Control<EditTeamForm>;
  errors: FieldErrors<EditTeamForm>;
  tone: TeamTone;
  isColorPickerOpen: boolean;
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onDelete: () => void;
  onOpenColorPicker: () => void;
  onCloseColorPicker: () => void;
  onSelectTone: (tone: TeamTone) => void;
  onBack: () => void;
};

export const EditTeamView = ({
  control,
  errors,
  tone,
  isColorPickerOpen,
  isLoading,
  isSubmitting,
  isDeleting,
  errorMessage,
  onSubmit,
  onDelete,
  onOpenColorPicker,
  onCloseColorPicker,
  onSelectTone,
  onBack,
}: EditTeamViewProps) => {
  const isBusy = isSubmitting || isDeleting;
  const styles = editTeamStyles({ submitDisabled: isBusy });

  return (
    <KeyboardAvoidingView behavior="padding" className={styles.base()}>
      <View className={styles.header()}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBack}
          className={styles.headerButton()}>
          <Icon name="chevron-back" size={28} className={styles.backIcon()} />
        </Pressable>

        {isLoading || errorMessage ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Excluir time"
            accessibilityState={{ busy: isDeleting }}
            disabled={isBusy}
            onPress={onDelete}
            className={styles.headerButton()}>
            {isDeleting ? (
              <ActivityIndicator />
            ) : (
              <Icon name="trash-outline" size={26} className={styles.deleteIcon()} />
            )}
          </Pressable>
        )}
      </View>

      {isLoading ? (
        <View className={styles.feedback()}>
          <ActivityIndicator />
        </View>
      ) : errorMessage ? (
        <View className={styles.feedback()}>
          <Text className={styles.feedbackText()}>{errorMessage}</Text>
        </View>
      ) : (
        <ScrollView
          className={styles.content()}
          contentContainerClassName={styles.contentContainer()}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <View className={styles.hero()}>
            <Icon name="people-outline" size={56} className={styles.heroIcon()} />
            <Text className={styles.title()}>Editar time</Text>
            <Text className={styles.subtitle()}>atualize os dados do time</Text>
          </View>

          <View className={styles.form()}>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <TextInput
                  className={styles.input()}
                  placeholder="Nome do time"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  autoCapitalize="words"
                  returnKeyType="done"
                  maxLength={60}
                />
              )}
            />
            {errors.name ? <Text className={styles.fieldError()}>{errors.name.message}</Text> : null}

            <ColorField label="Cor do time" tone={tone} onPress={onOpenColorPicker} />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: isSubmitting }}
              disabled={isBusy}
              onPress={onSubmit}
              className={styles.submit()}>
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Text className={styles.submitLabel()}>Salvar</Text>
              )}
            </Pressable>
          </View>
        </ScrollView>
      )}

      <ColorPicker
        visible={isColorPickerOpen}
        selected={tone}
        onSelect={onSelectTone}
        onClose={onCloseColorPicker}
      />
    </KeyboardAvoidingView>
  );
};
