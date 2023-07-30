import RealmContext from '../models'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { Input, Button, Text } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'

const { useRealm } = RealmContext
const sector = ['TERRAZA', 'CALLE', 'DELIVERY', 'INTERIOR']
const pickerSector = sector.map(item => {
    return { label: item, value: item.toLowerCase() }
})
// console.log(pickerSector)

export const MesaForm = () => {
    const realm = useRealm()

    const validationSchema = object().shape({
        nombre: string().required('Nombre requerido'),
        ubicacion: string().oneOf(sector),

    })

    const crearMesa = (nuevaMesa) => {
        try {
            // console.log(nuevaMesa)
            realm.write(() => realm.create('Mesa', nuevaMesa))
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <Formik
                initialValues={{
                    nombre: '',
                    ubicacion: '',

                }}
                validationSchema={validationSchema}
                onSubmit={values => {
                    crearMesa({ ...values })
                }}
            >
                {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
                    <>
                        <Input
                            label='Nombre'
                            value={values.nombre}
                            placeholder='Nombre Mesa'
                            onChangeText={handleChange('nombre')}
                        />
                        {errors.nombre && touched.nombre ? <Text style={{ color: 'red' }}>{errors.nombre}</Text> : null}
                        <Picker
                        style={{color:'saddlebrown'}}
                            onValueChange={handleChange('ubicacion')}
                            selectedValue={values.ubicacion}
                            prompt='Seleccione Sector'

                        >
                            {
                                sector.map(item => (
                                    <Picker.Item label={item} value={item} key={item} />
                                ))
                            }
                        </Picker>

                        <Button
                            title={'Crear Mesa'}
                            onPress={handleSubmit}
                        />
                    </>
                )}
            </Formik >
        </>
    )
} 