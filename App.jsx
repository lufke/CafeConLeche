import React, { useState } from "react";
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { PrinterScreen } from './app/screens'

export default App = () => {

  const Stack = createNativeStackNavigator()

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Impresora" component={PrinterScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )

}

// export default App