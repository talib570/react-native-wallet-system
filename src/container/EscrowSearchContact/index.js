import React, { useEffect, useState, useCallback } from "react";
import * as Translator from "../../localization";
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
    ScrollView,
    ActivityIndicator,
} from "react-native";
import { getAsyncStorage, keys } from "../../asyncStorage";
import CheckBox from "@react-native-community/checkbox";
import { appStyle, color, globalStyle, WIDTH } from "../../utility";
import { InputField, RoundCornerButton, GoBack } from "../../component";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { circle } from "react-native/Libraries/Animated/Easing";
import { useSelector, useDispatch } from "react-redux";
import BackgroundTimer from "react-native-background-timer";

import { useIsFocused } from "@react-navigation/native";

const RequestScreen = ({ navigation }) => {
    const state = useSelector((state) => state.root);
    const { USERDATA, CONTACT_LIST } = state;

    const isFocused = useIsFocused();

    const [locale, setLang] = useState("");
    const [contactDetails, setContactDetails] = useState(null);
    const [search, setSearch] = useState(null);
    const selectedContacts = [];
    const [value, setValue] = useState(null);
    const [isChecked, setChecked] = useState([]);
    const [isLoading, setLoading] = useState(true);

    const [toggleCheckBox, setToggleCheckBox] = useState(null);

    Translator.default(locale, true);

    useEffect(() => {
        isFocused == true && BackgroundTimer.stopBackgroundTimer();

        setContactDetails(CONTACT_LIST);

        getAsyncStorage(keys.lang)
            .then((res) => {
                setLang(res);
            })
            .catch((err) => {});

        return () => setLoading(true);
    }, [locale]);

    setTimeout(() => {
        setLoading(false);
    }, 2000);

    // class RenderItem extends React.PureComponent {
    //   render() {
    //     return (
    //       <Item
    //         name={this.props.item.name}
    //         number={this.props.item.phoneNumber}
    //         index={this.props.index}
    //       />
    //     );
    //   }
    // }

    // const selectedUser = ({ item }) => {
    //   // console.log(
    //   //   item.phoneNumber,
    //   //   item.name,
    //   //   "=================",
    //   //   isChecked[isChecked.indexOf(item.phoneNumber)]
    //   // );
    //   if (item.phoneNumber == isChecked[isChecked.indexOf(item.phoneNumber)]) {
    //     return (
    //       <View
    //         style={[
    //           globalStyle.sectionCentered,
    //           styles.img,
    //           { backgroundColor: color.DARK_GRAY },
    //         ]}
    //       >
    //         <Text style={styles.name}>{item.name.charAt(0)}</Text>
    //       </View>
    //     );
    //   }
    // };

    // const Item = ({ name, number, index }) => {
    //   // console.log(index + 1, number, name, "================= ITEMS RENDERED");
    //   return (
    //     <View
    //       style={{
    //         flexDirection: "row",
    //         backgroundColor: color.DARK_GRAY,
    //         borderRadius: 15,
    //         padding: 10,
    //         justifyContent: "flex-start",
    //         marginVertical: 8,
    //         width: "90%",
    //         marginHorizontal: "5%",
    //         height: 70,
    //       }}
    //     >
    //       <CheckBox
    //         style={{ alignSelf: "center" }}
    //         tintColors={{ true: color.DARK_APP }}
    //         disabled={false}
    //         boxType={circle}
    //         value={number == toggleCheckBox}
    //         // value={toggleCheckBox}
    //         onValueChange={() =>
    //           setToggleCheckBox(number == toggleCheckBox ? null : number)
    //         }
    //         onChange={() => setValue({ name, number })}
    //       />

    //       <View
    //         style={[
    //           globalStyle.sectionCentered,
    //           styles.img,
    //           { backgroundColor: color.DARK_GRAY },
    //         ]}
    //       >
    //         <Text style={styles.name}>{name.charAt(0)}</Text>
    //       </View>
    //       <View style={{ paddingHorizontal: 10, width: "50%" }}>
    //         <Text
    //           style={{
    //             fontWeight: "400",
    //             width: WIDTH,
    //             paddingLeft: 2,
    //             fontSize: 18,
    //             color: color.BLACK,
    //           }}
    //         >
    //           {name}
    //         </Text>
    //         <Text style={{ color: color.BLACK, width: WIDTH }}>{number}</Text>
    //       </View>
    //       {/* <Text style={{ fontWeight: '400', fontSize: 18, alignSelf: 'center', width: '40%', color: color.WHITE }}>{amt}</Text> */}
    //     </View>
    //   );
    // };

    // const renderItem = ({ item, index }) => {
    //   return search != null ? (
    //     item.name.toLowerCase().includes(search.toLowerCase()) ? (
    //       <RenderItem item={item} index={index} />
    //     ) : (
    //       item.phoneNumber.includes(search) && (
    //         <RenderItem item={item} index={index} />
    //       )
    //     )
    //   ) : (
    //     <RenderItem item={item} index={index} />
    //   );
    // };

    // const HEIGHT = 70;

    // const getItemLayout = useCallback(
    //   (data, index) => ({
    //     length: HEIGHT,
    //     offset: HEIGHT * index,
    //     index,
    //   }),
    //   []
    // );

    /**
     *
     * MY CUSTOM LIST
     *
     */

    const listPressed = (name, phone) => {
        setToggleCheckBox(phone == toggleCheckBox ? null : phone);
        setValue({ name, phone });
    };

    const List = ({ name, phone, index }) => {
        return ( <
            TouchableOpacity style = {
                {
                    ...styles.contactList,
                        backgroundColor:
                        toggleCheckBox != phone ? color.DARK_GRAY : color.DARK_APP,
                }
            }
            onPress = {
                () => listPressed(name, phone) } >
            {
                /* <CheckBox
                          style={{ alignSelf: "center" }}
                          tintColors={{ true: color.DARK_APP }}
                          disabled={false}
                          boxType={circle}
                          value={phone == toggleCheckBox}
                          // value={toggleCheckBox}
                          onValueChange={() =>
                            setToggleCheckBox(phone == toggleCheckBox ? null : phone)
                          }
                          onChange={() => setValue({ name, phone })}
                        /> */
            }

            <
            View style = {
                [
                    globalStyle.sectionCentered,
                    styles.img,
                    { backgroundColor: color.DARK_GRAY },
                ]
            } >
            <
            Text style = { styles.name } > { name.charAt(0) } < /Text> <
            /View> <
            View style = {
                { paddingHorizontal: 10, width: "50%" } } >
            <
            Text style = {
                [
                    styles.nameList,
                    { color: toggleCheckBox != phone ? color.BLACK : color.WHITE },
                ]
            } >
            { name } <
            /Text> <
            Text style = {
                {
                    color: toggleCheckBox != phone ? color.BLACK : color.WHITE,
                    width: WIDTH,
                }
            } >
            { phone } <
            /Text> <
            /View> <
            /TouchableOpacity>
        );
    };

    return isLoading ? ( <
        ActivityIndicator color = { color.DARK_APP }
        size = "large"
        style = {
            { marginTop: "5%" } }
        />
    ) : ( <
        SafeAreaView style = {
            [globalStyle.flex1] } >
        <
        StatusBar backgroundColor = { color.DARK_APP }
        /> <
        View style = { styles.container } >
        <
        GoBack top = "3%"
        left = "8%"
        size = { 20 }
        clr = { "#fff" }
        /> <
        Text style = { styles.head } > { /* {Translator.getString("requestMoneyTfr")} */ }
        Money Transfer <
        /Text> <
        View style = {
            [globalStyle.row, { paddingHorizontal: 20 }] } >
        <
        MaterialCommunityIcons name = "account-search-outline"
        size = { 30 }
        color = { color.WHITE }
        style = {
            { alignSelf: "center" } }
        /> <
        InputField placeholder = { Translator.getString("enterNamePhoneLabel") }
        inputStyle = { styles.input }
        onChangeText = {
            (text) => setSearch(text) }
        value = { search }
        /> <
        /View> <
        /View>

        <
        View style = {
            { flex: 1 } } >
        <
        ScrollView showsVerticalScrollIndicator = { false } > {
            contactDetails &&
            contactDetails.map((v, i) => {
                return search != null ? (
                    v.name.toLowerCase().includes(search.toLowerCase()) ? ( <
                        List key = { i }
                        name = { v.name }
                        phone = { v.phoneNumber }
                        index = { i }
                        />
                    ) : (
                        v.phoneNumber.includes(search) && ( <
                            List key = { i }
                            name = { v.name }
                            phone = { v.phoneNumber }
                            index = { i }
                            />
                        )
                    )
                ) : ( <
                    List key = { i }
                    name = { v.name }
                    phone = { v.phoneNumber }
                    index = { i }
                    />
                );
            })
        } <
        /ScrollView> <
        /View>

        {
            /* <FlatList
                    data={contactDetails}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index}
                    showsVerticalScrollIndicator={false}
                    initialNumToRender={10}
                    maxToRenderPerBatch={100}
                    updateCellsBatchingPeriod={20}
                    getItemLayout={getItemLayout}
                  /> */
        }

        <
        > {
            /* <FlatList
                      data={contactDetails}
                      renderItem={selectedUser}
                      keyExtractor={(item) => item.phoneNumber}
                      horizontal={true}
                      showsHorizontalScrollIndicator={false}
                    /> */
        } <
        RoundCornerButton title = { Translator.getString("nxtLabel") }
        // onPress={() => navigation.navigate("ReqVerifyScreen")}
        onPress = {
            () =>
            toggleCheckBox ?
            (navigation.navigate("PayWithEscrow", {
                    data: {
                        name: value && value.name,
                        phoneNumber: value && value.phone,
                        amount: 0,
                    },
                    token: USERDATA.user_data.token,
                }),
                console.log("value", value)) :
                alert("Please Select Phone Number!")
        }
        btnStyle = {
            {
                alignSelf: "flex-end",
                marginRight: "2%",
            }
        }
        /> <
        /> <
        /SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: color.DARK_APP,
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
    name: {
        color: color.DARK_APP,
        fontSize: 30,
        fontWeight: "bold",
    },
    img: {
        height: 46,
        width: 46,
        borderRadius: 23,
    },
    contactList: {
        flexDirection: "row",

        borderRadius: 15,
        padding: 10,
        justifyContent: "flex-start",
        marginVertical: 8,
        width: "90%",
        marginHorizontal: "5%",
        // height: 70,
    },
    nameList: {
        fontWeight: "400",
        width: WIDTH,
        paddingLeft: 2,
        fontSize: 18,
        color: color.BLACK,
    },
});

export default RequestScreen;