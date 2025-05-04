import { Text, ListItem, } from "@rneui/themed"
import { useEffect } from "react"
import RealmContext from '../../models'
import { BSON } from "realm"
import { categorias } from '../../utils/categories'
import { FlatList, View } from "react-native"

const { useRealm, useObject } = RealmContext

// console.log(categorias)
export const ComandaCocinaScreen = ({ route, navigation }) => {
    categoriasSinExtra = categorias.filter((item) => item.nombre != 'Extra')
    const realm = useRealm()
    const idComanda = route.params.idComanda
    const comanda = useObject('Comanda', BSON.ObjectId(idComanda))

    useEffect(() => {
        navigation.setOptions({ title: `COMANDA: ${comanda.mesaName.toUpperCase()}` })
    }, [])

    const confirmaEntregaPedido = item => {
        console.log(item)
        realm.write(() => {
            item.entregado = !item.entregado
        })

    }

    const renderComandaItem = ({ item }) => {
        return (
            <ListItem
                bottomDivider
                key={`${item._id}`}
            // onPress={() => console.log(item)}
            >
                <ListItem.CheckBox
                    checked={item.entregado}
                    onIconPress={() => confirmaEntregaPedido(item)}
                />
                <ListItem.Content>
                    <ListItem.Title>{item.cantidad} x {item.nombre.toUpperCase()}</ListItem.Title>
                    <ListItem.Subtitle>
                        <View>
                            {item.extras.length ? (
                                <View>
                                    {item.extras.map(item => {
                                        return (
                                            <Text
                                                key={`${item._id}`}
                                            >
                                                (+) {item.cantidad} x {item.nombre.toUpperCase()}
                                            </Text>
                                        )
                                    })}
                                </View>
                            )
                                : null}
                        </View>
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>)
    }


    return (
        <>
            <Text h3 h3Style={{ color: 'saddlebrown', textAlign: 'center' }}>{comanda.mesaName.toUpperCase()}</Text>
            <FlatList
                data={comanda?.pedidos}
                renderItem={renderComandaItem}
                ListEmptyComponent={<Text h2 style={{ textAlign: 'center' }}>SIN PEDIDOS</Text>}
            />
        </>
    )
}
