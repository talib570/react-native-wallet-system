import React, { useEffect, useRef, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  FlatList,
  SafeAreaView,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  ScrollView,
  BackHandler,
  Alert,
  Platform,
} from "react-native";
import { globalStyle, color, WIDTH, HEIGHT, url } from "../../utility";
import * as Translator from "../../localization/";
import BottomSheet from "reanimated-bottom-sheet";
import RBSheet from "react-native-raw-bottom-sheet";
import {
  Octicons,
  AntDesign,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { currentUser } from "../../appData";
import {
  getFormattedNumber,
  getPhoneNumberWithoutCountryCode,
} from "../../utility/styleHelper/appStyle";
import { RoundCornerButton } from "../../component";
import {
  getAsyncStorage,
  keys,
  setAsyncStorage,
  clearSingleDataAsyncStorage,
} from "../../asyncStorage";
import { useIsFocused } from "@react-navigation/native";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { updateData, isNew } from "../../redux/actions";
import BackgroundTimer from "react-native-background-timer";

import PushNotification from "react-native-push-notification";

import OnBoarding from "../OnBoarding";

const Home = (props) => {
  // const tooltip = useRef();
  const sheetRef = React.useRef(null);

  const { navigation } = props;
  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.root);
  const { USERDATA, IS_NEW, CONTACT_LIST } = state;

  const [value, setValue] = useState("en-US");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [userData, setUserData] = useState(null);
  const [expend, setExpend] = useState(false);
  const [contactDetails, setContactDetails] = useState({});
  const [contactHistory, setContactHistory] = useState(null);
  const [paymentRequesters, setPaymentRequesters] = useState(null);
  const [paymentRequesterData, setPaymentRequestersData] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isReloading, setReloading] = useState(true);
  const [counter, setCounter] = useState(0);
  const [pops, setPopups] = useState({
    text: "Generate QRCode Here",
    top: null,
    left: null,
    right: null,
    bottom: null,
  });

  useEffect(() => {
    PushNotification.configure({
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function (token) {
        console.log("TOKEN:", token);
      },
      // (required) Called when a remote is received or opened, or local notification is opened
      onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        // props.navigation.navigate("Home");
        // process the notification
        // (required) Called when a remote is received or opened, or local notification is opened
        // notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      permissions: {
        alert: true,
        badge: false,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === "ios",
    });
    console.log("contextState AND redux IN HOME", USERDATA && USERDATA);
    refreshData();
    setUserData(USERDATA);
    setContactDetails(CONTACT_LIST);
    paymentRequests();
    fetchHistory();

    if (isFocused) {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }

    return () => (
      BackHandler.removeEventListener("hardwareBackPress", backAction),
      setReloading(false)
    );

    // return setUserData(null);z
  }, [refresh, isFocused]);

  const testPush = (res) => {
    console.log("paymentRequesters", res);
    res &&
      res.length > 0 &&
      res.forEach((v, i) => {
        return PushNotification.localNotification({
          /* Android Only Properties */

          vibrate: true, // (optional) default: true
          vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000

          /* iOS and Android properties */
          title: res.length > 1 ? "Payment Requests" : "Payment Request", // (optional)
          message: `${v.sender_first_name} ${v.sender_last_name} Requested for Payment`, // (required)
        });
      });
  };

  const backAction = () => {
    Alert.alert("Hold on!", "Are you sure you want to Exit?", [
      {
        text: "Cancel",
        onPress: () => null,
        style: "cancel",
      },
      { text: "YES", onPress: () => BackHandler.exitApp() },
    ]);
    return true;
  };

  const onTouch = () => {
    console.log("Home View Touched", counter);

    switch (counter) {
      case 0:
        setPopups({
          text: "Scan QRCode Here",
          top: null,
          left: "48%",
          right: null,
          bottom: "3%",
        });
        break;
      case 1:
        setPopups({
          text: "Request Money Here",
          top: null,
          left: "68%",
          right: null,
          bottom: null,
        });
        break;
      case 2:
        setPopups({
          text: "Notifications",
          top: true,
          left: "87%",
          right: null,
          bottom: "92%",
        });
        break;
      case 3:
        setPopups({
          text: "Your Balance",
          top: true,
          left: "60%",
          right: null,
          bottom: "65%",
        });
        break;
      case 4:
        setPopups({
          text: "Logout",
          top: true,
          left: "15%",
          right: null,
          bottom: "92%",
        });
        break;
      case 5:
        dispatch(isNew(false));
      default:
        return counter;
    }
  };

  const paymentResponse = async (ID, STATUS) => {
    // console.log("ID, STATUS", ID, STATUS, USERDATA.user_data.token);

    try {
      const response = await axios.post(
        url + "api/request/accept",
        { id: ID, status: STATUS == "ACCEPT" ? "1" : "0" },
        {
          headers: {
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );
      console.log("response for paymentResponse", response.data);
      response.data.status == 200
        ? alert(response.data.message)
        : alert(response.data.message);
      refreshData();
      setRefresh(!refresh);
    } catch (error) {
      console.log("error", error);
      alert("Something Went Wrong!");
    }
  };

  const paymentRequests = async () => {
    try {
      const response = await axios.post(
        url + "api/request/get",
        {},
        {
          headers: {
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );

      console.log("response for GetRequests", response.data.data);

      response.data.data &&
        response.data.data.length > 0 &&
        testPush(response.data.data);

      setPaymentRequesters(response.data.data);
      return true;
    } catch (error) {
      console.log("error", error);
    }
  };

  const refreshData = async () => {
    try {
      if (USERDATA != null) {
        const res = await axios.post(
          url + "api/get/userdata",
          {},
          {
            headers: {
              Authorization: "Bearer " + USERDATA.user_data.token,
            },
          }
        );
        console.log("res REFRESHDATA", res.data.data);
        currentUser.firstName = res.data.data.first_name;
        currentUser.lastName = res.data.data.last_name;
        currentUser.profileImg = {
          uri:
            res.data.data.image != null
              ? `${url}${res.data.data.image}`
              : "https://picsum.photos/seed/picsum/200/300",
        };
        currentUser.wallet = {
          balance: res.data.data.remaining_balance,
          currency: USERDATA.wallet.currency,
        };
        currentUser.user_data = USERDATA.user_data;
        // setRefresh(!refresh);
        dispatch(updateData(currentUser));
      }
    } catch (error) {
      console.log("err in refresh data", error);
    }
  };

  const fetchHistory = async () => {
    try {
      console.log("TOKEN", USERDATA && USERDATA.user_data.token);
      const response = await axios.post(
        url + "api/history",
        {},
        {
          headers: {
            Authorization: `Bearer ${USERDATA && USERDATA.user_data.token}`,
          },
        }
      );
      console.log("response for History", response.data.data.transactions);
      setContactHistory(response.data.data.transactions);
      setIsLoading(false);
    } catch (error) {
      console.log("error", error);
      setIsLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <Item
      key={item.key}
      name={item.name}
      onPress={() =>
        navigation.navigate("PaymentScreen", {
          data: item,
          token: USERDATA && userData.user_data.token,
        })
      }
    />
  );

  const Item = ({ name, img, onPress }) => (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[styles.card, { height: 100, width: 100, marginHorizontal: 7 }]}
      >
        <View
          style={{
            height: 40,
            width: 40,
            alignSelf: "center",
            marginTop: 15,
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{
              fontWeight: "400",
              paddingVertical: 2,
              fontSize: 20,
              alignSelf: "center",
              fontWeight: "bold",
              backgroundColor: color.WHITE,
              color: color.DARK_APP,
              width: "100%",
              textAlign: "center",
              borderRadius: 5,
            }}
          >
            {name && name.charAt(0).toUpperCase()}
          </Text>
        </View>
        <Text
          style={{
            fontWeight: "400",
            paddingVertical: 2,
            fontSize: 15,
            alignSelf: "center",
            color: color.WHITE,
            // alignSelf: "center",
            textAlign: "center",
          }}
        >
          {name}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderHistory = ({ item }) => (
    <ItemHis
      name={item.sender_first_name + " " + item.sender_last_name}
      img={item.img}
      lastName={item.receiver_first_name + " " + item.receiver_last_name}
      amt={item.amount}
      toID={item.to}
    />
  );

  const ItemHis = ({ name, toID, lastName, amt }) => (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: color.LT_APP,
        borderRadius: 15,
        justifyContent: "space-between",
        padding: 10,
        marginVertical: 8,
      }}
    >
      {/* <Image
        source={img}
        style={{ height: 40, width: 40, alignSelf: "center", borderRadius: 15 }}
      /> */}
      <View style={{ paddingHorizontal: 10, width: "70%" }}>
        <Text
          style={{
            fontWeight: "400",
            paddingVertical: 2,
            fontSize: 18,
            color: color.WHITE,
          }}
        >
          {userData && toID == userData.user_data.user_data.id
            ? `Recieved from ${name}`
            : `Sent to ${lastName}`}
        </Text>
      </View>
      <Text
        style={{
          fontWeight: "400",
          fontSize: 18,
          alignSelf: "center",
          width: "30%",
          color: color.WHITE,
        }}
      >
        {userData && toID == userData.user_data.user_data.id
          ? `+ ${userData && userData.wallet.currency} ${amt}`
          : `-  ${userData && userData.wallet.currency} ${amt}`}
      </Text>
    </View>
  );

  const RenderContent = (props) => {
    const { onPress, isLoading } = props;
    console.log("setIsLoading isLoading", isLoading);
    return (
      <View
        style={{
          backgroundColor: color.DARK_APP,
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 130,
          // minHeight:HEIGHT,
          height:
            contactHistory && contactHistory.length > 7
              ? contactHistory.length * 85 + 130
              : HEIGHT,
        }}
      >
        <View
          style={{
            backgroundColor: color.WHITE,
            width: 30,
            height: 8,
            alignSelf: "center",
            borderRadius: 5,
          }}
        />
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
          }}
        >
          <Text
            style={{ fontWeight: "bold", fontSize: 20, color: color.WHITE }}
          >
            {Translator.getString("historyLabel")}
          </Text>

          <TouchableOpacity
            style={{ justifyContent: "center", alignItems: "center" }}
            onPress={onPress}
          >
            {isLoading === true ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialCommunityIcons
                name="history"
                color={color.WHITE}
                size={30}
              />
            )}
          </TouchableOpacity>
        </View>

        <View
          style={{
            backgroundColor: color.DARK_APP,
          }}
        >
          <FlatList
            data={contactHistory}
            renderItem={renderHistory}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </View>
    );
  };

  const Popups = (props) => {
    const { top, bottom, left, right, text } = props;

    return (
      <View
        style={{
          bottom: bottom ? bottom : "1%",
          left: left ? left : "27%",
          position: "absolute",
          zIndex: 1111,
          alignItems: "center",
          transform: [{ rotate: top ? "180deg" : "0deg" }],
        }}
      >
        <View
          style={{
            backgroundColor: "rgb(238, 101, 46)",
            bottom: "4%",
            position: "absolute",
            zIndex: 1111,
            marginBottom: 8,
            marginTop: 8,
            borderRadius: 5,
            transform: [{ rotate: top ? "180deg" : "0deg" }],
            elevation: 10,
          }}
        >
          <Text
            style={{
              paddingHorizontal: 10,
              paddingVertical: 15,
              color: "#fff",
            }}
          >
            {text}
          </Text>
        </View>

        <View
          style={{
            ...styles.triangle,
            transform: [{ rotate: "180deg" }],
            height: 10,
            width: 10,
            bottom: "2%",
            left: "26%",
            position: "absolute",
            zIndex: 1111,
            elevation: 10,
          }}
        />
      </View>
    );
  };

  // const cardNumber = getPhoneNumberWithoutCountryCode(userData.phoneNumber).split('');
  // const cardNumber = [
  //   require("../../../assets/icon1.png"),
  //   require("../../../assets/mastercard.png"),
  //   require("../../../assets/visa.png"),
  //   require("../../../assets/money.png"),
  //   require("../../../assets/world.png"),
  //   require("../../../assets/ornge.png"),
  // ];
  // console.log(cardNumber);
  // const CardNo = () => {
  //   return cardNumber.map((logo) => (
  //     // <Text style={{ fontWeight: '600', borderWidth: 1, borderColor: color.WHITE, paddingHorizontal: 5, marginHorizontal: 3, color: color.WHITE, fontSize: 15, borderRadius: 5 }}>{number}</Text>
  //     <Image
  //       source={logo}
  //       resizeMode="stretch"
  //       style={{ height: 40, width: 55 }}
  //     />
  //   ));
  // };

  setTimeout(() => {
    setReloading(false);
  }, 1000);

  return isReloading ? (
    <ActivityIndicator
      size="large"
      color="rgb(66, 33, 64)"
      style={{ alignSelf: "center", marginTop: "10%" }}
    />
  ) : (
    <SafeAreaView
      style={{ flex: 1, alignItems: "center", backgroundColor: color.WHITE }}
    >
      {/* <View
        style={{
          flex: 1,
          position: "absolute",
          backgroundColor: "transparent",
          zIndex: 9999,
          height: "100%",
        }}
      >
        <OnBoarding />
      </View> */}

      {/* {IS_NEW && pops.text != "" && (
        <Popups
          text={pops.text && pops.text}
          bottom={pops.bottom && pops.bottom}
          top={pops.top && pops.text}
          left={pops.left && pops.left}
          right={pops.right && pops.right}
        />
      )} */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {paymentRequesters && paymentRequesters.length > 0 ? (
                <View>
                  {paymentRequesters.map((v, i) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          setModalVisible1(true);
                          setModalVisible(false);
                          setPaymentRequestersData(v);
                        }}
                        style={styles.upperModalMainView}
                      >
                        <Image
                          source={require("../../../assets/images/avatar3.png")}
                          style={styles.upperModalProfile}
                        />
                        <View style={{ paddingHorizontal: 20, width: "60%" }}>
                          <Text style={styles.upperModalName}>
                            {v.sender_first_name}
                          </Text>
                          <Text style={{ color: color.WHITE }}>
                            {userData &&
                              userData.wallet.currency + " " + v.amount}
                          </Text>
                        </View>
                        <Text style={styles.upperModalRequestButton}>
                          {"Request"}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : (
                <View style={styles.upperModalMainView}>
                  <Text
                    style={[
                      styles.upperModalRequestButton,
                      { width: "100%", textAlign: "center" },
                    ]}
                  >
                    No Requesters.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          width: "100%",
          paddingTop: 10,
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <Octicons
            name="three-bars"
            size={30}
            color={color.LT_APP}
            style={{
              fontWeight: "bold",
              paddingHorizontal: "7%",
              color: color.LT_APP,
              alignSelf: "center",
              // marginRight: -50,
            }}
          />
        </TouchableOpacity>
        <Image
          source={require("../../../assets/images/logo.png")}
          style={{ height: "100%", width: "35%" }}
          resizeMode="stretch"
        />
        <View>
          {paymentRequesters && paymentRequesters.length > 0 && (
            <View style={styles.badgeStyle}>
              <Text style={{ color: "#fff", fontSize: 11 }}>
                {paymentRequesters && paymentRequesters.length}
              </Text>
            </View>
          )}

          <AntDesign
            name="notification"
            size={25}
            color={color.LT_APP}
            style={{ paddingHorizontal: "7%" }}
            onPress={() => setModalVisible(!modalVisible)}
          />
        </View>
      </View>
      <View style={styles.card}>
        <View
          style={{
            flexDirection: "row",
            margin: 10,
            justifyContent: "space-between",
          }}
        >
          <View>
            <Text
              style={{
                fontWeight: "bold",
                color: color.WHITE,
                alignSelf: "center",
              }}
            >
              {Translator.getString("welcomeLabel")}{" "}
            </Text>
            <Text
              style={{
                fontWeight: "bold",
                color: color.WHITE,
                alignSelf: "center",
              }}
            >
              {userData && userData.user_data.user_data.first_name == ""
                ? userData && userData.firstName
                : userData && userData.user_data.user_data.first_name}
            </Text>
          </View>
          <View
            style={{
              backgroundColor: color.LT_APP,
              marginTop: -10,
              width: 25,
              height: 30 + 15,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: "#6f56a3",
              marginTop: -10,
              width: 25,
              height: 25 + 15,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: color.LT_APP,
              marginTop: -10,
              width: 25,
              height: 40 + 15,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: color.CHECKED,
              marginTop: -10,
              width: 25,
              height: 30 + 15,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
          <View
            style={{
              backgroundColor: "#db7140",
              marginTop: -10,
              width: 25,
              height: 35 + 15,
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5,
            }}
          />
          <Image
            source={
              userData && userData.profileImg.uri != undefined
                ? { uri: userData.profileImg.uri }
                : require("../../../assets/images/avatar1.png")
            }
            style={{ height: 40, width: 40, borderRadius: 10 }}
          />
        </View>
        <Text
          style={{
            fontWeight: "600",
            fontSize: 22,
            alignSelf: "center",
            color: color.WHITE,
            letterSpacing: 5,
          }}
        >
          {userData && userData.user_data.user_data.phone}
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 10,
          }}
        >
          <View style={{ height: 40, width: 40, marginRight: 10 }} />
          <Text
            style={{
              fontWeight: "900",
              fontSize: 18,
              alignSelf: "center",
              color: color.WHITE,
            }}
          >
            {Translator.getString("balanceLabel")}
          </Text>
          <Text
            style={{
              fontWeight: "600",
              paddingVertical: 4,
              fontSize: 15,
              alignSelf: "center",
              color: color.WHITE,
            }}
          >
            {userData &&
              userData.wallet.currency + " " + userData &&
              getFormattedNumber(userData.wallet.balance)}{" "}
          </Text>
          <Image
            source={require("../../../assets/mastercard.png")}
            resizeMode="stretch"
            style={{ height: 40, width: 50 }}
          />
        </View>
        <View
          style={{
            flexDirection: "row",
            paddingVertical: 10,
            justifyContent: "space-evenly",
          }}
        >
          {/* <CardNo /> */}
          <View
            style={{
              backgroundColor: "white",
              padding: 11,
              alignSelf: "center",
            }}
          >
            <Image
              source={require("../../../assets/visa.png")}
              resizeMode="stretch"
              style={{ height: 15, width: 25, backgroundColor: "white" }}
            />
          </View>
          <View style={{ alignSelf: "center" }}>
            <View style={{ height: 35, width: 45 }} />
          </View>
          <View style={{ alignSelf: "center" }}>
            <View style={{ height: 35, width: 45 }} />
          </View>
          <View style={{ alignSelf: "center" }}>
            <Image
              source={require("../../../assets/mtm.jpeg")}
              resizeMode="stretch"
              style={{ height: 35, width: 45 }}
            />
          </View>
        </View>
      </View>

      {/* <Tooltip popover={<Text>Info here</Text>}>
        <Text>Press me</Text>
      </Tooltip> */}

      {/* <TouchableOpacity onPress={() => navigation.navigate("PayManually")}>
        <Text>dfsdf</Text>
      </TouchableOpacity> */}

      <Text style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}>
        {Translator.getString("sendMoneyToFriendLabel")}
      </Text>
      <View style={{ flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("PayManually")}
          style={{ paddingVertical: 25 }}
        >
          <View
            style={{
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: 15,
              borderColor: color.LT_APP,
              paddingHorizontal: 15,
              paddingVertical: 4,
              marginHorizontal: 15,
            }}
          >
            {/* <Text style={{ fontSize: 30, color: color.LT_APP }}>+</Text> */}
            <AntDesign
              name="contacts"
              size={25}
              color={color.LT_APP}
              style={{
                fontSize: 30,
                paddingVertical: "1.4%",
              }}
            />
          </View>
          <Text
            style={{
              color: color.LT_APP,
              paddingHorizontal: 15,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {/* {Translator.getString("searchLabel")} */}Type
          </Text>
          <Text
            style={{
              color: color.LT_APP,
              paddingHorizontal: 15,
              fontWeight: "bold",
            }}
          >
            {/* {Translator.getString("contactLabel")}{" "} */}Manually
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SearchContact")}
          style={{ paddingVertical: 25 }}
        >
          <View
            style={{
              alignSelf: "center",
              borderWidth: 1,
              borderRadius: 15,
              borderColor: color.LT_APP,
              paddingHorizontal: 15,
              paddingVertical: 4,
              marginHorizontal: 15,
            }}
          >
            <Text style={{ fontSize: 30, color: color.LT_APP }}>+</Text>
          </View>
          <Text
            style={{
              color: color.LT_APP,
              paddingHorizontal: 15,
              fontWeight: "bold",
            }}
          >
            {Translator.getString("searchLabel")}
          </Text>
          <Text
            style={{
              color: color.LT_APP,
              paddingHorizontal: 15,
              fontWeight: "bold",
            }}
          >
            {Translator.getString("contactLabel")}{" "}
          </Text>
        </TouchableOpacity>

        <FlatList
          data={contactDetails}
          horizontal={true}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
        />
      </View>

      <BottomSheet
        ref={sheetRef}
        snapPoints={["25%", "90%", "25%", "25%"]}
        borderRadius={15}
        renderContent={(props) => (
          <RenderContent
            {...props}
            onPress={() => (fetchHistory(), setIsLoading(true))}
            setIsLoading={setIsLoading}
            isLoading={isLoading}
          />
        )}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible1}
        onRequestClose={() => {
          setModalVisible1(false);
          setExpend(false);
        }}
      >
        <View style={[styles.centeredView, { justifyContent: "flex-end" }]}>
          <View style={[styles.modalView, { paddingTop: 0 }]}>
            <View style={styles.lowerModalMainView} />
            {!expend ? (
              <TouchableOpacity
                onPress={() => setExpend(true)}
                style={styles.lowerModalFirstView}
              >
                <Image
                  source={require("../../../assets/images/avatar3.png")}
                  style={styles.lowerModalImage}
                />
                <View style={styles.lowerModalTextView}>
                  <Text style={styles.lowerModalRequestText}>
                    {"Payment Request Received"}
                  </Text>
                  <Text style={{ color: color.WHITE }}>{`${
                    userData && userData.wallet.currency
                  } ${
                    paymentRequesterData && paymentRequesterData.amount
                  }`}</Text>
                </View>
                {/* <Text style={{ fontWeight: '400', fontSize: 18, alignSelf: 'center', width: '40%', color: color.WHITE }}>{'Request'}</Text> */}
              </TouchableOpacity>
            ) : (
              <View style={{ justifyContent: "center", width: "100%" }}>
                <Text style={styles.lowerModalSecondView}>
                  {"Payment Request Detail"}
                </Text>
                <Image
                  source={require("../../../assets/images/avatar3.png")}
                  style={styles.lowerModalSecondImage}
                />
                <Text style={styles.lowerModalSecondName}>
                  {paymentRequesterData &&
                    paymentRequesterData.sender_first_name +
                      " " +
                      paymentRequesterData.sender_last_name}
                </Text>
                <View style={styles.lowerModalSecondAmountView}>
                  <Text style={styles.lowerModalSecondAmountText}>Amount</Text>
                  <Text style={styles.lowerModalSecondAmountValue}>
                    {`${userData && userData.wallet.currency} ${
                      paymentRequesterData && paymentRequesterData.amount
                    }`}
                  </Text>
                </View>
                {/* <Text style={styles.lowerModalSecondDescription}>
                  {"Description"}
                </Text>
                <Text style={{ color: color.DARK_APP }}>
                  {"I need you to pay our billing on last month \t Thanks"}
                </Text> */}
                <View style={styles.lowerModalSecondButtons}>
                  <RoundCornerButton
                    title="Reject"
                    onPress={() => {
                      setModalVisible1(false);
                      setExpend(false);
                      paymentResponse(paymentRequesterData.id, "REJECT");
                    }}
                    btnStyle={{ backgroundColor: color.TRANSPARENT }}
                    btnTextStyle={styles.lowerModalSecondAcceptButton}
                  />
                  <RoundCornerButton
                    title="Accept"
                    onPress={() => {
                      setModalVisible1(false);
                      setExpend(false);
                      paymentResponse(paymentRequesterData.id, "ACCEPT");
                    }}
                  />
                </View>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.DARK_APP,
    margin: 20,
    width: "90%",
    height: 200,
    alignContent: "center",
    borderRadius: 15,
    shadowColor: "#fff",
    shadowOpacity: 1,
    shadowOffset: {
      width: 3,
      height: 3,
    },
  },
  centeredView: {
    flex: 1,
    marginTop: 22,
    marginBottom: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  upperModalMainView: {
    flexDirection: "row",
    backgroundColor: color.DARK_APP,
    borderRadius: 15,
    justifyContent: "space-around",
    padding: 10,
    marginVertical: 8,
  },
  upperModalProfile: {
    height: 40,
    width: 40,
    alignSelf: "center",
    borderRadius: 15,
  },
  upperModalName: {
    fontWeight: "400",
    paddingVertical: 2,
    fontSize: 18,
    color: color.WHITE,
  },
  upperModalRequestButton: {
    fontWeight: "400",
    fontSize: 18,
    alignSelf: "center",
    width: "40%",
    color: color.WHITE,
  },
  lowerModalFirstView: {
    flexDirection: "row",
    backgroundColor: color.DARK_APP,
    borderRadius: 15,
    justifyContent: "space-around",
    padding: 10,
    width: WIDTH / 1.3,
  },
  lowerModalImage: {
    height: 40,
    width: 40,
    alignSelf: "center",
    borderRadius: 15,
  },
  lowerModalTextView: {
    paddingLeft: 30,
    width: WIDTH / 1.4,
    justifyContent: "space-between",
  },
  lowerModalMainView: {
    backgroundColor: color.DARK_APP,
    marginVertical: 10,
    width: 35,
    height: 8,
    alignSelf: "center",
    borderRadius: 5,
  },
  lowerModalRequestText: {
    fontSize: 16,
    fontWeight: "bold",
    color: color.WHITE,
    paddingVertical: 5,
  },
  lowerModalSecondView: {
    fontWeight: "bold",
    paddingVertical: 2,
    alignSelf: "center",
    paddingBottom: 10,
    fontSize: 18,
    color: color.DARK_APP,
  },
  lowerModalSecondImage: {
    height: 40,
    width: 40,
    alignSelf: "center",
    borderRadius: 15,
  },
  lowerModalSecondName: {
    fontWeight: "bold",
    paddingVertical: 10,
    alignSelf: "center",
    fontSize: 18,
    color: color.DARK_APP,
  },
  lowerModalSecondAmountView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  lowerModalSecondAmountText: {
    fontWeight: "bold",
    paddingVertical: 11,
    alignSelf: "flex-start",
    fontSize: 18,
    color: color.DARK_APP,
  },
  lowerModalSecondAmountValue: {
    fontWeight: "bold",
    paddingVertical: 11,
    alignSelf: "flex-start",
    fontSize: 18,
    color: "#db7140",
  },
  lowerModalSecondDescription: {
    fontWeight: "bold",
    paddingVertical: 11,
    alignSelf: "flex-start",
    fontSize: 18,
    color: color.DARK_APP,
  },
  lowerModalSecondButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    alignSelf: "center",
  },
  lowerModalSecondAcceptButton: {
    color: color.DARK_APP,
    fontSize: 18,
    fontWeight: "100",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderBottomWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: "rgb(238, 101, 46)",
  },
  badgeStyle: {
    backgroundColor: color.DARK_APP,
    height: 20,
    width: 20,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 360,
    position: "absolute",
    left: 16,
    top: -5,
    zIndex: 999,
  },
});

export default Home;
