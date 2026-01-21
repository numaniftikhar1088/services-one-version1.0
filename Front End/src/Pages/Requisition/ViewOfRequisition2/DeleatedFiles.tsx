import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";
const DeleatedFiles = () => {
  return (
    <>
      <Box sx={{ height: "auto", width: "100%" }}>
        <div className="table_bordered overflow-hidden">
          <TableContainer
            sx={{
              maxHeight: 'calc(100vh - 100px)',
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
              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
            >
              <TableHead className="h-40px">
                <TableRow>
                  <TableCell className="min-w-150px w-150px">
                    Restore Files
                  </TableCell>
                  <TableCell className="min-w-450px w-450px">Files</TableCell>
                  <TableCell className="min-w-150px w-150px">
                    Document Type
                  </TableCell>
                  <TableCell className="min-w-150px w-150px">
                    Date & Time
                  </TableCell>
                  <TableCell className="min-w-150px w-150px">
                    Deleted Notes
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell className="text-center"></TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
    </>
  );
};

export default DeleatedFiles;
