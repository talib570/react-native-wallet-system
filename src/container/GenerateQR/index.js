import { AntDesign } from "@expo/vector-icons";
import React, { useEffect, useRef, useState, useContext } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  PermissionsAndroid,
  BackHandler,
} from "react-native";
import QRCode from "react-native-qrcode-svg";
import { currentUserID } from "../../appData";
import { getAsyncStorage, keys } from "../../asyncStorage";
import { InputField, RoundCornerButton, GoBack } from "../../component";
import * as Translator from "../../localization/";
import { color, HEIGHT } from "../../utility";
import { getFormattedNumber } from "../../utility/styleHelper/appStyle";
let logo = require("../../../assets/icon1.png");
import { useIsFocused } from "@react-navigation/native";
import { Store } from "../../context/store";
import { useSelector, useDispatch } from "react-redux";
import { updateData } from "../../redux/actions";
// import { captureScreen } from "react-native-view-shot";
import Share from "react-native-share";

const GenerateQR = ({ navigation }) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  const { contextState, setContextState } = useContext(Store);

  const [amount, setAmount] = useState(0);
  const [imgUrl, setImgUrl] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const prevAmountRef = useRef();
  const qrCodeRef = useRef();

  useEffect(() => {
    prevAmountRef.current = amount;

    console.log("contextState AND redux IN Generate QR", qrCodeRef);

    // qrCodeRef.current && qrCodeRef.current.toDataURL(callback);

    setCurrentUser(USERDATA);

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [isFocused]);

  const backAction = () => {
    navigation.navigate("HomeTab", { screen: "Home" });
    console.log("NAVIGATING TO HOME");
    return true;
  };

  const prevAmount = prevAmountRef.current;
  const Decreament = () => {
    if (amount > 0) {
      setAmount(amount - 1);
    }
  };

  const img = async () => {
    await qrCodeRef.current.toDataURL(callback);
    return true;
  };
  const onShare = async () => {
    const res = await img();
    res && share();
  };

  const share = () => {
    const shareOptions = {
      title: "QRCode", //string
      message: "QRCode From PayVit", //string
      url: `data:image/png;base64,${imgUrl}`,
    };

    Share.open(shareOptions).catch((err) => console.log(err));
  };

  function callback(dataURL) {
    console.log(dataURL);
    setImgUrl(dataURL);
  }

  return currentUser == null ? (
    <ActivityIndicator
      size="large"
      color="rgb(66, 33, 64)"
      style={{ alignSelf: "center", marginTop: "10%" }}
    />
  ) : (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", backgroundColor: color.DARK_APP }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingVertical: "2%",
          paddingHorizontal: "5%",
        }}
      >
        <View>
          <GoBack size={30} clr={"#fff"} onPress={"Home"} />
        </View>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ height: "100%", width: "50%", marginRight: "-5%" }}
          resizeMode="contain"
        />

        <AntDesign
          name="sharealt"
          size={25}
          color={color.WHITE}
          style={{ paddingTop: "3%" }}
          onPress={onShare}
        />
      </View>

      <View style={styles.card}>
        <View
          style={
            ([styles.card],
            { paddingVertical: 0, paddingBottom: 20, flexDirection: "row" })
          }
        >
          <Image
            source={
              currentUser.profileImg.uri != undefined
                ? { uri: currentUser.profileImg.uri }
                : require("../../../assets/images/avatar1.png")
            }
            style={{ height: 40, width: 40 }}
          />
          <Text
            style={{
              fontWeight: "600",
              fontSize: 22,
              color: color.DARK_APP,
              paddingLeft: 20,
            }}
          >
            {(currentUser.user_data.user_data.first_name == ""
              ? currentUser.firstName
              : currentUser.user_data.user_data.first_name) +
              " " +
              (currentUser.user_data.user_data.last_name == ""
                ? currentUser.lastName
                : currentUser.user_data.user_data.last_name)}
          </Text>
        </View>
        <QRCode
          size={HEIGHT / 2.2}
          value={currentUser.user_data.user_data.qr_code + amount}
          logo={logo}
          logoSize={50}
          // color={color.DARK_APP}
          logoBackgroundColor={color.WHITE}
          color={"#000"}
          // logoBackgroundColor={"#fff"}
          getRef={qrCodeRef}
          // getBase64={qrCodeRef}
          // logoBorderRadius={10}
        />
        <View
          style={{
            flexDirection: "row",
            width: "70%",
            justifyContent: "center",
          }}
        >
          <RoundCornerButton
            title="+"
            onPress={() => setAmount(amount + 1)}
            btnStyle={{ backgroundColor: color.TRANSPARENT }}
            btnTextStyle={{
              color: color.DARK_APP,
              fontSize: 40,
              fontWeight: "100",
            }}
          />
          <Text
            style={{
              color: color.DARK_APP,
              fontSize: 30,
              fontWeight: "100",
              alignSelf: "center",
            }}
          >
            {currentUser.wallet.currency}
          </Text>
          <InputField
            value={`${amount}`}
            onChangeText={(input) => setAmount(input)}
            inputStyle={{
              alignSelf: "center",
              color: color.DARK_APP,
              fontSize: 35,
              // paddingHorizontal: 10,
              padding: 0,
              width: "50%",
              textAlign: "center",
            }}
          />
          <RoundCornerButton
            title="-"
            onPress={Decreament}
            btnStyle={{ backgroundColor: color.TRANSPARENT }}
            btnTextStyle={{
              color: color.DARK_APP,
              fontSize: 40,
              fontWeight: "100",
            }}
          />
        </View>
        <View style={[styles.card, { backgroundColor: color.DARK_APP }]}>
          <Text style={{ fontWeight: "600", fontSize: 22, color: color.WHITE }}>
            {Translator.getString("balanceLabel")}
          </Text>
          <Text style={{ fontWeight: "600", fontSize: 22, color: color.WHITE }}>
            {currentUser.wallet.currency +
              " " +
              getFormattedNumber(currentUser.wallet.balance)}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.WHITE,
    marginTop: 0,
    paddingVertical: 10,
    width: "90%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 15,
    shadowColor: "#fff",
    shadowOpacity: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
});

export default GenerateQR;
