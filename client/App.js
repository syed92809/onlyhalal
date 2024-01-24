import React from 'react'
import { NavigationContainer } from '@react-navigation/native';
import { TransitionPresets, createStackNavigator } from '@react-navigation/stack';
import { LogBox } from 'react-native';
import BottomTabBarScreen from "./components/bottomTabBarScreen";
import LoadingScreen from "./components/loadingScreen";
import AddNewDeliveryAddressScreen from "./screens/addNewDeliveryAddress/addNewDeliveryAddressScreen";
import AddressScreen from "./screens/address/addressScreen";
import RegisterScreen from "./screens/auth/registerScreen";
import SigninScreen from "./screens/auth/signinScreen";
import login from "./screens/auth/login";
import forgotPassword from "./screens/auth/forgot_password_screen";
import VerificationScreen from "./screens/auth/verificationScreen";
import ConfirmOrderScreen from "./screens/confirmOrder/confirmOrderScreen";
import EditProfileScreen from "./screens/editProfile/editProfileScreen";
import NotificationsScreen from "./screens/notifications/notificationsScreen";
import OnboardingScreen from "./screens/onboarding/onboardingScreen";
import OrderInformationScreen from "./screens/orderInformation/orderInformationScreen";
import PaymentMethodsScreen from "./screens/paymentMethods/paymentMethodsScreen";
import RatingScreen from "./screens/rating/ratingScreen";
import RestaurantDetailScreen from "./screens/restaurantDetail/restaurantDetailScreen";
import RestaurantsListScreen from "./screens/restaurantsList/restaurantsListScreen";
import SearchScreen from "./screens/search/searchScreen";
import SplashScreen from "./screens/splashScreen";
import TrackOrderScreen from "./screens/trackOrder/trackOrderScreen";
import Toast from 'react-native-toast-message'; 


LogBox.ignoreAllLogs();

const Stack = createStackNavigator();

const App = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        {/* <Stack.Screen name="Loading" component={LoadingScreen} />
        <Stack.Screen name="Splash" component={SplashScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} /> */}
        <Stack.Screen name="login" component={login} options={{ ...TransitionPresets.DefaultTransition }} />
        <Stack.Screen name="BottomTabBar" component={BottomTabBarScreen} options={{ ...TransitionPresets.DefaultTransition }} />
        {/* <Stack.Screen name="Signin" component={SigninScreen} options={{ ...TransitionPresets.DefaultTransition }} /> 
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Verification" component={VerificationScreen} />
        <Stack.Screen name="Search" component={SearchScreen} />
        <Stack.Screen name="RestaurantsList" component={RestaurantsListScreen} />
        <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
        <Stack.Screen name="ConfirmOrder" component={ConfirmOrderScreen} />
        <Stack.Screen name="TrackOrder" component={TrackOrderScreen} />
        <Stack.Screen name="OrderInformation" component={OrderInformationScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="Address" component={AddressScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="forgot_password_screen" component={forgotPassword} /> */}
        <Stack.Screen name="AddNewDeliveryAddress" component={AddNewDeliveryAddressScreen} />
      </Stack.Navigator>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </NavigationContainer>
  );
}

export default App;