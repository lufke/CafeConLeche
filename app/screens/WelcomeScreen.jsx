import React, { useState } from "react";
import Realm from "realm";
import { useApp } from '@realm/react';
import { Alert, View, Button, TextInput } from "react-native";

export const WelcomeScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [passwordHidden, setPasswordHidden] = useState(true);
    const [isInSignUpMode, setIsInSignUpMode] = useState(true);

    const app = useApp();

    const signIn = async () => {
        try {
            const creds = Realm.Credentials.emailPassword(email, password);
            await app.logIn(creds);
        } catch (error) {
            Alert.alert(`Error al iniciar sesion: ${error.message}`);
        }
    };

    const onPressSignIn = async () => {
        try {
            await signIn(email, password);
        } catch (error) {
            Alert.alert(`Error al iniciar sesion: ${error.message}`);
        }
    };

    const onPressSignUp = async () => {
        try {
            await app.emailPasswordAuth.registerUser({ email, password });
            signIn(email, password);
        } catch (error) {
            Alert.alert(`Error al crear cuenta: ${error.mwssage}`);
        }
    }

    return (
        <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>

            <TextInput
                placeholder="Ingrese correo electrónico"
                onChangeText={setEmail}
                autoCapitalize="none"
                inputMode="email"
                leftIcon={{ name: 'mail' }}
            />
            <TextInput
                placeholder="Ingrese Contraseña"
                onChangeText={setPassword}
                leftIcon={{ name: 'lock' }}
                secureTextEntry
            />
            {isInSignUpMode ? (
                <>
                    <Button
                        title="CREAR CUENTA"
                        onPress={onPressSignUp}
                    />
                    <Button
                        title="¿Tienes cuenta?"
                        onPress={() => setIsInSignUpMode(!isInSignUpMode)}
                        type="clear"
                    />
                </>
            ) : (
                <>
                    <Button
                        title="INICIAR SESION"
                        onPress={onPressSignIn}
                    />
                    <Button
                        title="¿No tienes cuenta? Creala"
                        onPress={() => setIsInSignUpMode(!isInSignUpMode)}
                        type="clear"
                    />
                </>
            )}
        </View>
    )
}