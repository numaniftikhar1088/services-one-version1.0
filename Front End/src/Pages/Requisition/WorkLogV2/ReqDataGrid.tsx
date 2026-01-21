import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useRef, useState } from "react";
import Row from "./Row";
import { useWorkLogDataContext } from "./WorkLogContext/useWorkLogContext";
import PatientSearchInput from "Pages/Patient/PatientDemographic/PatientSearchInput";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";

const ReqDataGrid = (props: any) => {
  const {
    data,
    value,
    loading,
    filterData,
    selectedBox,
    loadGridData,
    setFilterData,
    setSelectedBox,
  } = useWorkLogDataContext();

  const { t } = useLang();
  const searchRef = useRef<any>(null);

  const searchData = (e: any) => {
    e.preventDefault();
    loadGridData();
  };

  const sortData = async (tabsDetail: any) => {
    const currentColumn = tabsDetail?.columnKey;
    const currentDirection = filterData.sortDirection;
    const currentSortColumn = filterData.sortColumn;

    // Determine new sort direction
    let newDirection = "asc";
    if (currentSortColumn === currentColumn && currentDirection === "asc") {
      newDirection = "desc";
    }

    // Update filter data
    setFilterData((prev: any) => ({
      ...prev,
      sortColumn: currentColumn,
      sortDirection: newDirection,
    }));
  };

  const handleAllSelect = (checked: boolean) => {
    const idsArr =
      data?.gridData?.map((item: any) => item?.RequisitionOrderId) || [];

    setSelectedBox((prev: any) => ({
      ...prev,
      requisitionOrderId: checked ? idsArr : [],
    }));
  };

  //  Custome table Scroll Start ----------
  // --------------------------------------
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const scrollBarRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [showScrollBar, setShowScrollBar] = useState(false);

  // Function to update table width dynamically
  const updateTableWidth = () => {
    if (tableRef.current) {
      setTableWidth(tableRef.current.scrollWidth);
    }
  };
  // Check if vertical scroll exists
  const checkScrollbars = () => {
    //  const hasVerticalScroll = document.body.scrollHeight  ===  window.innerHeight;
    //  setShowScrollBar(hasVerticalScroll);
    if (tableContainerRef.current) {
      const hasVerticalScroll =
        tableContainerRef.current.getBoundingClientRect().height > 500;
      setShowScrollBar(hasVerticalScroll);
    }
  };

  // Observe table width & height changes dynamically
  useEffect(() => {
    updateTableWidth(); // Initial update
    checkScrollbars(); // Check scrollbars initially

    if (tableRef.current) {
      const observer = new MutationObserver(() => {
        updateTableWidth();
        checkScrollbars();
      });

      observer.observe(tableRef.current, { childList: true, subtree: true });

      return () => observer.disconnect();
    }
    window.addEventListener("resize", checkScrollbars);
    return () => window.removeEventListener("resize", checkScrollbars);
  }, []);

  // Sync table scroll with the custom scrollbar
  const syncTableScroll = () => {
    if (tableContainerRef.current && scrollBarRef.current) {
      tableContainerRef.current.scrollLeft = scrollBarRef.current.scrollLeft;
    }
  };

  // Sync scrollbar when user scrolls the table
  const syncScrollBar = () => {
    if (tableContainerRef.current && scrollBarRef.current) {
      scrollBarRef.current.scrollLeft = tableContainerRef.current.scrollLeft;
    }
  };

  // Hide Scroll If near the top or bottom, hide the div

  useEffect(() => {
    loadGridData();
  }, [filterData.sortColumn, filterData.sortDirection]);

  const [isVisibleScroll, setIsVisibleScroll] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY; // Get the current scroll position
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight; // Get the maximum scrollable height

      if (scrollPosition >= maxScroll - 100) {
        setIsVisibleScroll(false);
      } else {
        setIsVisibleScroll(true);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Custome table Scroll End ----------
  // --------------------------------------

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <div className="w-full overflow-hidden relative">
        {/* Fixed Scrollbar */}

        {showScrollBar && isVisibleScroll && (
          <div
            ref={scrollBarRef}
            className="overflow-auto w-full custom-scroll-nk"
            style={{ height: "16px" }}
            onScroll={syncTableScroll}
          >
            <div style={{ width: `${tableWidth}px` }} /> {/* Dynamic width */}
          </div>
        )}

        <div className="table_bordered overflow-hidden">
          <div
            ref={tableContainerRef}
            className="overflow-auto max-h-96 w-full"
            onScroll={syncScrollBar}
            style={{
              marginTop: showScrollBar ? "-16px" : "0",
              paddingTop: showScrollBar ? "16px" : "0",
            }}
          >
            <Table
              ref={tableRef}
              // aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              {!props?.tabsInfo ? null : (
                <TableHead>
                  <TableRow className="h-40px">
                    {value === 0 || value === 1 ? (
                      <TableCell></TableCell>
                    ) : null}
                    {value === 2 || value === 4 || value === 3 ? null : (
                      <TableCell></TableCell>
                    )}
                    {value === 3 ? null : <TableCell></TableCell>}
                    {props?.tabsInfo?.map(
                      (tabsDetail: any) =>
                        tabsDetail?.isShowOnUi &&
                        tabsDetail?.isShow && (
                          <TableCell
                            sx={{ width: "max-content" }}
                            key={tabsDetail.id}
                          >
                            <div className="d-flex justify-content-center align-items-center">
                              <div
                                className="w-100"
                                style={{ minWidth: "max-content" }}
                              >
                                {tabsDetail?.filterColumnsType && (
                                  <form onSubmit={searchData}>
                                    <PatientSearchInput
                                      column={tabsDetail}
                                      loadData={loadGridData}
                                      searchValue={filterData}
                                      setSearchValue={setFilterData}
                                      setFilters={props.setFilters}
                                      filters={props.filters}
                                      setTriggerSearchData={
                                        props.setTriggerSearchData
                                      }
                                    />
                                  </form>
                                )}
                              </div>
                            </div>
                          </TableCell>
                        )
                    )}
                  </TableRow>
                  <TableRow className="h-35px">
                    {value === 0 || value === 1 ? (
                      <TableCell></TableCell>
                    ) : null}
                    {value === 2 || value === 4 || value === 3 ? null : (
                      <TableCell>
                        <label className="form-check form-check-sm form-check-solid">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) => handleAllSelect(e.target.checked)}
                            checked={
                              selectedBox.requisitionOrderId.length ===
                              props?.rowInfo?.length
                            }
                          />
                        </label>
                      </TableCell>
                    )}
                    {value === 3 ? null : (
                      <TableCell sx={{ width: "fit-content" }}>
                        {t("Actions")}
                      </TableCell>
                    )}
                    {props?.tabsInfo?.map((tabsDetail: any) => (
                      <>
                        {tabsDetail?.isShowOnUi && tabsDetail.isShow && (
                          <TableCell
                            sx={{
                              width: "max-content",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <div
                              onClick={() => {
                                if (
                                  tabsDetail.columnKey !== "printLabel" &&
                                  tabsDetail.columnKey !== "nextStep" &&
                                  tabsDetail.columnKey !== "flag" &&
                                  tabsDetail.columnKey !== "resultFile"
                                ) {
                                  sortData(tabsDetail);
                                }
                              }}
                              className="d-flex justify-content-between cursor-pointer"
                              id=""
                              ref={searchRef}
                            >
                              <div style={{ width: "max-content" }}>
                                {t(tabsDetail?.columnLabel)}{" "}
                              </div>
                              {tabsDetail.columnKey !== "printLabel" &&
                                tabsDetail.columnKey !== "nextStep" &&
                                tabsDetail.columnKey !== "flag" &&
                                tabsDetail.columnKey !== "resultFile" && (
                                  <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                    <ArrowUp
                                      CustomeClass={`${
                                        filterData.sortDirection === "asc" &&
                                        filterData.sortColumn ===
                                          tabsDetail.columnKey
                                          ? "text-danger fs-6"
                                          : "text-gray-700 fs-7"
                                      }  p-0 m-0 "`}
                                    />
                                    <ArrowDown
                                      CustomeClass={`${
                                        filterData.sortDirection === "desc" &&
                                        filterData.sortColumn ===
                                          tabsDetail.columnKey
                                          ? "text-danger fs-6"
                                          : "text-gray-700 fs-7"
                                      }  p-0 m-0`}
                                    />
                                  </div>
                                )}
                            </div>
                          </TableCell>
                        )}
                      </>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {loading ? (
                  <TableCell colSpan={11}>
                    <Loader />
                  </TableCell>
                ) : !props?.rowInfo?.length ? (
                  <NoRecord />
                ) : (
                  props?.rowInfo?.map((RowData: any) => (
                    <Row
                      RowData={RowData}
                      tabsInfo={props?.tabsInfo}
                      key={RowData.RequisitionOrderId}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </Box>
  );
};

export default React.memo(ReqDataGrid);
