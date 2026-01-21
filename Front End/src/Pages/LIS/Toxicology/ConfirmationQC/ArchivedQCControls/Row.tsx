import { TableCell, TableRow } from "@mui/material";
import { Dropdown, DropdownButton } from "react-bootstrap";
import CorrectiveActionModal from "../CorrectiveActionModal";
import { useState } from "react";

function Row({ row, rows, setRows, index }: any) {
  const [openModal, setOpenModal] = useState(false);

  const handleClose = () => {
    setOpenModal(false);
  };

  return (
    <>
      <CorrectiveActionModal open={openModal} handleClose={handleClose} />
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
