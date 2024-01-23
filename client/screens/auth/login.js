import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, View, StatusBar, BackHandler, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { useFocusEffect } from "@react-navigation/native";
import { TextInput} from "react-native";
import Toast from 'react-native-toast-message';
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";


WebBrowser.maybeCompleteAuthSession()

const login = ({ navigation }) => {
    const [state, setState] = useState({
      email: '',
      password: '',
      backClickCount: 0
    });
  
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
    const { email,password, backClickCount } = state;

  
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
  
    const call_login = () => {
      if (email === "" || password == "") {
        show_error_message("Fill the required field");
      } else{
        fetch("http://10.0.2.2:4000/login",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "email":email,
                "password" : password,
                
            })
        })
        .then(res=>res.json())
        .then(data => {
            
            // Check for errors in the response
            if (!data.success) {
                show_error_message(data.message)

            } else {
                // Successful signup, navigate to the desired screen
                navigation.push('BottomTabBar', { userId: data.userId });
                console.log("User Id" + data.userId)
            }
        })
        .catch(error => {
            show_error_message(error)
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
                    {emailAddressTextField()}
                    {passwordTextField()}
                    {continueButton()}
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



    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => call_login()}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Continue
                </Text>
            </TouchableOpacity>
        )
    }


    function emailAddressTextField() {
        return (
            <TextInput
                value={email}
                onChangeText={(text) => updateState({ email: text })}
                placeholder="Email Address"
                selectionColor={Colors.primaryColor}
                keyboardType="email-address"
                placeholderTextColor={Colors.grayColor}
                style={styles.textFieldStyle}
                
            />
        )
    }

    function passwordTextField() {
        return (
            <TextInput
                value={password}
                onChangeText={(text) => updateState({ password: text })}
                secureTextEntry={true}
                placeholder="Password"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.grayColor}
                style={styles.textFieldStyle}
            />
        )
    }

    function logionWithGoogleButton() {
        return (
          <TouchableOpacity activeOpacity={0.9} onPress={() => promptAsync()}>
            <View style={styles.loginWithGoogleButtonStyle}>
              <Image
                source={require('../../assets/images/google.png')}
                style={{ width: 30.0, height: 30.0, }}
              />
              <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                Log in with Google
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    };

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
                ...Fonts.grayColor17Medium,marginBottom:20,
            }}>
                Login to your account
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
    loginWithGoogleButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0
    },
    textFieldStyle: {
        ...Fonts.blackColor17Medium,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        elevation: 0.30,
        marginTop:5,
        marginVertical: Sizes.fixPadding
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
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop:30,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 5.0
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

export default login;



















