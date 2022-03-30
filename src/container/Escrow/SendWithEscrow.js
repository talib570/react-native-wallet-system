import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
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
  const { params } = route;

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  //   const [key, setKey] = useState(data.amount);
  const [days, setDays] = useState(null);
  const [terms, setTerms] = useState(0);
  const [locale, setLang] = useState("");
  Translator.default(locale, true);

  useEffect(() => {
    console.log("data from prev screen SEND WITH", params);

    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale]);

  const SendWithEscrow = async () => {
    if (checkFuction(days)) {
      try {
        const response = await axios.post(
          url + "api/escrow/send",
          {
            amount: params.key,
            days: days,
            receiver_phone: params.contact,
            terms: terms,
          },
          {
            headers: {
              Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
            },
          }
        );

        console.log("response for GetRequests", response.data);

        response.data.status == 200
          ? alert(response.data.message)
          : alert(response.data.message);
      } catch (error) {
        console.log("error", error);
        alert("Something Went Wrong!");
      }
    } else {
      alert("Days must be in numbers.");
    }
  };

  const checkFuction = (text) => {
    var pattern = /^\d+$/;
    return pattern.test(text);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.WHITE }}>
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          height: 70,
        }}
      >
        <View
          style={{
            flex: 0.5,
          }}
        >
          <GoBack px={20} top={"20%"} size={30} clr={color.DARK_APP} />
        </View>
        <View
          style={{
            flex: 2,
          }}
        >
          <Image
            source={require("../../../assets/images/logo.png")}
            style={{ height: "100%", width: "100%" }}
            resizeMode="contain"
          />
        </View>
      </View>

      <ScrollView>
        <View style={{ height: "32%" }}>
          <Text
            style={{
              ...styles.viaHeadingg,
              alignSelf: "center",
              width: "90%",
              textAlign: "center",
            }}
          >
            {`You are about to pay FCFA ${params.key} to ${
              params.name === "" ? params.contact : params.name
            } with PayVit escrow option. If ${
              params.name === "" ? params.contact : params.name
            } delivers service/product on set time PayVit will send money to ${
              params.name === "" ? params.contact : params.name
            } after your approval.  If ${
              params.name === "" ? params.contact : params.name
            } fails to deliver, PayVit shall return the money back to you.  Please set the agreed delivery time and agreement.`}
          </Text>
        </View>

        <View
          style={{ height: "10%", flexDirection: "row", alignSelf: "center" }}
        >
          <Text style={{ ...styles.viaHeadingg, alignSelf: "center" }}>
            {"Delivery Time: "}
          </Text>
          <InputField
            placeholder={"No. of Days"}
            value={days}
            onChangeText={(text) => setDays(text)}
            inputStyle={styles.input}
            editable={true}
            multiline={true}
            keyboardType={"numeric"}
          />
        </View>

        <View
          style={{
            flex: 1,
            //   justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ ...styles.viaHeadingg, alignSelf: "center" }}>
            {"Your Agreed Terms:"}
          </Text>
          <InputField
            placeholder={"e.g. The show must be red color"}
            value={terms}
            onChangeText={(text) => setTerms(text)}
            inputStyle={styles.input2}
            editable={true}
            multiline={true}
          />
          <RoundCornerButton
            title={"OK"}
            onPress={SendWithEscrow}
            btnStyle={{
              // width: "20%",
              alignSelf: "center",
              marginTop: 2,
              backgroundColor: color.LT_APP,
            }}
          />
        </View>
        <TouchableOpacity>
          <Text
            style={{
              ...styles.viaHeadingg,
              alignSelf: "flex-start",
              fontSize: 14,
            }}
          >
            {"Escrow Policy"}
          </Text>
        </TouchableOpacity>

        {/* <View
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
            //   onPress={onPressNext}
            btnStyle={{
              width: "30%",
              alignSelf: "center",
              marginTop: -10,
              backgroundColor: color.LT_APP,
            }}
          />
          <RoundCornerButton
            title={"Pay with Escrow"}
            //   onPress={onPressNext}
            btnStyle={{
              width: "50%",
              alignSelf: "center",
              marginTop: -10,
              backgroundColor: color.LT_APP,
            }}
          />
        </View>
      </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    textAlign: "center",
    fontSize: 16,
    fontWeight: "500",
    paddingHorizontal: 2,
    backgroundColor: color.LT_APP,
    width: "30%",
    borderRadius: 10,
  },
  input2: {
    textAlign: "left",
    fontSize: 18,
    height: 110,
    fontWeight: "500",
    paddingHorizontal: 10,
    backgroundColor: color.LT_APP,
    width: WIDTH / 1.2,
    borderRadius: 10,
  },
  viaHeadingg: {
    fontWeight: "bold",
    paddingLeft: 11,
    alignSelf: "flex-start",
    fontSize: 18,
    color: color.DARK_APP,
    marginVertical: "3%",
  },
});

export default PaymentScreen;
