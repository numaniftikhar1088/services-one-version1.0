// Main component for displaying the Qc Level tab, including filter controls and a table of QcLevel data.
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
import React from "react";
import Select from "react-select";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import QcLevelRow, { QcLevelRows } from "./QcLevelRow";

// QcLevel Index component displays filter controls and a table of QC lot pricing data.
const QcLevelIndex = () => {
  const { t } = useLang();
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
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
          <div>
            <StyledDropButton
              id="ManageFacilityBulkAction"
              aria-controls={
                openDrop ? "demo-positioned-menu1" : undefined
              }
              aria-haspopup="true"
              aria-expanded={openDrop ? "true" : undefined}
              onClick={(event) =>
                handleClick(event, "dropdown1")
              }
              className="btn btn-info btn-sm"
            >
              {t("Bulk Action")}
              <span className="svg-icon svg-icon-5 m-0">
                <ArrowBottomIcon />
              </span>
            </StyledDropButton>
            <StyledDropMenu
              id="ManageFacilityExportRecords"
              aria-labelledby="demo-positioned-button1"
              anchorEl={anchorEl.dropdown1}
              open={Boolean(anchorEl.dropdown1)}
              onClose={() => handleClose("dropdown1")}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <PermissionComponent
                moduleName="Facility"
                pageName="Manage Facility"
                permissionIdentifier="Archived"
              >
                <MenuItem
                  id="ManageFacility_Archived"
                  onClick={() => {
                    handleClose("dropdown1");
                  }}
                  className="w-125px"
                >
                  {t("Archived")}
                </MenuItem>
              </PermissionComponent>
            </StyledDropMenu>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            aria-controls="Search"
            className="btn btn-info btn-sm fw-500"
          >
            {t("Search")}
          </button>
          <button
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id="kt_reset"
            type="button"
          >
            <span>
              <span>{t("Reset")}</span>
            </span>
          </button>
        </div>
      </div>

      {/* Table displaying QC lot pricing data */}
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
                    <TableCell>
                      <input
                        type="text"
                        name="displayText"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        menuPortalTarget={document.body}
                        theme={(theme: any) => styles(theme)}
                        name="trainingAidsCategory"
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>{t("Actions")}</TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("QC Level")}
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
                          {t("QC Instrument")}
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
                  {/* Render each QcLevel row as a table row */}
                  {QcLevelRows.map((row, idx) => (
                    <QcLevelRow key={row.instrument + idx} data={row} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
};

export default QcLevelIndex;
