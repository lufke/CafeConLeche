import { Text, SpeedDial, Dialog, ListItem, Icon, Card, Button, Input } from "@rneui/themed"
import { useState, useEffect } from "react"
import RealmContext from '../../models'
import { BSON } from "realm"
import { categorias } from '../../utils/categories'
import { Alert, FlatList, View } from "react-native"
import { printComanda, } from "../../utils/printer"

const { useRealm, useQuery, useObject } = RealmContext

export const ComandaScreen = ({ route, navigation }) => {
    categoriasSinExtra = categorias.filter((item) => item.nombre != 'Extra')
    const realm = useRealm()
    const [open, setOpen] = useState(false)
    const [propinaSugerida, setPropinaSugerida] = useState(0)
    const [dialogPropinaVisible, setDialogPropinaVisible] = useState(false)
    const [dialogCategoriaVisible, setDialogCategoriaVisible] = useState(false)
    
    const idComanda = route.params.idComanda
    const comanda = useObject('Comanda', BSON.ObjectId(idComanda))
    const pedidos = useQuery('Pedido').filtered(`comanda == '${idComanda}'`)
    const mesa = useObject('Mesa', BSON.ObjectId(comanda.mesa))

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
        navigation.navigate('Pedido', { idPedido: item._id.toString(), categoria: categorias[categorias.length - 1], comanda: idComanda, isExtra: true })
    }

    const eliminarPedido = item => {
        console.log(item)
        console.log(comanda)
        if (item.extras.length > 0) {
        }
        realm.write(() => {
            comanda.total = comanda.total - item.total
            realm.delete(item)
        })
    }

    const confirmaEntregaPedido = item => {
        realm.write(() => {
            item.entregado = !item.entregado
        })

    }

    const agregarPropinaEImprimir = item => {
        realm.write(() => {
            item.propina = parseInt(propinaSugerida)
        })
        setDialogPropinaVisible(!dialogPropinaVisible)
        printComanda(comanda)
    }

    const agregarPropina = item => {
        realm.write(() => {
            item.propina = parseInt(propinaSugerida)
        })
        setDialogPropinaVisible(!dialogPropinaVisible)
    }

    const pagarComanda = item => {
        realm.write(() => {
            item.pagado = true
            item.activa = false
            mesa.comanda = null
        })
        navigation.pop()
    }

    const renderComandaItem = ({ item }) => {
        return (
            <ListItem.Swipeable
                leftContent={
                    <View                    >
                        <Button
                            title={'Extra'}
                            icon={{ name: 'add', color: 'white' }}
                            buttonStyle={{ minHeight: '100%' }}
                            onPress={() => agregarExtraPedido(item)}
                        />
                    </View>
                }
                rightContent={
                    <Button
                        title={'Eliminar'}
                        icon={{ name: 'delete', color: 'white' }}
                        buttonStyle={{ minHeight: '100%' }}
                        color={'error'}
                        onPress={() => eliminarPedido(item)}
                    />
                }
                bottomDivider
                key={`${item._id}`}
                onLongPress={
                    () => Alert.alert(
                        'Eliminar', '¿Desea eliminar el pedido ' + item.nombre.toUpperCase() + '?',
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
            >
                <ListItem.CheckBox
                    checked={item.entregado}
                    onIconPress={() => confirmaEntregaPedido(item)}
                />
                <ListItem.Content>
                    <ListItem.Title>{item.cantidad} x {item.nombre.toUpperCase()}</ListItem.Title>
                    <ListItem.Subtitle>
                        <View>
                            <Text>$ {item.precioUnitario.toLocaleString('es-CL')} c/u</Text>
                            {item.extras.length ? (
                                <View>
                                    {item.extras.map(item => {
                                        return (
                                            <Text
                                                key={`${item._id}`}
                                            >
                                                (+) {item.cantidad} {item.nombre.toUpperCase()} x $ {item.precioUnitario.toLocaleString('es-CL')} c/u
                                            </Text>
                                        )
                                    })}
                                </View>
                            )
                                : null}
                        </View>
                    </ListItem.Subtitle>
                </ListItem.Content>
                <Text h4>$ {item.total.toLocaleString('es-CL')}</Text>
            </ListItem.Swipeable>)
    }


    return (
        <>
            <Text h3 h3Style={{ color: 'saddlebrown', textAlign: 'center' }}>{comanda.mesaName}</Text>
            <FlatList
                data={comanda?.pedidos}
                renderItem={renderComandaItem}
                ListEmptyComponent={<Text h3 style={{ textAlign: 'center' }}>SIN PEDIDOS</Text>}
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
                    icon={{ name: 'attach-money', color: '#fff' }}
                    title="Cerrar Cuenta"
                    onPress={() => Alert.alert(
                        'Atencion',
                        '¿Desea cerrar la cuenta?',
                        [
                            {
                                text: 'CANCELAR'
                            },
                            {
                                text: 'ACEPTAR',
                                onPress: () => pagarComanda(comanda)
                            },
                        ],
                        {
                            cancelable: true
                        }
                    )}
                    onLongPress={()=>{
                        setOpen(!open)
                        setDialogPropinaVisible(true)
                    }}
                />
                <SpeedDial.Action
                    icon={{ name: 'receipt-long', color: '#fff' }}
                    title="Imprimir Cuenta"
                    onPress={
                        comanda.pedidos.length > 0
                            ? () => {
                                setOpen(!open)
                                // printComanda(comanda)
                                setDialogPropinaVisible(true)
                            }
                            : () => {
                                setOpen(!open)
                                Alert.alert('Comanda sin pedidos')
                            }
                    }
                />
                <SpeedDial.Action
                    icon={{ name: 'add', color: '#fff' }}
                    title="Agregar Pedido"
                    onPress={() => {
                        setDialogCategoriaVisible(!dialogCategoriaVisible)
                        setOpen(!open)
                    }}
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
            <Dialog
                isVisible={dialogPropinaVisible}
            >
                <Dialog.Title
                    title="Ingrese propina"
                    onBackdropPress={() => setDialogPropinaVisible(!dialogPropinaVisible)}

                />
                <Dialog.Actions>
                    <Input
                        placeholder={`Sugerida $ ${(comanda.total * 0.1).toLocaleString('es-CL')}`}
                        inputMode="numeric"
                        onChangeText={text => setPropinaSugerida(text)}
                    />
                    <Dialog.Button
                        title={'ACEPTAR'}
                        onPress={() => {
                            agregarPropinaEImprimir(comanda)

                        }}
                    />
                    <Dialog.Button
                        title={'CANCELAR'}
                        onPress={() => setDialogPropinaVisible(false)}
                    />
                </Dialog.Actions>
            </Dialog>
        </>
    )
}
