import { Text, View } from 'react-native';

export const HomeView = () => {
  return (
    <View className="flex-1 items-center justify-center gap-2 bg-background p-4">
      <Text className="text-2xl font-semibold text-text">Team Management</Text>
      <Text className="text-base text-text-secondary">NativeWind configurado com sucesso.</Text>
    </View>
  );
};
