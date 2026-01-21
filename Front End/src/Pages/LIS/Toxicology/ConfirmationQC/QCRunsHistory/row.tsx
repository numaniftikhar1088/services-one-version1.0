import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import CorrectiveActionModal from "../CorrectiveActionModal";

function Row({ row, rows, setRows, index }: any) {
  const isExpired = moment(row.qcLotExpiration).isBefore(moment(), "day");
  const highQcResult = Number(row.qcResult) > 100;

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
                  className="w-auto"
                  eventKey="2"
                  onClick={() => setOpenModal(true)}
                >
                  Corrective
                </Dropdown.Item>
                <Dropdown.Item className="w-auto" eventKey="3">
                  Archived
                </Dropdown.Item>
              </DropdownButton>
            </div>
          </div>
        </TableCell>

        <TableCell>
          <span>{row.File}</span>
        </TableCell>
        <TableCell>
          <span>{row.Instrument}</span>
        </TableCell>
        <TableCell>
          <span>{row.drugClass}</span>
        </TableCell>
        <TableCell>
          <span>{row.specimenType}</span>
        </TableCell>
        <TableCell>
          <span>{row.qcLevel}</span>
        </TableCell>

        {/* Conditional Color for QC Result */}
        <TableCell
          style={{
            backgroundColor: highQcResult ? "#fde2e2" : "transparent",
          }}
        >
          <span>{row.qcResult}</span>
        </TableCell>

        {/* Conditional Color for Expired QC Lot */}
        <TableCell
          style={{
            backgroundColor: isExpired ? "#fde2e2" : "transparent",
          }}
        >
          <span>{row.qcLotExpiration}</span>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
