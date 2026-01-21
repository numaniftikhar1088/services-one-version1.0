import { TableCell, TableRow } from "@mui/material";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { CrossIcon, DoneIcon } from "Shared/Icons";
import CorrectiveActionModal from "../CorrectiveActionModal";
import { useState } from "react";

function Row({ row, index, addNewRow, setAddNewRow }: any) {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <CorrectiveActionModal open={openModal} handleClose={handleClose} />
      {index === 0 && addNewRow && (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
                placeholder="QC Name"
              />
            </div>
          </TableCell>
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
        </TableRow>
      )}
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          <span>{row.drugClass}</span>
        </TableCell>
        <TableCell id={`WorkflowStatusLabName_${row.id}`}>
          <span>{row.qcLevel}</span>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
