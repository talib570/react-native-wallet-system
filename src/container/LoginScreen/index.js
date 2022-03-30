import React, { useEffect, useState, useRef } from "react";
import * as Translator from "../../localization/";
import {
  StyleSheet,
  Image,
  StatusBar,
  View,
  ImageBackground,
  ActivityIndicator,
  Alert,
} from "react-native";
import { InputField, Logo, RoundCornerButton } from "../../component";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import { getAsyncStorage, keys } from "../../asyncStorage";
import Constants from "expo-constants";
import { defaultCountryCode } from "../../utility/constants";
import axios from "axios";
import { SvgUri } from "react-native-svg";
import { updateData } from "../../redux/actions";

import { useDispatch, useSelector } from "react-redux";

const statusHeight = StatusBar.currentHeight;
//TODO: update locale from radio option and get from props here
//const locale = "en-US"
const LoginScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  const [phone, setPhone] = useState("");
  const [locale, setLang] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  Translator.default(locale, true);

  useEffect(() => {
    getCountries();

    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale]);

  const getCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.eu/rest/v2/all");
      setCountryList(response.data);
    } catch (error) {
      console.log("error in country List", error);
    }
  };

  const onLoginPress = async () => {
    if (!phone && phone == "") {
      setIsLoading(false);
      alert("Field Should be Not Empty!");
    } else {
      try {
        const res = await axios.post(url + "api/otp_test", {
          phone,
        });

        console.log("res", res.data);

        res.data.status == 200
          ? navigation.navigate("Verify", {
              phoneNumber: phone,
              otp: res.data.message,
            })
          : alert(res.data.message);

        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        alert("Something went Wrong.");
        setIsLoading(false);
      }
    }
  };
  // // Function to be called when requesting for a verification code
  // const sendVerification = () => {
  //   const phoneProvider = new firebase.auth.PhoneAuthProvider();
  //   console.log(phoneProvider,'===============p',phoneProvider.isOAuthProvider)
  //   phoneProvider
  //     .verifyPhoneNumber(phone, recaptchaVerifier.current)
  //     .then(res => console.log(res,'=====rrrrrrrr'));
  //     // vid => navigation.navigate('Verify',{code: vid})
  // };

  const CountryFlag = (props) => {
    const { flag } = props;

    return (
      <SvgUri
        width={40}
        height={40}
        uri={flag}
        style={{ marginTop: "10%", marginLeft: "15%" }}
      />
    );
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
        {/* <LinearGradient
        // Background Linear Gradient
        colors={['#2c1845','#120324','#0d011c']}
        style={styles.container}
        start={[0,0.9]}
        end={[0.9,0.1]}
        > */}
        <Logo
          imgStyle={{ width: 250, height: 100 }}
          logoStyle={{
            width: 250,
            height: 100,
            margin: 20,
            alignSelf: "center",
          }}
        />

        {countryList.length > 0 ? (
          countryList.map((v, i) => {
            return phone.length >= 13 || phone.length == 0
              ? v.callingCodes.includes(
                  phone ? phone.slice(1, 3) : defaultCountryCode
                ) && (
                  <CountryFlag
                    flag={
                      v.flag ? v.flag : "https://restcountries.eu/data/cmr.svg"
                    }
                  />
                )
              : null;
          })
        ) : (
          <ActivityIndicator
            size="small"
            color="#fff"
            style={{
              marginLeft: "15%",
              marginTop: "10%",
              alignSelf: "flex-start",
            }}
          />
        )}

        <InputField
          placeholder={Translator.getString("mobileNumberLabel")}
          value={phone}
          onChangeText={(input) => setPhone(input)}
          keyboardType={"phone-pad"}
          inputStyle={{ backgroundColor: "transparent", width: "70%" }}
        />
        <RoundCornerButton
          title={Translator.getString("loginLabel")}
          btnStyle={{ alignSelf: "center" }}
          onPress={() => (setIsLoading(true), onLoginPress())}
          isLoading={isLoading}
        />
        {/* </LinearGradient> */}
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

export default LoginScreen;
