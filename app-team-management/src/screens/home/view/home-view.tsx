import { Pressable, Text, View } from 'react-native';

import { SearchField } from '../components/search-field/search-field';
import { TeamCard } from '../components/team-card/team-card';
import { homeStyles } from './styles';

import type { TeamTone } from '@/constants/team-colors';

export type HomeTeam = {
  id: string;
  name: string;
  tone: TeamTone;
};

export type HomeViewProps = {
  teams: readonly HomeTeam[];
  onCreateTeam: () => void;
};

export const HomeView = ({ teams, onCreateTeam }: HomeViewProps) => {
  const styles = homeStyles();

  return (
    <View className={styles.base()}>
      <View className={styles.header()}>
        <Text className={styles.title()}>Times</Text>
        <Text className={styles.subtitle()}>Acesse um dos times</Text>
      </View>

      <SearchField placeholder="Busque um time" />

      <View className={styles.list()}>
        {teams.map((team) => (
          <TeamCard key={team.id} name={team.name} tone={team.tone} />
        ))}
      </View>

      <View className={styles.footer()}>
        <Pressable
          accessibilityRole="button"
          onPress={onCreateTeam}
          className={styles.createButton()}>
          <Text className={styles.createButtonLabel()}>Criar time</Text>
        </Pressable>
      </View>
    </View>
  );
};
