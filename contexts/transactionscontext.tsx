import { Transaction } from "@/entities/transactions";
import * as SecureStore from 'expo-secure-store';
import React, { createContext, ReactNode, useEffect, useState } from "react";

const initialTransactions: Transaction[] = [];

type TransactionInput = { description: string; amount: number; referenceDate?: Date };

type TransactionsContextProps = {
    balance: number;
    transactions: Transaction[];
    addTransaction: (data: TransactionInput) => Promise<Transaction>;
    getLastTransactions: (limit?: number) => Transaction[];
    findTransactionById?: (id: string) => Transaction | undefined;
    updateTransaction?: (id: string, attributes: Partial<TransactionInput>) => void;
    deleteTransaction?: (id: string) => void;
};

export const TransactionsContext = createContext<TransactionsContextProps | null>(null)

export const TransactionsContextProvider: React.FC<{
    children: ReactNode
}> = ({ children }) => {

    const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
    // estados de transações
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    // calcula saldo de transações
    const getLastTransactions = (limit = 5) => {
        return [...transactions]
            .sort((a, b) => b.referenceDate.getTime() - a.referenceDate.getTime())
            .slice(0, limit);
    };

    const STORAGE_KEY = 'fin-app-transactions';

    useEffect(() => {
        const loadItems = async () => {
            try {
                const stored = await SecureStore.getItemAsync(STORAGE_KEY);
                if (stored) {
                    const transactionsArray = JSON.parse(stored).map(
                        (t: Transaction) => ({ ...t, referenceDate: new Date(t.referenceDate) })
                    );
                    setTransactions(transactionsArray);
                } else {
                    setTransactions(initialTransactions);
                    await SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(initialTransactions));
                }
            } catch (error) {
                console.warn('Falha ao carregar SecureStore, usando dados locais:', error);
                setTransactions(initialTransactions);
            }
        };
        loadItems();
    }, []);

    const persist = (items: Transaction[]) => {
        SecureStore.setItemAsync(STORAGE_KEY, JSON.stringify(items)).catch(error =>
            console.warn('Erro ao persistir no SecureStore:', error)
        );
    };

    const addTransaction = async (data: TransactionInput) => {
        const newTransaction: Transaction = {
            id: Math.floor(Math.random() * 99999).toString(),
            description: data.description,
            amount: data.amount,
            referenceDate: data.referenceDate ?? new Date(),
        };
        setTransactions(current => {
            const updated = [...current, newTransaction];
            persist(updated);
            return updated;
        });
        return newTransaction;
    };

    const updateTransaction = async (
        id: string,
        attributes: Partial<TransactionInput>
    ) => {
        setTransactions(current => {
            const updated = current.map(t =>
                t.id === id ? { ...t, ...attributes, id: t.id } : t
            );
            persist(updated);
            return updated;
        });
    };

    const findTransactionById = (id: string) => {
        return transactions.find(t => t.id === id);
    };

    const deleteTransaction = async (id: string) => {
        setTransactions(current => {
            const updated = current.filter(t => t.id !== id);
            persist(updated);
            return updated;
        });
    };


    return (
        <TransactionsContext.Provider
            value={{
                balance,
                transactions,
                addTransaction,
                getLastTransactions,
                findTransactionById,
                updateTransaction,
                deleteTransaction,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}
