import React from "react";
import { View, Image } from "react-native";
import styles from "./styles";

const logo = require("../../../assets/images/logo.png");

export default ({ logoStyle, imgStyle }) => (
  <View style={[styles.logo, logoStyle]}>
    <Image style={[styles.img, imgStyle]} source={logo} />
  </View>
);
