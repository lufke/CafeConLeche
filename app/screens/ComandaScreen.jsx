import { Text, SpeedDial, Dialog, ListItem, Icon, Card, Button } from "@rneui/themed"
import { useState, useEffect } from "react"
import RealmContext from '../models'
import { BSON } from "realm"
import { categorias } from '../utils/categories'
import { Alert, FlatList, View } from "react-native"

const { useRealm, useQuery, useObject } = RealmContext

// console.log(categorias)
export const ComandaScreen = ({ route, navigation }) => {
    categoriasSinExtra = categorias.filter((item) => item.nombre != 'Extra')
    console.log(route?.params?.idComanda)
    const realm = useRealm()
    const [open, setOpen] = useState(false)
    const [dialogCategoriaVisible, setDialogCategoriaVisible] = useState(false)
    // const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('')
    const idComanda = route.params.idComanda
    const comanda = useObject('Comanda', BSON.ObjectId(idComanda))
    const pedidos = useQuery('Pedido').filtered(`comanda == '${idComanda}'`)
    console.log(pedidos)
    // const [totalComanda, setTotalComanda] = useState(comanda.total)

    const mesa = useObject('Mesa', BSON.ObjectId(comanda.mesa))
    // const productos = useQuery('Producto')

    useEffect(() => {
        navigation.setOptions({ title: `COMANDA: ${mesa.nombre.toUpperCase()}` })
    }, [])


    if (route.params.nuevaComanda) {
        realm.write(() => {
            mesa.comanda = comanda
        })
    }

    const agregarPedido = (item) => {
        navigation.navigate('Pedido', { categoria: item, comanda: idComanda })
    }

    const editarPedido = item => {
        console.log('editar')
    }

    const agregarExtraPedido = item => {
        console.log('agregar extra')
    }

    const eliminarPedido = item => {
        console.log(item)
        console.log(comanda)
        if (item.extras.length > 0) {
            // console.log(item.extras)
        }
        realm.write(() => {
            comanda.total = comanda.total - item.total
            realm.delete(item)
        })
    }

    const renderComandaItem = ({ item }) => {
        return (
            <ListItem.Swipeable
                leftContent={
                    <Button
                        title={'Editar'}
                        buttonStyle={{ minHeight: '100%' }}
                        icon={{ name: 'edit', color: 'white' }}
                        onPress={() => editarPedido(item)}
                    />
                }
                rightContent={
                    <Button
                        title={'Extra'}
                        icon={{ name: 'add', color: 'white' }}
                        buttonStyle={{ minHeight: '100%' }}
                        onPress={() => agregarExtraPedido(item)}
                    />
                }
                bottomDivider
                key={`${item._id}`}
                onLongPress={
                    () => Alert.alert(
                        'Eliminar', '¿Desea eliminar el pedido '+item.nombre+ '?',
                        [
                            {
                                text: 'Cancelar'
                            },
                            {
                                text: 'Aceptar',
                                onPress: () => eliminarPedido(item)
                            },
                        ]
                    )
                }
                onTouchCancel={() => console.log('blur item')}
            >
                <Text h4>{item.cantidad}</Text>
                <ListItem.Content>
                    <ListItem.Title>{item.nombre}</ListItem.Title>
                    <ListItem.Subtitle>$ {item.precioUnitario.toLocaleString('es-CL')} c/u</ListItem.Subtitle>
                </ListItem.Content>
                <Text h4>$ {item.total.toLocaleString('es-CL')}</Text>
            </ListItem.Swipeable>)
    }


    return (
        <>
            <FlatList
                data={comanda?.pedidos}
                renderItem={renderComandaItem}
                ListEmptyComponent={<Text h2 style={{ textAlign: 'center' }}>SIN PEDIDOS</Text>}
                ListHeaderComponent={<View style={{ flex: 1, alignItems: 'center' }}><Text h4>Total: ${comanda.total.toLocaleString('es-CL')}</Text></View>}
            />
            <SpeedDial
                isOpen={open}
                icon={{ name: 'arrow-upward', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setOpen(!open)}
                onClose={() => setOpen(!open)}

            >
                <SpeedDial.Action
                    icon={{ name: 'add', color: '#fff' }}
                    title="Agregar Pedido"
                    onPress={() => {
                        setDialogCategoriaVisible(!dialogCategoriaVisible)
                        setOpen(!open)
                    }}
                />

                <SpeedDial.Action
                    icon={{ name: 'receipt-long', color: '#fff' }}
                    title="Imprimir Cuenta"
                    onPress={() => console.log('Pagar Cuenta')}
                />
                <SpeedDial.Action
                    icon={{ name: 'attach-money', color: '#fff' }}
                    title="Pagar Cuenta"
                    onPress={() => console.log('Pagar Cuenta')}
                />
            </SpeedDial>
            {/*dialogo para las categorias*/}
            <Dialog
                isVisible={dialogCategoriaVisible}
                onBackdropPress={() => setDialogCategoriaVisible(!dialogCategoriaVisible)}
            >
                <Dialog.Title title={<Text>Categoria</Text>} />
                {categoriasSinExtra.map(item => (
                    <ListItem
                        onPress={() => agregarPedido(item)}
                        key={item.nombre}
                    >
                        {
                            item.icono &&
                            <Icon
                                name={item.icono}
                            />
                        }
                        <ListItem.Content>
                            <ListItem.Title
                                key={item.nombre}
                            >{item.nombre}</ListItem.Title>
                        </ListItem.Content>
                    </ListItem>
                ))}
            </Dialog>
            {/* Dialogo para elegir cantidad de un pedido */}
            {/* <Dialog>

            </Dialog> */}
        </>
    )
}
