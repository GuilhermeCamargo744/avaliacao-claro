import { Pressable, Text, View, type PressableProps } from 'react-native';

import { taskCardStyles } from './styles';

import { TASK_STATUS_LABEL } from '@/constants/task-status';
import type { TaskStatus, TaskTeam } from '@/models/tasks/interface-tasks';

export type TaskCardProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  teams: readonly TaskTeam[];
  description: string | null;
  status: TaskStatus;
};

export const TaskCard = ({ title, teams, description, status, ...rest }: TaskCardProps) => {
  const styles = taskCardStyles({ status });

  return (
    <Pressable accessibilityRole="button" className={styles.base()} {...rest}>
      <View className={styles.head()}>
        <View className={styles.heading()}>
          <Text className={styles.title()}>{title}</Text>
          <Text className={styles.teamName()}>{teams.map((team) => team.name).join(', ')}</Text>
        </View>

        <View className={styles.badge()}>
          <Text className={styles.badgeLabel()}>{TASK_STATUS_LABEL[status]}</Text>
        </View>
      </View>

      {description ? <Text className={styles.description()}>{description}</Text> : null}
    </Pressable>
  );
};
