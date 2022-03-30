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
import { useIsFocused } from "@react-navigation/native";

const PaymentScreen = ({ navigation, route }) => {
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  const [contact, setContact] = useState(0);
  const [name, setName] = useState("");
  const [inputType, setInputType] = useState("amount");

  //   const [key, setKey] = useState(data.amount);
  const [key, setKey] = useState(0);
  const [locale, setLang] = useState("");
  Translator.default(locale, true);

  useEffect(() => {
    if (route.params) {
      const { data, token } = route.params;
      console.log("data from prev screen in PAYWITHESCROW", data, token);
      setContact(data.phoneNumber);
      setName(data.name);
    }

    console.log("inputType", inputType);

    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale, contact, isFocused, inputType]);

  const onPressKey = (text) => {
    if (inputType == "amount") {
      if (text !== "." && text !== "+" && isNaN(text)) {
        // not a valid number
        setKey((prevState) => prevState.substring(0, prevState.length - 1));
        return;
      } else {
        setKey((prevState) => (prevState === 0 ? text : prevState + text));
      }
    } else {
      {
        if (text !== "." && text !== "+" && isNaN(text)) {
          // not a valid number
          setContact((prevState) =>
            prevState.substring(0, prevState.length - 1)
          );
          return;
        } else {
          setContact((prevState) =>
            prevState === 0 ? text : prevState + text
          );
        }
      }
    }
  };

  const onPressNext = async () => {
    if (key !== "" && parseFloat(key) > 0) {
      try {
        const res = await axios.post(
          url + "api/transfer/agent/user",
          {
            amount: key,
            receiver_phone: contact.replace(/\s/g, ""),
          },
          {
            headers: {
              Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
            },
          }
        );
        console.log("res", res.data);

        const data = {
          name: name,
          phoneNumber: contact,
          amount: key,
        };

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
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );
      console.log("res REFRESHDATA", res.data.data);
      currentUser.firstName = res.data.first_name;
      currentUser.lastName = res.data.last_name;
      currentUser.profileImg = {
        uri:
          res.data.data.user_data.image != null
            ? `${url}${res.data.data.user_data.image}`
            : "https://picsum.photos/seed/picsum/200/300",
      };
      currentUser.wallet = {
        balance: res.data.data.remaining_balance,
        currency: USERDATA.wallet.currency,
      };
      currentUser.user_data = USERDATA.user_data;

      // console.log(
      //   "res REFRESHDATA",
      //   res.data.data,
      //   JSON.stringify(USERDATA, {}, 2) +
      //     "==================" +
      //     JSON.stringify(currentUser, {}, 2)
      // );

      dispatch(updateData(currentUser));
    } catch (error) {
      console.log("err in refresh data", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 2, backgroundColor: color.WHITE }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: "2%",
          paddingLeft: "5%",
        }}
      >
        <View>
          <GoBack size={30} clr={color.DARK_APP} />
        </View>

        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ height: "80%", width: "50%", marginRight: "-25%" }}
          resizeMode="contain"
        />

        <RoundCornerButton
          title="Search Contact"
          onPress={() => navigation.navigate("EscrowSearchContact")}
          btnTextStyle={{
            fontSize: 12,
            paddingHorizontal: "2%",
          }}
          btnStyle={{
            // width: WIDTH / 1.3,
            height: 30,
            marginRight: "1%",
            alignSelf: "center",
            marginTop: "2%",
            backgroundColor: color.LT_APP,
          }}
        />
      </View>

      {/* <GoBack top="3%" left="6%" size={25} clr={color.DARK_APP} /> */}
      <View
        style={{
          flex: 1 / 2.5,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Text>{data.data.img}</Text> */}
        {/* <Image
          source={require("../../../assets/images/avatar5.png")}
          style={{ height: 40, width: 40, borderRadius: 10 }}
        /> */}
        <InputField
          placeholder={"Enter Amount"}
          value={USERDATA.wallet.currency + " " + key}
          inputStyle={styles.input}
          editable={true}
          onFocus={() => setInputType("amount")}
          onBlur={() => setInputType("phone")}
          showSoftInputOnFocus={false}
        />

        <InputField
          placeholder={"Enter Phone No."}
          value={contact}
          inputStyle={styles.input2}
          editable={true}
          onFocus={() => setInputType("phone")}
          onBlur={() => setInputType("amount")}
          showSoftInputOnFocus={false}
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
        <Keyboard onPress={onPressKey} myKeys={true} />

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
              navigation.navigate("SendWithEscrow", { key, contact, name })
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
  input2: {
    textAlign: "center",
    fontSize: 25,
    fontWeight: "500",
    paddingHorizontal: 10,
    backgroundColor: color.LT_APP,
    width: WIDTH / 1.2,
    borderRadius: 10,
  },
});

export default PaymentScreen;
