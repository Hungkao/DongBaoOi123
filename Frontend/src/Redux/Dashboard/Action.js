import { BASE_URL } from "../config.js";
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
} from "./ActionType.js";

export const getDashboardSummay = () => async (dispatch) => {
  try {
    dispatch({ type: GET_SUMMARY_REQUEST });

    const res = await fetch(`${BASE_URL}/dashboard/summary`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      dispatch({ type: GET_SUMMARY_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: GET_SUMMARY_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get summary (error): ", error);
    dispatch({ type: GET_SUMMARY_FAILURE, payload: "Something went wrong!" });
  }
};

export const getRecentSos = () => async (dispatch) => {
  try {
    dispatch({ type: GET_RECENTSOS_REQEUST });

    const res = await fetch(`${BASE_URL}/dashboard/recent-sos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      dispatch({ type: GET_RECENTSOS_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: GET_RECENTSOS_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get recent-sos (error): ", error);
    dispatch({ type: GET_RECENTSOS_FAILURE, payload: "Something went wrong!" });
  }
};

export const getZoneActivity = () => async (dispatch) => {
  try {
    dispatch({ type: GET_STATS_REQUEST });

    const res = await fetch(`${BASE_URL}/dashboard/stats`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    const resData = await res.json();

    if (!res.ok) {
      dispatch({ type: GET_STATS_FAILURE, payload: resData });
      return;
    }

    console.log("Stats zone graph: ", resData);

    dispatch({
      type: GET_STATS_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get stats zone graph (error): ", error);
    dispatch({ type: GET_STATS_FAILURE, payload: "Something went wrong!" });
  }
};
