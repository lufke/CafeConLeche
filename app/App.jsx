import { LoginScreen } from "./screens";
import { AppProvider, UserProvider } from '@realm/react'
import { appId, baseUrl } from '../realm.json'
import RealmContext from './models'
import Navigator from "./Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";
import { ThemeProvider } from '@rneui/themed'
import { theme } from './utils/themes'

const { RealmProvider } = RealmContext

const App = () => {

    const realmSyncConfig = {
        flexible: true,
        initialSubscriptions: {
            update: (subs, realm) => {
                subs.add(realm.objects('Categoria'));
                subs.add(realm.objects('Comanda'));
                subs.add(realm.objects('Mesa'));
                subs.add(realm.objects('Pedido'));
                subs.add(realm.objects('Producto'));
            },
        },
        newRealmFileBehavior: {
            type: "downloadBeforeOpen",
            timeOut: 10000,
            timeOutBehavior: "openLocalRealm",
        },
        existingRealmFileBehavior: {
            type: "openImmediately",
            timeOut: 10000,
            timeOutBehavior: "openLocalRealm",
        },
        onError: (_, error) => {
            // Show sync errors in the console
            console.warn({ syncError: error });
        },
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider theme={theme}        >
                <AppProvider id={appId} baseUrl={baseUrl}>
                    <UserProvider fallback={LoginScreen}>
                        <RealmProvider
                            sync={realmSyncConfig}
                            fallback={() => <Text>CARGANDO DATOS...</Text>}
                        >
                            <Navigator />
                        </RealmProvider>
                    </UserProvider>
                </AppProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    )
}

export default App