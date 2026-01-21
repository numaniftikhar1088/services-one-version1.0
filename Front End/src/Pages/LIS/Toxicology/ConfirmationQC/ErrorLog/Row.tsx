import { TableCell, TableRow } from "@mui/material";
import React from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { DoneIcon } from "Shared/Icons";

function Row({ row, rows, setRows, index }: any) {
  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell id={`WorkflowStatusLabName_${row.id}`}>
        <span>{row.drugClass}</span>
      </TableCell>
      <TableCell id={`WorkflowStatusLabName_${row.id}`}>
        <span>{row.testName}</span>
      </TableCell>
      <TableCell id={`WorkflowStatusLabName_${row.id}`}>
        <span>{row.testTime}</span>
      </TableCell>
      <TableCell id={`WorkflowStatusLabName_${row.id}`}>
        <span>{row.testDate}</span>
      </TableCell>
    </TableRow>
  );
}

export default Row;
