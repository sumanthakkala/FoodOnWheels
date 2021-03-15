import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    Image
} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { icons, COLORS, SIZES, FONTS } from '../constants'
import * as dummyData from '../data/dummyData'

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


const Search = ({ navigation }) => {

    const [searchText, setSearchText] = React.useState("");
    const [filteredRestaurants, setFilteredRestaurants] = React.useState([]);
    // console.log(dummyData.restaurantData)
    const [categories, setCategories] = React.useState(dummyData.categoryData)
    const [restaurants, setRestaurants] = React.useState(dummyData.restaurantData)
    const [currentLocation, setCurrentLocation] = React.useState(dummyData.initialCurrentLocation)


    function searchTextUpdated(text) {
        setSearchText(text)

        if (text.length != 0) {
            let restaurantList = dummyData.restaurantData.filter(a => a.name.toLowerCase().includes(text.toLowerCase()))
            setFilteredRestaurants(restaurantList)
        }
        else {
            setFilteredRestaurants([])
        }
    }


    function getCategoryNameById(id) {
        let category = categories.filter(a => a.id == id)

        if (category.length > 0)
            return category[0].name

        return ""
    }


    function renderRestaurantList() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                style={{ marginBottom: SIZES.padding * 2 }}
                onPress={() => navigation.navigate("Restaurant", {
                    item,
                    currentLocation
                })}
            >
                {/* Image */}
                <View
                    style={{
                        marginBottom: SIZES.padding
                    }}
                >
                    <Image
                        source={item.photo}
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

        // if (restaurants.length > 0) {
        //     return (
        //         <FlatList
        //             data={filteredRestaurants}
        //             keyExtractor={item => `${item.id}`}
        //             renderItem={renderItem}
        //             contentContainerStyle={{
        //                 paddingHorizontal: SIZES.padding * 2,
        //                 paddingBottom: 30
        //             }}
        //         />
        //     )
        // }
        // else {
        //     return (
        //         <View>

        //         </View>
        //     )
        // }
        return (
            <FlatList
                data={filteredRestaurants}
                keyExtractor={item => `${item.id}`}
                renderItem={renderItem}
                contentContainerStyle={{
                    paddingHorizontal: SIZES.padding * 2,
                    paddingBottom: 30
                }}
            />
        )
    }


    return (

        <SafeAreaView style={styles.container}>
            <SearchBar
                placeholder="Type Here..."
                onChangeText={(text) => searchTextUpdated(text)}
                value={searchText}
                containerStyle={{
                    backgroundColor: COLORS.lightGray4,
                    borderBottomColor: 'transparent',
                    borderTopColor: 'transparent'
                }}
                inputContainerStyle={{
                    backgroundColor: COLORS.secondary,
                    borderRadius: 25
                }}
                searchIcon={{
                    color: COLORS.black,
                    style: { marginLeft: 10 }
                }}
            // inputStyle={{ backgroundColor: COLORS.lightGray4 }}

            />

            {renderRestaurantList()}

        </SafeAreaView>
    )
}

export default Search
