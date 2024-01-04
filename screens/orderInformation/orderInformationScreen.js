import React from "react";
import { SafeAreaView, View, StatusBar, StyleSheet, TouchableOpacity, ScrollView, Image, Text, } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';

const OrderInformationScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView showsVerticalScrollIndicator={false}>
                    {deliveryToInfo()}
                    {deliveryTimeInfo()}
                    {orderInfo()}
                    {ratingAndReorderButton()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )

    function ratingAndReorderButton() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 3.0, flexDirection: 'row', marginHorizontal: Sizes.fixPadding }}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.push('Rating')}
                    style={styles.ratingButtonStyle}
                >
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Rating
                    </Text>
                </TouchableOpacity>
                <View style={styles.reviewButtonStyle}>
                    <Text style={{ ...Fonts.whiteColor16Medium }}>
                        Re-Order
                    </Text>
                </View>
            </View>

        )
    }

    function orderInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding, marginTop: Sizes.fixPadding, }}>
                <View style={{ marginBottom: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center', }}>
                    <Image
                        source={require('../../assets/images/products/lemon_juice.png')}
                        style={{ width: 80.0, height: 80.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
                        <Text style={{ ...Fonts.blackColor16Medium }}>
                            Kichi Coffee & Dring
                        </Text>
                        <Text style={{ ...Fonts.grayColor14Medium }}>
                            Lemon Juice Fresh
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Subtotal (1 item)
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        $2.9
                    </Text>
                </View>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Ship Fee (2.4 Km)
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        $1.3
                    </Text>
                </View>
                <View style={{ marginVertical: Sizes.fixPadding + 2.0, backgroundColor: Colors.grayColor, height: 0.50, }} />
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                        Total
                    </Text>
                    <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                        $4.2
                    </Text>
                </View>
            </View>
        )
    }

    function deliveryTimeInfo() {
        return (
            <View style={styles.deliveryTimeWrapStyle}>
                <Text style={{ ...Fonts.grayColor16Medium }}>
                    Delivery Time
                </Text>
                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor17Medium }}>
                    45 min
                </Text>
            </View>
        )
    }

    function deliveryToInfo() {
        return (
            <View style={{ marginBottom: Sizes.fixPadding + 5.0, marginHorizontal: Sizes.fixPadding, }}>
                <Text style={{ marginBottom: Sizes.fixPadding - 3.0, ...Fonts.blackColor17Medium }}>
                    Delivery to
                </Text>
                <View style={styles.deliveryInfoWrapStyle}>
                    <Image
                        source={require('../../assets/images/restaurant_location.jpg')}
                        style={{ width: 120.0, height: 120.0, }}
                    />
                    <View style={{ marginVertical: Sizes.fixPadding, justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor16Medium }}>
                                76A England
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="person"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor14Regular }}>
                                Beatrice Owen
                            </Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="phone"
                                color={Colors.blackColor}
                                size={20}
                                onPress={() => navigation.pop()}
                                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 2.0, ...Fonts.blackColor14Regular }}>
                                +1(454) 34211432
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    }

    function header() {
        return (
            <View style={{ marginTop: Sizes.fixPadding, marginBottom: Sizes.fixPadding + 5.0 }}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    onPress={() => navigation.pop()}
                    style={{ marginLeft: Sizes.fixPadding }}
                />
                <View style={styles.confirmOrderTitleWithIdWrapStyle}>
                    <Text style={{ ...Fonts.blackColor22Medium }}>
                        Order Information
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ ...Fonts.grayColor17Medium }}>
                            ID:
                        </Text>
                        <Text style={{ ...Fonts.blackColor17Medium }}>
                            43e2116
                        </Text>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    deliveryTimeWrapStyle: {
        backgroundColor: Colors.bodyBackColor,
        padding: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Sizes.fixPadding - 5.0,
    },
    deliveryInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 3.0,
        borderColor: '#E0E0E0',
        borderWidth: 1.0,
        flexDirection: 'row',
        padding: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0
    },
    confirmOrderTitleWithIdWrapStyle: {
        marginTop: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    ratingButtonStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding + 3.0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        marginRight: Sizes.fixPadding - 5.0,
    },
    reviewButtonStyle: {
        borderRadius: Sizes.fixPadding - 5.0,
        paddingVertical: Sizes.fixPadding + 3.0,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        marginLeft: Sizes.fixPadding - 5.0,
    }
})

export default OrderInformationScreen;