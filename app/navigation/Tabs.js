import React from 'react'
import {
    View,
    Image,
    TouchableOpacity
} from 'react-native'
import {
    createBottomTabNavigator,
    BottomTabBar
} from "@react-navigation/bottom-tabs"
import Home from '../screens/Home'
import Search from '../screens/Search'
import Profile from '../screens/Profile'
import { COLORS, icons } from '../constants'
// import Svg, {Path} from "react-native-svg"

const Tab = createBottomTabNavigator();

// const TabBarCustomButton = ({accessibilityState, children, onPress}) => {
//     var isSelected = accessibilityState.isSelected

//     if(isSelected){
//         return(

//         )
//     }
//     else{
//         return (

//         )
//     }
// }

const Tabs = () => {
    return (
        <Tab.Navigator
            tabBarOptions={{
                showLabel: false,
                style: {
                    borderTopWidth: 0,
                    // backgroundColor: "transparent",
                    // elevation: 0
                }
            }}
        >
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={icons.cutlery}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    ),
                    // tabBarButton: (props) => (
                    //     <TabBarCustomButton
                    //         {...props}
                    //     />
                    // )
                }}
            />

            <Tab.Screen
                name="Search"
                component={Search}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={icons.search}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    ),
                    // tabBarButton: (props) => (
                    //     <TabBarCustomButton
                    //         {...props}
                    //     />
                    // )
                }}
            />

            <Tab.Screen
                name="Profile"
                component={Profile}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <Image
                            source={icons.user}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: focused ? COLORS.primary : COLORS.secondary
                            }}
                        />
                    ),
                    // tabBarButton: (props) => (
                    //     <TabBarCustomButton
                    //         {...props}
                    //     />
                    // )
                }}
            />
        </Tab.Navigator>
    )
}

export default Tabs
