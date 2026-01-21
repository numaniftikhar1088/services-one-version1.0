import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Row from "./Row";
import { useEffect, useRef, useState } from "react";
import $ from "jquery";

export const SampleRow = [
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
  {
    id: 1,
    name: "Alice",
    grade: "A",
    age: "3",
    class: "4",
    school: "abc",
    state: "arizone",
    country: "us",
  },
];

const SampleTable = () => {
  return (
    <div className="app-content flex-column-fluid">
      <div className="app-container container-fluid">
        <div className="card">
          {
            <Box sx={{ width: "100%" }}>
              <div className="table_bordered overflow-hidden">
                <TableContainer
                  sx={{
                    maxHeight: 800,
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
                    <TableHead>
                      <TableRow className="h-50px">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                      </TableRow>

                      <TableRow className="h-35px">
                        <TableCell />
                        <TableCell className="min-w-50px">Demo</TableCell>
                        <TableCell>Demo</TableCell>
                        <TableCell>Demo</TableCell>
                        <TableCell>Demo</TableCell>
                        <TableCell>Demo</TableCell>
                        <TableCell>Demo</TableCell>
                        <TableCell>Demo</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {SampleRow.map((i: any) => (
                        <>
                          {" "}
                          <Row i={i} />
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          }
        </div>
      </div>
    </div>
  );
};

export default SampleTable;
