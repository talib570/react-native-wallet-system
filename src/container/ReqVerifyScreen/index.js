import React, { useEffect, useState } from "react";
import * as Translator from "../../localization/";
import * as Contacts from "expo-contacts";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    SafeAreaView,
    View,
    FlatList,
    Image,
    StatusBar,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import CheckBox from "@react-native-community/checkbox";
import { color, globalStyle, WIDTH } from "../../utility";
import { InputField, RoundCornerButton } from "../../component";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { circle } from "react-native/Libraries/Animated/Easing";

const ReqVerifyScreen = ({ navigation }) => {
    const [locale, setLang] = useState("");
    const [contactDetails, setContactDetails] = useState({});
    const selectedContacts = [];
    const [value, setValue] = useState("");
    const [isChecked, setChecked] = useState([]);
    Translator.default(locale, true);
    useEffect(() => {
        getAsyncStorage(keys.lang)
            .then((res) => {
                setLang(res);
            })
            .catch((err) => {});
        (async() => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === "granted") {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });
                setContactDetails(fetchContactData(data));
            }
        })();
    }, [locale]);

    function fetchContactData(contactList) {
        let userContactDetails = {};
        contactList.forEach((contact) => {
            let phoneNumbers = contact.phoneNumbers;
            if (phoneNumbers) {
                phoneNumbers.forEach((numberObj) => {
                    userContactDetails[numberObj.number] = contact.name;
                });
            }
        });
        var userContactList = [];
        Object.keys(userContactDetails).forEach((key) => {
            userContactList.push({
                name: userContactDetails[key],
                phoneNumber: key,
            });
        });
        return userContactList;
    }

    const renderItem = ({ item }) => (
        // console.log(item.phoneNumber,'==='),
        <
        Item name = { item.name }
        number = { item.phoneNumber }
        />
    );

    const updateSelectionList = (selectedObject, value) => {
        console.log("selectedObj", selectedObject);
        console.log("value", value);
        setChecked(value);
        if (value) {
            selectedContacts.push(selectedObject);
        } else {
            selectedContacts.pop(selectedObject);
        }
        console.log(selectedContacts);
    };
    const Item = ({ name, number }) => (
        // console.log(isChecked[index],'=====',index,'==',number === isChecked[0]),

        <
        View style = {
            {
                flexDirection: "row",
                borderRadius: 15,
                padding: 10,
                justifyContent: "space-around",
                marginVertical: 8,
                width: "70%",
            }
        } >
        <
        CheckBox tintColors = {
            { true: color.DARK_APP } }
        disabled = { false }
        boxType = { circle }
        value = { number == isChecked[isChecked.indexOf(number)] }
        onChange = {
            () => {
                if (isChecked.indexOf(number) >= 0) {
                    let index = isChecked.indexOf(number);
                    isChecked.splice(index, 1);
                    console.log(
                        "=============",
                        number,
                        "======",
                        isChecked.indexOf(number),
                        "==========",
                        index
                    );
                    console.log("value at", isChecked);
                } else {
                    isChecked.push(number);
                    console.log(
                        "=============",
                        number,
                        "======",
                        isChecked.indexOf(number),
                        "==========",
                        number == isChecked
                    );
                    console.log("value ===", isChecked);
                }
                // updateSelectionList(selectedObject, isChecked)
            }
        }
        /> <
        View style = { styles.buttonContainer } >
        <
        TouchableOpacity style = { styles.circle }
        onPress = {
            () => {
                if (number == isChecked[isChecked.indexOf(number)]) {
                    let index = isChecked.indexOf(number);
                    isChecked.splice(index, 1);
                    console.log(
                        number == isChecked[isChecked.indexOf(number)],
                        "=============",
                        number,
                        "======",
                        isChecked.indexOf(number),
                        "==========",
                        index
                    );
                    console.log("value at", isChecked);
                } else {
                    isChecked.push(number);
                    console.log(
                        number == isChecked[isChecked.indexOf(number)],
                        "=============",
                        number,
                        "======",
                        isChecked.indexOf(number),
                        "==========",
                        number == isChecked
                    );
                    console.log("value ===", isChecked);
                }
                // updateSelectionList(selectedObject, isChecked)
            }
        } >
        {
            number == isChecked[isChecked.indexOf(number)] ? ( <
                View style = { styles.circle }
                />
            ) : ( <
                View style = { styles.checkedCircle }
                />
            )
        } <
        /TouchableOpacity> <
        /View> <
        Image source = { require("../../../assets/icon1.png") }
        style = {
            { height: 40, width: 40, alignSelf: "center", borderRadius: 15 } }
        /> <
        View style = {
            { paddingHorizontal: 10, width: "50%" } } >
        <
        Text style = {
            {
                fontWeight: "400",
                width: WIDTH,
                paddingLeft: 2,
                fontSize: 18,
                color: color.BLACK,
            }
        } >
        { name } <
        /Text> <
        Text style = {
            { color: color.BLACK } } > { number } < /Text> <
        /View> { /* <Text style={{ fontWeight: '400', fontSize: 18, alignSelf: 'center', width: '40%', color: color.WHITE }}>{amt}</Text> */ } <
        /View>
    );

    return ( <
        SafeAreaView style = {
            [globalStyle.flex1] } >
        <
        StatusBar backgroundColor = { color.DARK_APP }
        /> <
        View style = { styles.container } >
        <
        Text style = { styles.head } > { Translator.getString("requestMoneyTfr") } <
        /Text> {
            /* <View style={[globalStyle.row, { paddingHorizontal: 20 }]}>
                                <MaterialCommunityIcons name="account-search-outline" size={30} color={color.WHITE} style={{ alignSelf: 'center' }} />
                                <InputField
                                    placeholder={Translator.getString('enterNamePhoneLabel')}
                                    inputStyle={styles.input}
                                />
                            </View> */
        } <
        /View>

        <
        Text style = {
            [
                styles.head,
                { color: color.DARK_APP, alignSelf: "flex-start", padding: 10 },
            ]
        } >
        { Translator.getString("grpOfFrndLabel") } <
        /Text> <
        Text style = {
            [
                styles.head,
                { color: color.DARK_APP, alignSelf: "flex-start", padding: 10 },
            ]
        } >
        { Translator.getString("personalLabel") } <
        /Text>

        <
        FlatList data = { contactDetails }
        renderItem = { renderItem }
        keyExtractor = {
            (item) => item.phoneNumber }
        showsVerticalScrollIndicator = { false }
        /> <
        RoundCornerButton title = { Translator.getString("nxtLabel") }
        /> <
        /SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.DARK_APP,
        paddingBottom: 10,
    },
    head: {
        color: color.WHITE,
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
    },
    input: {
        width: "90%",
        backgroundColor: color.TRANSPARENT,
        borderColor: color.TRANSPARENT,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
    },
    circle: {
        height: 20,
        width: 20,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: color.DARK_APP,
        alignItems: "center",
        justifyContent: "center",
    },
    checkedCircle: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: color.DARK_APP,
    },
});

export default ReqVerifyScreen;