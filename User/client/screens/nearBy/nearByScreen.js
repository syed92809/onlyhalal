import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, FlatList, Dimensions, TouchableOpacity, Image, StyleSheet, Text } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { TabView, TabBar } from 'react-native-tab-view';
import { Snackbar } from 'react-native-paper';
import { BottomSheet } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { width } = Dimensions.get('screen');


const NearByScreen = ({ navigation }) => {

    const [state, setState] = useState({
        showAddressSheet: false,
        currentAddress: "",
        
    })
    const [nearRestaurants, setNearRestaurants] = useState([]);
    const [userAddresses, setUserAddresses] = useState([]);
    const [userId, setUserId] = useState(null);
    const updateState = (data) => setState((state) => ({ ...state, ...data }));


    //function to get coordinates 
    const geocodeAddress = async (address) => {
        const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyChnKd6Gm7XSEBFXPqmfk9pv_dUKSB2kFM`);
        const data = await response.json();
        if (data.results && data.results.length > 0) {
            const location = data.results[0].geometry.location;
            return { latitude: location.lat, longitude: location.lng };
        } else {
            throw new Error("Failed to geocode address");
        }
    };


    //function to calculate distance between restaurant and user location
    const calculateDistance = (userLocation, restaurantLocation) => {
        const earthRadiusKm = 6371; 
        const lat1 = userLocation.latitude;
        const lon1 = userLocation.longitude;
        const lat2 = restaurantLocation.latitude;
        const lon2 = restaurantLocation.longitude;

        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
    
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = earthRadiusKm * c;
        
        return distance;
    };
    
    const toRadians = (angle) => {
        return angle * (Math.PI / 180);
    };
    
    // Function to filter nearby restaurants
    const filterNearbyRestaurants = async (restaurants, userLocation, maxDistance) => {
      const checks = await Promise.all(restaurants.map(async (restaurant) => {
        try {
          const restaurantLocation = await geocodeAddress(restaurant.location);
          const distance = calculateDistance(userLocation, restaurantLocation);
          if (distance <= maxDistance) {
            return { ...restaurant, distance: distance.toFixed(2) }; 
          } else {
            return null;
          }
        } catch (error) {
          console.error("Geocoding failed for a restaurant", error);
          return null; 
        }
      }));
    
      return checks.filter(result => result !== null);
    };


    //getting User Id and its address from async storage
    useEffect(() => {
        // Fetch userId from AsyncStorage
        AsyncStorage.getItem("userId")
        .then((storedUserId) => {
            if (storedUserId) {
            setUserId(storedUserId);
            }
            if (userId) {
                fetch(`http://10.0.2.2:4000/getUserAddresses?userId=${userId}`)
                  .then((res) => res.json())
                  .then(async (data) => {
                    if (data.success && data.addresses.length > 0) {
                      setUserAddresses(data.addresses);
                      // Update currentAddress with the latest address
                      const latestAddress =
                        data.addresses[data.addresses.length - 1].address;
                      updateState({ currentAddress: latestAddress });
                    } else {
                      console.error("Error in response:", data.message);
                    }
                  })
                  .catch((error) => {
                    console.error("Network error:", error);
                  });
              }
        })
        .catch((error) => {
            console.error("Error retrieving userId from AsyncStorage:", error);
        });
    }, [userId]);


    //Hook to fetch restaurants
    const fetchRestaurants = async () => {
        try {
            const response = await fetch("http://10.0.2.2:4000/restaurants");
            if (!response.ok) {
                throw new Error("Failed to fetch restaurants");
            }
            const data = await response.json();
            const userLocation = await geocodeAddress(state.currentAddress); 
            const filteredRestaurants = await filterNearbyRestaurants(data, userLocation, 8); 
            setNearRestaurants(filteredRestaurants);
        } catch (error) {
            console.error("Fetching restaurants failed:", error);
        }
    };
    
    useEffect(() => {
        if (state.currentAddress) {
            fetchRestaurants();
        }
    }, [state.currentAddress]);
    
    

    const {
        showAddressSheet,
        currentAddress,
    } = state;


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1 }}>
                {header()}
                <TabBarView navigation={navigation} nearRestaurants={nearRestaurants} />
                {selectAddressSheet()}
            </View>
        </SafeAreaView>
    )


    function selectAddressSheet() {
        return (
          <BottomSheet
            isVisible={showAddressSheet}
            containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
            onBackdropPress={() => {
              updateState({ showAddressSheet: false });
            }}
          >
            <View
              style={{
                backgroundColor: "white",
                paddingTop: Sizes.fixPadding + 5.0,
              }}
            >
              <Text style={{ textAlign: "center", ...Fonts.blackColor19Medium }}>
                SELECT ADDRESS
              </Text>
              <View
                style={{
                  backgroundColor: Colors.grayColor,
                  height: 0.3,
                  marginHorizontal: Sizes.fixPadding,
                  marginVertical: Sizes.fixPadding + 5.0,
                }}
              />
              {addresses()}
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  updateState({ showAddressSheet: false });
                  navigation.push("AddNewDeliveryAddress", { userId: userId });
                }}
                style={{
                  marginTop: Sizes.fixPadding - 5.0,
                  marginHorizontal: Sizes.fixPadding + 3.0,
                  marginBottom: Sizes.fixPadding + 5.0,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <MaterialIcons name="add" color="#2196F3" size={22} />
                <Text
                  style={{
                    marginLeft: Sizes.fixPadding,
                    ...Fonts.blueColor15Medium,
                  }}
                >
                  Add New Address
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheet>
        );
      }

      function addresses() {
        const validAddresses = userAddresses.filter(
          (item) => item.address.trim() !== ""
        );
    
        return (
          <>
            {validAddresses.map((item) => (
              <View key={`${item.id}`}>
                <View style={styles.addressWrapStyle}>
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => {
                      updateState({
                        currentAddress: item.address,
                        showAddressSheet: false,
                      });
                    }}
                    style={{
                      ...styles.radioButtonStyle,
                      backgroundColor:
                        currentAddress === item.address
                          ? Colors.primaryColor
                          : Colors.whiteColor,
                    }}
                  >
                    {currentAddress === item.address ? (
                      <MaterialIcons
                        name="done"
                        size={18}
                        color={Colors.whiteColor}
                      />
                    ) : null}
                  </TouchableOpacity>
                  <Text
                    style={{
                      marginLeft: Sizes.fixPadding,
                      ...Fonts.blackColor16Medium,
                    }}
                  >
                    {item.address}
                  </Text>
                </View>
              </View>
            ))}
          </>
        );
      }

    function header() {
        return (
            <View style={styles.headerWrapStyle}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Nearby
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ showAddressSheet: true })}
                    style={styles.headerAddressWrapStyle}
                >
                    <MaterialIcons
                        name="location-on"
                        color={Colors.grayColor}
                        size={18}
                    />
                    <Text numberOfLines={1} style={{ width: width / 2.8, ...Fonts.grayColor16Medium }}>
                        {currentAddress}
                    </Text>
                    <MaterialIcons
                        name="arrow-drop-down"
                        color={Colors.grayColor}
                        size={18}
                    />
                </TouchableOpacity>
            </View>
        )
    }
}

const TabBarView = ({ navigation, nearRestaurants }) => {
    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'first', title: 'Restaurant' },
        { key: 'second', title: 'Drinks' },
        { key: 'third', title: 'Food' },
        { key: 'forth', title: 'Asian' },
        { key: 'fifth', title: 'Chinese' },
        { key: 'sixth', title: 'Italian' },
        { key: 'seventh', title: 'Mexican' },
    ]);

    const renderScene = ({ route, jumpTo }) => {
        switch (route.key) {
            case 'first':
                return <Food navigation={navigation} nearRestaurants={nearRestaurants} />;
                default:
                  return <Category navigation={navigation} category={route.title} nearRestaurants={nearRestaurants} />;
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
                    indicatorStyle={{ height: 2.5, backgroundColor: Colors.primaryColor, }}
                    tabStyle={{
                        width: "auto",
                        height: 52.0,
                    }}
                    scrollEnabled={true}
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
    )
}


//function to handle different categories
const Category = ({ navigation, category, nearRestaurants }) => {
  const [categoryItems, setCategoryItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
      setIsLoading(true);
      fetch(`http://10.0.2.2:4000/nearby_items?category=${category}`)
          .then((response) => response.json())
          .then((data) => {
              const filteredItems = data.filter(item =>
                  nearRestaurants.some(restaurant => restaurant.id === item.restaurant_id)
              );
              setCategoryItems(filteredItems);
              setIsLoading(false);
          })
          .catch((error) => {
              console.error("Error fetching category items:", error);
              setIsLoading(false);
          });
  }, [category, nearRestaurants]);



    const renderItem = ({ item }) => (
       
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("RestaurantDetail", { item })}
          style={styles.restaurantWrapStyle}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: `http://10.0.2.2:4000/uploads/${item.image}` }}
              style={styles.restaurantImageStyle}
            />
            <View
              style={{
                width: width / 2.0,
                marginLeft: Sizes.fixPadding,
                height: 100.0,
                justifyContent: "space-evenly",
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                {item.food_name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                
                <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                {item.restaurant_name}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="star" size={20} color={Colors.ratingColor} />
                
              </View>
            </View>
          </View>
          <View
            style={{
              marginRight: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding,
              height: 100.0,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <MaterialIcons
              name={item.isFavourite ? "bookmark" : "bookmark-outline"}
              size={22}
              color={Colors.grayColor}
              onPress={() => {
                handleRestaurantsUpdate({ id: item.id });
                setIsFavourite(item.isFavourite);
                setShowSnackBar(true);
              }}
            />
            <Text style={{ ...Fonts.grayColor14Medium }}>
                ${item.price} 
            </Text>
          </View>
        </TouchableOpacity>
      );

    return (
        <>
            {isLoading ? (
                <Text>Loading...</Text>
            ) : (
                <FlatList
                    data={categoryItems}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={renderItem}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{
                        paddingTop: Sizes.fixPadding,
                        paddingBottom: Sizes.fixPadding * 7.0
                    }}
                />
            )}
        </>
    );
};



const Food = ({ navigation, nearRestaurants }) => {
    const [showSnackBar, setShowSnackBar] = useState(false);
    const [isFavourite, setIsFavourite] = useState(false);

    const renderItem = ({ item }) => (
        
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.push("RestaurantDetail", { item })}
          style={styles.restaurantWrapStyle}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Image
              source={{ uri: `http://10.0.2.2:4000/uploads/${item.cover}` }}
              style={styles.restaurantImageStyle}
            />
            <View
              style={{
                width: width / 2.0,
                marginLeft: Sizes.fixPadding,
                height: 100.0,
                justifyContent: "space-evenly",
              }}
            >
              <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                {item.restaurant_name}
              </Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color={Colors.grayColor}
                />
                <Text numberOfLines={1} style={{ ...Fonts.grayColor14Medium }}>
                  {item.location}
                </Text>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <MaterialIcons name="star" size={20} color={Colors.ratingColor} />

              </View>
            </View>
          </View>
          <View
            style={{
              marginRight: Sizes.fixPadding,
              paddingVertical: Sizes.fixPadding,
              height: 100.0,
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <MaterialIcons
              name={item.isFavourite ? "bookmark" : "bookmark-outline"}
              size={22}
              color={Colors.grayColor}
              onPress={() => {
                handleRestaurantsUpdate({ id: item.id });
                setIsFavourite(item.isFavourite);
                setShowSnackBar(true);
              }}
            />
            <Text style={{ ...Fonts.grayColor14Medium }}>
            {item.distance} km
            </Text>
          </View>
        </TouchableOpacity>
      );

    return (
        <>
            <FlatList
                data={nearRestaurants}
                keyExtractor={(item) => `${item.id}`}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: Sizes.fixPadding,
                    paddingBottom: Sizes.fixPadding * 7.0
                }}
            />
            <Snackbar
                style={styles.snackBarStyle}
                visible={showSnackBar}
                onDismiss={() => setShowSnackBar(false)}
            >
                {isFavourite ? 'Removed from Favourite' : 'Added to Favourite'}
            </Snackbar>
        </>
    )



    function handleRestaurantsUpdate({ id }) {
        const newList = restaurants.map((restaurant) => {
            if (restaurant.id === id) {
                const updatedItem = { ...restaurant, isFavourite: !restaurant.isFavourite };
                return updatedItem;
            }
            return restaurant;
        });
        setRestaurants(newList);
    }

}

const styles = StyleSheet.create({
    headerWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingLeft: Sizes.fixPadding + 5.0,
        paddingRight: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
    },
    headerAddressWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        backgroundColor: '#ECECEC',
        paddingVertical: Sizes.fixPadding,
        paddingLeft: Sizes.fixPadding,
        paddingRight: Sizes.fixPadding * 3.0,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 56.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    restaurantWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding,
        borderRadius: Sizes.fixPadding - 5.0,
        marginBottom: Sizes.fixPadding
    },
    restaurantImageStyle: {
        width: 90.0,
        height: 100.0,
        borderTopLeftRadius: Sizes.fixPadding - 5.0,
        borderBottomLeftRadius: Sizes.fixPadding - 5.0,
    },
    radioButtonStyle: {
        width: 27.0,
        height: 27.0,
        borderRadius: 13.5,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: Colors.grayColor,
        borderWidth: 1.0,
    },
    addressWrapStyle: {
        paddingBottom: Sizes.fixPadding,
        paddingHorizontal: Sizes.fixPadding,
        flexDirection: 'row',
        alignItems: 'center'
    },
})

export default NearByScreen;