import RealmContext from '../models'
import { Formik } from 'formik'
import { object, string, number } from 'yup'
import { Input, Button, Text } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'
import { categorias } from '../utils/constants'

const { useRealm } = RealmContext
// const categorias = ['Cafe', 'Bebida', 'Fria', 'Sandwich', 'Pasteleria', 'Extra']

//TODO PASAR A CATEGORIA CONSTANT
const pickerCategorias = [...new Set(categorias.map(item => item.nombre))]

// const categorias = 
// console.log(pickerCategorias)

export const ProductoForm = ({ navigation }) => {
    console.log(navigation)
    const realm = useRealm()

    const validationSchema = object().shape({
        nombre: string().required('Nombre requerido'),
        categoria: string().oneOf(pickerCategorias).min(1),
        precio: number().integer().positive(),
        stock: number().integer(),
        imagen: string().url()

    })

    const crearProducto = (nuevoProducto) => {
        try {
            console.log(nuevoProducto)
            realm.write(() => {
                realm.create('Producto', nuevoProducto)
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
                    nombre: '',
                    categoria: 'Categoría',
                    // precio: 0,
                    // stock: 0,
                    imagen: ''

                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                    crearProducto({ ...values, precio: parseInt(values.precio || 0), stock: parseInt(values.stock || 0) })
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
                            {/* <Picker.Item label='Cafe' value='Cafe' />
                            <Picker.Item label='Bebida' value='Bebida' />
                            <Picker.Item label='Sandwich' value='Sandwich' />
                            <Picker.Item label='Pasteleria' value='Pastecleria' />
                            <Picker.Item label='Extra' value='Extra' /> */}
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
                        <Input
                            label='Stock'
                            value={values.stock}
                            placeholder='Nombre Producto'
                            onChangeText={handleChange('stock')}
                            inputMode='numeric'

                        />
                        {errors.stock && <Text style={{ color: 'red' }}>{errors.stock}</Text>}
                        <Input
                            label='Imagen'
                            value={values.imagen}
                            placeholder='Imagen'
                            onChangeText={handleChange('imagen')}
                        />
                        {errors.imagen && <Text style={{ color: 'red' }}>{errors.imagen}</Text>}

                        <Button
                            title={'Crear Producto'}
                            onPress={handleSubmit}
                        />
                        <Button
                            title={'VOLVER'}
                            onPress={() => navigation.pop()}
                        />
                    </>
                )}
            </Formik >
        </>
    )
} 