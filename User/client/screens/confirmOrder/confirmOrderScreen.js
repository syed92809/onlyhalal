import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  StatusBar,
  StyleSheet,
  Dimensions,
  FlatList,
  ScrollView,
  TextInput,
  Text,
  Image,
  TouchableOpacity,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from "@expo/vector-icons";
import Dialog from "react-native-dialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from "react-native-toast-message";
import { useRoute } from "@react-navigation/native";

const { width } = Dimensions.get("screen");

const ConfirmOrderScreen = ({ navigation }) => {
  const route = useRoute();
  const order = route.params?.order;
  console.log(order);

  const phoneNumber = "145434211432";
  const deliveryTime = "30";

  const [state, setState] = useState({
    voucherFocus: false,
    currentPaymentIndex: null,
    showSuccessDialog: false,
    paymentMethods: [],
  });

  useEffect(() => {
    AsyncStorage.getItem("userId").then((userId) => {
      if (userId) {
        fetchUserCards(userId);
      }
    });
  }, []);

  //fetching user card details
  const fetchUserCards = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      if (!userId) {
        console.error("No userId available");
        return;
      }

      const response = await fetch(
        `http://192.168.1.105:4000/getUserCards?userId=${userId}`
      );
      const data = await response.json();

      if (data.success && data.cards.length > 0) {
        const formattedCards = data.cards.map((card, index) => ({
          key: `card-${index}`,
          image:
            card.cardType === "Visa Card"
              ? require("../../assets/images/payment/visa.png")
              : require("../../assets/images/payment/master_card.png"),
          number: `**** **** **** ${card.cardNumber.slice(-4)}`,
        }));

        setState((prevState) => ({
          ...prevState,
          paymentMethods: formattedCards,
          currentPaymentIndex: formattedCards[0].key, // Setting the first card as selected
        }));
      } else {
        console.error("Failed to fetch user cards:", data.message);
      }
    } catch (error) {
      console.error("Error fetching user cards:", error);
    }
  };

  const [username, setUsername] = useState(null);
  const [userAddress, setUserAddress] = useState("Maymar Garden");
  const [userId, setUserId] = useState(null);

  //getting User Name from async storage
  useEffect(() => {
    // Fetch username from AsyncStorage
    AsyncStorage.getItem("username")
      .then((storedUserName) => {
        if (storedUserName) {
          setUsername(storedUserName);
        }
      })
      .catch((error) => {
        console.error("Error retrieving Username from AsyncStorage:", error);
      });
  }, []);

  //getting User Address from async storage
  useEffect(() => {
    // Fetch userAddress from AsyncStorage
    AsyncStorage.getItem("userAddress")
      .then((storedUserAddress) => {
        if (storedUserAddress) {
          setUserAddress(storedUserAddress);
        }
      })
      .catch((error) => {
        console.error(
          "Error retrieving User Address from AsyncStorage:",
          error
        );
      });
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

  //Error toast
  const show_error_message = (message) => {
    Toast.show({
      type: "error",
      text1: "Error",
      text2: message,
      autoHide: true,
      visibilityTime: 2000,
      bottomOffset: 50,
      position: "bottom",
    });
  };

  // Place order operation here
  const placeOrder = () => {
    if (!userAddress) {
      show_error_message("Please select your address");
    } else {
      fetch("http://192.168.1.105:4000/placeOrder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: userId,
          address: "Maymar Garden",
          deliveryTime: deliveryTime,
          item_name: order.item.food_name,
          item_category: order.item.category,
          subtotal: order.total,
          delivery_fee: 1.3,
          total_amount: order.total + 1.3,
          voucher: "",
          note: "Send me a msg when you reach the location",
          payment_method: "Visa Card",
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          // Check for errors in the response
          if (!data.success) {
            show_error_message(data.message);
          } else {
            // Successful order placement
            console.log("Order Placed Successsfully");
            updateState({ showSuccessDialog: true });
          }
        })
        .catch((error) => {
          show_error_message(error.message);
        });
    }
  };

  const updateState = (data) => setState((state) => ({ ...state, ...data }));

  const {
    voucherFocus,
    currentPaymentIndex,
    showSuccessDialog,
    paymentMethods,
  } = state;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.whiteColor }}>
      <StatusBar backgroundColor={Colors.primaryColor} />
      <View style={{ flex: 1 }}>
        {header()}
        <ScrollView showsVerticalScrollIndicator={false}>
          {deliveryToInfo()}
          {deliveryTimeInfo()}
          {orderInfo(order)}
          {addVoucherInfo()}
          {noteInfo()}
          {paymentMethod()}
          {confirmButton()}
        </ScrollView>
        {successDialog()}
      </View>
    </SafeAreaView>
  );

  function successDialog() {
    return (
      <Dialog.Container
        visible={showSuccessDialog}
        contentStyle={styles.dialogWrapStyle}
        headerStyle={{ margin: 0.0 }}
      >
        <View
          style={{ backgroundColor: Colors.whiteColor, alignItems: "center" }}
        >
          <View style={styles.successIconWrapStyle}>
            <MaterialIcons name="done" size={35} color={Colors.primaryColor} />
          </View>
          <Text
            style={{
              ...Fonts.grayColor16Medium,
              marginTop: Sizes.fixPadding + 5.0,
            }}
          >
            Your order has been placed!
          </Text>
        </View>
      </Dialog.Container>
    );
  }

  function confirmButton() {
    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          placeOrder();
          setTimeout(() => {
            updateState({ showSuccessDialog: false });
          }, 2000);
        }}
        style={styles.confirmButtonStyle}
      >
        <Text style={{ ...Fonts.whiteColor16Medium }}>Confirm</Text>
      </TouchableOpacity>
    );
  }

  function paymentMethod() {
    return (
      <FlatList
        horizontal
        data={state.paymentMethods}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.9}
            onPress={() =>
              setState((prevState) => ({
                ...prevState,
                currentPaymentIndex: item.key,
              }))
            }
            style={{
              ...styles.paymentMethodWrapStyle,
              borderColor:
                currentPaymentIndex == item.key
                  ? Colors.primaryColor
                  : Colors.grayColor,
            }}
          >
            <Image
              source={item.image}
              style={{ width: 50.0, height: 50.0 }}
              resizeMode="contain"
            />
            <Text
              style={{
                marginLeft: Sizes.fixPadding,
                ...Fonts.blackColor19Medium,
              }}
            >
              {item.number}
            </Text>
            {currentPaymentIndex == item.key ? (
              <View style={styles.paymentMethodSelectorStyle}>
                <MaterialIcons
                  name="done"
                  size={15}
                  color={Colors.whiteColor}
                />
              </View>
            ) : null}
          </TouchableOpacity>
        )}
      />
    );
  }

  function noteInfo() {
    return (
      <View>
        <View
          style={{
            backgroundColor: Colors.bodyBackColor,
            padding: Sizes.fixPadding,
            marginTop: Sizes.fixPadding - 5.0,
          }}
        >
          <Text style={{ ...Fonts.grayColor16Medium }}>Note</Text>
        </View>
        <TextInput
          placeholder="Enter Note Here"
          style={styles.noteTextFieldStyle}
          multiline={true}
          numberOfLines={5}
          placeholderTextColor={Colors.grayColor}
          selectionColor={Colors.primaryColor}
          textAlignVertical="top"
        />
      </View>
    );
  }

  function addVoucherInfo() {
    return (
      <View>
        <View
          style={{
            backgroundColor: Colors.bodyBackColor,
            padding: Sizes.fixPadding,
            marginTop: Sizes.fixPadding,
          }}
        >
          <Text style={{ ...Fonts.grayColor16Medium }}>Add Voucher</Text>
        </View>
        <View style={styles.addVoucherInfoWrapStyle}>
          <View style={{ flex: 1 }}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 1,
              }}
            >
              <MaterialIcons
                name="local-attraction"
                color={Colors.primaryColor}
                size={24}
              />
              <TextInput
                style={{
                  flex: 1,
                  marginLeft: Sizes.fixPadding,
                  ...Fonts.primaryColor14Medium,
                }}
                placeholder="Add Voucher Code"
                selectionColor={Colors.primaryColor}
                placeholderTextColor={Colors.primaryColor}
                onFocus={() => updateState({ voucherFocus: true })}
                onBlur={() => updateState({ voucherFocus: false })}
              />
            </View>
            <View
              style={{
                backgroundColor: voucherFocus
                  ? Colors.primaryColor
                  : Colors.grayColor,
                height: 1.0,
              }}
            />
          </View>
          <View style={styles.applyButtonStyle}>
            <Text style={{ ...Fonts.whiteColor14Regular }}>Apply</Text>
          </View>
        </View>
      </View>
    );
  }

  function orderInfo(order) {
    return (
      <View
        style={{
          marginHorizontal: Sizes.fixPadding,
          marginTop: Sizes.fixPadding,
        }}
      >
        <View
          style={{
            marginBottom: Sizes.fixPadding + 5.0,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
        {order && order.item && (
            <Image
                source={{ uri: `http://192.168.1.105:4000/uploads/${order.item.image}` }}
                style={{
                width: 80.0,
                height: 80.0,
                borderRadius: Sizes.fixPadding - 5.0,
                }}
            />
        )}

          <View style={{ marginLeft: Sizes.fixPadding + 5.0 }}>
            <Text style={{ ...Fonts.blackColor16Medium }}>
              {order.item.category}
            </Text>
            <Text style={{ ...Fonts.grayColor14Medium }}>
              {order.item.food_name}
            </Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.blackColor16Medium }}>Subtotal (1 item)</Text>
          <Text style={{ ...Fonts.blackColor16Medium }}>${order.total}</Text>
        </View>
        <View
          style={{
            marginTop: Sizes.fixPadding,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.blackColor16Medium }}>Ship Fee (2.4 Km)</Text>
          <Text style={{ ...Fonts.blackColor16Medium }}>$1.3</Text>
        </View>
        <View
          style={{
            marginVertical: Sizes.fixPadding + 2.0,
            backgroundColor: Colors.grayColor,
            height: 0.5,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ ...Fonts.primaryColor20MediumBold }}>Total</Text>
          <Text style={{ ...Fonts.primaryColor20MediumBold }}>
            ${order.total + 1.3}
          </Text>
        </View>
      </View>
    );
  }

  function deliveryTimeInfo() {
    return (
      <View style={styles.deliveryTimeWrapStyle}>
        <Text style={{ ...Fonts.grayColor16Medium }}>Delivery Time</Text>
        <Text
          style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor17Medium }}
        >
          {deliveryTime}
        </Text>
      </View>
    );
  }

  function deliveryToInfo() {
    return (
      <View
        style={{
          marginBottom: Sizes.fixPadding + 5.0,
          marginHorizontal: Sizes.fixPadding,
        }}
      >
        <View style={styles.deliveryToTitleWrapStyle}>
          <Text style={{ ...Fonts.blackColor17Medium }}>Delivery to</Text>
          <Text
            style={{ ...Fonts.blueColor17Medium }}
            onPress={() => navigation.push("AddNewDeliveryAddress")}
          >
            Add New Address
          </Text>
        </View>
        <View style={styles.deliveryInfoWrapStyle}>
          <Image
            source={require("../../assets/images/restaurant_location.jpg")}
            style={{ width: 120.0, height: 120.0 }}
          />
          <View
            style={{
              marginVertical: Sizes.fixPadding,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="location-on"
                color={Colors.blackColor}
                size={20}
                onPress={() => navigation.pop()}
                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 2.0,
                  ...Fonts.blackColor16Medium,
                }}
              >
                {userAddress}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="person"
                color={Colors.blackColor}
                size={20}
                onPress={() => navigation.pop()}
                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 2.0,
                  ...Fonts.blackColor14Regular,
                }}
              >
                {username}
              </Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="phone"
                color={Colors.blackColor}
                size={20}
                onPress={() => navigation.pop()}
                style={{ marginLeft: Sizes.fixPadding * 2.0 }}
              />
              <Text
                style={{
                  marginLeft: Sizes.fixPadding - 2.0,
                  ...Fonts.blackColor14Regular,
                }}
              >
                {phoneNumber}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  function header() {
    return (
      <View
        style={{
          marginTop: Sizes.fixPadding,
          marginBottom: Sizes.fixPadding + 5.0,
        }}
      >
        <MaterialIcons
          name="arrow-back"
          color={Colors.blackColor}
          size={24}
          onPress={() => navigation.pop()}
          style={{ marginLeft: Sizes.fixPadding * 2.0 }}
        />
        <View style={styles.confirmOrderTitleWithIdWrapStyle}>
          <Text style={{ ...Fonts.blackColor22Medium }}>Confirm Order</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}></View>
        </View>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  confirmButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding - 5.0,
    paddingVertical: Sizes.fixPadding + 5.0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: Sizes.fixPadding - 5.0,
    marginHorizontal: Sizes.fixPadding,
    marginVertical: Sizes.fixPadding,
  },
  dialogWrapStyle: {
    borderRadius: Sizes.fixPadding,
    width: width - 150,
    backgroundColor: Colors.whiteColor,
    paddingTop: Sizes.fixPadding,
    alignItems: "center",
    paddingBottom: Sizes.fixPadding * 4.0,
  },
  successIconWrapStyle: {
    backgroundColor: Colors.whiteColor,
    borderColor: Colors.primaryColor,
    borderWidth: 1.5,
    width: 70.0,
    height: 70.0,
    borderRadius: 35.0,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Sizes.fixPadding + 5.0,
  },
  paymentMethodWrapStyle: {
    borderWidth: 1.0,
    marginTop: Sizes.fixPadding * 2.0,
    marginBottom: Sizes.fixPadding,
    backgroundColor: Colors.whiteColor,
    borderRadius: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: Sizes.fixPadding + 5.0,
    alignItems: "center",
    paddingLeft: Sizes.fixPadding,
    paddingRight: Sizes.fixPadding * 4.0,
    marginRight: Sizes.fixPadding * 2.0,
  },
  paymentMethodSelectorStyle: {
    position: "absolute",
    right: 0.0,
    top: 0.0,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingTop: Sizes.fixPadding - 2.0,
    paddingBottom: Sizes.fixPadding,
    paddingRight: Sizes.fixPadding + 2.0,
    paddingLeft: Sizes.fixPadding - 5.0,
    borderTopRightRadius: Sizes.fixPadding,
    borderBottomLeftRadius: Sizes.fixPadding + 20.0,
  },
  addVoucherInfoWrapStyle: {
    marginHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: Sizes.fixPadding + 5.0,
  },
  applyButtonStyle: {
    backgroundColor: Colors.primaryColor,
    borderRadius: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 7.0,
    alignItems: "center",
    marginLeft: Sizes.fixPadding + 5.0,
  },
  deliveryTimeWrapStyle: {
    backgroundColor: Colors.bodyBackColor,
    padding: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    marginTop: Sizes.fixPadding - 5.0,
  },
  deliveryToTitleWrapStyle: {
    marginBottom: Sizes.fixPadding,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  deliveryInfoWrapStyle: {
    backgroundColor: Colors.whiteColor,
    elevation: 3.0,
    borderColor: "#E0E0E0",
    borderWidth: 1.0,
    flexDirection: "row",
    padding: Sizes.fixPadding,
    borderRadius: Sizes.fixPadding - 5.0,
  },
  confirmOrderTitleWithIdWrapStyle: {
    marginTop: Sizes.fixPadding + 5.0,
    marginHorizontal: Sizes.fixPadding,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  noteTextFieldStyle: {
    marginVertical: Sizes.fixPadding,
    paddingVertical: Sizes.fixPadding,
    paddingHorizontal: Sizes.fixPadding + 5.0,
    ...Fonts.blackColor15Regular,
    marginHorizontal: Sizes.fixPadding,
    backgroundColor: Colors.bodyBackColor,
  },
});

export default ConfirmOrderScreen;
