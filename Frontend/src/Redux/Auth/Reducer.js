import {
  GET_DETAILS_FAILURE,
  GET_DETAILS_REQUEST,
  GET_DETAILS_SUCCESS,
  LOGIN_FAILURE,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGOUT,
  REGISTER_FAILURE,
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  UPDATE_DETAILS_FAILURE,
  UPDATE_DETAILS_REQUEST,
  UPDATE_DETAILS_SUCCESS,
} from "./ActionType.js";
import { jwtDecode } from "jwt-decode";
import { isTokenValid } from "./isTokenValid.js";

const storedAccessToken = localStorage.getItem("accessToken");
const storedRefreshToken = localStorage.getItem("refreshToken");

let decoded = null;
if (storedAccessToken && isTokenValid(storedAccessToken)) {
  decoded = jwtDecode(storedAccessToken);
} else {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

const initialState = {
  accessToken: decoded ? storedAccessToken : null,
  refreshToken: decoded ? storedRefreshToken : null,
  isAdmin: decoded?.role === "ADMIN",
  isAuthenticated: !!decoded,
  loading: false,
  error: null,
  email: decoded?.sub || null,
  currentUser: null,
  currentUserLoading: null,
  currentUserError: false,
  udpateUserLoading: null,
  updateUserError: null,
};

export const authReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    // Register
    case REGISTER_REQUEST:
      return { ...store, loading: true, error: null };
    case REGISTER_SUCCESS:
      const decoded = jwtDecode(payload.accessToken);
      return {
        ...store,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        email: decoded.username,
        isAdmin: decoded.role === "ADMIN",
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case REGISTER_FAILURE:
      return {
        ...store,
        loading: false,
        error: payload,
      };
    // Login
    case LOGIN_REQUEST:
      return { ...store, loading: true, error: null };
    case LOGIN_SUCCESS:
      const loginDecoded = jwtDecode(payload.accessToken);

      return {
        ...store,
        accessToken: payload.accessToken,
        refreshToken: payload.refreshToken,
        email: loginDecoded.sub,
        isAdmin: loginDecoded.role === "ADMIN",
        isAuthenticated: true,
        loading: false,
        error: null,
      };
    case LOGIN_FAILURE:
      return {
        ...store,
        loading: false,
        error: payload,
      };
    case LOGOUT:
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      return {
        ...initialState,
        isAuthenticated: false,
      };
    case GET_DETAILS_REQUEST:
      return { ...store, currentUserLoading: true, currentUserError: null };
    case GET_DETAILS_SUCCESS:
      return { ...store, currentUser: payload, currentUserLoading: false, currentUserError: null };
    case GET_DETAILS_FAILURE:
      return { ...store, currentUserLoading: false, currentUserError: payload };
    case UPDATE_DETAILS_REQUEST:
      return { ...store, udpateUserLoading: true, updateUserError: null };
    case UPDATE_DETAILS_SUCCESS:
      return { ...store, udpateUserLoading: false, updateUserError: null };
    case UPDATE_DETAILS_FAILURE:
      return { ...store, udpateUserLoading: false, updateUserError: payload };
    default:
      return store;
  }
};
