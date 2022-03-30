import { LOADING, LOGIN_USER } from "./type";
import {
  getAsyncStorage,
  keys,
  setAsyncStorage,
  clearSingleDataAsyncStorage,
} from "../../asyncStorage";
import { currentUser } from "../../appData";

export const isLoadingAction = () => {
  return { type: LOADING };
};

export async function userLogin(data) {
  console.log("data in context", data);

  return { type: LOGIN_USER, payload: data };
}
