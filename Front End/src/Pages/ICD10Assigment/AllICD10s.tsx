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
const AllICD10s: React.FC<any> = ({
  setPageSize1,
  open1,
  check,
  setOpen1,
  setCheck,
  AddNew1,
  loading2,
  UserList,
  pageSize1,
  EditICD10Code,
  changeStatus1,
  curPage1,
  total1,
  showPage1,
  prevPage1,
  pageNumbers1,
  totalPages1,
  nextPage1,
  searchRef1,
  handleSort1,
  sort1,
  handleClickOpen2,
}) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  return (
    <>
      <div className="card rounded-start-0">
        <div className="card-body py-md-4 py-3">
          <div className="d-flex flex-wrap justify-content-center align-items-center justify-content-sm-between gap-3 mb-2">
            <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
              <span className="fw-400 mr-3">{t("Records")}</span>
              <select
                id={`AllICD10Records`}
                className="form-select w-125px h-33px rounded py-2"
                data-kt-select2="true"
                data-placeholder="Select option"
                data-dropdown-parent="#kt_menu_63b2e70320b73"
                data-allow-clear="true"
                onChange={(e: any) => {
                  setPageSize1(parseInt(e.target.value));
                }}
              >
                <option value="5">5</option>
                <option value="50" selected>
                  50
                </option>
                <option value="100">100</option>
                <option value="500">500</option>
              </select>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`AllICD10SearchModalOpen`}
                className={`btn btn-info btn-sm fw-bold search ${
                  open1 ? "d-none" : check ? "d-none" : "d-block"
                }`}
                onClick={() => {
                  setOpen1(true);
                  if (check) {
                    setCheck(false);
                  }
                }}
                aria-controls="SearchCollapse"
                aria-expanded={open1}
              >
                {t("Search")}
              </button>
              <button
                id={`AllICD10SearchModalClose`}
                className={`btn btn-info btn-sm fw-bold ${
                  open1 ? "" : "collapse"
                }`}
                onClick={() => setOpen1(!open1)}
                aria-controls="SearchCollapse"
                aria-expanded={open1}
              >
                <i className="fa fa-times p-0"></i>
              </button>
              <PermissionComponent
                moduleName="Setup"
                pageName="ICD10 Code Assignment"
                permissionIdentifier="AddICD10Code"
              >
                <button
                  id={`AllICD10AddNew`}
                  className={`btn btn-primary btn-sm fw-bold search ${
                    check ? "d-none" : "d-block"
                  }`}
                  // onClick={() => setCheck(true)}
                  onClick={() => AddNew1()}
                  aria-controls="Add ICD10 Code"
                  aria-expanded={check}
                >
                  {t("Add ICD10 Code")}
                </button>
              </PermissionComponent>
            </div>
          </div>
          <Box sx={{ height: "auto", width: "100%" }}>
            <div className="table_bordered overflow-hidden">
              <TableContainer
                sx={
                  
                  isMobile ?  {} :
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
                      <TableCell className="min-w-49px">
                        {t("Actions")}
                      </TableCell>
                      <TableCell
                        className="min-w-350px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort1("icd10code")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef1}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("ICD10 Code")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort1.sortingOrder === "desc" &&
                                sort1.clickedIconData === "icd10code"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort1.sortingOrder === "asc" &&
                                sort1.clickedIconData === "icd10code"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell
                        className="min-w-300px"
                        sx={{ width: "max-content" }}
                      >
                        <div
                          onClick={() => handleSort1("description")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef1}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("ICD10 Description")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort1.sortingOrder === "desc" &&
                                sort1.clickedIconData === "description"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort1.sortingOrder === "asc" &&
                                sort1.clickedIconData === "description"
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
                          onClick={() => handleSort1("icd10status")}
                          className="d-flex justify-content-between cursor-pointer"
                          id=""
                          ref={searchRef1}
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Inactive/Active")}
                          </div>

                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort1.sortingOrder === "desc" &&
                                sort1.clickedIconData === "icd10status"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort1.sortingOrder === "asc" &&
                                sort1.clickedIconData === "icd10status"
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
                    {loading2 ? (
                      <TableCell colSpan={4} className="">
                        <Loader />
                      </TableCell>
                    ) : UserList.length ? (
                      UserList?.map((item: any) => (
                        <TableRow>
                          <TableCell className="text-center">
                            {item?.icd10status ? (
                              <div className="rotatebtnn">
                                <DropdownButton
                                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                  key="end"
                                  id={`AllICD103Dots_${item.icd10id}`}
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
                                    id={`AllICD10Edit`}
                                      eventKey="1"
                                      onClick={() => EditICD10Code(item)}
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
                                    id={`AllICD10Inactive`}
                                      eventKey="2"
                                      onClick={() =>
                                        handleClickOpen2(item?.icd10id, false)
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
                                  id={`AllICD103Dots_${item.icd10id}`}
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
                                    id={`AllICD10Active`}
                                      eventKey="2"
                                      onClick={() =>
                                        changeStatus1(item.icd10id, true)
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
                          <TableCell id={`AllICD10Code_${item.icd10id}`}>{item?.icd10code}</TableCell>
                          <TableCell id={`AllICD10Description_${item.icd10id}`}>{item?.description}</TableCell>
                          <TableCell id={`AllICD10Status_${item.icd10id}`} className="text-center">
                            {item?.icd10status ? (
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
                      <NoRecord colSpan={4} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* ==========================================================================================
                    //==================================== ICD10 CODE PAGINATION START =============================
                    //============================================================================================ */}
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
              {/* =============== */}
              <p className="pagination-total-record mb-0">
                {Math.min(pageSize1 * curPage1, total1) === 0 ? (
                  <span>
                    {t("Showing 0 to 0 of")} {total1} {t("entries")}
                  </span>
                ) : (
                  <span>
                    {t("Showing")} {pageSize1 * (curPage1 - 1) + 1} {t("to")}{" "}
                    {Math.min(pageSize1 * curPage1, total1)} {t("of Total")}
                    <span> {total1} </span> {t("entries")}
                  </span>
                )}
              </p>
              {/* =============== */}
              <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                <li
                  className="btn btn-lg p-2 h-33px"
                  onClick={() => showPage1(1)}
                >
                  <i className="fa fa-angle-double-left"></i>
                </li>
                <li className="btn btn-lg p-2 h-33px" onClick={prevPage1}>
                  <i className="fa fa-angle-left"></i>
                </li>

                {pageNumbers1.map((page1: any) => (
                  <li
                    key={page1}
                    className={`px-2 ${
                      page1 === curPage1
                        ? "font-weight-bold bg-primary text-white h-33px"
                        : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => showPage1(page1)}
                  >
                    {page1}
                  </li>
                ))}

                <li className="btn btn-lg p-2 h-33px" onClick={nextPage1}>
                  <i className="fa fa-angle-right"></i>
                </li>
                <li
                  className="btn btn-lg p-2 h-33px"
                  onClick={() => {
                    if (totalPages1 === 0) {
                      showPage1(curPage1);
                    } else {
                      showPage1(totalPages1);
                    }
                  }}
                >
                  <i className="fa fa-angle-double-right"></i>
                </li>
              </ul>
            </div>
            {/* ==========================================================================================
                    //====================================  ICD10 CODEPAGINATION END ===============================
                    //============================================================================================ */}
          </Box>
        </div>
      </div>
    </>
  );
};

export default AllICD10s;
