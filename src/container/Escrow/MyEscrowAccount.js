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
  BackHandler,
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
import { lessOrEq } from "react-native-reanimated";

import { useIsFocused } from "@react-navigation/native";

const PaymentScreen = ({ navigation, route }) => {
  //   const { data, token } = route.params;
  const isFocused = useIsFocused();

  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  //   const [key, setKey] = useState(data.amount);
  const [key, setKey] = useState(0);
  const [escrow, setEscrow] = useState(null);
  const [locale, setLang] = useState("");
  Translator.default(locale, true);

  useEffect(() => {
    console.log("data from prev screen", USERDATA);

    getHistory();

    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [locale, isFocused]);

  const backAction = () => {
    navigation.goBack();
    console.log("NAVIGATING TO HOME");
    return true;
  };

  const getHistory = async () => {
    try {
      const response = await axios.post(
        url + "api/escrow/history",
        {},
        {
          headers: {
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );

      console.log("response for GetRequests", response.data.data.escrow);
      setEscrow(response.data.data.escrow);

      // response.data.data &&
      //   response.data.data.length > 0 &&
      //   testPush(response.data.data);

      // setPaymentRequesters(response.data.data);
      // return true;
    } catch (error) {
      console.log("error", error);
    }
  };

  const escrowResponse = async (ID, STATUS) => {
    // console.log("ID, STATUS", ID, STATUS, USERDATA.user_data.token);

    try {
      const accepted = { id: ID, status: "1" };
      const rejected = { id: ID, status: "0", reason: "nothing specific" };

      const response = await axios.post(
        url + "api/escrow/accept",
        STATUS == "ACCEPTED" ? accepted : rejected,
        {
          headers: {
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );
      console.log("response for escrowResponse", response.data);

      response.data.status == 200
        ? (getHistory(), alert(response.data.message))
        : alert(response.data.message);
    } catch (error) {
      console.log("error", error);
      alert("Something Went Wrong!");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: color.WHITE }}>
      <View
        style={{
          // flex: 1,
          flexDirection: "row",
          //   justifyContent: "space-between",
          width: "100%",
          //   paddingTop: "2%",
          // paddingLeft: "5%",
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
        <View>
          <Text
            style={{
              ...styles.viaHeadingg,
              alignSelf: "center",
              width: "70%",
              textAlign: "center",
              fontSize: 22,
            }}
          >
            Your Escrow Account
          </Text>
        </View>

        {escrow && escrow.length > 0 ? (
          escrow.map((v, i) => {
            return (
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  marginBottom: "2%",
                  borderBottomColor: color.DARK_APP,
                  borderBottomWidth: 1,
                  paddingBottom:
                    USERDATA && USERDATA.user_data.user_data.id != v.from
                      ? "5%"
                      : "0%",
                }}
              >
                <Text
                  style={{
                    ...styles.viaHeadingg,
                    alignSelf: "center",
                    marginTop: "5%",
                  }}
                >
                  {`Active Balance ${i + 1}`}
                </Text>

                <Text
                  style={{
                    ...styles.viaHeadingg,
                    // alignSelf: "center",
                    marginVertical: "0%",
                  }}
                >
                  {`FCFA ${v.amount}`}
                </Text>

                <Text
                  style={{
                    ...styles.viaHeadingg,
                    // alignSelf: "center",
                    marginVertical: "0%",
                  }}
                >
                  {USERDATA && USERDATA.user_data.user_data.id == v.from
                    ? `Reciever: ${v.receiver_first_name} ${v.receiver_last_name}`
                    : `Sender: ${v.sender_first_name} ${v.sender_last_name}`}
                </Text>
                <Text
                  style={{
                    ...styles.viaHeadingg,
                    // alignSelf: "center",
                    marginVertical: "0%",
                  }}
                >
                  {`Time Left: ${v.days} days`}
                </Text>
                <Text
                  style={{
                    ...styles.viaHeadingg,
                    // alignSelf: "center",
                    marginVertical: "0%",
                  }}
                >
                  {`Terms: ${v.terms}`}
                </Text>

                {USERDATA && USERDATA.user_data.user_data.id == v.from && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <RoundCornerButton
                      title={"Reject"}
                      onPress={() => escrowResponse(v.id, "REJECTED")}
                      btnStyle={{
                        width: "40%",
                        marginTop: "2%",
                        backgroundColor: color.LT_APP,
                        marginRight: "5%",
                      }}
                    />
                    <RoundCornerButton
                      title={"Accept"}
                      onPress={() => escrowResponse(v.id, "ACCEPTED")}
                      btnStyle={{
                        width: "40%",
                        marginTop: "2%",
                        backgroundColor: color.LT_APP,
                        marginLeft: "5%",
                      }}
                    />
                  </View>
                )}
              </View>
            );
          })
        ) : (
          <Text
            style={{
              ...styles.viaHeadingg,
              alignSelf: "center",
              justifyContent: "center",
              // marginVertical: "0%",
            }}
          >
            {`Nothing To Show.`}
          </Text>
        )}
      </ScrollView>
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
