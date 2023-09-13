import { useEffect, useState } from 'react'
import { Text, FAB, ListItem, Button as RNButton, Dialog, Icon } from '@rneui/themed'
import { FlatList, View, Button, Alert } from 'react-native'
import { MesaForm } from '../../components/MesaForm'
import RealmContext from '../../models'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@realm/react'


const { useRealm, useQuery, useObject } = RealmContext

export const CocinaScreen = ({ navigation }) => {

    const user = useUser()
    const realm = useRealm()
    const comandas = useQuery('Comanda').filtered(`activa == true`)
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
                onPress={() => navigation.navigate('ComandaCocina', { idComanda: item._id.toString() })}

            // onLongPress={() => navigation.navigate('Comanda', { idComanda: item.comanda })}
            >
                <Icon
                    name='room-service'
                    color={'saddlebrown'}
                />
                <ListItem.Content>
                    <ListItem.Title>
                        <Text h4>{item.mesaName}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        {item
                            ? <View>
                                {/* <Text>Pedidos: {item.pedidos.length}</Text> */}
                                {/* <Text>Total: ${item.total.toLocaleString('es-CL')}</Text> */}
                                {/* <Text>{item.comanda.fechaCreacion.toLocaleString()}</Text> */}
                                <Text>{((new Date() - item.fechaCreacion) / 60 / 1000).toFixed(0)} minutos</Text>
                                {item.pedidos.map(pedido => {
                                    return (
                                        <Text
                                            key={Math.random().toString()}
                                            style={{ textDecorationLine: pedido.entregado ? 'line-through' : 'none' }}
                                        >
                                            {pedido.cantidad} x {pedido.nombre}
                                        </Text>
                                    )
                                })}
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
        </View>
    )
}