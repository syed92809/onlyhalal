import React, { useEffect, useState } from "react";
import { View, Dimensions, Text, StyleSheet, Image, TouchableOpacity, ScrollView, } from "react-native";
import { Fonts, Colors, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MapViewDirections from 'react-native-maps-directions';
import { Key } from "../../constants/key";
import MapView, { Marker } from "react-native-maps";

const { width, height } = Dimensions.get('window');

const TrackOrderScreen = ({ navigation }) => {

    const [timer, setTimer] = useState(null);

    const [count, setCount] = useState(20);

    useEffect(() => {
        const timer = setInterval(() => {
            setCount(prevCount => prevCount - 5);
        }, 5000);
        setTimer(timer)
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (count <= 0) {
            clearInterval(timer)
        }
    }, [count]);

    const pickupMarker = {
        latitude: 37.78825,
        longitude: -122.4324,
    };

    const deliveryMarker = {
        latitude: 37.77825,
        longitude: -122.4424,
    };

    const [isRating, setIsRating] = useState(false);

    const [sheetOpen, setSheetOpen] = useState(false);

    const [rate1, setRate1] = useState(true);
    const [rate2, setRate2] = useState(false);
    const [rate3, setRate3] = useState(false);
    const [rate4, setRate4] = useState(false);
    const [rate5, setRate5] = useState(false);

    const [reviewType1, setReviewType1] = useState(false);
    const [reviewType2, setReviewType2] = useState(false);
    const [reviewType3, setReviewType3] = useState(false);

    const ratingContent = () => (
        <View style={styles.bottomSheetWrapStyle}>
            {backArrow()}
            <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                AWESOME!
            </Text>
            {ratingCountInfo()}
            {rating()}
            {divider()}
            {reviewType()}
            {completeButton()}
        </View>
    )

    const trackContent = () => (
        <View style={styles.bottomSheetWrapStyle}>
            {
                sheetOpen
                    ?
                    <View>
                        {foodComingInfoShort()}
                        <ScrollView contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 4.0, }} showsVerticalScrollIndicator={false}>
                            {orderInfo()}
                            {divider()}
                            {userInfo()}
                            {divider()}
                            {tripInfo()}
                            {divider()}
                            {count == 0
                                ?
                                reviewInfo()
                                :
                                null
                            }
                        </ScrollView>
                    </View>
                    :
                    foodComingInfoMore()
            }
        </View>
    );

    return (
        <View style={{ flex: 1, }}>
            {header()}
            {mapInfo()}
            {isRating ? ratingContent() : trackContent()}
        </View>
    )

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    Tracking on Map
                </Text>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={25}
                    style={{ position: 'absolute', left: 15.0, }}
                    onPress={() => navigation.pop()}
                />
            </View>
        )
    }

    function reviewInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding - 5.0, alignItems: 'center' }}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    HOW IS YOUR DELIVERY BOY?
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    {`Your feedback will help us improve\ndelivery experience better.`}
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => setIsRating(true)}
                    style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}
                >
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                    <MaterialIcons
                        name="star"
                        color='#C5C5C5'
                        size={30}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function foodComingInfoShort() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => { setSheetOpen(false) }}
            >
                <Text style={{ textAlign: 'center', ...Fonts.blackColor15Regular }}>
                    Your food is coming in 0:{count.toString().length == 1 ? `0${count}` : count}
                </Text>
                {divider()}
            </TouchableOpacity>
        )
    }

    function foodComingInfoMore() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => { setSheetOpen(true) }}
            >
                <Text style={{ marginTop: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                    Your food is coming in 0:{count.toString().length == 1 ? `0${count}` : count}
                </Text>
                <View
                    style={{ marginVertical: Sizes.fixPadding - 3.0, backgroundColor: Colors.grayColor, height: 0.50 }}
                />
                <Text style={{ marginBottom: Sizes.fixPadding - 5.0, textAlign: 'center', ...Fonts.blackColor17Medium }}>
                    (Tap to show more detail..)
                </Text>
            </TouchableOpacity>
        )
    }

    function trip({ isDone, job, jobTime }) {
        return (
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <View style={{
                        ...styles.trackingFlowDoneIconWrapStyle,
                        backgroundColor: isDone ? Colors.primaryColor : Colors.whiteColor,
                    }}>
                        {
                            isDone ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </View>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor15Medium }}>
                        {job}
                    </Text>
                </View>
                <Text style={isDone ? { ...Fonts.blackColor15Medium } : { ...Fonts.grayColor15Medium }}>
                    {jobTime}
                </Text>
            </View>
        )
    }

    function tripFlowIndicator({ isDone }) {
        return (
            <View style={{
                ...styles.tripFlowIndicatorStyle,
                backgroundColor: isDone ? Colors.primaryColor : Colors.grayColor,
            }} />
        )
    }

    function tripInfo() {
        return (
            <View>
                <Text style={{ marginBottom: Sizes.fixPadding - 3.0, ...Fonts.blackColor19Medium }}>
                    TRIP
                </Text>
                {trip({
                    isDone: count <= 20 ? true : false,
                    job: 'Confirm Your Order',
                    jobTime: '9:15'
                })}
                {tripFlowIndicator({ isDone: count <= 20 ? true : false })}
                {
                    count != 0 ?
                        <>
                            {trip({
                                isDone: count <= 15 ? true : false,
                                job: 'Delivery Boy go to Reastaurant',
                                jobTime: '9:15'
                            })}
                            {tripFlowIndicator({ isDone: count <= 15 ? true : false, })}
                            {trip({
                                isDone: count <= 10 ? true : false,
                                job: 'Waiting',
                                jobTime: '9:20'
                            })}
                            {tripFlowIndicator({ isDone: count <= 10 ? true : false })}
                            {trip({
                                isDone: count <= 5 ? true : false,
                                job: 'On the Way',
                                jobTime: '9:20'
                            })}
                            {tripFlowIndicator({ isDone: count <= 5 ? true : false })}
                            {trip({
                                isDone: count <= 0 ? true : false,
                                job: 'Delivered',
                                jobTime: '9:25'
                            })}
                        </>
                        :
                        <>
                            {trip({
                                isDone: count <= 0 ? true : false,
                                job: 'Delivered',
                                jobTime: '9:25'
                            })}
                        </>
                }
            </View>
        )
    }

    function userInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}>
                <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/user_profile/user_6.jpg')}
                        style={{ width: 60.0, height: 60.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={styles.userInfoWrapStyle}>
                        <Text numberOfLines={1} style={{ width: width / 2.0, ...Fonts.blackColor16Medium }}>
                            Devin Stokes
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons name="star" size={18} color={Colors.orangeRatingColor} />
                            <Text style={{ ...Fonts.blackColor16Medium }}>
                                4.5
                            </Text>
                        </View>
                    </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        ...styles.messageAndPhoneIconWrapStyle,
                        backgroundColor: '#2196F3',
                    }}>
                        <MaterialIcons name="message" size={24} color={Colors.whiteColor} />
                    </View>
                    <View style={{
                        ...styles.messageAndPhoneIconWrapStyle,
                        backgroundColor: '#4CAF50',
                        marginLeft: Sizes.fixPadding
                    }}>
                        <MaterialIcons name="phone" size={24} color={Colors.whiteColor} />
                    </View>
                </View>
            </View>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: Colors.grayColor,
                height: 0.50,
                marginVertical: Sizes.fixPadding
            }} />
        )
    }

    function orderInfo() {
        return (
            <View
                style={styles.orderWrapStyle}>
                <Image
                    source={require('../../assets/images/restaurant/restaurant_5.png')}
                    style={styles.restaurantImageStyle}
                />
                <View style={styles.orderInfoStyle}>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Kichi Coffee & Drink
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={styles.orderIdIndicatorStyle}>
                        </View>
                        <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                            43e4215
                        </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={{ ...Fonts.grayColor14Medium }}>
                            4 Items
                        </Text>
                        <Text style={{ ...Fonts.primaryColor15Regular }}>
                            On the Way
                        </Text>
                    </View>
                </View>
            </View>
        )
    }

    function ratingCountInfo() {
        return (
            <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                {`You rates Devin `}
                {
                    rate1 == true && rate2 == true && rate3 == true && rate4 == true && rate5 == true
                        ?
                        `5`
                        :
                        rate1 == true && rate2 == true && rate3 == true && rate4 == true
                            ?
                            `4`
                            :
                            rate1 == true && rate2 == true && rate3 == true ?
                                `3`
                                :
                                rate1 == true && rate2 == true
                                    ?
                                    '2'
                                    :
                                    `1`
                }
                {` Stars`}
            </Text>
        )
    }

    function backArrow() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => setIsRating(false)}
            >
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    style={{ marginTop: Sizes.fixPadding - 5.0 }}
                />
            </TouchableOpacity>
        )
    }

    function completeButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.pop()}
                style={styles.completeButtonStyle}
            >
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Complete
                </Text>
            </TouchableOpacity>
        )
    }

    function reviewType() {
        return (
            <>
                <View style={{ marginTop: Sizes.fixPadding, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType1(!reviewType1)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType1 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType1 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Enthusiastic
                    </Text>
                </View>
                <View style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType2(!reviewType2)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType2 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType2 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Fast
                    </Text>
                </View>
                <View style={{ marginTop: Sizes.fixPadding + 5.0, flexDirection: 'row', alignItems: 'center' }}>
                    <TouchableOpacity
                        activeOpacity={0.9}
                        onPress={() => setReviewType3(!reviewType3)}
                        style={{
                            ...styles.reviewTypeSclectorStyle,
                            backgroundColor: reviewType3 ? Colors.primaryColor : Colors.whiteColor,
                        }}>
                        {
                            reviewType3 ?
                                <MaterialIcons
                                    name="done"
                                    size={15}
                                    color={Colors.whiteColor}
                                /> :
                                null
                        }
                    </TouchableOpacity>
                    <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                        Friendly
                    </Text>
                </View>
            </>
        )
    }

    function rating() {
        return (
            <View style={styles.ratingWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate1) {
                            setRate2(false)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate1 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate2) {
                            setRate1(true)
                            setRate3(false)
                            setRate4(false)
                            setRate5(false)
                        }
                        else {
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate2 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate3) {
                            setRate4(false)
                            setRate5(false)
                            setRate2(true)
                        }
                        else {
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate3 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate4) {
                            setRate5(false)
                            setRate3(true)
                        }
                        else {
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate4 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                        if (rate5) {
                            setRate4(true)
                        }
                        else {
                            setRate5(true)
                            setRate4(true)
                            setRate3(true)
                            setRate2(true)
                            setRate1(true)
                        }
                    }}
                >
                    <MaterialIcons
                        name="star"
                        size={33}
                        color={rate5 ? Colors.orangeRatingColor : '#C5C5C5'}
                        style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function mapInfo() {
        return (
            <View style={{ flex: 1, backgroundColor: Colors.whiteColor, }}  >
                <MapView
                    style={{ flex: 1, }}
                    initialRegion={{
                        latitude: 37.78825,
                        longitude: -122.4324,
                        latitudeDelta: 0.03,
                        longitudeDelta: 0.03,
                    }}
                    mapType="terrain"
                >
                    <MapViewDirections
                        origin={pickupMarker}
                        destination={deliveryMarker}
                        apikey={Key.apiKey}
                        lineDashPattern={[1]}
                        lineCap="square"
                        strokeColor="#297AC6"
                        strokeWidth={2}
                    />
                    <Marker coordinate={pickupMarker}>
                        <Image
                            source={require('../../assets/images/driver-marker.png')}
                            style={{ width: 40.0, height: 20.0 }}
                            resizeMode="contain"
                        />
                    </Marker>
                    <Marker coordinate={deliveryMarker}>
                        <Image
                            source={require('../../assets/images/custom_marker.png')}
                            style={{ width: 30.0, height: 30.0 }}
                        />
                    </Marker>
                </MapView >
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        height: 56.0,
    },
    orderWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 90.0,
        borderRadius: Sizes.fixPadding - 5.0,
    },
    orderIdIndicatorStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 11.0,
        height: 11.0,
        borderRadius: 5.5,
    },
    completeButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 3.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding * 3.0,
    },
    reviewTypeSclectorStyle: {
        width: 23.0,
        height: 23.0,
        borderRadius: 11.5,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    ratingWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: Sizes.fixPadding,
    },
    bottomSheetWrapStyle: {
        backgroundColor: 'white',
        padding: Sizes.fixPadding + 5.0,
        borderTopColor: '#cccccc',
        borderTopWidth: 0.50,
        maxHeight: height - 150
    },
    trackingFlowDoneIconWrapStyle: {
        width: 18.0,
        height: 18.0,
        borderRadius: 9.0,
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tripFlowIndicatorStyle: {
        marginVertical: -2.0,
        marginLeft: Sizes.fixPadding - 1.0,
        height: 30.0,
        width: 0.50,
    },
    userInfoWrapStyle: {
        paddingVertical: Sizes.fixPadding - 5.0,
        height: 60.0,
        justifyContent: 'space-between',
        marginLeft: Sizes.fixPadding
    },
    messageAndPhoneIconWrapStyle: {
        width: 40.0,
        height: 40.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
    },
    orderInfoStyle: {
        marginHorizontal: Sizes.fixPadding,
        flex: 1,
        paddingVertical: Sizes.fixPadding + 2.0,
        justifyContent: 'space-between'
    },
})

export default TrackOrderScreen;