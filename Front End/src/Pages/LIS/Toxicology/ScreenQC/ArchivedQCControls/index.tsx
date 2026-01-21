import {
  Box,
  MenuItem,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import { Table } from "react-bootstrap";
import usePagination from "Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import Row from "./Row";
import { TBL_HEADERS } from "./tableHeaders";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";

function ArchivedQCControls() {
  const [rows, setRows] = useState<any[]>([
    {
      instrument: "AU680-1",
      drugClass: "THC (Cannabinoids)",
      specimenType: "Oral Fluid",
      qcLevel: "Level 1",
      qcResult: 0,
      referenceRange: "20-96",
    },
    {
      instrument: "AU680-1",
      drugClass: "PCP",
      specimenType: "Oral Fluid",
      qcLevel: "Level 1",
      qcResult: 0,
      referenceRange: "20-96",
    },
    {
      instrument: "AU680-1",
      drugClass: "Oxycodone",
      specimenType: "Oral Fluid",
      qcLevel: "Level 2",
      qcResult: 0,
      percentage: "58%",
    },
    {
      instrument: "AU680-1",
      drugClass: "Opiates",
      specimenType: "Oral Fluid",
      qcLevel: "Level 1",
      qcResult: 0,
      referenceRange: "20-60",
    },
    {
      instrument: "AU680-1",
      drugClass: "Methamphetamine",
      specimenType: "Oral Fluid",
      qcLevel: "Level 1",
      qcResult: 0,
    },
  ]);

  const [anchorEl, setAnchorEl] = useState({
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

  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
  } = usePagination();

  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  return (
    <div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">Records</span>
            <select
              id={`WorkflowStatusRecords`}
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="50" selected>
                50
              </option>
              <option value="100">100</option>
            </select>
          </div>
          <StyledDropButton
            id={`BloodResultDataBulkAction`}
            aria-controls={openDrop ? "demo-positioned-menu1" : undefined}
            aria-haspopup="true"
            aria-expanded={openDrop ? "true" : undefined}
            onClick={(event: any) => handleClick(event, "dropdown1")}
            style={{ marginLeft: "10px" }}
            className="btn btn-info btn-sm"
          >
            Bulk Action
            <span className="svg-icon svg-icon-5 m-0">
              <ArrowBottomIcon />
            </span>
          </StyledDropButton>
          <StyledDropMenu
            id={`BloodResultDataBulkActionMenu`}
            aria-labelledby="demo-positioned-button1"
            anchorEl={anchorEl.dropdown1}
            open={Boolean(anchorEl.dropdown1)}
            onClose={() => handleClose1("dropdown1")}
            sx={{
              padding: 0,
            }}
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
                id={`BloodResultDataBulkReport`}
                className="w-100 text-dark"
                onClick={() => {
                  handleClose1("dropdown1");
                }}
              >
                Archived
              </a>
            </MenuItem>
          </StyledDropMenu>
        </div>
        <div className="d-flex align-items-center gap-2 ">
          <button
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            Search
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`WorkflowStatusReset`}
          >
            <span>
              <span>Reset</span>
            </span>
          </button>
        </div>
      </div>
      <Box sx={{ height: "auto", width: "100%" }}>
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
                <TableRow className="h-40px">
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                  <TableCell>
                    <input
                      type="text"
                      name="labName"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                      placeholder="Search ..."
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      type="text"
                      name="reqTypeName"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 min-w-225px"
                      placeholder="Search ..."
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`WorkflowStatusSearchPortalTypeName`}
                      type="text"
                      name="portalTypeName"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                      placeholder="Search ..."
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`WorkflowStatusSearchStatus`}
                      type="text"
                      name="currentWorkFlowName"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                      placeholder="Search ..."
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`WorkflowStatusSearchActionPerformed`}
                      type="text"
                      name="actionPerformed"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                      placeholder="Search ..."
                    />
                  </TableCell>
                  <TableCell>
                    <input
                      id={`WorkflowStatusSearchNextStep`}
                      type="text"
                      name="nextWorkFlowName"
                      className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                      placeholder="Search ..."
                    />
                  </TableCell>
                </TableRow>
                <TableRow className="h-30px">
                  <TableCell>
                    <label className="form-check form-check-sm form-check-solid">
                      <input className="form-check-input" type="checkbox" />
                    </label>
                  </TableCell>
                  {TBL_HEADERS.map(({ name, variable }) => (
                    <TableCell
                      className={`${
                        name === "Actions" ? "w-50px" : ""
                      } min-w-50px`}
                    >
                      <div
                        className={`d-flex justify-content-between cursor-pointer`}
                      >
                        <div style={{ width: "max-content" }}>{name}</div>

                        {variable !== "" ? (
                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`text-gray-700 fs-7 p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`text-gray-700 fs-7 p-0 m-0 "`}
                            />
                          </div>
                        ) : null}
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows?.map((item: any, index: number) => {
                  return (
                    <Row
                      row={item}
                      rows={rows}
                      setRows={setRows}
                      index={index}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Box>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
        <p className="pagination-total-record mb-0">
          <span>
            Showing {pageSize * (curPage - 1) + 1} to{" "}
            {Math.min(pageSize * curPage, total)} of Total
            <span> {total} </span> entries
          </span>
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
          <li className="btn btn-lg p-2" onClick={() => showPage(1)}>
            <i className="fa fa-angle-double-left"></i>
          </li>
          <li className="btn btn-lg p-2" onClick={prevPage}>
            <i className="fa fa-angle-left"></i>
          </li>
          {pageNumbers.map((page) => (
            <li
              key={page}
              className={`px-2 ${
                page === curPage ? "font-weight-bold bg-primary text-white" : ""
              }`}
              style={{ cursor: "pointer" }}
              onClick={() => showPage(page)}
            >
              {page}
            </li>
          ))}
          <li className="btn btn-lg p-2" onClick={nextPage}>
            <i className="fa fa-angle-right"></i>
          </li>
          <li
            className="btn btn-lg p-2"
            onClick={() => {
              if (totalPages === 0) {
                showPage(curPage);
              } else {
                showPage(totalPages);
              }
            }}
          >
            <i className="fa fa-angle-double-right"></i>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default ArchivedQCControls;
