import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, ScrollView, Text, TouchableOpacity, TextInput, StyleSheet, Image } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const RegisterScreen = ({ navigation }) => {

    const [state, setState] = useState({
        fullName: '',
        password: '',
        email: '',
        
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        fullName,
        password,
        email,
        
    } = state;


const showMessage=()=>{
    Toast.show({
        type:"success",
        text1: "Toast message",
        text2: "Message",
        autoHide:true,
        visibilityTime:3000,
        bottomOffset:50,
    })
}

// Perform signup operation here
const call_signup = () => {
    

    if (fullName == "" || email == "" || password == "") {
        console.log("Fill the required fields to continue")
    }else{
        fetch("http://10.0.2.2:4000/signup",{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "username":fullName,
                "password" : password,
                "email": email
                
            })
        })
        .then(res=>res.json())
        .then(data => {
            console.log(data);
            // Check for errors in the response
            if (!data.success) {
                console.log('Error:', data.message);
                

            } else {
                // Successful signup, navigate to the desired screen
                // navigation.push('BottomTabBar');
            }
        })
        .catch(error => {
            console.error('Error:', error);
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
                    {fullNameTextField()}
                    {passwordTextField()}
                    {emailAddressTextField()}
                    {continueButton()}
                </ScrollView>
            </View>
        </SafeAreaView>
    )



    function continueButton() {
        return (
            
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => call_signup()}
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

    function fullNameTextField() {
        return (
            <TextInput
                value={fullName}
                onChangeText={(text) => updateState({ fullName: text })}
                placeholder="Full Name"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.grayColor}
                style={styles.textFieldStyle}
            />
        )
    }

    e
    function registerText() {
        return (
                <Text style={{ marginBottom: Sizes.fixPadding + 8.0, textAlign: 'center', ...Fonts.grayColor17Medium }}>
                    Register your account
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

export default RegisterScreen;