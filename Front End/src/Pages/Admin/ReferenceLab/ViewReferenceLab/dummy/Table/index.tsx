import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import Row from "./Row";
import TableActionNav from "./TableActionNav";
import useLang from './../../../../../../Shared/hooks/useLanguage';
const CustomTablePagination = styled(Pagination)(
  ({ theme }) => `
  & li button{
    width: 36px;
    height: 36px;
    font-family: 'Poppins';
    font-style: normal;
    font-weight: 500;
    font-size: 13px;
    line-height: 20px;
    text-align: center;
    color: #3F4254;
    border: none;
    background: transparent;
    border-radius: 8px;
  }
  & li:nth-child(1) button, & li:nth-child(2) button, & li:nth-last-child(1) button, & li:nth-last-child(2) button {
    background: #F3F6F9;
    border: 0.4px solid #E8EFF7;
    color: ${theme.palette.mode === "dark" ? "#7E8299" : "#7E8299"};
  }
  & li button.Mui-selected{
    background: var(--kt-primary);
    color: #FFFFFF;
    &:hover {
      background: var(--kt-primary-active);

    }
  }
  `
);

export default function ReferenceLabGrid() {
  
  const {t} = useLang()

  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <TableActionNav />
      <div className="card">
        <div className="table-responsive">
          <Box sx={{ height: "auto", width: "100%" }}>
            <TableContainer component={Paper} className="shadow-none">
              <Table
                aria-label="collapsible table"
                className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-1 mb-1"
              >
                <TableHead className="h-50px">
                  <TableRow>
                    <TableCell style={{ width: "100px", minWidth: "100px" }}>
                      {t("Actions")}
                    </TableCell>
                    <TableCell style={{ width: "150px", minWidth: "150px" }}>
                      {t("Lab Name")}
                    </TableCell>
                    <TableCell style={{ width: "250px", minWidth: "250px" }}>
                      {t("Address")}
                    </TableCell>
                    <TableCell style={{ width: "150px", minWidth: "150px" }}>
                      {t("Lab Display Name")}
                    </TableCell>
                    <TableCell style={{ width: "200px", minWidth: "200px" }}>
                      {t("Enter 3 Digits Program")}
                    </TableCell>
                    <TableCell style={{ width: "200px", minWidth: "200px" }}>
                      {t("3 Digits Lab Code")}
                    </TableCell>
                    <TableCell style={{ width: "160px", minWidth: "160px" }}>
                      {t("Enable Reference Id")}
                    </TableCell>
                    <TableCell style={{ width: "120px", minWidth: "120px" }}>
                     {t("Lab Type")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <Row />
                  <Row />
                  <Row />
                  <Row />
                  <Row />
                </TableBody>
              </Table>
            </TableContainer>
            <div className="d-flex justify-content-between mt-4">
              <p className="pagination-total-record">
                {t("Showing 1 to 10 of 18 entries")}
              </p>
              <CustomTablePagination
                count={10}
                variant="outlined"
                shape="rounded"
                showFirstButton
                showLastButton
              />
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
