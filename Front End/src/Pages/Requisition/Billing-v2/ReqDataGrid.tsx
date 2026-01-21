import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useRef, useState } from "react";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import { useBillingContext } from "./useReqContext";
import RenderInput from "./RenderInput";
import Row from "./Row";

const ReqDataGrid = (props: any) => {
  const {
    data,
    selectedBox,
    setSelectedBox,
    filterData,
    loadGridData,
    loading,
  } = useBillingContext();
  const { t } = useLang();
  const [currentColumnKey, setCurrentColumnKey] = useState("");

  const searchRef = useRef<any>(null);
  const searchData = (e: any) => {
    e.preventDefault();
    props.setCurPage(1);
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
        {showScrollBar && isVisibleScroll && (
          <div
            ref={scrollBarRef}
            className="overflow-auto w-full custom-scroll-nk"
            style={{ height: "16px" }}
            onScroll={syncTableScroll}
          >
            <div style={{ width: `${tableWidth}px` }} />
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
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              {!props?.tabsInfo ? null : (
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {props?.tabsInfo?.map(
                      (tabsDetail: any) =>
                        tabsDetail?.isShowOnUi &&
                        tabsDetail?.isShow && (
                          <TableCell>
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
                    <TableCell></TableCell>
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
                  <TableCell colSpan={9}>
                    <Loader />
                  </TableCell>
                ) : !props?.rowInfo?.length ? (
                  <NoRecord />
                ) : (
                  props?.rowInfo?.map((RowData: any) => (
                    <Row
                      RowData={RowData && RowData}
                      tabsInfo={props?.tabsInfo}
                      portalType={props?.portalType}
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
