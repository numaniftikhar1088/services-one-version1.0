import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React from "react";
import useLang from "Shared/hooks/useLanguage";
interface Props {
  id: any;
  row: any;
}
const ReportingRuleInfo: React.FC<Props> = ({ id, row }) => {
  const { t } = useLang();
  console.log(row, "rowrow");

  // const [reportingRule, setReportingRule] = useState<any>([])
  // const [loading, setLoading] = useState<any>([])

  // const loadData = () => {

  //   PanelMappingService.GetPanelInfoById(id).then((res: AxiosResponse) => {
  //     setReportingRule(res?.data?.data)
  //     setLoading(false)

  //   })
  // }
  // React.useEffect(() => {
  //   loadData()
  // }, [])
  return (
    <div className="card shadow-sm mb-3 rounded border border-info">
      <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-info min-h-35px">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <h6 className="text-info m-0">{t("Reporting Rule Info")}</h6>
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
                    <TableCell
                      id={`PanelMapingReportingRuleName`}
                      className="min-w-150px"
                    >
                      {t("Reporting Rule Name")}
                    </TableCell>
                    <TableCell
                      id={`PanelMapingAgeRange`}
                      className="min-w-60px"
                    >
                      {t("Age Range")}
                    </TableCell>
                    <TableCell
                      id={`PanelMapingNagative`}
                      className="min-w-60px"
                    >
                      {t("Negative")}
                    </TableCell>
                    <TableCell id={`PanelMapingLow`} className="min-w-60px">
                      {t("Low")}
                    </TableCell>
                    <TableCell id={`PanelMapingMedium`} className="min-w-60px">
                      {t("Medium")}
                    </TableCell>
                    <TableCell id={`PanelMapingHigh`} className="min-w-60px">
                      {t("High")}
                    </TableCell>
                    <TableCell
                      id={`PanelMapingCriticalHigh`}
                      className="min-w-60px"
                    >
                      {t("Critical High")}
                    </TableCell>
                    <TableCell
                      id={`PanelMapingAmpScore`}
                      className="min-w-60px"
                    >
                      {t("Amp Score")}
                    </TableCell>
                    <TableCell id={`PanelMapingCqConf`} className="min-w-60px">
                      {t("Cq conf")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {
                    // loading ? (
                    //   <TableCell colSpan={5} className="">
                    //     <Loader />
                    //   </TableCell>
                    // ) : (
                    row?.reportingRuleInfos?.map((item: any) => (
                      <TableRow>
                        {/* <TableCell className="text-center"> </TableCell> */}
                        <TableCell id={`ReportingRuleName_${row.id}`}>
                          {item?.reportingRuleName}
                        </TableCell>
                        <TableCell id={`AgeRange_${row.id}`}>
                          {item?.ageRange}
                        </TableCell>
                        <TableCell id={`Negative_${row.id}`}>
                          {item?.negative}
                        </TableCell>
                        <TableCell id={`Low_${row.id}`}>{item?.low}</TableCell>
                        <TableCell id={`Medium_${row.id}`}>
                          {item?.medium}
                        </TableCell>
                        <TableCell id={`High_${row.id}`}>
                          {item?.high}
                        </TableCell>
                        <TableCell id={`CriticalHigh_${row.id}`}>
                          {item?.criticalHigh}
                        </TableCell>
                        <TableCell id={`AmpScore_${row.id}`}>
                          {item?.ampScore}
                        </TableCell>
                        <TableCell id={`CqConf_${row.id}`}>
                          {item?.cqConf}
                        </TableCell>
                      </TableRow>
                    ))
                    // )
                  }
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </div>
  );
};
export default ReportingRuleInfo;
