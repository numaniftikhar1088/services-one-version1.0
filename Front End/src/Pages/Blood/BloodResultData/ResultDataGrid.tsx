import { Box, IconButton, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useBloodResultDataContext } from "Pages/Blood/BloodResultData/BloodResultDataContext";
import PatientSearchInput from "Pages/Patient/PatientDemographic/PatientSearchInput";
import React, { useRef } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { Loader } from "Shared/Common/Loader";
import useIsMobile from "Shared/hooks/useIsMobile";
import useLang from "Shared/hooks/useLanguage";
import NoRecord from "../../../Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import Row from "./Row";

const ReqDataGrid = (props: any) => {
  const {
    data,
    loading,
    filterData,
    checkedAll,
    selectedBox,
    rowsToExpand,
    loadGridData,
    setCheckedAll,
    setFilterData,
    setSelectedBox,
    setRowsToExpand,
    setIsMasterExpandTriggered,
  } = useBloodResultDataContext();

  const { t } = useLang();
  const isMobile = useIsMobile();
  const searchRef = useRef<any>(null);

  const handleAllSelect = (checked: boolean, List: any) => {
    let selectedItems: any = [];
    setCheckedAll(!checkedAll);
    if (checked) {
      selectedItems = List.map((item: any) => ({
        requisitionId: item?.RequisitionId,
        reqTypeId: item?.RequisitionTypeId,
        facilityId: item?.FacilityId,
        requisitionOrderId: item?.RequisitionOrderId,
        id: item?.Id,
      }));
    }
    setSelectedBox((prev: any) => ({
      ...prev,
      requisitionId: selectedItems,
    }));
  };

  const sortData = async (tabsDetail: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    filterData.sortColumn = tabsDetail?.columnKey;
    filterData.sortDirection = searchRef.current.id;
    await loadGridData(false);
  };

  const showExpandedBtn = rowsToExpand.length;

  const handleOpen = () => {
    if (data?.gridData?.length > 0) {
      const firstFiveIds = data.gridData
        .slice(0, 3)
        .map((item: any) => item.RequisitionOrderId);

      setIsMasterExpandTriggered(true);
      setRowsToExpand(firstFiveIds);
    }
  };

  const handleClose = () => {
    setRowsToExpand([]);
    setIsMasterExpandTriggered(false);
  };

  return (
    <div>
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="table_bordered overflow-hidden">
          <TableContainer
            component={Paper}
            className="shadow-none"
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
          >
            <Table
              aria-label="table with sticky header"
              stickyHeader
              // stickyFooter
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              {!props.tabsInfo ? null : (
                <TableHead>
                  <TableRow className="h-40px">
                    {filterData.tabId === 1 || filterData.tabId === 2 ? (
                      <TableCell></TableCell>
                    ) : null}
                    <TableCell></TableCell>
                    {props?.tabsInfo &&
                      props?.tabsInfo?.map((tabsDetail: any) => (
                        <>
                          {tabsDetail?.isShowOnUi &&
                            !tabsDetail?.isExpandData &&
                            tabsDetail?.isShow && (
                              <>
                                <TableCell sx={{ width: "max-content" }}>
                                  <div className="d-flex justify-content-center align-items-center">
                                    <div style={{ width: "max-content" }}>
                                      {tabsDetail?.filterColumnsType && (
                                        <PatientSearchInput
                                          column={tabsDetail}
                                          loadData={loadGridData}
                                          searchValue={filterData}
                                          setSearchValue={setFilterData}
                                          setFilters={props.setFilters}
                                          filters={props.filters}
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
                    {filterData.tabId === 3 || filterData.tabId === 4 ? null : (
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
                    <TableCell>
                      <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={
                            data.gridData.length === 0
                              ? false
                              : selectedBox.requisitionId.length ===
                                data.gridData.length
                          }
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
                                        tabsDetail.columnKey !== "ResultFile" &&
                                        tabsDetail.columnKey !== "View" &&
                                        tabsDetail.columnKey !== "Report" &&
                                        tabsDetail.columnKey !== "PrintLabel"
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
                                    {tabsDetail.columnKey !== "ResultFile" &&
                                      tabsDetail.columnKey !== "View" &&
                                      tabsDetail.columnKey !== "Report" &&
                                      tabsDetail.columnKey !== "PrintLabel" && (
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
              )}
              <TableBody>
                {loading ? (
                  <TableCell colSpan={10}>
                    <Loader />
                  </TableCell>
                ) : data.gridData?.length ? (
                  data.gridData?.map((RowData: any) => (
                    <>
                      <Row
                        RowData={RowData}
                        tabsInfo={props?.tabsInfo}
                        key={RowData?.RequisitionOrderId}
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
