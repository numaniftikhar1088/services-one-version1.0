import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import AssayDataService from "../../../../../Services/InfectiousDisease/AssayDataService";
import { Loader } from "../../../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";
interface Props {
  id: any;
}
const PanelAndReportingRule: React.FC<Props> = ({ id }) => {
  const { t } = useLang();

  const [panelAndReportingRule, setPanelAndReportingRule] = useState<any>([]);
  console.log(panelAndReportingRule, "panelAndReportingRule");

  const [loading, setLoading] = useState<any>([]);

  const loadData = () => {
    AssayDataService.GetPanelsAndReportingRulesById(id).then(
      (res: AxiosResponse) => {
        setPanelAndReportingRule(res?.data?.data);
        setLoading(false);
      }
    );
  };
  React.useEffect(() => {
    loadData();
  }, []);
  return (
    <div className="card shadow-sm mb-3 rounded border border-info">
      <div className="card-header min-h-35px d-flex justify-content-between align-items-center rounded bg-light-info">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <h6 className="text-info m-0">
            {t("Panel And Reporting Rule Info")}
          </h6>
        </div>
      </div>

      <div className="card-body py-md-4 py-3">
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
              // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead className="h-35px">
                  <TableRow>
                    <TableCell className="min-w-200px">
                      {t("Panel Name")}
                    </TableCell>
                    <TableCell className="min-w-200px">
                      {t("Reporting Rule Name")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={2} className="">
                      <Loader />
                    </TableCell>
                  ) : (
                    panelAndReportingRule?.map((item: any, index: any) => (
                      <TableRow>
                        <TableCell id={`AssayDataPanelName_${index + 1}`}>
                          {item?.panelName}
                        </TableCell>
                        <TableCell id={`AssayDataRuleName_${index + 1}`}>
                          {item?.ruleName}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </div>
  );
};
export default PanelAndReportingRule;
