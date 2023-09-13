import { Text, SpeedDial, Dialog, ListItem, Icon, Card, Button } from "@rneui/themed"
import { useState, useEffect } from "react"
import RealmContext from '../../models'
import { BSON } from "realm"
import { categorias } from '../../utils/categories'
import { Alert, FlatList, View } from "react-native"
import { printComanda, imprimirPedidos } from "../../utils/printer"

const { useRealm, useQuery, useObject } = RealmContext

// console.log(categorias)
export const ComandaCocinaScreen = ({ route, navigation }) => {
    categoriasSinExtra = categorias.filter((item) => item.nombre != 'Extra')
    const realm = useRealm()
    const [open, setOpen] = useState(false)
    const [dialogCategoriaVisible, setDialogCategoriaVisible] = useState(false)
    // const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const idComanda = route.params.idComanda
    const comanda = useObject('Comanda', BSON.ObjectId(idComanda))
    // const pedidos = useQuery('Pedido').filtered(`comanda == '${idComanda}'`)

    // console.log(pedidos)
    // const [totalComanda, setTotalComanda] = useState(comanda.total)

    const mesa = useObject('Mesa', BSON.ObjectId(comanda.mesa))
    // const productos = useQuery('Producto')

    useEffect(() => {
        navigation.setOptions({ title: `COMANDA: ${comanda.mesaName.toUpperCase()}` })
    }, [])


    // if (route.params.nuevaComanda) {
    //     realm.write(() => {
    //         mesa.comanda = comanda
    //     })
    // }

    // const agregarPedido = (item) => {
    //     navigation.navigate('Pedido', { categoria: item, comanda: idComanda })
    // }

    // const agregarExtraPedido = item => {
    //     console.log('agregar extra')
    //     navigation.navigate('Pedido', { idPedido: item._id.toString(), categoria: categorias[categorias.length - 1], comanda: idComanda, isExtra: true })
    // }

    // const eliminarPedido = item => {
    //     console.log(item)
    //     console.log(comanda)
    //     if (item.extras.length > 0) {
    //         // console.log(item.extras)
    //     }
    //     realm.write(() => {
    //         comanda.total = comanda.total - item.total
    //         realm.delete(item)
    //     })
    // }

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
                    <ListItem.Title>{item.cantidad} x {item.nombre}</ListItem.Title>
                    <ListItem.Subtitle>
                        <View>
                            {item.extras.length ? (
                                <View>
                                    {item.extras.map(item => {
                                        return (
                                            <Text
                                                key={`${item._id}`}
                                            >
                                                (+) {item.cantidad} {item.nombre}
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
            <Text h3 h3Style={{ color: 'saddlebrown', textAlign: 'center' }}>{comanda.mesaName}</Text>
            <FlatList
                data={comanda?.pedidos}
                renderItem={renderComandaItem}
                ListEmptyComponent={<Text h2 style={{ textAlign: 'center' }}>SIN PEDIDOS</Text>}
            />
        </>
    )
}
