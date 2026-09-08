import { TextInput, View, type TextInputProps } from 'react-native';

import { searchFieldStyles } from './styles';

import { Icon } from '@/components/icon';

export type SearchFieldProps = Omit<TextInputProps, 'style'>;

export const SearchField = (props: SearchFieldProps) => {
  const styles = searchFieldStyles();

  return (
    <View className={styles.base()}>
      <TextInput className={styles.input()} {...props} />
      <Icon name="search" size={22} className={styles.icon()} />
    </View>
  );
};
