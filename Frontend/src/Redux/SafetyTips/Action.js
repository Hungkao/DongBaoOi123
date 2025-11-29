import { BASE_URL } from "../config";
import { GET_SAFETY_TIP_FAILURE, GET_SAFETY_TIP_REQUEST, GET_SAFETY_TIP_SUCCESS } from "./ActionType";

export const getSafetyTips = (zoneId) => async (dispatch) => {
  try {
    dispatch({ type: GET_SAFETY_TIP_REQUEST });

    const res = await fetch(`${BASE_URL}/safetyTip/zone/${zoneId}`, {
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

    console.log("Safety tips: ", resData);

    if (!res.ok) {
      dispatch({ type: GET_SAFETY_TIP_FAILURE, payload: resData });
      return;
    }

    dispatch({
      type: GET_SAFETY_TIP_SUCCESS,
      payload: resData,
    });
  } catch (error) {
    console.log("Get safety tips (error): ", error);
    dispatch({ type: GET_SAFETY_TIP_FAILURE, payload: "Something went wrong!" });
  }
};
