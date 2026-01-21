import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { FaPrint } from "react-icons/fa";
import Select from "react-select";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import TestList from "./TestList";

function Row({ row, rows, setRows, index, addNewRow, setAddNewRow }: any) {
  const [isExpand, setIsExpand] = useState<boolean>(false);
  const showExpand = () => {
    setIsExpand(!isExpand);
  };

  return (
    <>
      {index === 0 && addNewRow && (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell></TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="gap-2 d-flex">
              <button
                id={`compendiumDataReflexRulesSave`}
                className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
              >
                <DoneIcon />
              </button>
              <button
                id={`compendiumDataReflexRulesCancel`}
                onClick={() => setAddNewRow(false)}
                className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
              >
                <CrossIcon />
              </button>
            </div>
          </TableCell>
          <TableCell></TableCell>
          <TableCell>
            <div className="w-100">
              <input
                id={`compendiumDataReflexRulesScreenTestCode`}
                type="text"
                name="ScreenTestCode"
                className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                placeholder="QC Name"
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-100">
              <Select
                inputId={`compendiumDataReflexRulesPerformingLab`}
                placeholder={"---Select---"}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                menuPosition={"fixed"}
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-100">
              <Select
                inputId={`compendiumDataReflexRulesPerformingLab`}
                placeholder={"---Select---"}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                menuPosition={"fixed"}
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-100">
              <input
                id={`compendiumDataReflexRulesScreenTestCode`}
                type="text"
                name="ScreenTestCode"
                style={{ maxWidth: "100px" }}
                className="form-control bg-white w-100 rounded-2 fs-8 h-33px"
                placeholder=".."
              />
            </div>
          </TableCell>
          <TableCell>
            <div className="w-100">
              <input
                id={`compendiumDataReflexRulesScreenTestCode`}
                type="date"
                name="ScreenTestCode"
                className="form-control bg-white rounded-2 fs-8 h-33px"
                placeholder=".."
              />
            </div>
          </TableCell>
        </TableRow>
      )}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={showExpand}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {isExpand ? (
              <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                <RemoveICon />
              </button>
            ) : (
              <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <label className="form-check form-check-sm form-check-solid">
            <input className="form-check-input" type="checkbox" />
          </label>
        </TableCell>
        <TableCell className="text-center">
          <div className="d-flex justify-content-center">
            <div className="rotatebtnn">
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id={`WorkflowStatus3Dots_${row.id}`}
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                <Dropdown.Item
                  id={`WorkflowStatusEdit`}
                  className="w-auto"
                  eventKey="2"
                >
                  <i className={"fa fa-edit text-primary mr-2"}></i>
                  Edit
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </TableCell>
        <TableCell
          style={{ width: "40px" }}
          id={`WorkflowStatusLabName_${row.id}`}
        >
          <div
            style={{
              background: "#960808",
              padding: 5,
              borderRadius: 5,
              width: "30px",
              margin: "auto",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <FaPrint color="white" />
          </div>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.drugClass}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.specimenType}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.qcLevel}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.lotNumber}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.expirationDate}</span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} className="padding-0">
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      <TestList />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
