import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import * as Translator from "../../localization";
import { InputField, Keyboard, RoundCornerButton } from "../../component";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateData } from "../../redux/actions";
import { currentUser } from "../../appData";

const PaymentScreen = ({ navigation, route }) => {
  const { data, token } = route.params;

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  const [key, setKey] = useState(data.amount);
  const [locale, setLang] = useState("");
  Translator.default(locale, true);

  useEffect(() => {
    console.log("data from prev screen", USERDATA, data);

    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale]);

  const onPressKey = (text) => {
    if (text !== "." && isNaN(text)) {
      // not a valid number
      setKey((prevState) => prevState.substring(0, prevState.length - 1));
      return;
    } else {
      setKey((prevState) => (prevState === 0 ? text : prevState + text));
    }
  };

  const onPressNext = async () => {
    if (key !== "" && parseFloat(key) > 0) {
      try {
        if (data.phoneNumber.charAt(0) === "0") {
          const slicedNumber = data.phoneNumber.slice(1);
          var phoneCountryCode = "+92" + slicedNumber;
        }
        const res = await axios.post(
          url + "api/request/money",
          {
            amount: key,
            receiver_phone: data.phoneNumber.replace(/\s/g, ""),
          },
          {
            headers: {
              Authorization: "Bearer " + token,
            },
          }
        );
        console.log("res", res.data);

        res.data.status == 200
          ? (Alert.alert(
              "Alert",
              res.data.message,
              [
                {
                  text: "OK",
                  onPress: () =>
                    navigation.navigate("HomeTab", { screen: "Home" }),
                },
              ],
              { cancelable: false }
            ),
            refreshData())
          : alert(res.data.message);
      } catch (error) {
        console.log("err", error);
      }
    } else {
      alert("Please Enter A Valid Amount");
    }
  };

  const refreshData = async () => {
    try {
      const res = await axios.post(
        url + "api/get/userdata",
        {},
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log("res REFRESHDATA", res.data.data);
      currentUser.firstName = USERDATA.first_name;
      currentUser.lastName = USERDATA.last_name;
      currentUser.profileImg = {
        uri: "https://picsum.photos/seed/picsum/200/300",
      };
      currentUser.wallet = {
        balance: res.data.data.remaining_balance,
        currency: USERDATA.wallet.currency,
      };
      currentUser.user_data = USERDATA.user_data;

      dispatch(updateData(currentUser));
    } catch (error) {
      console.log("err in refresh data", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 2, backgroundColor: color.WHITE }}>
      <View
        style={{ flex: 1 / 2, justifyContent: "center", alignItems: "center" }}
      >
        {/* <Text>{data.data.img}</Text> */}
        <Image
          source={require("../../../assets/images/avatar5.png")}
          style={{ height: 40, width: 40, borderRadius: 10 }}
        />
        <Text style={{ fontSize: 18 }}>Request money from {data.name}</Text>
        <InputField
          placeholder={"Enter Amount"}
          value={USERDATA.wallet.currency + " " + key}
          inputStyle={styles.input}
          editable={false}
        />
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: color.DARK_APP,
          position: "absolute",
          bottom: 1,
        }}
      >
        <Keyboard onPress={onPressKey} />
        <RoundCornerButton
          title={Translator.getString("sendLabel")}
          onPress={onPressNext}
          btnStyle={{
            width: WIDTH / 1.3,
            alignSelf: "center",
            marginTop: -10,
            backgroundColor: color.LT_APP,
          }}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "500",
    paddingHorizontal: 10,
    backgroundColor: color.LT_APP,
    width: WIDTH / 2,
    borderRadius: 10,
  },
});

export default PaymentScreen;
