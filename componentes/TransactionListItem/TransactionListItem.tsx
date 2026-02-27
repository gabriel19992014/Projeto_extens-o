import { useRouter } from 'expo-router';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Transaction } from '../../entities/transactions';
import { styles } from './styles';

interface TransactionListItemProps {
  transaction: Transaction;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction }) => {
  const router = useRouter();
  const handlePress = () => {
    router.push({ pathname: '/transactions/[id]', params: { id: transaction.id } });
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View>
        <Text style={styles.title}>{transaction.description}</Text>
        <Text style={styles.value}>R$ {transaction.amount.toFixed(2)}</Text>
        <Text style={styles.date}>{new Date(transaction.referenceDate).toLocaleString('pt-BR')}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(TransactionListItem);