import { Text, ListItem, Icon } from '@rneui/themed'
import { FlatList, View, Alert, Dimensions, StyleSheet } from 'react-native'
import RealmContext from '../../models'
import { useUser } from '@realm/react'

const { useRealm, useQuery } = RealmContext

export const MesasScreen = ({ navigation }) => {

    const user = useUser()
    const realm = useRealm()
    const mesas = useQuery('Mesa').sorted([['comanda.total', false], ['ubicacion', false], ['nombre', false]])

    const handleNewComanda = (item) => {
        let newComanda = {}
        realm.write(() => {
            newComanda = realm.create('Comanda', {
                mesa: item._id.toString(),
                creador: user.id,
                mesaName: item.nombre
            })
        })
        navigation.navigate('Comanda', { idComanda: `${newComanda._id}`, nuevaComanda: true })
    }

    const renderItem = ({ item }) => {
        return (
            <View
                style={styles.mesaCuadro}

            >
                <ListItem
                    key={`${item._id}`}
                    delayHoverIn={50}
                    onPress={
                        item?.comanda
                            ? () => navigation.navigate('Comanda', { idComanda: item.comanda._id.toString() })
                            : () => Alert.alert(
                                'Atención',
                                `¿Desea crear comanda para ${item.nombre.toUpperCase()}?`,
                                [
                                    { text: 'CANCELAR' },
                                    {
                                        text: 'ACEPTAR',
                                        onPress: () => handleNewComanda(item)
                                    }
                                ],
                                {
                                    cancelable: true
                                })
                    }
                >
                    <Icon
                        name={item.comanda ? 'hourglass-bottom' : 'local-cafe'}
                        color={item.comanda ? 'red' : 'saddlebrown'}
                        size={25}
                    />
                    <ListItem.Content>
                        <ListItem.Title>
                            <Text h4>{item.nombre.toUpperCase()}</Text>
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            {item.comanda
                                ? <View
                                // style={{ flexDirection: "column" }}
                                
                                >
                                    <Text>Pedidos: {item.comanda.pedidos.length}</Text>
                                    <Text>Total: ${item.comanda.total.toLocaleString('es-CL')}</Text>
                                    <Text>{((new Date() - item.comanda.fechaCreacion) / 60 / 1000).toFixed(0)} minutos</Text>
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
            <FlatList
                data={mesas}
                keyExtractor={item => `${item.nombre}`}
                renderItem={renderItem}
                numColumns={2}
                ListEmptyComponent={(
                    <View
                        >
                        <Text h2>Sin Mesas</Text>
                    </View>
                )}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    mesaCuadro: {
        width: Dimensions.get('window').width / 2,
        justifyContent: 'space-around'
    }
})