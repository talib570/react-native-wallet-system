/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, { useRef, useState, useEffect } from "react";
import NavContainer from "./src/navigation";
// import {Loader} from "./src/component";
import { StoreProvider } from "./src/context/store";
import { StatusBar, SafeAreaView } from "react-native";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { Provider } from "react-redux";

const App = () => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Provider store={store}>
        <PersistGate persistor={persistor}>
          <StoreProvider>
            <StatusBar barStyle="light-content" />
            <NavContainer />
          </StoreProvider>
        </PersistGate>
      </Provider>
    </SafeAreaView>
  );
};

export default App;
