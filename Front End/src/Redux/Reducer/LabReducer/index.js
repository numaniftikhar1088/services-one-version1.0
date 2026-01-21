import types from "../../ActionTypes/Index";
const initialState = {
  columnStatus: {},
};
const labReducer = (state = initialState, action) => {
  switch (action.type) {
    case types.SET_SHOW_COLUMN:
      return {
        ...state,
        columnStatus: action.payload,
      };
    default:
      return state;
  }
};
export default labReducer;
