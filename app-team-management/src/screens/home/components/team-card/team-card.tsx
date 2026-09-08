import { Pressable, Text, View, type PressableProps } from 'react-native';

import { teamCardStyles } from './styles';

import { Icon } from '@/components/icon';
import type { TeamTone } from '@/constants/team-colors';

export type TeamCardProps = Omit<PressableProps, 'children' | 'style'> & {
  name: string;
  tone?: TeamTone;
  onEdit: () => void;
};

export const TeamCard = ({ name, tone, onEdit, onPress, ...rest }: TeamCardProps) => {
  const styles = teamCardStyles({ tone });

  return (
    <View className={styles.base()}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={name}
        onPress={onPress}
        className={styles.main()}
        {...rest}>
        <Icon name="people" size={24} className={styles.avatar()} />
        <Text className={styles.name()}>{name}</Text>
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Editar time"
        onPress={onEdit}
        className={styles.editButton()}>
        <Icon name="create-outline" size={22} className={styles.editIcon()} />
      </Pressable>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={name}
        onPress={onPress}
        className={styles.chevronButton()}>
        <Icon name="chevron-forward" size={20} className={styles.chevron()} />
      </Pressable>
    </View>
  );
};
