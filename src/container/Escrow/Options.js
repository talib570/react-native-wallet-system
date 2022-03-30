import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";
import * as Translator from "../../localization/";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  SafeAreaView,
  TouchableOpacity,
  BackHandler,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import { InputField, RoundCornerButton, GoBack } from "../../component";
import { color, globalStyle, url } from "../../utility";
import { useSelector, useDispatch } from "react-redux";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { useIsFocused } from "@react-navigation/native";

const FeedbackScreen = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [locale, setLang] = useState("");

  Translator.default(locale, true);

  useEffect(() => {
    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () =>
      BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, [isFocused]);

  const backAction = () => {
    navigation.goBack();
    console.log("NAVIGATING TO HOME");
    return true;
  };

  const btns = [
    {
      title: "My Escrow Account",
      navigate: () => navigation.replace("MyEscrowAccount"),
    },
    {
      title: "Pay with Escrow",
      navigate: () => navigation.navigate("PayWithEscrow"),
    },
  ];

  return (
    <SafeAreaView style={[globalStyle.flex1]}>
      <GoBack top="3%" left="6%" size={25} clr={color.DARK_APP} />

      <Text style={styles.head}>Escrow Account</Text>

      <View style={{ paddingHorizontal: "5%", marginTop: "5%" }}>
        {btns.map((v, i) => {
          return (
            <TouchableOpacity style={styles.btnNavigate} onPress={v.navigate}>
              <Text style={styles.viaHeadingg}>{v.title}</Text>
              <FontAwesome5
                name="chevron-right"
                size={17}
                color={color.DARK_APP}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  head: {
    color: color.DARK_APP,
    fontSize: 30,
    fontWeight: "bold",
    alignSelf: "center",
    padding: 10,
  },
  input: {
    width: "90%",
    borderRadius: 20,
    color: color.DARK_APP,
    borderWidth: 2,
    paddingHorizontal: 15,
    borderColor: color.GREY,
  },
  roundBtnStyle: {
    alignSelf: "center",
    paddingHorizontal: 20,
    backgroundColor: color.DARK_APP,
  },
  roundBtnStyle2: {
    marginBottom: 2,
    backgroundColor: color.DARK_APP,
    marginVertical: 0,
    height: 40,
    width: "45%",
    marginRight: 5,
  },
  viaHeadingg: {
    fontWeight: "bold",

    // alignSelf: "flex-start",
    fontSize: 18,
    color: color.DARK_APP,
    // marginVertical: "3%",
  },
  callText: {
    fontWeight: "600",
    paddingLeft: 11,
    fontSize: 16,
    color: color.DARK_APP,
  },
  whatsAppText: {
    fontWeight: "600",
    paddingLeft: 11,
    paddingVertical: 3,
    alignSelf: "flex-start",
    fontSize: 16,
    color: color.DARK_APP,
    width: "85%",
    lineHeight: 23,
  },
  textText: {
    fontWeight: "600",
    paddingLeft: 11,
    paddingVertical: 5,
    alignSelf: "flex-start",
    fontSize: 16,
    color: color.DARK_APP,
  },
  fab: {
    backgroundColor: color.DARK_APP,
    height: 50,
    width: 50,
    padding: 0,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  btnNavigate: {
    height: 60,
    justifyContent: "center",
    borderBottomColor: color.DARK_APP,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});

export default FeedbackScreen;
