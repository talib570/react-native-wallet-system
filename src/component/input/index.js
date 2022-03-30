import React from "react";
import { TextInput, Text } from "react-native";
import styles from "./styles";
import { color } from "../../utility";

export default ({
  placeholder,
  inputStyle,
  placeholderTextColor,
  secureTextEntry,
  onChangeText,
  value,
  keyboardType,
  onSubmitEditing,
  onBlur,
  onFocus,
  numberOfLines,
  maxLength,
  multiline,
  editable,
  showSoftInputOnFocus,
}) => (
  <TextInput
    style={[styles.input, inputStyle]}
    value={value}
    keyboardType={keyboardType}
    maxLength={maxLength}
    multiline={multiline}
    numberOfLines={numberOfLines}
    onChangeText={onChangeText}
    secureTextEntry={secureTextEntry}
    placeholder={placeholder}
    placeholderTextColor={
      placeholderTextColor ? placeholderTextColor : color.WHITE
    }
    onSubmitEditing={onSubmitEditing}
    onBlur={onBlur}
    onFocus={onFocus}
    editable={editable}
    showSoftInputOnFocus={showSoftInputOnFocus && showSoftInputOnFocus}
  />
);
