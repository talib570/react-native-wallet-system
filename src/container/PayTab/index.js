import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Image,
  StatusBar,
  Text,
  View,
  ActivityIndicator,
  BackHandler,
} from "react-native";
import { BarCodeScanner } from "expo-barcode-scanner";
import { Logo } from "../../component";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import axios from "axios";
import { Store } from "../../context/store";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

const PayTab = ({ navigation }) => {
  const isFocused = useIsFocused();

  const [contextState, setContextState] = useState(null);

  const state = useSelector((state) => state.root);
  const { USERDATA, QRCODE_PERMISSION } = state;

  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    setContextState(USERDATA);

    console.log("QRCODE_PERMISSION", QRCODE_PERMISSION);

    setHasPermission(QRCODE_PERMISSION);

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () => (
      BackHandler.removeEventListener("hardwareBackPress", backAction),
      setScanned(false)
    );
  }, [isFocused]);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  const handleBarCodeScanned = async ({ data }) => {
    // setScanned(true);

    console.log("data", data.slice(0, 12), "  ", data.slice(12));
    var qr = data.slice(0, 12);
    var amount = data.slice(12);

    try {
      const res = await axios.post(
        url + "api/qr/scanning",
        {
          qr_code: qr,
        },
        {
          headers: {
            Authorization: "Bearer " + contextState.user_data.token,
          },
        }
      );

      console.log("res", res.data);

      res.data.status == 200
        ? navigation.navigate("PaymentScreen", {
            data: {
              name: `${res.data.data.first_name} ${res.data.data.last_name}`,
              phoneNumber: res.data.data.phoneNumber,
              amount: amount,
            },
            token: contextState.user_data.token,
          })
        : alert(res.data.message);
    } catch (error) {
      console.log("error", error);
      // setScanned(false);
    }

    // console.log("Read this data ",data)
    // var sendToUserData = await UserAPI.getUserData(data)

    // console.log("Read this sendto data ",sendToUserData)
    // if(sendToUserData && sendToUserData != null && sendToUserData.firstName){
    //   // let userData = {
    //   userID : data,
    //   userData : sendToUserData
    // }
    // console.log("UserData: ",userData)
    // setScanned(false)
    // let userData = {
    //   id: "0",
    //   name: "Chris",
    //   img: require("../../../assets/images/avatar1.png"),
    //   date: "clothes",
    //   amount: "- FCFA 7.99",
    // };
    // alert("Scanned Data for User with user id" data)
    // navigation.navigate("PaymentScreen", { data: userData });
    // } else{
    //   alert(Translator.getString('invalidQRCodeLabel'))
    //   // setScanned(false)
    // }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return contextState == null ? (
    <ActivityIndicator
      size="large"
      color="rgb(66, 33, 64)"
      style={{ alignSelf: "center", marginTop: "10%" }}
    />
  ) : (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeTypes={[BarCodeScanner.Constants.BarCodeType.qr]}
        style={[StyleSheet.absoluteFillObject]}
      >
        <Logo
          imgStyle={{ width: 250, height: 70 }}
          logoStyle={{
            width: WIDTH,
            height: "15%",
            backgroundColor: color.DARK_APP,
            borderRadius: 0,
            alignSelf: "center",
          }}
        />
        <Image
          style={styles.qr}
          source={require("../../../assets/images/qr2.png")}
          resizeMode="stretch"
        />
        <View
          style={{
            position: "absolute",
            bottom: 20,
            width: WIDTH,
            height: "15%",
            backgroundColor: color.DARK_APP,
          }}
        />
      </BarCodeScanner>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.DARK_APP,
    height: HEIGHT * 1.0585,
    width: WIDTH,
  },

  qr: {
    width: "95%",
    height: "65%",
    // marginTop: "15%",
    resizeMode: "stretch",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PayTab;
