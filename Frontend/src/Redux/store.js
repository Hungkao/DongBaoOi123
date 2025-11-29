import { applyMiddleware, combineReducers, legacy_createStore } from "redux";
import { thunk } from "redux-thunk";
import { authReducer } from "./Auth/Reducer.js";
import { dashboardReducer } from "./Dashboard/Reducer.js";
import { disasterReducer } from "./DisasterZone/Reducer.js";
import { sosReducer } from "./SOS/Reducer.js";
import { safetyTipReducer } from "./SafetyTips/Reducer.js";

const rootReducer = combineReducers({
  authStore: authReducer,
  dashboardStore: dashboardReducer,
  disasterStore: disasterReducer,
  sosStore: sosReducer,
  safetyTipsStore: safetyTipReducer,
});

export const store = legacy_createStore(rootReducer, applyMiddleware(thunk));
