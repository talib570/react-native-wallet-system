import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import * as Translator from "../../localization/";
import {
  InputField,
  Keyboard,
  RoundCornerButton,
  GoBack,
} from "../../component";
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
    console.log("data from prev screen", USERDATA);

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
        if (data.phoneNumber.replace(/\s/g, "").charAt(0) === "0") {
          const slicedNumber = data.phoneNumber.slice(1);
          var phoneCountryCode = "+237" + data.phoneNumber.replace(/\s/g, "");

          const res = await axios.post(
            url + "api/transfer/agent/user",
            {
              amount: key,
              receiver_phone: phoneCountryCode,
            },
            {
              headers: {
                Authorization: "Bearer " + token,
              },
            }
          );
          console.log("res", res.data);

          res.data.status == 200
            ? (navigation.navigate("PaymentDetails", {
                dataTobeShown: data,
                remaining: res.data.data.remaining_balance,
                amount: key,
              }),
              refreshData())
            : alert(res.data.message);
        }
        const res = await axios.post(
          url + "api/transfer/agent/user",
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
          ? (navigation.navigate("PaymentDetails", {
              dataTobeShown: data,
              remaining: res.data.data.remaining_balance,
              amount: key,
            }),
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
      currentUser.firstName = res.data.first_name;
      currentUser.lastName = res.data.last_name;
      currentUser.profileImg = {
        uri: "https://picsum.photos/seed/picsum/200/300",
      };
      currentUser.wallet = {
        balance: res.data.data.remaining_balance,
        currency: USERDATA.wallet.currency,
      };
      currentUser.user_data = USERDATA.user_data;

      console.log(
        "res REFRESHDATA",
        res.data.data,
        JSON.stringify(USERDATA, {}, 2) +
          "==================" +
          JSON.stringify(currentUser, {}, 2)
      );

      dispatch(updateData(currentUser));
    } catch (error) {
      console.log("err in refresh data", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 2, backgroundColor: color.WHITE }}>
      <GoBack top="3%" left="6%" size={25} clr={color.DARK_APP} />
      <View
        style={{ flex: 1 / 2, justifyContent: "center", alignItems: "center" }}
      >
        {/* <Text>{data.data.img}</Text> */}
        <Image
          source={require("../../../assets/images/avatar5.png")}
          style={{ height: 40, width: 40, borderRadius: 10 }}
        />
        <Text style={{ fontSize: 18 }}>
          {Translator.getString("sendMoneyLabel")} {data.name}
        </Text>
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

        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <RoundCornerButton
            title={Translator.getString("sendLabel")}
            onPress={onPressNext}
            btnStyle={{
              width: "30%",
              alignSelf: "center",
              marginTop: -10,
              backgroundColor: color.LT_APP,
            }}
          />
          <RoundCornerButton
            title={"Pay with Escrow"}
            onPress={() =>
              navigation.navigate("SendWithEscrow", {
                key,
                contact: data.phoneNumber,
                name: data.name,
              })
            }
            btnStyle={{
              width: "50%",
              alignSelf: "center",
              marginTop: -10,
              backgroundColor: color.LT_APP,
            }}
          />
        </View>
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
