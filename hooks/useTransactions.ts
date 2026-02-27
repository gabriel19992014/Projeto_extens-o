import { TransactionsContext } from "@/contexts/transactionscontext";
import { useContext } from "react";

export const useTransactions = () => {
    const context = useContext(TransactionsContext);
    if (!context) throw new Error("Acesso inválido ao contexto de transações");
    return context;
};