import { StyleSheet } from "react-native";
import { verticalScale, scale } from "react-native-size-matters";
import { WIDTH, color } from "../../utility";

export default StyleSheet.create({
  container: {
    height: 6 * verticalScale(45),
    width: "100%",
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    bottom: verticalScale(20),
    backgroundColor: color.DARK_APP,
  },
  keyboard: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
  },
  key: {
    width: WIDTH / 3,
    height: verticalScale(70),
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: scale(25),
    fontWeight: "600",
    color: color.WHITE,
  },
});
