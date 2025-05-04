import { Text, ListItem, Icon } from '@rneui/themed'
import { FlatList, View, } from 'react-native'
import RealmContext from '../../models'


const { useQuery } = RealmContext

export const CocinaScreen = ({ navigation }) => {

    const comandas = useQuery('Comanda').filtered(`activa == true`)

    const renderItem = ({ item }) => {
        return (
            <ListItem
                key={`${item._id}`}
                bottomDivider
                onPress={() => navigation.navigate('ComandaCocina', { idComanda: item._id.toString() })}

            >
                <Icon
                    name='room-service'
                    color={'saddlebrown'}
                />
                <ListItem.Content>
                    <ListItem.Title>
                        <Text h4>{item.mesaName.toUpperCase()}</Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        {item
                            ? <View>
                                <Text
                                    style={{ color: 'red' }}
                                >{((new Date() - item.fechaCreacion) / 60 / 1000).toFixed(0)} minutos</Text>
                                {item.pedidos.map(pedido => {
                                    return (
                                        <Text
                                            key={Math.random().toString()}
                                            style={{ textDecorationLine: pedido.entregado ? 'line-through' : 'none' }}
                                        >
                                            {pedido.cantidad} x {pedido.nombre.toUpperCase()}
                                        </Text>
                                    )
                                })}
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