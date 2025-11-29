import {
  GET_ALL_ZONES_REQUEST,
  GET_ALL_ZONES_FAILURE,
  GET_ALL_ZONES_SUCCESS,
  CREATE_ZONE_REQUEST,
  CREATE_ZONE_SUCCESS,
  CREATE_ZONE_FAILURE,
  UPDATE_ZONE_REQUEST,
  UPDATE_ZONE_SUCCESS,
  UPDATE_ZONE_FAILURE,
  DELETE_ZONE_REQEUST,
  DELETE_ZONE_SUCCESS,
  DELETE_ZONE_FAILURE,
  CURRENT_ZONE_REQUEST,
  CURRENT_ZONE_SUCCESS,
  CURRENT_ZONE_FAILURE,
} from "./ActionType";

const initialState = {
  allZones: null,
  allZonesError: null,
  allZonesLoading: null,
  createZoneLoading: null,
  createZoneError: null,
  updateZoneLoading: null,
  updateZoneError: null,
  deleteZoneLoading: null,
  deleteZoneError: null,
  currentZone: null,
  currentZoneLoading: null,
  currentZoneError: null,
};

export const disasterReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case GET_ALL_ZONES_REQUEST:
      return { ...store, allZonesLoading: true, allZonesError: null };
    case GET_ALL_ZONES_SUCCESS:
      return { ...store, allZones: payload, allZonesLoading: false, allZonesError: null };
    case GET_ALL_ZONES_FAILURE:
      return { ...store, allZonesError: payload, allZonesLoading: false };
    case CREATE_ZONE_REQUEST:
      return { ...store, createZoneLoading: true, createZoneError: null };
    case CREATE_ZONE_SUCCESS:
      return { ...store, createZoneLoading: false, createZoneError: null };
    case CREATE_ZONE_FAILURE:
      return { ...store, createZoneLoading: false, createZoneError: payload };
    case UPDATE_ZONE_REQUEST:
      return { ...store, updateZoneLoading: true, updateZoneError: null };
    case UPDATE_ZONE_SUCCESS:
      return { ...store, updateZoneLoading: false, updateZoneError: null };
    case UPDATE_ZONE_FAILURE:
      return { ...store, updateZoneLoading: false, updateZoneError: payload };
    case DELETE_ZONE_REQEUST:
      return { ...store, deleteZoneLoading: true, deleteZoneError: null };
    case DELETE_ZONE_SUCCESS:
      return { ...store, deleteZoneLoading: false, deleteZoneError: null };
    case DELETE_ZONE_FAILURE:
      return { ...store, deleteZoneLoading: false, deleteZoneError: payload };
    case CURRENT_ZONE_REQUEST:
      return { ...store, currentZoneLoading: true, currentZoneError: null };
    case CURRENT_ZONE_SUCCESS:
      return { ...store, currentZone: payload, currentZoneLoading: false, currentZoneError: null };
    case CURRENT_ZONE_FAILURE:
      return { ...store, currentZoneLoading: false, currentZoneError: payload };
    default:
      return store;
  }
};
