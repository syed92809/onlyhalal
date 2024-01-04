import React, { useState } from "react";
import { SafeAreaView, View, StatusBar, Dimensions, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { TabView, TabBar } from 'react-native-tab-view';
import FavouriteFoods from "../favouriteFoods/favouriteFoodsScreen";
import FavouriteRestaurants from "../favouriteRestaurants/favouriteRestaurantsScreen";

const { width } = Dimensions.get('screen');

const FavouriteScreen = ({ navigation }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Foods' },
        { key: 'second', title: 'Restaurants' },
    ]);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <FavouriteFoods navigation={navigation} />;
            case 'second':
                return <FavouriteRestaurants navigation={navigation} />;
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <TabView
                    navigationState={{ index, routes }}
                    renderScene={renderScene}
                    onIndexChange={setIndex}
                    swipeEnabled={false}
                    renderTabBar={props => (
                        <TabBar
                            {...props}
                            indicatorStyle={{ height: 2.5, backgroundColor: Colors.primaryColor, }}
                            tabStyle={{
                                width: width / 2,
                                height: 52.0,
                            }}
                            style={{ backgroundColor: Colors.whiteColor }}
                            renderLabel={({ route, focused, color }) => (
                                <Text style={
                                    focused ?
                                        { ...Fonts.primaryColor16Medium }
                                        :
                                        { ...Fonts.lightGrayColor16Medium }
                                }>
                                    {route.title}
                                </Text>
                            )}
                        />
                    )
                    }
                />
            </View>
        </SafeAreaView>
    )

    function header() {
        return (
            <View style={{ backgroundColor: Colors.whiteColor, paddingHorizontal: Sizes.fixPadding + 5.0, paddingVertical: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Favourite
                </Text>
            </View>
        )
    }
}

export default FavouriteScreen;