// desde el celular 

import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
// import {} from '@react-navigation/'
import { PrinterScreen, MesasScreen, ProductoScreen, ComandaScreen, PedidoScreen, ComandasScreen } from "./screens"
import { ProductoForm, MesaForm } from './components';
import { useTheme } from '@rneui/themed';

const Stack = createNativeStackNavigator()
const Drawer = createDrawerNavigator()

const TempStack = () => {
    return (
        <Stack.Navigator
            initialRouteName='Mesas'
        // screenOptions={{ headerShown: false }}
        >
            <Stack.Screen name="NuevoProducto" component={ProductoForm} />
            <Stack.Screen name="NuevaMesa" component={MesaForm} />
            <Stack.Screen name="PrinterBT" component={PrinterScreen} />
            <Stack.Screen name="Mesas" component={MesasScreen} />
            <Stack.Screen name="Productos" component={ProductoScreen} />
            <Stack.Screen name="Comanda" component={ComandaScreen} />
            <Stack.Screen name="Pedido" component={PedidoScreen} />
            <Stack.Screen name="Comandas" component={ComandasScreen} />
        </Stack.Navigator>
    )
}

export const Navigation = () => {
    const { theme, } = useTheme()
    // const MyTheme = { ...DefaultTheme, RNTheme }
    return (
        <NavigationContainer theme={{
            colors: {
                // primary: theme.colors.primary,
                // background: theme.colors.background,
                // text: theme.colors.black
            },
            // dark: theme.mode === 'dark'
        }}
        >
            <Stack.Navigator initialRouteName='Mesas'>
                <Stack.Screen name="NuevoProducto" component={ProductoForm} />
                <Stack.Screen name="NuevaMesa" component={MesaForm} />
                <Stack.Screen name="PrinterBT" component={PrinterScreen} />
                <Stack.Screen name="Mesas" component={MesasScreen} />
                <Stack.Screen name="Productos" component={ProductoScreen} />
                <Stack.Screen name="Comanda" component={ComandaScreen} />
                <Stack.Screen name="Pedido" component={PedidoScreen} />
                <Stack.Screen name="Comandas" component={ComandasScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export const MyDrawer = () => {
    const { theme, } = useTheme()
    return (
        // <NavigationContainer >
        <NavigationContainer
        // theme={{
        //     colors: {
        //         // primary: theme.colors.primary,
        //         // background: theme.colors.background,
        //         // text: theme.colors.black
        //     },
        //     dark: theme.mode === 'dark'
        // }}
        >
            <Drawer.Navigator
                initialRouteName='PrinterDrawer'
                screenOptions={{
                    headerShown: false
                }}
            >
                <Drawer.Screen name='PrinterDrawer' component={TempStack} />
                <Drawer.Screen name='ProductosDrawer' component={ProductoScreen} />
            </Drawer.Navigator>
        </NavigationContainer>
    )
}