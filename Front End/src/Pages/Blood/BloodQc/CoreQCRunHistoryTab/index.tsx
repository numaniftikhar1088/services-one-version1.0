// Main component for displaying the Blood QC Run History tab, including filter controls and a table of QC run history data.
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
import PermissionComponent, { AnyPermission } from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import BloodQcRunHistoryRow, { CoreQCRunHistoryRowData } from "./CoreQCRunHistoryRow";

// BloodQcRunHistory component displays filter controls and a table of Blood QC run history data.
const CoreQcRunHistory = () => {
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
              data-placeholder={t("Select option")}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">2000</option>
            </select>
          </div>
          <div className="border-0 d-flex justify-content-sm-start">
            <div className="d-flex gap-1 gap-lg-1">
              <div>
                <AnyPermission
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifiers={[
                    "ExportAllRecords",
                    "ExportSelectedRecords",
                  ]}
                >
                  <StyledDropButton
                    id="ManageFacilityExportRecordButton"
                    aria-controls={
                      openDrop ? "demo-positioned-menu2" : undefined
                    }
                    aria-haspopup="true"
                    aria-expanded={openDrop ? "true" : undefined}
                    onClick={(event) =>
                      handleClick(event, "dropdown2")
                    }
                    className="btn btn-excle btn-sm"
                  >
                    <i
                      style={{
                        color: "white",
                        fontSize: "20px",
                        paddingLeft: "2px",
                      }}
                      className="fa"
                    >
                      &#xf1c3;
                    </i>
                    <span className="svg-icon svg-icon-5 m-0">
                      <ArrowBottomIcon />
                    </span>
                  </StyledDropButton>
                  <StyledDropMenu
                    aria-labelledby="demo-positioned-button2"
                    anchorEl={anchorEl.dropdown2}
                    open={Boolean(anchorEl.dropdown2)}
                    onClose={() => handleClose("dropdown2")}
                    anchorOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}
                    transformOrigin={{
                      vertical: "top",
                      horizontal: "left",
                    }}>
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="ExportAllRecords"
                    >
                      <MenuItem
                        id="ManageFacility_ExportAllRecords"
                        onClick={() => {
                          handleClose("dropdown2");
                        }}
                      >
                        {t("Export All Records")}
                      </MenuItem>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="ExportSelectedRecords"
                    >
                      <MenuItem
                        id="ManageFacility_ExportSelectedRecords"
                        onClick={() => {
                          handleClose("dropdown2");
                        }}
                      >
                        {t("Export Selected Records")}
                      </MenuItem>
                    </PermissionComponent>
                  </StyledDropMenu>
                </AnyPermission>
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

      {/* Table displaying Blood QC run history data */}
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
                    <TableCell className="w-10px"></TableCell>
                    <TableCell > </TableCell>
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
                        id={`TrainingDocumentTrainingAidSearchUploadedDate`}
                        type="date"
                        name="uploadDate"
                        className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
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
                    <TableCell>
                      <Select
                        menuPortalTarget={document.body}
                        theme={(theme: any) => styles(theme)}
                        name="trainingAidsCategory"
                        styles={reactSelectSMStyle}
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
                    <TableCell>
                      <input
                        type="text"
                        name="displayText"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t("Search ....")}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell>
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          className="form-check-input"
                          type="checkbox"
                        />
                      </label>
                    </TableCell>
                    <TableCell>{t("Actions")}</TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Run #")}
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
                          {t("Run Date")}
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
                          {t("Run Time")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>{t("Instrument")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp />
                          <ArrowDown />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("QC Group Name")}
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
                          {t("Test Name")}
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
                          {t("QC Result")}
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
                          {t("QC Range")}
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
                          {t("QC Lot")}
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
                  {/* Render each Blood QC run history as a table row */}
                  {CoreQCRunHistoryRowData.map((row, idx) => (
                    <BloodQcRunHistoryRow key={row.runNumber} data={row} />
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

export default CoreQcRunHistory;
