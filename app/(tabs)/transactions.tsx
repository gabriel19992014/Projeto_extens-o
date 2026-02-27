import TransactionListItem from "@/componentes/TransactionListItem/TransactionListItem";
import { Transaction } from "@/entities/transactions";
import { useTransactions } from "@/hooks/useTransactions";
import { globalstyles } from "@/styles/global";
import { FlatList, Text, View } from "react-native";

const renderTransaction = ({ item }: { item: Transaction }) => (
    <TransactionListItem transaction={item} />
);

const TransactionsScreen = () => {
    const {transactions} =  useTransactions()
    return (
        <View style={globalstyles.container}>
            <Text style={globalstyles.sectionTitle}>Todas as Transações</Text>
            <FlatList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={renderTransaction}
            />
        </View>
    )
}

export default TransactionsScreen