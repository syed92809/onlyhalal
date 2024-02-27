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



//   //Options Function
//   function optionsInfo(options) {
//     if (!options || options.length === 0) {
//       return null;
//     }
//     return (
//       <View style={{ paddingTop: Sizes.fixPadding }}>
//         {options.map((option) => (
//           <View key={option.id}>
//             <View style={styles.optionWrapStyle}>
//               <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => updateOptions(option.id)}
//                 style={{
//                   ...styles.radioButtonStyle,
//                   backgroundColor: option.isSelected ? Colors.primaryColor : Colors.whiteColor,
//                 }}
//               >
//                 {option.isSelected ? (
//                   <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
//                 ) : null}
//               </TouchableOpacity>
//               <Text
//                 style={{
//                   marginLeft: Sizes.fixPadding,
//                   ...Fonts.blackColor16Medium,
//                 }}
//               >
//                 {option} 
//               </Text>
//             </View>
//           </View>
//         ))}
//       </View>
//     );
//   }
  

//   //Total Function
//   function totalInfo(item) {

//     const totalPrice = item.price * state.qty; 
  
//     return (
//       <View style={{ paddingTop: Sizes.fixPadding, marginRight: Sizes.fixPadding }}>
//         <View
//           style={{
//             flexDirection: "row",
//             alignItems: "center",
//             alignSelf: "flex-end",
//           }}
//         >
//           <Text
//             style={{
//               ...Fonts.darkPrimaryColor16Medium,
//               color: "#000",
//               fontSize: 20,
//             }}
//           >
//             Total:{" "}
//           </Text>
//           <Text
//             style={{
//               ...Fonts.darkPrimaryColor16Medium,
//               fontSize: 20,
//             }}
//           >
//             ${totalPrice.toFixed(2)}
//           </Text>
//         </View>
//       </View>
//     );
//   }

//   function optionsTitle() {
//     return (
//       <View
//         style={{
//           backgroundColor: Colors.bodyBackColor,
//           padding: Sizes.fixPadding,
//         }}
//       >
//         <Text style={{ ...Fonts.grayColor16Medium }}>Options</Text>
//       </View>
//     );
//   }

//   function sizesInfo(sizesArray) {
//     if (!sizesArray || sizesArray.length === 0) {
//       return <Text>No sizes available</Text>;
//     }
  
//     const { sizeIndex } = state; 
  
//     return (
//       <View style={{ backgroundColor: Colors.whiteColor, paddingHorizontal: Sizes.fixPadding, paddingTop: Sizes.fixPadding }}>
//         {sizesArray.map((size, index) => {
//           return sizes({
//             size,
//             // contain and price might not be needed, comment them out if not used
//             // contain: size.contain, 
//             // price: size.price, 
//             index,
//             sizeIndex,
//           })
//         })}
//       </View>
//     );
//   }

//   function sizes({ size, index, sizeIndex }) {
//     const isSelected = sizeIndex === index;
    
//     return (
//       <View key={index} style={styles.sizesWrapStyle}>
//         <View style={{ flexDirection: "row", alignItems: "center" }}>
//           <TouchableOpacity
//             activeOpacity={0.9}
//             onPress={() => updateState({ sizeIndex: sizeIndex === index ? null : index })}
//             style={{
//               ...styles.radioButtonStyle,
//               backgroundColor: isSelected ? Colors.primaryColor : Colors.whiteColor,
//             }}
//           >
//             {isSelected && (
//               <MaterialIcons name="done" size={18} color={Colors.whiteColor} />
//             )}
//           </TouchableOpacity>
//           <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
//             {size}
//           </Text>
//           {/* <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.grayColor14Medium }}>
//             ({contain})
//           </Text>
//           <Text style={{ ...Fonts.blackColor16Medium }}>${price}</Text> */}
//         </View>
//       </View>
//     );
//   }  

//   function addNewItemTitle() {
//     return (
//       <Text
//         style={{
//           marginHorizontal: Sizes.fixPadding,
//           marginBottom: Sizes.fixPadding + 5.0,
//           ...Fonts.blackColor19Medium,
//         }}
//       >
//         Add New Item
//       </Text>
//     );
//   }

//   function sizeTitle() {
//     return (
//       <View style={styles.sizeTitleStyle}>
//         <Text style={{ ...Fonts.grayColor16Medium }}>Size</Text>
//         <Text style={{ ...Fonts.grayColor16Medium }}>Price</Text>
//       </View>
//     );
//   }


  // Sheet Function
  function CustmizeItemInfo({ itemId }) {
    const selectedItem = cartItems.find(item => item.id === itemId);
    if (!selectedItem || !showCustomizeBottomSheet) {
      return null;
    }
    return (
      <BottomSheet
        isVisible={showCustomizeBottomSheet}
        containerStyle={{ backgroundColor: "rgba(0.5, 0.25, 0, 0.2)" }}
        onBackdropPress={() => 
          updateState({ showCustomizeBottomSheet: false })}
      >
      <View style={styles.custmizeItemInfoWrapStyle}>
        <Image
          source={selectedItem.image}
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
          <Text style={{ ...Fonts.blackColor16Medium }}>{selectedItem.food_name}</Text>
          <View
            style={{
              alignItems: "flex-start",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ ...Fonts.primaryColor20MediumBold, color:Colors.orangeRatingColor }}>
              ${(selectedItem.price * qty).toFixed(1)}
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
                  color={qty > 1 ? Colors.whiteColor : Colors.orangeRatingColor}
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
      </BottomSheet>
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
    <CustmizeItemInfo itemId={selectedItemId} />
    {/* {sizeTitle()}
    {sizesInfo(selectedItemId.sizes)}
    {optionsTitle()}
    {optionsInfo(selectedItemId.options)}
    {totalInfo(item)} */}
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
});

export default CartScreen;