import React, { useEffect, useState } from "react";
import LabManagementService from "../../Services/LabManagement/LabManagementService";
import { DataGrid } from "@mui/x-data-grid";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Collapse from "@mui/material/Collapse";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { Loader } from "../../Shared/Common/Loader";
import { GridColDef } from "@mui/x-data-grid";
import { AxiosError, AxiosResponse } from "axios";
import { ILabrequest } from "../../Interface/Lab";
import { InputChangeEvent } from "../../Shared/Type";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Pagination from "@mui/material/Pagination";
import useLang from "Shared/hooks/useLanguage";

const ITEM_HEIGHT = 48;
const LabsList = () => {
  const { t } = useLang();
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)
  const [total, setTotal] = useState<number>(0)
  const [totalPages, setTotalPages] = useState(0)
  const [pageNumbers, setPageNumbers] = useState<number[]>([])
  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1)
    }
  }

  const showPage = (i: number) => {
    setCurPage(i)
  }

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1)
    }
  }

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize))
    const pgNumbers = []
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i)
      }
    }
    setPageNumbers(pgNumbers)
  }, [total, curPage, pageSize, totalPages])

  useEffect(() => {
    fetchAllLabs(getLabsRequest)
  }, [curPage])
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

  const [getLabsRequest, setGetLabsRequest] = useState<ILabrequest>({
    pageNumber: curPage,
    pageSize: pageSize,
    queryModel: {
      labName: "",
      code: "",
      director: "",
      clia: "",
      isActive: null,
    },
  });
  const [optionValue, setOptionValue] = useState("");
  const onInputChange = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === "isActive") {
      if (parseInt(e.target.value) === 1) {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            isActive: true,
          },
        });
        setOptionValue("1");
      } else if (e.target.value === "") {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            isActive: null,
          },
        });
        setOptionValue("");
      } else {
        setGetLabsRequest({
          ...getLabsRequest,
          queryModel: {
            ...getLabsRequest.queryModel,
            isActive: false,
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
  const { labName, director, clia, isActive } = getLabsRequest.queryModel;
  const fetchAllLabs = (request: ILabrequest) => {
    setLoading(true);
    
    
    LabManagementService.getAllLabs(request)
      .then((res: AxiosResponse) => {
        setLabsList(res.data.data.data);
        setTotal(res?.data?.data?.total)
        // setRows(res.data.data.data)
        setLoading(false);
        
      })
      .catch((err: AxiosError) => {
        
        setLoading(false);
      });
  };
  useEffect(() => {
    fetchAllLabs(getLabsRequest);
  }, []);

  const resetSearchForm = () => {
    setOptionValue("");
    let resetFormObject = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: {
        labName: "",
        code: "",
        director: "",
        clia: "",
        isActive: null,
      },
    };
    setGetLabsRequest(resetFormObject);
    fetchAllLabs(resetFormObject);
  };

  const removeLabById = (referenceLab: any) => {
    if (referenceLab.isActive === true) {
      referenceLab.isActive = false;
    } else {
      referenceLab.isActive = true;
    }
    const { labId, isActive } = referenceLab;
    LabManagementService.ActivateLabById(labId, isActive)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          fetchAllLabs(getLabsRequest);
        }
      })
      .catch((err: AxiosError) => {
        
      });
  };
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
        <div
          id="kt_app_toolbar_container"
          className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
        >
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="#" className="text-muted text-hover-primary">
                  {t("Home")}
                </a>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Admin")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Reference Labs")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Lab List")}</li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <Button
              className={`btn btn-info btn-sm fw-bold search ${
                open ? "d-none" : "d-block"
              }`}
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-search"></i>
              <span  >{t("Search")}</span>
            </Button>
            <Button
              className={`btn btn-info btn-sm fw-bold ${
                open ? "" : "collapse"
              }`}
              
              onClick={() => setOpen(!open)}
              aria-controls="SearchCollapse"
              aria-expanded={open}
            >
              <i className="fa fa-times p-0"></i>
            </Button>

            <Link
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
                        id="txtName"
                        type="text"
                        name="labName"
                        className="form-control bg-transparent"
                        placeholder="Lab Name"
                        onChange={onInputChange}
                        value={labName}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("Director")}</label>
                      <input
                        id="txtContactPhone"
                        type="text"
                        name="director"
                        className="form-control bg-transparent"
                        placeholder="Director"
                        onChange={onInputChange}
                        value={director}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label className="mb-2">{t("CLIA #")}</label>
                      <input
                        id="txtEmail"
                        type="text"
                        name="clia"
                        className="form-control bg-transparent"
                        placeholder="CLIA"
                        onChange={onInputChange}
                        value={clia}
                      />
                    </div>
                  </div>
                  <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                    <div className="fv-row mb-4">
                      <label htmlFor="isActive" className="mb-2">
                        {t("Status")}
                      </label>
                      <select
                        name="isActive"
                        className="form-select bg-transparent"
                        value={optionValue}
                        onChange={onInputChange}
                      >
                        <option value="">{t("Select Status...")}</option>
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
                      type="button"
                      onClick={() => fetchAllLabs(getLabsRequest)}
                      className="btn btn-primary btn-sm btn-primary--icon"
                    >
                      <span>
                        <i className="fa fa-search"></i>
                        <span>{t("Search")}</span>
                      </span>
                    </button>
                    <button
                      onClick={resetSearchForm}
                      type="button"
                      className="btn btn-secondary btn-sm btn-secondary--icon"
                      id="kt_reset"
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
            <div className="card-body px-3 px-md-8">
              <div className="mb-5 hover-scroll-x">




              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mb-2 col-12">
                <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    className="form-select w-125px h-33px rounded"
                    data-kt-select2="true"
                    data-placeholder="Select option"
                    data-dropdown-parent="#kt_menu_63b2e70320b73"
                    data-allow-clear="true"
                    onChange={(e) => {
                      
                      setPageSize(parseInt(e.target.value))
                    }}
                  >
                    <option value="3">3</option>
                    <option value="5" selected>
                      5
                    </option>
                    <option value="10">10</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                  </select>
                </div>
              </div>
          <Box sx={{ height: "auto", width: "100%" }}>
            <TableContainer component={Paper} className="shadow-none">
              <Table
                aria-label="collapsible table"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-1 mb-1"
              >
                <TableHead className="h-50px">
                  <TableRow>
                    <TableCell style={{ width: "100px", minWidth: "100px" }}>
                      {t("Actions")}
                    </TableCell>
                    <TableCell style={{ width: "150px", minWidth: "150px" }}>
                    {t("Lab Name")}
                    </TableCell>
                    <TableCell style={{ width: "200px", minWidth: "200px" }}>
                    {t("CLIA")}
                    </TableCell>
                    <TableCell style={{ width: "250px", minWidth: "250px" }}>
                    {t("Address")}
                    </TableCell>
                    <TableCell style={{ width: "150px", minWidth: "150px" }}>
                    {t("Lab Display Name")}
                    </TableCell>
                    <TableCell style={{ width: "160px", minWidth: "160px" }}>
                    {t("Enable Reference Id")}
                    </TableCell>
                    <TableCell style={{ width: "120px", minWidth: "120px" }}>
                    {t("Lab Type")}
                    </TableCell>
                    <TableCell style={{ width: "120px", minWidth: "120px" }}>
                    {t("Status")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  
                {loading ? (
                  <TableCell colSpan={8}>
                  <Loader />
                </TableCell>
                  ) : (
                  labsList?.map((items: any) => (
                    <React.Fragment>
                      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                        <TableCell>
                          <div className="d-flex justify-content-center rotatebtnn">
                            <DropdownButton
                              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                              key="end"
                              id="dropdown-button-drop-end"
                              drop="end"
                              title={<i className="bi bi-three-dots-vertical p-0"></i>}
                            >
                            {items.isActive === true ? (
                              <>
                              <Dropdown.Item eventKey="1">
                                <div  className="menu-item px-3" >
                                  <Link
                                    className="text-dark w-100 h-100"
                                    to={`/CreateLab/`}
                                  >
                                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                                    {t("Edit")}
                                  </Link>
                                </div>
                              </Dropdown.Item>
                              <Dropdown.Item eventKey="1">
                                <div
                                  className="menu-item px-3"
                                  onClick={() => removeLabById(items)}
                                >
                                      <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                                      {t("InActive")}
                                </div>
                              </Dropdown.Item>
                              </>
                              ) : (
                              <Dropdown.Item eventKey="1">
                                <div
                                  className="menu-item px-3"
                                  onClick={() => removeLabById(items)}
                                >
                                  <i className="fa fa-check-circle text-success mr-2 w-20px"></i>
                                  {t("Active")}
                                </div>
                              </Dropdown.Item>
                                  )}       
                            </DropdownButton>
                          </div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">{items.labName}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">{items.clia}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">{items.address.address1} {items.address.address2} {items.address.city} {items.address.country} {items.address.state} {items.address.zipCode}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">{items.labDisplayName}</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text"></div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">{t("Actions")}In-House</div>
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <div className="table-text">
                            {items.isActive === true ? (
                              <i className="fa fa-check-circle text-success" title="Active"></i>
                            ) : (
                              <i className="fa fa-ban text-danger" title="InActive"></i>
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
             {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                  {/* =============== */}
                  <p className="pagination-total-record">
                    <span>
                      Showing {pageSize * (curPage - 1) + 1} to{' '}
                      {Math.min(pageSize * curPage, total)} of Total{' '}
                      <span> {total} </span> entries{' '}
                    </span>
                  </p>
                  {/* =============== */}
                  <ul className="d-flex align-items-center justify-content-end custome-pagination">
                    <li className="btn btn-lg p-2" onClick={() => showPage(1)}>
                      <i className="fa fa-angle-double-left"></i>
                    </li>
                    <li className="btn btn-lg p-2" onClick={prevPage}>
                      <i className="fa fa-angle-left"></i>
                    </li>

                    {pageNumbers.map((page) => (
                      <li
                        key={page}
                        className={`px-2 ${
                          page === curPage
                            ? 'font-weight-bold bg-primary text-white'
                            : ''
                        }`}
                        style={{ cursor: 'pointer' }}
                        onClick={() => showPage(page)}
                      >
                        {page}
                      </li>
                    ))}

                    <li className="btn btn-lg p-2" onClick={nextPage}>
                      <i className="fa fa-angle-right"></i>
                    </li>
                    <li
                      className="btn btn-lg p-2"
                      onClick={() => {
                        if (totalPages === 0) {
                          showPage(curPage)
                        } else {
                          showPage(totalPages)
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
    </div>
  );
};

export default LabsList;
