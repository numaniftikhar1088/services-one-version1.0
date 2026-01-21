import { TableCell, TableRow } from "@mui/material";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { CrossIcon, DoneIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import Select from "react-select";
import CorrectiveActionModal from "../CorrectiveActionModal";
import { useState } from "react";

function Row({ row, rows, setRows, index, setAddNewRow, addNewRow }: any) {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <CorrectiveActionModal open={openModal} handleClose={handleClose} />
      {index === 0 && addNewRow && (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          <TableCell>
            <div className="w-100">
              <input
                id={`compendiumDataReflexRulesScreenTestCode`}
                type="text"
                name="ScreenTestCode"
                className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                placeholder="Interface Co..."
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
        </TableRow>
      )}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
                  onClick={() => setOpenModal(true)}
                >
                  {/* <i className={"fa fa-edit text-primary mr-2"}></i> */}
                  Corrective
                </Dropdown.Item>
                <Dropdown.Item
                  id={`WorkflowStatusEdit`}
                  className="w-auto"
                  eventKey="2"
                >
                  {/* <i className={"fa fa-edit text-primary mr-2"}></i> */}
                  Archived
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.instrument}</span>
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
          <span>{row.qcResult}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.referenceRange}</span>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
