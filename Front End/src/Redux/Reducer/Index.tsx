import { combineReducers } from "redux";
import LabReducer from "./LabReducer";
import LoadingIndicatorReducer from "./LoadingIndicatorReducer";
import Reducer from "./Reducer";
import ReqReducer from "./ReqReducer";

const rootReducer = combineReducers({
  Reducer,
  LabReducer,
  ReqReducer,
  LoadingIndicatorReducer,
});

export default rootReducer;
