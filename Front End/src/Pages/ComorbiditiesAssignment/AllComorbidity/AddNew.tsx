import { Collapse } from "@mui/material";
import { useEffect } from "react";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectStyle, styles } from "Utils/Common";
import Select from "react-select";
import InputMask from "react-input-mask";
function AddNewAllComorbidities({
  addTab2,
  setpostData,
  postData,
  showData,
  stateLookup,
  handlesave,
  editDisable,
  handleCancel,
  setEditDisable,
  GetStatelookup,
  handleStatelookup,
}: any) {
  const { t } = useLang();

  const handlePhoneChange = (e: any) => {
    setpostData({ ...postData, landPhone: e.target.value });
    setpostData((oldData: any) => ({
      ...oldData,
      landPhone: e.target.value,
    }));
  };
  useEffect(() => {
    GetStatelookup();
  }, [addTab2]);
  return (
    <>
      <Collapse in={addTab2}>
        <div id="SearchCollapse" className="card mb-5">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-2 py-1 minh-42px">
            <h4 className="m-1">
              {postData.AllComorbidityId === 0
                ? t("Create All Comorbidities")
                : t("Edit All Comorbidities")}
            </h4>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`AllComorBiditiesCancel`}
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
                id={`AllComorBiditiesSave`}
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
                    {t("Comorbidities Code")}
                  </label>
                  <input
                    id={`AllComorBiditiesComorbiditiesCode`}
                    type="text"
                    name="Code"
                    value={postData.AllComorbidityCode}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        AllComorbidityCode: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Comorbidities Code")}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Comorbidities Description")}
                  </label>
                  <input
                    id={`AllComorBiditiesComorbiditiesDescription`}
                    type="text"
                    name="Description"
                    value={postData.AllComorbidityDescription}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        AllComorbidityDescription: e.target.value,
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
                      id={`AllComorBiditiesSwitchButton`}
                      className="form-check-input"
                      name="isActive"
                      type="checkbox"
                      checked={postData.AllComorbidityStatus}
                      onChange={(e) =>
                        setpostData((oldData: any) => ({
                          ...oldData,
                          AllComorbidityStatus: e.target.checked,
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
    </>
  );
}

export default AddNewAllComorbidities;
