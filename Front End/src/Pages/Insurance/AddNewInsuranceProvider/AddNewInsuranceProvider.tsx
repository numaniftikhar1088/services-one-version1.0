import { Collapse } from "@mui/material";
import { useEffect } from "react";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectStyle, styles } from "Utils/Common";
import Select from "react-select";
import InputMask from "react-input-mask";
function AddNewInsuranceProvider({
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
            <h4 className="m-1">{t("Add New Insurance Provider")}</h4>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`AllInsuranceCancel`}
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
                id={`AllInsuranceSave`}
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
                    {t("Provider Name")}
                  </label>

                  <input
                    id={`AllInsuranceProviderName`}
                    type="text"
                    name="providerName"
                    value={postData.providerName}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        providerName: e.target.value,
                      }))
                    }
                    className={
                      editDisable
                        ? "form-control bg-secondary"
                        : "form-control bg-transparent"
                    }
                    placeholder={t("Insurance Provider Name")}
                    disabled={editDisable}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Provider Code")}</label>
                  <input
                    id={`AllInsuranceProviderCode`}
                    type="text"
                    name="ProviderCode"
                    value={postData.providerCode}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        providerCode: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Provider Code")}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">
                    {t("Address 1")}
                  </label>
                  <input
                    id={`AllInsuranceAddress1`}
                    type="text"
                    name="Address1"
                    value={postData.address1}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        address1: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Address 1")}
                  />
                </div>
              </div>
              {/* <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">{t("Address 2")}</label>
                  <input
                    id="Address2"
                    type="text"
                    name="Address2"
                    value={postData.address2}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        address2: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Address 2")}
                  />
                </div>
              </div> */}
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="required mb-2 fw-500">{t("City")}</label>
                  <input
                    id={`AllInsuranceCity`}
                    type="text"
                    name="City"
                    value={postData.city}
                    onChange={(e) =>
                      setpostData((oldData: any) => ({
                        ...oldData,
                        city: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("City")}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">{t("State")}</label>
                  <Select
                    inputId={`AllInsuranceState`}
                    styles={reactSelectStyle}
                    menuPortalTarget={document.body}
                    options={stateLookup}
                    theme={(theme: any) => styles(theme)}
                    placeholder={t("State")}
                    name="state"
                    value={stateLookup?.filter(
                      (item: any) => item.label === postData.state
                    )}
                    onChange={handleStatelookup}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <label className="required mb-2 fw-500">{t("Zip Code")}</label>
                <input
                  id={`AllInsuranceZipCode`}
                  type="text"
                  name="zipCode"
                  onKeyDown={(e) => {
                    const regex = /^[0-9]*$/;
                    if (
                      !(
                        regex.test(e.key) ||
                        e.key === "Backspace" ||
                        e.key === "Tab"
                      )
                    ) {
                      e.preventDefault();
                    }
                  }}
                  value={postData.zipCode}
                  onChange={(e) =>
                    setpostData((oldData: any) => ({
                      ...oldData,
                      zipCode: e.target.value,
                    }))
                  }
                  className="form-control bg-transparent"
                  placeholder={t("Zip Code")}
                  maxLength={5}
                  inputMode="numeric"
                />
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className=" mb-2 fw-500">{t("Phone #")}</label>
                  <InputMask
                    id={`AllInsurancePhoneNummber`}
                    mask="(999) 999-9999" // Mask for US phone number
                    value={postData.landPhone}
                    onChange={handlePhoneChange}
                    className="form-control bg-transparent"
                    placeholder={t("(999) 999-9999")}
                    name="Phone"
                    type="tel"
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-3 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                  <label className=" mb-2">{t("Status")}</label>
                  <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                    <input
                      id={`AllInsuranceSwitchButton`}
                      className="form-check-input"
                      name="isActive"
                      type="checkbox"
                      checked={postData.providerStatus}
                      onChange={(e) =>
                        setpostData((oldData: any) => ({
                          ...oldData,
                          providerStatus: e.target.checked,
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

export default AddNewInsuranceProvider;
