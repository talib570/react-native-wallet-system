import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import styles from "./styles";

export default ({
  title,
  btnStyle,
  btnTextStyle,
  onPress,
  isLoading,
  customStyle,
}) => (
  <TouchableOpacity
    style={[styles.btn, btnStyle, customStyle]}
    onPress={onPress}
  >
    {isLoading == true ? (
      <ActivityIndicator
        size="large"
        color="#fff"
        style={[styles.text, btnTextStyle, { paddingHorizontal: "6%" }]}
      />
    ) : (
      <Text style={[styles.text, btnTextStyle]}>{title}</Text>
    )}
  </TouchableOpacity>
);
