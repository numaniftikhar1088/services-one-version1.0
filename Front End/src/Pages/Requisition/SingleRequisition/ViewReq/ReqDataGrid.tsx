import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader } from "Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
import NoRecord from "../../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import RenderInput from "./RenderInput";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import Row from "./Row";

const ReqDataGrid = (props: any) => {
  const {
    data,
    selectedBox,
    setSelectedBox,
    filterData,
    loadGridData,
    loading,
  } = useReqDataContext();
  const { t } = useLang();
  const [currentColumnKey, setCurrentColumnKey] = useState("");

  const searchRef = useRef<any>(null);
  const searchData = (e: any) => {
    e.preventDefault();
    props?.setCurPage(1);
    loadGridData();
  };

  const sortData = async (tabsDetail: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    filterData.sortColumn = tabsDetail?.columnKey;
    filterData.sortDirection = searchRef.current.id;
    await loadGridData();
  };

  const handleAllSelect = (checked: boolean) => {
    const idsArr =
      data?.gridData?.map(
        (item: any) => item?.RequisitionOrderId || item?.RequisitionOrderID
      ) || [];
    const idsArr2 =
      data?.gridData?.map(
        (item: any) => item?.RequisitionId || item?.RequisitionOrderID
      ) || [];

    setSelectedBox((prev: any) => ({
      ...prev,
      requisitionOrderId: checked ? idsArr : [],
      requisitionId: checked ? idsArr2 : [],
    }));
  };

  //  Custom table Scroll Start ----------
  // --------------------------------------
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLTableElement>(null);
  const topScrollBarRef = useRef<HTMLDivElement>(null);
  const bottomScrollBarRef = useRef<HTMLDivElement>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [showScrollBar, setShowScrollBar] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  // ref to prevent infinite scroll loops
  const isScrollingRef = useRef(false);

  // Function to update table width dynamically
  const updateTableWidth = useCallback(() => {
    if (tableRef.current) {
      setTableWidth(tableRef.current.scrollWidth);
    }
  }, []);

  // Check if horizontal scroll is needed
  const checkScrollbars = useCallback(() => {
    if (tableContainerRef.current && tableRef.current) {
      const containerWidth = tableContainerRef.current.clientWidth;
      const tableWidth = tableRef.current.scrollWidth;
      setShowScrollBar(tableWidth > containerWidth);
    }
  }, []);

  // Function to update all scroll positions
  const updateAllScrollPositions = useCallback((position: number) => {
    setScrollPosition(position);

    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = position;
    }

    if (topScrollBarRef.current) {
      topScrollBarRef.current.scrollLeft = position;
    }

    if (bottomScrollBarRef.current) {
      bottomScrollBarRef.current.scrollLeft = position;
    }
  }, []);

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

    const handleResize = () => {
      updateTableWidth();
      checkScrollbars();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [updateTableWidth, checkScrollbars]);

  // Improved sync functions that work even when some scrollbars are hidden
  const syncTableScrollFromTop = useCallback(() => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    if (topScrollBarRef.current) {
      const scrollLeft = topScrollBarRef.current.scrollLeft;
      updateAllScrollPositions(scrollLeft);
    }

    // Use setTimeout to prevent infinite loops
    setTimeout(() => {
      isScrollingRef.current = false;
    }, 10);
  }, [updateAllScrollPositions]);

  const syncTableScrollFromBottom = useCallback(() => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    if (bottomScrollBarRef.current) {
      const scrollLeft = bottomScrollBarRef.current.scrollLeft;
      updateAllScrollPositions(scrollLeft);
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 10);
  }, [updateAllScrollPositions]);

  // Sync both scrollbars when user scrolls the table
  const syncScrollBars = useCallback(() => {
    if (isScrollingRef.current) return;
    isScrollingRef.current = true;

    if (tableContainerRef.current) {
      const scrollLeft = tableContainerRef.current.scrollLeft;
      updateAllScrollPositions(scrollLeft);
    }

    setTimeout(() => {
      isScrollingRef.current = false;
    }, 10);
  }, [updateAllScrollPositions]);

  // Hide Scroll based on table visibility
  const [isVisibleTopScroll, setIsVisibleTopScroll] = useState(false);
  const [isVisibleBottomScroll, setIsVisibleBottomScroll] = useState(false);

  // Hide Scroll based on table visibility
  useEffect(() => {
    const handleScroll = () => {
      if (tableContainerRef.current) {
        const tableRect = tableContainerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const tableTop = tableRect.top;
        const tableBottom = tableRect.bottom;

        const isTableVisible = tableBottom > 0 && tableTop < windowHeight;
        const isHeaderAboveView = tableTop < 80;

        // Top scrollbar
        setIsVisibleTopScroll(
          isTableVisible && isHeaderAboveView && showScrollBar
        );

        // Bottom scrollbar
        const isTableBottomVisible = tableBottom > 100;
        setIsVisibleBottomScroll(
          isTableVisible && isTableBottomVisible && showScrollBar
        );
      }
    };

    // Run once immediately so it shows on load
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [showScrollBar]);

  const [isStickyBottom, setIsStickyBottom] = useState(false);

  // Add near the other states
  const BAR_HEIGHT = 20;

  // Replace your "Hide Scroll based on table visibility" effect with this:
  // Run calc immediately after mount AND when table/data updates
  useEffect(() => {
    const calc = () => {
      if (!tableContainerRef.current) return;

      const rect = tableContainerRef.current.getBoundingClientRect();
      const vh = window.innerHeight;

      // Table visibility
      const isTableVisible = rect.bottom > 0 && rect.top < vh;

      // Bottom bar should show if:
      // 1. horizontal scroll is needed, AND
      // 2. table is visible
      setIsVisibleBottomScroll(showScrollBar && isTableVisible);

      // Sticky mode (when bottom of table is below viewport)
      const shouldStick =
        showScrollBar && isTableVisible && rect.bottom > vh + 1;
      setIsStickyBottom(shouldStick);
    };

    // Run immediately on mount + whenever data changes
    calc();

    window.addEventListener("scroll", calc, { passive: true });
    window.addEventListener("resize", calc);

    return () => {
      window.removeEventListener("scroll", calc);
      window.removeEventListener("resize", calc);
    };
  }, [showScrollBar, props?.rowInfo, data?.gridData]);

  // Keep new scrollbars in sync when they mount
  useEffect(() => {
    if (topScrollBarRef.current) {
      topScrollBarRef.current.scrollLeft = scrollPosition;
    }
    if (bottomScrollBarRef.current) {
      bottomScrollBarRef.current.scrollLeft = scrollPosition;
    }
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollLeft = scrollPosition;
    }
  }, [scrollPosition, isVisibleTopScroll, isVisibleBottomScroll]);

  // Custom table Scroll End ----------
  // --------------------------------------

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <div className="w-full relative">
        {/* Top Fixed Scrollbar - visible when table is at top of viewport */}
        {showScrollBar && isVisibleTopScroll && (
          <div
            ref={topScrollBarRef}
            className="overflow-auto w-full custom-scroll-nk sticky top-0 z-10"
            style={{
              height: "16px",
              marginBottom: "4px",
              backgroundColor: "white",
              borderTop: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            }}
            onScroll={syncTableScrollFromTop}
          >
            <div style={{ width: `${tableWidth}px`, height: "1px" }} />
          </div>
        )}

        <div className="table_bordered overflow-hidden">
          <div
            ref={tableContainerRef}
            className="overflow-auto max-h-96 w-full"
            onScroll={syncScrollBars}
            style={{
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: isStickyBottom ? `${BAR_HEIGHT}px` : 0,
            }}
          >
            <Table
              ref={tableRef}
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              {!props?.tabsInfo ? null : (
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {props?.tabsInfo?.map(
                      (tabsDetail: any) =>
                        tabsDetail?.isShowOnUi &&
                        tabsDetail?.isShow && (
                          <TableCell key={tabsDetail.columnKey}>
                            {tabsDetail?.filterColumnsType && (
                              <form onSubmit={searchData}>
                                <RenderInput
                                  tabsDetail={tabsDetail}
                                  currentColumnKey={currentColumnKey}
                                  setCurrentColumnKey={setCurrentColumnKey}
                                />
                              </form>
                            )}
                          </TableCell>
                        )
                    )}
                  </TableRow>
                  <TableRow className="h-35px">
                    <TableCell>
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          id="ViewRequisitionCheckAllCheckBox"
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
                    <TableCell sx={{ width: "fit-content" }}>
                      {t("Actions")}
                    </TableCell>
                    {props?.tabsInfo?.map((tabsDetail: any) => (
                      <React.Fragment key={tabsDetail.columnKey}>
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
                      </React.Fragment>
                    ))}
                  </TableRow>
                </TableHead>
              )}
              <TableBody>
                {loading ? (
                  <TableCell colSpan={9}>
                    <Loader />
                  </TableCell>
                ) : !props?.rowInfo?.length ? (
                  <NoRecord />
                ) : (
                  props?.rowInfo?.map((RowData: any, index: number) => (
                    <Row
                      key={index}
                      RowData={RowData && RowData}
                      tabsInfo={props?.tabsInfo}
                      portalType={props?.portalType}
                      onSingleDelete={props?.onSingleDelete}
                      onSinglePrint={props?.onSinglePrint}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Bottom Fixed Scrollbar */}
        {showScrollBar && isVisibleBottomScroll && (
          <div
            ref={bottomScrollBarRef}
            className="overflow-auto custom-scroll-nk"
            style={{
              height: `${BAR_HEIGHT}px`,
              marginTop: "4px",
              backgroundColor: "white",
              borderTop: "1px solid #e5e7eb",
              position: isStickyBottom ? "fixed" : "static",
              bottom: isStickyBottom ? 0 : "auto",
              zIndex: isStickyBottom ? 20 : "auto",
              width: !isStickyBottom ? "100%" : "",
            }}
            onScroll={syncTableScrollFromBottom}
          >
            <div style={{ width: `${tableWidth}px`, height: "1px" }} />
          </div>
        )}
      </div>
    </Box>
  );
};

export default React.memo(ReqDataGrid);
