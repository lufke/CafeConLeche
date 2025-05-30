import RealmContext from '../models'
import { Formik } from 'formik'
import { object, string } from 'yup'
import { Input, Button, Text } from '@rneui/themed'
import { Picker } from '@react-native-picker/picker'
import { sectoresMesa } from '../utils/sectoresMesas'


const { useRealm, useObject } = RealmContext
const sector = sectoresMesa.map(mesa => mesa.nombre)

export const MesaForm = ({ navigation, route }) => {
    const { idMesa } = route?.params || ''
    let mesaEditable = {}
    if (!idMesa) {
        console.log('crear mesa')
    } else {
        console.log('editar mesa')
        mesaEditable = useObject('Mesa', Realm.BSON.ObjectId(idMesa))
    }

    const realm = useRealm()


    const validationSchema = object().shape({
        nombre: string().required('Nombre requerido'),
        ubicacion: string().oneOf(sector),
    })

    const crearMesa = (nuevaMesa) => {
        try {
            realm.write(() => {
                if (!idMesa) {
                    realm.create('Mesa', nuevaMesa)
                } else {
                    mesaEditable.nombre = nuevaMesa.nombre.toUpperCase().trim()
                    mesaEditable.ubicacion = nuevaMesa.ubicacion
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
                    nombre: mesaEditable.nombre || '',
                    ubicacion: mesaEditable.ubicacion || sector[0],

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
                            errorMessage={errors.nombre && touched.nombre ? <Text style={{ color: 'red' }}>{errors.nombre}</Text> : null}
                        />

                        <Picker

                            style={{ color: 'saddlebrown' }}
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