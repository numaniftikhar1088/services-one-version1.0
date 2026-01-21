import Collapse from "@mui/material/Collapse";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import SpecimenTypeAssigmentService from "../../../Services/Compendium/SpecimenTypeAssigmentService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { LoaderIcon } from "../../../Shared/Icons";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import AddSpecimenTypeAssigment from "./AddSpecimenTypeAssigment";
import { ReferenceLab } from "Pages/Insurance/LabSelection";
import AssigmentService from "Services/AssigmentService/AssigmentService";
import { RefLabDetails } from "Pages/ICD10Assigment/ICD10Assigment";

export interface NavLinkProps<T> {
  NavigatorsArray: T[];
  AddBtnText: string;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  Inputs: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  statusDropDownName: string;
  handleOpen: any;
  handleOnChange: any;
  values: any;
  errors: any;
  setErrors: any;
  editGridHeader: any;
  PanelSetupList: any;
  setPanelSetupList: any;
  openModal: any;
  setValues: any;
  modalheader: any;
  setEditGridHeader: any;
  handleSubmit: any;
  setRequest: any;
  request: any;
  panels: any;
  setPanels: any;
  sports2: any;
  setSports2: any;
  selectedPanels: any;
  setSelectedPanels: any;
  open: any;
  setOpen: any;
  setSorting: any;
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
interface Requisition {
  value: number;
  label: string;
}
interface RequisitionDetails {
  reqTypeId: number;
  requisitionTypeName: string;
}
const GridNavbar: React.FC<NavLinkProps<LinksArray>> = ({
  NavigatorsArray,
  AddBtnText,
  setOpenModal,
  Inputs,
  searchRequest,
  setSearchRequest,
  statusDropDownName,
  handleOpen,
  handleOnChange,
  values,
  errors,
  setErrors,
  editGridHeader,

  PanelSetupList,
  setPanelSetupList,
  openModal,
  setValues,
  modalheader,
  setEditGridHeader,
  handleSubmit,
  setRequest,
  request,
  panels,
  setPanels,
  sports2,
  setSports2,
  loadData,
  selectedPanels,
  setSelectedPanels,
  open,
  setOpen,
  setSorting,
  setCurPage,
  setTriggerSearchData,
}) => {
  const { t } = useLang();

  const [show, isShow] = useState<boolean>(false);
  const [RequsitionList, setRequsitionList] = useState<Requisition[]>([]);
  const [referenceLabOptions, setReferenceLabOptions] = useState<
    ReferenceLab[]
  >([]);

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === "isactive") {
      setSearchRequest((pre: any) => {
        return {
          ...pre,
          [e.target.name]: str2bool(e.target.value),
        };
      });
    } else {
      setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
    }
  };
  var str2bool = (value: string) => {
    if (value && typeof value === "string") {
      if (value.toLowerCase() === "true") return true;
      if (value.toLowerCase() === "false") return false;
      if (value.toLowerCase() === "null") return null;
    }
  };

  const resetSearch = () => {
    loadData(true);
    setSorting({
      sortColumn: "id",
      sortDirection: "desc",
    });
  };

  const GetRequsition = () => {
    SpecimenTypeAssigmentService.RequisitionTypeLookup().then((res: any) => {
      let RequisitionArray: Requisition[] = [];
      res?.data?.data.forEach(
        ({ reqTypeId, requisitionTypeName }: RequisitionDetails) => {
          let RequisitionDetails: Requisition = {
            value: reqTypeId,
            label: requisitionTypeName,
          };
          RequisitionArray.push(RequisitionDetails);
        }
      );

      setRequsitionList(RequisitionArray);
    });
  };

  const getReferenceLabs = async () => {
    try {
      const res = await AssigmentService.ReferenceLabLookUp();
      let refLabArray: ReferenceLab[] = [];
      res?.data?.data?.map(({ labId, labDisplayName }: RefLabDetails) => {
        let RefLabDetails: ReferenceLab = {
          value: labId,
          label: labDisplayName,
        };
        refLabArray.push(RefLabDetails);
      });

      setReferenceLabOptions(refLabArray);
    } catch (error) {
      console.error(t("Error fetching reference labs:"), error);
    }
  };

  const onRequisitionSelect = (e: any, name: string) => {
    setSearchRequest({ ...searchRequest, [name]: e.label });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  useEffect(() => {
    getReferenceLabs();
    GetRequsition();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
          <div className="d-flex align-items-center gap-2 gap-lg-3 responsive-flexed-actions-reverse">
            <button
              id={`SpecimenTypeAssigmentOpenSearch`}
              className={`btn btn-info btn-sm fw-bold search ${
                open || openModal ? "d-none" : "d-block"
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
              id={`SpecimenTypeAssigmentCloseSearch`}
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
              pageName="Specimen Type Assignment"
              permissionIdentifier="AddSpecimenTypeAssignment"
            >
              <button
                id={`SpecimenTypeAssigmentAddNew`}
                className={`btn btn-sm fw-bold btn-primary ${
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
                <span className="">{AddBtnText}</span>
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
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Specimen Type")}</label>
                      <input
                        id={`SpecimenTypeAssigmentSpecimenTypeSearch`}
                        type="text"
                        name="specimenType"
                        value={searchRequest.specimenType}
                        onChange={(e) => onInputChangeSearch(e)}
                        className="form-control bg-transparent"
                        placeholder={t("Specimen Type")}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Requisition Type")}</label>
                      <Select
                        inputId={`SpecimenTypeAssigmentRequisitionTypeSearch`}
                        menuPortalTarget={document.body}
                        styles={reactSelectStyle}
                        theme={(theme: any) => styles(theme)}
                        options={RequsitionList}
                        name="reqTypeId"
                        placeholder={t("Select Requisition Type")}
                        value={RequsitionList.filter(function (option: any) {
                          return (
                            option.label === searchRequest.requisitionTypeName
                          );
                        })}
                        onChange={(e: any) =>
                          onRequisitionSelect(e, "requisitionTypeName")
                        }
                        isSearchable={true}
                        className="z-index-3"
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Reference Lab")}</label>
                      <Select
                        inputId={`SpecimenTypeAssigmentRefLabNameSearch`}
                        menuPortalTarget={document.body}
                        styles={reactSelectStyle}
                        theme={(theme: any) => styles(theme)}
                        options={referenceLabOptions}
                        name="refLabName"
                        placeholder={t("Select Reference Lab")}
                        value={referenceLabOptions.filter(function (
                          option: any
                        ) {
                          return option.label === searchRequest.refLabName;
                        })}
                        onChange={(e: any) =>
                          onRequisitionSelect(e, "refLabName")
                        }
                        isSearchable={true}
                        className="z-index-3"
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="status" className="mb-2">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`SpecimenTypeAssigmentStatusSearch`}
                        name="isactive"
                        onChange={(e) => onInputChangeSearch(e)}
                        // value={searchRequest?.isactive}
                        className="form-select bg-transparent"
                        data-control="select2"
                        data-hide-search="true"
                        data-placeholder={t("Status")}
                        value={
                          searchRequest.isactive === false
                            ? "false"
                            : searchRequest.isactive === true
                              ? "true"
                              : ""
                        }
                      >
                        <option value="null">{t("--- Select ---")}</option>
                        <option value="true">{t("Active")}</option>
                        <option value="false">{t("Inactive")}</option>
                      </select>
                    </div>
                  </div>
                  <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                    <button
                      id={`SpecimenTypeAssigmentSearch`}
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
                      id={`SpecimenTypeAssigmentReset`}
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
              <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3 minh-42px">
                <h5 className="m-0 ">{modalheader}</h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => {
                      setOpenModal(false);
                      setValues((preVal: any) => {
                        return {
                          ...preVal,
                          id: 0,
                          reqTypeId: 0,
                          panelId: 0,
                          // testId: 0,
                          specimenTypeId: 0,
                          isactive: true,
                        };
                      });
                      setErrors((pre: any) => {
                        return {
                          panelError: "",
                          requisitionError: "",
                          specimenError: "",
                          referenceLabError: "",
                        };
                      });
                      //setValues([""]);
                      setPanels([]);
                      setValues({
                        reqTypeId: 0,
                        panels: [],
                        specimenTypeId: 0,
                        isactive: true,
                      });
                      setEditGridHeader(false);
                      setSelectedPanels([]);
                      setSports2([]);
                      loadData(false);
                      isShow(false);
                      setRequest(false);
                    }}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>
                  <button
                    className="btn btn-primary btn-sm btn-primary--icon px-7"
                    onClick={handleSubmit}
                  >
                    <span>
                      {request ? <LoaderIcon /> : null}
                      <span>{t(editGridHeader ? "Update" : "Save")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div id="form-search" className=" card-body py-3">
                <div className="row">
                  <AddSpecimenTypeAssigment
                    values={values}
                    errors={errors}
                    panels={panels}
                    sports2={sports2}
                    loadData={loadData}
                    setErrors={setErrors}
                    setPanels={setPanels}
                    setValues={setValues}
                    setSports2={setSports2}
                    handleOnChange={handleOnChange}
                    editGridHeader={editGridHeader}
                    selectedPanels={selectedPanels}
                    setSelectedPanels={setSelectedPanels}
                    referenceLabOptions={referenceLabOptions}
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
