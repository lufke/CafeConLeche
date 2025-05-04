import { View, FlatList } from 'react-native'
import { Text, Button, ListItem } from '@rneui/themed'
import { useState } from 'react'
import DatePicker from 'react-native-date-picker'
// import { DateTime } from 'luxon'

import RealmContext from '../../models'

export const VentasScreen = () => {

    const { useQuery } = RealmContext
    const hoy = new Date()
    const [fechaSeleccionadaInicio, setFechaSeleccionadaInicio] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 0, 0, 0))
    const [fechaSeleccionadaFin, setFechaSeleccionadaFin] = useState(new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate(), 23, 59, 59))
    const [datePickerInicioVisible, setDatePickerInicioVisible] = useState(false)
    const [datePickerFinVisible, setDatePickerFinVisible] = useState(false)

    const ventas = useQuery('Comanda').filtered(`fechaCreacion >= $0 AND fechaCreacion < $0 `, [fechaSeleccionadaInicio, fechaSeleccionadaFin])
    const ventasPagadas = ventas.filtered(`pagado == $0`, [true]).sorted([['fechaCreacion', false]])
    const totalVentas = ventasPagadas.reduce((sumaTotal, venta) => sumaTotal + venta.total, 0)
    const totalPropinas = ventasPagadas.reduce((propinaTotal, venta) => propinaTotal + venta.propina, 0)

    const ListItemComanda = ({ item }) => {
        return (
            <ListItem
                bottomDivider
            >
                <ListItem.Content>
                    <ListItem.Title>
                        <Text h5 style={{ color: item.pagado ? 'saddlebrown' : 'red', fontWeight: 'bold' }}>
                            Venta: $ {item.total.toLocaleString('es-CL')}
                        </Text>
                    </ListItem.Title>
                    <ListItem.Subtitle>
                        <View style={{ flexDirection: 'column' }}>
                            <Text>Propina: $ {item.propina.toLocaleString('es-CL')}</Text>
                            <Text>Pedidos: {item.pedidos.length}</Text>
                            <Text>Mesa: {item.mesaName}</Text>
                            <Text>{item.fechaCreacion.toLocaleString('es-CL')}</Text>

                        </View>
                    </ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>
        )
    }


    return (
        <View style={{ flex: 1 }}>
            <DatePicker
                modal
                mode='date'
                androidVariant='nativeAndroid'
                confirmText='ACEPTAR'
                cancelText='CANCELAR'
                locale='es'
                open={datePickerInicioVisible}
                date={fechaSeleccionadaInicio}
                onConfirm={(date) => {
                    setDatePickerInicioVisible(false)
                    setFechaSeleccionadaInicio(new Date(date.getFullYear(), date.getMonth(), date.getDate()))
                }}
                onCancel={() =>
                    setDatePickerInicioVisible(false)

                }
            />
            <DatePicker
                modal
                mode='date'
                androidVariant='nativeAndroid'
                confirmText='ACEPTAR'
                cancelText='CANCELAR'
                locale='es'
                open={datePickerFinVisible}
                date={fechaSeleccionadaFin}
                onConfirm={(date) => {
                    setDatePickerFinVisible(false)
                    setFechaSeleccionadaFin(new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59))
                }}
                onCancel={() =>
                    setDatePickerFinVisible(false)

                }
            />
            <View
                style={{
                    flexDirection: 'row',
                    // alignContent: 'space-between' ,
                    alignItems: 'center',
                    justifyContent: 'space-evenly',
                    paddingVertical: 10
                }}
            >
                <Button
                    title={fechaSeleccionadaInicio.toLocaleDateString('es-CL')}
                    icon={{ name: 'calendar-today', color: 'white' }}
                    onPress={() => setDatePickerInicioVisible(true)}
                />
                <Button
                    title={fechaSeleccionadaFin.toLocaleDateString('es-CL')}
                    icon={{ name: 'calendar-today', color: 'white' }}
                    onPress={() => setDatePickerFinVisible(true)}
                />
            </View>
            <View >

                <Text h4 style={{ textAlign: 'center', color: 'saddlebrown' }} >Ventas: ${totalVentas.toLocaleString('es-CL')}</Text>
                <Text h4 style={{ textAlign: 'center', color: 'saddlebrown' }} >Propinas: ${totalPropinas.toLocaleString('es-CL')}</Text>
            </View>
            <FlatList

                data={ventasPagadas}
                renderItem={ListItemComanda}
                keyExtractor={item => item._id.toHexString()}

                ListEmptyComponent={<Text h3 h3Style={{ textAlign: 'center', }}>Sin Ventas en Período</Text>}
            />
        </View>
    )
}