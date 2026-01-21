import { Action } from "./Reducer";
import types from "../ActionTypes/Index";

const initialState = {
  loaderVisible: false,
};

const LoadingIndicatorReducer = (state = initialState, action: Action) => {
  switch (action.type) {
    case types.SHOW_LOADER:
      return {
        ...state,
        loaderVisible: true,
      };
    case types.HIDE_LOADER:
      return {
        ...state,
        loaderVisible: false,
      };
    default:
      return state;
  }
};

export default LoadingIndicatorReducer;
