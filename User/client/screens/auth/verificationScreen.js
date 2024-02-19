import React, { useState, useEffect } from "react";
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('screen');

const VerificationScreen = ({ navigation }) => {

    const [otpInput, setotpInput] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const [code, setCode] = useState(null);
    const [error, setError] = useState(false);


    //getting User Id from async storage
    useEffect(() => {
        // Fetch userId from AsyncStorage
        AsyncStorage.getItem('verificationCode')
            .then((storedCode) => {
                if (storedCode) {
                    setCode(storedCode);
                }
            })
            .catch((error) => {
                console.error('Error retrieving Code from AsyncStorage:', error);
            });
    }, []);


    //success messages show function
    const show_success_message = (message) => {
        Toast.show({
          type: "success",
          text1: "Verified",
          text2: message,
          autoHide: true,
          visibilityTime: 2000,
          bottomOffset: 50,
          position: "bottom"
        });
      };
    


    //messages show function
    const show_error_message = (message) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        autoHide: true,
        visibilityTime: 2000,
        bottomOffset: 50,
        position: "bottom"
      });
    };


    const handleSubmit = () => {
        if (otpInput === code) {
            setisLoading(true);
            setTimeout(() => {
                setisLoading(false);
                show_success_message("Code Verified")
                navigation.push('Register');
            }, 2000);
        } else {
            show_error_message("Invalid Code Provided.")
            setError(true);
        }
    };


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
                    handleSubmit()
                    setTimeout(() => {
                        setisLoading(false)
                        // navigation.push('Register')
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
        const [error, setError] = useState(false);
    
        const handleTextChange = (text) => {
            setotpInput(text);
            setError(false);
        };

    
        return (
            <View>
                <OTPTextView
                    containerStyle={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding * 2.0 }}
                    handleTextChange={handleTextChange}
                    inputCount={4}
                    keyboardType="numeric"
                    tintColor={Colors.primaryColor}
                    offTintColor={Colors.whiteColor}
                    textInputStyle={{ ...styles.textFieldStyle }}
                />
                {error && (
                    <Text style={{ color: 'red', marginLeft: Sizes.fixPadding * 2.0 }}>
                        Incorrect OTP. Please try again.
                    </Text>
                )}

            </View>
        );
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
                    Enter the OTP code sent to your email.
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