import { Ionicons } from '@expo/vector-icons';
import { styled } from 'nativewind';

export const Icon = styled(Ionicons, {
  className: 'style',
});

export type IconName = React.ComponentProps<typeof Ionicons>['name'];
