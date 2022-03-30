import React from "react";
import { View, TouchableOpacity, Text, FlatList } from "react-native";
import { RoundCornerButton } from "../../../component";
import styles from "./styles";

const RadioButton = (props) => {
  let k = "";
  k = props.locale;
  const options = [
    {
      code: "en-US",
      lang: "English",
    },
    {
      code: "fr-FR",
      lang: "French",
    },
  ];
  console.log(props, "==============", props.locale);
  const renderItem = ({ item }) => (
    <ItemHis code={item.code} lang={item.lang} />
  );

  const ItemHis = ({ code, lang }) => (
    <TouchableOpacity style={styles.circle} onPress={() => props.onPress(code)}>
      {k === code && <View style={styles.checkedCircle} />}
    </TouchableOpacity>
  );
  return options.map((item) => {
    return (
      <View key={item.code} style={styles.buttonContainer}>
        {/* <TouchableOpacity
                    style={styles.circle}
                    onPress={() => props.onPress(item.code)}
                    >
                    { k === item.code && (<View style={styles.checkedCircle} />) }
                </TouchableOpacity> */}
        {/* <RoundCornerButton title={item.lang}  btnStyle={{backgroundColor:'transparent'}} onPress={() => props.onPress(item.code)} >
                    { props.locale === item.code && (<View style={styles.checkedCircle} />) }
                </RoundCornerButton> */}
        <FlatList
          data={options}
          renderItem={renderItem}
          keyExtractor={(item) => item.code}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  });
};

export default RadioButton;
