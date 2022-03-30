import { Dimensions, Platform } from "react-native";

// screen height
export const HEIGHT = Dimensions.get("window").height;
// screen width
export const WIDTH = Dimensions.get("window").width;

// is android device
export const IS_ANDROID = Platform.OS === "android";
// is ios device
export const IS_iOS = Platform.OS === "ios";
// is iphone x
export const IS_IPHONE_X = HEIGHT === 812 || HEIGHT === 896;

export const smallDeviceHeight = 650;

export const countryCodeSupported = ["237"];

export const defaultCountryCode = countryCodeSupported[0];

export const url = "https://americanqualitis.com/";
// export const url = "http://192.168.18.176/payvits/public/";
