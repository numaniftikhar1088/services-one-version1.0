import { Box, Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useEffect, useRef, useState } from "react";
import { useBillingDataContext } from "Shared/BillingContext";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import RenderInput from "./RenderInput";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";

const BillDataGrid = (props: any) => {
  const { data, setSelectedBox, filterData, loadDataAllRequisition, loading } =
    useBillingDataContext();
  console.log(props, "propp");
  const { t } = useLang();
  const [currentColumnKey, setCurrentColumnKey] = useState("");
  const [selectAll, setSelectAll] = useState<boolean>(false);

  const searchRef = useRef<any>(null);
  const searchData = (e: any) => {
    e.preventDefault();
    loadDataAllRequisition();
  };

  const sortData = async (tabsDetail: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");
    filterData.sortColumn = tabsDetail?.columnKey;
    filterData.sortDirection = searchRef.current.id;
    await loadDataAllRequisition();
  };

  const handleAllSelect = (checked: boolean) => {
    setSelectAll(checked);
    let idsArr: any = [];
    let idsArr2: any = [];
    console.log(data?.gridData?.data?.data, "76tyguiouiyt789");
    data?.gridData?.data?.data?.forEach((item: any) => {
      idsArr.push(item?.RequisitionOrderID);
      idsArr2.push(item?.RequisitionId);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: idsArr,
          requisitionId: idsArr2,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: [],
          requisitionId: [],
        };
      });
    }
  };

  useEffect(() => {
    setSelectAll(false);
  }, [filterData?.tabId]);

  return (
    <div>
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
              {loading ? null : (
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    {/* <RenderInput2 /> */}

                    {props?.tabsInfo?.map((tabsDetail: any) => (
                      <>
                        {tabsDetail?.isShowOnUi && tabsDetail?.isShow && (
                          <>
                            <TableCell sx={{ width: "max-content" }}>
                              <div className="d-flex justify-content-center align-items-center">
                                <div style={{ width: "max-content" }}>
                                  {tabsDetail?.filterColumnsType && (
                                    <form onSubmit={searchData}>
                                      <RenderInput
                                        tabsDetail={tabsDetail}
                                        currentColumnKey={currentColumnKey}
                                        setCurrentColumnKey={
                                          setCurrentColumnKey
                                        }
                                      />
                                    </form>
                                  )}
                                </div>
                              </div>
                            </TableCell>
                          </>
                        )}
                      </>
                    ))}
                  </TableRow>
                  <TableRow className="h-35px">
                    <TableCell></TableCell>
                    {/* {filterData?.tabId === 6 ? null : ( */}
                    <TableCell>
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          id="BillingRequisitionCheckAllCheckBox"
                          className="form-check-input"
                          checked={selectAll}
                          type="checkbox"
                          onChange={(e) => handleAllSelect(e.target.checked)}
                        />
                      </label>
                    </TableCell>
                    {/* )} */}
                    <TableCell sx={{ width: "fit-content" }}>
                      {t("Actions")}
                    </TableCell>
                    {props?.tabsInfo &&
                      props?.tabsInfo?.map((tabsDetail: any) => (
                        <>
                          {tabsDetail?.isShowOnUi && tabsDetail.isShow && (
                            <>
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
                      loadDataAllRequisition={loadDataAllRequisition}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </div>
  );
};

export default React.memo(BillDataGrid);
