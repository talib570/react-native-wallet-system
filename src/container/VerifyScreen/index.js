import React, { useEffect, useState, useRef } from "react";
import * as Translator from "../../localization/";
import {
  StyleSheet,
  Image,
  StatusBar,
  ImageBackground,
  Text,
} from "react-native";
import { InputField, Logo, RoundCornerButton } from "../../component";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import { LinearGradient } from "expo-linear-gradient";
import {
  getAsyncStorage,
  keys,
  setAsyncStorage,
  clearSingleDataAsyncStorage,
} from "../../asyncStorage";
import { setCurrentUser, setCurrentUserID, currentUser } from "../../appData";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { getData } from "../../redux/actions";

const statusHeight = StatusBar.currentHeight;
//TODO: update locale from radio option and get from props here
//const locale = "en-US"
const VerifyScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const [locale, setLang] = useState("");
  const phoneNumber = route.params.phoneNumber;
  const OTP = route.params.otp;
  // console.log(verificationId,'id============',route)
  Translator.default(locale, true);
  useEffect(() => {
    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale]);

  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Function to be called when confirming the verification code that we received
  // from Firebase via SMS
  const confirmCode = async () => {
    let userID = "test";
    setCurrentUserID(userID);

    let userData = {
      phoneNumber: phoneNumber,
    };
    setCurrentUser(userData, userID);
    if (userData && userData != null && userData.firstName) {
      setAsyncStorage(keys.loggedInUserID, userID);
      navigation.replace("LocalAuth");
    } else if (!code && code == "") {
      setIsLoading(false);
      alert("Field Should be Not Empty!");
    } else {
      try {
        const res = await axios.post(url + "api/verify_otp", {
          otp: code,
          phone: phoneNumber,
        });
        console.log("res", res.data);

        currentUser.firstName = res.data.data.user_data.first_name;
        currentUser.lastName = res.data.data.user_data.last_name;
        currentUser.profileImg = {
          uri:
            res.data.data.user_data.image != null
              ? `${url}${res.data.data.user_data.image}`
              : "https://picsum.photos/seed/picsum/200/300",
        };
        currentUser.wallet = {
          balance: res.data.data.user_data.remaining_balance,
          currency: res.data.data.websettings[0].currency,
        };
        currentUser.user_data = res.data.data;

        if (res.data.status == 200) {
          res.data.data.user_data.first_name !== ""
            ? (dispatch(getData(currentUser)), navigation.replace("LocalAuth"))
            : navigation.replace("NewUser", { userData: res.data.data });
        }

        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
        alert("Something went Wrong.");
      }
    }
  };
  return (
    <>
      <StatusBar backgroundColor={color.DARK_PURPL} />
      <ImageBackground
        source={require("../../../assets/images/bgimg.png")}
        resizeMode="stretch"
        style={[
          styles.container,
          { alignSelf: "center", width: WIDTH, height: HEIGHT },
        ]}
      >
        <Logo
          imgStyle={{ width: 250, height: 100 }}
          logoStyle={{
            width: 250,
            height: 100,
            margin: 20,
            alignSelf: "center",
          }}
        />
        <InputField
          placeholder={Translator.getString("verifyPinLabel")}
          value={code}
          onChangeText={(input) => setCode(input)}
          keyboardType={"phone-pad"}
          inputStyle={{ backgroundColor: "transparent", width: "70%" }}
        />
        <RoundCornerButton
          title={Translator.getString("verifyLabel")}
          btnStyle={{ alignSelf: "center" }}
          onPress={() => (confirmCode(), setIsLoading(true))}
          // isLoading={isLoading}
        />

        {/* <RoundCornerButton
          title={OTP}
          btnStyle={{ alignSelf: "center" }}
          customStyle={{
            marginHorizontal: "3%",
            padding: "2%",
            height: 100,
          }}
        /> */}
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#380638",
    paddingTop: statusHeight == undefined ? 20 : statusHeight,
  },
  subContainer: {
    marginHorizontal: "10%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  txt: {
    color: color.WHITE,
    fontSize: 18,
    paddingLeft: 5,
    paddingBottom: 10,
  },
});

export default VerifyScreen;
