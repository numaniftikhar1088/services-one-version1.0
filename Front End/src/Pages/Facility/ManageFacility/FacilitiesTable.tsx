import { Box, TableContainer } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useRef } from "react";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import { useManageFacility } from "./FacilityListContext/useManageFacility";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";
import useIsIphone from "Shared/hooks/useIsIphone";

const ReqDataGrid = (props: any) => {
  const {
    data,
    selectedBox,
    setSelectedBox,
    filterData,
    loadGridData,
    loading,
  } = useManageFacility();

  const searchRef = useRef<any>(null);
  const { t } = useLang();
  const  isMobile = useIsMobile();
  const isIphone = useIsIphone();
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
    if (checked) {
      setSelectedBox(
        data?.gridData?.map((item: any) => item?.FacilityId) || []
      );
    } else {
      setSelectedBox([]);
    }
  };

  return (
    <Box sx={{ height: "auto", width: "100%" }}>
      <div className="table_bordered overflow-hidden">
        <TableContainer
          sx={
             isIphone ? {
               
            } :
            
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
          className="shadow-none"
        >
          <Table
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
          >
            {!props?.tabsInfo ? null : (
              <TableHead>
                <TableRow className="h-35px">
                  <TableCell></TableCell>
                  <TableCell>
                    <label className="form-check form-check-sm form-check-solid">
                      <input
                        id="ViewRequisitionCheckAllCheckBox"
                        className="form-check-input"
                        type="checkbox"
                        onChange={(e) => handleAllSelect(e.target.checked)}
                        checked={selectedBox?.length === props?.rowInfo?.length}
                      />
                    </label>
                  </TableCell>
                  <TableCell sx={{ width: "fit-content" }}>{t("Actions")}</TableCell>
                  {props?.tabsInfo?.map(
                    (tabsDetail: any) =>
                      tabsDetail?.isShowOnUi &&
                      tabsDetail.isShow && (
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
                      )
                  )}
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
                  />
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default React.memo(ReqDataGrid);
