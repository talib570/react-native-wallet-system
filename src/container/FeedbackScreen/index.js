import React, { useEffect, useState } from "react";
import { View, Linking } from "react-native";
import * as Translator from "../../localization/";
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  SafeAreaView,
  BackHandler,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import { InputField, RoundCornerButton, GoBack } from "../../component";
import { color, globalStyle, url } from "../../utility";
import { useSelector, useDispatch } from "react-redux";
import { FAB, Portal, Provider } from "react-native-paper";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";

const FeedbackScreen = ({ navigation }) => {
  const isFocused = useIsFocused();

  const state = useSelector((state) => state.root);
  const { USERDATA } = state;

  const [locale, setLang] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [socialArray, setSocialArray] = useState([]);

  const onStateChange = ({ open }) => setOpen(open);

  Translator.default(locale, true);

  useEffect(() => {
    socialValidation();
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
  }, [locale, open, isFocused]);

  const backAction = () => {
    navigation.navigate("HomeTab", { screen: "Home" });
    console.log("NAVIGATING TO HOME");
    return true;
  };

  const onPress = async () => {
    if (!name && name == "" && !email && email == "" && !msg && msg == "") {
      alert(
        Translator.getString("fullNameLabel") +
          " " +
          Translator.getString("fieldEmptyLabel")
      );
      setIsLoading(false);
    } else if (!email && email == "") {
      alert(
        Translator.getString("email") +
          " " +
          Translator.getString("fieldEmptyLabel")
      );
      setIsLoading(false);
    } else if (!msg && msg == "") {
      alert(
        Translator.getString("msgLabel") +
          " " +
          Translator.getString("fieldEmptyLabel")
      );
      setIsLoading(false);
    } else {
      // Feedback(name, email, msg).then(res => {
      //     console.log(res,'====================================')
      try {
        const res = await axios.post(
          url + "api/contact/submit",
          {
            fullname: name,
            email: email,
            message: msg,
          },
          {
            headers: {
              Authorization: "Bearer " + USERDATA.user_data.token,
            },
          }
        );
        console.log("res", res.data);

        res.data.status == 200
          ? (setName(""),
            setEmail(""),
            setMsg(""),
            alert(Translator.getString("fbSubmittedLabel")))
          : alert("Oops! Something went wrong.");

        setIsLoading(false);
      } catch (error) {
        console.log("error", error);
        setIsLoading(false);
      }

      // })
    }
  };

  const arrToCheck = [
    {
      item: USERDATA && USERDATA.user_data.websettings[0].twitter,
      icon: "twitter",
      label: "Twitter",
      color: "rgb(80, 171, 241)",
      onPress: () =>
        Linking.openURL(USERDATA && USERDATA.user_data.websettings[0].twitter),
    },
    {
      item: USERDATA && USERDATA.user_data.websettings[0].youtube,
      icon: "youtube",
      label: "YouTube",
      color: "rgb(254, 0, 0)",
      onPress: () =>
        Linking.openURL(USERDATA && USERDATA.user_data.websettings[0].youtube),
    },
    {
      item: USERDATA && USERDATA.user_data.websettings[0].linkedin,
      icon: "linkedin",
      label: "LinkedIn",
      color: "rgb(0, 119, 181)",
      onPress: () =>
        Linking.openURL(USERDATA && USERDATA.user_data.websettings[0].linkedin),
    },
    {
      item: USERDATA && USERDATA.user_data.websettings[0].pinterest,
      icon: "pinterest",
      label: "Pinterest",
      color: "rgb(200, 30, 39)",
      onPress: () =>
        Linking.openURL(
          USERDATA && USERDATA.user_data.websettings[0].pinterest
        ),
    },
    {
      item: USERDATA && USERDATA.user_data.websettings[0].facebook,
      icon: "facebook",
      label: "Facebook",
      color: "rgb(72, 103, 170)",
      onPress: () =>
        Linking.openURL(USERDATA && USERDATA.user_data.websettings[0].facebook),
    },
    {
      item: USERDATA && USERDATA.user_data.websettings[0].instagram,
      icon: "instagram",
      label: "Instagram",
      color: "rgb(202, 55, 172)",
      onPress: () =>
        Linking.openURL(
          USERDATA && USERDATA.user_data.websettings[0].instagram
        ),
    },
  ];
  const socialValidation = () => {
    const filteredData = arrToCheck.filter((v) => v.item != "");
    setSocialArray(filteredData);
  };

  return (
    <SafeAreaView style={[globalStyle.flex1]}>
      <GoBack
        top="3%"
        left="6%"
        size={25}
        clr={color.DARK_APP}
        onPress={"Home"}
      />
      <Text style={styles.head}>{Translator.getString("contactUsLabel")}</Text>
      <InputField
        placeholder={Translator.getString("fullNameLabel")}
        onChangeText={(input) => setName(input)}
        value={name}
        placeholderTextColor={color.DARK_APP}
        inputStyle={styles.input}
      />
      <InputField
        placeholder={Translator.getString("email")}
        onChangeText={(input) => setEmail(input)}
        value={email}
        placeholderTextColor={color.DARK_APP}
        inputStyle={styles.input}
      />
      <InputField
        placeholder={Translator.getString("tellMeLabel")}
        placeholderTextColor={color.DARK_APP}
        onChangeText={(input) => setMsg(input)}
        value={msg}
        multiline={true}
        numberOfLines={8}
        inputStyle={[styles.input, { height: 150 }]}
      />
      <RoundCornerButton
        title={Translator.getString("sendLabel")}
        onPress={() => (setIsLoading(true), onPress())}
        btnStyle={styles.roundBtnStyle}
        isLoading={isLoading}
        customStyle={{ marginVertical: "2%" }}
      />

      <Text style={styles.whatsAppText}>
        Call number is;{" "}
        {USERDATA && USERDATA.user_data.websettings[0].phone + "."}
      </Text>
      <Text style={styles.whatsAppText}>
        Email; {USERDATA && USERDATA.user_data.websettings[0].email + "."}
      </Text>
      <Text style={styles.viaHeadingg}>
        {"Wish To Become An Agent? Call Now!"}
      </Text>
      <Text style={styles.whatsAppText}>
        Address: {USERDATA && USERDATA.user_data.websettings[0].address + "."}
      </Text>

      <Provider>
        <Portal>
          <FAB.Group
            open={open}
            icon={open ? "close" : "link"}
            color={"#fff"}
            fabStyle={styles.fab}
            actions={socialArray && socialArray}
            onStateChange={onStateChange}
            onPress={() => onStateChange(!open)}
          />
        </Portal>
      </Provider>
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
    paddingLeft: 11,
    alignSelf: "flex-start",
    fontSize: 18,
    color: color.DARK_APP,
    marginVertical: "3%",
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
});

export default FeedbackScreen;
