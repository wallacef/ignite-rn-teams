import { useState } from 'react';
import { useNavigation } from '@react-navigation/native'

import { Button } from "@components/Button";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";

import { Container, Content, Icon } from "./styles";
import { groupCreate } from '@storage/group/groupCreate';
import { AppError } from '@utils/AppError';
import { Alert } from 'react-native';

export function NewGroup() {
    const [groupName, setGroupName] = useState('')
    const navigation = useNavigation()

    async function handleNew() {
        try {
            if(!groupName.trim().length) {
                return Alert.alert('Novo Grupo', 'Informe o nome da turma.')
            }
            await groupCreate(groupName)
            navigation.navigate('players', { group: groupName })
        } catch (error) {
            if(error instanceof AppError) {
                Alert.alert('Novo Grupo', error.message)
            } else {
                Alert.alert('Novo Grupo', 'Não foi possível criar um novo grupo.')
                console.log(error)
            }
        }
    }

    return (
        <Container>
            <Header showBackButton />
            <Content>
                <Icon />
                <Highlight
                    title='Nova turma'
                    subtitle='Crie a turma para adicionar as pessoas'
                />
                <Input
                    value={groupName}
                    placeholder='Nome da turma'
                    onChangeText={text => setGroupName(text)}
                />
                <Button
                    title='Criar'
                    onPress={handleNew}
                    spaced
                />
            </Content>
        </Container>
    )
}