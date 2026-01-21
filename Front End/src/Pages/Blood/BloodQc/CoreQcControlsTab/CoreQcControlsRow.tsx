// Component for rendering a single row in the Core Qc Controls table.
import { TableCell, TableRow } from "@mui/material";
import React from "react";

import { MenuItem } from "@mui/material";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import useLang from "Shared/hooks/useLanguage";

// Type definition for a single Core Qc Controls row object.
interface CoreQcControlsData {
  instrument: string;
  testName: string;
  qcLevel: string,
  rangeType: string,
  low: string,
  high: string
}
// Sample data for the Core Qc Controls table.
export const coreQcControlsData: CoreQcControlsData[] = [
  {
    instrument: 'DXI600',
    testName: "Prolactin",
    qcLevel: 'Level 2 Range',
    rangeType: 'Range',
    low: '20.3',
    high: '39.4',
  },
  {
    instrument: 'AU700',
    testName: "Triglycerides",
    qcLevel: 'Level 2 Range',
    rangeType: 'Range',
    low: '189',
    high: '261',
  },
  {
    instrument: 'AU700',
    testName: "Iron",
    qcLevel: 'Level 2 Range',
    rangeType: 'Range',
    low: '20.3',
    high: '39.4',
  },
  {
    instrument: 'AU700',
    testName: "APO B (Apolipoprotein B)",
    qcLevel: 'Level 2 Range',
    rangeType: 'Range',
    low: '122',
    high: '176',
  },
  {
    instrument: 'AU700',
    testName: "APO A1 (Apolipoprotein A1)",
    qcLevel: 'Level 2 Range',
    rangeType: 'Range',
    low: '84',
    high: '118',
  },
];

// Props for the CoreQcControlsRow component
interface CoreQcControlsProps {
  data: CoreQcControlsData;
}

const CoreQcControlsRow: React.FC<CoreQcControlsProps> = ({ data }) => {
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
                <i className={"fa fa-edit text-primary mr-2"}></i>
                {t("Edit")}
              </MenuItem>
            </PermissionComponent>

            <PermissionComponent
              moduleName="Marketing"
              pageName="Training Documents"
              permissionIdentifier="Edit"
            >
              <MenuItem className="w-auto">
                <i
                  className="fa fa-trash text-danger mr-2"
                  aria-hidden="true"
                ></i>
                {t("Delete")}
              </MenuItem>
            </PermissionComponent>
          </StyledDropMenuMoreAction>
        </div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.instrument}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.testName}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.qcLevel}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.rangeType}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.low}</div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <div className="d-flex justify-content-between">{data.high}</div>
      </TableCell>
    </TableRow>
  );
};

export default CoreQcControlsRow;
