import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";

import { AppTourView } from "react-native-app-tour";

class Bottom extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={"Bottom Left"}
          // title={"Left"}
          style={{
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 33,
              title: "Generate QRCode",
              description:
                "Generate QRCode for Sharing With Others And Request Amounts",
              outerCircleColor: "#3f52ae",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        ></TouchableOpacity>

        <TouchableOpacity
          key={"Bottom Center"}
          // title={"Center"}
          style={{
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 32,
              title: "Scan QRCode",
              description: "Scan QRCode to Transfer Money",
              outerCircleColor: "#f24481",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        ></TouchableOpacity>

        <TouchableOpacity
          key={"Bottom Right"}
          // title={"Right"}

          style={{
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 31,
              title: "Request Payments",
              description: "Request Your Amount From Anybody here.",
              outerCircleColor: "#f24481",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        ></TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "transparent",
    // backgroundColor: "red",
    marginBottom: "3%",
    // alignSelf: "center",
    marginHorizontal: "20%",
    // flex: 1,
  },
});

export default Bottom;
