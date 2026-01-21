import {
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { Loader } from "Shared/Common/Loader";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import CustomPagination from "Shared/JsxPagination";
import LabSelection from "./LabSelection";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

function InsuranceTab1Table({
  setPageSize,
  open,
  modalShow,
  setOpen,
  setModalShow,
  AddNew,
  show,
  setOpenRows,
  columns,
  searchRef,
  handleSort,
  sort,
  loadData,
  pageNumbers,
  handleClick,
  pageSize,
  total,
  totalPages,
  insuranceData,
  openRows,
  handleClickOpen,
  EditInsurance,
  loading,
  curPage,
  nextPage,
  showPage,
  prevPage,
  ProviderInsuranceAssignmentList,
}: any) {
  const { t } = useLang();
  const isMobile = useIsMobile();
  console.log(
    ProviderInsuranceAssignmentList,
    "ProviderInsuranceAssignmentList"
  );

  return (
    <>
      <div className="mb-5 hover-scroll-x">
        <div className="tab-pane" id="activetab" role="tabpanel">
          <div className="card tab-content-card">
            <div className="d-flex mt-2 flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
              <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id={`AssignInsuranceRecords`}
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
              <div className="d-flex align-items-center gap-2 ">
                <button
                  id={`AssignInsuranceOpenSearchModal`}
                  className={`btn btn-info btn-sm fw-bold search ${
                    open ? "d-none" : modalShow ? "d-none" : "d-block"
                  }`}
                  onClick={() => {
                    setOpen(!open);
                    if (modalShow) {
                      setModalShow(!modalShow);
                    }
                  }}
                  aria-controls="SearchCollapse"
                  aria-expanded={open}
                >
                  <i className="fa fa-search"></i>
                  <span>{t("Search")}</span>
                </button>
                <button
                  id={`AssignInsuranceCloseSearchModal`}
                  className={`btn btn-info btn-sm fw-bold ${
                    open ? "btn-icon" : "collapse"
                  }`}
                  style={{ height: "38.2px" }}
                  onClick={() => setOpen(!open)}
                  aria-controls="SearchCollapse"
                  aria-expanded={open}
                >
                  <i className="fa fa-times p-0"></i>
                </button>
                <PermissionComponent
                  moduleName="Setup"
                  pageName="Insurance Provider Assignment"
                  permissionIdentifier="AddInsuranceProviderAssignment"
                >
                  <button
                    id={`AssignInsuranceAddNew`}
                    className={`btn btn-sm fw-bold btn-primary ${
                      modalShow ? "d-none" : "d-block"
                    }`}
                    onClick={(e) => AddNew()}
                    aria-controls="ModalCollapse"
                    aria-expanded={modalShow}
                    disabled={show}
                  >
                    <span className="">
                      {t("Add Insurance Provider Assigment")}
                    </span>
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
                    className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead className="h-40px">
                      <TableRow>
                        <TableCell style={{ width: "49px" }}>
                          {t("Actions")}
                        </TableCell>
                        {columns.map((column: any) => (
                          <TableCell
                            key={column.key}
                            className="min-w-200px"
                            sx={{ width: "max-content" }}
                          >
                            <div
                              onClick={() => handleSort(column.key)}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t(column.label)}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === column.key
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0 `}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === column.key
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  } p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={8} className="">
                          <Loader />
                        </TableCell>
                      ) : ProviderInsuranceAssignmentList.length ? (
                        ProviderInsuranceAssignmentList.map(
                          (item: any, index: number) => (
                            <>
                              <TableRow key={index}>
                                <TableCell className="text-center">
                                  <DropdownButton
                                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn moreaction-dropdown"
                                    key="end"
                                    id={`AssignInsurance3Dots_${item.insuranceAssignmentId}`}
                                    drop="end"
                                    title={
                                      <i className="bi bi-three-dots-vertical p-0"></i>
                                    }
                                    onClick={(
                                      event: React.MouseEvent<HTMLElement>
                                    ) => handleClick(event, item)}
                                  >
                                    {insuranceData.status && (
                                      <PermissionComponent
                                        moduleName="Setup"
                                        pageName="Insurance Provider Assignment"
                                        permissionIdentifier="Edit"
                                      >
                                        <Dropdown.Item
                                          id={`AssignInsuranceEdit`}
                                          className="w-auto"
                                          eventKey="1"
                                          onClick={() => EditInsurance(item)}
                                        >
                                          <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                          {t("Edit")}
                                        </Dropdown.Item>
                                      </PermissionComponent>
                                    )}
                                    <Dropdown.Item
                                      id={`AssignInsuranceStatus`}
                                      className="w-auto"
                                      eventKey="2"
                                      onClick={(e) =>
                                        handleClickOpen(insuranceData)
                                      }
                                    >
                                      {insuranceData?.status ? (
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Insurance Provider Assignment"
                                          permissionIdentifier="Inactive"
                                        >
                                          <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                          {t("Inactive")}
                                        </PermissionComponent>
                                      ) : (
                                        <PermissionComponent
                                          moduleName="Setup"
                                          pageName="Insurance Provider Assignment"
                                          permissionIdentifier="Active"
                                        >
                                          <i className="fa fa-check-circle text-success mr-2 w-20px"></i>
                                          {t("Active")}
                                        </PermissionComponent>
                                      )}
                                    </Dropdown.Item>
                                  </DropdownButton>
                                </TableCell>
                                <TableCell
                                  id={`AssignInsuranceProviderName_${item.insuranceAssignmentId}`}
                                >
                                  {item?.providerName}
                                </TableCell>
                                <TableCell
                                  id={`AssignInsuranceDisplayName_${item.insuranceAssignmentId}`}
                                >
                                  {item?.displayName}
                                </TableCell>
                                <TableCell
                                  id={`AssignInsuranceInsuranceType_${item.insuranceAssignmentId}`}
                                >
                                  {item?.insuranceType}
                                </TableCell>
                                <TableCell
                                  id={`AssignInsuranceReferanceLab_${item.insuranceAssignmentId}`}
                                >
                                  {item?.referenceLabName}
                                </TableCell>
                                <TableCell
                                  id={`AssignInsuranceStatus_${item.insuranceAssignmentId}`}
                                  className="text-center"
                                >
                                  {item?.status ? (
                                    <i
                                      className="fa fa-check-circle text-success"
                                      title="Enabled"
                                    ></i>
                                  ) : (
                                    <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                  )}
                                </TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell colSpan={16} className="padding-0">
                                  <Collapse
                                    in={openRows[index]}
                                    timeout="auto"
                                    unmountOnExit
                                  >
                                    <Box sx={{ margin: 1 }}>
                                      <Typography gutterBottom component="div">
                                        <div className="table-expend-sticky">
                                          <div className="row">
                                            <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                                              <LabSelection
                                                setOpenRows={setOpenRows}
                                                id={item?.insuranceAssignmentId}
                                                loadData={loadData}
                                                item={item}
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </Typography>
                                    </Box>
                                  </Collapse>
                                </TableCell>
                              </TableRow>
                            </>
                          )
                        )
                      ) : (
                        <NoRecord colSpan={9} />
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
    </>
  );
}

export default InsuranceTab1Table;
