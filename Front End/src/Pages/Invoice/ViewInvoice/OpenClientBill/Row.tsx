import {
  Box,
  Link,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import Select from "react-select";
import BootstrapModal from "react-bootstrap/Modal";
import { reactSelectSMStyle, styles } from "Utils/Common";
import LoadButton from "Shared/Common/LoadButton";
import AddMoreAccession from "./AddMoreAccessions";

const OpenClientRow = () => {
  const { t } = useLang();
  const [openalert, setOpenAlert] = useState(false);
  const [partialPAyment, setPartialPAyment] = useState(false);
  const [openClientBill, setOpenClientBill] = useState(false);
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
  const handleCloseAlert1 = () => setPartialPAyment(false);
  const handleClickOpen1 = () => {
    handleClose("dropdown2");
    setPartialPAyment(true);
  };
  const handleCloseAlert2 = () => setOpenClientBill(false);
  const handleClickOpen2 = () => {
    handleClose("dropdown2");
    setOpenClientBill(true);
  };
  const [moreAccessions, setMoreAccessions] = useState(false);
  const handleCloseAccession = () => {
    setMoreAccessions(false);
    setOpenClientBill(false);
  };
  const handleClickOpeAccession = () => {
    handleClose("dropdown2");
    setMoreAccessions(true);
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
              <MenuItem className="w-auto" onClick={() => handleClickOpen2()}>
                <i className="fa fa-edit text-primary mr-2 w-20px" />
                {t("Edit Invoice")}
              </MenuItem>
              <MenuItem className="w-auto" onClick={() => handleClickOpen()}>
                <img
                  className="mr-2 w-20px"
                  src={`${
                    process.env.PUBLIC_URL + "/media/menu-svg/Billed.svg"
                  }`}
                />
                {t("Mark Payment Received")}
              </MenuItem>
              <MenuItem className="w-auto">
                <img
                  className="mr-2 w-20px"
                  src={`${
                    process.env.PUBLIC_URL + "/media/menu-svg/sendtoADSC.svg"
                  }`}
                />

                {t("Resend Invoice")}
              </MenuItem>
              <MenuItem className="w-auto">
                <img
                  className="mr-2 w-20px"
                  src={`${
                    process.env.PUBLIC_URL +
                    "/media/menu-svg/CopyPaymentLink.svg"
                  }`}
                />
                {t("Copy Payment Link")}
              </MenuItem>
              <MenuItem className="w-auto" onClick={() => handleClickOpen1()}>
                <img
                  className="mr-2 w-20px"
                  src={`${
                    process.env.PUBLIC_URL +
                    "/media/menu-svg/ArrowLeftRight.svg"
                  }`}
                />
                {t("Partial Payment")}
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
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>Daily</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">CB195</div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>Open-Unpaid</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>04/25/2025 7:40 AM</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>315</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$130.00</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$0.00</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$130.00</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$0.00</div>
          </div>
        </TableCell>
      </TableRow>
      <BootstrapModal
        BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Payment received")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <div>
            <h4>{t("Please Select Payment Mode")}</h4>
            <div className="d-flex gap-2">
              <input type="radio" />
              <p className="m-0">Check Payment</p>
            </div>
            <div className="d-flex gap-2">
              <input type="radio" />
              <p className="m-0">Wire Transfer</p>
            </div>
            <div className="d-flex gap-2">
              <input type="radio" />
              <p className="m-0">Credit Card</p>
            </div>
          </div>
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`ConfirmPaymentModalCancel`}
            type="button"
            className="btn btn-danger"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ConfirmPaymentModalConfirm`}
            type="button"
            className="btn btn-success m-2"
            // onClick={() => handleDelete(row.id)}
          >
            {t("Save")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        BootstrapModal
        show={partialPAyment}
        onHide={handleCloseAlert1}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Partial Payment")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <div className="fv-row mb-4">
            <label className="  mb-2 fw-500">
              {t("Please enther the partial payment")}
            </label>
            <input
              type="text"
              name="FacilityName"
              className="form-control bg-transparent"
              placeholder="$1,000,000.0"
            />
          </div>
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`PartialPaymentModalCancel`}
            type="button"
            className="btn btn-danger"
            onClick={handleCloseAlert1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`PartialPaymentModalConfirm`}
            type="button"
            className="btn btn-success m-2"
            // onClick={() => handleDelete(row.id)}
          >
            {t("Save")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        size="lg"
        BootstrapModal
        show={openClientBill}
        onHide={handleCloseAlert2}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Edit Client Bill Invoice")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="pt-0">
          <div className="row">
            <div className="col-12">
              <div>
                <button
                  id={`PartialPaymentModalConfirm`}
                  type="button"
                  className="btn btn-success m-2"
                >
                  {t("Save")}
                </button>
              </div>
            </div>
            <div className="row">
              <div className="col-6 d-flex gap-2 align-self-center">
                <h6>Facility Name:</h6>
                <p>Truemedit Test Facility (SQA)+ @ %</p>
              </div>
              <div className="col-6">
                <div className="fv-row mb-4">
                  <label className="  mb-2 fw-500">{t("Invoice Type")}</label>
                  <Select
                    menuPortalTarget={document.body}
                    theme={(theme: any) => styles(theme)}
                    name="trainingAidsCategory"
                    styles={reactSelectSMStyle}
                  />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-3 d-flex justify-content-between">
                <h6>Invoice#:</h6>
                <p>CB198</p>
              </div>

              <div className="col-3 d-flex justify-content-between">
                <h6>Facility ID:</h6>
                <p>1981</p>
              </div>

              <div className="col-3 d-flex justify-content-between">
                <h6>Billing Date:</h6>
                <p>5/2/2025</p>
              </div>

              <div className="col-3 d-flex justify-content-between">
                <h6>Totel Units:</h6>
                <p>1</p>
              </div>
              <div className="col-3 d-flex justify-content-between">
                <h6>Facility Address:</h6>
                <p>Test</p>
              </div>
            </div>
          </div>
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
                              {t("Test Code")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Test Description")}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Amount")}
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
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>
          <div
            className="row pt-3"
            style={{
              backgroundColor: "#E9EEF4",
              borderRadius: "7px",
              margin: "1px",
            }}
          >
            <div className="col-9">
              <LoadButton
                className="btn btn-sm fw-bold btn-primary"
                btnText={t("Add More Accessions")}
                onClick={() => handleClickOpeAccession()}
                loadingText=""
              />
            </div>
            <div className="col-3">
              <div className="d-flex gap-5 justify-content-between">
                <h6>Total Mount:</h6>
                <p>$0.00</p>
              </div>
              <div className="d-flex gap-5 justify-content-between">
                <h6>Mount Due:</h6>
                <p>$0.00</p>
              </div>
              <div className="d-flex gap-5 justify-content-between">
                <h6>Total Payable:</h6>
                <p>$0.00</p>
              </div>
            </div>
          </div>
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0"></BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        size="lg"
        BootstrapModal
        show={moreAccessions}
        onHide={handleCloseAccession}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Add Accessions")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="pt-0">
          <AddMoreAccession handleCloseAccession={handleCloseAccession} />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0"></BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default OpenClientRow;
