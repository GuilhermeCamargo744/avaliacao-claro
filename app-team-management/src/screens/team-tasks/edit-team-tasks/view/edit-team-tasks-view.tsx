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

import type { EditTaskForm } from '../schema';
import { editTeamTasksStyles } from './styles';

import { Icon } from '@/components/icon';
import { SelectField, type SelectOption } from '@/components/select-field/select-field';

export type EditTeamTasksViewProps = {
  control: Control<EditTaskForm>;
  errors: FieldErrors<EditTaskForm>;
  teamOptions: readonly SelectOption[];
  statusOptions: readonly SelectOption[];
  isLoading: boolean;
  isSubmitting: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onSubmit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export const EditTeamTasksView = ({
  control,
  errors,
  teamOptions,
  statusOptions,
  isLoading,
  isSubmitting,
  isDeleting,
  errorMessage,
  onSubmit,
  onDelete,
  onBack,
}: EditTeamTasksViewProps) => {
  const isBusy = isSubmitting || isDeleting;
  const styles = editTeamTasksStyles({ submitDisabled: isBusy });

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
            accessibilityLabel="Excluir tarefa"
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
            <Icon name="checkbox-outline" size={48} className={styles.heroIcon()} />
            <Text className={styles.title()}>Editar tarefa</Text>
            <Text className={styles.subtitle()}>atualize os dados da tarefa</Text>
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
            {errors.title ? (
              <Text className={styles.fieldError()}>{errors.title.message}</Text>
            ) : null}

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
    </KeyboardAvoidingView>
  );
};
