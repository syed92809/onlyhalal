import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  FlatList,
  Dimensions,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import { useRoute, useNavigation  } from "@react-navigation/native";

const { width } = Dimensions.get("screen");

const AllRestaurants = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View>{header(navigation)}</View>
      <View>{Restaurants()}</View>
    </SafeAreaView>
  );

  function header(navigation) { 
    return (
      
      <View style={styles.headerWrapStyle}>
        <TouchableOpacity onPress={() => navigation.push('BottomTabBar')} style={{ marginRight: 20 }}>
          <MaterialIcons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={{ ...Fonts.blackColor22Medium }}> Restaurants</Text>
      </View>
    );
  }
};


const Restaurants = () => {
  const route = useRoute();
  const restaurants = route.params?.restaurants;
  const [allRestaurants, setAllRestaurants] = useState(restaurants);

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
            {/* <Text
              style={{
                marginLeft: Sizes.fixPadding - 8.0,
                ...Fonts.grayColor14Medium,
              }}
            >
              {item.rating.toFixed(1)}
            </Text> */}
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
     
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <FlatList
        data={allRestaurants}
        keyExtractor={(item) => `${item.id}`}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Sizes.fixPadding,
          paddingBottom: Sizes.fixPadding * 7.0,
        }}
      />
    </>
  );

  function handleRestaurantsUpdate({ id }) {
    const newList = allRestaurants.map((restaurant) => {
      if (restaurant.id === id) {
        const updatedItem = {
          ...restaurant,
          isFavourite: !restaurant.isFavourite,
        };
        return updatedItem;
      }
      return restaurant;
    });
    setRestaurants(newList);
  }
};

const styles = StyleSheet.create({
  headerWrapStyle: {
    flexDirection: "row", 
    alignItems: "center",
    paddingLeft: Sizes.fixPadding + 5.0,
    paddingRight: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
  },
  restaurantWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: Colors.whiteColor,
    marginHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
    marginBottom: Sizes.fixPadding,
  },
  restaurantImageStyle: {
    width: 90.0,
    height: 100.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
  },
});

export default AllRestaurants;
