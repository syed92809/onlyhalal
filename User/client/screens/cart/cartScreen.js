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
import { BottomSheet } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';
import { color } from "@rneui/themed/dist/config";



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
  const [rowSwipeAnimatedValues, setRowSwipeAnimatedValues] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [item, setItem] = useState({});

  const [state, setState] = useState({
    sizeIndex: null,
    qty: 1,
    showCustomizeBottomSheet: false,
  });


  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    qty,
    showCustomizeBottomSheet,
  } = state;



  // Initialization of rowSwipeAnimatedValues for list
  useEffect(() => {
    const initRowSwipeValues = {};
    restaurantsList.forEach((item) => {
      initRowSwipeValues[item.key] = new Animated.Value(0);
    });
    setRowSwipeAnimatedValues(initRowSwipeValues);
  }, []);


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
          id:item.id,
          food_name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: { uri: `http://10.0.2.2:4000/uploads/${item.image}` }, 
          restaurant: item.restaurant_name,
          item_sizes:item.size,
          item_options:item.options,
          item_total:item.total

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



//  Options Function
  function optionsInfo(option) {
    if (!option) {
      return <Text>No Options Available</Text>;
    }
    return (
      <View style={{ paddingTop: Sizes.fixPadding }}>
        <View key={option.id}>
          <View style={styles.optionWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateOptions(option.id)}
              style={{
                ...styles.radioButtonStyle,
                backgroundColor: Colors.orangeRatingColor,
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

  function sizesInfo(size) {
    if (!size) {
      return <Text style={{justifyContent:"center",paddingLeft:20,fontStyle:"bold"}}>No Size Available</Text>;
    }
    return (
      <View style={{ paddingTop: Sizes.fixPadding }}>
        <View key={size.id}>
          <View style={styles.optionWrapStyle}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() => updateOptions(size.id)}
              style={{
                ...styles.radioButtonStyle,
                backgroundColor: Colors.orangeRatingColor,
              }}
            >
              {size.isSelected ? (
                <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
              ) : null}
            </TouchableOpacity>
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.blackColor16Medium,
              }}
            >
              {size} 
            </Text>
          </View>
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
        Item Details
      </Text>
    );
  }

  function sizeTitle() {
    return (
      <View style={styles.sizeTitleStyle}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Size</Text>
      </View>
    );
  }


  function custmizeBottomSheet() {
    const selectedItem = cartItems.find((mItem) => mItem.id === selectedItemId);
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
            <CustmizeItemInfo itemId={selectedItemId} />
          </TouchableOpacity>
          {sizeTitle()}
          {sizesInfo(selectedItem.item_sizes)}
          {optionsTitle()}
          {optionsInfo(selectedItem.item_options)}
          {CheckOut(selectedItem)}

        </TouchableOpacity>
      </BottomSheet>
    );
  }

  // Sheet Function
  function CustmizeItemInfo({ itemId }) { 
    useEffect(() => { 
      const filterItem = cartItems.find((item) => item.id === itemId); 
      setItem(filterItem); 
    }, [itemId, cartItems]);
  
    if (!item) return null;       
  
    return (
      <View style={styles.custmizeItemInfoWrapStyle}>
        <Image
          source={item.image}
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
            <Text style={{ ...Fonts.primaryColor20MediumBold,color:Colors.orangeRatingColor }}>
              ${(item.price * qty).toFixed(1)}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => {
                  qty > 1 ? updateState({ qty: qty - 1 }) : null;
                }}
                style={{
                  backgroundColor: Colors.orangeRatingColor,
                  ...styles.qtyAddRemoveButtonStyle,
                }}
              >
                <MaterialIcons
                  name="remove"
                  color={qty > 1 ? Colors.whiteColor : Colors.whiteColor}
                  size={18}
                />
              </TouchableOpacity>
              <Text
                style={{
                  marginHorizontal: Sizes.fixPadding,
                  ...Fonts.blackColor16Medium,
                  color:Colors.orangeRatingColor
                }}
              >
                {qty}
              </Text>
              <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => updateState({ qty: qty + 1 })}
                style={{
                  backgroundColor: Colors.orangeRatingColor,
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


  function CheckOut(order) {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          updateState({ showCustomizeBottomSheet: false });
          navigation.push("ConfirmOrder", { order });
        }}
        style={styles.OrdertemsInfoWrapStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium, textAlign: "center" }}>
          Order Now
        </Text>
      </TouchableOpacity>
    );
  }


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


const renderItem = data => (
    <TouchableHighlight
        style={{ backgroundColor: Colors.bodyBackColor }}
        activeOpacity={0.9}
    >
        <View style={styles.restaurantWrapStyle}>
            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Image
                    source={data.item.image}
                    style={styles.restaurantImageStyle}
                />
                <View style={{ width: width / 2.0, marginLeft: Sizes.fixPadding, height: 100.0, justifyContent: 'space-evenly' }}>
                    <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                      
                     {data.item.quantity} {data.item.food_name}
                    </Text>
                   
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>{data.item.restaurant}</Text>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <MaterialIcons name="attach-money" size={20} color={Colors.orangeRatingColor} />
                        <Text numberOfLines={1} style={{ ...Fonts.blackColor16Medium }}>
                            {data.item.price}
                        </Text>
                    </View>
                </View>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableHighlight onPress={() => {
                updateState(
                    { showCustomizeBottomSheet: true },
                    setSelectedItemId(data.item.id)
                    
                  )
                }}>
                <MaterialIcons name="remove-red-eye" size={20} color={Colors.orangeRatingColor} />
                </TouchableHighlight>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialIcons name="delete" size={20} color={Colors.orangeRatingColor} />
                
            </View>
           
        </View>
    </TouchableHighlight>
);

const renderHiddenItem = (data, rowMap) => {
    const animatedValue = rowSwipeAnimatedValues[data.item.key];
    if (!animatedValue) {
      console.error('Animated value not found for key:', data.item.key);
      return null; 
    }
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
};

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
                        No Items in Cart
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
    {custmizeBottomSheet()}
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
    custmizeItemInfoWrapStyle: {
        marginBottom: Sizes.fixPadding * 2.0,
        flexDirection: "row",
        flex: 1,
        marginHorizontal: Sizes.fixPadding,
        backgroundColor:Colors.whiteColor,
        borderTopLeftRadius:15,
        borderTopRightRadius:15,
        
      },
    qtyAddRemoveButtonStyle: {
        width: 27.0,
        height: 27.0,
        borderRadius: 13.5,
        alignItems: "center",
        marginRight:10,
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
    addIconWrapStyle: {
    width: 22.0,
    height: 22.0,
    borderRadius: 11.0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primaryColor,
  },
  OrdertemsInfoWrapStyle: {
    width: "95%",
    backgroundColor: Colors.orangeRatingColor,
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
    backgroundColor:Colors.orangeRatingColor
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

    
});

export default CartScreen;