import { Pressable, Text, type PressableProps } from 'react-native';

import { teamCardStyles } from './styles';

import { Icon } from '@/components/icon';

export type TeamCardTone = 'green' | 'yellow' | 'blue';

export type TeamCardProps = Omit<PressableProps, 'children' | 'style'> & {
  name: string;
  tone?: TeamCardTone;
};

export const TeamCard = ({ name, tone, ...rest }: TeamCardProps) => {
  const styles = teamCardStyles({ tone });

  return (
    <Pressable accessibilityRole="button" className={styles.base()} {...rest}>
      <Icon name="people" size={24} className={styles.avatar()} />
      <Text className={styles.name()}>{name}</Text>
      <Icon name="chevron-forward" size={20} className={styles.chevron()} />
    </Pressable>
  );
};
