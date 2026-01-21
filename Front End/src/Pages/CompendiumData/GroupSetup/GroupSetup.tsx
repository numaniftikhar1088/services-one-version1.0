import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { ReactState } from "../../../Shared/Type";
import { inputs } from "../../../Utils/Compendium/Inputs";
import GridNavbar from "./GridNavbar";
import useLang from "Shared/hooks/useLanguage";
import CustomPagination from "./../../../Shared/JsxPagination/index";
import useIsMobile from "Shared/hooks/useIsMobile";

interface Props {
  rows: {
    id: any;
    name: any;
    description: any;
    isActive: any;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  values: any;
  setValues: any;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  loadData: any;
  DeleteGroup: any;
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
  openModal: any;
  open: any;
  setOpen: any;
  handleChange: any;
  handleSubmit: any;
  modalheader: any;
  errors: any;
  setErrors: any;
  isRequest: any;
  setIsRequest: any;
  searchRef: any;
  handleSort: any;
  sort: any;
  setSorting: any;
  setTriggerSearchData: any;
  setCurPage: any;
}
const GroupSetupGrid: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setOpenModal,
  setValues,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  loadData,
  DeleteGroup,
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
  openModal,
  handleChange,
  values,
  handleSubmit,
  modalheader,
  errors,
  setErrors,
  open,
  setOpen,
  isRequest,
  setIsRequest,
  searchRef,
  handleSort,
  sort,
  setSorting,
  setTriggerSearchData,
  setCurPage,
}) => {
  const { t } = useLang();

  const isMobile = useIsMobile();

  const [openalert, setOpenAlert] = React.useState(false);
  const [value, setValue] = useState<any>({
    id: "",
  });
  const handleClickOpen = (id: any) => {
    setOpenAlert(true);
    setValue(() => {
      return {
        id: id,
      };
    });
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const Edit = (item: any) => {
    setOpenModal(true);
    setOpen(false);
    setValues((preVal: any) => {
      return {
        ...preVal,
        id: item?.id,
        name: item?.name,
        description: item?.description,
        isActive: item?.isActive,
        reqTypeName: item.reqTypeName,
        reqTypeId: item?.reqTypeId,
      };
    });
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

  return (
    <>
      <GridNavbar
        openModal={openModal}
        NavigatorsArray={NavigatorsArray}
        AddBtnText="Add Group Setup"
        setOpenModal={setOpenModal}
        Inputs={inputs}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
        statusDropDownName="specimenStatus"
        handlechange={handleChange}
        values={values}
        handleSubmit={handleSubmit}
        setValues={setValues}
        setEditGridHeader={setEditGridHeader}
        modalheader={modalheader}
        errors={errors}
        setErrors={setErrors}
        open={open}
        setOpen={setOpen}
        isRequest={isRequest}
        setIsRequest={setIsRequest}
        setSorting={setSorting}
        setTriggerSearchData={setTriggerSearchData}
        setCurPage={setCurPage}
      />
      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id={`GroupSetupRecords`}
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
              <div className="card">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={
                        
                        isMobile ?  {
                        overflowY: "hidden",

                        }:  {
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
                    >
                      <Table
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      >
                        <TableHead>
                          <TableRow>
                            <TableCell className="w-50px min-w-50px">
                              {t("Actions")}
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
                                  {t("Group Name")}
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
                              className="min-w-200px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("description")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Display Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "description"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "description"
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
                                onClick={() => handleSort("reqTypeName")}
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
                                      sort.clickedIconData === "reqTypeName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "reqTypeName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-100px text-center"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("isActive")}
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
                            <TableCell colSpan={5} className="">
                              <Loader />
                            </TableCell>
                          ) : rows.length ? (
                            rows?.map((item: any) => (
                              <TableRow
                                sx={{ "& > *": { borderBottom: "unset" } }}
                              >
                                <TableCell className="text-center">
                                  <div className="rotatebtnn">
                                    <DropdownButton
                                      className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                      key="end"
                                      id={`GroupSetup3Dots_${item.id}`}
                                      drop="end"
                                      title={
                                        <i className="bi bi-three-dots-vertical p-0"></i>
                                      }
                                    >
                                      {item?.isActive === true ? (
                                        <>
                                          <PermissionComponent
                                            moduleName="Setup"
                                            pageName="Groups"
                                            permissionIdentifier="Edit"
                                          >
                                            <Dropdown.Item
                                            id={`GroupSetupEdit`}
                                              className="w-auto"
                                              eventKey="1"
                                              onClick={() => {
                                                Edit(item);
                                                handleClose();
                                              }}
                                            >
                                              <div className="menu-item px-3">
                                                <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                                {t("Edit")}
                                              </div>
                                            </Dropdown.Item>
                                          </PermissionComponent>
                                          <PermissionComponent
                                            moduleName="Setup"
                                            pageName="Groups"
                                            permissionIdentifier="Inactive"
                                          >
                                            <Dropdown.Item
                                            id={`GroupSetupInactive`}
                                              className="w-auto"
                                              eventKey="1"
                                              onClick={() => {
                                                statusChange(
                                                  item?.id,
                                                  item?.isActive
                                                );
                                                handleClose();
                                              }}
                                            >
                                              <div className="menu-item px-3">
                                                <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                                {t("Inactive")}
                                              </div>
                                            </Dropdown.Item>
                                          </PermissionComponent>
                                          <PermissionComponent
                                            moduleName="Setup"
                                            pageName="Groups"
                                            permissionIdentifier="Delete"
                                          >
                                            <Dropdown.Item
                                            id={`GroupSetupDelete`}
                                              className="w-auto"
                                              eventKey="1"
                                              onClick={() =>
                                                handleClickOpen(item?.id)
                                              }
                                            >
                                              <div className="menu-item px-3">
                                                <i className="fa fa-trash text-danger mr-2 w-20px"></i>
                                                {t("Delete")}
                                              </div>
                                            </Dropdown.Item>
                                          </PermissionComponent>
                                        </>
                                      ) : (
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Groups"
                                          permissionIdentifier="Active"
                                        >
                                          <Dropdown.Item
                                          id={`GroupSetupActive`}
                                            className="w-auto"
                                            eventKey="1"
                                            onClick={() => {
                                              statusChange(
                                                item?.id,
                                                item?.isActive
                                              );
                                              handleClose();
                                            }}
                                          >
                                            <div className="menu-item px-3">
                                              <i
                                                className="fa fa-circle-check text-success mr-2 w-20px px-3"
                                                aria-hidden="true"
                                              ></i>
                                              {t("Active")}
                                            </div>
                                          </Dropdown.Item>
                                        </PermissionComponent>
                                      )}
                                    </DropdownButton>
                                  </div>
                                </TableCell>
                                <TableCell id={`GroupSetupName_${item.id}`}>{item?.name}</TableCell>
                                <TableCell id={`GroupSetupDescription_${item.id}`}>{item?.description}</TableCell>
                                <TableCell id={`GroupSetupReqTypeName_${item.id}`}>{item?.reqTypeName}</TableCell>
                                <TableCell id={`GroupSetupStatus_${item.id}`} className="text-center">
                                  {item?.isActive ? (
                                    <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                                  ) : (
                                    <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <NoRecord colSpan={5} />
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
              <BootstrapModal
                show={openalert}
                onHide={handleCloseAlert}
                backdrop="static"
                keyboard={false}
              >
                <BootstrapModal.Header
                  closeButton
                  className="bg-light-primary m-0 p-5"
                >
                  <h4>{t("Delete Group")}</h4>
                </BootstrapModal.Header>
                <BootstrapModal.Body>
                  {t("Are you sure you want to delete ?")}
                </BootstrapModal.Body>
                <BootstrapModal.Footer className="p-0">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseAlert}
                  >
                    {t("Cancel")}
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger m-2"
                    onClick={() => {
                      DeleteGroup(value.id);
                      handleCloseAlert();
                    }}
                  >
                    <span>
                      {""} {t("Delete")}
                    </span>
                  </button>
                </BootstrapModal.Footer>
              </BootstrapModal>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GroupSetupGrid;
