import React, { useState } from "react";
import { SafeAreaView, View, StyleSheet, Dimensions, Text, Image, TextInput, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBar";
import { Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('screen');

const restaurantsList = [
    {
        id: '1',
        image: require('../../assets/images/restaurant/restaurant_5.png'),
        name: 'Bar 61 Restaurant',
        address: '76A England',
        rating: 4.5,
        distance: 0.5,
        isFavourite: false,
    },
    {
        id: '2',
        image: require('../../assets/images/restaurant/restaurant_4.png'),
        name: 'Core by Clare Smyth',
        address: '220 Opera Street',
        rating: 4.2,
        distance: 1.8,
        isFavourite: false,
    },
    {
        id: '3',
        image: require('../../assets/images/restaurant/restaurant_3.png'),
        name: 'Amrutha Lounge',
        address: '90B Silicon Velley',
        rating: 5.0,
        distance: 0.7,
        isFavourite: false,
    },
    {
        id: '4',
        image: require('../../assets/images/restaurant/restaurant_2.png'),
        name: 'The Barbary',
        address: '99C OBC Area',
        rating: 4.7,
        distance: 0.2,
        isFavourite: false,
    },
    {
        id: '5',
        image: require('../../assets/images/restaurant/restaurant_1.png'),
        name: 'The Palomar',
        address: '31A Om Colony',
        rating: 4.1,
        distance: 1.5,
        isFavourite: false,
    }
];

const RestaurantsListScreen = ({ navigation }) => {

    const [state, setState] = useState({
        restaurants: restaurantsList,
        showSnackBar: false,
        isFavourite: false,
        search: 'Juice',
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        restaurants,
        showSnackBar,
        isFavourite,
        search,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <CollapsingToolbar
                element={
                    <View style={styles.searchFieldAndExitTextWrapStyle}>
                        <View style={styles.searchFieldWrapStyle}>
                            <MaterialIcons name="search" size={25} color={Colors.whiteColor} />
                            <TextInput
                                style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.lightPrimaryColor16Regular }}
                                selectionColor={Colors.primaryColor}
                                onChangeText={(text) => updateState({ search: text })}
                                value={search}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.pop()}
                            style={{ flex: 0.22, marginLeft: Sizes.fixPadding, }}
                        >
                            <Text style={{ ...Fonts.whiteColor17Regular }}>
                                Exit
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolbarMinHeight={0}
                toolbarMaxHeight={95}
                isImage={false}
                childrenMinHeight={750}
            >
                <View style={{ flex: 1, backgroundColor: Colors.primaryColor, }}>
                    <View style={styles.pageStyle}>
                        {restaurantsCount()}
                        {restaurantsData()}
                    </View>
                </View>
            </CollapsingToolbar>
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {isFavourite ? 'Removed from Favourite' : 'Added to Favourite'}
            </Snackbar>
        </SafeAreaView>
    )

    function restaurantsCount() {
        return (
            <Text style={{
                ...Fonts.primaryColor16Medium,
                marginHorizontal: Sizes.fixPadding,
                marginVertical: Sizes.fixPadding * 2.0,
            }}>
                Approximatelt 134 results
            </Text>
        )
    }

    function restaurantsData() {
        return (
            <>
                {restaurants.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.push('RestaurantDetail', { item })}
                            style={styles.restaurantWrapStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                <Image
                                    source={item.image}
                                    style={styles.restaurantImageStyle}
                                />
                                <View style={{ width: width / 2.0, marginLeft: Sizes.fixPadding, height: 100.0, justifyContent: 'space-evenly' }}>
                                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                                        {item.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="location-on" size={20} color={Colors.grayColor} />
                                        <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                                            {item.address}
                                        </Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                        <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
                                        <Text style={{ marginLeft: Sizes.fixPadding - 8.0, ...Fonts.grayColor14Medium }}>
                                            {item.rating.toFixed(1)}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                            <View style={{ marginRight: Sizes.fixPadding, paddingVertical: Sizes.fixPadding, height: 100.0, justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <MaterialIcons
                                    name={item.isFavourite ? "bookmark" : 'bookmark-outline'}
                                    size={22}
                                    color={Colors.grayColor}
                                    onPress={() => {
                                        handleRestaurantsUpdate({ id: item.id })
                                        updateState({ isFavourite: item.isFavourite, showSnackBar: true })
                                    }}
                                />
                                <Text style={{ ...Fonts.grayColor14Medium }}>
                                    {item.distance} km
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))}
            </>
        )
    }

    function handleRestaurantsUpdate({ id }) {
        const newList = restaurants.map((restaurant) => {
            if (restaurant.id === id) {
                const updatedItem = { ...restaurant, isFavourite: !restaurant.isFavourite };
                return updatedItem;
            }
            return restaurant;
        });
        updateState({ restaurants: newList })
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
        paddingBottom: Sizes.fixPadding * 6.0,
    },
    searchFieldWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkPrimaryColor,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        flex: 1,
    },
    searchFieldAndExitTextWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding * 2.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    restaurantWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 100.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    }
})

export default RestaurantsListScreen;