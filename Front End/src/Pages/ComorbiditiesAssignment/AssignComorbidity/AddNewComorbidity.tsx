import { Collapse } from "@mui/material";
import { useEffect } from "react";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectStyle, styles } from "Utils/Common";
import Select from "react-select";
import InputMask from "react-input-mask";
import ComorAutocomplete from "Shared/ComorbiditiesAutoComplete";

function AddNewComorbidity({
  addAssignComor,
  setAssignComorpostData,
  AssignComorpostData,
  handlesaveComor,
  PanelList,
  handleCancelComor,
  facilityLookup,
  requisitionLookup,
  referenceLabLookup,
  isInfectiousDisease,
  handleReferenceLookup,
  handleRequisitionLookup,
  editDisableComor,
  handleFacilityLookup,
}: any) {
  const { t } = useLang();

  return (
    <>
      <Collapse in={addAssignComor}>
        <div id="SearchCollapse" className="card mb-5">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-2 py-1 minh-42px">
            <h4 className="m-1">
              {AssignComorpostData.id === 0
                ? t("Create Assignment Comorbidities")
                : t("Edit Assignment Comorbidities")}
            </h4>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`AssignmentComorbiditiesCancel`}
                className="btn btn-secondary btn-sm btn-secondary--icon"
                aria-controls="SearchCollapse"
                aria-expanded="true"
                style={{ height: "38.2px" }}
                onClick={handleCancelComor}
              >
                <span>
                  <i className="fa fa-times"></i>
                  <span>{t("Cancel")}</span>
                </span>
              </button>
              <button
                id={`AssignmentComorbiditiesSave`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                aria-controls="SearchCollapse"
                aria-expanded="true"
                style={{ height: "38.2px" }}
                onClick={handlesaveComor}
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
                  <ComorAutocomplete
                    required
                    label="Comorbidities Code"
                    setValues={setAssignComorpostData}
                    placeholder="Search ICD10 Code"
                    value={
                      AssignComorpostData.code ? AssignComorpostData.code : ""
                    }
                    className="z-index-3"
                    disabled={editDisableComor}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500">
                    {t("Comorbidities Description")}
                  </label>
                  <input
                    id={`ComorbidityDescription`}
                    type="text"
                    name="ProviderCode"
                    value={AssignComorpostData.description}
                    onChange={(e) =>
                      setAssignComorpostData((oldData: any) => ({
                        ...oldData,
                        description: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Comorbidities Description")}
                    disabled
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className=" mb-2 fw-500">{t("Group")}</label>
                  <input
                    id={`ComorbidityGroup`}
                    type="text"
                    name="Address1"
                    value={AssignComorpostData.group}
                    onChange={(e) =>
                      setAssignComorpostData((oldData: any) => ({
                        ...oldData,
                        group: e.target.value,
                      }))
                    }
                    className="form-control bg-transparent"
                    placeholder={t("Group")}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Requisition Type")}
                  </label>
                  <Select
                    inputId={`ComorbidityRequisitionType`}
                    styles={reactSelectStyle}
                    menuPortalTarget={document.body}
                    options={requisitionLookup}
                    theme={(theme: any) => styles(theme)}
                    placeholder={t("Requisition Type")}
                    name="Requisition Type"
                    value={
                      requisitionLookup.find(
                        (item: any) =>
                          item.value === AssignComorpostData.requisition
                      ) || null
                    }
                    onChange={handleRequisitionLookup}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Reference Lab")}
                  </label>
                  <Select
                    inputId={`ComorbidityReferenceLab`}
                    styles={reactSelectStyle}
                    menuPortalTarget={document.body}
                    options={referenceLabLookup}
                    theme={(theme: any) => styles(theme)}
                    placeholder={t("Reference Lab")}
                    name="Reference Lab"
                    value={
                      referenceLabLookup.find(
                        (item: any) =>
                          item.value === AssignComorpostData.referenceLab
                      ) || null
                    }
                    onChange={handleReferenceLookup}
                  />
                </div>
              </div>
              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-4">
                  <label className="mb-2 fw-500 required">
                    {t("Facility")}
                  </label>
                  <Select
                    inputId={`ComorbidityFacility`}
                    styles={reactSelectStyle}
                    menuPortalTarget={document.body}
                    options={facilityLookup}
                    theme={(theme: any) => styles(theme)}
                    placeholder={t("Facility")}
                    name="Facility"
                    value={
                      facilityLookup.find(
                        (item: any) =>
                          item.value === AssignComorpostData.facility
                      ) || null
                    }
                    onChange={handleFacilityLookup}
                  />
                </div>
              </div>
              {isInfectiousDisease ? (
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className={`mb-2 fw-500 required`}>
                      {t("Panel")}
                    </label>
                    <Select
                      inputId="AssignedComorPanel"
                      menuPortalTarget={document.body}
                      className="z-index-3"
                      styles={reactSelectStyle}
                      theme={(theme) => styles(theme)}
                      options={PanelList}
                      name="panel"
                      placeholder={t("Select Panel")}
                      value={
                        PanelList.find(
                          (option: any) =>
                            option.value === AssignComorpostData.panel
                        ) || null
                      }
                      onChange={(e) => {
                        setAssignComorpostData((prev: any) => ({
                          ...prev,
                          panel: e.value,
                        }));
                      }}
                      isSearchable={true}
                    />
                  </div>
                </div>
              ) : null}

              <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                <div className="fv-row mb-3 col-xl-12 col-lg-12 col-md-6 col-sm-12">
                  <label className=" mb-2">{t("Status")}</label>
                  <label className="form-check form-switch form-switch-sm form-check-solid flex-stack">
                    <input
                      id={`AssignComorSwitchButton`}
                      className="form-check-input"
                      name="isActive"
                      type="checkbox"
                      checked={AssignComorpostData.comorStatus}
                      onChange={(e) =>
                        setAssignComorpostData((oldData: any) => ({
                          ...oldData,
                          comorStatus: e.target.checked,
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

export default AddNewComorbidity;
