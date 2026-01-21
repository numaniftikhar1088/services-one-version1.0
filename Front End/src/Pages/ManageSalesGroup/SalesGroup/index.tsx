import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import useLang from "Shared/hooks/useLanguage";
import { sortById, SortingTypeI } from "Utils/consts";
import SalesGroupRow from "./row";
import { Loader } from "Shared/Common/Loader";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import { TubeTypeGetAll } from "Services/BloodLisSetting/BloodLisSetting";
import usePagination from "Shared/hooks/usePagination";
import { SAlesRepLookupApi } from "Services/Marketing/TrainingAids";
// import { SalesGroupGetAll } from "Services/SalesGroup/SalesGroup";
import { salesRepRequestTable } from "Services/Marketing/SalesRepRequestService";
import {
  SalesGroupGetAll,
  SalesGroupAgainst,
} from "Services/SalesGroup/SalesGroup";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import NoRecord from "Shared/Common/NoRecord";

interface Lookups {
  id: number;
  firstName: string;
  name: string;
  lastName: string;
}

const initialSearchQuery = {
  id: 0,
  userId: "",
  isApproved: true,
  isRejected: false,
  firstName: "",
  lastName: "",
  positionTitle: "",
  salesRepNumber: "",
  email: "",
  phoneNumber: "",
  address1: "",
  address2: "",
  city: "",
  zipCode: "",
  actionBy: "",
  actionDate: null,
};

const TubeTypeIndex = () => {
  const { t } = useLang();
  const [loading, setLoading] = useState(true);
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [expandedRowId, setExpandedRowId] = useState<number | null>(null);
  const [sortTrigger, setSortTrigger] = useState(false);

  const [apiGetData, setApiGetData] = useState<any[]>([]);
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  const initialPostData = {
    id: 0,
    name: "",
    isActive: true,
    salesReps: [],
  };

  /*###################  SalesRep lookup & selectedSalesRep function Start ######################### */
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const [salesReplookup, setSalesReplookup] = useState<Lookups[]>([]);
  const [selectedSalesRep, setSelectedSalesRep] = useState<Lookups[]>([]);
  const [allRepsSearchTerm, setAllRepsSearchTerm] = useState("");
  const [selectedRepsSearchTerm, setSelectedSalesRepsSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isEditingDisable, setIsEditingDisable] = useState(false);

  const fetchSalesRep = async (queryModel = {}) => {
    let obj = {
      pageNumber: 0,
      pageSize: 0,
      queryModel: {
        ...initialSearchQuery,
        ...queryModel,
      },
      sortColumn: reset ? sortById.clickedIconData : sort.clickedIconData,
      sortDirection: reset ? sortById.sortingOrder : sort.sortingOrder,
    };
    setIsLoading(true);
    const salesRep: any = await salesRepRequestTable(obj);

    if (salesRep.status === 200) {
      setIsLoading(false);
    }

    setSalesReplookup(
      salesRep.data.result.map((rep: any) => ({
        id: rep.id,
        firstName: rep.firstName,
        lastName: rep.lastName, // ✅ ADD THIS LINE
      }))
    );
  };

  const handleRepClick = (rep: Lookups) => {
    setSelectedSalesRep((prevSelectedSalesRep) => {
      if (prevSelectedSalesRep.some((selected) => selected.id === rep.id)) {
        return prevSelectedSalesRep;
      } else {
        return [...prevSelectedSalesRep, rep];
      }
    });

    setSalesReplookup((prevSalesReplookup) =>
      prevSalesReplookup.filter((r) => r.id !== rep.id)
    );
  };

  const removeSelectedRep = (rep: Lookups) => {
    setSelectedSalesRep((prevSelectedSalesRep) =>
      prevSelectedSalesRep.filter((r) => r.id !== rep.id)
    );

    setSalesReplookup((prevSalesReplookup) => [...prevSalesReplookup, rep]);
  };

  const moveAllToSelectedFacilities = () => {
    setSelectedSalesRep((prevSelectedSalesRep) => [
      ...prevSelectedSalesRep,
      ...salesReplookup,
    ]);
    setSalesReplookup([]);
  };

  const moveAllTosalesLookup = () => {
    setSalesReplookup((prevSalesReplookup) => [
      ...prevSalesReplookup,
      ...selectedSalesRep,
    ]);
    setSelectedSalesRep([]);
  };
  /*###################  SalesRep lookup & selectedSalesRep function End ######################### */

  /*#########################----SORT STARTS------########################## */
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  // 2. Replace the handleSort function (around line 152) with this:
  const handleSort = (columnName: any) => {
    // Determine the new sort order
    let newSortOrder: string;

    // If clicking the same column, toggle between asc and desc
    if (sort.clickedIconData === columnName) {
      newSortOrder = sort.sortingOrder === "asc" ? "desc" : "asc";
    } else {
      // If clicking a new column, start with "asc"
      newSortOrder = "asc";
    }

    // Update the sorting state
    setSorting({
      sortingOrder: newSortOrder,
      clickedIconData: columnName,
    });

    // Force re-render to apply sorting immediately
    setSortTrigger((prev) => !prev);
  };
  /*#########################----SORT ENDS------########################## */
  /*##############################-----PAGINATION Start-----#################*/
  const {
    total,
    curPage,
    showPage,
    nextPage,
    prevPage,
    setTotal,
    pageSize,
    totalPages,
    pageNumbers,
    setPageSize,
    setCurPage,
  } = usePagination();
  console.log(
    "pagination",
    total,
    "curPage",
    curPage,
    "pageSize",
    pageSize,
    "totalPages",
    totalPages,
    "pageNumbers",
    pageNumbers
  );
  /*##############################-----PAGINATION End-----#################*/
  const [reset, setReset] = useState(false);

  /*#########################----Search Function Start------########################## */

  const initialSearchCriteria = {
    groupName: "",
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  /*#########################----Search Function End------########################## */

  /*##############################-----Get Api Start-----#################*/
  let obj = {
    pageIndex: curPage,
    pageSize: pageSize,

    requestModel: {
      name: searchCriteria.groupName || "",
      isArchived: false,
    },
    sortColumn: sort.clickedIconData || "Id",
    sortDirection: sort.sortingOrder || "Desc",
  };
  const showApiData = async () => {
    setLoading(true);
    try {
      let resp = await SalesGroupGetAll(obj);
      console.log("Resp for the desired api --=> ", resp, obj);
      setApiGetData(resp?.data?.result);
      setTotal(resp?.data?.total);
    } catch (error) {
      console.error(t("Error fetching sales table data:"), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    showApiData();
  }, [curPage, pageSize, triggerSearchData, sortTrigger]); // ✅ Add sortTrigger

  useEffect(() => {
    if (apiGetData?.length) {
      // Combine all salesReps from all rows
      const apiReps = apiGetData
        .filter((row) => row != null) // ✅ Filter out undefined/null
        .flatMap((row: any) => row.salesReps || []);

      // Add only unique reps (no duplicates)
      setSelectedSalesRep((prev: any[]) => {
        const newOnes = apiReps.filter(
          (r: any) => !prev.some((sel) => sel.id === r.id)
        );
        return [...prev, ...newOnes];
      });
    }
  }, [apiGetData]);

  const filteredSelectedReps = selectedSalesRep.filter((rep) => {
    const searchTerm = selectedRepsSearchTerm.toLowerCase();
    const name = (rep.name || "").toLowerCase();
    return name.includes(searchTerm);
  });

  /*##############################-----HandleChangeSwitch for Status Active/Inactivet-----#################*/

  const handleChangeSwitch = (e: any, id: any) => {
    setApiGetData((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              isActive: e.target.checked,
            }
          : x
      )
    );
  };

  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria); // clears input field
    setSearchedTags([]);
    setReset(!reset);
    setSorting(sortById);
    setCurPage(1);
    // showApiData(); // ✅ ensures all data reloads
  };

  const handleSearch = () => {
    setCurPage(1);
    setSearchedTags((prevTags) => {
      const newTags = new Set([...prevTags, "GroupName"]);
      return Array.from(newTags);
    });

    setTriggerSearchData((prev) => !prev);
  };
  const handleTagRemoval = (clickedTag: string) => {
    setSearchedTags((prev) => prev.filter((tag) => tag !== clickedTag));

    setSearchCriteria((prev) => ({
      ...prev,
      groupName: "",
    }));
    setReset(!reset);
    showApiData();
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    showApiData();
  }, [reset, searchedTags]);

  useEffect(() => {
    return () => setIsBtnDisabled(false);
  }, []);
  return (
    <>
      <div className="d-flex gap-2 flex-wrap">
        {searchedTags.map((tag: string, index: number) =>
          tag === "isArchived" ? null : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
              onClick={() => handleTagRemoval(tag)}
              key={tag + index}
            >
              <span className="fw-bold">{tag}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-2">{t("Records")}</span>
            <select
              id={`BloodLisTubeTypeRecords`}
              className="form-select w-100px h-33px rounded py-2"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder="Select option"
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                setCurPage(1);
              }}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            {/* <PermissionComponent
              moduleName="Manage Sales Rep"
              pageName="Sales Group"
              permissionIdentifier="Add"
            > */}
            <button
              id={`BloodLisTubeTypeAddNew`}
              className="btn btn-primary btn-sm btn-primary--icon px-7"
              onClick={() => {
                setIsEditingDisable(true);
                // if (!isBtnDisabled) {
                setApiGetData((prevRows: any) => [
                  { rowStatus: true, ...initialPostData },
                  ...(prevRows ?? []),
                ]);
                // setIsBtnDisabled(true);
                // }
              }}
              disabled={loading}
            >
              <i className="fa-solid fa-plus"></i>
              <span style={{ fontSize: 11 }}>{t("Add New Sales Group")}</span>
            </button>
            {/* </PermissionComponent> */}
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id={`BloodLisTubeTypeSearch`}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={handleSearch}
          >
            {t("Search")}
          </button>
          <button
            id={`BloodLisTubeTypeReset`}
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            type="button"
            onClick={handleReset}
          >
            <span>{t("Reset")}</span>
          </button>
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      <div className="card">
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
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell className="w-50px"></TableCell>
                    <TableCell
                      style={{
                        width: "max-content",
                        minWidth: "200px",
                      }}
                    >
                      <input
                        id={`BloodLisTubeTypeTitlesearch`}
                        type="text"
                        name="name"
                        className="form-control bg-white min-w-150px w-100 rounded-2 fs-8 h-30px"
                        placeholder="Search ...."
                        value={searchCriteria.groupName}
                        onKeyDown={handleKeyPress}
                        onChange={(e) =>
                          setSearchCriteria({
                            ...searchCriteria,
                            groupName: e.target.value,
                          })
                        }
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell></TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                    <TableCell
                      style={{
                        width: "max-content",
                        minWidth: "200px",
                      }}
                    >
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("name")}
                        // ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Group Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "name"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "name"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort("isActive")}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Status")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "isActive"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "isActive"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {loading ? (
                    <TableCell colSpan={5}>
                      <Loader />
                    </TableCell>
                  ) : apiGetData?.length ? (
                    apiGetData.map((row: any, index: number) => (
                      <SalesGroupRow
                        row={row}
                        key={row.id}
                        index={index}
                        apiGetData={apiGetData}
                        showApiData={showApiData}
                        setApiGetData={setApiGetData}
                        salesReplookup={salesReplookup}
                        handleRepClick={handleRepClick}
                        selectedSalesRep={selectedSalesRep}
                        setIsBtnDisabled={setIsBtnDisabled}
                        removeSelectedRep={removeSelectedRep}
                        allRepsSearchTerm={allRepsSearchTerm}
                        handleChangeSwitch={handleChangeSwitch}
                        setAllRepsSearchTerm={setAllRepsSearchTerm}
                        filteredSelectedReps={filteredSelectedReps}
                        selectedRepsSearchTerm={selectedRepsSearchTerm}
                        moveAllTosalesLookup={moveAllTosalesLookup}
                        setSalesReplookup={setSalesReplookup}
                        setSelectedSalesRep={setSelectedSalesRep}
                        expandedRowId={expandedRowId}
                        setIsLoading={setIsLoading}
                        isLoading={isLoading}
                        setIsEditingDisable={setIsEditingDisable}
                        isEditingDisable={isEditingDisable}
                        setExpandedRowId={setExpandedRowId}
                        fetchSalesRep={fetchSalesRep}
                        moveAllToSelectedFacilities={
                          moveAllToSelectedFacilities
                        }
                        setSelectedSalesRepsSearchTerm={
                          setSelectedSalesRepsSearchTerm
                        }
                      />
                    ))
                  ) : (
                    <NoRecord colSpan={3} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record mb-0">
          <span>
            {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
            {Math.min(pageSize * curPage, total)} {t("of Total")}
            <span> {total} </span> {t("entries")}
          </span>
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
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
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
    </>
  );
};

export default TubeTypeIndex;
