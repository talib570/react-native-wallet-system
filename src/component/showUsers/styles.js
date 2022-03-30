import { StyleSheet } from "react-native";
import { color } from "../../utility";

export default StyleSheet.create({
  cardStyle: {
    backgroundColor: color.SEMI_TRANSPARENT,
    borderColor: color.BLACK,
    elevation: 0.8,
  },
  cardItemStyle: {
    backgroundColor: color.BLACK,
  },

  logoContainer: {
    height: 60,
    width: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: color.DARK_GRAY,
  },
  thumbnailName: { fontSize: 30, color: color.WHITE, fontWeight: "bold" },
  profileName: { fontSize: 15, color: color.WHITE, fontWeight: "bold" },
});
