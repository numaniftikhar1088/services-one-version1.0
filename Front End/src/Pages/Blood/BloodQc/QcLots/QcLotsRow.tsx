// Defines the type, sample data, and component for rendering a single row in the QC Lots  table.
import { TableCell, TableRow } from "@mui/material";
import React from "react";

import { MenuItem } from "@mui/material";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Interface representing the type of a single  row object for QC lots.
interface QcLotsRowData {
  instrument: string;
  groupName: string;
  qcCode: string;
  qcLevel: string;
  qcLot: string;
  qcLotExpirationDate: string
}

// Sample data for the QC Lots  table.
export const QcLotsRows: QcLotsRowData[] = [
  { 
    instrument: "AU700",
    groupName: "Homocysteine (Randox)",
    qcCode: 'HCYQC1',
    qcLevel: 'Level 1 Range',
    qcLot: '4901CK',
    qcLotExpirationDate: '04/28/2026',
  },
  { 
    instrument: "AU700",
    groupName: "Homocysteine (Randox)",
    qcCode: 'HCYQC1',
    qcLevel: 'Level 3 Range',
    qcLot: '4901CK',
    qcLotExpirationDate: '04/28/2026',
  },
  { 
    instrument: "DXI600",
    groupName: "RandoxDxI600",
    qcCode: 'IA-PREMPLUS-L3	',
    qcLevel: 'Level 3 Range',
    qcLot: '2464EC',
    qcLotExpirationDate: '04/28/2026',
  },
  { 
    instrument: "CA600",
    groupName: "	D-Dimer (Siemens)",
    qcCode: '	QC05',
    qcLevel: 'Level 1 Range',
    qcLot: '575621',
    qcLotExpirationDate: '04/28/2026',
  }
];

// Props for the PricingRow component
interface QcLotsRowProps {
  data: QcLotsRowData;
}

// Component for rendering a single row in the QC Lots pricing table.
const QcLotsRow: React.FC<QcLotsRowProps> = ({ data }) => {
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
          <div className="d-flex justify-content-between">{data.groupName}</div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">{data.qcCode}</div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">{data.qcLevel}</div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">{data.qcLot}</div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">{data.qcLotExpirationDate}</div>
        </TableCell>
      </TableRow>
  );
};

export default QcLotsRow;
