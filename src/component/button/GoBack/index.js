import React from "react";
import { TouchableOpacity, Text, ActivityIndicator } from "react-native";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default (props) => {
  const { top, left, clr, size, onPress, px } = props;
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      style={{
        top: top ? top : "3%",
        left: left ? left : "5%",
        position: "absolute",
        // backgroundColor: "red",
        paddingHorizontal: px ? px : 10,
      }}
      onPress={() =>
        onPress
          ? navigation.navigate("HomeTab", { screen: onPress })
          : navigation.goBack()
      }
    >
      <FontAwesome5
        name="chevron-left"
        size={size ? size : 30}
        color={clr ? clr : "#fff"}
      />
    </TouchableOpacity>
  );
};
