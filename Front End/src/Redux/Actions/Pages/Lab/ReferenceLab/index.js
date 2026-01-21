import types from "../../../../ActionTypes/Index";

const setShowColumn = (columnObj) => {
  return {
    type: types.SET_SHOW_COLUMN,
    payload: columnObj,
  };
};

export { setShowColumn };
