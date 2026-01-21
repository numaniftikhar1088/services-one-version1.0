import types from "../../ActionTypes/Index";
const initialState = {
  ReqObjData: {},
  requisitionUnhandledError: {},
  phySign: null,
};

const ReqReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_REQUSITION_DATA:
      return {
        ...state,
        ReqObjData: action.payload,
      };
    case types.SET_SELECTED_REQUSITION_DATA:
      return {
        ...state,
        selectedReqObjData: action.payload,
      };
    case "REQ_ERROR":
      return {
        ...state,
        requisitionUnhandledError: action.payload,
      };
    case types.SET_PHYSICIAN_SIGN:
      return {
        ...state,
        phySign: action.payload,
      };
    default:
      return state;
  }
};
export default ReqReducer;
