import { LOADING, LOGIN_USER } from "../../actions/type";

const reducer = (state, action) => {
  const { type, payload } = action;
  switch (type) {
    case LOADING:
      return {
        ...state,
        loading: true,
      };

    case LOGIN_USER:
      return {
        ...state,
        userData: payload,
      };

    default:
      return state;
  }
};

export default reducer;
