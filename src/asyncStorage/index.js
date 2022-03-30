import AsyncStorage from "@react-native-community/async-storage";

export const keys = {
  lang: "US-en",
  pin: "",
  userLogin: "",
  loggedInUserID: "",
};

const setAsyncStorage = async (key, item) => {
  try {
    console.log("key, item", key, item);
    await AsyncStorage.setItem(key, item);
  } catch (error) {
    console.log(error);
  }
};

const getAsyncStorage = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return value;
    } else {
      return null;
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

const clearAsyncStorage = async () => {
  try {
    await AsyncStorage.clear();
  } catch (error) {
    console.log(error);
  }
};

const clearSingleDataAsyncStorage = async (key) => {
  try {
    console.log("CLEARED =============>>>");
    await AsyncStorage.removeItem(key);
    return true;
  } catch (error) {
    console.log(error);
  }
};

export {
  setAsyncStorage,
  getAsyncStorage,
  clearAsyncStorage,
  clearSingleDataAsyncStorage,
};
