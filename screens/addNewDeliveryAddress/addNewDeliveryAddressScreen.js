import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
const LATITUDE_DELTA = 0.10;
const LONGITUDE_DELTA = 0.10;
const SPACE = 0.01;

const AddNewDeliveryAddressScreen = ({ navigation }) => {

    const [currentmarker, setCurrentMarker] = useState({
        latitude: LATITUDE - SPACE,
        longitude: LONGITUDE - SPACE,
    });
    const [address, setAddress] = useState('');
    const [isLoading, setisLoading] = useState(true);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Permission to access location was denied');
                return;
            }
            const location = await Location.getCurrentPositionAsync();
            const userLocation = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            }
            setCurrentMarker(userLocation);
            setisLoading(false)
        })();
    }, []);

    useEffect(() => {
        (async () => {
            getAddress()
        })();
    }, [currentmarker])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                {
                    isLoading
                        ?
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                            <ActivityIndicator size={50} color={Colors.primaryColor} />
                        </View>
                        :
                        <>
                            {map()}
                            {addressInfo()}
                        </>
                }
            </View>
        </SafeAreaView>
    )

    async function getAddress() {
        var streetNo = '';
        var street = '';
        var district = '';
        var postalCode = '';
        var city = '';
        var region = '';
        var country = '';
        let response = await Location.reverseGeocodeAsync(currentmarker);
        for (let item of response) {
            if (item.streetNumber != null) {
                streetNo = `${item.streetNumber} `;
            }
            if (item.street != null) {
                street = `${item.street}, `;
            }
            if (item.district != null) {
                district = `${item.district}, `;
            }
            if (item.postalCode != null) {
                postalCode = `${item.postalCode}, `;
            }
            if (item.city != null) {
                city = `${item.city}, `;
            }
            if (item.region != null) {
                region = `${item.region}, `;
            }
            if (item.country != null) {
                country = `${item.country}`;
            }

            let address = `${streetNo}${street}${district}${postalCode}${city}${region}${country}`;
            setAddress(address)
        }
    }

    function addressInfo() {
        return (
            <View style={styles.addressInfoWrapStyle}>
                <View style={styles.sheetIndicatorStyle} />
                <Text style={{
                    marginVertical: Sizes.fixPadding * 2.0,
                    marginHorizontal: Sizes.fixPadding,
                    ...Fonts.blackColor19Medium
                }}>
                    Type your Address
                </Text>
                <View style={styles.addressTextFieldWrapStyle}>
                    <MaterialIcons name="location-on" size={24} color={Colors.primaryColor} />
                    <TextInput
                        placeholder="Type your address here"
                        style={{ ...Fonts.blackColor15Medium, flex: 1, marginLeft: Sizes.fixPadding }}
                        selectionColor={Colors.primaryColor}
                        placeholderTextColor={Colors.primaryColor}
                        value={address}
                        onChangeText={(value) => setAddress(value)}
                    />
                </View>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => navigation.pop()}
                    style={styles.addNewAddressButtonStyle}>
                    <Text style={{ ...Fonts.whiteColor16Medium }}>
                        Add new Address
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function map() {
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                region={{
                    latitude: currentmarker.latitude,
                    longitude: currentmarker.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
            >
                <Marker
                    coordinate={currentmarker}
                    onDragEnd={(e) => {
                        setCurrentMarker(e.nativeEvent.coordinate)
                    }}
                    draggable
                >
                    <Image
                        source={require('../../assets/images/custom_marker.png')}
                        style={{ width: 30.0, height: 30.0 }}
                    />
                </Marker>
            </MapView>
        )
    }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor}
                    onPress={() => navigation.pop()}
                    style={{ position: 'absolute', left: 20.0 }}
                />
                <Text style={{ ...Fonts.blackColor19Medium, marginLeft: Sizes.fixPadding + 5.0, }}>
                    Add New Delivery Address
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    headerWrapStyle: {
        backgroundColor: Colors.bodyBackColor,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding + 5.0,
    },
    addNewAddressButtonStyle: {
        backgroundColor: Colors.primaryColor,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Sizes.fixPadding + 5.0,
        margin: Sizes.fixPadding * 2.0,
    },
    addressTextFieldWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        borderRadius: Sizes.fixPadding - 5.0,
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        marginHorizontal: Sizes.fixPadding * 2.0,
    },
    sheetIndicatorStyle: {
        backgroundColor: '#9E9E9E',
        borderRadius: Sizes.fixPadding,
        width: 40.0,
        height: 4.0,
        alignSelf: 'center'
    },
    addressInfoWrapStyle: {
        backgroundColor: Colors.whiteColor,
        position: 'absolute',
        bottom: 0.0,
        left: 0.0,
        right: 0.0,
        paddingTop: Sizes.fixPadding,
        borderTopColor: '#EEEEEE',
        borderTopWidth: 1.0,
    }
})

export default AddNewDeliveryAddressScreen;