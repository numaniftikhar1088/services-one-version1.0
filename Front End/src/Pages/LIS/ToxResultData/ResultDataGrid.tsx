import { Box, IconButton, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useLang from "Shared/hooks/useLanguage";
import React, { useRef, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import NoRecord from "../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import RenderInput from "./RenderInput";
import Row from "./Row";

const ReqDataGrid = (props: any) => {
  const {
    data,
    filterData,
    setSelectedBox,
    loadAllResultData,
    checkedAll,
    setCheckedAll,
    rowsToExpand,
    setRowsToExpand,
    setIsMasterExpandTriggered,
  } = useToxResultDataContext();

  const { t } = useLang();
  const [currentColumnKey, setCurrentColumnKey] = useState("");
  const searchRef = useRef<any>(null);
  const handleAllSelect = (checked: boolean, List: any) => {
    let selectedItems: any = [];
    setCheckedAll(!checkedAll);
    if (checked) {
      selectedItems = List.map((item: any) => ({
        RequisitionId: item?.RequisitionId,
        reqTypeId: item?.RequisitionTypeId,
        FacilityId: item?.FacilityId,
        RequisitionOrderID: item?.RequisitionOrderID,
      }));
      setSelectedBox((prev: any) => ({
        ...prev,
        requisitionId: selectedItems,
      }));
    }
    if (!checked) {
      setSelectedBox((prev: any) => ({
        ...prev,
        requisitionId: selectedItems,
      }));
    }
  };
  const sortData = async (tabsDetail: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    filterData.sortColumn = tabsDetail?.columnKey;
    filterData.sortDirection = searchRef.current.id;
    await loadAllResultData(false);
  };

  let showExpandedBtn = rowsToExpand.length;

  const handleOpen = () => {
    if (data?.gridData?.length > 0) {
      const firstFiveIds = data.gridData
        .slice(0, 3)
        .map((item: any) => item.RequisitionOrderID);

      setIsMasterExpandTriggered(true);
      setRowsToExpand(firstFiveIds);
    }
  };

  const handleClose = () => {
    setRowsToExpand([]);
    setIsMasterExpandTriggered(false);
  };

  console.log(rowsToExpand, "rowsToExpand");

  return (
    <div>
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="table_bordered overflow-hidden">
          <TableContainer component={Paper} className="shadow-none">
            <Table
              // stickyHeader
              aria-label="sticky table collapsible"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableHead>
                <TableRow className="h-40px">
                  {filterData.tabId === 1 || filterData.tabId === 2 ? (
                    <TableCell></TableCell>
                  ) : null}
                  <TableCell></TableCell>
                  {props?.tabsInfo &&
                    props?.tabsInfo?.map((tabsDetail: any) => (
                      <>
                        {tabsDetail.isShowOnUi &&
                          !tabsDetail.isExpandData &&
                          tabsDetail.isShow && (
                            <>
                              <TableCell sx={{ width: "max-content" }}>
                                <div className="d-flex justify-content-center align-items-center">
                                  <div style={{ width: "max-content" }}>
                                    {tabsDetail?.filterColumnsType && (
                                      <RenderInput
                                        tabsDetail={tabsDetail}
                                        currentColumnKey={currentColumnKey}
                                        setCurrentColumnKey={
                                          setCurrentColumnKey
                                        }
                                        tabValue={props.value}
                                        setTriggerSearchData={
                                          props.setTriggerSearchData
                                        }
                                        setCurPage={props.setCurPage}
                                      />
                                    )}
                                  </div>
                                </div>
                              </TableCell>
                            </>
                          )}
                      </>
                    ))}
                </TableRow>
                <TableRow>
                  {filterData.tabId === 3 ? null : (
                    <TableCell>
                      <IconButton
                        aria-label="master expand"
                        size="small"
                        sx={{
                          width: 20,
                          height: 20,
                          borderRadius: ".475rem",
                          backgroundColor: showExpandedBtn
                            ? "#8B0000"
                            : "#69A54B",
                          "&:hover": {
                            backgroundColor: showExpandedBtn
                              ? "#8B0000"
                              : "#5f9643",
                          },
                        }}
                      >
                        {showExpandedBtn ? (
                          <FaMinus color="#f5f8fa" onClick={handleClose} />
                        ) : (
                          <FaPlus color="#f5f8fa" onClick={handleOpen} />
                        )}
                      </IconButton>
                    </TableCell>
                  )}
                  {/* {filterData.tabId === 1 || filterData.tabId === 2 ? (
                    <TableCell className="w-50px"></TableCell>
                  ) : null} */}
                  <TableCell>
                    <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                      <input
                        id={`ToxResultDataCheckAllCheckBox`}
                        className="form-check-input"
                        type="checkbox"
                        checked={checkedAll}
                        onChange={(e) =>
                          handleAllSelect(e.target.checked, data?.gridData)
                        }
                      />
                    </label>
                  </TableCell>
                  {props?.tabsInfo &&
                    props?.tabsInfo?.map((tabsDetail: any) => (
                      <>
                        {tabsDetail.isShowOnUi &&
                          !tabsDetail.isExpandData &&
                          tabsDetail.isShow && (
                            <>
                              <TableCell sx={{ width: "max-content" }}>
                                <div
                                  onClick={() => {
                                    if (
                                      tabsDetail.columnKey !== "resultFile" &&
                                      tabsDetail.columnKey !== "view"
                                    ) {
                                      sortData(tabsDetail);
                                    }
                                  }}
                                  className="d-flex justify-content-between cursor-pointer"
                                  id=""
                                  ref={searchRef}
                                >
                                  <div style={{ width: "max-content" }}>
                                    {t(tabsDetail?.columnLabel)}
                                  </div>
                                  {tabsDetail.columnKey !== "resultFile" &&
                                    tabsDetail.columnKey !== "view" && (
                                      <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                        <ArrowUp
                                          CustomeClass={`${
                                            filterData.sortDirection ===
                                              "asc" &&
                                            filterData.sortColumn ===
                                              tabsDetail.columnKey
                                              ? "text-danger fs-6"
                                              : "text-gray-700 fs-7"
                                          }  p-0 m-0 "`}
                                        />
                                        <ArrowDown
                                          CustomeClass={`${
                                            filterData.sortDirection ===
                                              "desc" &&
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
                            </>
                          )}
                      </>
                    ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {props?.rowInfo?.length ? (
                  props?.rowInfo?.map((RowData: any) => (
                    <>
                      <Row
                        RowData={RowData && RowData}
                        tabsInfo={props?.tabsInfo}
                        Duplicate={props.Duplicate}
                        setDuplicate={props.setDuplicate}
                      />
                    </>
                  ))
                ) : (
                  <NoRecord />
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
};

export default React.memo(ReqDataGrid);
