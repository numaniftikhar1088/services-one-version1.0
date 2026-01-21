import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { isValidEmail } from "Utils/Common/CommonMethods";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import NoRecord from "../../../../Shared/Common/NoRecord";
import Splash from "../../../../Shared/Common/Pages/Splash";
import { Loader } from "Shared/Common/Loader";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import CustomPagination from "../../../../Shared/JsxPagination/index";
import { StringRecord } from "../../../../Shared/Type";
import { SortingTypeI, sortByCreationDate } from "../../../../Utils/consts";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";

import useIsIphone from "Shared/hooks/useIsIphone";

export interface IRows {
  id: string;
  isActive: boolean;
  userName: string;
  createDate: string;
  rowStatus: boolean | undefined;
  firstName: string;
  lastName: string;
  email: string;
  adminType: string;
  npiNumber: string;
  username: string;
  userGroup: string;
  adminTypeId: number;
}

export default function ViewAllUsersTab() {
  const [sort, setSorting] = useState<SortingTypeI>(sortByCreationDate);
  const searchRef = useRef<any>(null);
  const { t } = useLang();
  const isMobile = useIsMobile();
  const isIphone = useIsIphone();

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
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [dropDownValues, setDropDownValues] = useState({
    requisitionList: [],
    departments: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);

  const initialSearchQuery = {
    firstName: "",
    lastName: "",
    email: "",
    adminType: "",
    npiNumber: "",
    username: "",
    userGroup: "",
  };
  const queryDisplayTagNames: StringRecord = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email/UserName",
    adminType: "User Type",
    npiNumber: "NPI #",
    username: "Username",
    userGroup: "User Group",
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    loadGridData(true, true);
  }, []);
  const TokenForReset = (row: any) => {
    const validEmail = isValidEmail(row.email);

    if (!validEmail) {
      toast.error("User should be Email type to send reset email.");
      return;
    }

    UserManagementService?.TokenForResetPassword(encodeURIComponent(row.id))
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success("Email Sent Successfully");
        } else if (res?.data?.statusCode === 400) {
          toast.error(res?.data?.message, {
            position: "top-center",
          });
        }
      })
      .catch((err: AxiosError) => {});
  };
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const trimmedQuery = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    const nullObj = {
      firstName: "",
      lastName: "",
      email: "",
      adminType: "",
      npiNumber: "",
      username: "",
    };

    UserManagementService.getAllFacilityUsers({
      pageIndex: curPage,
      pageSize: pageSize,
      requestModel: reset ? nullObj : trimmedQuery,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);
        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const handleChange = (name: string, value: string, id: string) => {
    setRows((curr) =>
      curr.map((x) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };
  function resetSearch() {
    setSearchRequest({
      firstName: "",
      lastName: "",
      email: "",
      adminType: "",
      npiNumber: "",
      username: "",
      userGroup: "",
    });
    setSorting(sortByCreationDate);
    loadGridData(true, true, sortByCreationDate);
  }
  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRecord = (id: number) => {
    UserManagementService?.deleteRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const archiveRecord = (id: number) => {
    UserManagementService?.archiveRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.message);
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  const SuspendRecord = (id: number) => {
    UserManagementService?.suspendRecord(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(res?.data?.responseMessage);
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };
  ////////////-----------------Delete a Row-------------------///////////////////

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);

  const [open, setOpen] = React.useState(false);

  // Handling searchedTags
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
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  const selectedTenat = useSelector(
    (state: any) => state.Reducer.selectedTenantInfo
  );

  const isFacilityUser =
    PortalTypeEnum.Facility === selectedTenat.infomationOfLoggedUser.portalType;

  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card mb-3 rounded">
          <div>
            <div className="d-flex gap-4 flex-wrap mb-2">
              {searchedTags.map((tag) =>
                tag === "isArchived" ? null : (
                  <div
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                  >
                    <span className="fw-bold">
                      {t(queryDisplayTagNames[tag])}
                    </span>
                    <i className="bi bi-x"></i>
                  </div>
                )
              )}
            </div>
            <div className="align-items-center d-flex flex-column flex-md-row flex-wrap gap-0 gap-lg-0 justify-content-center justify-content-sm-between responsive-flexed-actions">
              <div className="align-items-center d-flex flex-column flex-sm-row gap-2 justify-content-center mb-2">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id="FacilityUserViewAllUserRecords"
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
                <div className="d-flex align-items-center gap-2">
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="View All Users"
                    permissionIdentifier="AddNewFacilityUser"
                  >
                    <Link
                      id="FacilityUserViewAllUserAddNew"
                      to="/facility-user"
                      className="btn btn-primary btn-sm btn-primary--icon px-7"
                    >
                      <span>
                        <i style={{ fontSize: "15px" }} className="fa">
                          &#xf067;
                        </i>
                        <span>{t("Add New Facility User")}</span>
                      </span>
                    </Link>
                  </PermissionComponent>
                </div>
              </div>
              <div className="align-items-center d-flex gap-2 justify-content-center mb-2">
                <button
                  id="FacilityUserViewAllUserSearchButton"
                  onClick={() => {
                    setCurPage(1);
                    setTriggerSearchData((prev) => !prev);
                  }}
                  className="btn btn-linkedin btn-sm fw-500"
                  aria-controls="Search"
                >
                  {t("Search")}
                </button>
                <button
                  onClick={resetSearch}
                  type="button"
                  className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                  id="FacilityUserViewAllUserReset"
                >
                  <span>
                    <span>{t("Reset")}</span>
                  </span>
                </button>
              </div>
            </div>

            <div className="card">
              <Box sx={{ height: "auto", width: "100%" }}>
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={
                      isIphone
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
                    // component={Paper}
                    className="shadow-none"
                    // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                  >
                    <Table
                      // stickyHeader
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead>
                        <TableRow className="h-50px">
                          {!isFacilityUser && <TableCell></TableCell>}
                          <TableCell></TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserFirstNameSearch"
                              type="text"
                              name="firstName"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.firstName}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserLastNameSearch"
                              type="text"
                              name="lastName"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.lastName}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserEmailSearch"
                              type="text"
                              name="email"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.email}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserAdminTypeSearch"
                              type="text"
                              name="adminType"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.adminType}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserNpiNumbereSearch"
                              type="text"
                              name="npiNumber"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.npiNumber}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="FacilityUserViewAllUserUserListSearch"
                              type="text"
                              name="userGroup"
                              className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                              placeholder={t("Search ...")}
                              value={searchRequest.userGroup}
                              onChange={onInputChangeSearch}
                              onKeyDown={(e) => handleKeyPress(e)}
                            />
                          </TableCell>
                          <TableCell></TableCell>
                        </TableRow>

                        <TableRow className="h-40px">
                          {!isFacilityUser && <TableCell></TableCell>}
                          <TableCell className="min-w-50px">
                            {t("Actions")}
                          </TableCell>

                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("firstName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("First Name")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  id="FacilityUserViewAllUser1stNameArrowUp"
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "firstName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  id="FacilityUserViewAllUser1stNameArrowDown"
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

                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("lastName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Last Name")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  id="FacilityUserViewAllUserlastNameArrowUp"
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "lastName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  id="FacilityUserViewAllUserlastNameArrowDown"
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

                          <TableCell>
                            <div className="d-flex justify-content-between align-items-center min-w-200px">
                              <div>{t("Email / Username")}</div>
                              <div></div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("adminType")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("User Type")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  id="FacilityUserViewAllUserUserTypeArrowUp"
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "adminType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  id="FacilityUserViewAllUserUserTypeArrowDown"
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "adminType"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("npiNumber")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("NPI #")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  id="FacilityUserViewAllUserNPINumberArrowUp"
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "npiNumber"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  id="FacilityUserViewAllUserNPINumberArrowDown"
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "npiNumber"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("userGroup")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("User Group")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  id="FacilityUserViewAllUserUserGroupArrowUp"
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "userGroup"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  id="FacilityUserViewAllUserUserGroupArrowDown"
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "userGroup"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell sx={{ width: "max-content" }}>
                            <div
                              onClick={() => handleSort("userGroup")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Status")}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={8} className="">
                            {isMobile ? <Loader /> : <Splash />}
                          </TableCell>
                        ) : rows.length ? (
                          rows?.map((row, index) => (
                            <Row
                              row={row}
                              index={index}
                              rows={rows}
                              setRows={setRows}
                              dropDownValues={dropDownValues}
                              handleChange={handleChange}
                              handleDelete={deleteRecord}
                              handleArchive={archiveRecord}
                              TokenForReset={TokenForReset}
                              open={open}
                              setOpen={setOpen}
                              SuspendRecord={SuspendRecord}
                              isFacilityUser={isFacilityUser}
                            />
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
}
