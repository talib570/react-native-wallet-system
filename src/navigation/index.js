import React, { useRef, useState, useEffect } from "react";
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
  SearchContact,
  PaymentRequest,
  OnBoarding,
  Drawer,
  Options,
  PayWithEscrow,
  SendWithEscrow,
  MyEscrowAccount,
  EscrowSearchContact,
  PayManually,
} from "../container";
import * as Translator from "../localization/";
import { View } from "react-native";
import { color } from "../utility";
import BackgroundTimer from "react-native-background-timer";
import useAppState from "react-native-appstate-hook";

import {
  getAsyncStorage,
  keys,
  setAsyncStorage,
  clearSingleDataAsyncStorage,
} from "../asyncStorage";

import { useSelector, useDispatch } from "react-redux";
// import { updateData, isNew } from "../../redux/actions";

import { useIsFocused } from "@react-navigation/native";

const Stack = createStackNavigator();

function NavContainer() {
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;
  return (
    <View style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{ headerShown: false }}
          initialRouteName={USERDATA ? "BottomTab" : "Welcome"}
        >
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Verify" component={VerifyScreen} />
          <Stack.Screen name="NewUser" component={NewUser} />
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="LocalAuth" component={LocalAuthScreen} />
          <Stack.Screen name="Pincode" component={Pincode} />
          <Stack.Screen name="OnBoarding" component={OnBoarding} />
          <Stack.Screen name="BottomTab" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}

const HomeStack = createStackNavigator();

export function HomeStackScreen() {
  return (
    <HomeStack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Home"
    >
      <HomeStack.Screen name="Home" component={Home} />
      <HomeStack.Screen name="PaymentScreen" component={PaymentScreen} />
      <HomeStack.Screen name="PaymentDetails" component={PaymentDetails} />
      <HomeStack.Screen name="SearchContact" component={SearchContact} />
      <HomeStack.Screen name="PayManually" component={PayManually} />
      <HomeStack.Screen
        name="EscrowSearchContact"
        component={EscrowSearchContact}
      />
      <HomeStack.Screen name="Options" component={Options} />
      <HomeStack.Screen name="PayWithEscrow" component={PayWithEscrow} />
      <HomeStack.Screen name="SendWithEscrow" component={SendWithEscrow} />
      <HomeStack.Screen name="MyEscrowAccount" component={MyEscrowAccount} />
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
      <Request.Screen name="PaymentRequest" component={PaymentRequest} />
    </Request.Navigator>
  );
}

const BottomTab = createBottomTabNavigator();

function BottomTabNavigator(props) {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA, IS_NEW } = state;

  const [time, setTime] = useState(0);
  const [checkTime, setCheckTime] = useState(0);
  const [value, setValue] = useState(null);
  const [locale, setLang] = useState("");

  Translator.default(locale, true);

  useEffect(() => {
    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
    // let date = new Date();
    // isFocused == true &&
    //   (setTime(date.getSeconds()),
    //   setCheckTime(date.getSeconds()),
    //   BackgroundTimer.stopBackgroundTimer());
    // console.log("IS_NEW", IS_NEW);
    // return () => {
    //   let newDate = new Date();
    //   setTime(newDate.getSeconds());
    //   setCheckTime(newDate.getSeconds());
    // };
  }, [isFocused, time]);

  // const { appState } = useAppState({
  //   onChange: (newAppState) => (
  //     console.log("App state changed to ", newAppState),
  //     newAppState == "active" && BackgroundTimer.stopBackgroundTimer()
  //   ),
  //   onBackground: () =>
  //     BackgroundTimer.runBackgroundTimer(() => {
  //       console.log("tac");

  //       IS_NEW == false && props.navigation.navigate("Pincode");
  //     }, 1000),
  //   onForeground: () => (
  //     console.log("App went to Foreground"),
  //     IS_NEW == false && BackgroundTimer.stopBackgroundTimer()
  //   ),
  // });

  const onTouch = (e) => {
    let date = new Date(e.timeStamp);
    console.log("SECONDS ON TOUCH", date.getMinutes(), time);
    setTime(date.getMinutes());
    setCheckTime(date.getMinutes());
  };

  const onTouch2 = (e) => {
    let date = new Date(e.timeStamp);
    console.log("SECONDS ON TOUCH2", date.getMinutes(), time);
    setTime(date.getMinutes());
    setCheckTime(date.getMinutes());
  };

  setInterval(() => {
    let date = new Date();
    setCheckTime(date.getMinutes());
  }, 60000);

  const difference = checkTime - time;

  if (difference >= 2) {
    let newDate = new Date();
    setTime(newDate.getMinutes());
    setCheckTime(newDate.getMinutes());
    console.log(`CHT ${checkTime} T ${time} DIFFERENCE IS ${difference} >= 2`);
    IS_NEW == false && props.navigation.replace("LocalAuth");
  }

  // if (difference >= 0) {
  //   if (difference >= 30) {
  //     let newDate = new Date();
  //     setTime(newDate.getSeconds());
  //     setCheckTime(newDate.getSeconds());
  //     console.log(
  //       `CHT ${checkTime} T ${time} DIFFERENCE IS ${difference} >= 30`
  //     );
  //     IS_NEW == false && props.navigation.navigate("LocalAuth");
  //   }
  // } else {
  //   if (difference >= -30) {
  //     let newDate = new Date();
  //     setTime(newDate.getSeconds());
  //     setCheckTime(newDate.getSeconds());
  //     console.log(
  //       `CHT ${checkTime} T ${time} DIFFERENCE IS ${difference}  >= -30`
  //     );
  //     IS_NEW == false && props.navigation.navigate("LocalAuth");
  //   }
  // }

  return (
    <View
      style={{ flex: 1 }}
      onStartShouldSetResponder={(e) => onTouch2(e)}
      onMoveShouldSetResponder={(e) => onTouch(e)}
    >
      {isFocused && IS_NEW && (
        <View
          style={{
            flex: 1,
            position: "absolute",
            backgroundColor: "transparent",
            zIndex: 9999,
            height: "100%",
            width: "100%",
          }}
        >
          <OnBoarding />
        </View>
      )}

      <BottomTab.Navigator
        initialRouteName="HomeTab"
        tabBarOptions={{ activeTintColor: color.DARK_APP }}
      >
        <BottomTab.Screen
          name="HomeTab"
          component={Drawer}
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
    </View>
  );
}

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
