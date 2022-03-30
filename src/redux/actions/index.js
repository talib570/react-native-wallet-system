import { GET_DATA, UPDATE_DATA, NEW_USER, CONTACTS, QR_CODE } from "./types";

import axios from "axios";

export const getData = (data) => {
  return {
    type: GET_DATA,
    payload: data,
  };
};

export const updateData = (data) => {
  return {
    type: UPDATE_DATA,
    payload: data,
  };
};

export const isNew = (status) => {
  return {
    type: NEW_USER,
    payload: status,
  };
};

export const contactList = (list) => {
  return {
    type: CONTACTS,
    payload: list,
  };
};
export const qrPermission = (status) => {
  return {
    type: QR_CODE,
    payload: status,
  };
};
