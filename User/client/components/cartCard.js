import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";

const CartCard = ({ order }) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardBody}>
        <Image
          source={{
            uri: `http://192.168.1.13:4000/uploads/${order.item.image}`,
          }}
          style={styles.image}
        />
        <View style={styles.detailsContainer}>
          <View style={styles.textRow}>
            <Text style={styles.title}>{order.item.food_name}</Text>
            <Text style={styles.price}>${order.total}</Text>
          </View>
          <Text style={styles.description}>{order.item.category}</Text>
          <Text style={styles.description}>
            x
            {
              (order.total / order.item.price)
                .toFixed(0)
                .toString()
                .split(".")[0]
            }
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    height: 100,
    borderRadius: 10,
    overflow: "hidden",
    padding: 10,
    marginBottom: 14,
    // fontFamily: "Poppins",
  },
  cardBody: {
    flexDirection: "row",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  detailsContainer: {
    flex: 1,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
  },
  description: {
    fontSize: 14,
    color: "#707070",
    marginVertical: 2,
  },
  textRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  price: {
    fontSize: 18,
    color: "#FFA500",
    position: "absolute",
    right: -4,
  },
});

export default CartCard;
