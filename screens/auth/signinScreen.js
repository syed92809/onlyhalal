import React, { useState, useCallback } from "react";
import { SafeAreaView, View, StatusBar, BackHandler, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { useFocusEffect } from "@react-navigation/native";
import { TextInput} from "react-native";

const SigninScreen = ({ navigation }) => {

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
        phoneNumber: '',
        backClickCount: 0
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { phoneNumber, backClickCount } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {appLogo()}
                    {signinText()}
                    {mobileNumberTextField()}
                    {continueButton()}
                    {otpInfo()}
                    {loginWithFacebookButton()}
                    {logionWithGoogleButton()}
                </ScrollView>
            </View>
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView]}>
                        <Text style={{ ...Fonts.whiteColor16Regular }}>
                            Press Back Once Again to Exit.
                        </Text>
                    </View>
                    :
                    null
            }
        </SafeAreaView>
    )

    function otpInfo() {
        return (
            <Text style={{
                ...Fonts.grayColor15Medium,
                textAlign: 'center',
                marginBottom: Sizes.fixPadding * 5.0,
            }}>
                We’ll send otp for verification
            </Text>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('Verification')}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Continue
                </Text>
            </TouchableOpacity>
        )
    }

    function mobileNumberTextField() {
        return (
            <View style={styles.phoneNumberWrapStyle}>
                
                <Image
                    source={require('../../assets/images/slider/slider_1.png')}
                    style={{ width: 30.0, height: 20.0, marginRight: 5,marginLeft:5, alignContent:"center" }}
                />
                <Text style={{ ...Fonts.blackColor16Medium }}>+1</Text>
                <TextInput
                    style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    onChangeText={(phoneNumber) => updateState({ phoneNumber: phoneNumber })}
                />
            </View>
        );
    }
    

    function logionWithGoogleButton() {
        return (
            <View style={styles.loginWithGoogleButtonStyle}>
                <Image
                    source={require('../../assets/images/google.png')}
                    style={{ width: 30.0, height: 30.0, }}
                />
                <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Log in with Google
                </Text>
            </View >
        )
    }

    function loginWithFacebookButton() {
        return (
            <View style={styles.loginWithFacebookButtonStyle}>
                <Image
                    source={require('../../assets/images/facebook.png')}
                    style={{ width: 30.0, height: 30.0, }}
                />
                <Text style={{ ...Fonts.whiteColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Log in with Facebook
                </Text>
            </View>
        )
    }

    function signinText() {
        return (
            <Text style={{
                textAlign: 'center',
                ...Fonts.grayColor17Medium
            }}>
                Signin with Phone Number
            </Text>
        )
    }

    function appLogo() {
        return (
            <Image
                source={require('../../assets/images/login-icon.png')}
                style={styles.appLogoStyle}
                resizeMode="contain"
            />
        )
    }
}

const styles = StyleSheet.create({
    loginWithGoogleButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0
    },
    loginWithFacebookButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B5998',
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginBottom: Sizes.fixPadding * 2.5,
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 5.0
    },
    phoneNumberWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        flexDirection:"row",
        height:50,
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 4.0,
    },
    appLogoStyle: {
        width: 200.0,
        height: 150.0,
        alignSelf: 'center',
        marginTop: Sizes.fixPadding * 4.0,
    },
    animatedView: {
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 3.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
    },
})

export default SigninScreen;