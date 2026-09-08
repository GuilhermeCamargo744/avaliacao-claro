import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { TeamCard } from '../components/team-card/team-card';
import { homeStyles } from './styles';

import { SearchField } from '@/components/search-field/search-field';
import type { TeamTone } from '@/constants/team-colors';

export type HomeTeam = {
  id: string;
  name: string;
  tone: TeamTone;
};

export type HomeViewProps = {
  teams: readonly HomeTeam[];
  searchTerm: string;
  isLoading: boolean;
  errorMessage: string | null;
  onSearchTermChange: (value: string) => void;
  onRetry: () => void;
  onCreateTeam: () => void;
  onOpenTasks: () => void;
  onOpenTeam: (id: string) => void;
  onEditTeam: (id: string) => void;
};

export const HomeView = ({
  teams,
  searchTerm,
  isLoading,
  errorMessage,
  onSearchTermChange,
  onRetry,
  onCreateTeam,
  onOpenTasks,
  onOpenTeam,
  onEditTeam,
}: HomeViewProps) => {
  const styles = homeStyles();

  return (
    <View className={styles.base()}>
      <View className={styles.header()}>
        <Text className={styles.title()}>Times</Text>
        <Text className={styles.subtitle()}>Acesse um dos times</Text>
      </View>

      <SearchField
        placeholder="Busque um time"
        value={searchTerm}
        onChangeText={onSearchTermChange}
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        clearButtonMode="while-editing"
      />

      {isLoading ? (
        <View className={styles.feedback()}>
          <ActivityIndicator />
        </View>
      ) : errorMessage ? (
        <View className={styles.feedback()}>
          <Text className={styles.feedbackText()}>{errorMessage}</Text>
          <Pressable accessibilityRole="button" onPress={onRetry} className={styles.retryButton()}>
            <Text className={styles.retryLabel()}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : teams.length === 0 ? (
        <View className={styles.feedback()}>
          <Text className={styles.feedbackText()}>
            {searchTerm ? 'Nenhum time encontrado.' : 'Nenhum time ainda. Crie o primeiro.'}
          </Text>
        </View>
      ) : (
        <ScrollView
          className={styles.list()}
          contentContainerClassName={styles.listContent()}
          keyboardShouldPersistTaps="handled">
          {teams.map((team) => (
            <TeamCard
              key={team.id}
              name={team.name}
              tone={team.tone}
              onPress={() => onOpenTeam(team.id)}
              onEdit={() => onEditTeam(team.id)}
            />
          ))}
        </ScrollView>
      )}

      <View className={styles.footer()}>
        <Pressable
          accessibilityRole="button"
          onPress={onOpenTasks}
          className={styles.tasksButton()}>
          <Text className={styles.tasksButtonLabel()}>Todas as tarefas</Text>
        </Pressable>
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
