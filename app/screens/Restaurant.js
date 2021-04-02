import React from "react";
import {
    StyleSheet,
    SafeAreaView,
    View,
    Text,
    TouchableOpacity,
    Image,
    Animated,
    Alert,
    FlatList
} from "react-native";
// import { isIphoneX } from 'react-native-iphone-x-helper'

import { icons, COLORS, SIZES, FONTS } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import UUIDGenerator from 'react-native-uuid-generator';
import RBSheet from "react-native-raw-bottom-sheet";
import axios from 'axios';

const Restaurant = ({ route, navigation }) => {

    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = React.useState(null);
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItems, setOrderItems] = React.useState([]);
    const [orderObject, setOrderObject] = React.useState({
        orderId: '',
        restaurantId: route.params.restaurantObj._id,
        orderTotal: 0,
        createdAt: '',
        status: 'placed',
        orderedMenu: []
    });
    const refRBSheet = React.useRef();
    const [cartHeight, setCartHeight] = React.useState(300)


    React.useEffect(() => {
        let { restaurantObj, currentLocation } = route.params;

        setRestaurant(restaurantObj)
        setCurrentLocation(currentLocation)
        // setOrderObject({
        //     restaurantId: item.id,
        //     orderedMenu: []
        // })
    })

    function editOrder(action, menuId, price) {
        let orderObj = orderObject
        let orderList = orderObj.orderedMenu.slice()
        let item = orderObj.orderedMenu.filter(a => a.menuItemId == menuId)

        if (action == "+") {
            if (item.length > 0) {
                let newQty = item[0].qty + 1
                item[0].qty = newQty
                item[0].total = item[0].qty * price
            } else {
                const newItem = {
                    menuItemId: menuId,
                    qty: 1,
                    price: price,
                    total: price
                }
                orderList.push(newItem)
                orderObj.orderedMenu = orderList;
            }

            setOrderObject(orderObj)
        } else {
            if (item.length > 0) {
                if (item[0]?.qty > 0) {
                    let newQty = item[0].qty - 1
                    item[0].qty = newQty
                    item[0].total = newQty * price
                }
                if (item[0].qty == 0) {
                    var index = orderList.indexOf(item[0]);
                    if (index !== -1) {
                        orderList.splice(index, 1);
                        orderObj.orderedMenu.splice(index, 1)
                    }
                }
            }

            setOrderObject(orderObj)
        }
        setOrderItemsState()
    }

    function setOrderItemsState() {
        setOrderItems(orderObject.orderedMenu.slice())
    }

    function getOrderQty(menuId) {
        let orderItem = orderItems.filter(a => a.menuItemId == menuId)

        if (orderItem.length > 0) {
            return orderItem[0].qty
        }

        return 0
    }

    function getBasketItemCount() {
        let itemCount = orderItems.reduce((a, b) => a + (b.qty || 0), 0)

        return itemCount
    }

    function sumOrder() {
        let total = orderItems.reduce((a, b) => a + (b.total || 0), 0)
        orderObject.orderTotal = total
        return total.toFixed(2)
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                    onPress={() => navigation.goBack()}
                >
                    <Image
                        source={icons.back}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                {/* Restaurant Name Section */}
                <View
                    style={{
                        flex: 1,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <View
                        style={{
                            height: 50,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: SIZES.padding * 3,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.lightGray3
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{restaurant?.name}</Text>
                    </View>
                </View>

                {/* <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.list}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity> */}
            </View>
        )
    }

    function renderFoodInfo() {
        return (
            <Animated.ScrollView
                horizontal
                pagingEnabled
                scrollEventThrottle={16}
                snapToAlignment="center"
                showsHorizontalScrollIndicator={false}
                onScroll={Animated.event([
                    { nativeEvent: { contentOffset: { x: scrollX } } }
                ], { useNativeDriver: false })}
            >
                {
                    restaurant?.menu.map((item, index) => (
                        <View
                            key={`menu-${index}`}
                            style={{ alignItems: 'center' }}
                        >
                            <View style={{ height: SIZES.height * 0.35 }}>
                                {/* Food Image */}
                                <Image
                                    source={{ uri: item.photo }}
                                    resizeMode="cover"
                                    style={{
                                        width: SIZES.width,
                                        height: "100%"
                                    }}
                                />

                                {/* Quantity */}
                                <View
                                    style={{
                                        position: 'absolute',
                                        bottom: - 20,
                                        width: SIZES.width,
                                        height: 50,
                                        justifyContent: 'center',
                                        flexDirection: 'row'
                                    }}
                                >
                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopLeftRadius: 25,
                                            borderBottomLeftRadius: 25
                                        }}
                                        onPress={() => editOrder("-", item._id, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>-</Text>
                                    </TouchableOpacity>

                                    <View
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}
                                    >
                                        <Text style={{ ...FONTS.h2 }}>{getOrderQty(item._id)}</Text>
                                    </View>

                                    <TouchableOpacity
                                        style={{
                                            width: 50,
                                            backgroundColor: COLORS.white,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            borderTopRightRadius: 25,
                                            borderBottomRightRadius: 25
                                        }}
                                        onPress={() => editOrder("+", item._id, item.price)}
                                    >
                                        <Text style={{ ...FONTS.body1 }}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Name & Description */}
                            <View
                                style={{
                                    width: SIZES.width,
                                    alignItems: 'center',
                                    marginTop: 15,
                                    paddingHorizontal: SIZES.padding * 2
                                }}
                            >
                                <Text style={{ marginVertical: 10, textAlign: 'center', ...FONTS.h2 }}>{item.name} - ${item.price.toFixed(2)}</Text>
                                <Text style={{ ...FONTS.body3 }}>{item.description}</Text>
                            </View>

                            {/* Calories */}
                            <View
                                style={{
                                    flexDirection: 'row',
                                    marginTop: 10
                                }}
                            >
                                <Image
                                    source={icons.fire}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        marginRight: 10
                                    }}
                                />

                                <Text style={{
                                    ...FONTS.body3, color: COLORS.darygray
                                }}>{item.calories.toFixed(2)} cal</Text>
                            </View>
                        </View>
                    ))
                }
            </Animated.ScrollView>
        )
    }

    function renderDots() {

        const dotPosition = Animated.divide(scrollX, SIZES.width)

        return (
            <View style={{ height: 30 }}>
                <View
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: SIZES.padding
                    }}
                >
                    {restaurant?.menu.map((item, index) => {

                        const opacity = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [0.3, 1, 0.3],
                            extrapolate: "clamp"
                        })

                        const dotSize = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [SIZES.base * 0.8, 10, SIZES.base * 0.8],
                            extrapolate: "clamp"
                        })

                        const dotColor = dotPosition.interpolate({
                            inputRange: [index - 1, index, index + 1],
                            outputRange: [COLORS.darkgray, COLORS.primary, COLORS.darkgray],
                            extrapolate: "clamp"
                        })

                        return (
                            <Animated.View
                                key={`dot-${index}`}
                                opacity={opacity}
                                style={{
                                    borderRadius: SIZES.radius,
                                    marginHorizontal: 6,
                                    width: dotSize,
                                    height: dotSize,
                                    backgroundColor: dotColor
                                }}
                            />
                        )
                    })}
                </View>
            </View>
        )
    }

    function renderOrder() {
        return (
            <View>
                {
                    renderDots()
                }
                <View
                    style={{
                        backgroundColor: COLORS.white,
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3,
                            borderBottomColor: COLORS.lightGray2,
                            borderBottomWidth: 1
                        }}
                    >
                        <Text style={{ ...FONTS.h3 }}>{getBasketItemCount()} items in Cart</Text>
                        <Text style={{ ...FONTS.h3 }}>${sumOrder()}</Text>
                    </View>

                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingVertical: SIZES.padding * 2,
                            paddingHorizontal: SIZES.padding * 3
                        }}
                    >
                        <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={icons.pin}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>{currentLocation?.locationName}</Text>
                        </View>

                        {/* <View style={{ flexDirection: 'row' }}>
                            <Image
                                source={icons.master_card}
                                resizeMode="contain"
                                style={{
                                    width: 20,
                                    height: 20,
                                    tintColor: COLORS.darkgray
                                }}
                            />
                            <Text style={{ marginLeft: SIZES.padding, ...FONTS.h4 }}>8888</Text>
                        </View> */}
                    </View>

                    {/* Order Button */}
                    <View
                        style={{
                            padding: SIZES.padding * 2,
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                padding: SIZES.padding,
                                backgroundColor: COLORS.primary,
                                alignItems: 'center',
                                borderRadius: SIZES.radius
                            }}
                            // onPress={() => placeOrder()}
                            onPress={() => refRBSheet.current.open()}
                        >
                            <Text style={{ color: COLORS.white, ...FONTS.h2 }}>View Cart</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* {isIphoneX() &&
                    <View
                        style={{
                            position: 'absolute',
                            bottom: -34,
                            left: 0,
                            right: 0,
                            height: 34,
                            backgroundColor: COLORS.white
                        }}
                    >
                    </View>
                } */}
            </View>
        )
    }

    function getMenuItemByMenuId(menuid) {
        let item = restaurant.menu.filter(a => a._id == menuid)
        if (item.length > 0) {
            return item[0];
        }
    }

    function truncateString(str) {
        if (str.length > 24) {
            return str.substring(0, 20) + "..."
        }
        else {
            return str;
        }
    }

    function renderCart() {

        const renderItem = ({ item }) => (
            <View style={{
                flexDirection: 'row',
                paddingVertical: SIZES.padding,
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomColor: COLORS.secondary,
                borderBottomWidth: 1
            }}>
                <View style={{ flexDirection: 'row' }}>
                    <View style={{ backgroundColor: COLORS.secondary, width: 30, height: 30, alignItems: 'center', justifyContent: 'center', borderRadius: SIZES.radius }}>
                        <Text style={{ fontSize: SIZES.body3 }}>
                            {item.qty}
                        </Text>
                    </View>
                    <View style={{ paddingHorizontal: SIZES.padding * 1.5 }}>

                        <Text style={{ fontSize: SIZES.body2 }}>
                            {truncateString(getMenuItemByMenuId(item.menuItemId).name)}
                        </Text>

                        {/* Calories */}

                        <View
                            style={{
                                flexDirection: 'row',
                                marginTop: 5,
                                alignItems: 'center'
                            }}
                        >
                            <Image
                                source={icons.fire}
                                style={{
                                    width: 15,
                                    height: 15,
                                    marginRight: 10
                                }}
                            />

                            <Text style={{
                                ...FONTS.body4, color: COLORS.darkgray
                            }}>{getMenuItemByMenuId(item.menuItemId).calories.toFixed(2)} cal</Text>
                        </View>
                    </View>

                </View>


                <Text style={{ fontSize: SIZES.body2, fontWeight: 'bold' }}>
                    ${item.total}
                </Text>
            </View >
        )


        return (
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={800}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.primary
                    },
                    container: {
                        alignItems: 'center',
                        // height: cartHeight
                    }
                }}
            >
                <View onLayout={(e) => setCartHeight(e.nativeEvent.layout.height)} style={{ paddingBottom: SIZES.padding * 6, paddingTop: SIZES.padding }}>

                    <View style={{
                        alignItems: 'center', padding: SIZES.padding
                    }}>
                        <Text style={{ fontSize: 25, ...FONTS.body1 }}>
                            {restaurant?.name}
                        </Text>
                    </View>


                    <FlatList
                        data={orderObject.orderedMenu}
                        keyExtractor={item => `${item.menuItemId}`}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            // paddingHorizontal: SIZES.padding * 2,
                            // paddingBottom: 80,
                            flex: 1,
                            // flexGrow: 0,
                        }}
                        showsVerticalScrollIndicator={false}
                    />









                    <TouchableOpacity
                        style={{
                            width: SIZES.width * 0.9,
                            padding: SIZES.padding,
                            backgroundColor: COLORS.primary,
                            alignItems: 'center',
                            borderRadius: SIZES.radius
                        }}
                        // onPress={() => placeOrder()}
                        onPress={() => placeOrder()}
                    >
                        <Text style={{ color: COLORS.white, ...FONTS.h2 }}>Place Order</Text>
                    </TouchableOpacity>
                </View>
            </RBSheet>
        )
    }

    function placeOrder() {
        console.log(orderObject)
        if (orderObject.orderedMenu.length > 0) {



            // AsyncStorage.getItem('orders').then((response) => {
            //     let orders = response != null ? JSON.parse(response) : [];
            //     console.log(orders)
            //     //orderObject.orderId = uuid.v1();
            //     UUIDGenerator.getRandomUUID().then((uuid) => {
            //         orderObject.orderId = uuid;
            //         orderObject.createdAt = new Date().toISOString();
            //         orders.push(orderObject);
            //         console.log(orders)
            //         AsyncStorage.setItem('orders', JSON.stringify(orders)).then(() => {
            //             Alert.alert(
            //                 "Thank you for placing the order.",
            //                 "My Alert Msg",
            //                 [
            //                     {
            //                         text: "View Orders", onPress: () => {
            //                             navigation.navigate("Home", {
            //                                 screen: 'Profile'
            //                             })
            //                         }
            //                     }
            //                 ]
            //             );
            //         })
            //     })
            // })


            var data = {
                restaurantId: orderObject.restaurantId,
                orderTotal: orderObject.orderTotal,
                status: orderObject.status,
                duration: restaurant.duration,
                address: currentLocation?.locationName,
                orderedMenu: orderObject.orderedMenu
            }



            axios.post('http://192.168.2.19:5000/api/orders', JSON.stringify(data), {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(function (response) {
                    //handle success
                    Alert.alert(
                        "Thank you for placing the order.",
                        "My Alert Msg",
                        [
                            {
                                text: "View Orders", onPress: () => {
                                    navigation.navigate("Home", {
                                        screen: 'Profile'
                                    })
                                }
                            }
                        ]
                    );
                })
                .catch(function (response) {
                    //handle error
                    console.log(response)
                });

        }
        else {
            alert("Please select items")
        }

    }


    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderFoodInfo()}
            {renderOrder()}
            {renderCart()}

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2
    }
})

export default Restaurant;