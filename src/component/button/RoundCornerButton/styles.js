import { StyleSheet } from "react-native";
import { appStyle, color, WIDTH } from "../../../utility";

export default StyleSheet.create({
  btn: {
    backgroundColor: "#630c63",
    height: appStyle.btnHeight,
    borderRadius: appStyle.btnBorderRadius,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: appStyle.btnMarginVertical,
  },
  text: {
    fontSize: 20,
    fontWeight: "bold",
    paddingHorizontal: 12,
    color: color.WHITE,
  },
});
