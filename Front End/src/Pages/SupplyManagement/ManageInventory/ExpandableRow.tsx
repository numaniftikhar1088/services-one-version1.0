import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Loader } from "../../../Shared/Common/Loader";
import NoRecord from "../../../Shared/Common/NoRecord";
import useLang from "Shared/hooks/useLanguage";

function ExpandableRow(props: { facilityBalance: any; loading: boolean }) {
  const { facilityBalance, loading } = props;

  const { t } = useLang();

  return (
    <div className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
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
                // component={Paper}
                className="shadow-none"
                // sx={{ maxHeight: 'calc(100vh - 100px)' }}
              >
                <Table
                  // stickyHeader
                  aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                >
                  <TableHead style={{ zIndex: 1 }}>
                    <TableRow className="h-30px">
                      <TableCell>{t("Facility")}</TableCell>
                      <TableCell>{t("Balance")}</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableCell colSpan={6}>
                        <Loader />
                      </TableCell>
                    ) : facilityBalance?.length ? (
                      facilityBalance?.map((data: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell
                            id={`ManageInventoryExpand_${data.FacilityName}${
                              index + 1
                            }`}
                          >
                            {data?.facilityName}
                          </TableCell>
                          <TableCell
                            id={`ManageInventory_${data.quantityBalance}${
                              index + 1
                            }`}
                          >
                            {data?.quantityBalance}
                          </TableCell>
                        </TableRow>
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
      </div>
    </div>
  );
}

export default ExpandableRow;
