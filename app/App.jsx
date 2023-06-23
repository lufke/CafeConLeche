import { WelcomeScreen } from "./screens";
import { AppProvider, UserProvider } from '@realm/react'
import { appId, baseUrl } from '../realm.json'
import RealmContext from './models'
import { Navigation } from "./Navigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Text } from "react-native";

const { RealmProvider } = RealmContext

const AppWrapper = () => {
    return (
        <AppProvider id={appId} baseUrl={baseUrl}>
            <UserProvider fallback={WelcomeScreen}>
                <App />
            </UserProvider>
        </AppProvider>
    )
}

const App = () => {
    return (
        <RealmProvider
            sync={{
                flexible: true,
                initialSubscriptions: {
                    update: (subs, realm) => {
                        subs.add(realm.objects('Producto'));
                        subs.add(realm.objects('Comanda'));
                        subs.add(realm.objects('Pedido'));
                        subs.add(realm.objects('Mesa'));
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
            }}
            fallback={() => <Text>CARGANDO DATOS...</Text>}
        >
            <SafeAreaProvider>
                <Navigation />
            </SafeAreaProvider>
        </RealmProvider>
    )
}

export default AppWrapper