import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import styles from './styles';

interface ButtonProps {
  title: string;
  variant?: 'primary' | 'outline' | 'danger';
  loading?: boolean;
  onPress: () => void;
};

const Button: React.FC<ButtonProps> = ({ title, variant = 'primary', loading, onPress }) => {
  const variantColorMap = {
    primary: '#2c5f30',
    outline: '#fdfdfd',
    danger: '#c0392b',
  }
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        { backgroundColor: variantColorMap[variant] ,
          borderColor: variant !== 'outline' ? variantColorMap[variant] : variantColorMap.primary,
        borderWidth: 2
        }
      ]}
    >
      {
        loading ? (
          <ActivityIndicator color={variant === 'outline' ? 
            variantColorMap.primary: '#fff'} style={{width: 100}}/>
        ) : (
          <Text style={[styles.buttonText,
           { color: variant === 'outline' ? variantColorMap.primary: '#fff' }]}>
            {title}
          </Text>
        )
      }
    </Pressable>
  )
}

export default Button