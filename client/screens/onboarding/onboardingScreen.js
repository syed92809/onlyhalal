import { useFocusEffect } from '@react-navigation/native';
import React, { useState, useCallback } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity, Image,
    Dimensions,
    BackHandler,
    SafeAreaView,
    StatusBar,
} from 'react-native';
import Onboarding from 'react-native-onboarding-swiper';
import { Colors, Fonts, Sizes } from "../../constants/styles";

const { width, } = Dimensions.get('screen');

const OnBoardingScreen = ({ navigation }) => {

    const backAction = () => {
        backClickCount == 1 ? BackHandler.exitApp() : _spring();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    function _spring() {
        updateState({ backClickCount: 1 });
        setTimeout(() => {
            updateState({ backClickCount: 0 })
        }, 1000)
    }

    const [state, setState] = useState({
        pageIndex: 0,
        backClickCount: 0
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { pageIndex, backClickCount } = state;

    const Square = ({ isLight, selected }) => {
        let backgroundColor;
        let width;
        let height;
        let borderRadius;
        if (isLight) {
            backgroundColor = selected ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 0, 0, 0.2)';
            width = selected ? 12 : 7;
            height = selected ? 12 : 7;
            borderRadius = selected ? 6 : 3.5;
        } else {
            backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
        }
        return (
            <View
                style={{
                    width,
                    height,
                    borderRadius,
                    marginHorizontal: 2,
                    backgroundColor: pageIndex == 2 ? 'transparent' : backgroundColor,
                }}
            />
        );
    };

    const Done = () => (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => { navigation.push('Signin') }}
            style={{ position: 'absolute', left: -80.0, top: -10.0 }}>
            <Text style={{
                ...Fonts.whiteColor16Medium
            }}>
                GET STARTED NOW
            </Text>
        </TouchableOpacity>
    );

    const getPageIndex = (pageIndex) => {
        updateState({ pageIndex, });
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <Onboarding
                pages={[
                    {
                        backgroundColor: Colors.whiteColor,
                        image: <Image
                            source={require('../../assets/images/onboarding/1.jpg')}
                            resizeMode="contain"
                            style={{
                                width: '100%',
                                height: 250.0,
                            }}
                        />,
                        title:
                            <View style={styles.titleContainerStyle}>
                                <Text style={{
                                    textAlign: 'center',
                                    ...Fonts.blackColor22Medium,
                                }}>
                                    {`Search for favorite\nfood near you`}
                                </Text>
                            </View>,
                        subtitle:
                            <View style={styles.subTitleContainerStyle}>
                                <Text style={{ ...Fonts.grayColor15Medium, textAlign: 'center', marginHorizontal: Sizes.fixPadding * 4.0 }}>
                                    {`Discover the foods from over\n3250 restaurants.`}
                                </Text>
                            </View>
                    },
                    {
                        backgroundColor: Colors.whiteColor,
                        image: <Image
                            source={require('../../assets/images/onboarding/2.jpg')}
                            resizeMode="contain"
                            style={{ width: '100%', height: 250.0 }} />,

                        title: <View style={styles.titleContainerStyle}>
                            <Text style={{
                                textAlign: 'center',
                                ...Fonts.blackColor22Medium,
                            }}>
                                {`Fast delivery to\nyour place`}
                            </Text>
                        </View>,
                        subtitle: <View style={styles.subTitleContainerStyle}>
                            <Text style={{ ...Fonts.grayColor15Medium, textAlign: 'center', marginHorizontal: Sizes.fixPadding * 4.0 }}>
                                {`Fast delivery to your home,\noffice and where you are.`}
                            </Text>
                        </View>
                    },
                    {
                        backgroundColor: Colors.primaryColor,
                        image: <Image
                            source={require('../../assets/images/onboarding/3.jpg')}
                            resizeMode="contain"
                            style={{ width: '100%', height: 250.0 }}
                        />,
                        title: <View style={styles.titleContainerStyle}>
                            <Text style={{
                                textAlign: 'center',
                                ...Fonts.blackColor22Medium,
                            }}>
                                {`Safe delivery to\nyour home`}
                            </Text>
                        </View>,
                        subtitle: <View style={styles.subTitleContainerStyle}>
                            <Text style={{ ...Fonts.grayColor15Medium, textAlign: 'center', marginHorizontal: Sizes.fixPadding * 4.0 }}>
                                {`Zero contact ordering,\ndelivery and takeaway.`}
                            </Text>
                        </View>
                    },
                ]
                }
                DotComponent={Square}
                DoneButtonComponent={Done}
                containerStyles={{ backgroundColor: Colors.whiteColor }}
                skipToPage={2}
                skipLabel={
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        SKIP
                    </Text >}
                nextLabel={
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        NEXT
                    </Text >
                }
                bottomBarColor={pageIndex == 2 ? Colors.primaryColor : '#FAFAFA'}
                pageIndexCallback={getPageIndex}
            />
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView,]}>
                        <Text style={{ ...Fonts.whiteColor16Regular }}>
                            Press Back Once Again to Exit.
                        </Text>
                    </View>
                    :
                    null
            }
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleContainerStyle: {
        width: '100%',
        alignItems: 'center',
        top: width / 2.8,
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding * 2.0,
        position: 'absolute',
    },
    subTitleContainerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        bottom: width / 1.7,
        position: 'absolute',
        flex: 1,
    },
    animatedView: {
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 0,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 3.0,
        justifyContent: "center",
        alignItems: "center",
    },
});

export default OnBoardingScreen;