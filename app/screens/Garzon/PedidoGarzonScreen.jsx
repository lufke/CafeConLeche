import { useEffect, useState } from 'react'
import { Text, ListItem, PricingCard, Input, Button, Dialog } from '@rneui/themed'
import { FlatList, View } from 'react-native'
import RealmContext from '../../models'
import { BSON } from 'realm'
import { useUser } from '@realm/react'
import { AddExtraForm, PedidoForm } from '../../components'

const { useRealm, useQuery, useObject } = RealmContext

export const PedidoScreen = ({ route, navigation }) => {
    const realm = useRealm()
    const user = useUser()
    const comanda = useObject('Comanda', BSON.ObjectId(route.params.comanda))
    const nombreCategoria = route.params.categoria.nombre
    const productos = useQuery('Producto').filtered(`categoria == '${nombreCategoria}'`).sorted([['nombre', false]])
    const [bottonSheetVisible, setBottonSheetVisible] = useState(false)
    const [cantidadPedida, setCantidadPedida] = useState('')
    const [productoSeleccionado, setProductoSeleccionado] = useState({})
    console.log(route.params)

    useEffect(() => {
        navigation.setOptions({ title: nombreCategoria.toUpperCase() })
    }, [])

    const toggleBottomSheet = () => {
        setBottonSheetVisible(!bottonSheetVisible)
        setCantidadPedida('')
    }

    const renderListItem = ({ item }) => {
        return (
            <View
                style={{
                    // alignContent: 'center',
                    // justifyContent: 'space-around'
                }}
            >
                <ListItem
                    key={`${item._id}`}
                    // bottomDivider

                    topDivider
                    onPress={() => handleSeleccionaProducto(item)}

                >
                    <ListItem.Content>
                        <ListItem.Title>{item.nombre}</ListItem.Title>
                        {/* <ListItem.Subtitle>$ {item.precio.toLocaleString('es-CL')}</ListItem.Subtitle> */}
                        {/* <Text>Texto Random</Text> */}
                    </ListItem.Content>
                    <Text h4>$ {item.precio.toLocaleString('es-CL')}</Text>
                </ListItem>
            </View>
        )
    }

    const handleSeleccionaProducto = (item) => {
        toggleBottomSheet()
        setProductoSeleccionado(item)
        console.log(productoSeleccionado)
    }

    return (<>
        <FlatList
            renderItem={renderListItem}
            data={productos}
            numColumns={1}
            ListEmptyComponent={(
                <View
                    style={{ flex: 1, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>
                    <Text h2>Categoría Sin Productos</Text>
                </View>
            )}
        />
        <Dialog
            isVisible={bottonSheetVisible}
            onBackdropPress={toggleBottomSheet}
        >
            {!route.params.isExtra
                ? (<PedidoForm
                    productoSeleccionado={productoSeleccionado}
                    comanda={comanda}
                    navigation={navigation}
                />)
                : (
                    <AddExtraForm
                        productoSeleccionado={productoSeleccionado}
                        comanda={comanda}
                        navigation={navigation}
                        pedido={route.params?.idPedido}
                    />
                )
            }
        </Dialog>
    </>
    )
}
