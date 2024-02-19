import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, ScrollView, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import AsyncStorage from "@react-native-async-storage/async-storage";


const ResetPassword = ({ navigation }) => {

    const [state, setState] = useState({
        password: '',
        confirm_password: '',
        
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        password,
        confirm_password,
        
    } = state;

    const [useremail, setUseremail] = useState(null);

    //getting logged in user email
    useEffect(() => {
        AsyncStorage.getItem('resetEmail')
            .then((storedUseremail) => {
                if (storedUseremail) {
                    setUseremail(storedUseremail);
                }
            })
            .catch((error) => {
                console.error('Error retrieving Username from AsyncStorage:', error);
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


const show_error_message=(message)=>{
    Toast.show({
        type:"error",
        text1: "Error",
        text2: message,
        autoHide:true,
        visibilityTime:2000,
        bottomOffset:50,
        position:"bottom"
    })
}


// Perform signup operation here
const reset_password = () => {
    if (password === '' || confirm_password === '') {
        show_error_message('Fill the required fields');
    } else {
        fetch('http://10.0.2.2:4000/resetPassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: password,
                email: useremail, 
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                // Check for errors in the response
                if (!data.success) {
                    show_error_message(data.message);
                } else {
                    // Successful password reset, navigating to login screen
                    show_success_message('Password Reset Successfully');
                    navigation.push('login');
                }
            })
            .catch((error) => {
                show_error_message(error);
            });
    }
};


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {backArrow()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}
                >
                    {appLogo()}
                    {registerText()}
                    {passwordTextField()}
                    {confirmPasswordTextField()}
                    {continueButton()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )



    function continueButton() {
        return (
            
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => reset_password()}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Reset
                </Text>
            </TouchableOpacity>
        )
    }


    function passwordTextField() {
        return (
            <TextInput
                value={password}
                onChangeText={(text) => updateState({ password: text })}
                secureTextEntry={true}
                placeholder="New Password"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.grayColor}
                style={styles.textFieldStyle}
            />
        )
    }

    function confirmPasswordTextField() {
        return (
            <TextInput
                value={confirm_password}
                onChangeText={(text) => updateState({ confirm_password: text })}
                secureTextEntry={true}
                placeholder="Confirm New Password"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.grayColor}
                style={styles.textFieldStyle}
            />
        )
        }

    
    function registerText() {
        return (
                <Text style={{ marginBottom: Sizes.fixPadding + 8.0, textAlign: 'center', ...Fonts.grayColor17Medium }}>
                    Reset Your Password
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

    function backArrow() {
        return (
            <MaterialIcons name="arrow-back" size={24} color="black"
                style={{ padding: Sizes.fixPadding * 2.0, }}
                onPress={() => navigation.pop()}
            />
        )
    }
}

const styles = StyleSheet.create({
    appLogoStyle: {
        width: 200.0,
        height: 150.0,
        alignSelf: 'center',
        marginTop: Sizes.fixPadding * -1.5,
    },
    textFieldStyle: {
        ...Fonts.blackColor17Medium,
        backgroundColor: Colors.whiteColor,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding + 5.0,
        elevation: 0.30,
        marginVertical: Sizes.fixPadding
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 5.0,
        marginTop: Sizes.fixPadding
    },

})

export default ResetPassword;