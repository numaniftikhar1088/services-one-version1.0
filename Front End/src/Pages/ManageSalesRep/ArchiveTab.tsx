import React, { useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import { Loader } from "../../Shared/Common/Loader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ArrowUp, ArrowDown } from "../../Shared/Icons";
import ManageSalesRepServices from "../../Services/ManageSalesRep/ManageSalesRepServices";
import { AxiosError, AxiosResponse } from "axios";
import { StringRecord } from "../../Shared/Type";
import { MenuItem, TableContainer } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import { Modal } from "react-bootstrap";
import { RestoreRecordUser } from "Services/UserManagement/UserManagementService";
import { toast } from "react-toastify";
import useIsMobile from "Shared/hooks/useIsMobile";

const ArchiveTab = () => {
  const initialSearchQuery = {
    id: "",
    firstName: "",
    lastName: "",
    salesRepEmail: "",
    salesRepPhone: "",
  };

  const queryDisplayTagNames: StringRecord = {
    firstName: "First Name",
    lastName: "Last Name",
    salesRepEmail: "Email",
    salesRepPhone: "Phone",
    salesGroupName: "Sales Group",
  };

  const initialSearchRequest = {
    id: "",
    firstName: "",
    lastName: "",
    salesRepEmail: "",
    salesRepPhone: "",
    salesGroupName: "",
    isArchived: true,
    status: true,
  };

  const { t } = useLang();
  const isMobile = useIsMobile();
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================
  const [show, setShow] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [archivesalesrepList, setArchiveSalesRepList] = useState<any>([]);
  const [searchRequest, setSearchRequest] = useState<any>(initialSearchRequest);
  const openDrop = Boolean(anchorEl);
  console.log(archivesalesrepList, "archivesalesrepList");

  const RestoreRecord = (id: number) => {
    RestoreRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          LoadDataForArchive(false);
          setShow(false);
        } else {
          toast.error(res?.data?.message);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const handleClickOpen = (userid: any) => {
    setShow(true);
    setValue(userid);
  };

  const ModalhandleClose = () => setShow(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseThreeDot = () => {
    setAnchorEl(null);
  };

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
    LoadDataForArchive(false);
  }, [curPage, curPage, triggerSearchData]);

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  useEffect(() => {
    setCurPage(1);
    LoadDataForArchive(true);
  }, [pageSize]);
  const initialSorting = {
    sortColumn: "id",
    sortDirection: "desc",
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    sort.sortColumn = columnName;
    sort.sortDirection = searchRef.current.id;
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      };
    });
    LoadDataForArchive(false);
  };
  //Searched tags code Start
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 1) resetSeachQuery();
  }, [searchedTags.length]);

  //Searched tags code End

  const InputSearchRequest = (key: string, value: any) => {
    setSearchRequest((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const LoadDataForArchive = (reset: boolean) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    ManageSalesRepServices.ManageSalesRepData({
      pageIndex: curPage,
      pageSize: pageSize,
      requestModel: reset ? initialSearchRequest : trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setArchiveSalesRepList(res?.data?.result);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };

  const resetSeachQuery = () => {
    setSearchRequest(initialSearchRequest);
    setSorting(initialSorting);
    LoadDataForArchive(true);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      LoadDataForArchive(false);
    }
  };
  console.log(archivesalesrepList, "archivesalesrepList");

  return (
    <div className="card-body py-2">
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag: any) =>
          tag === "status" || tag === "isArchived" ? null : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
              onClick={() => handleTagRemoval(tag)}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="responsive-flexed-actions gap-2 mb-2 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
        <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id={`ManageSaleRepArchivedRecords`}
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
        <div
          className="d-flex align-items-center gap-2"
          onClick={() => {
            setCurPage(1);
            setTriggerSearchData((prev: any) => !prev);
          }}
        >
          <button
            id={`ManageSaleRepArchivedSearch`}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={() => LoadDataForArchive(false)}
          >
            {t("Search")}
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`ManageSaleRepArchivedReset`}
            onClick={resetSeachQuery}
          >
            <span>
              <span>{t("Reset")}</span>
            </span>
          </button>
        </div>
      </div>
      <Box
        sx={{
          height: "auto",
          width: "100%",
          paddingTop: "0",
        }}
      >
        <div className="table_bordered overflow-hidden">
          <TableContainer
            sx={
              isMobile
                ? {}
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
            className="shadow-none"
          >
            <Table
              aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableHead>
                <TableRow className="h-40px">
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      id={`ManageSaleRepArchivedSearchFirstName`}
                      type="text"
                      name="firstName"
                      value={searchRequest.firstName}
                      className="form-control bg-white rounded-2 fs-8 h-30px"
                      placeholder={t("Search ...")}
                      onChange={(e: any) =>
                        InputSearchRequest(e.target.name, e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`ManageSaleRepArchivedSearchLastName`}
                      type="text"
                      name="lastName"
                      value={searchRequest.lastName}
                      className="form-control bg-white rounded-2 fs-8 h-30px"
                      placeholder={t("Search ...")}
                      onChange={(e: any) =>
                        InputSearchRequest(e.target.name, e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`ManageSaleRepArchivedSearchEmail`}
                      type="text"
                      name="salesRepEmail"
                      value={searchRequest.salesRepEmail}
                      className="form-control bg-white rounded-2 fs-8 h-30px"
                      placeholder={t("Search ...")}
                      onChange={(e: any) =>
                        InputSearchRequest(e.target.name, e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`ManageSaleRepArchivedSearchPhoneNumber`}
                      type="text"
                      name="salesRepPhone"
                      value={searchRequest.salesRepPhone}
                      className="form-control bg-white rounded-2 fs-8 h-30px"
                      placeholder={t("Search ...")}
                      onChange={(e: any) =>
                        InputSearchRequest(e.target.name, e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </TableCell>
                   <TableCell>
                    <input
                      id={`ManageSaleRepArchivedSearchsalesGroupName`}
                      type="text"
                      name="salesGroupName"
                      value={searchRequest.salesGroupName}
                      className="form-control bg-white rounded-2 fs-8 h-30px"
                      placeholder={t("Search ...")}
                      onChange={(e: any) =>
                        InputSearchRequest(e.target.name, e.target.value)
                      }
                      onKeyDown={handleKeyPress}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>{t("Actions")}</TableCell>
                  <TableCell
                    className="min-w-150px"
                    sx={{ width: "max-content" }}
                  >
                    <div
                      onClick={() => handleSort("firstName")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("First Name")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "firstName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "firstName"
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
                      onClick={() => handleSort("lastName")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Last Name")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "lastName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "lastName"
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
                      onClick={() => handleSort("salesRepEmail")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}> {t("Email")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "salesRepEmail"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "salesRepEmail"
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
                      onClick={() => handleSort("salesRepPhone")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>{t("Phone")}</div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "salesRepPhone"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "salesRepPhone"
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
                      onClick={() => handleSort("salesGroupName")}
                      className="d-flex justify-content-between cursor-pointer"
                      id=""
                      ref={searchRef}
                    >
                      <div style={{ width: "max-content" }}>
                        {t("Sales Group")}
                      </div>

                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                        <ArrowUp
                          CustomeClass={`${
                            sort.sortingOrder === "desc" &&
                            sort.clickedIconData === "salesGroupName"
                              ? "text-success fs-7"
                              : "text-gray-700 fs-7"
                          }  p-0 m-0 "`}
                        />
                        <ArrowDown
                          CustomeClass={`${
                            sort.sortingOrder === "asc" &&
                            sort.clickedIconData === "salesGroupName"
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
                ) : (
                  archivesalesrepList?.map((item: any) => (
                    <>
                      <TableRow>
                        <TableCell>
                          <div className="d-flex justify-content-center">
                            <StyledDropButtonThreeDots
                              id={`ManageSaleRepArchived3Dots_${item.id}`}
                              aria-controls={
                                openDrop ? "demo-positioned-menu" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={handleClick}
                              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
                            >
                              <i className="bi bi-three-dots-vertical p-0 icon"></i>
                            </StyledDropButtonThreeDots>
                            <StyledDropMenuMoreAction
                              aria-labelledby="demo-positioned-button"
                              anchorEl={anchorEl}
                              open={openDrop}
                              onClose={handleCloseThreeDot}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <PermissionComponent
                                moduleName="Manage Sales Rep"
                                pageName="Sales Rep User"
                                permissionIdentifier="Restore"
                              >
                                <MenuItem>
                                  <a
                                    id={`ManageSaleRepArchivedRestore`}
                                    onClick={() => {
                                      handleCloseThreeDot();
                                      handleClickOpen(item.id);
                                    }}
                                    className=" w-125px p-0 text-dark"
                                  >
                                    <i
                                      className="fa fa-undo text-primary mr-2"
                                      aria-hidden="true"
                                    ></i>
                                    {t("Restore")}
                                  </a>
                                </MenuItem>
                              </PermissionComponent>
                            </StyledDropMenuMoreAction>
                          </div>
                        </TableCell>
                        <TableCell
                          id={`ManageSaleRepArchivedFirstName_${item.id}`}
                        >
                          {item?.firstName}
                        </TableCell>
                        <TableCell
                          id={`ManageSaleRepArchivedLastName_${item.id}`}
                        >
                          {item?.lastName}
                        </TableCell>
                        <TableCell id={`ManageSaleRepArchivedEmail_${item.id}`}>
                          {item.salesRepEmail}
                        </TableCell>
                        <TableCell
                          id={`ManageSaleRepArchivedPhoneNumber_${item.id}`}
                        >
                          {item.salesRepPhone}
                        </TableCell>
                        <TableCell
                          id={`ManageSaleRepArchivedPhoneNumber_${item.id}`}
                        >
                          {item.salesGroupName}
                        </TableCell>
                      </TableRow>
                    </>
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
      <Modal
        show={show}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Restore Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to restore this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              RestoreRecord(value);
            }}
          >
            {t("Restore")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ArchiveTab;
