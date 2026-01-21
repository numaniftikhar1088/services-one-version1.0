import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";

interface PanelCodeProps {
  dataArray: any;
}
const PanelCode: React.FC<PanelCodeProps> = ({ dataArray }) => {
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
          component={Paper}
          className="shadow-none"
        >
          <Table
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
          >
            <TableHead className="h-40px">
              <TableRow>
                <TableCell className="min-w-50px w-50px">
                  Icd 10 codes
                </TableCell>
                <TableCell className="min-w-500px w-0px">
                  Descriptions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dataArray.map((item: any, index: any) => (
                <TableRow key={index}>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
};

export default PanelCode;
