import React, { useState } from "react";
import { SafeAreaView, View, TouchableOpacity, StyleSheet, Text, Image, TextInput } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBar";
import { MaterialIcons } from '@expo/vector-icons';

const historyList = [
    {
        id: '1',
        history: 'Mix Tea',
    },
    {
        id: '2',
        history: 'Roe Chicken',
    },
    {
        id: '3',
        history: 'Coffee',
    }
];

const suggestionsList = [
    {
        id: '1',
        image: require('../../assets/images/products/products_8.png'),
        category: 'Delicious Pizza'
    },
    {
        id: '2',
        image: require('../../assets/images/products/products_5.png'),
        category: 'Asia Food'
    },
    {
        id: '3',
        image: require('../../assets/images/products/products_1.png'),
        category: 'Chinese Food'
    },
    {
        id: '4',
        image: require('../../assets/images/products/lemon_juice.png'),
        category: 'Juice'
    }
];

const SearchScreen = ({ navigation }) => {

    const [search, setSearch] = useState('');

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <CollapsingToolbar
                element={
                    <View style={styles.searchFieldAndExitTextWrapStyle}>
                        <View style={styles.searchFieldWrapStyle}>
                            <MaterialIcons name="search" size={25} color={Colors.whiteColor} />
                            <TextInput
                                style={{ flex: 1, marginLeft: Sizes.fixPadding, ...Fonts.lightPrimaryColor16Regular }}
                                placeholder="Search"
                                selectionColor={Colors.primaryColor}
                                placeholderTextColor='#EAB4BE'
                                onChangeText={(text) => setSearch(text)}
                                value={search}
                            />
                        </View>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.pop()}
                            style={{ flex: 0.22, marginLeft: Sizes.fixPadding, }}
                        >
                            <Text style={{ ...Fonts.whiteColor17Regular }}>
                                Exit
                            </Text>
                        </TouchableOpacity>
                    </View>
                }
                toolbarColor={Colors.primaryColor}
                toolbarMinHeight={0}
                toolbarMaxHeight={95}
                isImage={false}
                childrenMinHeight={750}
            >
                <View style={{ flex: 1, backgroundColor: Colors.primaryColor, }}>
                    <View style={styles.pageStyle}>
                        {historyInfo()}
                        {suggetionsInfo()}
                    </View>
                </View>
            </CollapsingToolbar>
        </SafeAreaView>
    )

    function suggetionsInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ marginBottom: Sizes.fixPadding + 10.0, ...Fonts.blackColor19Medium }}>
                    Suggestions
                </Text>
                {suggestionsList.map((item) => (
                    <View key={`${item.id}`}>
                        <TouchableOpacity
                            activeOpacity={0.9}
                            onPress={() => navigation.push('RestaurantsList')}
                            style={{
                                flexDirection: 'row', alignItems: 'center',
                                marginBottom: Sizes.fixPadding * 2.0,
                            }}>
                            <Image
                                source={item.image}
                                style={{ width: 65.0, height: 65.0, borderRadius: Sizes.fixPadding }}
                            />
                            <Text style={{ marginLeft: Sizes.fixPadding * 2.0, ...Fonts.blackColor19Medium }}>
                                {item.category}
                            </Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        )
    }

    function historyInfo() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding, marginTop: Sizes.fixPadding * 2.0, marginBottom: Sizes.fixPadding + 5.0 }}>
                <View style={{ marginBottom: Sizes.fixPadding * 2.0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ ...Fonts.blackColor19Medium }}>
                        History
                    </Text>
                    <Text style={{ ...Fonts.primaryColor16Medium }}>
                        Clear all
                    </Text>
                </View>
                {historyList.map((item) => (
                    <View key={`${item.id}`}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ ...Fonts.grayColor16Medium }}>
                                {item.history}
                            </Text>
                            <MaterialIcons name="close" size={19} color={Colors.grayColor} />
                        </View>
                        <View style={{ backgroundColor: Colors.grayColor, height: 0.50, marginVertical: Sizes.fixPadding, }} />
                    </View>
                ))}
                <Text style={{ ...Fonts.primaryColor16Medium }}>
                    View More
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
        paddingBottom: Sizes.fixPadding * 6.0,
    },
    searchFieldWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.darkPrimaryColor,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        paddingHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding,
        flex: 1,
    },
    searchFieldAndExitTextWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Sizes.fixPadding * 2.0,
    }
})

export default SearchScreen;