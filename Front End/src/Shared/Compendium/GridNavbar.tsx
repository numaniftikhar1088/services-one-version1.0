import Collapse from "@mui/material/Collapse";
import React, { useState } from "react";
import { IInput } from "../../Pages/Compendium/PanelGroups/AddPanelGroup";
import FormInput from "../../Shared/FormInput";
import useLang from './../hooks/useLanguage';

export interface NavLinkProps<T> {
  NavigatorsArray: T[];
  AddBtnText: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  Inputs: any;
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
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
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

              <li className="breadcrumb-item text-muted">{t("Specimen Type")}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className={`btn btn-info btn-sm fw-bold search ${open ? "d-none" : "d-block"
                }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-search"></i>
              <span  >{t("Search")}</span>
            </button>
            <button
              className={`btn btn-info btn-sm fw-bold ${open ? "btn-icon" : "collapse"
                }`}

              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-times p-0"></i>
            </button>
            <button
              onClick={() => setOpenModal(true)}
              className="btn btn-sm btn-primary"
            >
              {AddBtnText}
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
                  <div className="d-flex justify-content-end  gap-2 gap-lg-3">
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
                      onClick={(e) => resetSearch()}
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
