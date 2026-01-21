import { Box, Link, MenuItem, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import BootstrapModal from "react-bootstrap/Modal";

const CloseBulkPurchaseRow = () => {
  const { t } = useLang();
  const [openalert, setOpenAlert] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = () => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };
  return (
    <>
      <TableRow className="h-30px">
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <label className="form-check form-check-sm form-check-solid">
              <input className="form-check-input" type="checkbox" />
            </label>
          </div>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id="demo-positioned-button"
              aria-haspopup="true"
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
              onClick={(event) => handleClick(event, "dropdown2")}
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl.dropdown2}
              open={Boolean(anchorEl.dropdown2)}
              onClose={() => handleClose("dropdown2")}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <MenuItem className="w-auto" onClick={() => handleClickOpen()}>
                <i className="fa fa-eye text-warning mr-2 w-20px"></i>
                {t("View Stripe Receipt")}
              </MenuItem>
              <MenuItem className="w-auto">
                <img
                  className="mr-2 w-20px"
                  src={`${
                    process.env.PUBLIC_URL + "/media/menu-svg/sendtoADSC.svg"
                  }`}
                />

                {t("Send Invoice")}
              </MenuItem>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">
            1991 | Truemedit Test Facility (SOS) + @ %
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>223</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">PB223</div>
        </TableCell>

        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>1</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$0.00</div>
          </div>
        </TableCell>
      </TableRow>
      <BootstrapModal
              size="xl"
              BootstrapModal
              show={openalert}
              onHide={handleCloseAlert}
              backdrop="static"
              keyboard={false}
            >
              <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
                <h4>{t("Receipt from Stripe")}</h4>
              </BootstrapModal.Header>
              <BootstrapModal.Body>
                <div className="card">
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
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                        >
                          <TableHead>
                            <TableRow className="h-30px">
                              <TableCell>{t("Accession #")}</TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Facility Name")}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Paid Amount")}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Paid Date")}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Cardholder's Name")}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Card LAst 4 Digits")}
                                  </div>
                                </div>
                              </TableCell>
      
                              <TableCell>
                                <div className="d-flex justify-content-between cursor-pointer">
                                  <div style={{ width: "max-content" }}>
                                    {t("Payment Discription")}
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </TableHead>
      
                          <TableBody>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                            <TableCell className="w-50px"></TableCell>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </Box>
                </div>
              </BootstrapModal.Body>
              <BootstrapModal.Footer className="p-0 justify-content-center">
                <h4>{t("If you have any questions, contect us at ")}</h4>
                <h4 className="text-success">{t("help@precisionpoint.com")}</h4>
              </BootstrapModal.Footer>
            </BootstrapModal>
    </>
  );
};

export default CloseBulkPurchaseRow;
