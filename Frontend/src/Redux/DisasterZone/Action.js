import { BASE_URL } from "../config.js";
import {
  CREATE_ZONE_FAILURE,
  CREATE_ZONE_REQUEST,
  CREATE_ZONE_SUCCESS,
  CURRENT_ZONE_FAILURE,
  CURRENT_ZONE_REQUEST,
  CURRENT_ZONE_SUCCESS,
  DELETE_ZONE_FAILURE,
  DELETE_ZONE_REQEUST,
  DELETE_ZONE_SUCCESS,
  GET_ALL_ZONES_FAILURE,
  GET_ALL_ZONES_REQUEST,
  GET_ALL_ZONES_SUCCESS,
  UPDATE_ZONE_FAILURE,
  UPDATE_ZONE_REQUEST,
  UPDATE_ZONE_SUCCESS,
} from "./ActionType.js";

export const getAllDisasterZones = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_ZONES_REQUEST });

    const res = await fetch(`${BASE_URL}/zones`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      dispatch({ type: GET_ALL_ZONES_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: GET_ALL_ZONES_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get all disaster zones (error): ", error);
    dispatch({ type: GET_ALL_ZONES_FAILURE, payload: "Something went wrong!" });
  }
};

export const createDisasterZone = (zoneData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_ZONE_REQUEST });

    const res = await fetch(`${BASE_URL}/admin/zones`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(zoneData),
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      dispatch({ type: CREATE_ZONE_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: CREATE_ZONE_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("create new disaster zones (error): ", error);
    dispatch({ type: CREATE_ZONE_FAILURE, payload: "Something went wrong!" });
  }
};

export const udpateDisasterZone =
  ({ zoneData, id }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPDATE_ZONE_REQUEST });

      const res = await fetch(`${BASE_URL}/admin/zones/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(zoneData),
      });

      let resData;
      try {
        resData = await res.json();
      } catch {
        resData = {};
      }

      if (!res.ok) {
        dispatch({ type: UPDATE_ZONE_FAILURE, payload: resData });
        return;
      }

      dispatch({
        type: UPDATE_ZONE_SUCCESS,
        payload: resData,
      });
    } catch (error) {
      console.log("create new disaster zones (error): ", error);
      dispatch({ type: UPDATE_ZONE_SUCCESS, payload: "Something went wrong!" });
    }
  };

export const deleteDisasterZone = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_ZONE_REQEUST });

    const res = await fetch(`${BASE_URL}/admin/zones/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      dispatch({ type: DELETE_ZONE_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: DELETE_ZONE_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Delete disaster zone (error): ", error);
    dispatch({ type: DELETE_ZONE_FAILURE, payload: "Something went wrong!" });
  }
};

export const getCurrentActiveZone = (id) => async (dispatch) => {
  try {
    dispatch({ type: CURRENT_ZONE_REQUEST });

    const res = await fetch(`${BASE_URL}/zones/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }
    console.log("Current active zone: ", resData);
    
    if (!res.ok) {
      dispatch({ type: CURRENT_ZONE_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: CURRENT_ZONE_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("current active zone (error): ", error);
    dispatch({ type: CURRENT_ZONE_FAILURE, payload: "Something went wrong!" });
  }
};
