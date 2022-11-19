import { FlatList, Alert } from 'react-native'
import { useState } from 'react'
import { useRoute, useNavigation } from '@react-navigation/native'

import { ButtonIcon } from "@components/ButtonIcon";
import { Filter } from "@components/Filter";
import { Header } from "@components/Header";
import { Highlight } from "@components/Highlight";
import { Input } from "@components/Input";
import { PlayerCard } from "@components/PlayerCard";
import { ListEmpty } from '@components/ListEmpty';
import { Button } from '@components/Button';

import {
    Container,
    Form,
    HeaderList,
    NumberOfPlayers
} from './styles'
import { AppError } from '@utils/AppError';
import { Loading } from '@components/Loading';
import { playerAddByGroup } from '@storage/player/playerAddByGroup';
import { playersGetByGroupAndTem } from '@storage/player/playersGetByGroupAndTeam';
import { PlayerStorageDTO } from '@storage/player/playerStorageDTO';
import { useEffect } from 'react';
import { useRef } from 'react';
import { TextInput } from 'react-native';
import { playerRemoveByGroup } from '@storage/player/playerRemoveByGroup';
import { groupRemoveByName } from '@storage/group/groupRemoveByName';

type RouteParams = {
    group: string
}

export function Players() {
    const [isLoading, setIsLoading] = useState(true);
    const [playerName, setPlayerName] = useState('')
    const [team, setTeam] = useState('Time A')
    const [players, setPlayers] = useState<PlayerStorageDTO[]>([])

    const navigation = useNavigation()
    const route = useRoute()
    const { group } = route.params as RouteParams

    const newPlayerNameInputRef = useRef<TextInput>(null)

    async function handleAddPlayer() {
        if (!playerName.trim().length) {
            return Alert.alert('Nova pessoa', 'Informe o nome da pessoa para adicionar.')
        }

        const newPlayer = {
            name: playerName,
            team
        }

        try {
            await playerAddByGroup(newPlayer, group)
            newPlayerNameInputRef.current?.blur()
            fetchPlayersByTeam()
            setPlayerName('')
        } catch (error) {
            if (error instanceof AppError) {
                Alert.alert('Nova pessoa', error.message)
            } else {
                Alert.alert('Nova pessoa', 'Não foi possível adicionar.')
                throw error
            }
        }
    }

    async function handlePlayerRemove(playerName: string) {
        try {
            await playerRemoveByGroup(playerName, group)
            fetchPlayersByTeam()
        } catch (error) {
            Alert.alert('Remover pessoa', 'Não foi possível remover a pessoa.')
            throw error
        }
    }

    async function fetchPlayersByTeam() {
        try {
            setIsLoading(true);
            const playersByTeam = await playersGetByGroupAndTem(group, team)
            setPlayers(playersByTeam)
            setIsLoading(false);
        } catch (error) {
            Alert.alert('Pessoas', 'Não foi possível carregar as pessoas.')
            throw error
        } finally {
            setIsLoading(false);
        }
    }

    async function groupRemove() {
        try {
            await groupRemoveByName(group);
            navigation.navigate('groups');

        } catch (error) {
            console.log(error);
            Alert.alert('Remover Grupo', 'Não foi posível remover o grupo');
        }
    }

    async function handleGroupRemove() {
        Alert.alert(
            'Remover',
            'Deseja remover a turma?',
            [
                { text: 'Não', style: 'cancel' },
                { text: 'Sim', onPress: () => groupRemove() }
            ]
        )
    }

    useEffect(() => {
        fetchPlayersByTeam()
    }, [group, team])

    return (
        <Container>
            <Header showBackButton />
            <Highlight
                title={group}
                subtitle='adicione a galera e separe os times'
            />
            <Form>
                <Input
                    value={playerName}
                    autoCorrect={false}
                    inputRef={newPlayerNameInputRef}
                    placeholder="Nome da pessoa"
                    onChangeText={text => setPlayerName(text)}
                    onSubmitEditing={handleAddPlayer}
                    returnKeyType='done'
                />
                <ButtonIcon
                    icon="add"
                    onPress={handleAddPlayer}
                />
            </Form>
            <HeaderList>
                <FlatList
                    horizontal
                    data={['Time A', 'Time B']}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <Filter
                            title={item}
                            isActive={team === item}
                            onPress={() => setTeam(item)}
                        />
                    )}
                />
                <NumberOfPlayers>
                    {players.length}
                </NumberOfPlayers>
            </HeaderList>
            {isLoading ? <Loading />
                : (
                    <FlatList
                        data={players}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={[
                            { paddingBottom: 100 },
                            players.length === 0 && { flex: 1 }
                        ]}
                        keyExtractor={item => item.name}
                        renderItem={({ item }) => (
                            <PlayerCard
                                onRemove={() => handlePlayerRemove(item.name)}
                                name={item.name}
                            />
                        )}
                        ListEmptyComponent={() => (
                            <ListEmpty
                                message='Não há pessoas nesse time.'
                            />
                        )}
                    />
                )}
            <Button
                title='Remover Turma'
                type='SECONDARY'
                onPress={handleGroupRemove}
            />
        </Container>
    )
}