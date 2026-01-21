import React, { useEffect, useState } from "react";
import Collapse from "@mui/material/Collapse";
import FormInput from "../../../Shared/FormInput";
import { GroupSetupInputs } from "../../../Utils/Compendium/Inputs";
import GroupSetupService from "../../../Services/Compendium/GroupSetup";
import { AxiosResponse } from "axios";
import AddGroupSetup from "./AddGroupSetup";
import { LoaderIcon } from "../../../Shared/Icons";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";

export interface NavLinkProps<T> {
  NavigatorsArray: T[];
  AddBtnText: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  Inputs: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  statusDropDownName: string;
  openModal: any;
  setSorting: any;
  handlechange: any;
  values: any;
  handleSubmit: any;
  setValues: any;
  setEditGridHeader: any;
  modalheader: any;
  errors: any;
  setErrors: any;
  open: any;
  setOpen: any;
  isRequest: any;
  setIsRequest: any;
  setCurPage: any;
  setTriggerSearchData: any;
}
export interface LinksArray {
  text: string;
  link: string;
}
interface IInput {
  name: string;
  type: string;
  placeholder: string;
  label: string;
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
  openModal,
  open,
  setOpen,
  handlechange,
  values,
  handleSubmit,
  setValues,
  setEditGridHeader,
  modalheader,
  errors,
  setErrors,
  isRequest,
  setIsRequest,
  setSorting,
  setTriggerSearchData,
  setCurPage,
}) => {
  const { t } = useLang();

  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    let myBool = value === "true" ? true : false;
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        [name]: e.target.type === "select-one" ? myBool : value,
      };
    });
  };

  const handleonChange = (e: any) => {
    const value = e.target.value;

    let result: any;
    if (value.includes(",")) {
      result = value.split(",");

      setSearchRequest((preVal: any) => {
        return {
          ...preVal,
          reqTypeName: result[1],
          reqTypeId: result[0],
        };
      });
    }
  };

  const resetSearch = () => {
    loadData(true);
    setSorting({
      sortColumn: "id",
      sortDirection: "desc",
    });
  };
  const [req, setReq] = useState<any>([]);
  const Lookuprequisition = () => {
    GroupSetupService.getRequisitionTypeLookup()
      .then((res: AxiosResponse) => {
        setReq(res?.data?.data);
      })
      .catch((err: string) => {});
  };
  useEffect(() => {
    Lookuprequisition();
  }, []);
  const handleChangeStatus = (event: any) => {
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        isActive: event.target.value,
      };
    });
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`GroupSetupOpenSearch`}
              className={`btn btn-info btn-sm fw-bold search ${
                open ? "d-none" : openModal ? "d-none" : "d-block"
              }`}
              onClick={() => {
                setOpen(!open);
                if (openModal) {
                  setOpenModal(!openModal);
                }
              }}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-search"></i>
              <span>{t("Search")}</span>
            </button>

            <button
              id={`GroupSetupCloseSearch`}
              className={`btn btn-info btn-sm fw-bold ${
                open ? "btn-icon" : "collapse"
              }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-times p-0"></i>
            </button>
            <PermissionComponent
              moduleName="Setup"
              pageName="Groups"
              permissionIdentifier="AddGroupSetup"
            >
              <button
                id={`GroupSetupAddNew`}
                className={`btn btn-primary btn-sm fw-bold search ${
                  openModal ? "d-none" : "d-block"
                }`}
                onClick={() => {
                  setOpenModal(!openModal);
                  if (open) {
                    setOpen(!open);
                  }
                }}
                aria-controls="ModalCollapse"
                aria-expanded={openModal}
              >
                <span className="">{t(AddBtnText)}</span>
              </button>
            </PermissionComponent>
          </div>
        </div>
      </div>

      <Collapse in={open}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <div id="SearchCollapse" className="card">
              <div id="form-search" className=" card-body">
                <div className="row">
                  {GroupSetupInputs?.map((input: IInput, index: number) => (
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <FormInput
                        id={`GroupSetupSearch_${input.name}`}
                        key={index}
                        {...input}
                        value={searchRequest[input.name]}
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  ))}
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">
                      {t("Requisition Type")}
                    </label>
                    <select
                      id={`GroupSetupSearchReqTypeName`}
                      className="form-select"
                      name="reqTypeName"
                      onChange={handleonChange}
                      value={
                        searchRequest.reqTypeId +
                        "," +
                        searchRequest.reqTypeName
                      }
                    >
                      <option>{t("--- Select Requisition Type ---")}</option>
                      {req?.map((item: any) => (
                        <option
                          id={item?.requisitionTypeName}
                          value={
                            item?.reqTypeId + "," + item?.requisitionTypeName
                          }
                        >
                          {item?.requisitionTypeName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">
                      {t("Inactive/Active")}
                    </label>
                    <select
                      id={`GroupSetupSearchStatus`}
                      className="form-select"
                      name="isActive"
                      onChange={handleChangeStatus}
                      value={
                        searchRequest.isActive === "false"
                          ? "false"
                          : searchRequest.isActive === "true"
                            ? "true"
                            : ""
                      }
                    >
                      <option>{t("--- Select ---")}</option>
                      <option value="true">{t("Active")}</option>
                      <option value="false">{t("InActive")}</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end  gap-2 gap-lg-3 mt-3">
                    <button
                      id={`GroupSetupSearch`}
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev: any) => !prev);
                      }}
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
                      id={`GroupSetupReset`}
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

      <Collapse in={openModal}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <div id="ModalCollapse" className="card">
              {/* <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3">
                <h5 className="m-0 ">{modalheader}</h5>
              </div> */}

              <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3 minh-42px">
                <h5 className="m-0 ">{t(modalheader)}</h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`GroupSetupCancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => {
                      setOpenModal(false);
                      setValues((preVal: any) => {
                        return {
                          ...preVal,
                          id: 0,
                          name: "",
                          description: "",
                          isActive: true,
                          reqTypeName: "",
                          reqTypeId: 0,
                        };
                      });
                      setErrors((preVal: any) => {
                        return {
                          ...preVal,
                          GroupNameError: "",
                          DisplayNameError: "",
                        };
                      });
                      //setValues([""]);
                      setEditGridHeader(false);
                      loadData(false);
                    }}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>
                  <button
                    id={`GroupSetupSave`}
                    className="btn btn-primary btn-sm btn-primary--icon px-7"
                    onClick={handleSubmit}
                  >
                    <span>
                      {isRequest ? <LoaderIcon /> : null}
                      <span>{t("Save")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div id="form-search" className=" card-body py-3">
                <div className="row">
                  <AddGroupSetup
                    values={values}
                    handleChange={handlechange}
                    errors={errors}
                    setErrors={setErrors}
                    setValues={setValues}
                  />
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
