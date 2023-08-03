import React, { useState, useCallback } from 'react'
import { Pressable, StyleSheet, View, Dimensions, ToastAndroid } from 'react-native'
import { Text, Input, Card, Button, Icon } from '@rneui/themed'
import { Formik } from 'formik'
import { object, string, } from 'yup'
import { Realm, useApp } from '@realm/react'

export const LoginScreen = () => {

    const realmApp = useApp()
    const [isRegistering, setIsRegistering] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const validationSchema = object().shape({
        username: string().email('Debe proveer un correo válido').required('Campo obligatorio'),
        password: string().min(6, 'Contraseña debe tener al menos 6 caracteres').required('Campo obligatorio')
    })

    const login = useCallback(
        async (values) => {
            const credentials = Realm.Credentials.emailPassword(values.username.toLowerCase().trim(), values.password)
            // console.log({ credentials })
            try {
                await realmApp.logIn(credentials)
            } catch (error) {
                if (error == 'AppError: invalid username/password') {
                    ToastAndroid.show('Error: Datos incorrectos', ToastAndroid.LONG)
                }
                if (error == 'AppError: user disabled') {
                    ToastAndroid.show('Error: Usuario bloqueado', ToastAndroid.LONG)
                }
                console.log({ error })
            }
        },
        [realmApp],
    )

    const register = useCallback(async (values) => {
        try {
            // console.log(values)
            await realmApp.emailPasswordAuth.registerUser({ email: values.username.toLowerCase().trim(), password: values.password })
            const credentials = Realm.Credentials.emailPassword(values.username.toLowerCase().trim(), values.password)
            await realmApp.logIn(credentials)
        } catch (error) {
            if (error == 'AppError: name already in use') {
                ToastAndroid.show('Error: Usuario ya existe', ToastAndroid.LONG)
            }
            console.error(error)
        }
    }, [realmApp])


    const handleSubmit = (values, buttonName) => {
        !isRegistering ? login(values) : register(values)
    }
    return (
        <View style={styles.container}>
            <View style={styles.centeredContent}>
                <Formik
                    initialValues={{
                        username: '',
                        password: ''
                    }}
                    onSubmit={(values) => handleSubmit(values)}
                    validationSchema={validationSchema}
                >
                    {({ handleChange, handleSubmit, values, errors, touched }) => (
                        <>
                            <Card>
                                <Card.Title><Text h4>Bienvenid@ a SEV</Text></Card.Title>
                                <Card.Divider />
                                <Input
                                    placeholder='Ingrese Correo Electronico'
                                    value={values.username}
                                    onChangeText={handleChange('username')}
                                    label='correo electronico'
                                    inputMode='email'
                                    errorMessage={errors.username && touched.username ? (<Text style={{ color: 'red' }}>{errors.username}</Text>) : null}
                                />
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                    <Input
                                        placeholder='Ingrese Password'
                                        value={values.password}
                                        onChangeText={handleChange('password')}
                                        label='contraseña'
                                        errorMessage={errors.password && touched.password ? (<Text style={{ color: 'red' }}>{errors.password}</Text>) : null}
                                        secureTextEntry={!isPasswordVisible}
                                    />
                                    <Icon
                                        name={isPasswordVisible ? 'visibility-off' : 'visibility'}
                                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                    />
                                </View>
                                <View>

                                    <Button
                                        title={isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
                                        onPress={handleSubmit}
                                        style={{ margin: 200 }}
                                    />
                                    <Text
                                        onPress={() => setIsRegistering(!isRegistering)}
                                        style={{ paddingTop: 20 }}
                                    >
                                        {!isRegistering ? '¿No tiene cuenta?, Regístrese' : '¿Ya tiene cuenta? Inicie sesión'}
                                    </Text>
                                </View>
                            </Card>
                        </>
                    )}
                </Formik>
            </View>
        </View>
    )
}
const windowWidth = Dimensions.get('screen').width;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        // alignItems: 'center',
        // width: windowWidth

    },
    centeredContent: {
        // justifyContent: 'center',
        // alignItems: 'center',
        // borderWidth: 1,
        // borderColor: 'black',
        // padding: 20,
        // width: windowWidth * 2
    },
});

