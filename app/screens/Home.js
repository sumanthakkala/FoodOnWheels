import React from "react";
import {
    View,
    Text,
    SafeAreaView,
    TouchableOpacity,
    Image,
    FlatList,
    StyleSheet
} from "react-native";
import { icons, images, SIZES, COLORS, FONTS } from '../constants'
import * as dummyData from '../data/dummyData'
import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.lightGray4
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



const Home = ({ navigation }) => {


    // React.useEffect(() => {
    //     AsyncStorage.setItem('categories', JSON.stringify(dummyData.categoryData)).then(() => {
    //         alert("categories saved")
    //     })
    //     AsyncStorage.setItem('restaurants', JSON.stringify(dummyData.restaurantData)).then(() => {
    //         alert("restaurants saved")
    //     })
    // })

    // React.useEffect(() => {
    //     if (!isDataFetched) {
    //         AsyncStorage.getItem('categories').then((response) => {
    //             response != null ? setCategories(JSON.parse(response)) : setCategories([])

    //             AsyncStorage.getItem('restaurants').then((response) => {
    //                 response != null ? setRestaurants(JSON.parse(response)) : setRestaurants([])
    //                 setIsDataFetched(true);
    //             })
    //         })
    //     }
    //     return () => {
    //         // Cleanup
    //         // setIsDataFetched(false);
    //     }
    // })

    React.useEffect(() => {
        axios.get(`http://192.168.2.19:5000/api/categories`)
            .then(res => {
                console.log(res.data)
                setCategories(res.data)
            })
    }, [])

    React.useEffect(() => {
        axios.get(`http://192.168.2.19:5000/api/restaurants`)
            .then(res => {
                console.log(res.data)
                setRestaurants(res.data)
                setRestaurantsDataCopy(res.data)
            })
    }, [])



    const [categories, setCategories] = React.useState([])
    const [selectedCategory, setSelectedCategory] = React.useState(null)
    const [restaurants, setRestaurants] = React.useState([])
    const [restaurantsDataCopy, setRestaurantsDataCopy] = React.useState([])
    const [currentLocation, setCurrentLocation] = React.useState(dummyData.initialCurrentLocation)
    const [isDataFetched, setIsDataFetched] = React.useState(false);





    function renderHeader() {
        return (
            <View style={{ flexDirection: 'row', height: 60, padding: SIZES.padding2 }}>
                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.nearby}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                    <View
                        style={{
                            width: '70%',
                            height: "100%",
                            backgroundColor: COLORS.lightGray3,
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius: SIZES.radius
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>{currentLocation.locationName}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={{
                        width: 50,
                        paddingRight: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}
                >
                    <Image
                        source={icons.basket}
                        resizeMode="contain"
                        style={{
                            width: 30,
                            height: 30
                        }}
                    />
                </TouchableOpacity>
            </View>
        )
    }



    function onSelectCategory(category) {
        //filter restaurant
        // let restaurantList = dummyData.restaurantData.filter(a => a.categories.includes(category.id))

        let restaurantList = restaurantsDataCopy.filter(a => a.categories.includes(category._id))
        setRestaurants(restaurantList)

        setSelectedCategory(category)
    }

    function renderMainCategories() {
        const renderItem = ({ item }) => {
            return (
                <TouchableOpacity
                    style={{
                        padding: SIZES.padding,
                        paddingBottom: SIZES.padding * 2,
                        backgroundColor: (selectedCategory?._id == item._id) ? COLORS.primary : COLORS.white,
                        borderRadius: SIZES.radius,
                        alignItems: "center",
                        justifyContent: "center",
                        marginRight: SIZES.padding,
                        ...styles.shadow
                    }}
                    onPress={() => onSelectCategory(item)}
                >
                    <View
                        style={{
                            width: 50,
                            height: 50,
                            borderRadius: 25,
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: (selectedCategory?._id == item._id) ? COLORS.white : COLORS.lightGray
                        }}
                    >
                        <Image
                            source={{ uri: item.icon }}
                            resizeMode="contain"
                            style={{
                                width: 30,
                                height: 30
                            }}
                        />
                    </View>

                    <Text
                        style={{
                            marginTop: SIZES.padding,
                            color: (selectedCategory?._id == item._id) ? COLORS.white : COLORS.black,
                            ...FONTS.body5
                        }}
                    >
                        {item.name}
                    </Text>
                </TouchableOpacity>
            )
        }

        return (
            <View style={{ padding: SIZES.padding * 2 }}>
                <Text style={{ ...FONTS.h1 }}>Main</Text>
                <Text style={{ ...FONTS.h1 }}>Categories</Text>

                <FlatList
                    data={categories}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => `${item._id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{ paddingVertical: SIZES.padding * 2 }}
                />
            </View>
        )
    }

    function onRestaurantClicked(restaurantObj) {
        navigation.navigate("Restaurant", {
            restaurantObj,
            currentLocation
        })
    }


    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2 }}
                onPress={() => onRestaurantClicked(item)}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={{ uri: item.photo }}
                        resizeMode="cover"
                        style={{
                            width: "100%",
                            height: 200,
                            borderRadius: SIZES.radius
                        }}
                    />

                    <View
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            height: 50,
                            width: SIZES.width * 0.3,
                            backgroundColor: COLORS.white,
                            borderTopRightRadius: SIZES.radius,
                            borderBottomLeftRadius: SIZES.radius,
                            alignItems: 'center',
                            justifyContent: 'center',
                            ...styles.shadow
                        }}
                    >
                        <Text style={{ ...FONTS.h4 }}>{item.duration}</Text>
                    </View>
                </View>

                {/* Restaurant Info */}
                <Text style={{ ...FONTS.body2 }}>{item.name}</Text>

                <View
                    style={{
                        marginTop: SIZES.padding,
                        flexDirection: 'row'
                    }}
                >
                    {/* Rating */}
                    <Image
                        source={icons.star}
                        style={{
                            height: 20,
                            width: 20,
                            tintColor: COLORS.primary,
                            marginRight: 10
                        }}
                    />
                    <Text style={{ ...FONTS.body3 }}>{item.rating}</Text>

                    {/* Categories */}
                    <View
                        style={{
                            flexDirection: 'row',
                            marginLeft: 10
                        }}
                    >
                        {
                            item.categories.map((categoryId) => {
                                return (
                                    <View
                                        style={{ flexDirection: 'row' }}
                                        key={categoryId}
                                    >
                                        <Text style={{ ...FONTS.body3 }}>{getCategoryNameById(categoryId)}</Text>
                                        <Text style={{ ...FONTS.h3, color: COLORS.darkgray }}> . </Text>
                                    </View>
                                )
                            })
                        }

                        {/* Price */}
                        {
                            [1, 2, 3].map((priceRating) => (
                                <Text
                                    key={priceRating}
                                    style={{
                                        ...FONTS.body3,
                                        color: (priceRating <= item.priceRating) ? COLORS.black : COLORS.darkgray
                                    }}
                                >$</Text>
                            ))
                        }
                    </View>
                </View>
            </TouchableOpacity>
        )

        return (
            <FlatList
                data={restaurants}
                keyExtractor={item => `${item._id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30
                }}
            />
        )
    }




    function getCategoryNameById(id) {
        let category = categories.filter(a => a._id == id)

        if (category.length > 0)
            return category[0].name

        return ""
    }




    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderMainCategories()}
            {renderRestaurantList()}

        </SafeAreaView>
    )
}

export default Home;