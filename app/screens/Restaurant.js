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
import { API_BASE_URL } from '@env'

const Restaurant = ({ route, navigation }) => {

    const scrollX = new Animated.Value(0);
    const [restaurant, setRestaurant] = React.useState(null);
    const [currentLocation, setCurrentLocation] = React.useState(null);
    const [orderItems, setOrderItems] = React.useState([]);
    const [coupons, setCoupons] = React.useState([])
    const [subTotal, setSubTotal] = React.useState(0)
    const [hst, setHst] = React.useState(0)
    const [orderTotal, setOrderTotal] = React.useState(0)
    const [orderObject, setOrderObject] = React.useState({
        orderId: '',
        restaurantId: route.params.restaurantObj._id,
        subTotal: 0,
        afterCouponSubTotal: 0,
        hst: 0,
        serviceFee: 3.99,
        delivaryFee: 2.99,
        orderTotal: 0,
        createdAt: '',
        status: 'placed',
        couponCode: '',
        couponPercentage: 0,
        orderedMenu: []
    });
    const refRBSheet = React.useRef();
    const refCouponRBSheet = React.useRef();
    const [cartHeight, setCartHeight] = React.useState(300)
    const [appliedCouponCode, setAppliedCouponCode] = React.useState('')
    const [appliedCouponPercentage, setAppliedCouponPercentage] = React.useState(0)

    React.useEffect(() => {
        let { restaurantObj, currentLocation } = route.params;

        setRestaurant(restaurantObj)
        setCurrentLocation(currentLocation)
        // setOrderObject({
        //     restaurantId: item.id,
        //     orderedMenu: []
        // })
    })

    React.useEffect(() => {
        axios.post(API_BASE_URL + `/api/restaurants/increaseVisitCount/` + restaurant?._id)
            .then(res => {
                console.log(res.data)
            })
    }, [restaurant])

    React.useEffect(() => {

        axios.get(API_BASE_URL + `/api/coupons`)
            .then(res => {
                console.log(res.data)
                setCoupons(res.data)
            })
    }, [])

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
        orderObject.subTotal = total
        return total.toFixed(2)
    }

    function updateOrderInvoice() {
        let orderObj = orderObject
        orderObj.afterCouponSubTotal = orderObject.subTotal * ((100 - orderObj.couponPercentage) / 100)
        orderObj.serviceFee = 3
        orderObj.delivaryFee = 2.99
        orderObj.hst = parseFloat(((orderObj.afterCouponSubTotal + orderObj.serviceFee + orderObj.delivaryFee) * 0.13).toFixed(2))
        orderObj.orderTotal = parseFloat((orderObj.afterCouponSubTotal + orderObj.serviceFee + orderObj.delivaryFee + orderObj.hst).toFixed(2))
        setSubTotal(orderObj.afterCouponSubTotal)
        setHst(orderObj.hst)
        setOrderTotal(orderObj.orderTotal)

        return orderObj
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
                            onPress={() => { updateOrderInvoice(); refRBSheet.current.open() }}
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
                    <View>
                        <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...FONTS.body3, }}>
                                Sub Total:
                            </Text>
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                ${subTotal}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...FONTS.body3, }}>
                                Service Fee:
                            </Text>
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                ${orderObject.serviceFee}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...FONTS.body3, }}>
                                Delivary Fee:
                            </Text>
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                ${orderObject.delivaryFee}
                            </Text>
                        </View>

                        <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...FONTS.body3, }}>
                                HST @13%:
                            </Text>
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                ${hst}
                            </Text>
                        </View>

                        <TouchableOpacity
                            style={{
                                width: SIZES.width * 0.9,
                                padding: SIZES.padding2 / 2,
                                backgroundColor: COLORS.lightGray3,
                                alignItems: 'center',
                                borderRadius: SIZES.radius
                            }}
                            // onPress={() => placeOrder()}
                            onPress={() => applyCouponBtnClicked()}
                        >
                            <Text style={{ color: 'green', fontSize: 14 }}>{appliedCouponCode === '' ? 'Apply Coupon' : appliedCouponCode}</Text>
                        </TouchableOpacity>

                        <View style={{ marginBottom: 5, display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Text style={{ ...FONTS.body3, }}>
                                Order Total:
                            </Text>
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                ${orderTotal}
                            </Text>
                        </View>

                    </View>











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

    function applyCouponBtnClicked() {
        refCouponRBSheet.current.open()

    }

    function renderCoupons() {
        const renderItem = ({ item }) => (
            <View style={{
                display: 'flex',
                flexDirection: 'row',
                paddingVertical: SIZES.padding,
                justifyContent: 'flex-start',
                alignItems: 'center',
                borderBottomColor: COLORS.secondary,
                borderBottomWidth: 1
            }}>
                <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>

                    <Text style={{ fontSize: SIZES.body2 }}>
                        {item.couponCode}
                    </Text>


                    <Text style={{
                        ...FONTS.body4, color: COLORS.darkgray, marginTop: 5,
                        alignItems: 'center'
                    }}>Save {item.couponPercentage}% on your order sub total.</Text>

                </View>

                {/* <Text style={{ fontSize: SIZES.body2, fontWeight: 'bold', marginLeft: SIZES.padding * 2 }}>
                    Apply
                    </Text> */}

                <TouchableOpacity
                    style={{
                        width: SIZES.width * 0.2,
                        padding: SIZES.padding / 2,
                        marginLeft: SIZES.padding * 2,
                        backgroundColor: COLORS.primary,
                        alignItems: 'center',
                        borderRadius: SIZES.radius
                    }}
                    // onPress={() => placeOrder()}
                    onPress={() => applyCoupon(item._id)}
                >
                    <Text style={{ color: COLORS.white, fontSize: 14 }}>{appliedCouponCode === item.couponCode ? "Remove" : "Apply"}</Text>
                </TouchableOpacity>

            </View >
        )


        return (
            <RBSheet
                ref={refCouponRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={false}
                height={400}
                customStyles={{
                    wrapper: {
                        backgroundColor: "transparent",
                    },
                    draggableIcon: {
                        backgroundColor: COLORS.primary
                    },
                    container: {
                        display: 'flex',
                        flex: 1,
                        alignItems: 'center'
                        // height: cartHeight
                    }
                }}
            >
                <View onLayout={(e) => setCartHeight(e.nativeEvent.layout.height)} style={{ paddingBottom: SIZES.padding * 6, paddingTop: SIZES.padding }}>

                    <View style={{
                        alignItems: 'center', padding: SIZES.padding
                    }}>
                        <Text style={{ fontSize: 25, ...FONTS.body1 }}>
                            Coupons
                        </Text>
                    </View>


                    <FlatList
                        data={coupons}
                        keyExtractor={item => `${item._id}`}
                        renderItem={renderItem}
                        contentContainerStyle={{
                            // paddingHorizontal: SIZES.padding * 2,
                            // paddingBottom: 80,
                            flex: 1,
                            // flexGrow: 0,
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </RBSheet>
        )
    }

    function applyCoupon(couponId) {
        var selectedCoupon = coupons.find((item) => item._id === couponId)
        if (orderObject.couponCode === selectedCoupon.couponCode) {
            orderObject.couponCode = ''
            orderObject.couponPercentage = 0
            setAppliedCouponCode('')
            setAppliedCouponPercentage(0)
            var orderObj = updateOrderInvoice()
            setOrderObject(orderObj)
        }
        else {
            orderObject.couponCode = selectedCoupon.couponCode
            orderObject.couponPercentage = selectedCoupon.couponPercentage
            setAppliedCouponCode(selectedCoupon.couponCode)
            setAppliedCouponPercentage(selectedCoupon.couponPercentage)
            var orderObj = updateOrderInvoice()
            setOrderObject(orderObj)

        }


        refCouponRBSheet.current.close()
    }

    function placeOrder() {
        console.log(orderObject)
        if (orderObject.orderedMenu.length > 0) {

            var data = {
                restaurantId: orderObject.restaurantId,
                subTotal: orderObject.subTotal,
                afterCouponSubTotal: orderObject.afterCouponSubTotal,
                couponCode: orderObject.couponCode,
                couponPercentage: orderObject.couponPercentage,
                delivaryFee: orderObject.delivaryFee,
                serviceFee: orderObject.serviceFee,
                hst: orderObject.hst,
                orderTotal: orderObject.orderTotal,
                status: orderObject.status,
                duration: restaurant.duration,
                address: currentLocation?.locationName,
                orderedMenu: orderObject.orderedMenu
            }



            axios.post(API_BASE_URL + '/api/orders', JSON.stringify(data), {
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
            {renderCoupons()}

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