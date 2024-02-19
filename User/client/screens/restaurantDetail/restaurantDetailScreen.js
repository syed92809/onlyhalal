import React, { useState } from "react";
import { SafeAreaView, View, useWindowDimensions, StyleSheet, Text, } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBar";
import { Snackbar } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import Products from "../products/productsScreen";
import Review from "../review/reviewScreen";
import Information from "../information/informationScreen";

const RestaurantDetailScreen = ({ navigation }) => {

    const [state, setState] = useState({
        isFavourite: false,
        showSnackBar: false,
    })

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        isFavourite,
        showSnackBar,
    } = state;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <CollapsingToolbar
                leftItem={
                    <MaterialIcons
                        name="arrow-back"
                        size={25}
                        color={Colors.whiteColor}
                        style={{
                            marginTop: Sizes.fixPadding + 5.0,
                            marginLeft: Sizes.fixPadding * 2.0
                        }}
                        onPress={() => navigation.pop()}
                    />
                }
                rightItem={
                    <MaterialIcons
                        name={isFavourite ? "bookmark" : "bookmark-outline"}
                        size={25}
                        color={Colors.whiteColor}
                        style={{ marginTop: Sizes.fixPadding + 5.0, }}
                        onPress={() => updateState({
                            isFavourite: !isFavourite,
                            showSnackBar: true
                        })}
                    />
                }
                element={
                    <View>
                        <Text style={{ ...Fonts.whiteColor22Medium }}>
                            Bar 61 Restaurant
                        </Text>
                        <View style={{ marginTop: Sizes.fixPadding - 2.0, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="location-on"
                                size={20}
                                color={Colors.whiteColor}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 8.0, ...Fonts.whiteColor14Regular }}>
                                76A England
                            </Text>
                        </View>
                        <View style={{ marginTop: Sizes.fixPadding - 2.0, flexDirection: 'row', alignItems: 'center' }}>
                            <MaterialIcons
                                name="star"
                                size={20}
                                color={Colors.ratingColor}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding - 8.0, ...Fonts.whiteColor14Regular }}>
                                4.5
                            </Text>
                        </View>
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolbarMinHeight={50}
                toolbarMaxHeight={200}
                isImageBlur={true}
                src={require('../../assets/images/restaurant/restaurant_3.png')}
                childrenMinHeight={720}
            >
                <View style={{ flex: 1, backgroundColor: Colors.primaryColor, }}>
                    <TabBarView navigation={navigation} />
                </View>
            </CollapsingToolbar>
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => updateState({ showSnackBar: false })}
            >
                {!isFavourite ? 'Removed from Favourite' : 'Added to Favourite'}
            </Snackbar>
        </SafeAreaView>
    )
}

const TabBarView = ({ navigation }) => {

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Products' },
        { key: 'second', title: 'Review' },
        { key: 'third', title: 'Information' },
    ]);

    const layout = useWindowDimensions();

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <Products navigation={navigation} />;
            case 'second':
                return <Review />;
            case 'third':
                return <Information />;
        }
    };

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={setIndex}
            renderTabBar={props => (
                <TabBar
                    {...props}
                    indicatorStyle={{ height: 2.5, marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0, backgroundColor: Colors.darkPrimaryColor, }}
                    tabStyle={{ width: layout.width / 3.1, height: 52.0, }}
                    style={{ backgroundColor: Colors.primaryColor, elevation: 0.0 }}
                    renderLabel={({ route, focused, color }) => (
                        <Text style={{ marginLeft: index == 0 ? Sizes.fixPadding + 5.0 : 0.0, marginRight: index == 2 ? Sizes.fixPadding : 0.0, ...Fonts.whiteColor15Medium }}>
                            {route.title}
                        </Text>
                    )}
                />
            )}
        />
    )
}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
        paddingBottom: Sizes.fixPadding * 6.0,
    },
    snackBarStyle: {
        elevation: 0.0,
        backgroundColor: '#333333',
        position: 'absolute',
        left: -10.0,
        right: -10.0,
        bottom: -10.0,
    }
})

export default RestaurantDetailScreen;