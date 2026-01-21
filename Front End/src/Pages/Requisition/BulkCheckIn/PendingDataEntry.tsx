import { Collapse, TableBody } from "@mui/material";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { ArrowDown, ArrowUp, LoaderIcon } from "../../../Shared/Icons";
import { SortingTypeI, sortByRequisitionId } from "../../../Utils/consts";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";

const PendingDataEntry = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  const queryDisplayTagNames: any = {
    specimenID: "Accession No",
    orderNumber: "Order #",
    statusName: "Status",
    firstName: "First Name",
    lastName: "Last Name",
    dateOfBirth: "Date of Birth",
    dateOfCollection: "Date of Collection",
    facilityName: "Facility Name",
    physicianName: "Physician",
    updatedBy: "Updated By",
    updatedDate: "Updated Date",
  };

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

  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [pending, setPending] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [openalert, setOpenAlert] = React.useState(false);
  const [initialRender, setinitialRender] = useState(false);
  const [check, setCheck] = useState<any>(false);
  const [value, setValue] = useState<any>({
    requisitionOrderId: 0,
  });
  const handleClickOpen = (id: any) => {
    setOpenAlert(true);
    setValue({ requisitionOrderId: id });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  console.log(pending, "pending");

  const initialPendingData = {
    requisitionOrderId: 0,
    requisitionID: 0,
    specimenID: "",
    orderNumber: "",
    statusId: 0,
    statusName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfCollection: "",
    facilityName: "",
    physicianName: "",
    updatedBy: "",
    updatedDate: "",
  };

  //search state
  const [searchPendingData, setPendingData] = useState<any>(initialPendingData);
  //reset function
  function resetSearch() {
    setPendingData(initialPendingData);
    LoadPendingData(true);
    setSorting(sortByRequisitionId);
  }

  const handleChange = (e: any) => {
    setPendingData((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const LoadPendingData = (reset: boolean) => {
    setLoading(true);
    const trimmedRequest = Object.fromEntries(
      Object.entries(searchPendingData).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    RequisitionType.getPendingDataEntry({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialPendingData : trimmedRequest,
      sortColumn: reset
        ? sortByRequisitionId?.clickedIconData
        : sort?.clickedIconData,
      sortDirection: reset
        ? sortByRequisitionId?.sortingOrder
        : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          setPending(res.data.data);
          setTotal(res.data.total);
        }
      })
      .finally(() => setLoading(false));
  };
  //Sorting Start

  const [sort, setSorting] = useState<SortingTypeI>(sortByRequisitionId);
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
      LoadPendingData(false);
    } else {
      setinitialRender(true);
    }
  }, [sort]);

  //Sorting End

  //Helping functions
  const getStatusDropdownOptions = (AllrequisitionList: any) => {
    const statusValues = AllrequisitionList.map(
      (item: any) => item.statusName
    ).filter((status: any) => status !== null);
    const distinctStatusValues = [...new Set(statusValues)];
    const dropdownOptions = distinctStatusValues.map((status) => ({
      value: status,
      label: status,
    }));
    return dropdownOptions;
  };

  const dropdownOptions = getStatusDropdownOptions(pending);
  const getFacilityDropdown = (AllrequisitionList: any) => {
    const facilityValues = AllrequisitionList.map(
      (item: any) => item.facilityName
    ).filter((facilityName: any) => facilityName !== null);
    const distinctFacilityValues = [...new Set(facilityValues)];
    const dropdownOptions = distinctFacilityValues.map((facility) => ({
      value: facility,
      label: facility,
    }));
    return dropdownOptions;
  };

  const dropdownFacilityDropdown = getFacilityDropdown(pending);

  const DeletePendingEntry = (id: any) => {
    setCheck(true);
    RequisitionType.DeletePendingDataEntry(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res.data.message));
          LoadPendingData(true);
          setCheck(false);
          handleCloseAlert();
        }
      })
      .finally(() => {
        setCheck(false);
      });
  };

  useEffect(() => {
    LoadPendingData(false);
  }, [curPage, pageSize, triggerSearchData]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setPendingData((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialPendingData as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchPendingData)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchPendingData]);

  useEffect(() => {
    if (searchedTags.length === 0 && initialRender) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card">
          <div className="card-body py-2">
            <Collapse in={searchedTags.length > 0}>
              <div className="d-flex gap-4 flex-wrap mb-2">
                {searchedTags.map((tag: any) => (
                  <div
                    className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                    onClick={() => handleTagRemoval(tag)}
                    key={tag}
                  >
                    <span className="fw-bold">
                      {t(queryDisplayTagNames[tag])}
                    </span>
                    <i className="bi bi-x"></i>
                  </div>
                ))}
              </div>
            </Collapse>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 mb-2">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id="BulkCheckInPendingDataEntryRecord"
                  className="form-select w-125px h-33px rounded h-35px py-2"
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
              <div className="d-flex align-items-center gap-2 gap-lg-3">
                <button
                  id="BulkCheckInPendingDataEntrySearch"
                  className="btn btn-info btn-sm fw-500 py-2 rounded-3"
                  onClick={() => {
                    setCurPage(1);
                    setTriggerSearchData((prev) => !prev);
                  }}
                >
                  <span>{t("Search")}</span>
                </button>
                <button
                  id="BulkCheckInPendingDataEntryReset"
                  className=" btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
                  onClick={resetSearch}
                >
                  {t("Reset")}
                </button>
              </div>
            </div>
            <div className="table-responsive">
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
                      aria-label="collapsible table"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-1 mb-0"
                    >
                      <TableHead>
                        <TableRow className="h-40px">
                          <TableCell></TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntryAccessionNumber"
                              type="text"
                              name="specimenID"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchPendingData.specimenID}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntryOrderNumber"
                              type="text"
                              name="orderNumber"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchPendingData.orderNumber}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <select
                              id="BulkCheckInPendingDataEntryStatus"
                              name="statusName"
                              value={searchPendingData.statusName}
                              className="form-select h-30px rounded-2 fs-8 py-2"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-dropdown-parent="#kt_menu_63b2e70320b73"
                              data-allow-clear="true"
                              onChange={handleChange}
                            >
                              <option className="fw-500 text-dark">
                                {t("Select...")}
                              </option>
                              {dropdownOptions.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntry1stName"
                              type="text"
                              name="firstName"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchPendingData.firstName}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntryLastName"
                              type="text"
                              name="lastName"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchPendingData.lastName}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="dateOfBirth"
                              value={searchPendingData.dateOfBirth}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="dateOfCollection"
                              value={searchPendingData.dateOfCollection}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <select
                              id="BulkCheckInPendingDataEntryFacilityName"
                              name="facilityName"
                              value={searchPendingData.facilityName}
                              className="form-select h-30px rounded-2 fs-8"
                              data-kt-select2="true"
                              data-placeholder="Select option"
                              data-dropdown-parent="#kt_menu_63b2e70320b73"
                              data-allow-clear="true"
                              onChange={handleChange}
                            >
                              <option className="fw-500 text-dark">
                                {t("Select...")}
                              </option>
                              {dropdownFacilityDropdown.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntryPhysicianName"
                              type="text"
                              name="physicianName"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchPendingData.physicianName}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInPendingDataEntryUpdateBy"
                              type="text"
                              name="updatedBy"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              value={searchPendingData.updatedBy}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                              placeholder={t("Search ...")}
                            />
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="updatedDate"
                              value={searchPendingData.updatedDate}
                              onChange={handleChange}
                            />
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableHead>
                        <TableRow>
                          <TableCell className="w-50px min-w-50px">
                            {t("Actions")}
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("specimenID")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Accession No")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "specimenID"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "specimenID"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("orderNumber")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Order #")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "orderNumber"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "orderNumber"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("statusName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Status")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "statusName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "statusName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
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
                          <TableCell className="w-125px min-w-125px">
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
                          <TableCell className="w-120px min-w-120px">
                            <div
                              onClick={() => handleSort("dateOfBirth")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Date Of Birth")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "dateOfBirth"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "dateOfBirth"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("dateOfCollection")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Date of Collection")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "dateOfCollection"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "dateOfCollection"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-150px min-w-150px">
                            <div
                              onClick={() => handleSort("facilityName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Facility Name")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "facilityName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "facilityName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("physicianName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Physician")}
                              </div>
                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "physicianName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "physicianName"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-150px min-w-150px">
                            <div
                              onClick={() => handleSort("updatedBy")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Updated By")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "updatedBy"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "updatedBy"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("updatedDate")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Updated Date")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "updatedDate"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "updatedDate"
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
                          <TableCell colSpan={11} className="py-20">
                            <Loader />
                          </TableCell>
                        ) : pending.length ? (
                          pending.map((item: any) => (
                            <TableRow
                              sx={{ "& > *": { borderBottom: "unset" } }}
                              key={item.requisitionOrderId}
                            >
                              <TableCell>
                                <div className="d-flex justify-content-center rotatebtnn">
                                  <DropdownButton
                                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                    key="end"
                                    id={`BulkCheckInPendingDataEntry3Dots_${item.requisitionOrderId}`}
                                    drop="end"
                                    title={
                                      <i className="bi bi-three-dots-vertical p-0"></i>
                                    }
                                  >
                                    <>
                                      <Dropdown.Item
                                        id="BulkCheckInPendingDataEntryEdit"
                                        className="w-auto"
                                        eventKey="0"
                                        onClick={() => {
                                          const data = {
                                            reqId: item?.requisitionID,
                                            Check: true,
                                            orderid: item?.requisitionID,
                                            link: "bulk-check-in",
                                          };
                                          navigate(`/requisition`, {
                                            state: data,
                                          });
                                        }}
                                      >
                                        <i
                                          style={{ fontSize: "16px" }}
                                          className="fa text-primary"
                                        >
                                          &#xf044;
                                        </i>
                                        <span>{t("Edit")}</span>
                                      </Dropdown.Item>
                                      <Dropdown.Item
                                        id="BulkCheckInPendingDataEntryDelete"
                                        className="w-auto"
                                        eventKey="1"
                                        onClick={() =>
                                          handleClickOpen(
                                            item.requisitionOrderId
                                          )
                                        }
                                      >
                                        <i
                                          style={{ fontSize: "16px" }}
                                          className="fa fa-trash text-danger"
                                        ></i>{" "}
                                        <span>{t("Delete")}</span>
                                      </Dropdown.Item>
                                    </>
                                  </DropdownButton>
                                </div>
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntrySpecimenID_${item.requisitionOrderId}`}
                              >
                                {item.specimenID}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryOrderNumber_${item.requisitionOrderId}`}
                              >
                                {item.orderNumber}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryStatusName_${item.requisitionOrderId}`}
                              >
                                <div className="text-center">
                                  <span className="badge badge-pill px-4 py-2 rounded-4 fw-400 fa-1x badge-danger">
                                    {item.statusName}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryFirstName_${item.requisitionOrderId}`}
                              >
                                {item.firstName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryLastName_${item.requisitionOrderId}`}
                              >
                                {item.lastName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryDateOfBirth_${item.requisitionOrderId}`}
                              >
                                {item.dateOfBirth &&
                                  moment(item.dateOfBirth).format("MM/DD/YYYY")}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryDateOfCollection_${item.requisitionOrderId}`}
                              >
                                {item.dateOfCollection &&
                                  moment(item.dateOfCollection).format(
                                    "MM/DD/YYYY"
                                  )}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryFacilityName_${item.requisitionOrderId}`}
                              >
                                {item.facilityName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryPhysicianName_${item.requisitionOrderId}`}
                              >
                                {" "}
                                {item.physicianName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryUpdatedBy_${item.requisitionOrderId}`}
                              >
                                {item.updatedBy}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInPendingDataEntryUpdatedDate_${item.requisitionOrderId}`}
                              >
                                {item.updatedDate &&
                                  moment(item.updatedDate).format("MM/DD/YYYY")}
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <NoRecord colSpan={11} />
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
                      <span>{t("Showing 0 of total 0 enteries")}</span>
                    ) : (
                      <span>
                        {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
                        {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
                        <span> {total} </span> {t("entries")}{" "}
                      </span>
                    )}
                  </p>
                  {/* =============== */}
                  <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0">
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
      {/* confirmation popup */}
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record ?")}
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
            onClick={() => DeletePendingEntry(value.requisitionOrderId)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>{" "}
            <span>
              {""} {t("Delete")}
            </span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default PendingDataEntry;
