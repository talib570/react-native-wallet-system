import {
  GET_DATA,
  UPDATE_DATA,
  NEW_USER,
  CONTACTS,
  QR_CODE,
} from "../actions/types";

const initialState = {
  // token: "",
  // userData: {},
  // websettings: [],
  USERDATA: null,
  IS_NEW: false,
  CONTACT_LIST: [],
  QRCODE_PERMISSION: null,
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_DATA:
      return {
        ...state,
        USERDATA: action.payload,
      };

    case UPDATE_DATA:
      return {
        ...state,
        USERDATA: action.payload,
      };

    case NEW_USER:
      return {
        ...state,
        IS_NEW: action.payload,
      };
    case CONTACTS:
      return {
        ...state,
        CONTACT_LIST: action.payload,
      };
    case QR_CODE:
      return {
        ...state,
        QRCODE_PERMISSION: action.payload,
      };

    default:
      return state;
  }
}
