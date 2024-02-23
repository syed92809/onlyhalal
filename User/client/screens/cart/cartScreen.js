import React, { useState, useEffect, memo } from "react";
import { View,StyleSheet,Text,Image,TouchableOpacity,ScrollView, Animated, TouchableHighlight, Dimensions} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import image from "../../assets/images/products/lemon_juice.png";
import { Icon } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import CartCard from "../../components/cartCard";
import { MaterialIcons } from '@expo/vector-icons';
import { SwipeListView } from 'react-native-swipe-list-view';
import { Snackbar } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';




const { width } = Dimensions.get('screen');


const restaurantsList = [
    {
        key: '1',
        image: require('../../assets/images/restaurant/restaurant_5.png'),
        name: 'Bar 61 Restaurant',
        address: '76A England',
        rating: 4.5,
        distance: 0.5,
        isFavourite: false,
    },
    {
        key: '2',
        image: require('../../assets/images/restaurant/restaurant_4.png'),
        name: 'Core by Clare Smyth',
        address: '220 Opera Street',
        rating: 4.2,
        distance: 1.8,
        isFavourite: false,
    },
    {
        key: '3',
        image: require('../../assets/images/restaurant/restaurant_3.png'),
        name: 'Amrutha Lounge',
        address: '90B Silicon Velley',
        rating: 5.0,
        distance: 0.7,
        isFavourite: false,
    },
];

const rowSwipeAnimatedValues = {};
restaurantsList.forEach((item) => {
  rowSwipeAnimatedValues[item.key] = new Animated.Value(0);
});



const CartScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [listData, setListData] = useState(restaurantsList);

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


  const fetchCartItems = async (userId) => {
    try {

      const response = await fetch(`http://10.0.2.2:4000/getCartItems?userId=${userId}`);
      const data = await response.json();
      console.log(data)
      if (response.ok) {
        const formattedData = data.map((item, index) => ({
          key: `${index}`,
          name: item.food_name,
          quantity: item.quantity,
          price: item.price,
          image: { uri: `http://10.0.2.2:4000/uploads/${item.image}` }, 
        }));
        setCartItems(formattedData);

        // Initialize or update Animated.Values for each item
        const updatedRowSwipeAnimatedValues = {};
        formattedData.forEach((item, index) => {
            updatedRowSwipeAnimatedValues[item.key] = new Animated.Value(0);
        });
        setRowSwipeAnimatedValues(updatedRowSwipeAnimatedValues); 

    } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: 'Failed to retrieve cart items.',
        });
      }
    } catch (error) {
      console.error("Error fetching cart items:", error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to retrieve cart items.',
      });
    }
  };

//call fetchcaritems on useEffect
  useEffect(() => {
    if (userId) {
      fetchCartItems(userId); 
    }
  }, [userId]);



const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
};

const deleteRow = (rowMap, rowKey) => {
    closeRow(rowMap, rowKey);
    const newData = [...listData];
    const prevIndex = listData.findIndex(item => item.key === rowKey);
    newData.splice(prevIndex, 1);
    setShowSnackBar(true);
    setListData(newData);
};

const onSwipeValueChange = swipeData => {
    const { key, value } = swipeData;
    rowSwipeAnimatedValues[key].setValue(Math.abs(value));
};

const renderItem = ({ item }) => (
    <TouchableHighlight
      underlayColor={Colors.lightGray}
      onPress={() => console.log('Item pressed')}
      style={styles.itemContainer}
    >
      <View style={styles.itemRow}>
        <Image source={{ uri: item.image.uri }} style={styles.itemImage} />
        <View style={styles.itemDetails}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemQuantity}>Quantity: {item.quantity}</Text>
          <Text style={styles.itemPrice}>Price: ${item.price}</Text>
        </View>
      </View>
    </TouchableHighlight>
  );

const renderHiddenItem = (data, rowMap) => (
    
    <View style={{ alignItems: 'center', flex: 1, }}>
        <TouchableOpacity
            style={styles.backDeleteContinerStyle}
            onPress={() => deleteRow(rowMap, data.item.key)}
        >
            <Animated.View
                style={[
                    {
                        transform: [
                            {
                                scale: rowSwipeAnimatedValues[
                                    data.item.key
                                ].interpolate({
                                    inputRange: [45, 90],
                                    outputRange: [0, 1],
                                    extrapolate: 'clamp',
                                }),
                            },
                        ],
                    },
                ]}
            >
                <MaterialIcons
                    name="delete"
                    size={24}
                    color={Colors.whiteColor}
                    style={{ alignSelf: 'center' }}
                />
                <Text style={{ ...Fonts.whiteColor14Regular }}>
                    Delete
                </Text>
            </Animated.View>
        </TouchableOpacity>
    </View>
);

return (
    <View style={styles.container}>
    <View style={styles.header}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
      <MaterialIcons name="arrow-back" size={24} color={Colors.blackColor} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>Cart</Text>
  </View>
    <View style={{ flex: 1 }}>
        {
            listData.length == 0 ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="bookmark-outline" size={60} color={Colors.grayColor} />
                    <Text style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding * 2.0 }}>
                        No Item in Cart
                    </Text>
                </View>
                :
                <View style={{ flex: 1 }}>
                    <SwipeListView
                        data={cartItems}
                        renderItem={renderItem}
                        renderHiddenItem={renderHiddenItem}
                        rightOpenValue={-110}
                        onSwipeValueChange={onSwipeValueChange}
                        contentContainerStyle={{
                            paddingTop: Sizes.fixPadding * 2.0,
                        }}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
        }
        <Snackbar
            style={styles.snackBarStyle}
            visible={showSnackBar}
            onDismiss={() => setShowSnackBar(false)}
        >
            Item Removed
        </Snackbar>
    </View>
    </View>
);
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f4f4f4",
        },
        header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: Colors.whiteColor,
        elevation: 2, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        },
        backButton: {
        marginRight: 20,
        },
        headerTitle: {
        ...Fonts.blackColor22Medium,
        },
    restaurantWrapStyle: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 5,
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

    headerWrapStyle: {
        paddingLeft: Sizes.fixPadding + 5.0,
        paddingRight: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding,
        backgroundColor: Colors.whiteColor,
    },
    bodyContainer: {
        flex: 1,
        padding: 20,
    },
    button: {
        margin: 10,
        backgroundColor: "#FFA500",
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    buttonText: {
        color: "white",
        fontWeight: "bold",
    },
    Noitem:{
        justifyContent: "center",
        fontSize:20,
        padding:85,
        paddingTop:250
    },
    orderWrapStyle: {
        flexDirection: 'row',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding,
    },

    orderIdIndicatorStyle: {
        backgroundColor: Colors.whiteColor,
        borderColor: Colors.primaryColor,
        borderWidth: 1.0,
        width: 11.0,
        height: 11.0,
        borderRadius: 5.5,
    },
    snackBarStyle: {
        position: 'absolute',
        bottom: 58.0,
        left: -10.0,
        right: -10.0,
        backgroundColor: '#333333',
        elevation: 0.0,
    },
    backDeleteContinerStyle: {
        alignItems: 'center',
        bottom: 10.0,
        justifyContent: 'center',
        position: 'absolute',
        top: 0,
        width: 100,
        backgroundColor: Colors.redColor,
        right: 0,
    },
});

export default CartScreen;