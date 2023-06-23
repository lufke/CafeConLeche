import React from 'react'
import { Text, FAB, ListItem } from '@rneui/themed'
import { FlatList, View } from 'react-native'
import { MesaForm } from '../components/MesaForm'
import RealmContext from '../models'
import { useSafeAreaInsets } from 'react-native-safe-area-context'


const { useRealm, useQuery } = RealmContext

export const MesasScreen = () => {

    const realm = useRealm()
    const mesas = useQuery('Mesa')
    const inset = useSafeAreaInsets()

    console.log(mesas)
    const mesasLista = [...mesas]
    const renderItem = ({ item }) => {
        return (
            <ListItem
                key={`${item._id}`}
                onPress={() => console.log(`${item._id}`)}
                onLongPress={() => console.log('long pressed')}
            >
                <ListItem.Content>
                    <ListItem.Title>
                        <>
                            <Text h4>{item.nombre}</Text>
                        </>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        <Text>{item.comada || 'SIN COMANDA'}</Text>
                        <Text style={{ padding: 30 }}> TOTAL: $1500</Text>
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }
    return (
        <View
            style={{ flex: 1 }}
        >
            <Text>MesasScreen</Text>
            {/* <MesaForm /> */}
            <FlatList
                data={mesas}
                keyExtractor={item => `${item.nombre}`}
                renderItem={renderItem}
                ListEmptyComponent={
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>

                        <Text h2>Sin Mesas</Text>
                    </View>
                }
            />
            <FAB
                icon={{ name: 'add', color: 'white' }}
                placement='right'
                color='green'
            />
        </View>
    )
}
