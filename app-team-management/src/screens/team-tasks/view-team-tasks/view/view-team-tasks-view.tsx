import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { viewTeamTasksStyles } from './styles';

import { Icon } from '@/components/icon';
import type { TaskStatus, TaskTeam } from '@/models/tasks/interface-tasks';

export type ViewTeamTasksViewProps = {
  title: string;
  description: string | null;
  teams: readonly TaskTeam[];
  status: TaskStatus;
  statusOptions: readonly { value: TaskStatus; label: string }[];
  isLoading: boolean;
  isUpdatingStatus: boolean;
  isDeleting: boolean;
  errorMessage: string | null;
  onChangeStatus: (status: TaskStatus) => void;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
};

export const ViewTeamTasksView = ({
  title,
  description,
  teams,
  status,
  statusOptions,
  isLoading,
  isUpdatingStatus,
  isDeleting,
  errorMessage,
  onChangeStatus,
  onEdit,
  onDelete,
  onBack,
}: ViewTeamTasksViewProps) => {
  const isBusy = isUpdatingStatus || isDeleting;
  const styles = viewTeamTasksStyles();

  return (
    <View className={styles.base()}>
      <View className={styles.header()}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Voltar"
          onPress={onBack}
          className={styles.headerButton()}>
          <Icon name="chevron-back" size={28} className={styles.backIcon()} />
        </Pressable>

        {isLoading || errorMessage ? null : (
          <View className={styles.headerActions()}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Editar tarefa"
              disabled={isBusy}
              onPress={onEdit}
              className={styles.headerButton()}>
              <Icon name="create-outline" size={26} className={styles.editIcon()} />
            </Pressable>

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
          </View>
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
          className={styles.body()}
          contentContainerClassName={styles.bodyContent()}
          showsVerticalScrollIndicator={false}>
          <View className={styles.section()}>
            <Text className={styles.title()}>{title}</Text>
            {description ? <Text className={styles.description()}>{description}</Text> : null}
            {teams.length > 0 ? (
              <Text className={styles.teams()}>{teams.map((team) => team.name).join(', ')}</Text>
            ) : null}
          </View>

          <View className={styles.section()}>
            <Text className={styles.sectionLabel()}>Status</Text>
            {statusOptions.map((option) => {
              const optionStyles = viewTeamTasksStyles({
                selected: option.value === status,
                optionDisabled: isBusy,
              });

              return (
                <Pressable
                  key={option.value}
                  accessibilityRole="button"
                  accessibilityState={{ selected: option.value === status, disabled: isBusy }}
                  disabled={isBusy || option.value === status}
                  onPress={() => onChangeStatus(option.value)}
                  className={optionStyles.statusOption()}>
                  <Text className={optionStyles.statusOptionLabel()}>{option.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      )}
    </View>
  );
};
