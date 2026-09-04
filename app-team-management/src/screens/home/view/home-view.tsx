import { Text, View } from 'react-native';

import { homeStyles } from './styles';

export const HomeView = () => {
  const styles = homeStyles();

  return (
    <View className={styles.base()}>
      <Text className={styles.title()}>Team Management</Text>
      <Text className={styles.subtitle()}>NativeWind configurado com sucesso.</Text>
    </View>
  );
};
