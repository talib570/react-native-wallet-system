import React, { useReducer, useEffect, useState } from "react";
import Reducer from "../reducers/loader";

export const Store = React.createContext();

export function StoreProvider(props) {
  const [contextState, setContextState] = useState({});

  useEffect(() => {
    console.log("CONTEXT UPDATED =============>>>>>>>>>>>>", contextState);
  }, [contextState]);

  // * VALUES IN A SINGLE VARIABLE
  const value = {
    contextState,
    setContextState,
  };
  // * STORE
  return <Store.Provider value={value}>{props.children}</Store.Provider>;
}
