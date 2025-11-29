import { toast } from "sonner";
import { BASE_URL } from "../config.js";
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
} from "./ActionType.js";

export const getEveryoneSos = () => async (dispatch) => {
  try {
    dispatch({ type: GET_ALL_SOS_REQUEST });

    const res = await fetch(`${BASE_URL}/sos/all`, {
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
      dispatch({ type: GET_ALL_SOS_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: GET_ALL_SOS_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get everyone's sos (error): ", error);
    dispatch({ type: GET_ALL_SOS_FAILURE, payload: "Something went wrong!" });
  }
};

export const createSosRequest = (reqData) => async (dispatch) => {
  try {
    dispatch({ type: CREATE_SOS_REQUEST });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch({ type: CREATE_SOS_FAILURE, payload: "No access token found" });
      return;
    }

    const res = await fetch(`${BASE_URL}/sos`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(reqData),
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    if (!res.ok) {
      dispatch({ type: CREATE_SOS_FAILURE, payload: resData.message || "Failed to create SOS request" });
      return;
    }

    dispatch({ type: CREATE_SOS_SUCCESS, payload: resData });
  } catch (error) {
    console.error("Create new sos (error): ", error);
    dispatch({ type: CREATE_SOS_FAILURE, payload: error.message || "Something went wrong!" });
  }
};

export const getSosByZone = (zoneId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SOS_BY_ZONE_REQUEST });

    const token = localStorage.getItem("accessToken");

    const res = await fetch(`${BASE_URL}/sos/all?zoneId=${zoneId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    console.log("Current zone sos", resData);

    if (!res.ok) {
      dispatch({ type: GET_SOS_BY_ZONE_FAILURE, payload: resData.message || "Failed to fetch SOS request by zone" });
      return;
    }

    dispatch({ type: GET_SOS_BY_ZONE_SUCCESS, payload: resData });
  } catch (error) {
    console.error("GET ZONE SPECIFIC SOS REQUESTS (error): ", error);
    dispatch({ type: GET_SOS_BY_ZONE_FAILURE, payload: error.message || "Something went wrong!" });
  }
};

export const udpateSosStatus =
  ({ sosId, status }) =>
  async (dispatch) => {
    try {
      dispatch({ type: UPDATE_STATUS_REQUEST });

      const token = localStorage.getItem("accessToken");
      if (!token) {
        dispatch({ type: UPDATE_STATUS_REQUEST, payload: "No access token found" });
        return;
      }

      const res = await fetch(`${BASE_URL}/admin/sos/${sosId}/status?status=${status}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let resData;
      try {
        resData = await res.json();
      } catch {
        resData = {};
      }

      console.log("updaet status: ", resData);

      if (!res.ok) {
        toast.error(resData.message || "Failed to update status");
        dispatch({ type: UPDATE_STATUS_FAILURE, payload: resData.message || "Failed to update status" });
        return;
      }

      dispatch({ type: UPDATE_STATUS_SUCCESS, payload: resData });
      toast.success("Status updated successfully");
    } catch (error) {
      console.error("update status (error): ", error);
      dispatch({ type: UPDATE_STATUS_FAILURE, payload: error.message || "Something went wrong!" });
    }
  };

export const mySos = () => async (dispatch) => {
  try {
    dispatch({ type: MY_SOS_REQUEST });

    const token = localStorage.getItem("accessToken");
    if (!token) {
      dispatch({ type: UPDATE_STATUS_REQUEST, payload: "No access token found" });
      return;
    }

    const res = await fetch(`${BASE_URL}/sos`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    let resData;
    try {
      resData = await res.json();
    } catch {
      resData = {};
    }

    console.log("my sos requests: ", resData);

    if (!res.ok) {
      toast.error(resData || "Failed to get your sos requests");
      dispatch({ type: MY_SOS_FAILURE, payload: resData || "Failed to get your sos" });
      return;
    }

    dispatch({ type: MY_SOS_SUCCESS, payload: resData });

  } catch (error) {
    console.error("get my sos (error): ", error);
    dispatch({ type: MY_SOS_FAILURE, payload: error.message || "Something went wrong!" });
  }
};
