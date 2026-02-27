import Button from "@/componentes/Button";
import { TransactionModal } from "@/componentes/TransactionModal";
import { useTransactions } from "@/hooks/useTransactions";
import { globalstyles } from "@/styles/global";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View } from "react-native";

const TransactionsScreen = () => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const { findTransactionById, updateTransaction, deleteTransaction } = useTransactions();
    const [isModalOpen, setModalOpen] = useState(false)
    const router = useRouter();

    const transaction = findTransactionById ? findTransactionById(id) : undefined;

    if (!transaction) return null


    const handleSave = (data: { description: string; amount: number; referenceDate: Date }) => {
        if (updateTransaction) {
            updateTransaction(id, data);
        }
        setModalOpen(false);
    };

    const handleClose = () => {
        setModalOpen(false);
    };

    const handleDelete = () => { 
        if (deleteTransaction) {
            deleteTransaction(id);
        }
        router.replace('/transactions');
    };

    return (
        <View style={globalstyles.container}>
            <Stack.Screen options={{ title: `Transação ${id}` }} />
            <Text style={globalstyles.sectionTitle}>{transaction.description}</Text>

            <Text style={globalstyles.sectionTitle}>R$ {transaction.amount.toFixed(2)}</Text>

            <Text style={globalstyles.sectionTitle}>
                {new Date(transaction.referenceDate).toLocaleString("pt-BR")}
            </Text>

            <View style={[globalstyles.buttonsContainer, { marginTop: 20 }]}>
                <Button title="Editar"
                variant="outline"
                    onPress={() => setModalOpen(true)} />

                <Button title="Excluir"
                variant="danger"
                    onPress={handleDelete}/>
            </View>

            <TransactionModal
                visible={isModalOpen}
                initialDescription={transaction.description}
                initialAmount={transaction.amount.toString()}
                initialReferenceDate={transaction.referenceDate.toISOString()}
                onSave={handleSave}
                onClose={handleClose}
            />
        </View>
    )
};

export default TransactionsScreen;