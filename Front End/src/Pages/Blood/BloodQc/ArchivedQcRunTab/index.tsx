// File: src/Pages/Blood/BloodQc/ArchivedQcRunTab/index.tsx
// Description: Renders the Archived QC Run tab, including filters and a table of archived QC runs.

import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import ArchivedQcRunRow, { ArchivedQcRunRows } from "./Row";


const ArchivedQcRun = () => {
  const { t } = useLang();

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
              <option value="100">100</option>
            </select>
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
      {/* Table displaying archived QC run data */}
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
                    <TableCell className="w-50px">

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
                        id={`TrainingDocumentTrainingAidSearchUploadedDate`}
                        type="date"
                        name="uploadDate"
                        className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                      />
                    </TableCell>
                    <TableCell className="w-50px">

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
                  </TableRow>
                  <TableRow className="h-30px">
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
                        <div style={{ width: "max-content" }}>
                          {t("Instrument")}
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
                        <div style={{ width: "max-content" }}>{t("Test Name")}</div>

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
                  {/* Render each archived QC run as a table row */}
                  {ArchivedQcRunRows.map((row) =>
                    <ArchivedQcRunRow data={row} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
    </>
  );
};

export default ArchivedQcRun;
