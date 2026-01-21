import {
  Box,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Select from "react-select";
import React, { useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "Utils/Common";
import {
  ArrowDown,
  ArrowUp,
  ExportAllRecords,
  ExportIcon,
  SelectedRecords,
} from "Shared/Icons";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import CloseBulkPurchaseRow from "./Row";

const CloseBulkPurchase = () => {
  const { t } = useLang();
  const [addRow, setAddRow] = useState(false);
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  return (
    <>
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              className="form-select w-100px h-33px rounded"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              //   value={pageSize}
              //   onChange={(e) => setPageSize(parseInt(e.target.value))}
              data-placeholder={t("Select option")}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <div>
              <StyledDropButton
                id="BillingRequisitionExportRecord"
                aria-controls={openDrop ? "demo-positioned-menu2" : undefined}
                aria-haspopup="true"
                aria-expanded={openDrop ? "true" : undefined}
                onClick={(event) => handleClick(event, "dropdown2")}
                className="btn btn-excle btn-sm"
              >
                <ExportIcon />
                <span className="svg-icon svg-icon-5 m-0">
                  <ArrowBottomIcon />
                </span>
              </StyledDropButton>
              <StyledDropMenu
                id="BillingRequisitionExportRecordButton"
                aria-labelledby="demo-positioned-button2"
                anchorEl={anchorEl.dropdown2}
                open={Boolean(anchorEl.dropdown2)}
                onClose={() => handleCloseDropDown("dropdown2")}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem className=" p-0">
                  <a
                    className=" p-0 text-dark"
                    id="BillingRequisitionExportAllRecord"
                    onClick={() => {
                      handleCloseDropDown("dropdown2");
                    }}
                  >
                    <ExportAllRecords />
                    {t("Export All Records")}
                  </a>
                </MenuItem>

                <MenuItem className=" p-0">
                  <a
                    className=" p-0 text-dark"
                    id="BillingRequisitionExportSelectedRecord"
                    onClick={() => {
                      handleCloseDropDown("dropdown2");
                    }}
                  >
                    <SelectedRecords />
                    {t(" Export Selected Records")}
                  </a>
                </MenuItem>
              </StyledDropMenu>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            {t("Search")}
          </button>
          <button
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id="kt_reset"
            type="button"
          >
            <span>{t("Reset")}</span>
          </button>
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

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
                  <TableRow className="h-40px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell className="w-50px"></TableCell>
                    <TableCell>
                      <Select
                        menuPortalTarget={document.body}
                        theme={(theme: any) => styles(theme)}
                        name="trainingAidsCategory"
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="text"
                        name="displayText"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                      />
                    </TableCell>

                    <TableCell>
                      <input
                        type="text"
                        name="displayText"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                      />
                    </TableCell>
                    <TableCell className="w-50px"></TableCell>
                    <TableCell className="w-50px"></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>
                      <label className="form-check form-check-sm form-check-solid">
                        <input className="form-check-input" type="checkbox" />
                      </label>
                    </TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Facility Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Facility ID")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Invoice ID")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Total Units")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Credit Available")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {/* {addRow ? <SpecialPricingAdd setAddRow={setAddRow} /> : null} */}
                  <CloseBulkPurchaseRow />
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
};

export default CloseBulkPurchase;
