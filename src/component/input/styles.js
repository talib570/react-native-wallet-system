import { StyleSheet } from "react-native";
import { appStyle, color } from "../../utility";

export default StyleSheet.create({
  input: {
    backgroundColor: color.WHITE,
    width: "90%",
    color: color.WHITE,
    height: appStyle.fieldHeight,
    alignSelf: "center",
    marginVertical: appStyle.fieldMarginVertical,
    fontSize: 15,
    fontWeight: "bold",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: color.WHITE,
  },
});
