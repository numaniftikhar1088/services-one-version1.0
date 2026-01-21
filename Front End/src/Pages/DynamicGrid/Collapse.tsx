import {
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Table from "@mui/material/Table";
import { useEffect, useState } from "react";
import PatientService from "../../Services/PatientService/PatientService";
import { Loader } from "../../Shared/Common/Loader";
import NoRecord from "../../Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";

interface CollapseTable {
  patientId: number;
  expandableColumnsHeader: any;
}

function CollapseTable({
  patientId,
  expandableColumnsHeader,
}: CollapseTable) {
  const { t } = useLang();
  const [expandedTbData, setExpandedTbData] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  const getPatientReqOrder = async () => {
    let response = await PatientService.getDynamicGridExpand(patientId);
    if (response?.data?.data) {
      setExpandedTbData(response?.data?.data);
      setLoading(false);
    }
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };

  useEffect(() => {
    getPatientReqOrder();
  }, []);

  return (
    <div
      id="kt_app_content_container"
      className="app-container container-fluid"
    >
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
            stickyHeader
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
          >
            <TableHead
              className="h-35px"
              style={{ position: "relative", zIndex: 1 }}
            >
              <TableRow>
                {expandableColumnsHeader?.map((column: any) => (
                  <TableCell className="min-w-200px">
                    {column.isShowOnUi && column.isExpandData
                      ? t(column.columnLabel)
                      : null}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableCell colSpan={5}>
                  <Loader />
                </TableCell>
              ) : !expandedTbData.length ? (
                <NoRecord
                  message={"No Open Requisition Orders Found For This Patient."}
                />
              ) : (
                expandedTbData?.map((item: any) => (
                  <TableRow>
                    {expandableColumnsHeader?.map((column: any) => (
                      <TableCell className="min-w-200px">
                        {column?.columnKey === "reqMaster.RequisitionID" ? (
                          <button
                          id={`PatientDemoGraphicOrderView`}
                            className="btn btn-warning btn-sm fw-500 text-white"
                            onClick={() => {
                              openInNewTab(
                                `/OrderView/${btoa(item?.RequisitionId)}/${btoa(
                                  item?.RequisitionOrderID
                                )}`
                              );
                            }}
                          >
                            {t("View Detail")}
                          </button>
                        ) : item[column?.columnKey] ? (
                          item[column?.columnKey]
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default CollapseTable;
