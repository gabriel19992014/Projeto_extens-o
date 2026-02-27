import React, { useState } from "react";
import { Modal, Pressable, Switch, Text, TextInput, View } from "react-native";
import Button from "../Button";
import { styles } from "./styles";


interface TransactionModalProps {
    visible: boolean;
    initialDescription?: string;
    initialAmount?: string;
    initialReferenceDate?: string;
    onClose: () => void;
    onSave: (data: { description: string; amount: number; referenceDate: Date }) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
    visible,
    onSave,
    initialAmount,
    initialDescription,
    initialReferenceDate,
    onClose,
}) => {
    const [description, setDescription] = useState(initialDescription ?? "");
    const [amount, setAmount] = useState(initialAmount ?? " ")
    const [referenceDate, setreferenceDate] = useState(initialReferenceDate ?? '')
    const [datetimeDetail, setDatetimeDetail] =  useState (false)
    const [ isloading, setIsLoanding ] = useState (false)

    const handleSave = async () => {
        setIsLoanding(true)
        
        onSave({
             description: description, 
             amount: Number(amount),
            referenceDate: datetimeDetail? new Date( referenceDate) : new Date()
            })
        setDescription ("")
        setAmount ("")
        setreferenceDate ("")
        setIsLoanding(false)
        onClose()
    }

    return (
        <Modal visible={visible} >
            <View style={styles.modalContent}>
                <Text style={styles.title}> Adicionar transação</Text>

                <Text> Descrição</Text>
                <TextInput
                    placeholder="Insira uma descrição"
                    style={styles.textInput}
                    value={description}
                    onChangeText={Text => setDescription(Text)}
                    returnKeyType="next"
                />

                <Text> Valor</Text>
                <TextInput
                    placeholder="Insira um valor"
                    style={styles.textInput}
                    returnKeyType="default"
                    keyboardType="numeric"
                    value={amount}
                    onChangeText={text => setAmount(text)}
                />

                <View style = {{marginBottom: 20}}>
                    <Text> Detalhar data e hora?</Text>
                    <Switch
                    style={{marginRight: 'auto'}} 
                    value={datetimeDetail}
                    onValueChange={newValue => setDatetimeDetail(newValue)}
                    />

                    {datetimeDetail && 
                    <TextInput 
                    placeholder="Informe a data e Hora" 
                    style={styles.textInput}
                    value={referenceDate}
                    onChangeText = {text => setreferenceDate(text)}
                    />}
                </View>


                <View style={styles.buttonsContainer}>
                    <Button title="Salvar Transação" loading = {isloading} onPress={handleSave} />

                    <Pressable style={styles.closeButton} onPress={onClose}>
                        <Text style={styles.closeButtonText}>Fechar</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    )
}