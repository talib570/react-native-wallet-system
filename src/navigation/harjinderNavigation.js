import React, { useEffect, useState } from "react";
import { AntDesign, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import {
  LoginScreen,
  LocalAuthScreen,
  PaymentScreen,
  PaymentDetails,
  VerifyScreen,
  PayTab,
  WelcomeScreen,
  Home,
  GenerateQR,
  FeedbackScreen,
  RequestScreen,
  NewUser,
  Pincode,
  ReqVerifyScreen,
} from "../container";
import * as Translator from "../localization/";
import { View } from "react-native";
import { color } from "../utility";
import { getAsyncStorage, keys } from "../asyncStorage";
import {
  currentUser,
  isAppLoaded,
  isUserSelectedLanguageAvailable,
  setCurrentUser,
  setUserSelectedLanguageAvailable,
} from "../appData";
import { UserAPI } from "../network";

const Stack = createStackNavigator();
// const data =  buildUserData()
function NavContainer() {
  const [appLoad, setAppLoad] = useState(false);
  const [initRoute, setInitRoute] = useState(null);

  console.log("here");

  getAsyncStorage(keys.loggedInUserID)
    .then((loggedInUserID) => {
      console.log(loggedInUserID, "===idddd===");
      if (loggedInUserID) {
        UserAPI.getUserData("z4f5d497MIU0V4x4TJwQSyMQlTd2").then((userData) => {
          console.log(userData, "======");
          if (userData) {
            setCurrentUser(userData);
            setInitRoute("BottomTab");
            setAppLoad(true);
            console.log(appLoad, "===", userData);
            {
              appLoad && buildUserData();
            }
          } else {
            console.log("User data not found: ", userData);
          }
        });
      } else {
        console.log("Unable to find userID: ", loggedInUserID);
        getAsyncStorage(keys.lang)
          .then((language) => {
            console.log(language, "================");
            if (language) {
              Translator.default(language, true);
              setUserSelectedLanguageAvailable(true);
              console.log(
                "setUserSelectedLanguageAvailable",
                setUserSelectedLanguageAvailable(true)
              );
              setInitRoute("Login");
              setAppLoad(true);
              console.log(appLoad, "===");
            } else {
              console.log("Unable to find language: ", language);
              setInitRoute("Welcome");
              setAppLoad(true);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    })
    .catch((error) => {
      console.log(error);
    });

  console.log(appLoad, "=");

  const HomeStack = createStackNavigator();

  function HomeStackScreen() {
    return (
      <HomeStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Home"
      >
        <HomeStack.Screen name="Home" component={Home} />
        <HomeStack.Screen name="PaymentScreen" component={PaymentScreen} />
        <HomeStack.Screen name="PaymentDetails" component={PaymentDetails} />
      </HomeStack.Navigator>
    );
  }

  const Request = createStackNavigator();

  function RequestStackScreen() {
    return (
      <Request.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="RequestScreen"
      >
        <Request.Screen name="RequestScreen" component={RequestScreen} />
        <Request.Screen name="ReqVerifyScreen" component={ReqVerifyScreen} />
      </Request.Navigator>
    );
  }

  const BottomTab = createBottomTabNavigator();
  function BottomTabNavigator() {
    return (
      <BottomTab.Navigator
        initialRouteName="HomeTab"
        tabBarOptions={{ activeTintColor: color.DARK_APP }}
      >
        <BottomTab.Screen
          name="HomeTab"
          component={HomeStackScreen}
          options={{
            tabBarLabel: Translator.getString("homeLabel"),
            tabBarIcon: ({ color, size }) => (
              <AntDesign name="home" color={color} size={size} />
            ),
          }}
        />
        <BottomTab.Screen
          name="GenerateBar Code"
          component={GenerateQR}
          options={{
            tabBarLabel: Translator.getString("generatecodeLabel"),
            tabBarIcon: ({ color }) => (
              <AntDesign name="qrcode" color={color} size={25} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Scan Pay"
          component={PayTab}
          options={{
            tabBarLabel: Translator.getString("scanpayLabel"),
            tabBarIcon: ({ color }) => (
              <View
                style={{
                  backgroundColor: "#db7140",
                  borderRadius: 15,
                  padding: 5,
                  marginBottom: 10,
                }}
              >
                <AntDesign name="scan1" color="white" size={35} />
              </View>
            ),
          }}
        />
        <BottomTab.Screen
          name="Request Accept"
          component={RequestStackScreen}
          options={{
            tabBarLabel:
              Translator.getString("requestLabel") +
              " " +
              Translator.getString("acceptLabel"),
            tabBarIcon: ({ color }) => (
              <FontAwesome5 name="exchange-alt" color={color} size={25} />
            ),
          }}
        />
        <BottomTab.Screen
          name="Feedback"
          component={FeedbackScreen}
          options={{
            tabBarLabel: Translator.getString("contactUsLabel"),
            tabBarIcon: ({ color }) => (
              <MaterialIcons name="contact-mail" color={color} size={25} />
            ),
          }}
        />
      </BottomTab.Navigator>
    );
  }

  return (
    appLoad && (
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={initRoute}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="NewUser" component={NewUser} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LocalAuth" component={LocalAuthScreen} />
          <Stack.Screen name="Pincode" component={Pincode} />
          <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  );
}
// const buildUserData = async() => {
//   console.log('here')
//   await getAsyncStorage(keys.loggedInUserID).then(async(loggedInUserID) => {
//       if (loggedInUserID) {
//           var userData = await UserAPI.getUserData(isUserLoggedIn);
//           if(userData){
//               setCurrentUser(userData)
//           } else{
//               console.log("User data not found: " , userData )
//           }
//       } else {
//            console.log("Unable to find userID: ", loggedInUserID);
//           }
//   }).catch(error => {
//       console.log(error);
//   })

//   await getAsyncStorage(keys.lang).then(async(language) => {
//       if (language) {
//           await Translator.default(language, true)
//           await setUserSelectedLanguageAvailable(true);
//           console.log("setUserSelectedLanguageAvailable")
//       } else {
//           console.log("Unable to find language: ", language);
//       }
//   }).catch(error => {
//       console.log(error);
//   })
//   // setAppLoaded(true);
//   return true;

// }
export default NavContainer;

// import React, { useEffect, useState } from "react";
// import { AntDesign, Feather, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons, SimpleLineIcons } from '@expo/vector-icons';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import {
//   LoginScreen,
//   LocalAuthScreen,
//   PaymentScreen,
//   PaymentDetails,
//   VerifyScreen,
//   PayTab,
//   WelcomeScreen,
//   Home,
//   GenerateQR,
//   FeedbackScreen,
//   RequestScreen,
//   NewUser
// } from "../container";
// import * as Translator from '../localization/';
// import { View } from "react-native";
// import { color } from "../utility";
// import { getAsyncStorage, keys } from "../asyncStorage";

// const Stack = createStackNavigator();

// function NavContainer() {
//   const [locale, setLang] = useState('');
//   Translator.default(locale, true)
//   useEffect(() => {
//       getAsyncStorage(keys.lang).then(res => {
//           setLang(res);
//       }).catch(err => {
//       });
//   }, [locale]);
//   return (
//     <NavigationContainer>
//       <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="BottomTab">
//         {/* <Stack.Screen name="Login" component={LoginScreen} />
//         <Stack.Screen name="Verify" component={VerifyScreen} />
//         <Stack.Screen name="NewUser" component={NewUser} />
//         <Stack.Screen name="Welcome" component={WelcomeScreen} />
//         <Stack.Screen name="LocalAuth" component={LocalAuthScreen} /> */}
//         <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// };

// const HomeStack = createStackNavigator();

// function HomeStackScreen() {
//   return (
//     <HomeStack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
//       <HomeStack.Screen name="Home" component={Home} />
//       <HomeStack.Screen name="PaymentScreen" component={PaymentScreen} />
//       <HomeStack.Screen name="PaymentDetails" component={PaymentDetails} />
//     </HomeStack.Navigator>
//   );
// };

// const BottomTab = createBottomTabNavigator();
// function BottomTabNavigator() {
//   return (
//     <BottomTab.Navigator
//       initialRouteName="GenerateBar Code"
//       tabBarOptions={{ activeTintColor: '#0384fc' }}
//     >
//       <BottomTab.Screen
//         name="GenerateBar Code"
//         component={GenerateQR}
//         options={{
//           tabBarLabel: 'EWALLET',
//           tabBarIcon: ({ color }) => (
//             <Ionicons name="ios-wallet" color={color} size={30} />
//           ),

//         }}
//       />
//       <BottomTab.Screen
//         name="HomeTab"
//         component={HomeStackScreen}
//         options={{
//           tabBarLabel: 'SEND',
//           tabBarIcon: ({ color, size }) => (
//             <Feather name="send" color={color} size={25} />
//           ),
//         }}
//       />
//       <BottomTab.Screen
//         name="Scan Pay"
//         component={PayTab}
//         options={{
//           // tabBarLabel: Translator.getString('scanpayLabel'),
//           // tabBarIcon: ({ color }) => (
//           //   <View style={{ backgroundColor: '#db7140', borderRadius: 15, padding: 5, marginBottom: 10 }}>
//           //     <AntDesign name="scan1" color='white' size={35} />
//           //   </View>
//           // ),
//           tabBarLabel: 'LOGOUT',
//           tabBarIcon: ({ color }) => (
//             <MaterialCommunityIcons name="logout" color={color} size={25} />
//           ),

//         }}
//       />
//       {/* <BottomTab.Screen
//         name="Request Accept"
//         component={RequestScreen}
//         options={{
//           tabBarLabel: Translator.getString('requestLabel')+' '+Translator.getString('acceptLabel'),
//           tabBarIcon: ({ color }) => (
//             <FontAwesome5 name="exchange-alt" color={color} size={25} />
//           ),
//         }}
//       />
//       <BottomTab.Screen
//         name="Feedback"
//         component={FeedbackScreen}
//         options={{
//           tabBarLabel: Translator.getString('contactUsLabel'),
//           tabBarIcon: ({ color }) => <MaterialIcons name="contact-mail" color={color} size={25} />,
//         }}
//       /> */}
//     </BottomTab.Navigator>
//   );
// }

// export default NavContainer;
