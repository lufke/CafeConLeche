import RealmContext from '../models'
import { Formik } from 'formik'
import { object, string, number } from 'yup'
import { Input, Button, Text } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'
import { categorias } from '../utils/categories'
import { BSON } from 'realm'

const { useRealm, useObject } = RealmContext

const pickerCategorias = [...new Set(categorias.map(item => item.nombre))]

export const ProductoForm = ({ route, navigation }) => {
    const { idProducto, idCategoria } = route?.params
    console.log(route.params)
    let productoEditable = {}
    // console.log(idProducto)
    if (!idProducto) {
        console.log('crear producto')
    } else {
        console.log('editar producto')
        productoEditable = useObject('Producto', BSON.ObjectId(idProducto))
        console.log(productoEditable)
    }
    const realm = useRealm()

    const validationSchema = object().shape({
        nombre: string().required('Nombre requerido'),
        categoria: string().oneOf(pickerCategorias).min(1),
        precio: number().integer().positive(),
        stock: number().integer(),
        // imagen: string().url()
    })

    const crearProducto = (nuevoProducto) => {
        try {
            console.log(nuevoProducto)
            realm.write(() => {
                if (!idProducto) {
                    realm.create('Producto', nuevoProducto)
                } else {
                    productoEditable.nombre = nuevoProducto.nombre
                    productoEditable.categoria = nuevoProducto.categoria
                    productoEditable.precio = nuevoProducto.precio
                }
            })
            navigation.pop()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    nombre: productoEditable.nombre || '',
                    categoria: productoEditable.categoria || pickerCategorias[idCategoria],
                    precio: idProducto ? productoEditable.precio.toString() : '',
                    // stock: 0,
                    // imagen: ''

                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                    crearProducto({ ...values, precio: parseInt(values.precio || 0) })
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
                    <>
                        <Input
                            label='Nombre'
                            value={values.nombre}
                            placeholder='Nombre Producto'
                            onChangeText={handleChange('nombre')}
                        />
                        {errors.nombre && <Text style={{ color: 'red' }}>{errors.nombre}</Text>}
                        <Picker
                            onValueChange={handleChange('categoria')}
                            selectedValue={values.categoria}
                            prompt='Seleccione Categoría'

                        >
                            {['Categoría', ...pickerCategorias].map(item => (
                                <Picker.Item label={item} value={item} key={item} />
                            ))}
                        </Picker>
                        {errors.categoria && <Text style={{ color: 'red' }}>{errors.categoria}</Text>}
                        <Input
                            label='Precio'
                            value={values.precio}
                            placeholder='Ingrese Precio'
                            onChangeText={handleChange('precio')}
                            inputMode='numeric'
                        />
                        {errors.precio && <Text style={{ color: 'red' }}>{errors.precio}</Text>}
                        {!idProducto
                            ? (<Button
                                title={'Crear Producto'}
                                onPress={handleSubmit}
                            />)
                            : (<Button
                                title={'Editar Producto'}
                                onPress={handleSubmit}
                            />)}
                        {/* <Button
                            title={'VOLVER'}
                            onPress={() => navigation.pop()}
                        /> */}
                    </>
                )}
            </Formik >
        </>
    )
} 