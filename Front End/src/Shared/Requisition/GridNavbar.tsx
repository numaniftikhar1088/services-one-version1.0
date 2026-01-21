import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Collapse from "react-bootstrap/Collapse";
import Fade from "react-bootstrap/Fade";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { IInput } from "../../Pages/Compendium/PanelGroups/AddPanelGroup";
import FormInput from "../../Shared/FormInput";
import { styles } from "../../Utils/Common";

export interface NavLinkProps<T> {
  NavigatorsArray: T[];
  AddBtnText: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  Inputs: any;
  setValues: any;
  values: any;
  setRequisitionList: any;
  requisitionList: any;
  requisitionColorList: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  statusDropDownName: string;
}
export interface LinksArray {
  text: string;
  link: string;
}

const GridNavbar: React.FC<NavLinkProps<LinksArray>> = ({
  NavigatorsArray,
  AddBtnText,
  setOpenModal,
  Inputs,
  setValues,
  values,
  setRequisitionList,
  requisitionList,
  requisitionColorList,
  searchRequest,
  setSearchRequest,
  loadData,
  statusDropDownName,
}) => {
  const { t } = useLang()
  const [open, setOpen] = useState(false);
  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    let myBool = value === "true";
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        [name]: e.target.type === "select-one" ? myBool : value,
      };
    });
  };

  const resetSearch = () => {
    loadData(true);
    setValues({});
    setSearchRequest({
      name: "",
      requisitionStatus: "",
    });
  };

  //
  //

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="" className="text-muted text-hover-primary">
                  {t("Home")}
                </a>
              </li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">{t("LIS")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">{t("Requisition Type")}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Fade in={!open}>
              <Button
                className="btn btn-info btn-sm search"
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-search"></i>
                <span>{t("Search")}</span>
              </Button>
            </Fade>
            <Collapse in={open}>
              <Button
                className="btn btn-info btn-sm cross collapse"
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-times p-0"></i>
              </Button>
            </Collapse>
            <button
              onClick={() => setOpenModal(true)}
              className="btn btn-sm btn-primary"
            >
              {t(AddBtnText)}
            </button>
          </div>
        </div>
      </div>

      <Collapse in={open}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <div id="SearchCollapse" className="card">
              <div id="form-search" className=" card-body">
                <div className="row">
                  {Inputs?.map((input: IInput, index: number) => (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <FormInput
                        key={index}
                        {...input}
                        value={searchRequest[input.name]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label htmlFor="status" className="mb-2 fw-500 text-dark">
                      {t("Requisition Type")}
                    </label>
                    <Select
                      menuPortalTarget={document.body}
                      theme={(theme) => styles(theme)}
                      options={requisitionList}
                      onChange={(event: any) => {
                        return setValues((preVal: any) => {
                          return {
                            ...preVal,
                            reqTypeId: event?.value,
                            type: event?.label,
                          };
                        });
                      }}
                      value={{
                        value: values.reqTypeId,
                        label: values.type,
                      }}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500 text-dark">
                      {t("Requisition Color")}
                    </label>
                    <Select
                      menuPortalTarget={document.body}
                      theme={(theme) => styles(theme)}
                      options={requisitionColorList}
                      onChange={(event: any) => {
                        return setValues((preVal: any) => {
                          return {
                            ...preVal,
                            reqColorId: event?.value,
                            requisitionColor: event?.label,
                          };
                        });
                      }}
                      value={{
                        value: values?.reqColorId,
                        label: values.requisitionColor,
                      }}
                    />
                  </div>

                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label htmlFor="status" className="mb-2 fw-500 text-dark">
                      {t("Status")}
                    </label>
                    <select
                      name={statusDropDownName}
                      onChange={handleChange}
                      // onChange={(e) => onInputChangeSearch(e)}
                      value={searchRequest[`${statusDropDownName}`]}
                      className="form-select bg-transparent"
                      data-control="select2"
                      data-hide-search="true"
                      data-placeholder="Status"
                    >
                      <option value="">{t("--Status--")}</option>
                      <option value="true">{t("Active")}</option>
                      <option value="false">{t("Inactive")}</option>
                    </select>
                  </div>

                  <div className="d-flex justify-content-end  gap-2 gap-lg-3 mt-5">
                    <button
                      onClick={() => loadData()}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <i className="fa fa-search"></i>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      type="reset"
                      onClick={() => resetSearch()}
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                      id="kt_reset"
                    >
                      <span>
                        <i className="fa fa-times"></i>
                        <span>{t("Reset")}</span>
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Collapse>
    </div>
  );
};

export default GridNavbar;
