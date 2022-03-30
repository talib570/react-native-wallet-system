import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RoundCornerButton } from "..";
import { color } from "../../utility";
import styles from "./styles";

const keys = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  ".",
  "0",
  <Ionicons name="ios-backspace" size={30} />,
];

const keys2 = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "+",
  "0",
  <Ionicons name="ios-backspace" size={30} />,
];

const Keyboard = (props) => {
  const renderKeys = () =>
    keys.map((key, i) => (
      <TouchableOpacity
        key={i}
        style={styles.key}
        onPress={() => props.onPress(key)}
      >
        <Text style={styles.text}>{key}</Text>
      </TouchableOpacity>
    ));

  const renderMyKeys = () =>
    keys2.map((key, i) => (
      <TouchableOpacity
        key={i}
        style={styles.key}
        onPress={() => props.onPress(key)}
      >
        <Text style={styles.text}>{key}</Text>
      </TouchableOpacity>
    ));
  return (
    <View style={styles.container}>
      <View style={styles.keyboard}>
        {props.myKeys ? renderMyKeys() : renderKeys()}
      </View>
    </View>
  );
};

export default Keyboard;
