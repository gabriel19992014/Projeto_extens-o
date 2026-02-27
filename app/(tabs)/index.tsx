import Button from '@/componentes/Button';
import TransactionListItem from '@/componentes/TransactionListItem/TransactionListItem';
import { TransactionModal } from '@/componentes/TransactionModal';
import { useTransactions } from '@/hooks/useTransactions';
import { globalstyles } from '@/styles/global';
import * as SecureStore from 'expo-secure-store';
import React, { useEffect, useState } from 'react';
import { Image, ScrollView, Text, TextInput, View } from 'react-native';


export default function Index() {
  const [isModalOpen, setModalOpen] = useState(false);
  const { balance, addTransaction, getLastTransactions } = useTransactions();
  const [identity, setIdentity] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState('');

  useEffect(() => {
    SecureStore.getItemAsync('fin-app-id').then(value => setIdentity(value));
  }, []);

  // if user hasn't set identity yet, show simple form
  if (!identity) {
    return (
      <View
        style={[
          globalstyles.container,
          { flex: 1, alignItems: 'center', justifyContent: 'center' },
        ]}
      >
        <Text style={globalstyles.sectionTitle}>Identifique-se</Text>

        <TextInput
          placeholder="Digite seu nome"
          value={nameInput}
          onChangeText={text => setNameInput(text)}
          style={{ marginVertical: 20 }}
        />
        <Button
          title="Entrar"
          onPress={async () => {
            await SecureStore.setItemAsync('fin-app-id', nameInput);
            setIdentity(nameInput);
          }}
        />
      </View>
    );
  }

  const handleAddIncome = (data: { description: string; amount: number; referenceDate: Date }) => {
    addTransaction(data);
    alert('transação salva com sucesso!');
  };

  {/*const handleAddExpense = () => {
    alert("Adicionar Despesa");
  };*/}


  return (
    <View style={globalstyles.container}>
      <Image source={require('@/assets/images/image (17).png')}
        style={globalstyles.logo} />
      <Text style={globalstyles.greeting}>
        Olá, {identity || 'Bem vindo'}!
      </Text>
      <Text style={globalstyles.balanceLabel}>
        Saldo Atual
      </Text>
      <Text style={globalstyles.balance}>
        R$ {balance.toFixed(2)}
      </Text>

      <View style={globalstyles.buttonsContainer}>
        <Button title="Adicionar Receita"
          onPress={() => setModalOpen(true)} />

        {/*<PrimaryButton title="adicionar despesa"
          onPress={handleAddExpense} />*/}

        {/*<ActivityIndicator color={'red'} size={'large'} />*/}

        <TransactionModal visible={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSave={handleAddIncome} />

      </View>

      <Text style={globalstyles.sectionTitle}>
        Transações Recentes
      </Text>

      <ScrollView>
        {getLastTransactions().map(transaction => (
          <TransactionListItem key={transaction.id} transaction={transaction} />
        ))}
      </ScrollView>
    </View>
  );
}