import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PrinterScreen, MesasScreen, ProductoScreen } from "./screens"
import { ProductoForm } from './components/ProductoForm';

const Stack = createNativeStackNavigator()

export const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName='Productos'
            >
                <Stack.Screen name="NuevoProducto" component={ProductoForm} />
                <Stack.Screen name="PrinterBT" component={PrinterScreen} />
                <Stack.Screen name="Mesas" component={MesasScreen} />
                <Stack.Screen name="Productos" component={ProductoScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}