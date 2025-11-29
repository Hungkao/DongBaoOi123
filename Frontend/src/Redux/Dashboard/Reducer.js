import {
  GET_RECENTSOS_FAILURE,
  GET_RECENTSOS_REQEUST,
  GET_RECENTSOS_SUCCESS,
  GET_STATS_FAILURE,
  GET_STATS_REQUEST,
  GET_STATS_SUCCESS,
  GET_SUMMARY_FAILURE,
  GET_SUMMARY_REQUEST,
  GET_SUMMARY_SUCCESS,
} from "./ActionType";

const initialState = {
  dashboardSummary: null,
  summaryLoading: null,
  error: null,
  listSos: null,
  loadingSos: null,
  errorSos: null,
  stats: null,
  statsLoading: null,
};

export const dashboardReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case GET_SUMMARY_REQUEST:
      return { ...store, summaryLoading: true };
    case GET_SUMMARY_SUCCESS:
      return { ...store, dashboardSummary: payload, summaryLoading: false };
    case GET_SUMMARY_FAILURE:
      return { ...store, error: payload, summaryLoading: false };
    case GET_RECENTSOS_REQEUST:
      return { ...store, errorSos: null, loadingSos: true };
    case GET_RECENTSOS_SUCCESS:
      return { ...store, listSos: payload, errorSos: null, loadingSos: false };
    case GET_RECENTSOS_FAILURE:
      return { ...store, error: payload, loadingSos: false };
    case GET_STATS_REQUEST:
      return { ...store, statsLoading: true, error: false };
    case GET_STATS_SUCCESS:
      return { ...store, stats: payload, error: null, statsLoading: false };
    case GET_STATS_FAILURE:
      return { ...store, error: payload };
    default:
      return store;
  }
};
