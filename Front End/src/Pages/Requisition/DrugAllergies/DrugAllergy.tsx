import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import { Loader } from "../../../Shared/Common/Loader";
import { LinksArray } from "../../../Shared/Compendium/GridNavbar";
import { ReactState } from "../../../Shared/Type";
import { inputs } from "../../../Utils/Compendium/Inputs";
import GridNavbar from "./GridNavbar";

import { Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import NoRecord from "../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";
interface Props {
  rows: {
    id: any;
    code: any;
    drugDescription: any;
    refLabId: any;
    referenceLab: any;
    labType: any;
    reqTypeId: any;
    requisition: any;
    facilityId: any;
    facility: any;
    panelId: any;
    panel: any;
    status: any;
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
  DeleteDrugAllergy: any;
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
  handleOnChange: any;

  // handleChangeRequisition: any;
  handleChangePanel: any;
  handleChangeFacility: any;
  handleChangecode: any;
  modalheader: any;
  openModal: any;
  handleSubmit: any;
  errors: any;
  setErrors: any;
  setRequest: any;
  request: any;
  sort: any;
  handleSort: any;
  searchRef: any;
  setSorting: any;
  initialsorting: any;
  setCurPage: any;
  setTriggerSearchData: any;
  setReference: any;
  setRequisition: any;
  setOpen: any;
  checkcollapse1: any;
  checkcollapse: any;
  open: any;
}
const DrugAllergyGrid: React.FC<Props> = ({
  rows,
  open,
  checkcollapse,
  checkcollapse1,
  setReference,
  setRequisition,
  setOpen,
  NavigatorsArray,
  setOpenModal,
  setCurPage,
  setValues,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  loadData,
  DeleteDrugAllergy,
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
  handleOnChange,
  // handleChangeRequisition,
  handleChangePanel,
  handleChangeFacility,
  handleChangecode,
  modalheader,
  openModal,
  values,
  handleSubmit,
  errors,
  setErrors,
  setRequest,
  request,
  sort,
  handleSort,
  searchRef,
  setSorting,
  initialsorting,
  setTriggerSearchData,
}) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const Edit = (item: any) => {
    setOpenModal(true);

    setValues((preVal: any) => {
      return {
        ...preVal,
        id: item.id,
        code: item.code,
        drugDescription: item.drugDescription,
        refLabId: item.refLabId,
        referenceLab: item.referenceLab,
        labType: item.labType,
        reqTypeId: item.reqTypeId,
        requisition: item.requisition,
        facilityId: item.facilityId,
        facility: item.facility,
        panelId: item.panelId,
        panel: item.panel,
        status: item?.status,
      };
    });
    setErrors((pre: any) => {
      return {
        ...pre,
        DrugDescriptionErrors: "",
        RequisitionError: "",
      };
    });
    setReference((pre: any) => {
      return {
        ...pre,
        value: item.refLabId,
        label: item.referenceLab,
      };
    });
    setRequisition((pre: any) => {
      return {
        ...pre,
        value: item.reqTypeId,
        label: item.requisition,
      };
    });
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
  const [value, setValue] = useState<any>(null);
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const handleClickOpen = (userid: any) => {
    setShow1(true);
    setValue(userid);
  };

  return (
    <>
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AssignedDrugAllergyModalDeleteCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AssignedDrugAllergyDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              DeleteDrugAllergy(value);
              ModalhandleClose1();
            }}
          >
            {t("Delete")}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="card">
        <div className="d-flex mt-2 flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
          <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
            <div className="d-flex align-items-center mb-2 justify-content-center justify-content-sm-start">
              <span className="fw-400 mr-3">{t("Records")}</span>
              <select
                id={`AssignedDrugAllergyRecords`}
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
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`AssignedDrugAllergyOpenSearch`}
              className={`btn btn-info btn-sm fw-bold search ${
                open ? "d-none" : openModal ? "d-none" : "d-block"
              }`}
              onClick={() => checkcollapse()}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-search"></i>
              <span>{t("Search")}</span>
            </button>
            <button
              id={`AssignedDrugAllergyCloseSearch`}
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
              pageName="Drug Allergies Assignment"
              permissionIdentifier="AddDrugAllergies"
            >
              <button
                id={`AssignedDrugAllergyAddNew`}
                onClick={() => checkcollapse1()}
                // onClick={() => setOpen(!open)}
                className={`btn btn-primary btn-sm fw-bold search ${
                  openModal ? "d-none" : "d-block"
                }`}
              >
                {t("Add Drug Allergies")}
              </button>
            </PermissionComponent>
          </div>
        </div>
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile
                  ? {
                      overflowY: "hidden",
                    }
                  :
                {
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
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead className="h-40px">
                  <TableRow>
                    <TableCell style={{ width: "49px" }}>
                      {t("Actions")}
                    </TableCell>
                    <TableCell
                      className="min-w-49px text-center"
                      style={{ width: "75px" }}
                      sx={{ width: "max-content" }}
                    >
                      <div
                        onClick={() => handleSort("code")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}> {t("Code")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "code"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "code"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-200px text-center"
                      sx={{ width: "max-content" }}
                    >
                      <div
                        onClick={() => handleSort("drugDescription")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Drug Description")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "drugDescription"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "drugDescription"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-150px text-center"
                      sx={{ width: "max-content" }}
                    >
                      <div
                        onClick={() => handleSort("requisition")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Requisition")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "requisition"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "requisition"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-150px text-center"
                      sx={{ width: "max-content" }}
                    >
                      <div
                        onClick={() => handleSort("referenceLab")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Reference Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "referenceLab"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "referenceLab"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      className="min-w-150px text-center"
                      sx={{ width: "max-content" }}
                    >
                      <div
                        onClick={() => handleSort("facility")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Facility")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "facility"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "facility"
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
                        onClick={() => handleSort("panel")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Panel")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "panel"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "panel"
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
                        onClick={() => handleSort("status")}
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
                              sort.clickedIconData === "status"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "status"
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
                    <TableCell colSpan={8} className="">
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
                              id={`AssignedDrugAllergy3Dots_${item.id}`}
                              drop="end"
                              title={
                                <i className="bi bi-three-dots-vertical p-0"></i>
                              }
                            >
                              <>
                                {item?.status === true ? (
                                  <>
                                    <PermissionComponent
                                      moduleName="Setup"
                                      pageName="Drug Allergies Assignment"
                                      permissionIdentifier="Edit"
                                    >
                                      <Dropdown.Item
                                        id={`AssignedDrugAllergyEdit`}
                                        className="w-auto"
                                        eventKey="1"
                                        onClick={() => {
                                          Edit(item);
                                          handleClose();
                                          setOpen(false);
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
                                      pageName="Drug Allergies Assignment"
                                      permissionIdentifier="Delete"
                                    >
                                      <Dropdown.Item
                                        id={`AssignedDrugAllergyDelete`}
                                        className="w-auto"
                                        eventKey="2"
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
                                    <PermissionComponent
                                      moduleName="Setup"
                                      pageName="Drug Allergies Assignment"
                                      permissionIdentifier="Inactive"
                                    >
                                      <Dropdown.Item
                                        id={`AssignedDrugAllergyInactive`}
                                        className="w-auto"
                                        eventKey="3"
                                        onClick={() =>
                                          statusChange(item?.id, item.status)
                                        }
                                      >
                                        <div className="menu-item px-3">
                                          <i
                                            className="fa fa-ban text-danger text-success mr-2 w-20px"
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
                                    pageName="Drug Allergies Assignment"
                                    permissionIdentifier="Active"
                                  >
                                    <Dropdown.Item
                                      id={`AssignedDrugAllergyActive`}
                                      className="w-auto"
                                      eventKey="3"
                                      onClick={() =>
                                        statusChange(item?.id, item.status)
                                      }
                                    >
                                      <div className="mr-2">
                                        <i
                                          className="fa fa-circle-check text-success mr-2 w-20px"
                                          aria-hidden="true"
                                        ></i>
                                        {t("Active")}
                                      </div>
                                    </Dropdown.Item>
                                  </PermissionComponent>
                                )}
                              </>

                              <></>
                            </DropdownButton>
                          </div>
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyCode_${item.id}`}
                          className="text-center"
                        >
                          {item?.code}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyDrugDescription_${item.id}`}
                          className="text-center"
                        >
                          {item?.drugDescription}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyRequisition_${item.id}`}
                          className="text-center"
                        >
                          {item.requisition}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyReferenceLab_${item.id}`}
                          className="text-center"
                        >
                          {item?.referenceLab}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyFacility_${item.id}`}
                          className="text-center"
                        >
                          {item?.facility}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyPanel_${item.id}`}
                          className="text-center"
                        >
                          {item?.panel}
                        </TableCell>
                        <TableCell
                          id={`AssignedDrugAllergyStatus_${item.id}`}
                          className="text-center"
                        >
                          {item?.status ? (
                            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                          ) : (
                            <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <NoRecord colSpan={8} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
            {/* =============== */}
            <p className="pagination-total-record mb-0">
              {Math.min(pageSize * curPage, total) === 0 ? (
                <span>
                  {t("Showing 0 to 0 of")} {total} {t("entries")}
                </span>
              ) : (
                <span>
                  {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}
                  {Math.min(pageSize * curPage, total)} {t("of Total")}
                  <span> {total} </span> {t("entries")}
                </span>
              )}
            </p>
            {/* =============== */}
            <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
              <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
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
    </>
  );
};

export default DrugAllergyGrid;
