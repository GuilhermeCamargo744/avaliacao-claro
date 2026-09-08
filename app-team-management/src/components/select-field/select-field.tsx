import { useState } from 'react';
import { Keyboard, Modal, Pressable, ScrollView, Text, View } from 'react-native';

import { selectFieldStyles } from './styles';

import { Icon } from '@/components/icon';

export type SelectOption = {
  value: string;
  label: string;
};

export type SelectFieldProps = {
  label: string;
  placeholder: string;
  options: readonly SelectOption[];
  value?: string;
  onChange: (value: string) => void;
};

export const SelectField = ({ label, placeholder, options, value, onChange }: SelectFieldProps) => {
  const [isOpen, setOpen] = useState(false);
  const selected = options.find((option) => option.value === value);
  const styles = selectFieldStyles({ filled: Boolean(selected) });

  const select = (next: string) => {
    onChange(next);
    setOpen(false);
  };

  return (
    <>
      <View className={styles.field()}>
        <Text className={styles.caption()}>{label}</Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={label}
          onPress={() => {
            Keyboard.dismiss();
            setOpen(true);
          }}
          className={styles.base()}>
          <Text className={styles.label()}>{selected?.label ?? placeholder}</Text>
          <Icon name="chevron-down" size={20} className={styles.icon()} />
        </Pressable>
      </View>

      <Modal visible={isOpen} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable
          accessibilityLabel="Fechar"
          onPress={() => setOpen(false)}
          className={styles.backdrop()}>
          <Pressable className={styles.sheet()}>
            <Text className={styles.sheetTitle()}>{placeholder}</Text>

            <ScrollView>
              {options.map((option) => (
                <Pressable
                  key={option.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected: option.value === value }}
                  onPress={() => select(option.value)}
                  className={selectFieldStyles({ selected: option.value === value }).option()}>
                  <Text className={styles.optionLabel()}>{option.label}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};
