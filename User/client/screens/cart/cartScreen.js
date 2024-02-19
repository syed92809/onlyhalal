import React from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import image from "../../assets/images/products/lemon_juice.png";
import { Icon } from "react-native-paper";
import { useRoute } from "@react-navigation/native";
import CartCard from "../../components/cartCard";

// const orderList = [
//   {
//     id: 1,
//     item: {
//       category: "asdas",
//       description: "bla bla bla",
//       food_name: "sdad",
//       id: 5,
//       image: "image-1706634440962.png",
//       price: 50,
//       restaurant_id: null,
//     },
//     option: "Add Lemon",
//     size: {
//       price: 0.5,
//       size: "M",
//     },
//     total: 50.5,
//   },
//   {
//     id: 2,
//     item: {
//       category: "asdas",
//       description: "bla bla bla",
//       food_name: "sdad",
//       id: 5,
//       image: "image-1706634440962.png",
//       price: 50,
//       restaurant_id: null,
//     },
//     option: "Add Lemon",
//     size: {
//       price: 0.5,
//       size: "M",
//     },
//     total: 10.5,
//   },
// ];

const CartScreen = ({ navigation }) => {
  const route = useRoute();
  const orderList = route.params?.orderList;
  // console.log(orderList);
  return (
    <View style={styles.container}>
      <View style={styles.headerWrapStyle}>
        <Text style={{ ...Fonts.blackColor22Medium }}>Cart</Text>
      </View>
      <View style={styles.bodyContainer}>
        {orderList && orderList.length > 0 ? (
          <ScrollView>
            {orderList.map((order) => (
              <View key={order.id}>
                <CartCard order={order} />
              </View>
            ))}
          </ScrollView>
        ) : (
          <Text style={styles.Noitem}>No items in the cart</Text>
        )}
      </View>
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>
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
  }
});

export default CartScreen;