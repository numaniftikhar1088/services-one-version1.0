// Type, sample data, and component for rendering a single row in the Blood QC Run History table.
import { Link, MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Interface representing the type of a single Blood QC run history row object.
export interface CoreQCRunHistoryRowData {
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

// Sample data for the Blood QC Run History table.
export const CoreQCRunHistoryRowData: CoreQCRunHistoryRowData[] = [
  {
    runNumber: "20231218-180",
    runDate: "7/16/2024",
    runTime: "	14:37",
    testName: "Progesterone",
    instrument: "DXI600",
    qcGroupName: "RandoxDxI600",
    qcLevel: "Level 2 Range",
    qcResult: "8.98",
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
    qcResult: "8.98",
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
    qcResult: "8.98",
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
    qcResult: "8.98",
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
    qcResult: "8.98",
    qcRange: "9.32-11.0",
    qcLot: "2270EC",
  },
];

// Props for the BloodQcRunHistoryRow component
interface CoreQCRunHistoryRowDataProps {
  data: CoreQCRunHistoryRowData;
}

// Component for rendering a single row in the Blood QC Run History table.
const CoreQCRunHistoryRow: React.FC<CoreQCRunHistoryRowDataProps> = ({ data }) => {
  const { t } = useLang();
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
      {/* Checkbox for selecting the row */}
      <TableCell style={{ width: "49px" }}>
        <label className="form-check form-check-sm form-check-solid">
          <input
            className="form-check-input"
            type="checkbox"
          />
        </label>
      </TableCell>
      <TableCell className="w-50px">
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
            <MenuItem className="w-auto">
              <i style={{ color: '#008000' }} className="fa fa-check mr-2" aria-hidden="true"></i>
              {t("Accepted")}
            </MenuItem>
            <MenuItem className="w-auto">
              <i className="fa fa-eye fa-md mr-2" style={{ color: '#FFA800' }} aria-hidden="true"></i>
              {t("View Action")}
            </MenuItem>
            <MenuItem className="w-auto">
              <i style={{ color: '#008000' }} className="fa fa-check-circle  mr-2" title="Enabled"></i>
              {t("Corrective Action")}
            </MenuItem>
            <MenuItem className="w-auto">
              <i className="fa fa-archive mr-2 text-success"></i>
              {t("Archived")}
            </MenuItem>
          </StyledDropMenuMoreAction>
        </div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.runNumber}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.runDate}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.runTime}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.instrument}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.qcGroupName}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.testName}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.qcLevel}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.qcResult}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.qcRange}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between  ">{data.qcLot}</div>
      </TableCell>
    </TableRow>
  );
};

export default CoreQCRunHistoryRow;
