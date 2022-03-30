/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { Component } from "react";
import {
  StatusBar,
  SafeAreaView,
  Platform,
  DeviceEventEmitter,
  StyleSheet,
  View,
} from "react-native";
import { AppTour, AppTourSequence, AppTourView } from "react-native-app-tour";
import { connect } from "react-redux";
import { isNew } from "../../redux/actions";

import Top from "../../component/Top";
import Center from "../../component/Center";
import Bottom from "../../component/Bottom";

class App extends Component {
  constructor(props) {
    super(props);

    this.appTourTargets = [];
  }

  UNSAFE_componentWillMount() {
    this.registerSequenceStepEvent();
    this.registerFinishSequenceEvent();
  }

  componentDidMount() {
    setTimeout(() => {
      let appTourSequence = new AppTourSequence();
      this.appTourTargets.forEach((appTourTarget) => {
        appTourSequence.add(appTourTarget);
      });

      AppTour.ShowSequence(appTourSequence);
    }, 1000);
  }

  registerSequenceStepEvent = () => {
    if (this.sequenceStepListener) {
      this.sequenceStepListener.remove();
    }
    this.sequenceStepListener = DeviceEventEmitter.addListener(
      "onShowSequenceStepEvent",
      (e: Event) => {
        console.log(e);
      }
    );
  };

  registerFinishSequenceEvent = () => {
    if (this.finishSequenceListener) {
      this.finishSequenceListener.remove();
    }
    this.finishSequenceListener = DeviceEventEmitter.addListener(
      "onFinishSequenceEvent",
      (e: Event) => {
        console.log("EVENT", e);
        e.finish == true && this.props.isNew(false);
      }
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <Top
          style={styles.top}
          addAppTourTarget={(appTourTarget) => {
            this.appTourTargets.push(appTourTarget);
          }}
        />
        <Center
          style={styles.center}
          addAppTourTarget={(appTourTarget) => {
            this.appTourTargets.push(appTourTarget);
          }}
        />
        <Bottom
          style={styles.bottom}
          addAppTourTarget={(appTourTarget) => {
            this.appTourTargets.push(appTourTarget);
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    // position: "absolute",
    // backgroundColor: "transparent",
    // backgroundColor: "blue",
  },
  top: {
    flex: 1,
    // marginTop: "-1%",
    backgroundColor: "red",
  },
  center: {
    flex: 1,
  },
  bottom: {
    flex: 1,
  },
});

export default connect(null, { isNew })(App);
