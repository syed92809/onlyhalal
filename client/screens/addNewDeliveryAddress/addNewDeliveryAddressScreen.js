import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, View, ActivityIndicator, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import Toast from 'react-native-toast-message';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from "@react-native-async-storage/async-storage";


const LATITUDE_DELTA = 0.10;
const LONGITUDE_DELTA = 0.10;

const AddNewDeliveryAddressScreen = ({ navigation }) => {
    const [currentMarker, setCurrentMarker] = useState({
      latitude: 0,
      longitude: 0,
    });

    // Address state
    const [get_address, setGetAddress] = useState('');
    const [addressInputTouched, setAddressInputTouched] = useState(false);
    const [isLoading, setisLoading] = useState(true);

    const show_error_message = (message) => {
    Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        autoHide: true,
        visibilityTime: 2000,
        bottomOffset: 50,
        position: "top"
    });
    };

    //address added message
    const show_success_message = (message) => {
        Toast.show({
            type: "success",
            text1: "Added",
            text2: message,
            autoHide: true,
            visibilityTime: 2000,
            bottomOffset: 50,
            position: "top"
        });
        };
    

        const [userId, setUserId] = useState(null);

        useEffect(() => {
          AsyncStorage.getItem('userId')
            .then((storedUserId) => {
              if (storedUserId) {
                setUserId(parseInt(storedUserId, 10));
              }
            })
            .catch((error) => {
              console.error('Error retrieving userId from AsyncStorage:', error);
            });
        }, []);
    
        const add_address = () => {
          if (get_address.trim() === "" && addressInputTouched) {
            show_error_message("Add some address please");
          } else {
            fetch("http://10.0.2.2:4000/addNewAddress", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                "userId": userId,
                "address": get_address.trim(),
              })
            })
              .then(res => res.json())
              .then(data => {
                if (!data.success) {
                  show_error_message(data.message)
                } else {
                  show_success_message("New Address Added");
                  navigation.push('BottomTabBar');
                }
              })
              .catch(error => {
                show_error_message(error)
              });
          }
        };
    
        useEffect(() => {
          let isMounted = true;
    
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
            };
    
            if (isMounted) {
                setCurrentMarker(userLocation);
                setisLoading(false);
            }
    
            // Watch for continuous location updates
            const locationSubscription = await Location.watchPositionAsync(
                { accuracy: Location.Accuracy.High, timeInterval: 5000, distanceInterval: 5 },
                (newLocation) => {
                    if (isMounted) {
                        setCurrentMarker({
                            latitude: newLocation.coords.latitude,
                            longitude: newLocation.coords.longitude,
                        });
                    }
                }
            );
    
            return () => {
                isMounted = false;
                locationSubscription.remove();
            };
          })();
    
        }, []);
    
        useEffect(() => {
          (async () => {
            getAddress();
          })();
        }, [currentMarker]);


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
        try {
            var streetNo = '';
            var street = '';
            var district = '';
            var postalCode = '';
            var city = '';
            var region = '';
            var country = '';
  
            let response = await Location.reverseGeocodeAsync(currentMarker);
  
            if (response && response.length > 0) {
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
                }
  
                let address = `${streetNo}${street}${district}${postalCode}${city}${region}${country}`;
                setGetAddress(address);
  
            } else {
                console.log('No reverse geocoding response');
            }
        } catch (error) {
            console.error('Error in reverse geocoding:', error);
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
                value={get_address}
                onChangeText={(value) => {
                setAddressInputTouched(true);
                setGetAddress(value);
            }}
              />
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => add_address()}
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
                    latitude: currentMarker.latitude,
                    longitude: currentMarker.longitude,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }}
            >
                <Marker
                    coordinate={currentMarker}
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