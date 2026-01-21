import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { IFormValues } from ".";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import FormInput from "../../../Shared/FormInput";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp, LoaderIcon } from "../../../Shared/Icons";
import CustomPagination from "../../../Shared/JsxPagination";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { inputs } from "../../../Utils/Compendium/Inputs";
import AddSpecimen from "./AddSpecimen";
import useIsMobile from "Shared/hooks/useIsMobile";
interface Props {
  rows: {
    specimenTypeId: string | any;
    specimenType: string | any;
    specimenStatus: string | boolean | any;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: any;
  values: IFormValues;
  setValues: any;
  statusChange: Function;
  setEditGridHeader: any;
  editGridHeader: any;
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
  open: any;
  setOpen: any;
  handleChange: any;
  resetSearch: any;
  openModal: any;
  // handleOnChange: any;
  handleSubmit: any;
  errors: any;
  setErrors: any;
  isRequest: any;
  setIsRequest: any;
  searchRef: any;
  handleSort: any;
  sort: any;
  setCurPage: any;
  setTriggerSearchData: any;
  DeleteSpecimenType: any;
}
const SpecimenTypeGrid: React.FC<Props> = ({
  rows,
  setOpenModal,
  setValues,
  statusChange,
  setEditGridHeader,
  editGridHeader,
  searchRequest,
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
  open,
  setOpen,
  handleChange,
  resetSearch,
  openModal,
  values,
  handleSubmit,
  errors,
  setErrors,
  isRequest,
  setIsRequest,
  searchRef,
  handleSort,
  sort,
  setCurPage,
  setTriggerSearchData,
  DeleteSpecimenType,
}) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const Edit = (item: any) => {
    window.scrollTo(0, 0);
    setOpenModal(true);
    setValues(item);
    setIsRequest(false);
    setEditGridHeader(true);
  };
  // ********** DROPDOWN START *********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ******** DROPDOWN END ***********
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
          <div className="app-container container-fluid d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`SpecimenTypeOpenSearch`}
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
                id={`SpecimenTypeCloseSearch`}
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
                pageName="Specimen Type"
                permissionIdentifier="AddSpecimenType"
              >
                <button
                  id={`SpecimenTypeAddNew`}
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
                  <span className="">{t("Add Specimen Type")}</span>
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
                    {inputs?.map((input: any, index: number) => (
                      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                        <FormInput
                          id={`SpecimenTypeSearch${input.name}`}
                          key={index}
                          {...input}
                          value={searchRequest[input.name]}
                          onChange={handleChange}
                          onKeyDown={handleKeyPress}
                        />
                      </div>
                    ))}
                    <div className="d-flex justify-content-end  gap-2 gap-lg-3">
                      <button
                        id={`SpecimenTypeSearch`}
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
                        id={`SpecimenTypeReset`}
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
                  <h5 className="m-1">
                    {editGridHeader
                      ? t("Edit Specimen Type")
                      : t("Add Specimen Type")}
                  </h5>
                  <div className="d-flex align-items-center gap-2 gap-lg-3">
                    <button
                      id={`SpecimenTypeCancel`}
                      className="btn btn-secondary btn-sm fw-bold "
                      aria-controls="SearchCollapse"
                      aria-expanded="true"
                      onClick={() => {
                        setOpenModal(false);
                        setValues((preVal: any) => {
                          return {
                            ...preVal,
                            specimenTypeId: 0,
                            specimenType: "",
                            specimenStatus: true,
                          };
                        });
                        setEditGridHeader(false);
                        setErrors({
                          TypeError: "",
                          PreFixError: "",
                        });
                      }}
                    >
                      <span>
                        <i className="fa fa-times"></i>
                        <span>{t("Cancel")}</span>
                      </span>
                    </button>
                    <button
                      id={`SpecimenTypeSave`}
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
                    <AddSpecimen
                      values={values}
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
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id={`SpecimenTypeRecords`}
                  className="form-select w-125px h-33px rounded"
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
                    sx={
                      isMobile
                        ? {
                            overflowY: "hidden",
                          }
                        : {
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
                          }
                    }
                    component={Paper}
                    className="shadow-none"
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
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
                              onClick={() => handleSort("specimenType")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Specimen Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "specimenType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "specimenType"
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
                            <div
                              onClick={() => handleSort("specimenStatus")}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Inactive/Active")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "specimenStatus"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "specimenStatus"
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
                          <TableCell colSpan={4} className="">
                            <Loader />
                          </TableCell>
                        ) : rows.length ? (
                          rows?.map((item: any) => (
                            <TableRow>
                              <TableCell className="text-center">
                                <div className="rotatebtnn">
                                  <DropdownButton
                                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                    key="end"
                                    id={`SpecimenType3Dots_${item?.specimenTypeId}`}
                                    drop="end"
                                    title={
                                      <i className="bi bi-three-dots-vertical p-0"></i>
                                    }
                                  >
                                    {item?.specimenStatus === true ? (
                                      <>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Specimen Type"
                                          permissionIdentifier="Edit"
                                        >
                                          <Dropdown.Item
                                            id={`SpecimenTypeEdit`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              Edit(item);
                                              handleClose();
                                              // Scrolls the window to the top
                                            }}
                                          >
                                            <span className="menu-item px-3">
                                              <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                              {t("Edit")}
                                            </span>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Specimen Type"
                                          permissionIdentifier="Inactive"
                                        >
                                          <Dropdown.Item
                                            id={`SpecimenTypeInactive`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              statusChange(
                                                item?.specimenTypeId,
                                                item?.specimenStatus
                                              );
                                              handleClose();
                                            }}
                                          >
                                            <span className="menu-item px-3">
                                              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                              {t("Inactive")}
                                            </span>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Specimen Type"
                                          permissionIdentifier="Delete"
                                        >
                                          <Dropdown.Item
                                            id={`SpecimenTypeDelete`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              DeleteSpecimenType(
                                                item?.specimenTypeId
                                              );
                                              handleClose();
                                            }}
                                          >
                                            <span className="menu-item px-3">
                                              <i
                                                className="fa fa-trash text-danger mr-2 w-20px"
                                                aria-hidden="true"
                                              ></i>
                                              {t("Delete")}
                                            </span>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                      </>
                                    ) : (
                                      <>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Specimen Type"
                                          permissionIdentifier="Active"
                                        >
                                          <Dropdown.Item
                                            id={`SpecimenTypeActive`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              statusChange(
                                                item?.specimenTypeId,
                                                item?.specimenStatus
                                              );
                                              handleClose();
                                            }}
                                          >
                                            <span className="menu-item px-3">
                                              <i
                                                className="fa fa-circle-check text-success mr-2 w-20px px-3"
                                                aria-hidden="true"
                                              ></i>
                                              {t("Active")}
                                            </span>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Specimen Type"
                                          permissionIdentifier="Delete"
                                        >
                                          <Dropdown.Item
                                            id={`SpecimenTypeDelete`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              DeleteSpecimenType(
                                                item?.specimenTypeId
                                              );
                                              handleClose();
                                            }}
                                          >
                                            <span className="menu-item px-3">
                                              <i
                                                className="fa fa-trash text-danger mr-2 w-20px px-3"
                                                aria-hidden="true"
                                              ></i>
                                              {t("Delete")}
                                            </span>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                      </>
                                    )}
                                  </DropdownButton>
                                </div>
                              </TableCell>
                              <TableCell
                                id={`SpecimenTypeSpecimenType_${item?.specimenTypeId}`}
                              >
                                {item?.specimenType}
                              </TableCell>

                              <TableCell
                                id={`SpecimenTypeStatus_${item?.specimenTypeId}`}
                              >
                                {item?.specimenStatus ? (
                                  <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                                ) : (
                                  <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                )}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <NoRecord colSpan={4} />
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
                {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                <CustomPagination
                  curPage={curPage}
                  nextPage={nextPage}
                  pageNumbers={pageNumbers}
                  pageSize={pageSize}
                  prevPage={prevPage}
                  showPage={showPage}
                  total={total}
                  totalPages={totalPages}
                />
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

export default SpecimenTypeGrid;
