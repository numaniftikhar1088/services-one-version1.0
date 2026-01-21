// Defines the type, sample data, and component for rendering a single row in the QcLevel table.
import { TableCell, TableRow } from "@mui/material";
import React from "react";

import { MenuItem } from "@mui/material";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Interface representing the type of a single QcLevel row object for Qc Level.
interface QcLevelRowData {
qcLevel:string,
instrument:string,
}

// Sample data for the Qc Level table.
export const QcLevelRows: QcLevelRowData[] = [
  {
    qcLevel: "Level 1 Range",
    instrument:'CA600',
  },
  {
    qcLevel: "Level 1 Range",
    instrument:'AU700',
  },
  {
    qcLevel: "Level 1 Range",
    instrument:'DXH560',
  },
  {
    qcLevel: "Level 1 Range",
    instrument:'DXI600',
  },
];

// Props for the QcLevel Row component
interface QcLevelRowProps {
  data: QcLevelRowData;
}

// Component for rendering a single row in the Qc Level table.
const QcLevelRow: React.FC<QcLevelRowProps> = ({ data }) => {
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
          <div className="d-flex justify-content-between  ">{data.qcLevel}</div>
        </TableCell>

        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">{data.instrument}</div>
        </TableCell>
      </TableRow>
  );
};

export default QcLevelRow;
