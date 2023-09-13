import { View } from 'react-native'
import { Text, Button, Card } from '@rneui/themed'
import React from 'react'

export const AdminScreen = ({ navigation }) => {
    return (
        <View>
            <Text>AdminScreen</Text>
            <Card>
                <Button
                    title='Productos'
                    onPress={() => navigation.navigate('Productos')}
                />
            </Card>
            <Card>
                <Button
                    title='Mesas'
                    onPress={() => navigation.navigate('Nueva Mesa')}
                />
            </Card>
            <Card>
                <Button
                    title='Impresora'
                    onPress={() => navigation.navigate('Impresora')}
                // disabled
                />
            </Card>
        </View>
    )
}