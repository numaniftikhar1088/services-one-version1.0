import types from "../../../../Redux/ActionTypes/Index";

const setRequisitionData = (ReqObj) => {
  return {
    type: types.SET_REQUSITION_DATA,
    payload: ReqObj,
  };
};

const setSelectedRequisitionData = (reqObj)=>{
  return {
    type: types.SET_SELECTED_REQUSITION_DATA,
    payload: reqObj,
  };
}

export { setRequisitionData,setSelectedRequisitionData };