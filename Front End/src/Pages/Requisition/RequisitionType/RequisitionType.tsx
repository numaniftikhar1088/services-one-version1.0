import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import chroma from "chroma-js";
import React, { useState } from "react";
import Collapse from "react-bootstrap/Collapse";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select, { StylesConfig } from "react-select";
import { IFormValues } from ".";
import { IInput } from "../../../Pages/Compendium/PanelGroups/AddPanelGroup";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import FormInput from "../../../Shared/FormInput";
import { ArrowDown, ArrowUp, LoaderIcon } from "../../../Shared/Icons";
import { LinksArray } from "../../../Shared/Requisition/GridNavbar";
import { ReactState } from "../../../Shared/Type";
import { styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { RequisitionTypeInputs } from "../../../Utils/Requisition/Input";
import { ColourOption, colourOptions } from "./data";
import useLang from "Shared/hooks/useLanguage";
const dot = (color = "transparent") => ({
  alignItems: "center",
  display: "flex",
  ":before": {
    backgroundColor: color,

    content: '" "',
    display: "block",
    marginRight: 8,
    height: 12,
    width: 12,
  },
});
const colourStyles: StylesConfig<ColourOption> = {
  control: (provided: Record<string, unknown>, state: any) => ({
    ...provided,
    height: 38.4,
    boxShadow: "none",
    border: state.isFocused
      ? "1px solid var(--kt-input-focus-border-color)"
      : "1px solid var(--kt-input-disabled-border-color)",
    borderRadius: "0.85rem",
    "&::placeholde": {
      color: "#AAAAAA",
    },
  }),
  menuPortal: (style) => ({ ...style, zIndex: 9999 }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    const color = chroma(data.color);
    return {
      ...styles,

      backgroundColor: isDisabled
        ? undefined
        : isSelected
          ? color.alpha(0.8).css()
          : isFocused
            ? color.alpha(0.1).css()
            : undefined,
      color: isDisabled
        ? "#ccc"
        : isSelected
          ? chroma.contrast(color, "white") > 2
            ? "white"
            : "black"
          : data.color,
      cursor: isDisabled ? "not-allowed" : "default",
      display: "flex",
      alignItems: "center",
      paddingLeft: 8,
      ":before": {
        content: `" "`,
        display: "block",
        marginRight: 8,
        height: 12,
        width: 12,
        backgroundColor: data.color,
      },
      ":hover:before": {
        backgroundColor: chroma(data.color).alpha(0.7).css(),
      },
    };
  },
  input: (styles) => ({ ...styles, borderRadius: "10px", ...dot() }),
  placeholder: (styles) => ({
    ...styles,
    ...dot("#ccc"),
  }),
  singleValue: (styles, { data }) => ({ ...styles, ...dot(data.color) }),
};
function getColorLabel(hexValue: any) {
  const colorOption = colourOptions.find((option) => option.color === hexValue);
  if (colorOption) {
    return colorOption.label;
  } else {
    return "";
  }
}
interface Props {
  rows: {
    id: number;
    type: string;
    name: string;
    isActive: string | boolean;
    requisitionColor: string;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  values: IFormValues;
  setValues: any;
  setRequisitionList: any;
  requisitionList: any;
  requisitionColorList: any;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  loading: boolean;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  totalPages: any;
  pageNumbers: any;
  nextPage: any;
  showPage: any;
  prevPage: any;
  // handleOnChange: any;
  openModal: any;
  editGridHeader: any;
  handleSubmit: any;
  setRequisitionColorList: any;
  errors: any;
  setErrors: any;
  isRequest: any;
  handleSort: any;
  searchRef: any;
  sort: any;
  initialSorting: any;
  setSorting: any;
  setCurPage: any;
  setTriggerSearchData: any;
}
const RequisitionTypeGrid: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setOpenModal,
  values,
  setValues,
  setRequisitionList,
  requisitionList,
  requisitionColorList,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  loadData,
  loading,
  curPage,
  pageSize,
  setPageSize,
  total,
  totalPages,
  pageNumbers,
  nextPage,
  showPage,
  prevPage,
  // handleOnChange,
  openModal,
  editGridHeader,
  handleSubmit,
  setRequisitionColorList,
  errors,
  setErrors,
  isRequest,
  handleSort,
  searchRef,
  sort,
  initialSorting,
  setSorting,
  setCurPage,
  setTriggerSearchData,
}) => {
  const { t } = useLang();

  const Edit = (row: any) => {
    setOpen(false);
    setOpenModal(true);
    setValues({
      id: row.id,
      name: row.name,
      type: row.type,
      isActive: row.isActive,
      isSelected: row.isActive,
      requisitionColor: row.requisitionColor,
      requisitionId: row.requisitionId,
      isPatientSignatureRequired: row.isPatientSignatureRequired,
      isPhysicianSignatureRequired: row.isPhysicianSignatureRequired,
    });

    setRequisitionColorList({
      label: getColorLabel(row.requisitionColor),
      value: getColorLabel(row.requisitionColor),
      color: row.requisitionColor,
    });
    setErrors((pre: any) => {
      return {
        ...pre,
        nameError: "",
      };
    });
    setEditGridHeader(true);
  };

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
  const handleChangeStatus = (event: any) => {
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        isActive: event.target.value,
      };
    });
  };

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;

    if (type === "checkbox") {
      setValues((preVal: any) => ({
        ...preVal,
        [name]: e.target.checked,
      }));
    } else {
      setValues((preVal: any) => ({
        ...preVal,
        [name]: value,
      }));
      setErrors((pre: any) => ({
        ...pre,
        nameError: "",
      }));
    }
  };
  const handleOnChangeSignatures = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;

    setValues((preVal: any) => {
      return {
        ...preVal,
        [name]: e.target.checked,
      };
    });
  };
  const handleCheckInput = (event: any) => {
    setRequisitionColorList((pre: any) => ({
      ...pre,
      value: event.value,
      color: event.color,
      label: event.label,
    }));
    setValues((prevVal: any) => ({
      ...prevVal,
      reqColorId: requisitionColorList.value,
      requisitionColor: event.label,
      haxacode: requisitionColorList.color,
    }));
  };
  const handleCheckInputSearch = (event: any) => {
    setRequisitionColorList((pre: any) => ({
      ...pre,
      value: event.value,
      color: event.color,
      label: event.label,
    }));
    setSearchRequest((prevVal: any) => ({
      ...prevVal,
      requisitionColor: event.label,
      reqColorId: event.color,
    }));
  };
  const resetSearch = () => {
    loadData(true);
    setValues({});
    setSorting(initialSorting);
    setSearchRequest({
      name: "",
      requisitionStatus: "",
      type: "",
    });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
          <div
            id="kt_app_toolbar_container"
            className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
          >
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`RequisitionTypeAssignmentOpenSearch`}
                className={`btn btn-info btn-sm fw-bold search ${
                  open ? "d-none" : openModal ? "d-none" : "d-block"
                }`}
                onClick={() => {
                  setOpen(true);
                  if (openModal === true) {
                    setOpenModal(false);
                  }
                }}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-search"></i>
                <span>{t("Search")}</span>
              </button>
              <button
                id={`RequisitionTypeAssignmentCloseSearch`}
                className={`btn btn-info btn-sm fw-bold ${
                  open ? "btn-icon" : "collapse"
                }`}
                onClick={() => setOpen(!open)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-times p-0"></i>
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
                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <label htmlFor="status" className="mb-2 fw-500 text-dark">
                        {t("Requisition Type")}
                      </label>
                      <input
                        id={`RequisitionTypeAssignmentRequisitionType`}
                        name="type"
                        placeholder={t("Requisition Type")}
                        value={searchRequest?.type}
                        className="form-control"
                        onChange={handleChange}
                        onKeyDown={handleKeyPress}
                      />
                    </div>
                    {RequisitionTypeInputs?.map(
                      (input: IInput, index: number) => (
                        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                          <FormInput
                            key={index}
                            {...input}
                            id={`RequisitionTypeAssignment${input.label?.replace(
                              /\s/g,
                              ""
                            )}`}
                            value={searchRequest[input.name]}
                            onChange={handleChange}
                            onKeyDown={handleKeyPress}
                          />
                        </div>
                      )
                    )}

                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-12 col-12">
                      <label className="mb-2 fw-500 text-dark">
                        {t("Requisition Color")}
                      </label>
                      <Select
                        inputId={`RequisitionTypeAssignmentRequisitionColor`}
                        menuPortalTarget={document.body}
                        theme={(theme: any) => styles(theme)}
                        placeholder="--- Enter Requisition Color ---"
                        className="z-index-3"
                        options={colourOptions}
                        styles={colourStyles}
                        name="requisitionColor"
                        value={requisitionColorList}
                        onChange={(event: any) => {
                          handleCheckInputSearch(event);
                        }}
                        onKeyDown={handleKeyPress}
                      />
                    </div>

                    <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                      <label htmlFor="status" className="mb-2 fw-500 text-dark">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`RequisitionTypeAssignmentStatus`}
                        name="isActive"
                        onChange={handleChangeStatus}
                        value={
                          searchRequest.isActive === "false"
                            ? "false"
                            : searchRequest.isActive === "true"
                              ? "true"
                              : ""
                        }
                        className="form-select bg-transparent"
                      >
                        <option>{t("--- Select ---")}</option>
                        <option value="true">{t("Active")}</option>
                        <option value="false">{t("Inactive")}</option>
                      </select>
                    </div>

                    <div className="d-flex justify-content-end  gap-2 gap-lg-3 mt-5">
                      <button
                        id={`RequisitionTypeAssignmentSearch`}
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
                        onClick={() => resetSearch()}
                        className="btn btn-secondary btn-sm btn-secondary--icon"
                        id={`RequisitionTypeAssignmentReset`}
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
      <Collapse in={openModal}>
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid ">
            <div id="SearchCollapse" className="card">
              <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3">
                <h5 className="m-1">
                  {editGridHeader
                    ? "Edit Requisition Type Assignment"
                    : "Add Requisition Type Assignment"}
                </h5>
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id={`RequisitionTypeAssignmentCancel`}
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    onClick={() => {
                      // setValues([]);

                      setValues((preVal: any) => {
                        return {
                          id: 0,
                          name: "",
                          isActive: true,
                          type: "",
                        };
                      });
                      setRequisitionColorList((preVal: any) => {
                        return {
                          value: "",
                          color: "",
                          label: "",
                        };
                      });
                      setErrors((pre: any) => {
                        return {
                          ...pre,
                          nameError: "",
                          typeError: "",
                        };
                      });
                      setOpenModal(false);
                      setEditGridHeader(false);
                    }}
                  >
                    <span>
                      <i className="fa fa-times"></i>
                      <span>{t("Cancel")}</span>
                    </span>
                  </button>
                  <button
                    id={`RequisitionTypeAssignmentSave`}
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
              <div id="form-search" className=" card-body">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="required mb-2 fw-500 text-dark">
                      {t("Requisition")}
                    </label>
                    <input
                      id={`RequisitionTypeAssignmentRequisition`}
                      value={values?.type}
                      disabled={editGridHeader}
                      className="form-control"
                    />
                    <span style={{ color: "red" }}>{errors.typeError}</span>
                  </div>
                  {RequisitionTypeInputs?.map(
                    (input: IInput, index: number) => (
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <FormInput
                          id={`RequisitionTypeAssignment${input.label?.replace(
                            /\s/g,
                            ""
                          )}`}
                          key={index}
                          {...input}
                          value={values[input.name]}
                          onChange={handleOnChange}
                          required={true}
                        />
                        <span style={{ color: "red" }}>{errors.nameError}</span>
                      </div>
                    )
                  )}
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mb-2 fw-500 text-dark">
                      {t("Requisition Color")}
                    </label>
                    <Select
                      inputId={`RequisitionTypeAssignmentRequisitionColor`}
                      menuPortalTarget={document.body}
                      className="z-index-3"
                      options={colourOptions}
                      styles={colourStyles}
                      name="requisitionColor"
                      value={requisitionColorList}
                      onChange={(event: any) => {
                        handleCheckInput(event);
                      }}
                    />
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mr-2 mb-2 fw-500 text-dark">
                      {t("Physician Signature")}
                    </label>
                    <div className="form-check form-switch mb-2">
                      <input
                        id={`RequisitionTypeAssignmentSwitchButton`}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="isPhysicianSignatureRequired"
                        onChange={handleOnChangeSignatures}
                        checked={
                          values?.isPhysicianSignatureRequired ? true : false
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mr-2 mb-2 fw-500 text-dark">
                      {t("Patient Signature")}
                    </label>
                    <div className="form-check form-switch mb-2">
                      <input
                        id={`RequisitionTypeAssignmentSwitchButton2`}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="isPatientSignatureRequired"
                        onChange={handleOnChangeSignatures}
                        checked={
                          values?.isPatientSignatureRequired ? true : false
                        }
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mr-2 mb-2 fw-500 text-dark">
                      {t("Inactive/Active")}
                    </label>
                    <div className="form-check form-switch mb-2">
                      <input
                        id={`RequisitionTypeAssignmentStatusButton`}
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="isActive"
                        onChange={handleOnChange}
                        checked={values?.isActive ? true : false}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <label className="mr-2 mb-2 fw-500 text-dark">
                      {t("Is Selected by Default")}
                    </label>
                    <div className="form-check form-switch mb-2">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="isRequisitionPanelDefault"
                        id="isRequisitionPanelDefault"
                        onChange={handleOnChange}
                        checked={
                          values?.isRequisitionPanelDefault ? true : false
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Collapse>
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id={`RequisitionTypeAssignmentRecords`}
                  className="form-select w-125px h-33px rounded py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50" selected>
                    50
                  </option>
                  <option value="100">100</option>
                </select>
              </div>
              <Box sx={{ height: "auto", width: "100%" }}>
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={{
                      maxHeight: "calc(100vh - 100px)",
                      "&::-webkit-scrollbar": {
                        width: 7,
                      },
                      "&::-webkit-scrollbar-track": {
                        backgroundColor: "#fff",
                      },
                      "&:hover": {
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      },
                      "&::-webkit-scrollbar-thumb": {
                        backgroundColor: "var(--kt-gray-400)",
                        borderRadius: 2,
                      },
                    }}
                    component={Paper}
                    className="shadow-none"
                    // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                  >
                    <Table
                      stickyHeader
                      aria-label="table collapsible"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead className="h-35px">
                        <TableRow>
                          <TableCell className="min-w-50px w-50px">
                            {t("Actions")}
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("type")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Requisition Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "type"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "type"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("name")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Requisition Name")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "name"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "name"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-100px"
                            sx={{ width: "max-content" }}
                          >
                            {t("Physician Signature")}
                          </TableCell>
                          <TableCell
                            className="min-w-100px"
                            sx={{ width: "max-content" }}
                          >
                            {t("Patient Signature")}
                          </TableCell>
                          <TableCell
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("requisitionColor")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Requisition Color")}
                              </div>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                            </div>
                          </TableCell>
                          <TableCell
                            className="min-w-100px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort("isActive")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Status")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "isActive"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "isActive"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={7} className="">
                            <Loader />
                          </TableCell>
                        ) : (
                          rows?.map((item: any) => (
                            <TableRow>
                              <TableCell className="text-center">
                                <div className="rotatebtnn">
                                  <DropdownButton
                                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                    key="end"
                                    id={`RequisitionTypeAssignment3Dots_${item.id}`}
                                    drop="end"
                                    title={
                                      <i className="bi bi-three-dots-vertical p-0"></i>
                                    }
                                  >
                                    {item?.isActive ? (
                                      <>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Requisition Type Assignment"
                                          permissionIdentifier="Edit"
                                        >
                                          <Dropdown.Item
                                            id={`RequisitionTypeAssignmentEdit`}
                                            eventKey="3"
                                            className="w-auto"
                                          >
                                            <div
                                              onClick={() => Edit(item)}
                                              className="menu-item px-3"
                                            >
                                              <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                              {t("Edit")}
                                            </div>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Requisition Type Assignment"
                                          permissionIdentifier="Inactive"
                                        >
                                          <Dropdown.Item
                                            id={`RequisitionTypeAssignmentInactive`}
                                            eventKey="3"
                                            className="w-auto"
                                          >
                                            <div
                                              onClick={() =>
                                                statusChange(
                                                  item?.id,
                                                  item?.isActive
                                                )
                                              }
                                              className="menu-item px-3"
                                            >
                                              <i
                                                className="fa fa-ban text-danger mr-2"
                                                aria-hidden="true"
                                              ></i>
                                              {t("InActive")}
                                            </div>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                      </>
                                    ) : (
                                      <PermissionComponent
                                        moduleName="Setup"
                                        pageName="Requisition Type Assignment"
                                        permissionIdentifier="Active"
                                      >
                                        <Dropdown.Item
                                          id={`RequisitionTypeAssignmentActive`}
                                          eventKey="3"
                                          className="w-auto"
                                        >
                                          <div
                                            onClick={() =>
                                              statusChange(
                                                item?.id,
                                                item?.isActive
                                              )
                                            }
                                            className="menu-item px-3"
                                          >
                                            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                                            {t("Active")}
                                          </div>
                                        </Dropdown.Item>
                                      </PermissionComponent>
                                    )}
                                  </DropdownButton>
                                </div>
                              </TableCell>
                              <TableCell
                                id={`RequisitionTypeAssignmentType_${item.id}`}
                              >
                                {item?.type}
                              </TableCell>
                              <TableCell
                                id={`RequisitionTypeAssignmentName_${item.id}`}
                              >
                                {item?.name}
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-center mt-2">
                                  <div className="form-check form-switch mb-2">
                                    <input
                                      id={`RequisitionTypeAssignmentPhysicianSwitchButton`}
                                      className="form-check-input"
                                      type="checkbox"
                                      name="isPhysicianSignatureRequired"
                                      checked={
                                        item.isPhysicianSignatureRequired
                                      }
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-center mt-2">
                                  <div className="form-check form-switch mb-2">
                                    <input
                                      id={`RequisitionTypeAssignmentPatientSwitchButton`}
                                      className="form-check-input"
                                      type="checkbox"
                                      name="isPatientSignatureRequired"
                                      checked={item.isPatientSignatureRequired}
                                      readOnly
                                    />
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell
                                id={`RequisitionTypeAssignmentRequisitionColor_${item.id}`}
                              >
                                {getColorLabel(item?.requisitionColor)}
                              </TableCell>
                              <TableCell
                                id={`RequisitionTypeAssignmentStatus_${item.id}`}
                                className="text-center"
                              >
                                {item?.isActive ? (
                                  <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                                ) : (
                                  <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
                  <p className="pagination-total-record mb-0">
                    {Math.min(pageSize * curPage, total) === 0 ? (
                      <span>Showing 0 to 0 of {total} entries</span>
                    ) : (
                      <span>
                        Showing {pageSize * (curPage - 1) + 1} to
                        {Math.min(pageSize * curPage, total)} of Total
                        <span> {total} </span> entries
                      </span>
                    )}
                  </p>

                  <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
                    <li
                      className="btn btn-lg p-2 h-33px"
                      onClick={() => showPage(1)}
                    >
                      <i className="fa fa-angle-double-left"></i>
                    </li>
                    <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                      <i className="fa fa-angle-left"></i>
                    </li>

                    {pageNumbers.map((page: any) => (
                      <li
                        key={page}
                        className={`px-2 ${
                          page === curPage
                            ? "font-weight-bold bg-primary text-white h-33px"
                            : ""
                        }`}
                        style={{ cursor: "pointer" }}
                        onClick={() => showPage(page)}
                      >
                        {page}
                      </li>
                    ))}

                    <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                      <i className="fa fa-angle-right"></i>
                    </li>
                    <li
                      className="btn btn-lg p-2 h-33px"
                      onClick={() => {
                        if (totalPages === 0) {
                          showPage(curPage);
                        } else {
                          showPage(totalPages);
                        }
                      }}
                    >
                      <i className="fa fa-angle-double-right"></i>
                    </li>
                  </ul>
                </div>
                {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RequisitionTypeGrid;
