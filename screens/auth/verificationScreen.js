import React, { useState } from "react";
import {
    Text,
    View,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Sizes, Fonts } from "../../constants/styles";
import Dialog from "react-native-dialog";
import { Bounce } from 'react-native-animated-spinkit';
import OTPTextView from 'react-native-otp-textinput';

const { width } = Dimensions.get('screen');

const VerificationScreen = ({ navigation }) => {

    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            {backArrow()}
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
            >
                {verificationInfo()}
                {otpFields()}
                {resendInfo()}
                {submitButton()}
            </ScrollView>
            {loading()}
        </SafeAreaView >
    )

    function backArrow() {
        return (
            <MaterialIcons
                name="arrow-back"
                size={24}
                color={Colors.blackColor}
                style={{ margin: Sizes.fixPadding * 2.0, }}
                onPress={() => navigation.pop()}
            />
        )
    }

    function loading() {
        return (
            <Dialog.Container
                visible={isLoading}
                contentStyle={styles.dialogContainerStyle}
                headerStyle={{ margin: 0.0 }}
            >
                <View style={{ marginTop: Sizes.fixPadding + 5.0, backgroundColor: 'white', alignItems: 'center', }}>
                    <Bounce size={50} color={Colors.primaryColor} />
                    <Text style={{
                        ...Fonts.grayColor16Medium,
                        marginTop: Sizes.fixPadding * 2.0
                    }}>
                        Please Wait..
                    </Text>
                </View>
            </Dialog.Container>
        );
    }

    function submitButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                    setisLoading(true)
                    setTimeout(() => {
                        setisLoading(false)
                        navigation.push('BottomTabBar')
                    }, 2000);
                }}
                style={styles.submitButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Submit
                </Text>
            </TouchableOpacity>
        )
    }

    function resendInfo() {
        return (
            <View style={styles.resendInfoWrapStyle}>
                <Text style={{ ...Fonts.grayColor15Medium }}>
                    Didn’t receive OTP Code!
                </Text>
                <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding - 5.0 }}>
                    Resend
                </Text>
            </View>
        )
    }

    function otpFields() {
        return (
            <OTPTextView
                containerStyle={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0, }}
                handleTextChange={(text) => {
                    setotpInput(text)
                    if (otpInput.length == 3) {
                        setisLoading(true)
                        setTimeout(() => {
                            setisLoading(false)
                            navigation.push('BottomTabBar')
                        }, 2000);
                    }
                }}
                inputCount={4}
                keyboardType="numeric"
                tintColor={Colors.primaryColor}
                offTintColor={Colors.whiteColor}
                textInputStyle={{ ...styles.textFieldStyle }}
            />
        )
    }

    function verificationInfo() {
        return (
            <View style={{
                marginTop: Sizes.fixPadding - 5.0,
                marginBottom: Sizes.fixPadding * 2.0,
                marginHorizontal: Sizes.fixPadding * 2.0,
            }}>
                <Text style={{ paddingBottom: Sizes.fixPadding, ...Fonts.blackColor22Medium }}>
                    Verification
                </Text>
                <Text style={{
                    ...Fonts.grayColor15Medium,
                    lineHeight: 22.0,
                }}>
                    Enter the OTP code from the phone we just sent you.
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    textFieldStyle: {
        borderBottomWidth: null,
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        ...Fonts.blackColor17Medium,
        elevation: 1.0,
    },
    submitButtonStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
        borderRadius: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding * 3.0,
    },
    dialogContainerStyle: {
        borderRadius: Sizes.fixPadding,
        width: width - 80,
        paddingBottom: Sizes.fixPadding * 3.0,
    },
    resendInfoWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: Sizes.fixPadding * 5.0,
        marginHorizontal: Sizes.fixPadding * 2.0,
    }
})

export default VerificationScreen;