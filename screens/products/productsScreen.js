import React, { useState } from "react";
import { View, ScrollView, TouchableOpacity, ToastAndroid, Text, StyleSheet, FlatList, Image } from "react-native";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from "@rneui/themed";

const juiceList = [
    {
        id: '1',
        image: require('../../assets/images/products/lemon_juice.png'),
        name: 'Lemon Juice Fresh',
        amount: 5.2,
        isFavourite: false,
    },
    {
        id: '2',
        image: require('../../assets/images/products/orange_juice.png'),
        name: 'Lemon Juice Fresh',
        amount: 4.5,
        isFavourite: false,
    }
];

const coffeeList = [
    {
        id: '1',
        image: require('../../assets/images/products/lemon_juice.png'),
        name: 'Lemon Juice Fresh',
        amount: 5.2,
        isFavourite: false,
    },
    {
        id: '2',
        image: require('../../assets/images/products/orange_juice.png'),
        name: 'Lemon Juice Fresh',
        amount: 4.5,
        isFavourite: false,
    }
];

const popularItemsList = [
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

const Products = ({ navigation }) => {

    const [sizeIndex, setSizeIndex] = useState(null);

    const intialAmount = 2.5;

    const [qty, setQty] = useState(1);

    const [options, setOptions] = useState(optionsList);

    const [showBottomSheet, setShowBottomSheet] = useState(false);

    const [popularItems, setPopularItems] = useState(popularItemsList);

    const [juices, setJuices] = useState(juiceList);

    const [coffees, setCoffees] = useState(coffeeList);

    return (
        <View style={styles.pageStyle}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                {popularItemsInfo()}
                {juiceInfo()}
                {coffeeInfo()}
            </ScrollView>
            {custmizeBottomSheet()}
        </View>
    )

    function custmizeBottomSheet() {
        return (
            <BottomSheet
                isVisible={showBottomSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => setShowBottomSheet(false)}
            >
                <View
                    style={{
                        backgroundColor: Colors.whiteColor,
                        borderTopRightRadius: Sizes.fixPadding * 2.0,
                        borderTopLeftRadius: Sizes.fixPadding * 2.0,
                    }}
                >
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setShowBottomSheet(false)}
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
                </View>
            </BottomSheet>
        )
    }

    function addToCartAndItemsInfo() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setShowBottomSheet(false)
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
        setOptions(newList);

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
                        onPress={() => setSizeIndex(index)}
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
                                onPress={() => { qty > 1 ? setQty(qty - 1) : null }}
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
                                onPress={() => setQty(qty + 1)}
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

    function coffeeInfo() {
        return (
            <View style={styles.coffeeInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    Coffee
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor14Medium }}>
                    2 items
                </Text>
                {
                    coffees.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding * 2.0 }}>
                                <Image
                                    source={item.image}
                                    style={{ width: 90.0, height: 100.0, borderRadius: Sizes.fixPadding - 5.0 }}
                                />
                                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...Fonts.blackColor16Medium }}>
                                            {item.name}
                                        </Text>
                                        <MaterialIcons
                                            name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                                            size={22}
                                            color={Colors.grayColor}
                                            onPress={() => {
                                                handleCoffeesUpdate({ id: item.id })
                                                ToastAndroid.showWithGravity(
                                                    !item.isFavourite ? 'Added to Favourite' : 'Remove from Favourite',
                                                    ToastAndroid.LONG,
                                                    ToastAndroid.BOTTOM,
                                                    ToastAndroid.CENTER,
                                                )
                                            }}
                                        />
                                    </View>
                                    <Text style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.grayColor14Regular }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                                            ${item.amount.toFixed(1)}
                                        </Text>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setShowBottomSheet(true)}
                                            style={styles.addIconWrapStyle}>
                                            <MaterialIcons
                                                name="add"
                                                size={17}
                                                color={Colors.whiteColor}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View >
        )
    }

    function handleCoffeesUpdate({ id }) {
        const newList = coffees.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavourite: !item.isFavourite };
                return updatedItem;
            }
            return item;
        });
        setCoffees(newList);
    }

    function juiceInfo() {
        return (
            <View style={styles.juiceInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    Juice
                </Text>
                <Text style={{ marginBottom: Sizes.fixPadding + 5.0, marginTop: Sizes.fixPadding - 5.0, ...Fonts.grayColor14Medium }}>
                    2 items
                </Text>
                {
                    juices.map((item) => (
                        <View key={`${item.id}`}>
                            <View style={{ flexDirection: 'row', marginBottom: Sizes.fixPadding * 2.0 }}>
                                <Image
                                    source={item.image}
                                    style={{ width: 90.0, height: 100.0, borderRadius: Sizes.fixPadding - 5.0 }}
                                />
                                <View style={{ flex: 1, marginLeft: Sizes.fixPadding }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...Fonts.blackColor16Medium }}>
                                            {item.name}
                                        </Text>
                                        <MaterialIcons
                                            name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                                            size={22}
                                            color={Colors.grayColor}
                                            onPress={() => {
                                                handleJuicesUpdate({ id: item.id })
                                                ToastAndroid.showWithGravity(
                                                    !item.isFavourite ? 'Added to Favourite' : 'Remove from Favourite',
                                                    ToastAndroid.LONG,
                                                    ToastAndroid.BOTTOM,
                                                    ToastAndroid.CENTER,
                                                )
                                            }}
                                        />
                                    </View>
                                    <Text style={{ marginVertical: Sizes.fixPadding - 5.0, ...Fonts.grayColor14Regular }}>
                                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                                    </Text>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                                            ${item.amount.toFixed(1)}
                                        </Text>
                                        <TouchableOpacity
                                            activeOpacity={0.9}
                                            onPress={() => setShowBottomSheet(true)}
                                            style={styles.addIconWrapStyle}>
                                            <MaterialIcons
                                                name="add"
                                                size={17}
                                                color={Colors.whiteColor}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                }
            </View >
        )
    }

    function handleJuicesUpdate({ id }) {
        const newList = juices.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavourite: !item.isFavourite };
                return updatedItem;
            }
            return item;
        });
        setJuices(newList);
    }

    function popularItemsInfo() {

        const renderItem = ({ item }) => (
            <View style={styles.popularItemInfoWrapStyle}>
                <Image
                    source={item.image}
                    style={styles.popularItemImageStyle}
                />
                <MaterialIcons
                    name={item.isFavourite ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={Colors.whiteColor}
                    style={{ position: 'absolute', right: 10.0, top: 10.0, }}
                    onPress={() => {
                        handlePopularItemsUpdate({ id: item.id })
                        ToastAndroid.showWithGravity(
                            !item.isFavourite ? 'Added to Favourite' : 'Remove from Favourite',
                            ToastAndroid.LONG,
                            ToastAndroid.BOTTOM,
                            ToastAndroid.CENTER,
                        )
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
                        <View style={styles.addIconWrapStyle}>
                            <MaterialIcons
                                name="add"
                                size={17}
                                color={Colors.whiteColor}
                                onPress={() => {
                                    setShowBottomSheet(true)
                                }}
                            />
                        </View>
                    </View>
                </View>
            </View>
        )

        return (
            <View style={{
                marginVertical: Sizes.fixPadding
            }}>
                <View style={{ marginHorizontal: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        Popular Items
                    </Text>
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        See all
                    </Text>
                </View>
                <FlatList
                    horizontal
                    data={popularItems}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    contentContainerStyle={{
                        paddingLeft: Sizes.fixPadding,
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding,
                    }}
                    showsHorizontalScrollIndicator={false}
                />
            </View>
        )
    }

    function handlePopularItemsUpdate({ id }) {
        const newList = popularItems.map((item) => {
            if (item.id === id) {
                const updatedItem = { ...item, isFavourite: !item.isFavourite };
                return updatedItem;
            }
            return item;
        });
        setPopularItems(newList);
    }

}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
    },
    popularItemInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        width: 130.0,
        marginRight: Sizes.fixPadding + 2.0
    },
    popularItemImageStyle: {
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
    snackBarStyle: {
        position: 'absolute',
        bottom: -10.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    animatedView: {
        backgroundColor: "#333333",
        position: "absolute",
        bottom: 0,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding + 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding,
        justifyContent: "center",
        alignItems: "center",
    },
    coffeeInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 3.0
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
    juiceInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        paddingHorizontal: Sizes.fixPadding,
        paddingTop: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 2.0
    }
})

export default Products;