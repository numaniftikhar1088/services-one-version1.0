import { Collapse } from "@mui/material";
import React from "react";
import useLang from "Shared/hooks/useLanguage";

function AddDrugAllergy({
  addTab2,
  setAddTab2,
  setpostData,
  postData,
  handlesave,
  handleCancel,
}: any) {
  const { t } = useLang();
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <Collapse in={addTab2}>
          <div id="SearchCollapse" className="card mb-5">
            <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-2 py-1 minh-42px">
              <h4 className="m-1">{t("Add New Drug Allergies")}</h4>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  id={`NewDrugAllergyCancel`}
                  className="btn btn-secondary btn-sm btn-secondary--icon"
                  aria-controls="SearchCollapse"
                  aria-expanded="true"
                  style={{ height: "38.2px" }}
                  onClick={handleCancel}
                >
                  <span>
                    <i className="fa fa-times"></i>
                    <span>{t("Cancel")}</span>
                  </span>
                </button>
                <button
                  id={`NewDrugAllergySave`}
                  className="btn btn-primary btn-sm btn-primary--icon px-7"
                  aria-controls="SearchCollapse"
                  aria-expanded="true"
                  style={{ height: "38.2px" }}
                  onClick={handlesave}
                >
                  <span>
                    <span>{t("Save")}</span>
                  </span>
                </button>
              </div>
            </div>
            <div id="form-search" className=" card-body">
              <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="required mb-2 fw-500">
                      {t("Description")}
                    </label>

                    <input
                      id={`NewDrugAllergyDescription`}
                      type="text"
                      name="Description"
                      value={postData.description}
                      onChange={(e) =>
                        setpostData((oldData: any) => ({
                          ...oldData,
                          description: e.target.value,
                        }))
                      }
                      className="form-control bg-transparent"
                      placeholder={t("Description")}
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-3 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                    <label className=" mb-2">{t("Status")}</label>
                    <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                      <input
                        id={`NewDrugAllergySwitchButton`}
                        className="form-check-input"
                        name="isActive"
                        type="checkbox"
                        checked={postData.Status}
                        onChange={(e) =>
                          setpostData((oldData: any) => ({
                            ...oldData,
                            Status: e.target.checked,
                          }))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Collapse>
      </div>
    </>
  );
}

export default AddDrugAllergy;
