import React, { useState } from 'react'
import { Tab, TabView, Text, Icon, ListItem, FAB } from '@rneui/themed'
import { icons } from '../components/icons'
import { FlatList,  } from 'react-native'
import RealmContext from '../models'
import {categorias} from '../utils/constants'

const { useQuery } = RealmContext
export const ProductoScreen = ({navigation}) => {

    const [index, setIndex] = useState(0)
    const productos = useQuery('Producto')
    // console.log(productos)

    const categoriasNombre = [...new Set(categorias.map(item => item.nombre))]
    // console.log(categorias)
    // console.log(categoriasNombre)
    const listasPorCategoria = categoriasNombre.map(categoria => productos.filter(item => item.categoria === categoria))
    console.log(JSON.stringify(listasPorCategoria))
    // console.log(listasPorCategoria)
    const renderItem = ({ item }) => {

        return (
            <ListItem
                key={item}
                onPress={() => console.log(item)}
            >
                <Icon name={item} color="gray" />
                <ListItem.Content>
                    <ListItem.Title>{item.nombre}</ListItem.Title>
                    <ListItem.Subtitle>{item.precio}</ListItem.Subtitle>
                </ListItem.Content>
            </ListItem>)
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
                            title={iii.toString()}
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
                    >
                        <>
                            <Text>id: {idx.toString()}</Text>
                            <FlatList
                                data={lista}
                                keyExtractor={(_, idx) => idx.toString()}
                                renderItem={({ item }) => <Text>{idx.toString()} - {item.nombre}</Text>}
                            />
                        </>

                    </TabView.Item>
                ))}
            </TabView>
            <FAB 
            // onPress={()=>console.log('click')}
            onPress={()=>navigation.navigate('NuevoProducto')}
            icon={{name:'add', color:'green'}}
            color='red'
            placement='right'
            />
        </>
    )
}
