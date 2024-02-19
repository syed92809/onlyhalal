import React, { useState, useEffect } from "react";
import { SafeAreaView, View, StatusBar, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import { MaterialIcons } from '@expo/vector-icons';
import { BottomSheet } from "@rneui/themed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Toast from 'react-native-toast-message';

const paymentMethodsList = [
    {
        id: '1',
        image: require('../../assets/images/payment/visa.png'),
        number: ' **** **** ****',
        expireYear: '2020'
    },
    {
        id: '2',
        image: require('../../assets/images/payment/master_card.png'),
        number: ' **** **** ****',
        expireYear: '2022'
    },
   
];

const cardTypesList = [
    {
        id: '1',
        image: require('../../assets/images/payment/visa.png'),
        type: 'Visa Card',
    },
    {
        id: '2',
        image: require('../../assets/images/payment/master_card.png'),
        type: 'Master Card',
    }
];

const PatymentMethodsScreen = ({ navigation }) => {

    const [state, setState] = useState({
        paymentMethodsData: paymentMethodsList,
        showCardTypesSheet: false,
        defaultCardType: cardTypesList[0].type,
        defaultCardImage: cardTypesList[0].image,
    })

    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [userId, setUserId] = useState(null);


    //getting logged in user Id
    useEffect(() => {
        AsyncStorage.getItem('userId')
            .then((storedUserId) => {
                if (storedUserId) {
                    setUserId(storedUserId);
                }
            })
            .catch((error) => {
                console.error('Error retrieving userId from AsyncStorage:', error);
            });
    }, []);


    //retrieve user cards information endpoint
    useEffect(() => {
        if (userId) {
            fetchUserCards();
        }
    }, [userId]);

    const fetchUserCards = async () => {
        try {
            if (!userId) {
                console.error('No userId available');
                return;
            }
            
            const response = await fetch(`http://10.0.2.2:4000/getUserCards?userId=${userId}`);
            const data = await response.json();
    
            if (data.success && data.cards) {
                const formattedCards = data.cards.map(card => ({
                    image: card.cardType === 'Visa Card' ? require('../../assets/images/payment/visa.png') : require('../../assets/images/payment/master_card.png'),
                    number: maskCardNumber(card.cardNumber), // Calling function to mask the card number
                    expireYear: card.expiryDate, 
                }));
                console.log(formattedCards)
    
                updateState({ paymentMethodsData: formattedCards });
            } else {
                console.error('Failed to fetch user cards:', data.message);
                show_error_message("Internal server error");
            }
        } catch (error) {
            console.error('Error fetching user cards:', error);
        }
    };

    // Function to mask the card number except for the last 4 digits
    const maskCardNumber = (cardNumber) => {
        const maskedNumber = cardNumber.slice(-4);
        return `**** **** **** ${maskedNumber}`;
    };

    const updateState = (data) => setState((state) => ({ ...state, ...data }))

    const {
        paymentMethodsData,
        showCardTypesSheet,
        defaultCardType,
        defaultCardImage,
    } = state;

    //Error toast
    const show_error_message = (message) => {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: message,
          autoHide: true,
          visibilityTime: 2000,
          bottomOffset: 50,
          position: "bottom"
        });
      };

    //Function for sending card information to endpoint
    const add_card_info = async () => {
        try {
            if (cardNumber === "" || expiryDate === "" || cvv === "") {
                show_error_message("Fill the required fields");
                return;
            }
            
            const response = await fetch('http://10.0.2.2:4000/addCard', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    cardNumber,
                    expiryDate,
                    cvv,
                    cardType: defaultCardType, 
                    userId,
                }),
            });
    
            const data = await response.json();
            if (data.success) {
                console.log('Card added successfully');
                // Handle successful response
            } else {
                console.error('Error adding card:', data.message);
                // Handle error response
            }
        } catch (error) {
            console.error('Network error:', error);
            // Handle network errors
        }
    };



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                {header()}
                <ScrollView
                    showsVerticalScrollIndicator={false}
                >
                    {paymentMethods()}
                    {addNewPaymentMethodInfo()}
                    {cardNumberTextField()}
                    {validThruAndCVVInfo()}
                    {completeButton()}
                </ScrollView>
            </View>
            {chooseCardTypeSheet()}
        </SafeAreaView>
    )


    function chooseCardTypeSheet() {
        return (
            <BottomSheet
                isVisible={showCardTypesSheet}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                onBackdropPress={() => { updateState({ showCardTypesSheet: false }) }}
            >
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ showCardTypesSheet: false })}
                    style={{ backgroundColor: 'white', paddingBottom: Sizes.fixPadding, paddingTop: Sizes.fixPadding + 5.0 }}
                >
                    <Text style={{ marginBottom: Sizes.fixPadding, textAlign: 'center', ...Fonts.blackColor19Medium }}>
                        Choose Card Type
                    </Text>
                    {cardTypes()}
                </TouchableOpacity>
            </BottomSheet>
        )
    }

    function cardTypes() {
        return (
            <>
                {
                    cardTypesList.map((item) => (
                        <View key={`${item.id}`}>
                            <TouchableOpacity
                                activeOpacity={0.9}
                                onPress={() => updateState({ defaultCardImage: item.image, defaultCardType: item.type, showCardTypesSheet: false })}
                                style={styles.cardTypesWrapStyle}
                            >
                                <Image
                                    source={item.image}
                                    style={{ width: 40.0, height: 40.0, }}
                                    resizeMode="contain"
                                />
                                <Text style={{ marginLeft: Sizes.fixPadding, ...Fonts.blackColor16Medium }}>
                                    {item.type}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    ))
                }
            </>
        )
    }

    function completeButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => add_card_info()}
                style={styles.completeButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Complete
                </Text>
            </TouchableOpacity>
        );
    }

    function validThruAndCVVInfo() {
        return (
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: Sizes.fixPadding + 5.0
            }}>
                <TextInput
                    placeholder="Valid Thru (MM/YY)"
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                    style={{
                        flex: 1,
                        ...styles.textFieldStyle,
                    }}
                    onChangeText={setExpiryDate}
                    value={expiryDate}
                />
                <TextInput
                    placeholder="CVV (000)"
                    placeholderTextColor={Colors.grayColor}
                    selectionColor={Colors.primaryColor}
                    keyboardType="numeric"
                    maxLength={3}
                    style={{
                        flex: 1,
                        ...styles.textFieldStyle,
                    }}
                    onChangeText={setCvv} 
                    value={cvv}
                />
            </View>
        )
    }

    function cardNumberTextField() {
        return (
            <TextInput
                keyboardType="numeric"
                placeholder="Card Number (0000 0000 0000 0000)"
                placeholderTextColor={Colors.grayColor}
                selectionColor={Colors.primaryColor}
                maxLength={16}
                style={styles.textFieldStyle}
                onChangeText={setCardNumber} 
                value={cardNumber}
            />
        )
    }

    function addNewPaymentMethodInfo() {
        return (
            <View style={{ marginTop: Sizes.fixPadding * 2.0, marginHorizontal: Sizes.fixPadding }}>
                <Text style={{ ...Fonts.blackColor22Medium }}>
                    Add New Payment Method
                </Text>
                <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={() => updateState({ showCardTypesSheet: true })}
                    style={styles.addNewPaymentMethodWrapStyle}
                >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image
                            source={defaultCardImage}
                            style={{ height: 50.0, width: 50.0, }}
                            resizeMode="contain"
                        />
                        <View style={{ marginLeft: Sizes.fixPadding }}>
                            <Text style={{ ...Fonts.blackColor17Medium }}>
                                {defaultCardType}
                            </Text>
                        </View>
                    </View>
                    <MaterialIcons
                        name="keyboard-arrow-down"
                        size={18}
                        color={Colors.grayColor}
                        style={{ marginRight: Sizes.fixPadding }}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    function paymentMethods() {
        return (
            <ScrollView style={styles.scrollView}>
            <View>
                {paymentMethodsData.map((item) => (
                    <View key={`${item.id}`}>
                        <View style={styles.paymentMethodWrapStyle}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image
                                    source={item.image}
                                    style={{ height: 50.0, width: 50.0, }}
                                    resizeMode="contain"
                                />
                                <View style={{ marginLeft: Sizes.fixPadding }}>
                                    <Text style={{ ...Fonts.blackColor17Medium }}>
                                        {item.number}
                                    </Text>
                                    <Text style={{ ...Fonts.grayColor16Medium }}>
                                        {item.expireYear}
                                    </Text>
                                </View>
                            </View>
                            <MaterialIcons
                                name="close"
                                size={18}
                                color={Colors.grayColor}
                                style={{ marginRight: Sizes.fixPadding }}
                                onPress={() => removePaymentMethod({ id: item.id })}
                            />
                        </View>
                    </View>
                ))
                }
            </View>
            </ScrollView>
        )
    }

    function removePaymentMethod({ id }) {
        let filterArray = paymentMethodsData.filter((val, i) => {
            if (val.id !== id) {
                return val;
            }
        })
        updateState({ paymentMethodsData: filterArray })
    }

    function header() {
        return (
            <View style={{ marginHorizontal: Sizes.fixPadding + 5.0, marginVertical: Sizes.fixPadding + 5.0 }}>
                <MaterialIcons name="arrow-back" size={24} color="black"
                    onPress={() => navigation.pop()}
                />
                <Text style={{ marginBottom: Sizes.fixPadding, marginTop: Sizes.fixPadding + 5.0, ...Fonts.blackColor22Medium }}>
                    Payment Methods
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    paymentMethodWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 3.0,
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
    },
    completeButtonStyle: {
        marginVertical: Sizes.fixPadding + 10.0,
        backgroundColor: Colors.primaryColor,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
    },
    textFieldStyle: {
        ...Fonts.blackColor16Medium,
        backgroundColor: Colors.whiteColor,
        marginHorizontal: Sizes.fixPadding,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        paddingHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 1.0,
        borderRadius: Sizes.fixPadding - 5.0
    },
    addNewPaymentMethodWrapStyle: {
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        borderColor: '#e0e0e0',
        borderWidth: 1.0,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding + 5.0,
        marginTop: Sizes.fixPadding * 2.0,
    },
    cardTypesWrapStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 8.0,
    },
    scrollView: {
        marginHorizontal: 10,
        height:150,
      },
})

export default PatymentMethodsScreen;