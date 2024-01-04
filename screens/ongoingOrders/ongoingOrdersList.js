import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";

const ongoingOrdersList = [
    {
        id: '1',
        image: require('../../assets/images/restaurant/restaurant_5.png'),
        name: 'Kichi Coffee & Drink',
        orderId: '43e4215',
        itemCount: 4,
        isWaiting: false,
    },
    {
        id: '2',
        image: require('../../assets/images/restaurant/restaurant_2.png'),
        name: 'Bar 61 Restaurant',
        orderId: '24r4568',
        itemCount: 1,
        isWaiting: true,
    },
    {
        id: '3',
        image: require('../../assets/images/restaurant/restaurant_1.png'),
        name: 'The Barbary',
        orderId: '86e5681',
        itemCount: 2,
        isWaiting: false,
    },
];

const OngoingOrders = ({ navigation }) => {
    return (
        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
                paddingTop: Sizes.fixPadding,
                paddingBottom: Sizes.fixPadding * 7.0,
            }}
        >
            {
                ongoingOrdersList.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.push('TrackOrder')}
                            style={styles.orderWrapStyle}>
                            <Image
                                source={item.image}
                                style={styles.restaurantImageStyle}
                            />
                            <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding + 2.0, justifyContent: 'space-between' }}>
                                <Text style={{ ...Fonts.blackColor16Medium }}>
                                    {item.name}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <View style={styles.orderIdIndicatorStyle}>
                                    </View>
                                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                                        {item.orderId}
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <Text style={{ ...Fonts.grayColor14Medium }}>
                                        {item.itemCount} Items
                                    </Text>
                                    <Text style={
                                        item.isWaiting
                                            ?
                                            { ...Fonts.blueColor15Regular }
                                            :
                                            { ...Fonts.primaryColor15Regular }
                                    }>
                                        {
                                            item.isWaiting
                                                ?
                                                'Waiting'
                                                :
                                                'On the Way'
                                        }
                                    </Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </View>
                ))
            }
        </ScrollView>
    )
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
    }
})

export default OngoingOrders;