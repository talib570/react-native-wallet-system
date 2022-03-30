import React, { useEffect } from "react";
import { StyleSheet, BackHandler, Alert } from "react-native";
import * as LocalAuthentication from "expo-local-authentication";
import { LinearGradient } from "expo-linear-gradient";
import { getAsyncStorage, keys } from "../../asyncStorage";
import { useIsFocused } from "@react-navigation/native";
import BackgroundTimer from "react-native-background-timer";

const LocalAuthPin = ({ navigation }) => {
  const isFocused = useIsFocused();
  useEffect(() => {
    (async () => {
      const type = await LocalAuthentication.supportedAuthenticationTypesAsync();
      console.log(
        type,
        "=================================================   type"
      );
      if (type != []) {
        const save = await LocalAuthentication.isEnrolledAsync();
        console.log(
          save,
          "=================================================   save"
        );

        if (save == true) {
          const authenticate = await LocalAuthentication.authenticateAsync();

          console.log(
            authenticate,
            "================================================= authenticate"
          );
          if (authenticate.success) {
            console.log(
              authenticate.success,
              "================================================="
            );
            getAsyncStorage(keys.pin)
              .then((pin) =>
                // if (pin == null) {
                //   console.log("pin is null", pin);

                //   navigation.navigate("Pincode");
                // } else
                {
                  console.log(pin, "====ppppppppp");
                  if (pin != null) {
                    console.log("pin is not null", pin);

                    navigation.navigate("BottomTab");
                    // LocalAuthentication.cancelAuthenticate();
                  } else {
                    navigation.navigate("Pincode");
                    console.log("ELSE IS RUNNING", pin);
                    // LocalAuthentication.cancelAuthenticate();
                  }
                }
              )
              .catch((err) => {
                console.log(err);
              });
          } else if (authenticate.error == "lockout") {
            navigation.navigate("Pincode");
            console.log("IF ELSE IS RUNNING NAVIGATION TO PINCODE", pin);
          } else {
            // navigation.navigate("Login");
            backAction();
            console.log(
              "IF ELSE IS RUNNING NAVIGATION TO LOGIN with error",
              authenticate.error
            );

            // LocalAuthentication.cancelAuthenticate();
          }
        } else {
          navigation.navigate("Pincode");
        }
      } else {
        navigation.navigate("Pincode");
      }
    })();

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [navigation]);

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to Exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  return (
    <LinearGradient
      colors={["#2c1845", "#120324", "#0d011c"]}
      style={styles.container}
      start={[0, 0.9]}
      end={[0.9, 0.1]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default LocalAuthPin;
