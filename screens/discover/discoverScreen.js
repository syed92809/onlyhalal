import React, { useState } from "react";
import { SafeAreaView, View, Dimensions, StatusBar, StyleSheet, TouchableOpacity, FlatList, Image, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBar";
import { MaterialIcons } from '@expo/vector-icons';
import { Snackbar } from 'react-native-paper';
import { BottomSheet } from "@rneui/themed";

const offerBannersList = [
    {
        id: '1',
        image: require('../../assets/images/slider/slider_1.png'),
    },
    {
        id: '2',
        image: require('../../assets/images/slider/slider_2.png'),
    },
    {
        id: '3',
        image: require('../../assets/images/slider/slider_3.png'),
    },
    {
        id: '4',
        image: require('../../assets/images/slider/slider_4.png'),
    },
    {
        id: '5',
        image: require('../../assets/images/slider/slider_5.png'),
    },
    {
        id: '6',
        image: require('../../assets/images/slider/slider_6.png'),
    }
];

const categoriesList = [
    {
        id: '1',
        image: require('../../assets/images/category/all.png'),
        type: 'All',
    },
    {
        id: '2',
        image: require('../../assets/images/category/coffee.png'),
        type: 'Coffee',
    },
    {
        id: '3',
        image: require('../../assets/images/category/drink.png'),
        type: 'Drink',
    },
    {
        id: '4',
        image: require('../../assets/images/category/fastfood.png'),
        type: 'FastFood',
    },
    {
        id: '5',
        image: require('../../assets/images/category/pizza.png'),
        type: 'Pizza',
    },
    {
        id: '6',
        image: require('../../assets/images/category/snacks.png'),
        type: 'Snacks',
    }
];

const productsOrderedList = [
    {
        id: '1',
        image: require("../../assets/images/products/products_6.png"),
        foodName: 'Fried Noodles',
        foodCategory: 'Chinese',
        isFavourite: false,
    },
    {
        id: '2',
        image: require("../../assets/images/products/products_1.png"),
        foodName: 'Hakka Nuddles',
        foodCategory: 'Chinese',
        isFavourite: false,
    },
    {
        id: '3',
        image: require("../../assets/images/products/products_2.png"),
        foodName: 'Dry Manchuriyan',
        foodCategory: 'Chinese',
        isFavourite: false,
    },
    {
        id: '4',
        image: require("../../assets/images/products/products_3.png"),
        foodName: 'Margherita Pizza',
        foodCategory: 'Delicious Pizza',
        isFavourite: false,
    },
    {
        id: '5',
        image: require("../../assets/images/products/products_4.png"),
        foodName: 'Thin Crust Pizza',
        foodCategory: 'Delicious Pizza',
        isFavourite: false,
    },
    {
        id: '6',
        image: require("../../assets/images/products/products_5.png"),
        foodName: 'Veg Burger',
        foodCategory: 'Fast Food',
        isFavourite: false,
    },
];

const favouriteRestaurantsList = [
    {
        id: '1',
        image: require('../../assets/images/restaurant/restaurant_5.png'),
        restaurentName: 'Bar 61 Restaurant',
        restaurentAddress: '76A England',
        isFavourite: false,
    },
    {
        id: '2',
        image: require('../../assets/images/restaurant/restaurant_4.png'),
        restaurentName: 'Core by Clare',
        restaurentAddress: '220 Opera Street',
        isFavourite: false,
    },
    {
        id: '3',
        image: require('../../assets/images/restaurant/restaurant_3.png'),
        restaurentName: 'Amrutha Lounge',
        restaurentAddress: '90B Silicon Velley',
        isFavourite: false,
    },
    {
        id: '4',
        image: require('../../assets/images/restaurant/restaurant_2.png'),
        restaurentName: 'The Barbary',
        restaurentAddress: '99C OBC Area',
        isFavourite: false,
    },
    {
        id: '5',
        image: require('../../assets/images/restaurant/restaurant_1.png'),
        restaurentName: 'The Palomor',
        restaurentAddress: '31A Om Colony',
        isFavourite: false,
    }
];

const hotSalesList = [
    {
        id: '1',
        image: require("../../assets/images/products/products_6.png"),
        foodName: 'Margherita Pizza',
        foodCategory: 'Delicious Pizza',
        amount: 5.0,
        isFavourite: false,
    },
    {
        id: '2',
        image: require("../../assets/images/products/products_4.png"),
        foodName: 'Thin Crust Pizza',
        foodCategory: 'Delicious Pizza',
        amount: 12.0,
        isFavourite: false,
    },
    {
        id: '3',
        image: require("../../assets/images/products/products_5.png"),
        foodName: 'Veg Burger',
        foodCategory: 'Fast Food',
        amount: 4.0,
        isFavourite: false,
    },
    {
        id: '4',
        image: require("../../assets/images/products/products_6.png"),
        foodName: 'Fried Noodles',
        foodCategory: 'Chinese',
        amount: 11.0,
        isFavourite: false,
    },
    {
        id: '5',
        image: require("../../assets/images/products/products_1.png"),
        foodName: 'Hakka Noodles',
        foodCategory: 'Chinese',
        amount: 7.0,
        isFavourite: false,
    },
    {
        id: '6',
        image: require("../../assets/images/products/products_2.png"),
        foodName: 'Dry Manchuriyan',
        foodCategory: 'Chinese',
        amount: 9.9,
        isFavourite: false,
    }
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

const optionsList = [
    {
        id: '1',
        option: 'Add Lemon',
        isSelected: false,
    },
    {
        id: '2',
        option: 'Add Ice',
        isSelected: false,
    },
];

const { width } = Dimensions.get('screen');

const intialAmount = 2.5;

const DiscoverScreen = ({ navigation }) => {

    const [state, setState] = useState({
        productsOrdereds: productsOrderedList,
        favouriteRestaurents: favouriteRestaurantsList,
        hotSales: hotSalesList,
        showSnackBar: false,
        isFavourite: false,
        showBottomSheet: false,
        showAddressSheet: false,
        currentAddress: addressesList[0].address,
        sizeIndex: null,
        qty: 1,
        options: optionsList,
        showCustomizeBottomSheet: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        productsOrdereds,
        favouriteRestaurents,
        hotSales,
        showSnackBar,
        isFavourite,
        showBottomSheet,
        showAddressSheet,
        currentAddress,
        sizeIndex,
        qty,
        options,
        showCustomizeBottomSheet,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <CollapsingToolbar
                leftItem={
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ showAddressSheet: true })}
                        style={{ marginLeft: Sizes.fixPadding * 2.0, marginTop: Sizes.fixPadding }}>
                        <Text style={{ ...Fonts.darkPrimaryColor15Medium }}>
                            DELIVERING TO
                        </Text>
                        <View style={{ marginTop: Sizes.fixPadding - 8.0, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name='location-on' size={17} color={Colors.whiteColor} />
                            <Text numberOfLines={1} style={{ maxWidth: width / 1.7, ...Fonts.whiteColor14Medium }}>
                                {currentAddress}
                            </Text>
                            <MaterialIcons name="arrow-drop-down" size={20} color={Colors.whiteColor} />
                        </View>
                    </TouchableOpacity>
                }
                rightItem={
                    <MaterialIcons
                        name="notifications"
                        size={25}
                        color={Colors.whiteColor}
                        style={{ marginTop: Sizes.fixPadding + 5.0, }}
                        onPress={() => navigation.push('Notifications')}
                    />
                }
                element={
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => navigation.push('Search')}
                        style={styles.searchInfoWrapStyle}>
                        <MaterialIcons name="search" size={22} color={Colors.whiteColor} />
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.lightPrimaryColor16Regular }}>
                            Do you want find something?
                        </Text>
                    </TouchableOpacity>
                }
                toolbarColor={Colors.primaryColor}
                toolbarMinHeight={60}
                toolbarMaxHeight={170}
                isImage={false}
            >
                <View style={{ flex: 1, backgroundColor: Colors.primaryColor, }}>
                    <View style={styles.pageStyle}>
                        {offerBanners()}
                        {categoriesInfo()}
                        {productsOrderedInfo()}
                        {favouriteRestaurantsInfo()}
                        {hotSalesInfo()}
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
            {selectAddressSheet()}
        </SafeAreaView >
    )

    function hotSalesInfo() {
        return (
            <>
                {hotSaleInfo()}
                {custmizeBottomSheet()}
            </>
        )
    }

    function custmizeBottomSheet() {
        return (
            <BottomSheet
                isVisible={showCustomizeBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => updateState({ showCustomizeBottomSheet: false })}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={{
                        backgroundColor: Colors.whiteColor,
                        borderTopRightRadius: Sizes.fixPadding * 2.0,
                        borderTopLeftRadius: Sizes.fixPadding * 2.0,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ showCustomizeBottomSheet: false })}
                    >
                        <View style={styles.bottomSheetOpenCloseDividerStyle} />
                        {addNewItemTitle()}
                        {CustmizeItemInfo()}
                    </TouchableOpacity>
                    {sizeTitle()}
                    {sizesInfo()}
                    {optionsTitle()}
                    {optionsInfo()}
                    {addToCartAndItemsInfo()}
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    function addToCartAndItemsInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    updateState({ showCustomizeBottomSheet: false })
                    navigation.push('ConfirmOrder')
                }}
                style={styles.addToCartAndItemsInfoWrapStyle}>
                <View>
                    <Text style={{ ...Fonts.darkPrimaryColor16Medium }}>
                        {qty} ITEM
                    </Text>
                    <Text style={{ ...Fonts.whiteColor15Regular }}>
                        ${(intialAmount * qty).toFixed(1)}
                    </Text>
                </View>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Add to Cart
                </Text>
            </TouchableOpacity>
        )
    }

    function updateOptions({ id }) {
        const newList = options.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isSelected: !item.isSelected };
                return updatedItem;
            }
            return item;
        });
        updateState({ options: newList });
    }

    function optionsInfo() {
        return (
            <View style={{ paddingTop: Sizes.fixPadding }}>
                {options.map((item) => (
                    <View key={`${item.id}`}>
                        <View style={styles.optionWrapStyle}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateOptions({ id: item.id })}
                                style={{
                                    ...styles.radioButtonStyle,
                                    backgroundColor: item.isSelected ? Colors.primaryColor : Colors.whiteColor,
                                }}
                            >
                                {
                                    item.isSelected ?
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
                                {item.option}
                            </Text>
                        </View>
                    </View>
                ))}
            </View>
        )
    }

    function optionsTitle() {
        return (
            <View style={{ backgroundColor: Colors.bodyBackColor, padding: Sizes.fixPadding, }}>
                <Text style={{ ...Fonts.grayColor16Medium }}>
                    Options
                </Text>
            </View>
        )
    }

    function sizesInfo() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: Sizes.fixPadding,
                paddingTop: Sizes.fixPadding
            }}>
                {sizes({ size: 'S', contain: '500 ml', price: 0, index: 1, })}
                {sizes({ size: 'M', contain: '750 ml', price: 0.5, index: 2 })}
                {sizes({ size: 'L', contain: '1100 ml', price: 1.2, index: 3 })}
            </View>
        )
    }

    function sizes({ size, contain, price, index }) {
        return (
            <View style={styles.sizesWrapStyle}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => updateState({ sizeIndex: index })}
                        style={{
                            ...styles.radioButtonStyle,
                            backgroundColor: sizeIndex == index ? Colors.primaryColor : Colors.whiteColor,
                        }}
                    >
                        {
                            sizeIndex == index ?
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
                        Sizes {size}
                    </Text>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                        ({contain})
                    </Text>
                </View>
                <Text style={{ ...Fonts.blackColor16Medium }}>
                    ${price}
                </Text>
            </View>
        )
    }

    function addNewItemTitle() {
        return (
            <Text style={{
                marginHorizontal: Sizes.fixPadding,
                marginBottom: Sizes.fixPadding + 5.0,
                ...Fonts.blackColor19Medium
            }}>
                Add New Item
            </Text>
        )
    }

    function sizeTitle() {
        return (
            <View style={styles.sizeTitleStyle}>
                <Text style={{ ...Fonts.grayColor16Medium }}>
                    Size
                </Text>
                <Text style={{ ...Fonts.grayColor16Medium }}>
                    Price
                </Text>
            </View>
        )
    }

    function CustmizeItemInfo() {
        return (
            <View style={styles.custmizeItemInfoWrapStyle}>
                <Image
                    source={require('../../assets/images/products/lemon_juice.png')}
                    style={{ width: 80.0, height: 80.0, borderRadius: Sizes.fixPadding - 5.0 }}
                />
                <View style={{
                    flex: 1,
                    marginVertical: Sizes.fixPadding - 7.0,
                    justifyContent: 'space-between',
                    marginLeft: Sizes.fixPadding
                }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Lemon Juice Fresh
                    </Text>
                    <View style={{ alignItems: 'flex-start', flexDirection: 'row', justifyContent: "space-between" }}>
                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                            ${(intialAmount * qty).toFixed(1)}
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: 'center' }}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => { qty > 1 ? updateState({ qty: qty - 1 }) : null }}
                                style={{ backgroundColor: qty > 1 ? Colors.primaryColor : '#E0E0E0', ...styles.qtyAddRemoveButtonStyle }}>
                                <MaterialIcons
                                    name="remove"
                                    color={qty > 1 ? Colors.whiteColor : Colors.blackColor}
                                    size={18}
                                />
                            </TouchableOpacity>
                            <Text style={{ marginHorizontal: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                                {qty}
                            </Text>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ qty: qty + 1 })}
                                style={{ backgroundColor: Colors.primaryColor, ...styles.qtyAddRemoveButtonStyle }}>
                                <MaterialIcons
                                    name="add"
                                    color={Colors.whiteColor}
                                    size={18}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View >
        )
    }

    function handleHotSalesUpdate({ id }) {
        const newList = hotSales.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, isFavourite: !property.isFavourite };
                return updatedItem;
            }
            return property;
        });
        updateState({ hotSales: newList });
    }

    function hotSaleInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.hotSalesInfoWrapStyle}>
                <Image
                    source={item.image}
                    style={styles.hotSaleImageStyle}
                />
                <MaterialIcons
                    name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={Colors.whiteColor}
                    style={{ position: 'absolute', right: 10.0, top: 10.0, }}
                    onPress={() => {
                        handleHotSalesUpdate({ id: item.id })
                        updateState({ isFavourite: item.isFavourite, showSnackBar: true })
                    }}
                />
                <View style={{
                    paddingHorizontal: Sizes.fixPadding - 5.0,
                    paddingBottom: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding - 5.0
                }}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                        {item.foodName}
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor14Medium }}>
                        {item.foodCategory}
                    </Text>
                    <View style={{ marginTop: Sizes.fixPadding - 7.0, flexDirection: "row", alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                            ${item.amount.toFixed(1)}
                        </Text>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => updateState({ showCustomizeBottomSheet: true })}
                            style={styles.addIconWrapStyle}
                        >
                            <MaterialIcons
                                name="add"
                                size={17}
                                color={Colors.whiteColor}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
        return (
            <View>
                <View style={{ marginHorizontal: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        Hot Sale
                    </Text>
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        View all
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={hotSales}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 3.0,
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function selectAddressSheet() {
        return (
            <BottomSheet
                isVisible={showAddressSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => { updateState({ showAddressSheet: false }) }}
            >
                <View style={{ backgroundColor: 'white', paddingTop: Sizes.fixPadding + 5.0 }}>
                    <Text style={{ textAlign: 'center', ...Fonts.blackColor19Medium }}>
                        SELECT ADDRESS
                    </Text>
                    <View style={{ backgroundColor: Colors.grayColor, height: 0.30, marginHorizontal: Sizes.fixPadding, marginVertical: Sizes.fixPadding + 5.0 }} />
                    {addresses()}
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => {
                            updateState({ showAddressSheet: false })
                            navigation.push('AddNewDeliveryAddress')
                        }}
                        style={{
                            marginTop: Sizes.fixPadding - 5.0,
                            marginHorizontal: Sizes.fixPadding + 3.0,
                            marginBottom: Sizes.fixPadding + 5.0,
                            flexDirection: 'row', alignItems: 'center',
                        }}>
                        <MaterialIcons
                            name="add"
                            color='#2196F3'
                            size={22}
                        />
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blueColor15Medium }}>
                            Add New Address
                        </Text>
                    </TouchableOpacity>
                </View>
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

    function handleFavouriteRestaurentsUpdate({ id }) {
        const newList = favouriteRestaurents.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, isFavourite: !property.isFavourite };
                return updatedItem;
            }
            return property;
        });
        updateState({ favouriteRestaurents: newList })
    }

    function favouriteRestaurantsInfo() {
        const renderItem = ({ item }) => (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('RestaurantDetail', { item })}
                style={styles.favouriteRestaurentsInfoWrapStyle}>
                <Image
                    source={item.image}
                    style={styles.favouriteRestaurentImageStyle}
                />

                <MaterialIcons
                    name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={Colors.whiteColor}
                    style={{ position: 'absolute', right: 10.0, top: 10.0, }}
                    onPress={() => {
                        handleFavouriteRestaurentsUpdate({ id: item.id })
                        updateState({ isFavourite: item.isFavourite, showSnackBar: true })
                    }}
                />

                <View style={{
                    paddingHorizontal: Sizes.fixPadding - 5.0,
                    paddingBottom: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding - 5.0
                }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
                        {item.restaurentName}
                    </Text>
                    <Text numberOfLines={2} style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor14Medium }}>
                        {item.restaurentAddress}
                    </Text>
                </View>
            </TouchableOpacity>
        )
        return (
            <View>
                <View style={{ marginHorizontal: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        Favourite Restaurants
                    </Text>
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        View all
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={favouriteRestaurents}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 3.0,
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function handleProductOrderedUpdate({ id }) {
        const newList = productsOrdereds.map((property) => {
            if (property.id === id) {
                const updatedItem = { ...property, isFavourite: !property.isFavourite };
                return updatedItem;
            }
            return property;
        });
        updateState({ productsOrdereds: newList })
    }

    function productsOrderedInfo() {
        const renderItem = ({ item }) => (
            <View style={styles.productsOrderedInfoWrapStyle}>
                <Image
                    source={item.image}
                    style={styles.productsOrderedImageStyle}
                />
                <MaterialIcons
                    name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={Colors.whiteColor}
                    style={{ position: 'absolute', right: 10.0, top: 10.0, }}
                    onPress={() => {
                        handleProductOrderedUpdate({ id: item.id })
                        updateState({ isFavourite: item.isFavourite, showSnackBar: true })
                    }}
                />

                <View style={{
                    paddingHorizontal: Sizes.fixPadding - 5.0,
                    paddingBottom: Sizes.fixPadding,
                    paddingTop: Sizes.fixPadding - 5.0
                }}>
                    <Text style={{ ...Fonts.blackColor15Medium }}>
                        {item.foodName}
                    </Text>
                    <Text style={{ marginTop: Sizes.fixPadding - 7.0, ...Fonts.grayColor14Medium }}>
                        {item.foodCategory}
                    </Text>
                </View>
            </View>
        )
        return (
            <View>
                <View style={{ marginHorizontal: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        Product Ordered
                    </Text>
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        View all
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={productsOrdereds}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 3.0,
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function categoriesInfo() {
        const renderItem = ({ item }) => (
            <View style={{ alignItems: 'center', marginRight: Sizes.fixPadding * 2.0, }}>
                <View style={styles.categoryImageWrapStyle}>
                    <Image
                        source={item.image}
                        style={{ width: 40.0, height: 40.0, }}
                        resizeMode="contain"
                    />
                </View>
                <Text style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                    {item.type}
                </Text>
            </View>
        )
        return (
            <View>
                <Text style={{ ...Fonts.blackColor19Medium, marginHorizontal: Sizes.fixPadding, }}>
                    Categories
                </Text>
                <FlatList
                    horizontal
                    data={categoriesList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding + 5.0,
                        paddingBottom: Sizes.fixPadding * 3.0,
                        paddingTop: Sizes.fixPadding,
                    }}
                />
            </View>
        )
    }

    function offerBanners() {
        const renderItem = ({ item }) => (
            <Image
                source={item.image}
                style={styles.offerBannersImageStyle}
            />
        )
        return (
            <View>
                <FlatList
                    horizontal
                    data={offerBannersList}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingVertical: Sizes.fixPadding * 2.0,
                        paddingLeft: Sizes.fixPadding
                    }}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
        paddingBottom: Sizes.fixPadding * 7.0,
    },
    offerBannersImageStyle: {
        width: 170.0,
        height: 160.0,
        borderRadius: Sizes.fixPadding,
        marginRight: Sizes.fixPadding,
    },
    categoryImageWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        width: 60.0,
        height: 60.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 57.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    searchInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkPrimaryColor,
        flex: 1,
        marginHorizontal: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
    },
    productsOrderedInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        width: 130.0,
        marginRight: Sizes.fixPadding + 2.0
    },
    productsOrderedImageStyle: {
        width: 130.0,
        height: 110.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0
    },
    favouriteRestaurentsInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        width: 130.0,
        marginRight: Sizes.fixPadding + 2.0
    },
    favouriteRestaurentImageStyle: {
        width: 130.0,
        height: 110.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0
    },
    hotSalesInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        width: 130.0,
        marginRight: Sizes.fixPadding + 2.0
    },
    hotSaleImageStyle: {
        width: 130.0,
        height: 110.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderTopRightRadius: Sizes.fixPadding - 5.0
    },
    addIconWrapStyle: {
        width: 22.0,
        height: 22.0,
        borderRadius: 11.0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
    },
    addToCartAndItemsInfoWrapStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginVertical: Sizes.fixPadding,
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
    optionWrapStyle: {
        paddingBottom: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center'
    },
    sizesWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding
    },
    sizeTitleStyle: {
        backgroundColor: Colors.bodyBackColor,
        padding: Sizes.fixPadding,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    custmizeItemInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        flexDirection: 'row',
        flex: 1,
        marginHorizontal: Sizes.fixPadding
    },
    qtyAddRemoveButtonStyle: {
        width: 27.0,
        height: 27.0,
        borderRadius: 13.5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bottomSheetOpenCloseDividerStyle: {
        backgroundColor: Colors.grayColor,
        height: 4.0,
        borderRadius: Sizes.fixPadding,
        width: 40.0,
        alignSelf: 'center',
        marginTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0
    },
    addressWrapStyle: {
        paddingBottom: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default DiscoverScreen;