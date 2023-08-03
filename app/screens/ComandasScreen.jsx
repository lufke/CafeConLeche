import { useEffect, useState } from 'react'
import { Text, FAB, ListItem, Button as RNButton, Dialog, Icon } from '@rneui/themed'
import { FlatList, View, Button, Alert } from 'react-native'
import { MesaForm } from '../components/MesaForm'
import RealmContext from '../models'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@realm/react'


const { useRealm, useQuery, useObject } = RealmContext

export const ComandasScreen = ({ navigation }) => {

    const user = useUser()
    const realm = useRealm()
    const comandas = useQuery('Comanda')
    const inset = useSafeAreaInsets()

    const [dialogVisible, setDialogVisible] = useState(false)
    const [mesaSeleccionada, setMesaSeleccionada] = useState({})


    const handleNewComanda = () => {
        console.log(mesaSeleccionada)
        let newComanda = {}
        realm.write(() => {
            newComanda = realm.create('Comanda', {
                mesa: mesaSeleccionada._id.toString(),
                creador: user.id
            })
        })
        console.log(newComanda)
        navigation.navigate('Comanda', { idComanda: `${newComanda._id}`, nuevaComanda: true })
    }

    const handleItemSinComanda = (item) => {
        setMesaSeleccionada(item)
        toggleDialog()
    }

    const toggleDialog = () => setDialogVisible(!dialogVisible)

    const renderItem = ({ item }) => {
        return (
            <ListItem
                key={`${item._id}`}
                bottomDivider
                onPress={
                    item?.comanda
                        ? () => navigation.navigate('Comanda', { idComanda: item.comanda._id.toString() })
                        : () => handleItemSinComanda(item)
                }

            // onLongPress={() => navigation.navigate('Comanda', { idComanda: item.comanda })}
            >
                <Icon
                    name='room-service'
                    color={'green'}
                />
                <ListItem.Content>
                    <ListItem.Title>
                        <Text h4>Total: ${item.total.toLocaleString('es-CL')}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        {item
                            ? <View>
                                <Text>Pedidos: {item.pedidos.length}</Text>
                                {/* <Text>Total: ${item.total.toLocaleString('es-CL')}</Text> */}
                                {/* <Text>{item.comanda.fechaCreacion.toLocaleString()}</Text> */}
                                <Text>{((new Date() - item.fechaCreacion) / 60 / 1000).toFixed(0)} minutos</Text>
                                <Text>{JSON.stringify(item.pedidos)}</Text>
                                {/* <Text>{JSON.stringify(item)}</Text> */}
                            </View>
                            : 'SIN COMANDA'}
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }

    return (
        <View
            style={{ flex: 1 }}
        >
            {/* <MesaForm /> */}
            <FlatList
                data={comandas}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                separ
                ListEmptyComponent={(
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>

                        <Text h2>Sin Comandas</Text>
                    </View>
                )}
            />
            <Dialog
                isVisible={dialogVisible}
                onBackdropPress={toggleDialog}
            >
                <Dialog.Title title={<Text>¿Desea crear una nueva comanda para: {mesaSeleccionada?.nombre?.toUpperCase()} ?</Text>} />
                <Dialog.Actions>
                    <Dialog.Button
                        title={'SI'}
                        onPress={() => handleNewComanda()}
                    />
                    <Dialog.Button
                        title={'NO'}
                        onPress={toggleDialog}
                    />
                </Dialog.Actions>
            </Dialog>
            <FAB
                icon={{ name: 'add', color: 'white' }}
                placement='right'
                onPress={() => navigation.navigate('NuevaMesa')}
            />
        </View>
    )
}