import React, { useState, useCallback, useEffect } from "react";
import { SafeAreaView, View, StatusBar, BackHandler, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Colors, Fonts, Sizes } from "../../constants/styles";
import IntlPhoneInput from 'react-native-intl-phone-input';
import { useFocusEffect } from "@react-navigation/native";
import { TextInput} from "react-native";
import Toast from 'react-native-toast-message';
import * as WebBrowser from "expo-web-browser";
import * as Facebook from 'expo-facebook';
import * as Google from "expo-auth-session/providers/google";
import AsyncStorage from "@react-native-async-storage/async-storage";
import login from "./login";


WebBrowser.maybeCompleteAuthSession()

const SigninScreen = ({ navigation }) => {
    const [state, setState] = useState({
      phoneNumber: '',
      backClickCount: 0
    });
  
    const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
    const { phoneNumber, backClickCount } = state;

    const check = (message) => {
        console.log("working")
      };

    //setting up facebook signin state
    async function loginWithFacebook() {
        try {
          await Facebook.initializeAsync({
            appId: '<APP_ID>',
          });
          const { type, token, expirationDate, permissions, declinedPermissions } =
            await Facebook.logInWithReadPermissionsAsync({
              permissions: ['public_profile'],
            });
          if (type === 'success') {
            // Get the user's name using Facebook's Graph API
            const response = await fetch(`https://graph.facebook.com/me?access_token=${token}`);
            Alert.alert('Logged in!', `Hi ${(await response.json()).name}!`);
          } else {
            // type === 'cancel'
          }
        } catch ({ message }) {
          alert(`Facebook Login Error: ${message}`);
        }
      }

  
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
  
    const validate_number = () => {
      if (phoneNumber === "") {
        show_error_message("Fill the required field");
      } else {
        // Handle validation logic
      }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
            <StatusBar backgroundColor={Colors.primaryColor} />
            <View style={{ flex: 1, }}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
                    {appLogo()}
                    {signinText()}
                    {mobileNumberTextField()}
                    {continueButton()}
                    {otpInfo()}
                    {gotoLoginText()}
                    {loginWithFacebookButton()}
                    {logionWithGoogleButton()}
                </ScrollView>
            </View>
            {
                backClickCount == 1
                    ?
                    <View style={[styles.animatedView]}>
                        <Text style={{ ...Fonts.whiteColor16Regular }}>
                            Press Back Once Again to Exit.
                        </Text>
                    </View>
                    :
                    null
            }
        </SafeAreaView>
    )

    function otpInfo() {
        return (
            <Text style={{
                ...Fonts.grayColor15Medium,
                textAlign: 'center',
                marginBottom: Sizes.fixPadding * 5.0,
            }}>
                We’ll send otp for verification
            </Text>
        )
    }

    function continueButton() {
        return (
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('Verification')}
                style={styles.continueButtonStyle}>
                <Text style={{ ...Fonts.whiteColor16Medium }}>
                    Continue
                </Text>
            </TouchableOpacity>
        )
    }

    function mobileNumberTextField() {
        return (
            <View style={styles.phoneNumberWrapStyle}>
                
                <Image
                    source={require('../../assets/images/slider/us_flag.png')}
                    style={{ width: 30.0, height: 20.0, marginRight: 5,marginLeft:5, alignContent:"center" }}
                />
                <Text style={{ ...Fonts.blackColor16Medium }}>+1</Text>
                <TextInput
                    style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}
                    placeholder="Phone Number"
                    keyboardType="phone-pad"
                    maxLength={10}
                    onChangeText={(phoneNumber) => updateState({ phoneNumber: phoneNumber })}
                />
            </View>
        );
    }
    

    function logionWithGoogleButton() {
        return (
          <TouchableOpacity activeOpacity={0.9} onPress={() => promptAsync()}>
            <View style={styles.loginWithGoogleButtonStyle}>
              <Image
                source={require('../../assets/images/google.png')}
                style={{ width: 30.0, height: 30.0, }}
              />
              <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                Log in with Google
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    };

    function loginWithFacebookButton() {
        return (
            <TouchableOpacity activeOpacity={0.9} onPress={() => loginWithFacebook()}>
            <View style={styles.loginWithFacebookButtonStyle}>
                <Image
                    source={require('../../assets/images/facebook.png')}
                    style={{ width: 30.0, height: 30.0, }}
                />
                <Text style={{ ...Fonts.whiteColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
                    Log in with Facebook
                </Text>
            </View>
            </TouchableOpacity>
        )
    }

    function signinText() {
        return (
            <Text style={{
                textAlign: 'center',
                ...Fonts.grayColor17Medium
            }}>
                Signin with Phone Number
            </Text>
        )
    }


    function gotoLoginText() {
        return (
            
            <Text style={{
                textAlign: 'center',
                ...Fonts.grayColor17Medium,
                marginTop:-20,
                marginBottom:20
            }}>
            <TouchableOpacity
                activeOpacity={0.9}
                onPress={() => navigation.push('login')}
                >
               <Text>
               Already have an account? Login

               </Text>
                </TouchableOpacity>
            </Text>
        )
    }

    function appLogo() {
        return (
            <Image
                source={require('../../assets/images/login-icon.png')}
                style={styles.appLogoStyle}
                resizeMode="contain"
            />
        )
    }


const styles = StyleSheet.create({
    loginWithGoogleButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.whiteColor,
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0
    },
    loginWithFacebookButtonStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#3B5998',
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding + 2.0,
        marginBottom: Sizes.fixPadding * 2.5,
    },
    continueButtonStyle: {
        backgroundColor: Colors.primaryColor,
        paddingVertical: Sizes.fixPadding + 5.0,
        borderRadius: Sizes.fixPadding - 5.0,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: Sizes.fixPadding,
        marginBottom: Sizes.fixPadding - 5.0
    },
    phoneNumberWrapStyle: {
        backgroundColor: Colors.whiteColor,
        elevation: 2.0,
        flexDirection:"row",
        height:50,
        alignItems: 'center',
        borderRadius: Sizes.fixPadding - 5.0,
        marginHorizontal: Sizes.fixPadding,
        paddingVertical: Sizes.fixPadding - 5.0,
        paddingHorizontal: Sizes.fixPadding,
        marginTop: Sizes.fixPadding * 2.0,
        marginBottom: Sizes.fixPadding * 4.0,
    },
    appLogoStyle: {
        width: 200.0,
        height: 150.0,
        alignSelf: 'center',
        marginTop: Sizes.fixPadding * 4.0,
    },
    animatedView: {
        backgroundColor: Colors.blackColor,
        position: "absolute",
        bottom: 20,
        alignSelf: 'center',
        borderRadius: Sizes.fixPadding * 3.0,
        paddingHorizontal: Sizes.fixPadding * 2.0,
        paddingVertical: Sizes.fixPadding,
    },
})

export default SigninScreen;























// import React, { useState, useCallback, useEffect } from "react";
// import { SafeAreaView, View, StatusBar, BackHandler, Text, ScrollView, Image, TouchableOpacity, StyleSheet } from "react-native";
// import { Colors, Fonts, Sizes } from "../../constants/styles";
// import IntlPhoneInput from 'react-native-intl-phone-input';
// import { useFocusEffect } from "@react-navigation/native";
// import { TextInput} from "react-native";
// import Toast from 'react-native-toast-message';
// import * as WebBrowser from "expo-web-browser";
// import * as Google from "expo-auth-session/providers/google";
// import AsyncStorage from "@react-native-async-storage/async-storage";



// WebBrowser.maybeCompleteAuthSession()

// const SigninScreen = ({ navigation }) => {
//     const [state, setState] = useState({
//       phoneNumber: '',
//       backClickCount: 0
//     });
  
//     const updateState = (data) => setState((state) => ({ ...state, ...data }));
  
//     const { phoneNumber, backClickCount } = state;

//     const check = (message) => {
//         console.log("working")
//       };

//     //setting up google signin state
//     const [userInfo, setUserInfo] = useState(null);
//     const [request, response, promptAsync] = Google.useAuthRequest({
//       iosClientId: "320499277113-ill5er6m1g2tomc2u83j9kefab342f0k.apps.googleusercontent.com",
//       androidClientId: "320499277113-ou62rpeptium6dqq9od5lpge16mm2g2q.apps.googleusercontent.com"
//     });
  
//     React.useEffect(() => {
//         handleSignInwithGoogle();
//       }, [response]);

//     async function handleSignInwithGoogle(){
//         const user = await AsyncStorage.getItem("@user");
//         if (!user){
//             if(response?.type === "success"){
//                 await getUserInfo(response.authentication.accessToken);
//                 console.log(JSON.stringify(userInfo))
//             }
//         }else{
//             setUserInfo(JSON.parse(user))
//         }
//     }

//     const getUserInfo = async (token) => {
//         if (!token) return;
//         try {
//           const response = await fetch(
//             "https://www.googleapis.com/userinfo/v2/me",
//             {
//               headers: { Authorization: `Bearer ${token}` },
//             }
//           );
    
//           const user = await response.json();
//           await AsyncStorage.setItem("@user", JSON.stringify(user));
//           setUserInfo(user);
//         } catch (error) {
//           // Add your own error handler here
//         }
//       };


  
//     const show_error_message = (message) => {
//       Toast.show({
//         type: "error",
//         text1: "Error",
//         text2: message,
//         autoHide: true,
//         visibilityTime: 2000,
//         bottomOffset: 50,
//         position: "bottom"
//       });
//     };
  
//     const validate_number = () => {
//       if (phoneNumber === "") {
//         show_error_message("Fill the required field");
//       } else {
//         // Handle validation logic
//       }
//     };

//     return (
//         <SafeAreaView style={{ flex: 1, backgroundColor: Colors.bodyBackColor }}>
//             <StatusBar backgroundColor={Colors.primaryColor} />
//             <View style={{ flex: 1, }}>
//                 <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Sizes.fixPadding }}>
//                     {appLogo()}
//                     {signinText()}
//                     {mobileNumberTextField()}
//                     {continueButton()}
//                     {otpInfo()}
//                     {loginWithFacebookButton()}
//                     {logionWithGoogleButton()}
//                 </ScrollView>
//             </View>
//             {
//                 backClickCount == 1
//                     ?
//                     <View style={[styles.animatedView]}>
//                         <Text style={{ ...Fonts.whiteColor16Regular }}>
//                             Press Back Once Again to Exit.
//                         </Text>
//                     </View>
//                     :
//                     null
//             }
//         </SafeAreaView>
//     )

//     function otpInfo() {
//         return (
//             <Text style={{
//                 ...Fonts.grayColor15Medium,
//                 textAlign: 'center',
//                 marginBottom: Sizes.fixPadding * 5.0,
//             }}>
//                 We’ll send otp for verification
//             </Text>
//         )
//     }

//     function continueButton() {
//         return (
//             <TouchableOpacity
//                 activeOpacity={0.9}
//                 onPress={() => navigation.push('Verification')}
//                 style={styles.continueButtonStyle}>
//                 <Text style={{ ...Fonts.whiteColor16Medium }}>
//                     Continue
//                 </Text>
//             </TouchableOpacity>
//         )
//     }

//     function mobileNumberTextField() {
//         return (
//             <View style={styles.phoneNumberWrapStyle}>
                
//                 <Image
//                     source={require('../../assets/images/slider/us_flag.png')}
//                     style={{ width: 30.0, height: 20.0, marginRight: 5,marginLeft:5, alignContent:"center" }}
//                 />
//                 <Text style={{ ...Fonts.blackColor16Medium }}>+1</Text>
//                 <TextInput
//                     style={{ flex: 1, marginLeft: Sizes.fixPadding + 5.0, ...Fonts.blackColor16Medium }}
//                     placeholder="Phone Number"
//                     keyboardType="phone-pad"
//                     maxLength={10}
//                     onChangeText={(phoneNumber) => updateState({ phoneNumber: phoneNumber })}
//                 />
//             </View>
//         );
//     }
    

//     function logionWithGoogleButton() {
//         return (
//           <TouchableOpacity activeOpacity={0.9} onPress={() => promptAsync()}>
//             <View style={styles.loginWithGoogleButtonStyle}>
//               <Image
//                 source={require('../../assets/images/google.png')}
//                 style={{ width: 30.0, height: 30.0, }}
//               />
//               <Text style={{ ...Fonts.blackColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
//                 Log in with Google
//               </Text>
//             </View>
//           </TouchableOpacity>
//         );
//       }
//     };

//     function loginWithFacebookButton() {
//         return (
//             <View style={styles.loginWithFacebookButtonStyle}>
//                 <Image
//                     source={require('../../assets/images/facebook.png')}
//                     style={{ width: 30.0, height: 30.0, }}
//                 />
//                 <Text style={{ ...Fonts.whiteColor16Medium, marginLeft: Sizes.fixPadding * 2.0 }}>
//                     Log in with Facebook
//                 </Text>
//             </View>
//         )
//     }

//     function signinText() {
//         return (
//             <Text style={{
//                 textAlign: 'center',
//                 ...Fonts.grayColor17Medium
//             }}>
//                 Signin with Phone Number
//             </Text>
//         )
//     }

//     function appLogo() {
//         return (
//             <Image
//                 source={require('../../assets/images/login-icon.png')}
//                 style={styles.appLogoStyle}
//                 resizeMode="contain"
//             />
//         )
//     }


// const styles = StyleSheet.create({
//     loginWithGoogleButtonStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: Colors.whiteColor,
//         borderRadius: Sizes.fixPadding - 5.0,
//         marginHorizontal: Sizes.fixPadding,
//         paddingVertical: Sizes.fixPadding + 2.0
//     },
//     loginWithFacebookButtonStyle: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'center',
//         backgroundColor: '#3B5998',
//         borderRadius: Sizes.fixPadding - 5.0,
//         marginHorizontal: Sizes.fixPadding,
//         paddingVertical: Sizes.fixPadding + 2.0,
//         marginBottom: Sizes.fixPadding * 2.5,
//     },
//     continueButtonStyle: {
//         backgroundColor: Colors.primaryColor,
//         paddingVertical: Sizes.fixPadding + 5.0,
//         borderRadius: Sizes.fixPadding - 5.0,
//         alignItems: 'center',
//         justifyContent: 'center',
//         marginHorizontal: Sizes.fixPadding,
//         marginBottom: Sizes.fixPadding - 5.0
//     },
//     phoneNumberWrapStyle: {
//         backgroundColor: Colors.whiteColor,
//         elevation: 2.0,
//         flexDirection:"row",
//         height:50,
//         alignItems: 'center',
//         borderRadius: Sizes.fixPadding - 5.0,
//         marginHorizontal: Sizes.fixPadding,
//         paddingVertical: Sizes.fixPadding - 5.0,
//         paddingHorizontal: Sizes.fixPadding,
//         marginTop: Sizes.fixPadding * 2.0,
//         marginBottom: Sizes.fixPadding * 4.0,
//     },
//     appLogoStyle: {
//         width: 200.0,
//         height: 150.0,
//         alignSelf: 'center',
//         marginTop: Sizes.fixPadding * 4.0,
//     },
//     animatedView: {
//         backgroundColor: Colors.blackColor,
//         position: "absolute",
//         bottom: 20,
//         alignSelf: 'center',
//         borderRadius: Sizes.fixPadding * 3.0,
//         paddingHorizontal: Sizes.fixPadding * 2.0,
//         paddingVertical: Sizes.fixPadding,
//     },
// })

// export default SigninScreen;