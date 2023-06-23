import React, { useState } from 'react'
import { Tab, TabView, Text, Icon, ListItem, FAB } from '@rneui/themed'
import { icons } from '../components/icons'
import { FlatList, View, Dimensions } from 'react-native'
import RealmContext from '../models'
import { categorias } from '../utils/categories'


const { useQuery, useRealm } = RealmContext
export const ProductoScreen = ({ navigation }) => {

    const realm = useRealm()
    const { width, height , } = Dimensions.get('window')
    const [index, setIndex] = useState(0)
    const productos = useQuery('Producto')
    const categoriasNombre = [...new Set(categorias.map(item => item.nombre))]
    const listasPorCategoria = categoriasNombre.map(categoria => productos.filter(item => item.categoria === categoria))
    
    const renderItem = ({ item }) => {
        return (
            <ListItem
                style={{ flex: 1, width }}
                key={`${item._id}`}
                onPress={() => navigation.navigate('NuevoProducto', { idProducto: item._id.toString() })}
                onLongPress={() => deleteItem(item)}
            >
                <ListItem.Content>
                    <ListItem.Title><Text>{item.nombre}</Text></ListItem.Title>
                    <ListItem.Subtitle><Text>{item.precio}</Text></ListItem.Subtitle>
                </ListItem.Content>
                <ListItem.Chevron />
            </ListItem>
        )
    }

    const deleteItem = (item) => {
        try {
            realm.write(() => {
                realm.delete(item)
            })
        } catch (error) {
            console.error(error)
        }
    }

    const renderItem2 = ({ item, index }) => {
        return (
            <View style={{ flex: 1, padding: 10, backgroundColor: index % 2 == 1 ? 'red' : 'green', width }}>
                <Text h3>{item.nombre}</Text>
                <Text h4>$ {item.precio}</Text>
                <Text h4>{(index % 2).toString()}</Text>

            </View>
        )
    }

    return (
        <>
            <Tab
                value={index}
                onChange={(e) => setIndex(e)}
                variant='primary'
            >
                {categorias.map((item, iii) => {
                    return (
                        <Tab.Item
                            key={iii}
                            // title={item.nombre}
                            icon={{ name: item.icono, color: 'white' }}
                        />
                    )
                })}
            </Tab>
            <TabView
                value={index}
                onChange={setIndex}
                animationType='spring'
            >
                {listasPorCategoria.map((lista, idx) => (
                    <TabView.Item
                        key={idx.toString()}
                        style={{ flex: 1 }}
                    >
                        {/* <View
                            style={{ flex: 1 }}
                        > */}
                        {/* <Text>id: {idx.toString()}</Text> */}
                        <FlatList
                            data={lista}
                            keyExtractor={(_, idx) => idx.toString()}
                            renderItem={renderItem}
                            ListEmptyComponent={<View style={{ justifyContent: 'center', alignContent: 'center' }}><Text h4>Categoría "{categoriasNombre[idx]}" sin productos</Text></View>}
                        />
                        {/* </View> */}
                    </TabView.Item>
                ))}
            </TabView>
            <FAB
                // onPress={()=>console.log('click')}
                onPress={() => navigation.navigate('NuevoProducto', { idProducto: null, idCategoria: index })}
                icon={{ name: 'add', color: 'green' }}
                color='red'
                placement='right'
            />
        </>
    )
}
