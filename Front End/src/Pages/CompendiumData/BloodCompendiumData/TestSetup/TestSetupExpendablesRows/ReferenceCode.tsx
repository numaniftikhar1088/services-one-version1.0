import React, { useState } from "react";
import useLang from './../../../../../Shared/hooks/useLanguage';

const ReferenceCode: React.FC<{}> = () => {
  const {t} = useLang()
  const [addRows, setAddRows] = useState([
    {
      cptcode: "",
    },
  ]);
  const addNewReference = () => {
    let newArr = [...addRows];
    newArr.push({
      cptcode: "",
    });
    setAddRows(newArr);
  };
  const deleteReferenceCode = (index: number) => {
    let newArr = [...addRows];
    newArr.splice(index, 1);
    
    setAddRows(newArr);
  };
  return (
    <>
      <div className="col-12 d-flex justify-content-between align-items-center">
        <h4 className="text-primary p-3">{t("Reference Code")}</h4>
        <button
          onClick={addNewReference}
          className="btn btn-light-primary btn-sm fw-bold"
        >
          <i className="bi bi-plus-lg"></i> {t("Add new")}
        </button>
      </div>

      <label className="mb-2 fw-bold">{t("CPT Code")}</label>

      {addRows?.map((item: any, index: number) => (
        <>
          <div className="row m-0">
            <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 mb-3">
              <input
                name=""
                className="form-control bg-transparent mb-lg-0"
                placeholder=""
                value=""
              />
            </div>

            {/* <div className="col-xl-2 col-lg-2 col-md-2 col-sm-12 mb-3">
                <label className="mb-2 fw-bold">LOING Code</label>
                <input name="" className="form-control bg-transparent mb-lg-0" placeholder="" value=""/>
            </div> */}
            <div className="mb-3 col-xl-2 col-lg-2 col-md-2 col-sm-12 d-flex align-items-end">
              <button
                type="button"
                className="btn px-4 btn-icon btn-light-danger btn-sm mb-3 mb-lg-0"
                onClick={() => deleteReferenceCode(index)}
              >
                <i className="bi bi-trash-fill"></i>
              </button>
            </div>
          </div>
        </>
      ))}
    </>
  );
};
export default ReferenceCode;
