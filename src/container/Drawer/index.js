import React, { useRef, useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";

import { HomeStackScreen } from "../../navigation";
import { RoundCornerButton, Logo } from "../../component";
import {
  Octicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Entypo,
} from "@expo/vector-icons";

import {
  getAsyncStorage,
  keys,
  setAsyncStorage,
  clearSingleDataAsyncStorage,
} from "../../asyncStorage";
import { updateData } from "../../redux/actions";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import { useDispatch } from "react-redux";

const Drawer = createDrawerNavigator();

const CustomDrawerContent = ({ props }) => {
  const dispatch = useDispatch();

  const _logout = () => {
    props.navigation.navigate("Login");
    clearSingleDataAsyncStorage(keys.pin);
    dispatch(updateData(null));
  };

  return (
    <View style={{ flex: 1 }}>
      <Logo
        imgStyle={{ width: 150, height: 50 }}
        logoStyle={{
          width: "100%",
          height: "35%",
          backgroundColor: color.DARK_APP,
          borderRadius: 0,
          alignSelf: "center",
        }}
      />

      <TouchableOpacity
        style={styles.btnStyle}
        onPress={() => props.navigation.navigate("Options")}
      >
        <Octicons
          name="three-bars"
          size={30}
          color={color.LT_APP}
          style={{
            fontWeight: "bold",
            paddingHorizontal: "3%",
            color: color.LT_APP,
            // alignSelf: "center",
            // marginRight: -50,
          }}
        />
        <Text style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}>
          My Escrow Account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle}>
        <MaterialIcons
          name="contact-mail"
          color={color}
          size={25}
          style={{
            fontWeight: "bold",
            paddingHorizontal: "2%",
            color: color.LT_APP,
            // alignSelf: "center",
            // marginRight: -50,
          }}
        />
        <Text
          style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}
          onPress={() =>
            props.navigation.navigate("BottomTab", { screen: "Feedback" })
          }
        >
          Contact Us
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle}>
        <Entypo
          name="text-document"
          color={color}
          size={30}
          style={{
            fontWeight: "bold",
            paddingHorizontal: "1%",
            color: color.LT_APP,
            // alignSelf: "center",
            // marginRight: -50,
          }}
        />
        <Text style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}>
          Terms and Condition
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle}>
        <Entypo
          name="text-document-inverted"
          color={color}
          size={30}
          style={{
            fontWeight: "bold",
            paddingHorizontal: "1%",
            color: color.LT_APP,
            // alignSelf: "center",
            // marginRight: -50,
          }}
        />
        <Text style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}>
          Escrow Term and Condition
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btnStyle} onPress={() => _logout()}>
        <MaterialCommunityIcons
          name="logout"
          color={color}
          size={30}
          style={{
            fontWeight: "bold",
            paddingHorizontal: "2%",
            color: color.LT_APP,
            // alignSelf: "center",
            // marginRight: -50,
          }}
        />
        <Text style={{ color: color.LT_APP, fontSize: 18, fontWeight: "bold" }}>
          Logout
        </Text>
      </TouchableOpacity>

      {/* <RoundCornerButton
        title="Logout"
        btnStyle={{
          alignSelf: "center",
          height: 80,
          width: "90%",
        }}
        onPress={() => _logout()}
        // isLoading={isLoading}
      /> */}
    </View>
  );
};

function MyDrawer(props) {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerStyle={{
        width: "75%",
      }}
      drawerContent={(props) => (
        <CustomDrawerContent {...props} props={props} />
      )}
    >
      <Drawer.Screen
        name="Home"
        component={HomeStackScreen}
        options={{ drawerLabel: "Home" }}
      />
    </Drawer.Navigator>
  );
}

export default MyDrawer;

const styles = StyleSheet.create({
  btnStyle: {
    // marginTop: "5%",
    // marginHorizontal: "5%",
    // borderBottomColor: color.DARK_APP,
    // borderBottomWidth: 1,
    padding: "3%",
    height: 50,
    alignItems: "center",
    marginBottom: "2%",
    flexDirection: "row",
  },
});
