import { Pressable, Text, View, type PressableProps } from 'react-native';

import { taskCardStyles } from './styles';

import { TeamChip } from '@/components/team-chip/team-chip';
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
          {teams.length > 0 ? (
            <View className={styles.teams()}>
              {teams.map((team) => (
                <TeamChip key={team.id} name={team.name} colorHex={team.colorHex} />
              ))}
            </View>
          ) : null}
        </View>

        <View className={styles.badge()}>
          <Text className={styles.badgeLabel()}>{TASK_STATUS_LABEL[status]}</Text>
        </View>
      </View>

      {description ? <Text className={styles.description()}>{description}</Text> : null}
    </Pressable>
  );
};
