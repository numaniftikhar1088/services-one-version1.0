import { Paper } from "@mui/material";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";
const AssignedICD10: React.FC<any> = ({
  setPageSize,
  checkcollapse,
  open,
  Addopen,
  setOpen,
  AddNew,
  loading,
  ICD10AssigmentList,
  pageSize,
  curPage,
  nextPage,
  totalPages,
  showPage,
  total,
  pageNumbers,
  prevPage,
  changeStatus,
  EditAssigment,
  searchRef,
  handleSort,
  sort,
  handleClickOpen1,
}) => {
  const { t } = useLang();


  
// function useIsMobile() {
//   const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);
//   React.useEffect(() => {
//     const handleResize = () => setIsMobile(window.innerWidth <= 768);
//     window.addEventListener("resize", handleResize);
//     return () => window.removeEventListener("resize", handleResize);
//   }, []);
//   return isMobile;
// }


const isMobile = useIsMobile();


  return (
    <>
      <div className="card rounded-start-0">
        <div className="card-body py-md-4 py-3">
          <div className="d-flex flex-wrap justify-content-center align-items-center justify-content-sm-between gap-2 mb-2 responsive-flexed-actions">
            <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
              <span className="fw-500 mr-3">{t("Records")}</span>
              <select
                id={`AssignedICD10Records`}
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

            <div
              className={`d-flex align-items-center responsive-flexed-actions-reverse ${isMobile ? " flex-row justify-content-center" : " gap-2 gap-lg-3"}`}
              style={isMobile ? { flexDirection: "row", width: "100%", gap: 4  } : {}}
            >
              <button
                id={`AssignedICD10OpenSearchModal`}
                className={`btn btn-info btn-sm fw-bold search  ${
                  open ? "d-none" : "d-block"
                } ${Addopen ? "d-none" : "d-block"}`}
                onClick={() => checkcollapse()}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                {t("Search")}
              </button>
              <button
                id={`AssignedICD10CloseSearchModal`}
                className={`btn btn-info btn-sm fw-bold ${
                  open ? "" : "collapse"
                }`}
                onClick={() => setOpen(false)}
                aria-controls="SearchCollapse"
                aria-expanded={open}
              >
                <i className="fa fa-times p-0"></i>
              </button>
              <PermissionComponent
                moduleName="Setup"
                pageName="ICD10 Code Assignment"
                permissionIdentifier="AddICD10CodeAssignment"
              >
                <button
                  id={`AssignedICD10AddNew`}
                  className={`btn btn-primary btn-sm fw-bold search ${
                    Addopen ? "d-none" : "d-block"
                  }`}
                  onClick={() => AddNew()}
                  aria-expanded={Addopen}
                >
                  {t("Add ICD10 Code Assignment")}
                </button>
              </PermissionComponent>
            </div>
          </div>

          <Box sx={{ height: "auto", width: "100%" }}>
            <div className="table_bordered overflow-hidden">
              <TableContainer
                sx={
                  
                  isMobile ?  {
                    overflowY: "hidden",
                  } :
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
              >
                <Table
                  stickyHeader
                  aria-label="sticky table collapsible"
                  className="table-responsive table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                >
                  <TableHead className="h-40px">
                    <TableRow>
                      <TableCell className="min-w-49px">
                        {t("Actions")}
                      </TableCell>
                      <TableCell
                        className="w-100px min-w-100px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort("icD10Code")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("ICD10 Code")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "icD10Code"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "icD10Code"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="w-300 min-w-300px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort("icD10CodeDescription")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("ICD10 Description")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "icD10CodeDescription"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "icD10CodeDescription"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="w-200 min-w-200px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort("icd10group")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("ICD10 Group")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "icd10group"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "icd10group"
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
                          onClick={() => handleSort("facility")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {" "}
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
                        className="w-200px min-w-200px"
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
                        className="min-w-150px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort("requisitionType")}
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
                                sort.clickedIconData === "requisitionType"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "requisitionType"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="min-w-150px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort("panelName")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Panel")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "panelName"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "panelName"
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
                    ) : ICD10AssigmentList.length ? (
                      ICD10AssigmentList?.map((item: any) => (
                        <TableRow>
                          <TableCell className="text-center">
                            {item?.status ? (
                              <div className="rotatebtnn">
                                <DropdownButton
                                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                  key="end"
                                  id={`AssignedICD10_${item.icd10assignmentId}`}
                                  drop="end"
                                  title={
                                    <i className="bi bi-three-dots-vertical p-0"></i>
                                  }
                                >
                                  <PermissionComponent
                                    moduleName="Setup"
                                    pageName="ICD10 Code Assignment"
                                    permissionIdentifier="Edit"
                                  >
                                    <Dropdown.Item
                                    id={`AssignedICD10Edit`}
                                      className="w-auto"
                                      eventKey="1"
                                      onClick={() => EditAssigment(item)}
                                    >
                                      <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                      {t("Edit")}
                                    </Dropdown.Item>
                                  </PermissionComponent>
                                  <PermissionComponent
                                    moduleName="Setup"
                                    pageName="ICD10 Code Assignment"
                                    permissionIdentifier="Inactive"
                                  >
                                    <Dropdown.Item
                                    id={`AssignedICD10Inactive`}
                                      eventKey="2"
                                      onClick={() =>
                                        handleClickOpen1(
                                          item?.icd10assignmentId,
                                          false
                                        )
                                      }
                                    >
                                      <div className="menu-item">
                                        <i
                                          className="fa fa-ban text-danger mr-2 w-20px"
                                          aria-hidden="true"
                                        ></i>
                                        {t("Inactive")}
                                      </div>
                                    </Dropdown.Item>
                                  </PermissionComponent>
                                </DropdownButton>
                              </div>
                            ) : (
                              <div className="rotatebtnn">
                                <DropdownButton
                                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                  key="end"
                                  id={`AssignedICD103Dots_${item.icd10assignmentId}`}
                                  drop="end"
                                  title={
                                    <i className="bi bi-three-dots-vertical p-0"></i>
                                  }
                                >
                                  <PermissionComponent
                                    moduleName="Setup"
                                    pageName="ICD10 Code Assignment"
                                    permissionIdentifier="Active"
                                  >
                                    <Dropdown.Item
                                    id={`AssignedICD10Active`}
                                      className="w-auto"
                                      eventKey="2"
                                      onClick={() =>
                                        changeStatus(
                                          item?.icd10assignmentId,
                                          true
                                        )
                                      }
                                    >
                                      <div className="menu-item px-3">
                                        <i
                                          className="fa fa-check-circle text-success mr-2 w-20px"
                                          aria-hidden="true"
                                        ></i>
                                        {t("Active")}
                                      </div>
                                    </Dropdown.Item>
                                  </PermissionComponent>
                                </DropdownButton>
                              </div>
                            )}
                          </TableCell>
                          <TableCell id={`AssignedICD10Code_${item.icd10assignmentId}`} className="text-center">
                            {item?.icD10Code}
                          </TableCell>
                          <TableCell id={`AssignedICD10Description_${item.icd10assignmentId}`}>{item?.icD10CodeDescription}</TableCell>
                          <TableCell id={`AssignedICD10Group_${item.icd10assignmentId}`}>{item?.icd10group}</TableCell>
                          <TableCell id={`AssignedICD10Facility_${item.icd10assignmentId}`}>{item?.facility}</TableCell>
                          <TableCell id={`AssignedICD10ReferenceLab_${item.icd10assignmentId}`}>{item?.referenceLab}</TableCell>
                          <TableCell id={`AssignedICD10RequisitionType_${item.icd10assignmentId}`}>{item?.requisitionType}</TableCell>
                          <TableCell id={`AssignedICD10PanelName_${item.icd10assignmentId}`}>{item?.panelName}</TableCell>
                          <TableCell id={`AssignedICD10Status_${item.icd10assignmentId}`} className="text-center">
                            {item?.status ? (
                              <i
                                className="fa fa-check-circle text-success"
                                title="Enabled"
                              ></i>
                            ) : (
                              <i
                                className="fa fa-ban text-danger"
                                title="Enabled"
                              ></i>
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
                    //====================================  ICD10 ASSIGMENT PAGINATION START =======================
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
                    {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                    {Math.min(pageSize * curPage, total)} {t("of Total")}
                    <span> {total} </span> {t("entries")}
                  </span>
                )}
              </p>
              {/* =============== */}
              <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
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
                    //====================================  ICD10 ASSIGMENT PAGINATION END =========================
                    //============================================================================================ */}
          </Box>
        </div>
      </div>
    </>
  );
};

export default AssignedICD10;
