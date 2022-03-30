import React, { useEffect, useState, useRef, useContext } from "react";
import * as Translator from "../../localization/";
import {
  StyleSheet,
  Image,
  StatusBar,
  Text,
  View,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import { InputField, Logo, Profile, RoundCornerButton } from "../../component";
import { color, HEIGHT, WIDTH, url } from "../../utility";
import { getAsyncStorage, keys, setAsyncStorage } from "../../asyncStorage";
// import * as ImagePicker from "expo-image-picker";
import { currentUser, currentUserID } from "../../appData";
import axios from "axios";
import { Store } from "../../context/store";
import { useSelector, useDispatch } from "react-redux";
import { getData, isNew } from "../../redux/actions";
import DocumentPicker from "react-native-document-picker";

const statusHeight = StatusBar.currentHeight;
//TODO: update locale from radio option and get from props here
//const locale = "en-US"
const NewUser = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const userData = route.params.userData;
  const { contextState, setContextState } = useContext(Store);

  const [phone, setPhone] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [pic, setPic] = useState("");
  let [selectedImage, setSelectedImage] = useState("");
  const [locale, setLang] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  Translator.default(locale, true);

  useEffect(() => {
    console.log("userData", userData);
    getAsyncStorage(keys.lang)
      .then((res) => {
        setLang(res);
      })
      .catch((err) => {});
  }, [locale]);

  const onUpdatePress = async () => {
    // if(!phone && phone == ''){
    //   alert('Field Should be Not Empty!');
    // } else
    if (!fName && fName == "") {
      alert("Field Should be Not Empty!");
    } else if (!lName && lName == "") {
      alert("Field Should be Not Empty!");
    } else {
      try {
        const formBody = new FormData();
        formBody.append("first_name", fName);
        formBody.append("last_name", lName);
        formBody.append("image", {
          type: pic.type,
          name: pic.name,
          uri: pic.uri,
        });

        const res = await axios.post(url + "api/update_record", formBody, {
          headers: {
            Authorization: "Bearer " + userData.token,
          },
        });
        console.log("res", res.data);

        setIsLoading(false);

        currentUser.firstName = fName;
        currentUser.lastName = lName;
        currentUser.profileImg = selectedImage;
        currentUser.wallet = {
          balance: userData.user_data.remaining_balance,
          currency: userData.websettings[0].currency,
        };
        currentUser.user_data = userData;

        dispatch(getData(currentUser));
        // setAsyncStorage(keys.userLogin, JSON.stringify(currentUser));

        res.data.status == 200
          ? (navigation.replace("LocalAuth"), dispatch(isNew(true)))
          : alert("Oops! Something went wrong");
      } catch (error) {
        console.log("error", error);
        alert("Oops! Something went wrong");
        setIsLoading(false);
      }
    }
  };

  const selectPhotoTapped = async () => {
    console.log("DocumentPicker", DocumentPicker.pick);

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });
      console.log(
        res.uri,
        res.type, // mime type
        res.name,
        res.size
      );

      setPic(res);
      setSelectedImage({ uri: res.uri });
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  return (
    <>
      <ImageBackground
        source={require("../../../assets/images/bgimg.png")}
        resizeMode="stretch"
        style={{ alignSelf: "center", width: WIDTH, height: HEIGHT }}
      >
        <Logo
          imgStyle={{ width: 250, height: 100 }}
          logoStyle={{
            width: 222,
            height: 100,
            margin: 20,
            alignSelf: "center",
          }}
        />
        <TouchableOpacity onPress={() => selectPhotoTapped()}>
          <Profile
            img={selectedImage.uri}
            name={""}
            // onEditImgTap={() => selectPhotoTapped()}
          />
        </TouchableOpacity>

        <InputField
          placeholder={Translator.getString("fNameLabel")}
          value={fName}
          onChangeText={(input) => setFName(input)}
          inputStyle={{ backgroundColor: "transparent", width: "70%" }}
        />
        <InputField
          placeholder={Translator.getString("lNameLabel")}
          value={lName}
          onChangeText={(input) => setLName(input)}
          inputStyle={{ backgroundColor: "transparent", width: "70%" }}
        />
        {/* <InputField
          value={phone}
          inputStyle={{ backgroundColor: 'transparent', width: '70%' }}
          editable={false}
        /> */}
        <RoundCornerButton
          title={Translator.getString("updateLabel")}
          btnStyle={{ alignSelf: "center" }}
          onPress={onUpdatePress}
          isLoading={isLoading}
        />
        {/* </LinearGradient> */}
      </ImageBackground>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#380638",
    paddingTop: statusHeight == undefined ? 20 : statusHeight,
  },
  subContainer: {
    marginHorizontal: "10%",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  txt: {
    color: color.WHITE,
    fontSize: 18,
    paddingLeft: 5,
    paddingBottom: 10,
  },
});

export default NewUser;
