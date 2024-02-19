import React, { useState, useCallback } from "react";
import { Text, View, TouchableOpacity, StyleSheet, BackHandler } from "react-native";
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Fonts, Sizes } from "../constants/styles";
import DiscoverScreen from "../screens/discover/discoverScreen";
import NearByScreen from "../screens/nearBy/nearByScreen";
import OrderScreen from "../screens/order/orderScreen";
import FavouritesScreen from "../screens/favourites/favouritesScreen";
import ProfileScreen from "../screens/profile/profileScreen";
import { useFocusEffect } from "@react-navigation/native";

const BottomTabBarScreen = ({ navigation }) => {

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
        currentIndex: 1,
        backClickCount: 0
    });

    const updateState = (data) => setState((state) => ({ ...state, ...data }));

    const { currentIndex, backClickCount } = state;

    return (
        <View style={{ flex: 1 }}>
            {currentIndex == 1 ?
                <DiscoverScreen navigation={navigation} /> :
                currentIndex == 2 ?
                    <NearByScreen navigation={navigation} /> :
                    currentIndex == 3 ?
                        <OrderScreen navigation={navigation} /> :
                        currentIndex == 4 ?
                            <FavouritesScreen navigation={navigation} /> :
                            <ProfileScreen navigation={navigation} />
            }
            <View style={styles.bottomTabBarStyle}>
                {bottomTabBarItem({
                    index: 1,
                    iconName: 'explore',
                    tag: 'Discover'
                })}
                {bottomTabBarItem({
                    index: 2,
                    iconName: 'location-on',
                    tag: 'Near By',
                })}
                {bottomTabBarItem({
                    index: 3,
                    iconName: 'shopping-basket',
                    tag: 'Order'
                })}
                {bottomTabBarItem({
                    index: 4,
                    iconName: 'bookmark',
                    tag: 'Favourite'
                })}
                {bottomTabBarItem({
                    index: 5,
                    iconName: 'person',
                    tag: 'Profile',
                })}
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
        </View>
    )

    function bottomTabBarItem({ index, iconName, tag }) {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ currentIndex: index })}
            >
                {
                    currentIndex == index ?
                        <View style={styles.selectedTabStyle}>
                            <MaterialIcons name={iconName} size={25} color={Colors.primaryColor} />
                            <Text style={{ ...Fonts.grayColor14Medium, marginLeft: Sizes.fixPadding + 5.0, }}>
                                {tag}
                            </Text>
                        </View> :
                        <MaterialIcons name={iconName} size={25} color={Colors.grayColor} />
                }
            </TouchableOpacity>
        )
    }
}

export default BottomTabBarScreen;

const styles = StyleSheet.create({
    bottomTabBarStyle: {
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        height: 65.0,
        backgroundColor: 'white',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        borderTopLeftRadius: Sizes.fixPadding + 5.0,
        borderTopRightRadius: Sizes.fixPadding + 5.0,
        elevation: 1.0,
        borderTopColor: 'gray',
        borderTopWidth: 0.20,
    },
    animatedView: {
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 2.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
    },
    selectedTabStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FCE0E5',
        paddingHorizontal: Sizes.fixPadding + 5.0,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding * 4.0,
    }
})



