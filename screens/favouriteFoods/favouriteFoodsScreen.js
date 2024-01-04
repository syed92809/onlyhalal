import React, { useState } from "react";
import { View, Text, Image, Animated, TouchableHighlight, StyleSheet, Dimensions, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from "react-native-paper";

const { width } = Dimensions.get('screen');

const favouriteFoodList = [
    {
        key: '1',
        image: require('../../assets/images/products/orange_juice.png'),
        name: 'Orange Juice',
        deliveredFrom: 'Bar 61 Restaurant',
        rating: 4.5,
        amount: 12.5,
    },
    {
        key: '2',
        image: require('../../assets/images/products/products_4.png'),
        name: 'Delicious Pizza',
        deliveredFrom: 'Core by Clare Smyth',
        rating: 4.2,
        amount: 15.9,
    },
    {
        key: '3',
        image: require('../../assets/images/products/products_10.png'),
        name: 'Choco Lava Cake',
        deliveredFrom: 'Amrutha Lounge',
        rating: 5.0,
        amount: 8.7,
    },
];

const rowSwipeAnimatedValues = {};

Array(favouriteFoodList.length + 1)
    .fill('')
    .forEach((_, i) => {
        rowSwipeAnimatedValues[`${i}`] = new Animated.Value(0);
    });

const FavouriteFoods = ({ navigation }) => {

    const [showSnackBar, setShowSnackBar] = useState(false);

    const [listData, setListData] = useState(favouriteFoodList);

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const deleteRow = (rowMap, rowKey) => {
        closeRow(rowMap, rowKey);
        const newData = [...listData];
        const prevIndex = listData.findIndex(item => item.key === rowKey);
        newData.splice(prevIndex, 1);
        setShowSnackBar(true);
        setListData(newData);
    };

    const onSwipeValueChange = swipeData => {
        const { key, value } = swipeData;
        rowSwipeAnimatedValues[key].setValue(Math.abs(value));
    };

    const renderItem = data => (
        <TouchableHighlight
            style={{ backgroundColor: Colors.bodyBackColor }}
            activeOpacity={0.9}
        >
            <View style={styles.orderWrapStyle}>
                <Image
                    source={data.item.image}
                    style={styles.restaurantImageStyle}
                />
                <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding, justifyContent: 'space-between' }}>
                    <Text numberOfLines={1} style={{ maxWidth: width / 1.8, ...Fonts.blackColor16Medium }}>
                        {data.item.name}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons
                            name="home"
                            color={Colors.grayColor}
                            size={20}
                        />
                        <Text numberOfLines={1} style={{ maxWidth: width / 1.8, marginLeft: Sizes.fixPadding - 8.0, ...Fonts.grayColor14Medium }}>
                            {data.item.deliveredFrom}
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="star"
                                color={Colors.ratingColor}
                                size={20}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 8.0, ...Fonts.grayColor14Medium }}>
                                {data.item.rating.toFixed(1)}
                            </Text>
                        </View>
                        <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                            ${data.item.amount.toFixed(1)}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );

    const renderHiddenItem = (data, rowMap) => (
        <View style={{ alignItems: 'center', flex: 1, }}>
            <TouchableOpacity
                style={styles.backDeleteContinerStyle}
                onPress={() => deleteRow(rowMap, data.item.key)}
            >
                <Animated.View
                    style={[
                        {
                            transform: [
                                {
                                    scale: rowSwipeAnimatedValues[
                                        data.item.key
                                    ].interpolate({
                                        inputRange: [45, 90],
                                        outputRange: [0, 1],
                                        extrapolate: 'clamp',
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <MaterialIcons
                        name="delete"
                        size={24}
                        color={Colors.whiteColor}
                        style={{ alignSelf: 'center' }}
                    />
                    <Text style={{ ...Fonts.whiteColor14Regular }}>
                        Delete
                    </Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            {
                listData.length == 0 ?
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <MaterialIcons name="bookmark-outline" size={60} color={Colors.grayColor} />
                        <Text style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding * 2.0 }}>
                            No Item in Favourite Foods
                        </Text>
                    </View>
                    :
                    <View style={{ flex: 1 }}>
                        <SwipeListView
                            data={listData}
                            renderItem={renderItem}
                            renderHiddenItem={renderHiddenItem}
                            rightOpenValue={-110}
                            onSwipeValueChange={onSwipeValueChange}
                            contentContainerStyle={{
                                paddingTop: Sizes.fixPadding * 2.0,
                            }}
                            showsVerticalScrollIndicator={false}
                        />
                    </View>
            }
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                Item Removed
            </Snackbar>
        </View>
    );
}

const styles = StyleSheet.create({
    orderWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 100.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    },
    orderIdIndicatorStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 11.0,
        height: 11.0,
        borderRadius: 5.5,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 58.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    backDeleteContinerStyle: {
        alignItems: 'center',
        bottom: 10.0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
        backgroundColor: Colors.redColor,
        right: 0,
    },
})

export default FavouriteFoods;