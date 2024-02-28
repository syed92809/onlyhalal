import React, { useState, useEffect, memo } from "react";
import {
  SafeAreaView,
  View,
  Dimensions,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Text,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import CollapsingToolbar from "../../components/sliverAppBar";
import { MaterialIcons } from "@expo/vector-icons";
import { Snackbar } from "react-native-paper";
import { BottomSheet } from "@rneui/themed";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import Toast from 'react-native-toast-message';

const offerBannersList = [
  {
    id: "1",
    image: require("../../assets/images/slider/slider_1.png"),
  },
  {
    id: "2",
    image: require("../../assets/images/slider/slider_2.png"),
  },
  {
    id: "3",
    image: require("../../assets/images/slider/slider_3.png"),
  },
  {
    id: "4",
    image: require("../../assets/images/slider/slider_4.png"),
  },
  {
    id: "5",
    image: require("../../assets/images/slider/slider_5.png"),
  },
  {
    id: "6",
    image: require("../../assets/images/slider/slider_6.png"),
  },
];

const categoriesList = [
  {
    id: "1",
    image: require("../../assets/images/category/all.png"),
    type: "All",
  },
  {
    id: "2",
    image: require("../../assets/images/category/coffee.png"),
    type: "Coffee",
  },
  {
    id: "3",
    image: require("../../assets/images/category/drink.png"),
    type: "Drink",
  },
  {
    id: "4",
    image: require("../../assets/images/category/fastfood.png"),
    type: "FastFood",
  },
  {
    id: "5",
    image: require("../../assets/images/category/pizza.png"),
    type: "Pizza",
  },
  {
    id: "6",
    image: require("../../assets/images/category/snacks.png"),
    type: "Snacks",
  },
];

const productsOrderedList = [
  {
    id: "1",
    image: require("../../assets/images/products/products_6.png"),
    foodName: "Fried Noodles",
    foodCategory: "Chinese",
    amount: 5.0,
    isFavourite: false,
  },
  {
    id: "2",
    image: require("../../assets/images/products/products_1.png"),
    foodName: "Hakka Nuddles",
    foodCategory: "Chinese",
    isFavourite: false,
  },
  {
    id: "3",
    image: require("../../assets/images/products/products_2.png"),
    foodName: "Dry Manchuriyan",
    foodCategory: "Chinese",
    isFavourite: false,
  },
  {
    id: "4",
    image: require("../../assets/images/products/products_3.png"),
    foodName: "Margherita Pizza",
    foodCategory: "Delicious Pizza",
    isFavourite: false,
  },
  {
    id: "5",
    image: require("../../assets/images/products/products_4.png"),
    foodName: "Thin Crust Pizza",
    foodCategory: "Delicious Pizza",
    isFavourite: false,
  },
  {
    id: "6",
    image: require("../../assets/images/products/products_5.png"),
    foodName: "Veg Burger",
    foodCategory: "Fast Food",
    isFavourite: false,
  },
];

const optionsList = [

];

const { width } = Dimensions.get("screen");


const DiscoverScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [userAddresses, setUserAddresses] = useState([]);

  const [state, setState] = useState({
    productsOrdereds: productsOrderedList,
    favouriteRestaurents: restaurants,
    hotSales: menuItem,
    showSnackBar: false,
    isFavourite: false,
    showBottomSheet: false,
    showAddressSheet: false,
    currentAddress: "",
    sizeIndex: null,
    qty: 1,
    options: optionsList,
    showCustomizeBottomSheet: false,
  });

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    productsOrdereds,
    favouriteRestaurents,
    hotSales,
    showSnackBar,
    isFavourite,
    showBottomSheet,
    showAddressSheet,
    currentAddress,
    sizeIndex,
    qty,
    options,
    showCustomizeBottomSheet,
  } = state;

  //getting User Id from async storage
  useEffect(() => {
    // Fetch userId from AsyncStorage
    AsyncStorage.getItem("userId")
      .then((storedUserId) => {
        if (storedUserId) {
          setUserId(storedUserId);
        }
      })
      .catch((error) => {
        console.error("Error retrieving userId from AsyncStorage:", error);
      });
  }, []);

  const [restaurants, setRestaurant] = useState();
  const [menuItem, setMenuItem] = useState([]);
  const [itemId, setItemId] = useState();
  const [item, setItem] = useState({});
  const [order, setOrder] = useState([]);

  useEffect(() => {
    const fetchResturants = () => {
      fetch("http://10.0.2.2:4000/restaurants")
        .then((res) => res.json())
        .then((json) => {
            setRestaurant(json)
        
        });
    };
    const fetchMenuItems = async () => {
      try {
        const response = await fetch("http://10.0.2.2:4000/hotsales");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        
        if (json && Array.isArray(json)) {
          setMenuItem(json);
        } else {
          // Handle the case where json is not an array
          setMenuItem([]);
        }
      } catch (error) {
        console.error("Failed to fetch menu items:", error);
        setMenuItem([]);
      }
    };

    fetchResturants();
    fetchMenuItems();
  }, []);

  //getting user addresses
  useEffect(() => {
    // Fetch user addresses as soon as the userId is set
    if (userId) {
      fetch(`http://10.0.2.2:4000/getUserAddresses?userId=${userId}`)
        .then((res) => res.json())
        .then((data) => {
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
  }, [userId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <CollapsingToolbar
        leftItem={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => updateState({ showAddressSheet: true })}
            style={{
              marginLeft: Sizes.fixPadding * 2.0,
              marginTop: Sizes.fixPadding,
            }}
          >
            <Text style={{ ...Fonts.darkPrimaryColor15Medium }}>
              DELIVERING TO
            </Text>
            <View
              style={{
                marginTop: Sizes.fixPadding - 8.0,
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name="location-on"
                size={17}
                color={Colors.whiteColor}
              />
              <Text
                numberOfLines={1}
                style={{ maxWidth: width / 1.7, ...Fonts.whiteColor14Medium }}
              >
                {currentAddress}
              </Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={20}
                color={Colors.whiteColor}
              />
            </View>
          </TouchableOpacity>
        }
        rightItem={
          <MaterialIcons
            name="shopping-bag"
            size={25}
            color={Colors.whiteColor}
            style={{ marginTop: Sizes.fixPadding + 5.0 }}
            onPress={() => navigation.push("Cart")}
          />
        }
        element={
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => navigation.push("Search")}
            style={styles.searchInfoWrapStyle}
          >
            <MaterialIcons name="search" size={22} color={Colors.whiteColor} />
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.lightPrimaryColor16Regular,
              }}
            >
              Do you want to find something?
            </Text>
          </TouchableOpacity>
        }
        toolbarColor={Colors.primaryColor}
        toolbarMinHeight={60}
        toolbarMaxHeight={170}
        isImage={false}
      >
        <View style={{ flex: 1, backgroundColor: Colors.primaryColor }}>
          <View style={styles.pageStyle}>
            {offerBanners()}
            {categoriesInfo()}
            {productsOrderedInfo()}
            {favouriteRestaurantsInfo()}
            {hotSalesInfo()}
          </View>
        </View>
      </CollapsingToolbar>
      <Snackbar
        style={styles.snackBarStyle}
        visible={showSnackBar}
        onDismiss={() => updateState({ showSnackBar: false })}
      >
        {isFavourite ? "Removed from Favourite" : "Added to Favourite"}
      </Snackbar>
      {selectAddressSheet()}
    </SafeAreaView>
  );

  function hotSalesInfo() {
    return (
      <>
        {hotSaleInfo()}
        {custmizeBottomSheet()}
      </>
    );
  }

  function custmizeBottomSheet() {
    const selectedItem = menuItem.find((mItem) => mItem.id === itemId);
    if (!selectedItem) {
      return null; 
    }
    return (
      <BottomSheet
        isVisible={showCustomizeBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        onBackdropPress={() => 
          updateState({ showCustomizeBottomSheet: false })}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          style={{
            backgroundColor: Colors.whiteColor,
            borderTopRightRadius: Sizes.fixPadding * 2.0,
            borderTopLeftRadius: Sizes.fixPadding * 2.0,
          }}
        >
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => updateState({ showCustomizeBottomSheet: false })}
          >
            <View style={styles.bottomSheetOpenCloseDividerStyle} />
            {addNewItemTitle()}
            <CustmizeItemInfo itemId={itemId} />
          </TouchableOpacity>
          {sizeTitle()}
          {sizesInfo(selectedItem.sizes)}
          {optionsTitle()}
          {optionsInfo(selectedItem.options)}
          {totalInfo(item)}
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {CheckOut(order)}
            {selectedItem && item && addToCartAndItemsInfo(item, selectedItem)}
          </View>
        </TouchableOpacity>
      </BottomSheet>
    );
  }

  function CheckOut(order) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          updateState({ showCustomizeBottomSheet: false });
          navigation.push("ConfirmOrder", { order });
        }}
        style={styles.addToCartAndItemsInfoWrapStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium, textAlign: "center" }}>
          Order Now
        </Text>
      </TouchableOpacity>
    );
  }


  //Add items to cart function
  function addToCartAndItemsInfo(item, selectedItem) {
    const handleAddToCart = () => {
      if (!selectedItem) {
        console.error("Selected item is not defined");
        return;
      }
  
      // Collecting item details
      const itemDetails = {
        item_id: item.id,
        user_id: userId,
        image: item.image,
        name: item.food_name,
        price: item.price,
        quantity: state.qty, 
        total: (item.price * state.qty).toFixed(2),
        size: state.sizeIndex !== null ? selectedItem.sizes[state.sizeIndex] : null, 
        options: state.options.filter(option => option?.isSelected).map(option => option.name),
      };
      console.log("Selected Item:", selectedItem);
      console.log("Size Index:", state.sizeIndex);
      console.log('Sending to cart:', itemDetails);
  
      fetch('http://10.0.2.2:4000/addToCart', { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(itemDetails),
      })
      .then(response => response.json())
      .then(data => {
        console.log('Add to cart response:', data);
        if (data.success) {
          updateState({ showCustomizeBottomSheet: false });
          // handle successful cart addition here, such as updating the cart state
        } else {
          console.error('Failed to add item to cart:', data.message);
        }
      })
      .catch(error => {
        console.error('Network or server error:', error);
      });
    };
   
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={handleAddToCart}
        style={styles.addToCartAndItemsInfoWrapStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium, textAlign: "center" }}>
          Add to Cart
        </Text>
      </TouchableOpacity>
    );
  }

  
  //update options function
  function updateOptions(optionId) {
    updateState(prevState => {
      const newOptions = prevState.options.map(option => {
        if (option.id === optionId) {
          return { ...option, isSelected: !option.isSelected };
        }
        return option;
      });
      return { ...prevState, options: newOptions };
    });
  }    

  function optionsInfo(options) {
    if (!options || options.length === 0) {
      return null;
    }
    return (
      <View style={{ paddingTop: Sizes.fixPadding }}>
        {options.map((option) => (
          <View key={option.id}>
            <View style={styles.optionWrapStyle}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateOptions(option.id)}
                style={{
                  ...styles.radioButtonStyle,
                  backgroundColor: option.isSelected ? Colors.primaryColor : Colors.whiteColor,
                }}
              >
                {option.isSelected ? (
                  <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
                ) : null}
              </TouchableOpacity>
              <Text
                style={{
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.blackColor16Medium,
                }}
              >
                {option} 
              </Text>
            </View>
          </View>
        ))}
      </View>
    );
  }
  
  
  function totalInfo(item) {

    const totalPrice = item.price * state.qty; 
  
    return (
      <View style={{ paddingTop: Sizes.fixPadding, marginRight: Sizes.fixPadding }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "flex-end",
          }}
        >
          <Text
            style={{
              ...Fonts.darkPrimaryColor16Medium,
              color: "#000",
              fontSize: 20,
            }}
          >
            Total:{" "}
          </Text>
          <Text
            style={{
              ...Fonts.darkPrimaryColor16Medium,
              fontSize: 20,
            }}
          >
            ${totalPrice.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  }
  

  function optionsTitle() {
    return (
      <View
        style={{
          backgroundColor: Colors.bodyBackColor,
          padding: Sizes.fixPadding,
        }}
      >
        <Text style={{ ...Fonts.grayColor16Medium }}>Options</Text>
      </View>
    );
  }

  function sizesInfo(sizesArray) {
    if (!sizesArray || sizesArray.length === 0) {
      return <Text>No sizes available</Text>;
    }
  
    const { sizeIndex } = state; 
  
    return (
      <View style={{ backgroundColor: Colors.whiteColor, paddingHorizontal: Sizes.fixPadding, paddingTop: Sizes.fixPadding }}>
        {sizesArray.map((size, index) => {
          return sizes({
            size,
            // contain and price might not be needed, comment them out if not used
            // contain: size.contain, 
            // price: size.price, 
            index,
            sizeIndex,
          })
        })}
      </View>
    );
  }

  function sizes({ size, index, sizeIndex }) {
    const isSelected = sizeIndex === index;
    
    return (
      <View key={index} style={styles.sizesWrapStyle}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() => updateState({ sizeIndex: sizeIndex === index ? null : index })}
            style={{
              ...styles.radioButtonStyle,
              backgroundColor: isSelected ? Colors.primaryColor : Colors.whiteColor,
            }}
          >
            {isSelected && (
              <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
            )}
          </TouchableOpacity>
          <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
            {size}
          </Text>
          {/* <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
            ({contain})
          </Text>
          <Text style={{ ...Fonts.blackColor16Medium }}>${price}</Text> */}
        </View>
      </View>
    );
  }  

  function addNewItemTitle() {
    return (
      <Text
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
          ...Fonts.blackColor19Medium,
        }}
      >
        Add New Item
      </Text>
    );
  }

  function sizeTitle() {
    return (
      <View style={styles.sizeTitleStyle}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Size</Text>
        <Text style={{ ...Fonts.grayColor16Medium }}>Price</Text>
      </View>
    );
  }

  function CustmizeItemInfo({ itemId }) { 
    useEffect(() => { 
      const filterItem = menuItem.find((item) => item.id === itemId); 
      setItem(filterItem); 
    }, [itemId, menuItem]);
  
    if (!item) return null;       
  
    return (
      <View style={styles.custmizeItemInfoWrapStyle}>
        <Image
          source={{ uri: `http://10.0.2.2:4000/uploads/${item.image}` }}
          style={{
            width: 80.0,
            height: 80.0,
            borderRadius: Sizes.fixPadding - 5.0,
          }}
        />
        <View
          style={{
            flex: 1,
            marginVertical: Sizes.fixPadding - 7.0,
            justifyContent: "space-between",
            marginLeft: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.blackColor16Medium }}>{item.food_name}</Text>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ ...Fonts.primaryColor20MediumBold }}>
              ${(item.price * qty).toFixed(1)}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  qty > 1 ? updateState({ qty: qty - 1 }) : null;
                }}
                style={{
                  backgroundColor: qty > 1 ? Colors.primaryColor : "#E0E0E0",
                  ...styles.qtyAddRemoveButtonStyle,
                }}
              >
                <MaterialIcons
                  name="remove"
                  color={qty > 1 ? Colors.whiteColor : Colors.blackColor}
                  size={18}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: Sizes.fixPadding,
                  ...Fonts.blackColor16Medium,
                }}
              >
                {qty}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ qty: qty + 1 })}
                style={{
                  backgroundColor: Colors.primaryColor,
                  ...styles.qtyAddRemoveButtonStyle,
                }}
              >
                <MaterialIcons name="add" color={Colors.whiteColor} size={18} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  }

 
  //handle hot sale item save
  function handleHotSalesUpdate({ id }) {

    // Send HTTP request to backend using fetch
    fetch('http://10.0.2.2:4000/saveItem', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        item_id: id,
      }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Handle success response
        console.log('Bookmark updated successfully:', data);
        Toast.show({
          type: 'success',
          text1: data.message,
        });
      
        const updatedHotSales = hotSales.map(item => {
          if (item.id === id) {
            return { ...item, isFavourite: !item.isFavourite };
          }
          return item;
        });
        updateState({ hotSales: updatedHotSales, showSnackBar: true });
      })
      .catch(error => {
        // Handle error
        // console.error('Failed to update bookmark:', error);
        
        // Toast.show({
        //   type: 'error',
        //   text1: 'Error',
        //   text2: 'Failed to save item. Please try again.',
        //   visibilityTime: 4000,
        //   autoHide: true,
        //   topOffset: 30,
        //   bottomOffset: 40,
        // });
      });
      
  }

 
  //hot sale function  
  function hotSaleInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.hotSalesInfoWrapStyle}>
        <Image
          source={{ uri: `http://10.0.2.2:4000/uploads/${item?.image}` }}
          style={styles.hotSaleImageStyle}
        />
        <MaterialIcons
          name={item.isFavourite ? "bookmark" : "bookmark-outline"}
          size={22}
          color={Colors.whiteColor}
          style={{ position: "absolute", right: 10.0, top: 10.0 }}
          onPress={() => {
            handleHotSalesUpdate({ id: item.id });
            
          }}
        />
        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor15Medium }}>{item.food_name}</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}
          >
            {item.restaurant_name}
          </Text>
          <View
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ ...Fonts.primaryColor20MediumBold }}>
              ${item.price.toFixed(1)}
            </Text>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                updateState(
                  { showCustomizeBottomSheet: true },
                  setItemId(item.id)
                  
                )
              }
              style={styles.addIconWrapStyle}
            >
              <MaterialIcons name="add" size={17} color={Colors.whiteColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
    return (
      <View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.blackColor19Medium }}>Hot Sale</Text>
          <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
        </View>
        <FlatList
          horizontal
          data={menuItem}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

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

  function handleFavouriteRestaurentsUpdate({ id }) {
    const newList = favouriteRestaurents.map((property) => {
      if (property.id === id) {
        const updatedItem = { ...property, isFavourite: !property.isFavourite };
        return updatedItem;
      }
      return property;
    });
    updateState({ favouriteRestaurents: newList });
  }

  function favouriteRestaurantsInfo() {
    const renderItem = ({ item }) => (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.push("RestaurantDetail", { item })}
        style={styles.favouriteRestaurentsInfoWrapStyle}
      >
        <Image
          source={{ uri: `http://10.0.2.2:4000/uploads/${item.cover}` }}
          style={styles.favouriteRestaurentImageStyle}
        />

        <MaterialIcons
          name={item.isFavourite ? "bookmark" : "bookmark-outline"}
          size={22}
          color={Colors.whiteColor}
          style={{ position: "absolute", right: 10.0, top: 10.0 }}
          onPress={() => {
            handleFavouriteRestaurentsUpdate({ id: item.id });
            updateState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />

        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}
        >
          <Text numberOfLines={1} style={{ ...Fonts.blackColor15Medium }}>
            {item.restaurant_name}
          </Text>
          <Text
            numberOfLines={2}
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}
          >
            {item.location}
          </Text>
        </View>
      </TouchableOpacity>
    );
    return (
      <View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.blackColor19Medium }}>Restaurants</Text>
          <TouchableOpacity
            onPress={() => navigation.push("allRestaurantsScreen", { restaurants })}
          >
            <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          horizontal
          data={restaurants}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  function handleProductOrderedUpdate({ id }) {
    const newList = productsOrdereds.map((property) => {
      if (property.id === id) {
        const updatedItem = { ...property, isFavourite: !property.isFavourite };
        return updatedItem;
      }
      return property;
    });
    updateState({ productsOrdereds: newList });
  }

  function productsOrderedInfo() {
    const renderItem = ({ item }) => (
      <View style={styles.productsOrderedInfoWrapStyle}>
        <Image source={item.image} style={styles.productsOrderedImageStyle} />
        <MaterialIcons
          name={item.isFavourite ? "bookmark" : "bookmark-outline"}
          size={22}
          color={Colors.whiteColor}
          style={{ position: "absolute", right: 10.0, top: 10.0 }}
          onPress={() => {
            handleProductOrderedUpdate({ id: item.id });
            updateState({ isFavourite: item.isFavourite, showSnackBar: true });
          }}
        />

        <View
          style={{
            paddingHorizontal: Sizes.fixPadding - 5.0,
            paddingBottom: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding - 5.0,
          }}
        >
          <Text style={{ ...Fonts.blackColor15Medium }}>{item.foodName}</Text>
          <Text
            style={{
              marginTop: Sizes.fixPadding - 7.0,
              ...Fonts.grayColor14Medium,
            }}
          >
            {item.foodCategory}
          </Text>
        </View>
      </View>
    );
    return (
      <View>
        <View
          style={{
            marginHorizontal: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.blackColor19Medium }}>Favourite Food</Text>
          <Text style={{ ...Fonts.primaryColor16Medium }}>View all</Text>
        </View>
        <FlatList
          horizontal
          data={productsOrdereds}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding,
            paddingTop: Sizes.fixPadding,
            paddingBottom: Sizes.fixPadding * 3.0,
          }}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }

  function categoriesInfo() {
    const renderItem = ({ item }) => (
      <View
        style={{ alignItems: "center", marginRight: Sizes.fixPadding * 2.0 }}
      >
        <View style={styles.categoryImageWrapStyle}>
          <Image
            source={item.image}
            style={{ width: 40.0, height: 40.0 }}
            resizeMode="contain"
          />
        </View>
        <Text
          style={{ marginTop: Sizes.fixPadding, ...Fonts.blackColor15Medium }}
        >
          {item.type}
        </Text>
      </View>
    );
    return (
      <View>
        <Text
          style={{
            ...Fonts.blackColor19Medium,
            marginHorizontal: Sizes.fixPadding,
          }}
        >
          Categories
        </Text>
        <FlatList
          horizontal
          data={categoriesList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingLeft: Sizes.fixPadding + 5.0,
            paddingBottom: Sizes.fixPadding * 3.0,
            paddingTop: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }

  function offerBanners() {
    const renderItem = ({ item }) => (
      <Image source={item.image} style={styles.offerBannersImageStyle} />
    );
    return (
      <View>
        <FlatList
          horizontal
          data={offerBannersList}
          keyExtractor={(item) => `${item.id}`}
          renderItem={renderItem}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingVertical: Sizes.fixPadding * 2.0,
            paddingLeft: Sizes.fixPadding,
          }}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  pageStyle: {
    borderTopLeftRadius: Sizes.fixPadding * 2.0,
    borderTopRightRadius: Sizes.fixPadding * 2.0,
    backgroundColor: Colors.bodyBackColor,
    flex: 1,
    paddingBottom: Sizes.fixPadding * 7.0,
  },
  offerBannersImageStyle: {
    width: 170.0,
    height: 160.0,
    borderRadius: Sizes.fixPadding,
    marginRight: Sizes.fixPadding,
  },
  categoryImageWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    alignItems: "center",
    justifyContent: "center",
    width: 60.0,
    height: 60.0,
  },
  snackBarStyle: {
    position: "absolute",
    bottom: 57.0,
    left: -10.0,
    right: -10.0,
    backgroundColor: "#333333",
    elevation: 0.0,
  },
  searchInfoWrapStyle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.darkPrimaryColor,
    flex: 1,
    marginHorizontal: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding * 2.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    paddingHorizontal: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding,
  },
  productsOrderedInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  productsOrderedImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  favouriteRestaurentsInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  favouriteRestaurentImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  hotSalesInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding - 5.0,
    width: 130.0,
    marginRight: Sizes.fixPadding + 2.0,
  },
  hotSaleImageStyle: {
    width: 130.0,
    height: 110.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding - 5.0,
  },
  addIconWrapStyle: {
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
  },
  addToCartAndItemsInfoWrapStyle: {
    width: "45%",
    backgroundColor: Colors.primaryColor,
    paddingVertical: Sizes.fixPadding,
    marginHorizontal: Sizes.fixPadding - 1,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  radioButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: Colors.grayColor,
    borderWidth: 1.0,
  },
  optionWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
  },
  sizesWrapStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Sizes.fixPadding,
  },
  sizeTitleStyle: {
    backgroundColor: Colors.bodyBackColor,
    padding: Sizes.fixPadding,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  custmizeItemInfoWrapStyle: {
    marginBottom: Sizes.fixPadding * 2.0,
    flexDirection: "row",
    flex: 1,
    marginHorizontal: Sizes.fixPadding,
  },
  qtyAddRemoveButtonStyle: {
    width: 27.0,
    height: 27.0,
    borderRadius: 13.5,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomSheetOpenCloseDividerStyle: {
    backgroundColor: Colors.grayColor,
    height: 4.0,
    borderRadius: Sizes.fixPadding,
    width: 40.0,
    alignSelf: "center",
    marginTop: Sizes.fixPadding,
    marginBottom: Sizes.fixPadding * 2.0,
  },
  addressWrapStyle: {
    paddingBottom: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default memo(DiscoverScreen);
