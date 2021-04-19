import React from 'react'
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import axios from 'axios';
import { API_BASE_URL } from '@env'

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


const Home = () => {

    const [orders, setOrders] = React.useState([])
    const [userLat, setUserLat] = React.useState(0)
    const [userLong, setUserLong] = React.useState(0)
    const [restaurants, setRestaurants] = React.useState([])
    const [isOrderDelivered, setIsOrderDelivered] = React.useState(false)
    const [isOrderOnTheWay, setIsOrderOnTheWay] = React.useState(false)
    const [ordersCopy, setOrdersCopy] = React.useState([])

    React.useEffect(() => {
        axios.get(API_BASE_URL + `/api/orders`)
            .then(res => {
                console.log(res.data)
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
                console.log(res.data)
                setRestaurants(res.data)
            })
    }, [])


    function getRestaurantName(id) {
        return restaurants?.find((restaurant) => restaurant._id === id)?.name
    }

    function delivaryBtnClicked(orderId) {
        var status = ""
        if (isOrderOnTheWay) {
            var allorders = [...ordersCopy]
            status = 'delivered'
            // setOrders(allorders)
        }
        else {
            var order = ordersCopy.filter((order) => order._id === orderId)
            status = 'onTheWay'
            setOrders(order)
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
