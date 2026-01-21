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
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { SortingTypeI } from "../../../Utils/consts";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";

const ScanHistroyTable = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);

  const queryDisplayTagNames: any = {
    specimenID: "Accession No",
    orderNumber: "Order #",
    firstName: "First Name",
    lastName: "Last Name",
    dateOfBirth: "Date of Birth",
    dateOfCollection: "Date of Collection",
    timeOfCollection: "Time of Collection",
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
  const [initialRender, setinitialRender] = useState(false);
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
  //Sorting Start
  const sortById = {
    clickedIconData: "id",
    sortingOrder: "desc",
  };

  const [sort, setSorting] = useState<SortingTypeI>(sortById);
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
      LoadScanHistroy(false);
    } else {
      setinitialRender(true);
    }
  }, [sort]);

  useEffect(() => {
    setCurPage(1);
  }, [pageSize]);

  //Sorting End
  const [scan, setScan] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialScanHistory = {
    id: 0,
    requisitionID: 0,
    specimenID: "",
    orderNumber: "",
    firstName: "",
    lastName: "",
    dateOfBirth: null,
    dateOfCollection: null,
    timeOfCollection: "",
    facilityName: "",
    updatedBy: "",
    updatedDate: null,
  };

  //search state
  const [searchScanHistroy, setSearchScanHistroy] =
    useState<any>(initialScanHistory);

  //reset function
  function resetSearch() {
    setSearchScanHistroy(initialScanHistory);
    LoadScanHistroy(true);
    setSorting(sortById);
  }

  const handleChange = (e: any) => {
    setSearchScanHistroy((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const LoadScanHistroy = (reset: boolean) => {
    setLoading(true);
    const trimmedRequest = Object.fromEntries(
      Object.entries(searchScanHistroy).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    const updatedSearchRequest = {
      ...trimmedRequest,
      dateOfBirth: trimmedRequest.dateOfBirth
        ? moment(trimmedRequest.dateOfBirth).format("MM-DD-YYYY")
        : null,
      dateOfCollection: trimmedRequest.dateOfCollection
        ? moment(trimmedRequest.dateOfCollection).format("MM-DD-YYYY")
        : null,
      updatedDate: trimmedRequest.updatedDate
        ? moment(trimmedRequest.updatedDate).format("MM-DD-YYYY")
        : null,
    };
    RequisitionType.getScanHistroy({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialScanHistory : updatedSearchRequest,
      sortColumn: reset ? sortById?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortById?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          setScan(res.data.data);
          setTotal(res.data.total);
        }
      })
      .finally(() => setLoading(false));
  };

  //Helping functions
  const getStatusDropdownOptions = (AllrequisitionList: any) => {
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
  console.log(scan);

  const dropdownOptions = getStatusDropdownOptions(scan);

  useEffect(() => {
    LoadScanHistroy(false);
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
    setSearchScanHistroy((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialScanHistory as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchScanHistroy)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchScanHistroy]);

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
                  id="BulkCheckInScanHistoryRecord"
                  className="form-select w-125px h-33px rounded h-35px py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  // placeholder={t("Select...")}
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
                  id="BulkCheckInScanHistorySearch"
                  className="btn btn-info btn-sm fw-500 py-2 rounded-3"
                  onClick={() => {
                    setCurPage(1);
                    setTriggerSearchData((prev) => !prev);
                  }}
                >
                  <span>{t("Search")}</span>
                </button>
                <button
                  id="BulkCheckInScanHistoryReset"
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
                    component={Paper}
                    className="shadow-none"
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
                  >
                    <Table
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead>
                        <TableRow className="h-40px">
                          <TableCell>
                            <input
                              id="BulkCheckInScanHistoryAccessionNumber"
                              type="text"
                              name="specimenID"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              onChange={handleChange}
                              value={searchScanHistroy.specimenID}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInScanHistoryOrderNumber"
                              type="text"
                              name="orderNumber"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              onChange={handleChange}
                              value={searchScanHistroy.orderNumber}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInScanHistory1stName"
                              type="text"
                              name="firstName"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchScanHistroy.firstName}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInScanHistoryLastName"
                              type="text"
                              name="lastName"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              placeholder={t("Search ...")}
                              value={searchScanHistroy.lastName}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="dateOfBirth"
                              value={searchScanHistroy.dateOfBirth}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="dateOfCollection"
                              value={searchScanHistroy.dateOfCollection}
                              onChange={handleChange}
                            />
                          </TableCell>
                          <TableCell>
                            <input
                              id="BulkCheckInScanHistoryTimeOfCollection"
                              type="time"
                              name="timeOfCollection"
                              className="form-control bg-white h-30px rounded-2 fs-8"
                              value={searchScanHistroy.timeOfCollection}
                              onChange={handleChange}
                              onKeyDown={handleKeyPress}
                            />
                          </TableCell>

                          <TableCell>
                            <select
                              id="BulkCheckInScanHistoryClintName"
                              name="facilityName"
                              value={searchScanHistroy.facilityName}
                              className="form-select h-30px rounded-2 fs-8 py-2"
                              data-kt-select2="true"
                              data-placeholder={t("Select option")}
                              // placeholder={t("Select...")}
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
                            <div className="w-150px">
                              <input
                                id="BulkCheckInScanHistoryUpdateBy"
                                type="text"
                                name="updatedBy"
                                className="form-control bg-white h-30px rounded-2 fs-8"
                                placeholder={t("Search ...")}
                                value={searchScanHistroy.updatedBy}
                                onChange={handleChange}
                                onKeyDown={handleKeyPress}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            <SearchDatePicker
                              name="updatedDate"
                              value={searchScanHistroy.updatedDate}
                              onChange={handleChange}
                            />
                          </TableCell>
                        </TableRow>
                        <TableRow>
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
                              onClick={() => handleSort("firstName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("First Names")}
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
                          <TableCell className="w-125px min-w-125px">
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
                              onClick={() => handleSort("timeOfCollection")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Time Of Collection")}
                              </div>

                              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                <ArrowUp
                                  CustomeClass={`${
                                    sort.sortingOrder === "desc" &&
                                    sort.clickedIconData === "timeOfCollection"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0 "`}
                                />
                                <ArrowDown
                                  CustomeClass={`${
                                    sort.sortingOrder === "asc" &&
                                    sort.clickedIconData === "timeOfCollection"
                                      ? "text-success fs-7"
                                      : "text-gray-700 fs-7"
                                  }  p-0 m-0`}
                                />
                              </div>
                            </div>
                          </TableCell>

                          <TableCell className="w-125px min-w-125px">
                            <div
                              onClick={() => handleSort("facilityName")}
                              className="d-flex justify-content-between cursor-pointer"
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t("Client Names")}
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
                        ) : scan.length ? (
                          scan.map((inner: any) => (
                            <TableRow
                              sx={{ "& > *": { borderBottom: "unset" } }}
                              key={inner.id}
                            >
                              <TableCell
                                id={`BulkCheckInScanHistorySpecimenID_${inner.id}`}
                              >
                                {inner.specimenID}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryOrderNumber_${inner.id}`}
                              >
                                {inner.orderNumber}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryFirstName_${inner.id}`}
                              >
                                {inner.firstName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryLastName_${inner.id}`}
                              >
                                {inner.lastName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryDateOfBirth_${inner.id}`}
                              >
                                {inner.dateOfBirth}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryDateOfCollection_${inner.id}`}
                              >
                                {inner.dateOfCollection}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryTimeOfCollection_${inner.id}`}
                              >
                                {inner.timeOfCollection}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryFacilityName_${inner.id}`}
                              >
                                {inner.facilityName}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryUpdatedBy_${inner.id}`}
                              >
                                {inner.updatedBy}
                              </TableCell>
                              <TableCell
                                id={`BulkCheckInScanHistoryUpdatedDate_${inner.id}`}
                              >
                                {inner.updatedDate}
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
    </>
  );
};

export default ScanHistroyTable;
