import { Text, View } from 'react-native';
import type { ToastConfig } from 'react-native-toast-message';

import { toastStyles } from './styles';

import { Icon, type IconName } from '@/components/icon';

type ToastBodyProps = {
  tone: 'success' | 'error';
  icon: IconName;
  message: string;
};

const ToastBody = ({ tone, icon, message }: ToastBodyProps) => {
  const styles = toastStyles({ tone });

  return (
    <View className={styles.base()}>
      <Icon name={icon} size={22} className={styles.icon()} />
      <Text className={styles.message()} numberOfLines={3}>
        {message}
      </Text>
    </View>
  );
};

export const toastConfig: ToastConfig = {
  success: ({ text1 }) => <ToastBody tone="success" icon="checkmark-circle" message={text1 ?? ''} />,
  error: ({ text1 }) => <ToastBody tone="error" icon="alert-circle" message={text1 ?? ''} />,
};
