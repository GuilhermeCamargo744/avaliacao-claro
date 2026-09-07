import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { TaskCard } from '../components/task-card/task-card';
import { homeTeamTasksStyles } from './styles';

import { Icon } from '@/components/icon';
import type { Task } from '@/models/tasks/interface-tasks';

export type HomeTeamTasksViewProps = {
  tasks: readonly Task[];
  isLoading: boolean;
  errorMessage: string | null;
  onBack: () => void;
  onCreateTask: () => void;
};

export const HomeTeamTasksView = ({
  tasks,
  isLoading,
  errorMessage,
  onBack,
  onCreateTask,
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
        <Text className={styles.subtitle()}>adicione a galera e separe os times</Text>
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
          <Text className={styles.feedbackText()}>Nenhuma tarefa ainda.</Text>
        </View>
      ) : (
        <ScrollView className={styles.list()} contentContainerClassName={styles.listContent()}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              teams={task.teams}
              description={task.description}
              status={task.status}
            />
          ))}
        </ScrollView>
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
