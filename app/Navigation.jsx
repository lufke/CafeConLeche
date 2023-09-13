// desde el celular 

import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import { useTheme } from '@rneui/themed';
import { useWindowDimensions } from 'react-native'

import {
    PrinterScreen, MesasScreen, ProductoScreen,
    ComandaScreen, PedidoScreen, CocinaScreen, ComandaCocinaScreen,
    AdminScreen, MesasAdminScreen, UserScreen, VentasScreen
} from "./screens"
import { ProductoForm, MesaForm, AddExtraForm } from './components';


const StackGarzon = createNativeStackNavigator()
const StackAdmin = createNativeStackNavigator()
const StackCocina = createNativeStackNavigator()
const StackProductos = createNativeStackNavigator()
const StackMesas = createNativeStackNavigator()
const StackUser = createNativeStackNavigator()

const Drawer = createDrawerNavigator()

const BottonTabAdmin = createMaterialBottomTabNavigator()

const GarzonStack = () => {
    return (
        <StackGarzon.Navigator
            initialRouteName='Mesas'
            screenOptions={{ headerShown: false }}
        >
            <StackGarzon.Screen name="Mesas" component={MesasScreen} />
            <StackGarzon.Screen name="Comanda" component={ComandaScreen} />
            <StackGarzon.Screen name="Pedido" component={PedidoScreen} />
            <StackGarzon.Screen name="AddExtra" component={AddExtraForm} />
        </StackGarzon.Navigator>
    )
}

const CocinaStack = () => {
    return (
        <StackCocina.Navigator
            initialRouteName='Comandas'
            screenOptions={{ headerShown: false }}
        >
            <StackCocina.Screen name='Comandas' component={CocinaScreen} />
            <StackCocina.Screen name='ComandaCocina' component={ComandaCocinaScreen} />
        </StackCocina.Navigator>
    )
}

const ProductosStack = () => {
    return (
        <StackProductos.Navigator
            screenOptions={{ headerShown: false }}
        >
            <StackProductos.Screen name='Productos' component={ProductoScreen} />
            <StackProductos.Screen name='NuevoProducto' component={ProductoForm} />
        </StackProductos.Navigator>
    )
}

const MesasStack = () => {
    return (
        <StackMesas.Navigator
            screenOptions={{ headerShown: false }}
        >
            <StackMesas.Screen name='ListaMesas' component={MesasAdminScreen} />
            <StackMesas.Screen name='NuevaMesa' component={MesaForm} />
        </StackMesas.Navigator>
    )
}

const UserStack = () => {
    return (
        <StackUser.Navigator
            screenOptions={{ headerShown: false }}
        >
            <StackUser.Screen name='User' component={UserScreen} />
        </StackUser.Navigator>
    )
}

const AdminTab = () => {
    return (
        <BottonTabAdmin.Navigator>
            <BottonTabAdmin.Screen
                name='ProductosStack'
                component={ProductosStack}
                options={{
                    tabBarLabel: 'Productos',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='cup'
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <BottonTabAdmin.Screen
                name='Mesas'
                component={MesasStack}
                options={{
                    // tabBarLabel: 'Productos',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='table-furniture'
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
            <BottonTabAdmin.Screen
                name='Impresora'
                component={PrinterScreen}
                options={{
                    // tabBarLabel: 'Productos',
                    tabBarIcon: ({ color }) => (
                        <MaterialCommunityIcons
                            name='printer-pos'
                            size={26}
                            color={color}
                        />
                    ),
                }}
            />
        </BottonTabAdmin.Navigator>
    )
}


const MyDrawer = () => {
    const { theme, } = useTheme()

    return (
        <NavigationContainer
            theme={theme}
        >
            <Drawer.Navigator
                initialRouteName='Garzon'
                screenOptions={{
                    headerShown: true,
                    drawerStyle: {
                        backgroundColor: 'burlywood',
                    },
                }}
            >
                <Drawer.Screen name='Garzon' component={GarzonStack} />
                <Drawer.Screen name='Cocina' component={CocinaStack} />
                <Drawer.Screen name='Admin' component={AdminTab} />
                <Drawer.Screen name='Ventas' component={VentasScreen} />
                <Drawer.Screen name='Usuario' component={UserStack} />
            </Drawer.Navigator>
        </NavigationContainer >
    )
}

const Navigator = () => {
    const { theme } = useTheme()
    return (
        <MyDrawer />
    )
}

export default Navigator
