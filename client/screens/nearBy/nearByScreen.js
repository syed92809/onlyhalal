import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, FlatList, Dimensions, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import { Snackbar } from 'react-native-paper';
import { BottomSheet } from "@rneui/themed";

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
    },

];

const addressesList = [
    {
        id: '1',
        address: '76A, New York, US.'
    },
    {
        id: '2',
        address: '55C, California, US.'
    }
];

const NearByScreen = ({ navigation }) => {

    const [state, setState] = useState({
        showAddressSheet: false,
        currentAddress: addressesList[0].address,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        showAddressSheet,
        currentAddress,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <TabBarView navigation={navigation} />
                {selectAddressSheet()}
            </View>
        </SafeAreaView>
    )

    function selectAddressSheet() {
        return (
            <BottomSheet
                isVisible={showAddressSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ showAddressSheet: false })}
                    style={{ backgroundColor: 'white', paddingTop: Sizes.fixPadding + 5.0 }}
                >
                    <Text style={{ textAlign: 'center', ...Fonts.blackColor19Medium }}>
                        SELECT ADDRESS
                    </Text>
                    <View style={{ backgroundColor: Colors.grayColor, height: 0.50, marginHorizontal: Sizes.fixPadding, marginVertical: Sizes.fixPadding + 5.0 }} />
                    {addresses()}
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    function addresses() {
        return (
            <>
                {
                    addressesList.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={styles.addressWrapStyle}>
                                <TouchableOpacity
                                    activeOpacity={0.9}
                                    onPress={() => updateState({ currentAddress: item.address, showAddressSheet: false })}
                                    style={{
                                        ...styles.radioButtonStyle,
                                        backgroundColor: currentAddress == item.address ? Colors.primaryColor : Colors.whiteColor,
                                    }}
                                >
                                    {
                                        currentAddress == item.address ?
                                            <MaterialIcons
                                                name="done"
                                                size={18}
                                                color={Colors.whiteColor}
                                            />
                                            :
                                            null
                                    }
                                </TouchableOpacity>
                                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                                    {item.address}
                                </Text>
                            </View>
                        </View>
                    ))
                }
            </>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Nearby
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ showAddressSheet: true })}
                    style={styles.headerAddressWrapStyle}
                >
                    <MaterialIcons
                        name="location-on"
                        color={Colors.grayColor}
                        size={18}
                    />
                    <Text numberOfLines={1} style={{ width: width / 2.8, ...Fonts.grayColor16Medium }}>
                        {currentAddress}
                    </Text>
                    <MaterialIcons
                        name="arrow-drop-down"
                        color={Colors.grayColor}
                        size={18}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const TabBarView = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Food' },
        { key: 'second', title: 'Drink' },
        { key: 'third', title: 'Fastfood' },
        { key: 'forth', title: 'Asia' },
        { key: 'fifth', title: 'Chinese' },
        { key: 'sixth', title: 'Veg' },
        { key: 'seventh', title: 'Non Veg' },
    ]);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <Food navigation={navigation} />;
            case 'second':
                return <Food navigation={navigation} />;
            case 'third':
                return <Food navigation={navigation} />;
            case 'forth':
                return <Food navigation={navigation} />;
            case 'fifth':
                return <Food navigation={navigation} />;
            case 'sixth':
                return <Food navigation={navigation} />;
            case 'seventh':
                return <Food navigation={navigation} />;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}

            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{ height: 2.5, backgroundColor: Colors.primaryColor, }}
                    tabStyle={{
                        width: "auto",
                        height: 52.0,
                    }}
                    scrollEnabled={true}
                    style={{ backgroundColor: Colors.whiteColor }}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={
                            focused ?
                                { ...Fonts.primaryColor16Medium }
                                :
                                { ...Fonts.lightGrayColor16Medium }
                        }>
                            {route.title}
                        </Text>
                    )}
                />
            )
            }
        />
    )
}

const Food = ({ navigation }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);
    const [restaurants, setRestaurants] = useState(restaurantsList);

    const renderItem = ({ item }) => (
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
                        setIsFavourite(item.isFavourite);
                        setShowSnackBar(true);
                    }}
                />
                <Text style={{ ...Fonts.grayColor14Medium }}>
                    {item.distance} km
                </Text>
            </View>
        </TouchableOpacity>
    )

    return (
        <>
            <FlatList
                data={restaurants}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: Sizes.fixPadding,
                    paddingBottom: Sizes.fixPadding * 7.0
                }}
            />
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                {isFavourite ? 'Removed from Favourite' : 'Added to Favourite'}
            </Snackbar>
        </>
    )

    function handleRestaurantsUpdate({ id }) {
        const newList = restaurants.map((restaurant) => {
            if (restaurant.id === id) {
                const updatedItem = { ...restaurant, isFavourite: !restaurant.isFavourite };
                return updatedItem;
            }
            return restaurant;
        });
        setRestaurants(newList);
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: Sizes.fixPadding + 5.0,
        paddingRight: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
    },
    headerAddressWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: '#ECECEC',
        paddingVertical: Sizes.fixPadding,
        paddingLeft: Sizes.fixPadding,
        paddingRight: Sizes.fixPadding * 3.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 56.0,
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
    },
    radioButtonStyle: {
        width: 27.0,
        height: 27.0,
        borderRadius: 13.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
    },
    addressWrapStyle: {
        paddingBottom: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default NearByScreen;