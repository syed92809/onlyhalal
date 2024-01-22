import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, View, StatusBar, BackHandler, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput} from "react-native";
import Toast from 'react-native-toast-message';
import * as WebBrowser from "expo-web-browser";




WebBrowser.maybeCompleteAuthSession()

const forgotPassword = ({ navigation }) => {
    const [state, setState] = useState({
        email: '',
      backClickCount: 0
    });
  
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
    const { email, backClickCount } = state;


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
  
// forgot password function
const call_forgot_password = () => {
  if (email === "") {
    show_error_message("Fill the required field");
  } else {
    fetch("http://10.0.2.2:4000/forgotpassword", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "email": email
      })
    })
    .then(res => {
      if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      if (!data.success) {
        show_error_message(data.message);
      } else {
        show_success_message("Password sent to your email");
      }
    })
    .catch(error => {
      console.error(error); // Log the error for debugging
      show_error_message("Failed to connect to the server");
    });
  }
};

      

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {appLogo()}
                    {signinText()}
                    {mobileNumberTextField()}
                    {sendButton()}

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


    function sendButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => call_forgot_password()}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Send
                </Text>
            </TouchableOpacity>
        )
    }

    function mobileNumberTextField() {
        return (
            <View style={styles.phoneNumberWrapStyle}>
                
                <TextInput
                    style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}
                    placeholder="Enter your registered email"
                    keyboardType="email-address"
                    onChangeText={(email) => updateState({ email: email })}
                />
            </View>
        );
    }
    

    };


    function signinText() {
        return (
            <Text style={{
                textAlign: 'center',
                ...Fonts.grayColor17Medium,marginBottom:20
            }}>
                Forgot Password
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


const styles = StyleSheet.create({
   
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

export default forgotPassword;
