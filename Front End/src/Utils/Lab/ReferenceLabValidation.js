export const formValidation = (formVal) => {
  const data = [...formVal];
  let valid = true;
  let count = 0;
  for (let index = data.length - 1; index >= 0; index--) {
    // const element = data[index];d
    if (data[index].referenceLabId === "" || isNaN(data[index].primaryLabId)) {
      data[index].referenceLabIdCheck = "Required";
    } else {
      data[index].referenceLabIdCheck = "";
      valid = true;
    }
    if (data[index].primaryLabId === "" || isNaN(data[index].primaryLabId)) {
      data[index].primaryLabIdCheck = "Required";
    } else {
      data[index].primaryLabIdCheck = "";
      valid = true;
    }
    if (data[index].labType === "") {
      data[index].labTypeCheck = "Required";
    } else {
      data[index].labTypeCheck = "";
      valid = true;
    }

    if (
      data[index].referenceLabIdCheck === "Required" ||
      data[index].primaryLabIdCheck === "Required" ||
      data[index].labTypeCheck === "Required"
    ) {
      count = count + 1;
    }
  }
  //setRowsData(data);
  if (count === 0) {
    valid = true;
    // return valid;
  }
  if (count !== 0) {
    valid = false;
    // return valid;
  }
  const obj = {
    valid: valid,
    data: data,
  };
  return obj;
};
