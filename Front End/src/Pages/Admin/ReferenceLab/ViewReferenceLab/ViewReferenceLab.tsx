import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { Link } from "react-router-dom";
import BreadCrumbs from "Utils/Common/Breadcrumb";
import { IRLabrequest } from "../../../../Interface/Lab";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import { Loader } from "../../../../Shared/Common/Loader";
import { InputChangeEvent } from "../../../../Shared/Type";
import useLang from "./../../../../Shared/hooks/useLanguage";

const ITEM_HEIGHT = 48;
const ViewReferenceLab: React.FC<{}> = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };

  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    fetchAllLabs(getLabsRequest);
  }, []);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open1 = Boolean(anchorEl);
  // const handleClick = (event) => {
  //   setAnchorEl(event.currentTarget);
  // };
  // const handleClose = () => {
  //   setAnchorEl(null);
  // };
  const [open, setOpen] = useState(false);
  const [labsList, setLabsList] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(labsList, "labsList");

  const [getLabsRequest, setGetLabsRequest] = useState<IRLabrequest>({
    queryModel: {
      labName: "",
      code: "",
      labDisplayName: "",
      enter3DigitsProgram: "",
      enter3DigitsLabCode: "",
      labType: "",
      clia: "",
      status: null,
    },
  });
  // ********************  searchform
  const [optionValue, setOptionValue] = useState("");
  const onInputChange = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === "status") {
      if (parseInt(e.target.value) === 1) {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            status: true,
          },
        });
        setOptionValue("1");
      } else if (e.target.value === "") {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            status: null,
          },
        });
        setOptionValue("");
      } else {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            status: false,
          },
        });
        setOptionValue("0");
      }
    } else {
      setGetLabsRequest({
        ...getLabsRequest,
        queryModel: {
          ...getLabsRequest.queryModel,
          [e.target.name]: e.target.value,
        },
      });
    }
  };
  const {
    labName,
    labDisplayName,
    enter3DigitsProgram,
    enter3DigitsLabCode,
    labType,
    status,
  } = getLabsRequest.queryModel;
  // **** searchform end

  // ******************** get lab data
  const fetchAllLabs = (request: IRLabrequest) => {
    setLoading(true);
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: request.queryModel,
    };

    UserManagementService.GetAllReferenceLab(obj)
      .then((res: AxiosResponse) => {
        setLabsList(res.data.data);
        setTotal(res?.data?.total);
        // setRows(res.data.data)
        setLoading(false);
      })
      .catch((err: AxiosError) => {
        console.log(err, t("success in getting labs list"));
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAllLabs(getLabsRequest);
  }, [pageSize, curPage, triggerSearchData]);

  // ******************** reset searchform
  const resetSearchForm = () => {
    setOptionValue("");
    let resetFormObject = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: {
        labName: "",
        code: "",
        labDisplayName: "",
        enter3DigitsProgram: "",
        enter3DigitsLabCode: "",
        labType: "",
        clia: "",
        status: null,
      },
    };
    setGetLabsRequest(resetFormObject);
    fetchAllLabs(resetFormObject);
  };

  // ******************** reset searchform

  // ******************** remove
  const statusChange = (val: any) => {
    if (val.status === true) {
      val.status = false;
    } else {
      val.status = true;
    }

    UserManagementService.StatusChangeReferenceLab(
      val.referenceLabId,
      val.status
    )
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          // Assuming the status change is successful, you can fetch the updated lab list here.
          fetchAllLabs(getLabsRequest);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err, t("Error in status change for lab"));
      });
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <BreadCrumbs />
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Button
              id={`ViewReferanceLabSearchOpen`}
              className={`btn btn-info btn-sm fw-bold search ${
                open ? "d-none" : "d-block"
              }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-search"></i>
              <span>{t("Search")}</span>
            </Button>
            <Button
              id={`ViewReferanceLabCancelSearch`}
              className={`btn btn-info btn-sm fw-bold ${
                open ? "btn-icon" : "collapse"
              }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-times p-0"></i>
            </Button>

            <Link
              id={`ViewReferanceLabAddNew`}
              to="/CreateLab"
              className="btn btn-sm fw-bold btn-primary"
            >
              {t("Add Reference Lab")}
            </Link>
          </div>
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <Collapse in={open}>
            <div id="SearchCollapse" className="card mb-5">
              <div id="form-search" className=" card-body">
                <div className="row">
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Lab Name")}</label>
                      <input
                        id={`ViewReferanceLabLabName`}
                        type="text"
                        name="labName"
                        className="form-control bg-transparent"
                        placeholder={t("Lab Name")}
                        onChange={onInputChange}
                        value={labName}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Lab Display Name")}</label>
                      <input
                        id={`ViewReferanceLabDisplayName`}
                        type="text"
                        name="labDisplayName"
                        className="form-control bg-transparent"
                        placeholder={t("Lab Display Name")}
                        onChange={onInputChange}
                        value={labDisplayName}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">
                        {t("Enter 3 Digits Program")}
                      </label>
                      <input
                        id={`ViewReferanceLab3DigitsProgram`}
                        type="text"
                        name="enter3DigitsProgram"
                        className="form-control bg-transparent"
                        placeholder={t("Enter 3 Digits Program")}
                        onChange={onInputChange}
                        value={enter3DigitsProgram}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Enter 3 Digits Code")}</label>
                      <input
                        id={`ViewReferanceLab3DigitsLabCode`}
                        type="text"
                        name="enter3DigitsLabCode"
                        className="form-control bg-transparent"
                        placeholder={t("Enter 3 Digits Code")}
                        onChange={onInputChange}
                        value={enter3DigitsLabCode}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Lab Type")}</label>
                      <input
                        id={`ViewReferanceLabLabType`}
                        type="text"
                        name="labType"
                        className="form-control bg-transparent"
                        placeholder={t("Lab Type")}
                        onChange={onInputChange}
                        value={labType}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="status" className="mb-2">
                        {t("Inactive/Active")}
                      </label>
                      <select
                        id={`ViewReferanceLabStatus`}
                        name="status"
                        className="form-select bg-transparent"
                        value={optionValue}
                        onChange={onInputChange}
                      >
                        <option value="">{t("Select...")}</option>
                        <option value={1}>{t("Active")}</option>
                        <option value={0}>{t("InActive")}</option>
                      </select>
                    </div>
                  </div>
                  <div
                    className="d-flex justify-content-end gap-2 gap-lg-3"
                    style={{ marginRight: "5px !important" }}
                  >
                    <button
                      id={`ViewReferanceLabSearch`}
                      type="button"
                      onClick={() => {
                        setCurPage(1);
                        setTriggerSearchData((prev) => !prev);
                      }}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <i className="fa fa-search"></i>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      id={`ViewReferanceLabReset`}
                      onClick={resetSearchForm}
                      type="button"
                      className="btn btn-secondary btn-sm btn-secondary--icon"
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
          </Collapse>
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mb-2 col-12">
                <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id={`ViewReferanceLabRecords`}
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
                  >
                    <Table
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-1 mb-0"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell
                            style={{ width: "100px", minWidth: "100px" }}
                          >
                            {t("Actions")}
                          </TableCell>
                          <TableCell
                            style={{ width: "150px", minWidth: "150px" }}
                          >
                            {t("Lab")} Name
                          </TableCell>
                          <TableCell
                            style={{ width: "250px", minWidth: "250px" }}
                          >
                            {t("Address")}
                          </TableCell>
                          <TableCell
                            style={{ width: "200px", minWidth: "200px" }}
                          >
                            {t("Enter 3 Digits Program")}
                          </TableCell>
                          <TableCell
                            style={{ width: "200px", minWidth: "200px" }}
                          >
                            {t("3 Digits Lab Code")}
                          </TableCell>
                          <TableCell
                            style={{ width: "150px", minWidth: "150px" }}
                          >
                            {t("Lab Display Name")}
                          </TableCell>
                          <TableCell
                            style={{ width: "160px", minWidth: "160px" }}
                          >
                            {t("Enable Reference Id")}
                          </TableCell>
                          <TableCell
                            style={{ width: "120px", minWidth: "120px" }}
                          >
                            {t("Lab Type")}
                          </TableCell>
                          <TableCell
                            style={{ width: "120px", minWidth: "120px" }}
                          >
                            {t("Inactive/Active")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={9}>
                            <Loader />
                          </TableCell>
                        ) : (
                          labsList?.map((items: any) => (
                            <React.Fragment>
                              <TableRow
                                sx={{ "& > *": { borderBottom: "unset" } }}
                              >
                                <TableCell
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="d-flex justify-content-center rotatebtnn">
                                    <DropdownButton
                                      className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                      key="end"
                                      id={`ViewReferanceLab3Dots_${items.referenceLabId}`}
                                      drop="end"
                                      title={
                                        <i className="bi bi-three-dots-vertical p-0"></i>
                                      }
                                    >
                                      {items?.status === true ? (
                                        <>
                                          <Dropdown.Item
                                            id={`ViewReferanceLabEdit`}
                                            eventKey="1"
                                            className="w-auto"
                                          >
                                            <div className="menu-item px-3">
                                              <Link
                                                className="text-dark w-100 h-100"
                                                to={`/edit-reference-lab/${items.referenceLabId}`}
                                              >
                                                <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                                {t("Edit")}
                                              </Link>
                                            </div>
                                          </Dropdown.Item>
                                          <Dropdown.Item
                                            id={`ViewReferanceLabInactive`}
                                            eventKey="1"
                                            className="w-auto"
                                          >
                                            <div
                                              className="menu-item px-3"
                                              onClick={() =>
                                                statusChange(items)
                                              }
                                            >
                                              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                              {t("InActive")}
                                            </div>
                                          </Dropdown.Item>
                                        </>
                                      ) : (
                                        <Dropdown.Item
                                          id={`ViewReferanceLabEditActive`}
                                          eventKey="1"
                                          className="w-auto"
                                        >
                                          <div
                                            className="menu-item px-3"
                                            onClick={() => statusChange(items)}
                                          >
                                            <i className="fa fa-check-circle text-success mr-2 w-20px"></i>
                                            {t("Active")}
                                          </div>
                                        </Dropdown.Item>
                                      )}
                                    </DropdownButton>
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabLabName_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.labName}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabAddress_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.labAddress?.address__1}{" "}
                                    {items?.labAddress?.address__2}{" "}
                                    {items?.labAddress?.city1}{" "}
                                    {items?.labAddress?.state1}{" "}
                                    {items?.labAddress?.zipCode1}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLab3DigitProgram_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.enter3DigitsProgram}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLab3DigitLabCode_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.enter3DigitsLabCode}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabDisplayName_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.labDisplayName}
                                  </div>
                                  {items.enableReferenceId}
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabReferanceId_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.enableReferenceId === true ? (
                                      <span>{t("Yes")}</span>
                                    ) : (
                                      <span>{t("No")}</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabLabType_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.labType}
                                  </div>
                                </TableCell>
                                <TableCell
                                  id={`ViewReferanceLabActiveInactive_${items.referenceLabId}`}
                                  component="th"
                                  scope="row"
                                  sx={{
                                    width: "max-content",
                                    whiteSpace: "nowrap",
                                  }}
                                >
                                  <div className="table-text">
                                    {items?.status === true ? (
                                      <i
                                        className="fa fa-check-circle text-success"
                                        title="Active"
                                      ></i>
                                    ) : (
                                      <i
                                        className="fa fa-ban text-danger"
                                        title="InActive"
                                      ></i>
                                    )}
                                  </div>
                                </TableCell>
                              </TableRow>
                            </React.Fragment>
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
                  {/* =============== */}
                  <p className="pagination-total-record mb-0">
                    <span>
                      {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                      {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
                      <span> {total} </span> {t("entries")}{" "}
                    </span>
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
              //====================================  PAGINATION END =====================================
              //============================================================================================ */}
              </Box>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewReferenceLab;
