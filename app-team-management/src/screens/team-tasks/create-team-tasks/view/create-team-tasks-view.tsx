import { Controller, type Control, type FieldErrors } from 'react-hook-form';
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import type { CreateTaskForm } from '../schema';
import { createTeamTasksStyles } from './styles';

import { Icon } from '@/components/icon';
import { SelectField, type SelectOption } from '@/components/select-field/select-field';

export type CreateTeamTasksViewProps = {
  control: Control<CreateTaskForm>;
  errors: FieldErrors<CreateTaskForm>;
  teamOptions: readonly SelectOption[];
  statusOptions: readonly SelectOption[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onBack: () => void;
};

export const CreateTeamTasksView = ({
  control,
  errors,
  teamOptions,
  statusOptions,
  isSubmitting,
  onSubmit,
  onBack,
}: CreateTeamTasksViewProps) => {
  const styles = createTeamTasksStyles({ submitDisabled: isSubmitting });

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
        keyboardDismissMode="on-drag"
        showsVerticalScrollIndicator={false}>
        <Pressable
          accessible={false}
          onPress={Keyboard.dismiss}
          className={styles.dismissLayer()}>
          <View className={styles.hero()}>
            <Icon name="checkbox-outline" size={48} className={styles.heroIcon()} />
            <Text className={styles.title()}>Nova tarefa</Text>
            <Text className={styles.subtitle()}>crie seu time para gerenciar as tarefas</Text>
          </View>

          <View className={styles.form()}>
            <Controller
              control={control}
              name="title"
              render={({ field }) => (
                <TextInput
                  className={styles.input()}
                  placeholder="Título"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  maxLength={120}
                />
              )}
            />
            {errors.title ? <Text className={styles.fieldError()}>{errors.title.message}</Text> : null}

            <Controller
              control={control}
              name="description"
              render={({ field }) => (
                <TextInput
                  className={styles.textArea()}
                  placeholder="Descrição"
                  value={field.value}
                  onChangeText={field.onChange}
                  onBlur={field.onBlur}
                  multiline
                  textAlignVertical="top"
                />
              )}
            />

            <Controller
              control={control}
              name="teamId"
              render={({ field }) => (
                <SelectField
                  label="Selecione um time"
                  placeholder="Selecione um time"
                  options={teamOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.teamId ? (
              <Text className={styles.fieldError()}>{errors.teamId.message}</Text>
            ) : null}

            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <SelectField
                  label="Selecione um status"
                  placeholder="Selecione um status"
                  options={statusOptions}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />

            <Pressable
              accessibilityRole="button"
              accessibilityState={{ busy: isSubmitting }}
              disabled={isSubmitting}
              onPress={onSubmit}
              className={styles.submit()}>
              {isSubmitting ? (
                <ActivityIndicator />
              ) : (
                <Text className={styles.submitLabel()}>Criar</Text>
              )}
            </Pressable>
          </View>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
