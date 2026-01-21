import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper, Table } from "@mui/material";

const ICDPanelTable = ({ fieldsData }: any) => {
  return (
    <>
      {" "}
      <>
        <h6 className="text-primary">Code(s)</h6>
        <Box
          sx={{
            height: "auto",
            width: "100%",
          }}
        >
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={{
                maxHeight: "calc(100vh - 100px)",
                "&::-webkit-scrollbar": {
                  width: 7,
                },
                "&::-webkit-scrollbar-track": {
                  backgroundColor: "var(--kt-dark)",
                },
                "&:hover": {
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "var(--kt-dark)",
                    borderRadius: 2,
                  },
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "var(--kt-dark)",
                  borderRadius: 2,
                },
              }}
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
              >
                <TableHead className="h-40px">
                  <TableRow>
                    <TableCell className="min-w-50px w-50px">Code</TableCell>
                    <TableCell className="min-w-150px w-150px">
                      Description
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fieldsData?.fieldValue.map((item: any) => (
                    <TableRow
                      sx={{
                        "& > *": {
                          borderBottom: "unset",
                        },
                      }}
                    >
                      <TableCell>
                        <span className="fw-bold">{item?.Code}</span>
                      </TableCell>
                      <TableCell>
                        <span className="fw-bold">{item?.Description}</span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </>
    </>
  );
};

export default ICDPanelTable;
