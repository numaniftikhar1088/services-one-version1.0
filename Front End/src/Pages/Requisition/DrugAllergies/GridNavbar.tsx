import Collapse from "@mui/material/Collapse";
import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Requisition from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "../../../Shared/Icons";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import AddDrugAllergy from "./AddDrugAllergy";
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
  values: any;
  handleOnChange: any;
  reference: any;
  setReference: any;
  // handleChangeRequisition: any;
  handleChangePanel: any;
  handleChangeFacility: any;
  handleChangecode: any;
  // pen: any;
  openModal: any;
  setEditGridHeader: any;
  handleSubmit: any;
  setValues: any;
  errors: any;
  setErrors: any;
  requisition: any;
  setRequisition: any;
  request: any;
  setRequest: any;
  open: any;
  setOpen: any;
  setSorting: any;
  initialsorting: any;
  setCurPage: any;
  setTriggerSearchData: any;
  setReference1: any;
  setRequisition1: any;
  requisition1: any;
  reference1: any;
  resetSearch: any;
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
  setOpenModal,
  setCurPage,
  searchRequest,
  setSearchRequest,
  loadData,
  values,
  handleOnChange,
  reference,
  setReference,
  // handleChangeRequisition,
  handleChangePanel,
  handleChangeFacility,
  handleChangecode,
  // pen,
  openModal,
  setEditGridHeader,
  handleSubmit,
  setValues,
  errors,
  setErrors,
  requisition,
  setRequisition,
  request,
  setRequest,
  open,
  setReference1,
  requisition1,
  setRequisition1,
  reference1,
  setOpen,
  setSorting,
  initialsorting,
  resetSearch,
  setTriggerSearchData,
}) => {
  const { t } = useLang();
  const [des, setDes] = useState<any>([]);
  const [ref, setRef] = useState<any>([]);
  const [req, setReq] = useState<any>([]);
  const [pen1, setPen1] = useState<any>([]);
  const [fac, setFac] = useState<any>([]);
  const [cod, setCod] = useState<any>([]);

  const ReferenceLabLookup = () => {
    Requisition.GetReferenceLabLookup()
      .then((res: AxiosResponse) => {
        setRef(res?.data);
      })
      .catch((err: string) => {});
  };

  const RequisitionLookup = () => {
    Requisition.GetRequisitionLookup()
      .then((res: AxiosResponse) => {
        setReq(res?.data);
      })
      .catch((err: string) => {});
  };
  const FacilityLookup = () => {
    Requisition.GetFacilityLookup()
      .then((res: AxiosResponse) => {
        setFac(res?.data);
      })
      .catch((err: string) => {});
  };
  const CodeLookup = () => {
    Requisition.GetDescriptionLookup()
      .then((res: AxiosResponse) => {
        setCod(res.data[0]);
      })
      .catch((err: string) => {});
  };
  useEffect(() => {
    ReferenceLabLookup();
    RequisitionLookup();

    FacilityLookup();
    CodeLookup();
  }, []);
  const handleChangeReference1 = (e: any) => {
    const value = e.label;

    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        refLabId: e.value,
        referenceLab: e.label,
      };
    });
    setReference1((preVal: any) => {
      return {
        ...preVal,
        value: e.value,
        label: e.label,
      };
    });
  };
  const handleChangeRequisition1 = (e: any) => {
    const value = e.label;

    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        reqTypeId: e.value,
        requisition: e.label,
      };
    });
    setRequisition1((preVal: any) => {
      return {
        ...preVal,
        label: e.label,
        value: e.value,
      };
    });
    Requisition.GetPanelLookup(e.value)
      .then((res: AxiosResponse) => {
        setPen1(res?.data?.data);
      })
      .catch((err: string) => {});
  };
  const handleChangePanel1 = (e: any) => {
    const value = e.target.value;

    let result: any;
    if (value.includes("++")) {
      result = value.split("++");

      setSearchRequest((preVal: any) => {
        return {
          ...preVal,
          panelId: result[0],
          panel: result[1],
        };
      });
    }
  };

  const handleChangefacility1 = (e: any) => {
    const value = e.target.value;
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        [e.target.name]: value,
      };
    });
  };
  const handleChangecode1 = (e: any) => {
    const value = e.target.value;
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        drugDescription: value,
      };
    });
  };

  const handleChangeStatus1 = (e: any) => {
    const value = e.target.value;
    let myBool = value === "true" ? true : value === "false" ? false : "";
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        status: myBool,
      };
    });
  };
  const handlecode = (e: any) => {
    const value = e.target.value;
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        code: value,
      };
    });
  };
  const handlepanel = (e: any) => {
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        panel: e.target.value,
      };
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      loadData();
    }
  };
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <Collapse in={open}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <div id="SearchCollapse" className="card">
              <div id="form-search" className=" card-body">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">
                      {t("Drug Description")}
                    </label>
                    <select
                      id={`AssignedDrugAllergyDrugDescriptionSearch`}
                      className="form-select"
                      name="drugDescription"
                      value={searchRequest?.drugDescription}
                      onChange={handleChangecode1}
                    >
                      <option>{t("--- Select Drug Description ---")}</option>
                      {cod?.map((item: any) => (
                        <option id={item?.description} value={item.description}>
                          {item?.description}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">{t("Code")}</label>
                    <input
                      id={`AssignedDrugAllergyCodeSearch`}
                      className="form-control bg-light-transparent mb-2"
                      placeholder="Drug Code"
                      name="code"
                      value={searchRequest?.code}
                      onChange={handlecode}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">{t("Requisition")}</label>
                    <Select
                      inputId={`AssignedDrugAllergyRequisitionSearch`}
                      menuPortalTarget={document.body}
                      styles={reactSelectStyle}
                      theme={(theme: any) => styles(theme)}
                      name="requisition"
                      placeholder={t("Select Requisition")}
                      value={requisition1.value === 0 ? "" : requisition1}
                      className="z-index-3"
                      onChange={handleChangeRequisition1}
                      options={req}
                      // isSearchable={true}
                      // isClearable={true}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">{t("Reference Lab")}</label>
                    <Select
                      inputId={`AssignedDrugAllergyReferenceLabSearch`}
                      menuPortalTarget={document.body}
                      styles={reactSelectStyle}
                      theme={(theme: any) => styles(theme)}
                      name="referenceLab"
                      placeholder={t("Select Refernce Lab")}
                      value={reference1.value === 0 ? "" : reference1}
                      className="z-index-3"
                      onChange={handleChangeReference1}
                      options={ref}
                      onKeyDown={handleKeyPress}
                      // isSearchable={true}
                      // isClearable={true}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">{t("Facility")}</label>
                    <input
                      id={`AssignedDrugAllergyFacilitySearch`}
                      className="form-control bg-light-transparent mb-2"
                      placeholder={t("Facility")}
                      name="facility"
                      value={searchRequest?.facility}
                      onChange={handleChangefacility1}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">{t("Panel")}</label>
                    <input
                      id={`AssignedDrugAllergyPanelSearch`}
                      className="form-control bg-light-transparent mb-2"
                      placeholder={t("Panel")}
                      name="panel"
                      value={searchRequest?.panel}
                      onChange={handlepanel}
                      onKeyDown={handleKeyPress}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                    <label className="mb-2 fw-500">
                      {t("Inactive/Active")}
                    </label>
                    <select
                      id={`AssignedDrugAllergyStatusSearch`}
                      className="form-select"
                      name="status"
                      value={
                        searchRequest.status === false
                          ? "false"
                          : searchRequest.status === true
                            ? "true"
                            : ""
                      }
                      onChange={handleChangeStatus1}
                    >
                      <option value="">{t("--- Select ---")}</option>
                      <option value="true">{t("Active")}</option>
                      <option value="false">{t("Inactive")}</option>
                    </select>
                  </div>
                  <div className="d-flex justify-content-end  gap-2 gap-lg-3 pt-2">
                    <button
                      id={`AssignedDrugAllergySearch`}
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
                      id={`AssignedDrugAllergyReset`}
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
            <div className="card">
              <div className="align-items-center bg-light-warning card-header d-flex justify-content-sm-between justify-content-center gap-3 minh-42px">
                <h5 className="m-1">
                  {values?.id ? "Edit Drug Allergy" : "Add Drug Allergy"}
                </h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`AssignedDrugAllergyCancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => {
                      setOpenModal(false);
                      setValues((preVal: any) => {
                        return {
                          ...preVal,
                          id: 0,
                          code: "",
                          drugDescription: "",
                          refLabId: 0,
                          referenceLab: "",
                          reqTypeId: 0,
                          requisition: "",
                          facilityId: 0,
                          facility: "",
                          panelId: 0,
                          panel: "",
                          status: true,
                        };
                      });
                      setRequest(false);
                      setErrors((preVal: any) => {
                        return {
                          ...preVal,
                          DrugDescriptionErrors: "",
                          RequisitionError: "",
                          ReferenceError: "",
                          FacilityError: "",
                        };
                      });
                      setReference((preVal: any) => {
                        return {
                          ...preVal,
                          label: "",
                          value: 0,
                        };
                      });
                      setRequisition((preVal: any) => {
                        return {
                          ...preVal,
                          label: "",
                          value: 0,
                        };
                      });
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
                    id={`AssignedDrugAllergySave`}
                    className="btn btn-primary btn-sm btn-primary--icon px-7"
                    onClick={(e: any) => {
                      handleSubmit(e);
                      setRequisition((preVal: any) => {
                        return {
                          ...preVal,
                          label: "",
                          value: 0,
                        };
                      });
                      setReference((preVal: any) => {
                        return {
                          ...preVal,
                          label: "",
                          value: 0,
                        };
                      });
                    }}
                  >
                    <span>
                      {request ? <LoaderIcon /> : null}
                      <span>{t("Save")}</span>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card-body px-3 px-md-8">
                <AddDrugAllergy
                  values={values}
                  handleOnChange={handleOnChange}
                  // handleChangeRequisition={handleChangeRequisition}
                  handleChangePanel={handleChangePanel}
                  handleChangeFacility={handleChangeFacility}
                  handleChangecode={handleChangecode}
                  errors={errors}
                  setErrors={setErrors}
                  setValues={setValues}
                  reference={reference}
                  setReference={setReference}
                  setRequisition={setRequisition}
                  requisition={requisition}
                />
              </div>{" "}
            </div>{" "}
          </div>{" "}
        </div>
      </Collapse>
    </div>
  );
};

export default GridNavbar;
