import {
  AUTH_FAILURE,
  AUTH_LOGOUT,
  AUTH_START,
  AUTH_SUCCESS,
} from "../types";

const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_START:
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case AUTH_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case AUTH_FAILURE:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case AUTH_LOGOUT:
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    default:
      return state;
  }
};

export default authReducer;

