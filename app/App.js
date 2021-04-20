import React from "react"
import { createStackNavigator } from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"

import { Restaurant, OrderDelivary } from "./screens"
import Tabs from './navigation/Tabs'
import { SafeAreaProvider } from 'react-native-safe-area-context';


const Stack = createStackNavigator();

const App = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={"Home"}>
                    <Stack.Screen name="Home" component={Tabs} />
                    <Stack.Screen name="Restaurant" component={Restaurant} />
                    <Stack.Screen name="OrderDelivary" component={OrderDelivary} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>

    )
}

export default App;