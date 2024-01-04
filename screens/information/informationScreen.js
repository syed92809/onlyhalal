import React from "react";
import { View, Text, StyleSheet, Image, Dimensions } from "react-native";
import { Colors, Sizes, Fonts } from "../../constants/styles";

const { width } = Dimensions.get('screen');

const Information = () => {
    return (
        <View style={styles.pageStyle}>
            {informationInfo()}
        </View>
    )

    function informationInfo() {
        return (
            <>
                <View style={{
                    marginHorizontal: Sizes.fixPadding,
                    marginTop: Sizes.fixPadding,
                    marginBottom: Sizes.fixPadding * 2.0
                }}>
                    <Text style={{ marginBottom: Sizes.fixPadding + 5.0, ...Fonts.blackColor19Medium }}>
                        Informations
                    </Text>
                    <Text style={{ ...Fonts.blackColor16Medium }}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
                    </Text>
                </View>
                <Image
                    source={require('../../assets/images/restaurant_location.jpg')}
                    style={{
                        height: 200.0,
                        width: width - 30.0,
                        alignSelf: 'center',
                        borderColor: Colors.whiteColor,
                        borderWidth: 2.0,
                        borderRadius: Sizes.fixPadding - 5.0,
                    }}
                />
            </>
        )
    }
}

const styles = StyleSheet.create({
    pageStyle: {
        borderTopLeftRadius: Sizes.fixPadding * 2.0,
        borderTopRightRadius: Sizes.fixPadding * 2.0,
        backgroundColor: Colors.bodyBackColor,
        flex: 1,
    },
})

export default Information;
