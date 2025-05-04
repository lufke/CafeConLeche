import { Text, Button } from '@rneui/themed'
import { View } from 'react-native'
import { useUser } from '@realm/react'

export const UserScreen = () => {

    const user = useUser()
    return (
        <View
            style={{ flex: 1, alignItems: 'center', justifyContent: 'space-evenly' }}
        >
            <View>
                <Text h4>{user.profile.email}</Text>
                {/* <Text h4>{user.deviceId}</Text> */}
            </View>
            <Button
                title={'CERRAR SESION'}
                onPress={() => user.logOut()}
                size='lg'
                icon={{ name: 'logout', color: 'white' }}
                iconRight
            />
        </View>
    )
}