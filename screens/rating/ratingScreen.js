import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, Dimensions, TouchableOpacity, ScrollView, StyleSheet, Image, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TextInput, Snackbar } from 'react-native-paper';

const { width } = Dimensions.get('screen');

const RatingScreen = ({ navigation }) => {

    const [state, setState] = useState({
        rate1: true,
        rate2: false,
        rate3: false,
        rate4: false,
        rate5: false,
        review: '',
        isFavourite: false,
        showSnackBar: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        rate1,
        rate2,
        rate3,
        rate4,
        rate5,
        review,
        isFavourite,
        showSnackBar,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding * 8.0 }}
                >
                    {restaurantInfo()}
                </ScrollView>
                {completeButton()}
            </View>
            <Snackbar
                onDismiss={() => updateState({ showSnackBar: false })}
                visible={showSnackBar}
                elevation={0}
                style={styles.snackBarStyle}
            >
                {
                    isFavourite
                        ?
                        `Added to Favourite`
                        :
                        `Remove from Favourite`
                }
            </Snackbar>
        </SafeAreaView>
    )

    function restaurantInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ marginVertical: Sizes.fixPadding, ...Fonts.grayColor16Medium }}>
                    Restaurant
                </Text>
                <View style={{
                    backgroundColor: Colors.whiteColor,
                    borderRadius: Sizes.fixPadding - 5.0,
                    padding: Sizes.fixPadding,
                }}>
                    {restaurantDetail()}
                    {divider()}
                    {ratingInfo()}
                    {reviewTextField()}
                </View>
            </View>
        )
    }

    function completeButton() {
        return (
            <View style={styles.completeButtonWrapStyle}>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={styles.completeButtonStyle}
                >
                    <Text style={{ ...Fonts.whiteColor16Medium }}>
                        Complete
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function reviewTextField() {
        return (
            <TextInput
                placeholder="Enter Note Here"
                placeholderTextColor='gray'
                multiline={true}
                numberOfLines={4}
                mode="outlined"
                onChangeText={text => updateState({ review: text })}
                style={{
                    ...Fonts.blackColor16Medium,
                    backgroundColor: Colors.bodyBackColor,
                    marginTop: Sizes.fixPadding * 2.0,
                }}
                selectionColor={Colors.primaryColor}
                theme={{ colors: { primary: Colors.primaryColor, underlineColor: 'transparent', } }}
            />
        )
    }

    function ratingInfo() {
        return (
            <View>
                <Text style={{ textAlign: 'center', ...Fonts.blackColor19Medium }}>
                    {`What do you think about\nthis restaurant?`}
                </Text>
                <Text style={{ marginTop: Sizes.fixPadding, textAlign: 'center', ...Fonts.grayColor14Regular }}>
                    {`Your feedback will help us improve\nrestaurant experience better.`}
                </Text>
                {rating()}
            </View>
        )
    }

    function rating() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: Sizes.fixPadding * 2.0,
            }}>
                <MaterialIcons
                    name="star"
                    size={33}
                    color={rate1 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (rate1) {
                            updateState({
                                rate2: false,
                                rate3: false,
                                rate4: false,
                                rate5: false,
                            })
                        }
                        else {
                            updateState({ rate1: true })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={rate2 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (rate2) {
                            updateState({
                                rate1: true,
                                rate3: false,
                                rate4: false,
                                rate5: false,
                            })
                        }
                        else {
                            updateState({
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={rate3 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (rate3) {
                            updateState({
                                rate4: false,
                                rate5: false,
                                rate2: true,
                            })
                        }
                        else {
                            updateState({
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={rate4 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (rate4) {
                            updateState({
                                rate5: false,
                                rate3: true,
                            })
                        }
                        else {
                            updateState({
                                rate4: true,
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
                <MaterialIcons
                    name="star"
                    size={33}
                    color={rate5 ? Colors.orangeRatingColor : '#C5C5C5'}
                    style={{ marginHorizontal: Sizes.fixPadding - 5.0 }}
                    onPress={() => {
                        if (rate5) {
                            updateState({
                                rate4: true,
                            })
                        }
                        else {
                            updateState({
                                rate5: true,
                                rate4: true,
                                rate3: true,
                                rate2: true,
                                rate1: true,
                            })
                        }
                    }}
                />
            </View>
        )
    }

    function divider() {
        return (
            <View style={{ marginTop: Sizes.fixPadding + 10.0, marginBottom: Sizes.fixPadding + 5.0, backgroundColor: Colors.grayColor, height: 0.50 }} />
        )
    }

    function restaurantDetail() {
        return (
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Image
                        source={require('../../assets/images/restaurant/restaurant_5.png')}
                        style={{ width: 90.0, height: 90.0, borderRadius: Sizes.fixPadding - 5.0 }}
                    />
                    <View style={styles.restaurantInfoStyle}>
                        <Text numberOfLines={1} style={{
                            width: width / 2.0,

                            ...Fonts.blackColor16Medium
                        }}>
                            Kichi Coffee & Drink
                        </Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                color={Colors.grayColor}
                                size={18}
                            />
                            <Text numberOfLines={1} style={{ width: width / 2.1, marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
                                76A England
                            </Text>
                        </View>
                    </View>
                </View>
                <MaterialIcons
                    name={isFavourite ? "bookmark" : "bookmark-outline"}
                    color={Colors.grayColor}
                    size={22}
                    style={{ alignSelf: 'flex-start' }}
                    onPress={() => updateState({ isFavourite: !isFavourite, showSnackBar: true })}
                />
            </View>
        )
    }

    function header() {
        return (
            <View style={{
                backgroundColor: Colors.whiteColor,
                paddingHorizontal: Sizes.fixPadding * 2.0
            }}>
                <MaterialIcons
                    name="arrow-back"
                    color={Colors.blackColor}
                    size={24}
                    onPress={() => navigation.pop()}
                    style={{ marginVertical: Sizes.fixPadding + 5.0 }}
                />
                <Text style={{ ...Fonts.blackColor22Medium, marginBottom: Sizes.fixPadding + 2.0 }}>
                    Rating
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    restaurantInfoStyle: {
        paddingVertical: Sizes.fixPadding + 8.0,
        height: 90.0,
        marginLeft: Sizes.fixPadding,
        justifyContent: 'space-between'
    },
    completeButtonWrapStyle: {
        backgroundColor: Colors.whiteColor,
        padding: Sizes.fixPadding,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
    },
    completeButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    snackBarStyle: {
        backgroundColor: '#333333',
        position: 'absolute',
        bottom: 60.0,
        left: -10.0,
        right: -10.0,
    }
})

export default RatingScreen;