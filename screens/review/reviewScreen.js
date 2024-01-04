import React from "react";
import { StyleSheet, View, Text, ScrollView, Image } from "react-native";
import { Colors, Sizes, Fonts } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';

const reviewsList = [
    {
        id: '1',
        image: require('../../assets/images/user_profile/user_1.jpg'),
        name: 'Robert Junior',
        rating: 5.0,
        review: 'Very good.',
        time: '10:33 PM',
    },
    {
        id: '2',
        image: require('../../assets/images/user_profile/user_2.jpg'),
        name: 'Mark Lynn',
        rating: 4.0,
        review: 'Awesome Quality.',
        time: '9:12 PM',
    },
    {
        id: '3',
        image: require('../../assets/images/user_profile/user_3.jpg'),
        name: 'Ellison Perry',
        rating: 3.0,
        review: 'Super.',
        time: '7:35 PM',
    },
    {
        id: '4',
        image: require('../../assets/images/user_profile/user_4.jpg'),
        name: 'Emma Waston',
        rating: 5.0,
        review: 'Good.',
        time: '6:58 PM',
    },
    {
        id: '5',
        image: require('../../assets/images/user_profile/user_5.jpg'),
        name: 'Shira Maxwell',
        rating: 2.0,
        review: 'Mind Blowing.',
        time: '4:35 PM',
    },
    {
        id: '6',
        image: require('../../assets/images/user_profile/user_6.jpg'),
        name: 'David Smith',
        rating: 4.0,
        review: 'Fabulous..',
        time: '2:51 PM',
    },
    {
        id: '7',
        image: require('../../assets/images/user_profile/user_7.jpg'),
        name: 'Bill Hussey',
        rating: 5.0,
        review: 'Very good.',
        time: '10:33 PM',
    }
];

const Review = () => {
    return (
        <View style={styles.pageStyle}>
            <ScrollView
                nestedScrollEnabled={true}
                showsVerticalScrollIndicator={false}
            >
                {ratingInfo()}
                {divider()}
                {reviews()}
            </ScrollView>
        </View>
    )

    function reviews() {
        return (
            <>
                {reviewsList.map((item) => (
                    <View key={`${item.id}`}>
                        <View style={styles.reviewWrapStyle}>
                            <View style={{ flexDirection: 'row', }}>
                                <Image
                                    source={item.image}
                                    style={{ width: 75.0, height: 75.0, borderRadius: Sizes.fixPadding }}
                                />
                                <View style={{ flex: 1, marginLeft: Sizes.fixPadding, }}>
                                    <Text numberOfLines={1} style={{ marginBottom: Sizes.fixPadding - 5.0, ...Fonts.blackColor17Medium }}>
                                        {item.name}
                                    </Text>
                                    <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <View style={{ width: 100.0, }}>
                                            {rating({ number: item.rating })}
                                        </View>
                                        <Text style={{ ...Fonts.grayColor14Regular }}>
                                            Yesterday {item.time}
                                        </Text>
                                    </View>
                                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                                        {item.review}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                ))}
            </>
        )
    }

    function divider() {
        return (
            <View style={{
                backgroundColor: '#E0E0E0',
                height: 1.5,
                marginHorizontal: Sizes.fixPadding,
                marginBottom: Sizes.fixPadding * 3.0,
            }} />
        )
    }

    function ratingInfo() {
        return (
            <View style={styles.ratingInfoWrapStyle}>
                <Text style={{ ...Fonts.blackColor19Medium }}>
                    Rate
                </Text>
                <View style={{ marginRight: Sizes.fixPadding, flex: 1, justifyContent: 'center' }}>
                    <View style={{ paddingRight: Sizes.fixPadding, marginBottom: Sizes.fixPadding - 3.0, flexDirection: 'row', justifyContent: 'space-evenly' }}>
                        <Text style={{ left: 5.0, ...Fonts.grayColor16Medium }}>
                            99+
                        </Text>
                        <Text style={{ ...Fonts.grayColor16Medium }}>
                            56
                        </Text>
                        <Text style={{ ...Fonts.grayColor16Medium }}>
                            45
                        </Text>
                        <Text style={{ ...Fonts.grayColor16Medium }}>
                            12
                        </Text>
                        <Text style={{ left: 5.0, ...Fonts.grayColor16Medium }}>
                            5
                        </Text>
                    </View>
                    <View style={{ paddingLeft: Sizes.fixPadding, }}>
                        {rating({ number: 1.0 })}
                        {rating({ number: 2.0 })}
                        {rating({ number: 3.0 })}
                        {rating({ number: 4.0 })}
                        {rating({ number: 5.0 })}
                    </View>
                </View>
            </View>
        )
    }

    function rating({ number }) {
        return (
            <View style={{ marginBottom: Sizes.fixPadding - 5.0, flexDirection: 'row', justifyContent: 'space-evenly', }}>
                {
                    (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0 || number == 1.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={19}
                            color={Colors.orangeRatingColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={19}
                            color='#E0E0E0'
                        />
                }
                {
                    (number == 5.0 || number == 4.0 || number == 3.0 || number == 2.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={19}
                            color={Colors.orangeRatingColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={19}
                            color='#E0E0E0'
                        />
                }
                {
                    (number == 5.0 || number == 4.0 || number == 3.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={19}
                            color={Colors.orangeRatingColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={19}
                            color='#E0E0E0'
                        />
                }
                {
                    (number == 5.0 || number == 4.0)
                        ?
                        <MaterialIcons
                            name="star"
                            size={19}
                            color={Colors.orangeRatingColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={19}
                            color='#E0E0E0'
                        />
                }
                {
                    (number == 5.0) ?
                        <MaterialIcons
                            name="star"
                            size={19}
                            color={Colors.orangeRatingColor}
                        />
                        :
                        <MaterialIcons
                            name="star"
                            size={19}
                            color='#E0E0E0'
                        />
                }
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
    },
    reviewWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding * 3.0,
    },
    ratingInfoWrapStyle: {
        flexDirection: 'row',
        marginTop: Sizes.fixPadding + 5.0,
        marginBottom: Sizes.fixPadding,
        marginLeft: Sizes.fixPadding * 4.0,
    }
});

export default Review;