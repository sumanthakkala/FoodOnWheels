import React from 'react'
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet
} from 'react-native'
import { icons, COLORS, SIZES, FONTS } from '../constants'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native';
import * as dummyData from '../data/dummyData';
import axios from 'axios';
import { API_BASE_URL } from '@env'
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Profile = ({ navigation }) => {

    useFocusEffect(
        React.useCallback(() => {
            loadData();
        }, [])
    );


    // React.useEffect(() => {
    //     if (!isDataFetched) {
    //         loadData();
    //     }
    //     return () => {
    //         // Cleanup
    //         // setIsDataFetched(false);
    //     }
    // })

    React.useEffect(() => {
        loadData()
    }, [])

    const [orders, setOrders] = React.useState([]);
    const [isDataFetched, setIsDataFetched] = React.useState(false);
    const [restaurants, setRestaurants] = React.useState([])
    const [currentLocation, setCurrentLocation] = React.useState(dummyData.initialCurrentLocation);
    const [statusTagStyles, setStatusTagStyles] = React.useState({})

    function loadData() {
        // AsyncStorage.getItem('orders').then((response) => {
        //     response != null ? setOrders(JSON.parse(response)) : setOrders([])

        //     AsyncStorage.getItem('restaurants').then((response) => {
        //         response != null ? setRestaurants(JSON.parse(response)) : setRestaurants([])
        //         setIsDataFetched(true);
        //     })
        // })

        axios.get(API_BASE_URL + `/api/orders`)
            .then(res => {
                console.log(res.data)
                setOrders(res.data)
            })

        axios.get(API_BASE_URL + `/api/restaurants`)
            .then(res => {
                console.log(res.data)
                setRestaurants(res.data)
            })
    }

    function getBasketItemCount(orderid) {

        let orderObj = orders.filter(order => {
            return order._id === orderid;
        })
        let itemCount = orderObj[0]?.orderedMenu?.reduce((a, b) => a + (b.qty || 0), 0)

        return itemCount
    }

    function sumOrder(orderid) {
        let orderObj = orders.filter(order => {
            return order._id === orderid;
        })
        let total = orderObj[0]?.orderedMenu?.reduce((a, b) => a + (b.total || 0), 0)

        return total.toFixed(2)
    }

    function getRestaurantById(rid) {
        let restaurantObj = restaurants?.filter(obj => {
            return obj._id === rid;
        })
        return restaurantObj[0];
    }

    function onVisitStorePressed(rid) {
        let restaurantObj = getRestaurantById(rid);
        navigation.navigate("Restaurant", {
            restaurantObj,
            currentLocation
        })
    }

    function getStatusTagStyles(status) {
        var style = {
            color: COLORS.darkgray,
            fontWeight: 'bold'
        }
        switch (status) {
            case 'placed':
                style.color = 'blue'
                break;
            case 'preparing':
                style.color = 'orange'
                break;
            case 'onTheWay':
                style.color = 'brown'
                break;
            case 'delivered':
                style.color = 'darkgreen'
                break;
        }
        return style
    }

    function renederOrders() {
        const renderItem = ({ item }) => (
            <View style={{
                flexDirection: 'row',
                paddingVertical: SIZES.padding,
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottomColor: COLORS.secondary,
                borderBottomWidth: 1
            }}>
                <View>
                    <Text
                        style={{
                            // fontWeight: '200',
                            // fontSize: 18,
                            color: COLORS.black,
                            fontSize: 18,
                            fontWeight: '800'
                        }}
                    >
                        {getRestaurantById(item.restaurantId)?.name}
                    </Text>

                    <Text style={{ color: COLORS.darkgray }}>
                        {new Date(item.dateCreated).toDateString()}
                    </Text>

                    <Text style={{ color: COLORS.darkgray }}>
                        {getBasketItemCount(item._id)} items -- ${sumOrder(item._id)}
                    </Text>
                    <Text style={getStatusTagStyles(item.status)}>
                        {item.status}
                    </Text>
                </View>

                <TouchableOpacity
                    style={{
                        // flex: 1,
                        // alignItems: 'flex-end',
                    }}
                    onPress={() => onVisitStorePressed(item.restaurantId)}
                >
                    <View
                        style={{
                            height: 30,
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingHorizontal: SIZES.padding * 2,
                            borderRadius: SIZES.radius,
                            backgroundColor: COLORS.primary
                        }}
                    >
                        <Text style={{ ...FONTS.body4, color: COLORS.white, fontWeight: 'bold' }}>Visit Store</Text>
                    </View>
                </TouchableOpacity>
            </View >
        )

        return (
            <View>
                <Text style={{ ...FONTS.body1, fontSize: 25, fontWeight: '900', paddingBottom: 10 }}>Orders</Text>
                <FlatList
                    data={orders}
                    keyExtractor={item => `${item._id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        // paddingHorizontal: SIZES.padding * 2,
                        paddingBottom: 80,
                    }}
                    showsVerticalScrollIndicator={false}
                />
            </View>

        )
    }

    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ ...FONTS.body1, paddingVertical: SIZES.padding }}>Welcome Guest</Text>
                <Image
                    source={icons.user}
                    resizeMode="contain"
                    style={{
                        width: 30,
                        height: 30
                    }}
                />


            </View>
        )
    }


    return (
        <SafeAreaView style={styles.container}>

            {renderHeader()}


            {renederOrders()}
        </SafeAreaView>

    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray2,
        // paddingHorizontal: SIZES.padding * 2,
        // paddingBottom: SIZES.padding * 7,
        // paddingTop: SIZES.padding * 2
        padding: SIZES.padding * 2
    }
})

export default Profile
