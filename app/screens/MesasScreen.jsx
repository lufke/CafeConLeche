import { useEffect, useState } from 'react'
import { Text, FAB, ListItem, Button as RNButton, Dialog, Icon, Card } from '@rneui/themed'
import { FlatList, View, Button, Alert } from 'react-native'
import { MesaForm } from '../components/MesaForm'
import RealmContext from '../models'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useUser } from '@realm/react'


const { useRealm, useQuery, useObject } = RealmContext

export const MesasScreen = ({ navigation }) => {

    const user = useUser()
    const realm = useRealm()
    const mesas = useQuery('Mesa').sorted([['comanda.total', false], ['ubicacion', false], ['nombre', false]])
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
            <View
                style={{
                    // height: 200, 
                    width: 200,
                    // backgroundColor: 'yellow',
                    // alignContent: 'center',
                    // alignItems:'center'
                    justifyContent: 'space-around'
                }}
            >
                <ListItem
                    key={`${item._id}`}
                    // bottomDivider
                    // topDivider
                    delayHoverIn={50}
                    onPress={
                        item?.comanda
                            ? () => navigation.navigate('Comanda', { idComanda: item.comanda._id.toString() })
                            : () => handleItemSinComanda(item)
                    }
                // onLongPress={() => navigation.navigate('Comanda', { idComanda: item.comanda })}
                >

                    <Icon
                        name={item.comanda ? 'hourglass-bottom' : 'restaurant'}
                        color={item.comanda ? 'red' : 'green'}
                        size={25}
                    />
                    <ListItem.Content>
                        <ListItem.Title>
                            <Text h4>{item.nombre.toUpperCase()}</Text>
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {item.comanda
                                ? <View>
                                    <Text>Pedidos: {item.comanda.pedidos.length}</Text>
                                    <Text>Total: ${item.comanda.total.toLocaleString('es-CL')}</Text>
                                    {/* <Text>{item.comanda.fechaCreacion.toLocaleString()}</Text> */}
                                    <Text>{((new Date() - item.comanda.fechaCreacion) / 60 / 1000).toFixed(0)} minutos</Text>
                                    {/* <Text>{JSON.stringify(item)}</Text> */}
                                </View>
                                : 'SIN COMANDA'}
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </View>
        )
    }

    return (
        <View
            style={{ flex: 1 }}
        >
            {/* <MesaForm /> */}
            <FlatList
                data={mesas}
                keyExtractor={item => `${item.nombre}`}
                renderItem={renderItem}
                numColumns={2}
                ListEmptyComponent={(
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>

                        <Text h2>Sin Mesas</Text>
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
                onLongPress={() => navigation.toggleDrawer()}
            />
        </View>
    )
}