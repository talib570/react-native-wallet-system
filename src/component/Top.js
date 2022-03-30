import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";

import { AppTour, AppTourView } from "react-native-app-tour";

class Top extends Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          key={"Top Left"}
          // title={"Top Left"}
          style={{
            backgroundColor: "transparent",
            // marginLeft: "1%",
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            this.button1 = ref;

            let props = {
              order: 12,
              title: "Logout",
              description: "Want to switch account? Logout here.",
              outerCircleColor: "#3f52ae",
              cancelable: false,
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {
            let props = {
              order: 11,
              title: "Logout",
              description: "Wanna Switch Account? Logout here",
              outerCircleColor: "#f24481",
            };

            let targetView = AppTourView.for(this.button1, {
              ...props,
            });

            AppTour.ShowFor(targetView);
          }}
        ></TouchableOpacity>

        <TouchableOpacity
          key={"Top Right"}
          // title={"Top Right"}
          style={{
            backgroundColor: "transparent",
            marginRight: "3%",
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            this.button2 = ref;

            let props = {
              order: 11,
              title: "Notifications",
              description: "Wanna know who request for payments? Check here",
              backgroundPromptColor: "#3f52ae",
              outerCircleColor: "#f24481",
              targetRadius: 100,
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
    justifyContent: "space-between",
    // marginTop: "-1%",
    marginLeft: "5%",
    // flex: 1,
  },
});

export default Top;
