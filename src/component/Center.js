import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Button,
  Platform,
  TouchableOpacity,
} from "react-native";

import { AppTourView } from "react-native-app-tour";

class Center extends Component {
  render() {
    return (
      <View style={styles.container}>
        {/* <TouchableOpacity
          key={"Center Left"}
          title={"Center Left"}
          style={{
            backgroundColor: "transparent",
            // marginLeft: "3%",
            height: 40,
            width: 50,
          }}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 23,
              title: "Your Balance",
              description: "Your Current Balance here.",
              outerCircleColor: "#3f52ae",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        ></TouchableOpacity> */}
        {/* <Button
          key={"Center Center"}
          title={"Center Center"}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 21,
              title: "This is a target button 4",
              description: "We have the best targets, believe me",
              outerCircleColor: "#f24481",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        />
        <Button
          key={"Center Right"}
          title={"Center Right"}
          ref={(ref) => {
            if (!ref) return;

            let props = {
              order: 22,
              title: "This is a target button 5",
              description: "We have the best targets, believe me",
              outerCircleColor: "#3f52ae",
            };

            this.props.addAppTourTarget &&
              this.props.addAppTourTarget(AppTourView.for(ref, { ...props }));
          }}
          onPress={() => {}}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    // backgroundColor: "red",
    marginTop: "-65%",
    marginRight: "-22%",
    // flex: 1,
  },
});

export default Center;
