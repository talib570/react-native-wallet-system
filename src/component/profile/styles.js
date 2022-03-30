import { StyleSheet } from "react-native";
import { appStyle, color } from "../../utility";
import { smallDeviceHeight } from "../../utility/constants";

const getDimensions = (key) => {
  if (appStyle.deviceHeight > smallDeviceHeight) {
    switch (key) {
      case "imgContainer":
        return {
          height: 80,
          width: 80,
          borderRadius: 40,
          borderWidth: 2,
          borderColor: color.DARK_APP,
        };
      case "img":
        return {
          height: 76,
          width: 76,
          borderRadius: 38,
        };
      case "editImgContainer":
        return {
          height: 20,
          width: 20,
          borderRadius: 10,
          backgroundColor: color.BLACK,
          position: "absolute",
          right: 0,
          bottom: 0,
        };

      default:
        return null;
    }
  } else {
    switch (key) {
      case "imgContainer":
        return {
          height: 124,
          width: 124,
          borderRadius: 62,
          borderWidth: 2,
          borderColor: color.WHITE,
        };
      case "img":
        return {
          height: 120,
          width: 120,
          borderRadius: 60,
        };
      case "editImgContainer":
        return {
          height: 40,
          width: 40,
          borderRadius: 20,
          backgroundColor: color.SEMI_TRANSPARENT,
          position: "absolute",
          right: 10,
          bottom: 10,
        };

      default:
        return null;
    }
  }
};

export default StyleSheet.create({
  container: {
    paddingVertical: 10,
  },
  imgContainer: getDimensions("imgContainer"),
  img: getDimensions("img"),
  editImgContainer: getDimensions("editImgContainer"),
  name: {
    color: appStyle.fieldTextColor,
    fontSize: 50,
    fontWeight: "bold",
  },
  welcome: {
    color: appStyle.fieldTextColor,
    fontSize: 24,
    fontWeight: "bold",
    padding: 10,
  },
});
