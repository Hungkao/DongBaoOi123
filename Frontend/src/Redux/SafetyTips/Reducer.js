import { GET_SAFETY_TIP_REQUEST, GET_SAFETY_TIP_SUCCESS, GET_SAFETY_TIP_FAILURE } from "./ActionType.js";

const initialState = {
  safetyTips: null,
  safetyTipsLoading: null,
  safetyTipsError: null,
};

export const safetyTipReducer = (store = initialState, { type, payload }) => {
  switch (type) {
    case GET_SAFETY_TIP_REQUEST:
      return { ...store, safetyTipsLoading: true, safetyTipsError: null };
    case GET_SAFETY_TIP_SUCCESS:
      return { ...store, safetyTips: payload, safetyTipsLoading: false, safetyTipsError: null };
    case GET_SAFETY_TIP_FAILURE:
      return { ...store, safetyTipsLoading: false, safetyTipsError: payload };
    default:
      return store;
  }
};
