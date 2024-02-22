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
const rowSwipeAnimatedValues = {};

const CartScreen = ({ navigation }) => {
  const [userId, setUserId] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const [listData, setListData] = useState([]);

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
      if (response.ok) {
        data.forEach(item => {
          rowSwipeAnimatedValues[item.id.toString()] = new Animated.Value(0);
        });
        setCartItems(data.map(item => ({
          key: item.id.toString(),
          image: item.image, 
          name: item.food_name,
          // deliveredFrom: item.deliveredFrom, 
          amount: item.amount, 

        })));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: data.message || 'Failed to retrieve cart items.',
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
  
  useEffect(() => {
    AsyncStorage.getItem("userId")
      .then((storedUserId) => {
        if (storedUserId) {
          setUserId(storedUserId);
          fetchCartItems(storedUserId); // Fetch cart items after setting the user ID
        }
      })
      .catch((error) => {
        console.error("Error retrieving userId from AsyncStorage:", error);
      });
  }, []);


  //handle hot sale item save
  function deleteItem(itemId) {
    AsyncStorage.getItem("userId").then((userId) => {
        if (!userId) return;

        fetch('http://10.0.2.2:4000/deleteItem', {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: userId,
                item_id: itemId, 
            }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {

                setListData((prevListData) => prevListData.filter(item => item.key !== itemId));
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: data.message,
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Error',
                    text2: data.message,
                });
            }
        })
        .catch(error => {
            console.error('Failed to delete item:', error);
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: 'Failed to delete item. Please try again.',
            });
        });
    }).catch(error => {
        console.error("Error retrieving userId from AsyncStorage:", error);
    });
}  


  const closeRow = (rowMap, rowKey) => {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
  };

  const deleteRow = (rowMap, rowKey) => {
      if (rowMap[rowKey]) {
          rowMap[rowKey].closeRow();
      }
      deleteItem(rowKey); 
  };


  const onSwipeValueChange = swipeData => {
      const { key, value } = swipeData;
      rowSwipeAnimatedValues[key].setValue(Math.abs(value));
  };


  const renderItem = data => (
    <TouchableHighlight
        style={{ backgroundColor: Colors.bodyBackColor }}
        activeOpacity={0.9}
    >
        <View style={styles.orderWrapStyle}>
            <Image
                source={data.item.image}
                style={styles.restaurantImageStyle}
            />
            <View style={{ marginHorizontal: Sizes.fixPadding, flex: 1, paddingVertical: Sizes.fixPadding, justifyContent: 'space-between' }}>
                <Text numberOfLines={1} style={{ maxWidth: width / 1.8, ...Fonts.blackColor16Medium }}>
                    {data.item.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <MaterialIcons
                        name="home"
                        color={Colors.grayColor}
                        size={20}
                    />
                <Text numberOfLines={1} style={{ maxWidth: width / 1.8, ...Fonts.grayColor14Medium }}>
                    {/* {data.item.deliveredFrom} */}
                </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons
                            name="star"
                            color={Colors.ratingColor}
                            size={20}
                        />

                    </View>
                    <Text style={{ ...Fonts.primaryColor20MediumBold }}>
                        ${data.item.amount}
                    </Text>
                </View>
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
    <View style={{ flex: 1 }}>
        {
            cartItems.length === 0 ?
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <MaterialIcons name="shopping-cart" size={60} color={Colors.grayColor} />
                    <Text style={{ ...Fonts.grayColor17Medium, marginTop: Sizes.fixPadding * 2.0, }}>
                        No Item in Cart 
                    </Text>
                </View>
                :
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
        }
        <Snackbar
            style={styles.snackBarStyle}
            visible={showSnackBar}
            onDismiss={() => setShowSnackBar(false)}
        >
            Item Removed
        </Snackbar>
    </View>
);

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
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
restaurantImageStyle: {
    width: 90.0,
    height: 100.0,
    borderTopLeftRadius: Sizes.fixPadding - 5.0,
    borderBottomLeftRadius: Sizes.fixPadding - 5.0,
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