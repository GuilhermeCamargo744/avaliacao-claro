import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, View } from 'react-native';

import { TaskCard } from '../components/task-card/task-card';
import { homeTeamTasksStyles } from './styles';

import { Icon } from '@/components/icon';
import { SearchField } from '@/components/search-field/search-field';
import { SelectField, type SelectOption } from '@/components/select-field/select-field';
import type { Task } from '@/models/tasks/interface-tasks';

export type HomeTeamTasksViewProps = {
  tasks: readonly Task[];
  subtitle: string;
  searchTerm: string;
  statusOptions: readonly SelectOption[];
  status: string;
  canFilterTeam: boolean;
  teamFilter: string;
  teamOptions: readonly SelectOption[];
  emptyMessage: string;
  isLoadingMore: boolean;
  isLoading: boolean;
  errorMessage: string | null;
  onSearchTermChange: (value: string) => void;
  onChangeStatus: (value: string) => void;
  onChangeTeamFilter: (value: string) => void;
  onLoadMore: () => void;
  onBack: () => void;
  onCreateTask: () => void;
  onOpenTask: (taskId: string) => void;
};

export const HomeTeamTasksView = ({
  tasks,
  subtitle,
  searchTerm,
  statusOptions,
  status,
  canFilterTeam,
  teamFilter,
  teamOptions,
  emptyMessage,
  isLoadingMore,
  isLoading,
  errorMessage,
  onSearchTermChange,
  onChangeStatus,
  onChangeTeamFilter,
  onLoadMore,
  onBack,
  onCreateTask,
  onOpenTask,
}: HomeTeamTasksViewProps) => {
  const styles = homeTeamTasksStyles();

  return (
    <View className={styles.base()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        onPress={onBack}
        className={styles.backButton()}>
        <Icon name="chevron-back" size={28} className={styles.backIcon()} />
      </Pressable>

      <View className={styles.header()}>
        <Text className={styles.title()}>Tarefas</Text>
        <Text className={styles.subtitle()}>{subtitle}</Text>
      </View>

      <View className={styles.filters()}>
        <SearchField
          placeholder="Busque uma tarefa"
          value={searchTerm}
          onChangeText={onSearchTermChange}
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName={styles.statusRow()}>
          {statusOptions.map((option) => {
            const chipStyles = homeTeamTasksStyles({ selected: option.value === status });

            return (
              <Pressable
                key={option.value}
                accessibilityRole="button"
                accessibilityState={{ selected: option.value === status }}
                onPress={() => onChangeStatus(option.value)}
                className={chipStyles.statusChip()}>
                <Text className={chipStyles.statusChipLabel()}>{option.label}</Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {canFilterTeam ? (
          <SelectField
            label="Filtrar por time"
            placeholder="Todos os times"
            options={teamOptions}
            value={teamFilter}
            onChange={onChangeTeamFilter}
          />
        ) : null}
      </View>

      {isLoading ? (
        <View className={styles.feedback()}>
          <ActivityIndicator />
        </View>
      ) : errorMessage ? (
        <View className={styles.feedback()}>
          <Text className={styles.feedbackText()}>{errorMessage}</Text>
        </View>
      ) : tasks.length === 0 ? (
        <View className={styles.feedback()}>
          <Text className={styles.feedbackText()}>{emptyMessage}</Text>
        </View>
      ) : (
        <FlatList
          className={styles.list()}
          contentContainerClassName={styles.listContent()}
          data={tasks}
          keyExtractor={(task) => task.id}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          onEndReached={onLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isLoadingMore ? (
              <View className={styles.loadMore()}>
                <ActivityIndicator />
              </View>
            ) : null
          }
          renderItem={({ item }) => (
            <TaskCard
              title={item.title}
              teams={item.teams}
              description={item.description}
              status={item.status}
              onPress={() => onOpenTask(item.id)}
            />
          )}
        />
      )}

      <View className={styles.footer()}>
        <Pressable
          accessibilityRole="button"
          onPress={onCreateTask}
          className={styles.newTaskButton()}>
          <Text className={styles.newTaskLabel()}>Nova Tarefa</Text>
        </Pressable>
      </View>
    </View>
  );
};
