import {
  CREATE_SOS_FAILURE,
  CREATE_SOS_REQUEST,
  CREATE_SOS_SUCCESS,
  GET_ALL_SOS_FAILURE,
  GET_ALL_SOS_REQUEST,
  GET_ALL_SOS_SUCCESS,
  GET_SOS_BY_ZONE_FAILURE,
  GET_SOS_BY_ZONE_REQUEST,
  GET_SOS_BY_ZONE_SUCCESS,
  MY_SOS_FAILURE,
  MY_SOS_REQUEST,
  MY_SOS_SUCCESS,
  UPDATE_STATUS_FAILURE,
  UPDATE_STATUS_REQUEST,
  UPDATE_STATUS_SUCCESS,
} from "./ActionType";

const initialState = {
  allSos: null,
  allSosLoading: null,
  allSosError: null,
  createSosLoading: null,
  createSosError: null,
  zoneSos: null,
  zoneSosLoading: null,
  zoneSosError: null,
  updateStatusLodaing: null,
  updateStatusError: null,
  mySos: null,
  mySosLoading: null,
  mySosError: null,
};

export const sosReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_SOS_REQUEST:
      return { ...store, allSosLoading: true, allSosError: null };
    case GET_ALL_SOS_SUCCESS:
      return { ...store, allSos: payload, allSosLoading: false, allSosError: null };
    case GET_ALL_SOS_FAILURE:
      return { ...store, allSosLoading: false, allSosError: payload };
    case CREATE_SOS_REQUEST:
      return { ...store, createSosLoading: true, createSosError: null };
    case CREATE_SOS_SUCCESS:
      return { ...store, createSosLoading: false, createSosError: null };
    case CREATE_SOS_FAILURE:
      return { ...store, createSosLoading: false, createSosError: payload };
    case GET_SOS_BY_ZONE_REQUEST:
      return { ...store, zoneSosLoading: true, zoneSosError: null };
    case GET_SOS_BY_ZONE_SUCCESS:
      return { ...store, zoneSos: payload, zoneSosLoading: false, zoneSosError: null };
    case GET_SOS_BY_ZONE_FAILURE:
      return { ...store, zoneSosLoading: false, zoneSosError: payload };
    case UPDATE_STATUS_REQUEST:
      return { ...store, updateStatusLodaing: true, updateStatusError: null };
    case UPDATE_STATUS_SUCCESS:
      return { ...store, updateStatusLodaing: false, updateStatusError: null };
    case UPDATE_STATUS_FAILURE:
      return { ...store, updateStatusLodaing: false, updateStatusError: payload };
    case MY_SOS_REQUEST:
      return { ...store, mySosLoading: true, mySosError: null };
    case MY_SOS_SUCCESS:
      return { ...store, mySos: payload, mySosLoading: false, mySosError: null };
    case MY_SOS_FAILURE:
      return { ...store, mySosLoading: false, mySosError: payload };
    default:
      return store;
  }
};
