import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { initialState } from "Utils/InitialStates";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "../../../../Shared/hooks/useLanguage";
import { StringRecord } from "../../../../Shared/Type";
import { SortingTypeI, sortByCreationDate } from "../../../../Utils/consts";
import { useUserListContext } from "../UserListContext";
import UserManagmentGrid from "./UserManagmentGrid";
import {
  setAddUserManegementFormState,
  setEdituserFormState,
} from "Pages/Admin/InitialState";
import { isValidEmail } from "Utils/Common/CommonMethods";
import useIsMobile from "Shared/hooks/useIsMobile";

export interface IPage {
  claimsId: number;
  isChecked: boolean;
}
export interface IUserGroup {
  userGroupId: number;
  name: string;
}
export interface IAdminType {
  value: number;
  label: string;
}
export interface IFormValues {
  id: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminType: number;
  userGroupId: number;
  [key: string]: string | boolean | null | number;
}
export interface ITableObj {
  id: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminType: string;
  userGroup: string;
}

export default function UserList(props: any) {
  const { t } = useLang();
  const isMobile = useIsMobile();

  const {
    open,
    setOpen,
    dropDownValues,
    setCheckboxes,
    setRows,
    loadData,
    loadGridData,
    setSearchRequest,
    searchRequest,
    setErrors,
    setEditGridHeader,
    setFormData,
    setPageSize,
    setCurPage,
    setTriggerSearchData,
    rows,
    loading,
    pageSize,
    curPage,
    showPage,
    prevPage,
    pageNumbers,
    initialSearchQuery,
    nextPage,
    totalPages,
    total,
  } = useUserListContext();

  const initialState = setAddUserManegementFormState;
  const [initialRender, setinitialRender] = useState(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [sort, setSorting] = useState<SortingTypeI>(sortByCreationDate);

  const handleChange = (name: string, value: string, id: string) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  useEffect(() => {
    loadData();
  }, []);

  const queryDisplayTagNames: StringRecord = {
    firstName: t("First Name"),
    lastName: t("Last Name"),
    adminEmail: t("Admin Email"),
    adminType: t("Admin Type"),
    userGroup: t("User Group"),
  };

  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortByCreationDate);
    loadGridData(true, true, sortByCreationDate);
  }

  const TokenForReset = (row: any) => {
    const validEmail = isValidEmail(row.adminEmail);

    if (!validEmail) {
      toast.error(t("User should be Email type to send reset email."));
      return;
    }

    UserManagementService?.TokenForResetPassword(row.id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(t("Email Sent Successfully")));
        } else if (res?.data?.statusCode === 400) {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  //--------- Edit user -----------
  const EditUser = async (userId: any) => {
    setErrors([]);
    setEditGridHeader(true);
    await UserManagementService?.getByIdAdminUser(userId)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          const updatedState = setEdituserFormState(
            initialState,
            res?.data?.data
          );
          setCheckboxes(res?.data?.data.modules);
          setFormData(updatedState);
        } else if (res?.status === 400) {
          toast.error(t(res?.data?.responseMessage));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
    setOpen(true);
  };

  ////////////-----------------Delete a Row-------------------///////////////////
  const deleteRecord = (id: number) => {
    UserManagementService?.deleteRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  ////////////-----------------Archive a Row-------------------///////////////////
  const handleArchived = (id: number) => {
    UserManagementService?.archiveRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  ////////////-----------------Sorting-------------------///////////////////
  const searchRef = useRef<any>(null);

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

  useEffect(() => {
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [sort]);

  ////////////-----------------Sorting-------------------///////////////////

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: boolean) => !prev);
    }
  };
  // Handling searchedTags

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

  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="mb-3 rounded">
          <div className="py-2">
            <div className="d-flex gap-4 flex-wrap mb-2">
              {searchedTags.map((tag) => (
                <div
                  className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                  onClick={() => handleTagRemoval(tag)}
                >
                  <span className="fw-bold">
                    {t(queryDisplayTagNames[tag])}
                  </span>
                  <i className="bi bi-x"></i>
                </div>
              ))}
            </div>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
              <div className="d-flex gap-2 responsive-flexed-actions">
                <div className="d-flex align-items-center">
                  <span className="fw-400 mr-3">{t("Records")}</span>
                  <select
                    id={`AdminUserListRecords`}
                    className="form-select w-125px h-33px rounded"
                    data-kt-select2="true"
                    data-placeholder={t("Select option")}
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
                <div className="d-flex gap-lg-3 justify-content-center justify-content-sm-start">
                  <div className="mt-0">
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User List"
                      permissionIdentifier="AddAdminUser"
                    >
                      <button
                        id={`AdminUserListAddNew`}
                        className={`btn btn-primary btn-sm fw-bold search ${
                          open ? "d-none" : "d-block"
                        }`}
                        onClick={() => setOpen(!open)}
                        aria-controls="SearchCollapse"
                        aria-expanded={open}
                      >
                        <span>
                          <i style={{ fontSize: "15px" }} className="fa">
                            &#xf067;
                          </i>
                          <span>{t("Add Admin User")}</span>
                        </span>
                      </button>
                    </PermissionComponent>
                  </div>
                </div>
              </div>
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  id={`AdminUserListSearch`}
                  onClick={() => {
                    setCurPage(1);
                    setTriggerSearchData((prev: boolean) => !prev);
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
                  id={`AdminUserListreset`}
                >
                  <span>
                    <span>{t("Reset")}</span>
                  </span>
                </button>
              </div>
            </div>
            <Box sx={{ height: "auto", width: "100%" }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={
                    
                    isMobile ? {}:
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
                  // component={Paper}
                  className="shadow-none"
                  // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                >
                  <Table
                    // stickyHeader
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <UserManagmentGrid
                      TokenForReset={TokenForReset}
                      EditUser={EditUser}
                      rows={rows}
                      setRows={setRows}
                      dropDownValues={dropDownValues}
                      searchRequest={searchRequest}
                      searchQuery={onInputChangeSearch}
                      handleChange={handleChange}
                      handleDelete={deleteRecord}
                      handleArchived={handleArchived}
                      loading={loading}
                      handleSort={handleSort}
                      searchRef={searchRef}
                      sort={sort}
                      handleKeyPress={handleKeyPress}
                    />
                  </Table>
                </TableContainer>
              </div>
              {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
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

                  {pageNumbers.map((page) => (
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
    </>
  );
}
