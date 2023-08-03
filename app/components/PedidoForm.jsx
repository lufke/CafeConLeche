import RealmContext from '../models'
import { Formik } from 'formik'
import { object, number } from 'yup'
import { Input, Button, Text } from '@rneui/themed'
import { useUser } from '@realm/react'
import { useNavigation } from '@react-navigation/native'

const { useRealm } = RealmContext

export const PedidoForm = ({ productoSeleccionado, comanda, ...params }) => {
    // console.log(productoSeleccionado, comanda)
    const realm = useRealm()
    const user = useUser()
    const navigation = useNavigation()

    const validationSchema = object().shape({
        cantidad: number()
            .required('Debe ingresar una cantidad')
            .positive('Debe ser mayor que 0')
            .typeError('Debe ser un número'),

    })

    const crearPedido = ({ cantidad }) => {
        try {
            const nuevoPedido = {
                nombre: productoSeleccionado.nombre,
                cantidad: parseInt(cantidad),
                precioUnitario: productoSeleccionado.precio,
                total: parseInt(cantidad) * productoSeleccionado.precio,
                creador: user.id,
                comanda: comanda._id.toString()
            }
            console.log(nuevoPedido)
            realm.write(() => {
                const pedido = realm.create('Pedido', nuevoPedido)
                comanda.pedidos.push(pedido)
                comanda.total = comanda.total + nuevoPedido.total
            })
            navigation.goBack()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Formik
                validationSchema={validationSchema}
                onSubmit={values => crearPedido(values)}
                initialValues={{
                    cantidad: ''
                }}
            >
                {({ handleChange, handleSubmit, values, errors, touched }) => (
                    <>
                        <Input
                            label={productoSeleccionado.nombre}
                            value={values.cantidad}
                            placeholder='Ingrese Cantidad'
                            inputMode='numeric'
                            onChangeText={handleChange('cantidad')}
                            errorMessage={errors.cantidad ? <Text style={{ color: 'red' }}>{errors.cantidad}</Text> : null}
                        />
                        {/* {errors.cantidad && touched.cantidad ? <Text style={{ color: 'red' }}>{errors.cantidad}</Text> : null} */}
                        <Button
                            title={'Agregar Pedido'}
                            onPress={handleSubmit}
                        />
                    </>
                )}
            </Formik >
        </>
    )
} 