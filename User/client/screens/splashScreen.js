import React, { useCallback } from "react";
import { Image, SafeAreaView, StatusBar, View, BackHandler } from "react-native";
import { Bounce } from 'react-native-animated-spinkit';
import { Colors } from "../constants/styles";
import { useFocusEffect } from "@react-navigation/native";

const SplashScreen = ({ navigation }) => {

    const backAction = () => {
        BackHandler.exitApp();
        return true;
    }

    useFocusEffect(
        useCallback(() => {
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }, [backAction])
    );

    setTimeout(() => {
        navigation.push('Onboarding');
    }, 2000);

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, justifyContent: 'center' }}>
                <Image
                    source={require('../assets/images/login-icon.png')}
                    style={{ width: 200.0, height: 150.0, alignSelf: 'center' }}
                    resizeMode="contain"
                />
                <Bounce size={40} color={Colors.primaryColor}
                    style={{ alignSelf: 'center', }}
                />
            </View>
        </SafeAreaView>
    )
}

export default SplashScreen;