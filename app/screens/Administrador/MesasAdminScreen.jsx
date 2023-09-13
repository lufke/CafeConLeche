import { useState } from 'react'
import { Text, FAB, ListItem, Icon, Dialog } from '@rneui/themed'
import { FlatList, View, Alert, Dimensions, StyleSheet } from 'react-native'
import RealmContext from '../../models'

const { useRealm, useQuery } = RealmContext

export const MesasAdminScreen = ({ navigation }) => {

    const realm = useRealm()
    const mesas = useQuery('Mesa')
        .sorted([['ubicacion', true], ['nombre', false],])

    const eliminarMesa = item => {
        try {
            realm.write(() => {
                realm.delete(item)
            })
        } catch (error) {
            console.error(error)
        }
    }

    const renderItem = ({ item }) => {
        return (
            <View
                style={styles.mesaCuadro}
            >
                <ListItem
                    style={{ width: '100%', flex: 1 }}
                    key={`${item._id}`}
                    delayHoverIn={50}
                    onLongPress={() => {
                        Alert.alert(
                            'Atención',
                            `¿Desea eliminar ${item.nombre}?`,
                            [
                                {
                                    text: 'Cancelar'
                                },
                                {
                                    text: 'Aceptar',
                                    onPress: () => eliminarMesa(item)
                                },
                            ],
                            {
                                cancelable: true
                            })
                    }}
                    onPress={() => navigation.navigate('NuevaMesa', { idMesa: item._id.toHexString() })}
                    disabled={item.comanda != null}
                >
                    <Icon
                        name={item.comanda ? 'hourglass-bottom' : 'local-cafe'}
                        color={item.comanda ? 'red' : 'saddlebrown'}
                        size={25}
                    />
                    <ListItem.Content>
                        <ListItem.Title>
                            <Text h4>{item.nombre.toUpperCase()}</Text>
                        </ListItem.Title>
                        <ListItem.Subtitle>
                            <View
                                style={{ flexDirection: "column" }}
                            >
                                <Text>
                                    {item.ubicacion}
                                </Text>
                                {item.comanda &&
                                    <Text>
                                        ${item.comanda.total.toLocaleString('es-CL')}
                                    </Text>
                                }
                            </View>
                        </ListItem.Subtitle>
                    </ListItem.Content>
                </ListItem>
            </View>
        )
    }

    return (
        <View
            style={{ flex: 1 }}
        >
            <FlatList
                data={mesas}
                keyExtractor={item => `${item.nombre}`}
                renderItem={renderItem}
                numColumns={2}
                ListEmptyComponent={(
                    <View
                        style={{ flex: 1, alignContent: "center", justifyContent: "center", flexDirection: "row" }}>

                        <Text h2>Sin Mesas</Text>
                    </View>
                )}
            />
            <FAB
                icon={{ name: 'add', color: 'white' }}
                placement='right'
                onPress={() => navigation.navigate('NuevaMesa')}
                onLongPress={() => navigation.toggleDrawer()}
            />
        </View>
    )

}

const styles = StyleSheet.create({
    mesaCuadro: {
        width: Dimensions.get('window').width / 2,
        justifyContent: 'space-around'
    }
})