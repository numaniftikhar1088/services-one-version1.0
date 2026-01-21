// File: src/Pages/Blood/BloodQc/ArchivedQcRunTab/Row.tsx
// Description: Defines the row component for displaying a single archived QC run in the table.

import { Link, MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Type definition for a single archived QC run row object.
interface ArchivedQcRunRow {
  runNumber: string;
  runDate: string;
  runTime: string;
  instrument: string;
  qcGroupName: string;
  testName: string;
  qcLevel: string;
  qcResult: string;
  qcRange: string;
  qcLot: string;
}
//Sample data for ArchivedQcRunRows
export const ArchivedQcRunRows: ArchivedQcRunRow[] = [
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 2 Range",
    qcResult: "0.11",
    qcRange: "9.32-11.0",
    qcLot: "2270EC",
  },
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 1 Range",
    qcResult: "0.40",
    qcRange: "9.32-11.0",
    qcLot: "2270EC",
  },
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 2 Range",
    qcResult: "563.1",
    qcRange: "578-866",
    qcLot: "2270EC",
  },
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 1 Range",
    qcResult: "8.98",
    qcRange: "0.327-0.491",
    qcLot: "2270EC",
  },
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 2 Range",
    qcResult: "8.98",
    qcRange: "0.077-0.129",
    qcLot: "2270EC",
  },
];

// ArchivedQcRunRowProps: Props for the row component
interface ArchivedQcRunRowProps {
  data: ArchivedQcRunRow;
}

const ArchivedQcRunRow : React.FC<ArchivedQcRunRowProps> = ({ data }) => {
  const { t } = useLang();
    // State for managing dropdown menu anchors
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  return (
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id="demo-positioned-button"
              aria-haspopup="true"
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
              onClick={(event) => handleClick(event, "dropdown2")}
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
              id="demo-positioned-menu"
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl.dropdown2}
              open={Boolean(anchorEl.dropdown2)}
              onClose={() => handleClose("dropdown2")}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <PermissionComponent
                moduleName="Marketing"
                pageName="Training Documents"
                permissionIdentifier="Edit"
              >
                 <MenuItem className="w-auto">
                  <i className="fa fa-refresh text-success mr-2 w-20px"></i>
                            {t("Restore")}
              </MenuItem>
              </PermissionComponent>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.runNumber}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.runDate}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.runTime}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.instrument}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.qcGroupName}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.testName}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.qcLevel}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.qcResult}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.qcRange}</div>
          </TableCell>
          <TableCell sx={{ width: "max-content" }}>
            <div className="d-flex justify-content-between">{data.qcLot}</div>
          </TableCell>
      </TableRow>
  );
};

export default ArchivedQcRunRow;
