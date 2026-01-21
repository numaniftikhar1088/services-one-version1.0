import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Loader } from "../../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";

function ExpandableRow(props: { facilityBalance: any; loading: boolean }) {
  const { facilityBalance, loading } = props;

  const { t } = useLang();

  if (loading) {
    return (
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
            className="shadow-none"
          >
            <Table
              aria-label="loading table"
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
            >
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Loader />
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    );
  }

  if (!facilityBalance?.length) {
    return (
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="text-center d-flex align-items-center gap-2 justify-content-center">
          <i className="bi bi-inbox h1 m-0"></i>
          <span className="fw-bolder">{t("No data found for this table")}</span>
        </div>
      </Box>
    );
  }

  // Split the array into two halves
  const half = Math.ceil(facilityBalance.length / 2);
  const firstHalf = facilityBalance.slice(0, half);
  const secondHalf = facilityBalance.slice(half);

  return (
    <div className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
          <Box sx={{ height: "auto", width: "100%" }}>
            <div
              style={{
                display: facilityBalance.length > 1 ? "flex" : "block",
                gap: "20px",
              }}
            >
              <div className="table_bordered overflow-hidden w-50">
                {/* First table */}
                <TableContainer
                  sx={{
                    maxHeight: "calc(100vh - 100px)",
                    flex: 1,
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
                    aria-label="facility balance first half"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    stickyHeader={false}
                  >
                    <TableHead style={{ zIndex: 1 }}>
                      <TableRow className="h-30px">
                        <TableCell>{t("Item Name")}</TableCell>
                        <TableCell style={{ width: "80px", minWidth: "80px" }}>
                          {t("Balance")}
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {firstHalf.map((data: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            id={`FacilityInventoryExpand_${data.itemId}${index + 1}`}
                          >
                            {data?.itemName}
                          </TableCell>
                          <TableCell
                            id={`FacilityInventory_${data.itemId}${index + 1}`}
                          >
                            {data?.balance}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>

              {/* Second table - render only if length > 1 */}
              {facilityBalance.length > 1 && (
                <div className="table_bordered overflow-hidden w-50">
                  <TableContainer
                    sx={{
                      maxHeight: "calc(100vh - 100px)",
                      flex: 1,
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
                      aria-label="facility balance second half"
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      stickyHeader={false}
                    >
                      <TableHead style={{ zIndex: 1 }}>
                        <TableRow className="h-30px">
                          <TableCell>{t("Item Name")}</TableCell>
                          <TableCell
                            style={{ width: "80px", minWidth: "80px" }}
                          >
                            {t("Balance")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {secondHalf.map((data: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell
                              id={`FacilityInventoryExpand_${data.itemId}${
                                half + index + 1
                              }`}
                            >
                              {data?.itemName}
                            </TableCell>
                            <TableCell
                              id={`FacilityInventory_${data.itemId}${
                                half + index + 1
                              }`}
                            >
                              {data?.balance}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              )}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default ExpandableRow;
