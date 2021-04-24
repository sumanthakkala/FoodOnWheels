import React from 'react'
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Platform, PermissionsAndroid } from 'react-native'
import axios from 'axios';
import { API_BASE_URL } from '@env'
import PubNub from 'pubnub';
import io from 'socket.io-client'
import Geolocation from '@react-native-community/geolocation';



const styles = StyleSheet.create({
    container: {
        // flex: 1,
        backgroundColor: '#fff'
    },
    shadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 1,
    }
})

const socket = io(API_BASE_URL)


const Home = () => {

    const [orders, setOrders] = React.useState([])
    const [userLat, setUserLat] = React.useState(0)
    const [userLong, setUserLong] = React.useState(0)
    const [restaurants, setRestaurants] = React.useState([])
    const [isOrderDelivered, setIsOrderDelivered] = React.useState(false)
    const [isOrderOnTheWay, setIsOrderOnTheWay] = React.useState(false)
    const [ordersCopy, setOrdersCopy] = React.useState([])
    const [driverLoc, setDriverLoc] = React.useState({})
    const [watchId, setWatchId] = React.useState(null)

    const [customerSocketId, setCustomerSocketId] = React.useState(null)
    const [deliveringOrderId, setDeliviringOrderId] = React.useState(null)

    const pubnub = new PubNub({
        publishKey: "pub-c-f41fd6dd-81ae-4016-bfb2-cfd55a0e31b5",
        subscribeKey: "sub-c-5a15a0a4-a15d-11eb-8d7b-b642bba3de20"
    });
    React.useEffect(() => {
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            );
        }
        axios.get(API_BASE_URL + `/api/orders`)
            .then(res => {
                var preparingOrders = res.data?.filter((item) => item.status === 'preparing')
                setOrders(preparingOrders)
                setOrdersCopy(preparingOrders)
                setUserLat(43.72743042699409)
                setUserLong(-79.29884181730858)
            })


    }, [])

    React.useEffect(() => {
        axios.get(API_BASE_URL + `/api/restaurants`)
            .then(res => {
                setRestaurants(res.data)
            })
    }, [])

    // React.useEffect(() => {
    //     pubnub?.publish({
    //         message: {
    //             latitude: driverLoc?.latitude,
    //             longitude: driverLoc?.longitude
    //         },
    //         channel: "location"
    //     });

    // }, [driverLoc])

    React.useEffect(() => {
        socket.on('customerSocketDetails', ({ socketId, orderId }) => {
            console.log('customer socket')
            console.log({ socketId, orderId, deliveringOrderId })
            if (deliveringOrderId === orderId) setCustomerSocketId(socketId)
        })
    }, [deliveringOrderId])

    React.useEffect(() => {
        if (customerSocketId != null) {
            socket.emit('locationUpdated', { to: customerSocketId, location: driverLoc })
        }
    }, [customerSocketId, driverLoc])

    const watchLocation = () => {
        var watchId = Geolocation.watchPosition(
            position => {
                const { latitude, longitude } = position.coords;

                const newCoordinate = {
                    latitude,
                    longitude
                };
                console.log(newCoordinate)

                setDriverLoc(newCoordinate)
            },
            error => console.log(error),
            {
                enableHighAccuracy: true,
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10
            }
        );
        setWatchId(watchId)
    };


    function getRestaurantName(id) {
        return restaurants?.find((restaurant) => restaurant._id === id)?.name
    }

    function delivaryBtnClicked(orderId) {
        var status = ""
        if (isOrderOnTheWay) {
            var allorders = [...ordersCopy]
            status = 'delivered'
            // setOrders(allorders)
            Geolocation.clearWatch(watchId)

        }
        else {
            var order = ordersCopy.filter((order) => order._id === orderId)
            status = 'onTheWay'
            setOrders(order)
            socket.emit('connectForLocationUpdates', orderId)
            setDeliviringOrderId(orderId)
            watchLocation()
        }

        var data = {
            orderId: orderId,
            status: status
        }
        axios({
            method: "post",
            url: API_BASE_URL + "/api/orders/changeStatus",
            data: data,
        })
            .then(function (response) {
                //handle success\
                if (isOrderOnTheWay) {
                    axios.get(API_BASE_URL + `/api/orders`)
                        .then(res => {
                            console.log(res.data)
                            var preparingOrders = res.data?.filter((item) => item.status === 'preparing')
                            setOrders(preparingOrders)
                            setOrdersCopy(preparingOrders)
                            setUserLat(43.72743042699409)
                            setUserLong(-79.29884181730858)
                            setCustomerSocketId(null)
                            setDeliviringOrderId(null)
                        })
                }

            })
            .catch(function (response) {
                //handle error
                console.log(response)
            });
        setIsOrderDelivered(!isOrderDelivered)
        setIsOrderOnTheWay(!isOrderOnTheWay)

    }

    function getOrdrsSection() {
        const renderItem = ({ item }) => (
            <View style={{ padding: 20, backgroundColor: 'lightgrey', marginVertical: 20 }}>
                <Text>
                    Order Id: {item._id}
                </Text>
                <Text>
                    Status: Preparing
                </Text>
                <Text>
                    {getRestaurantName(item.restaurantId)}
                </Text>
                <Text>
                    Latitude: {userLat}
                </Text>
                <Text>
                    Longitude: {userLong}
                </Text>

                <TouchableOpacity style={{
                    backgroundColor: isOrderOnTheWay ? "red" : "green",
                    padding: 15, borderRadius: 5,
                    marginTop: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                    onPress={() => delivaryBtnClicked(item._id)}>
                    <Text style={{ fontSize: 18 }}>
                        {isOrderOnTheWay ? "Delivered" : "Start Delivary"}
                    </Text>
                </TouchableOpacity>

            </View>
        )

        return (
            <FlatList
                data={orders}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
            // contentContainerStyle={{
            //     paddingHorizontal: 30,
            //     paddingBottom: 30
            // }}
            />
        )
    }



    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ fontSize: 26, fontWeight: 'bold', marginTop: 10 }}>Preparing Orders</Text>
            {getOrdrsSection()}
        </SafeAreaView>
    )
}

export default Home
