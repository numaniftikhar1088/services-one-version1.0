// Type, sample data, and component for rendering a single row in the Deleted Controls table for Blood QC.
import { Link, MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

// Interface representing the type of a single deleted control row object.
interface DeletedControlsRowData {
  instrument: string;
  testName: string;
  qcLevel:string,
  rangeType:string,
  low:string,
  high:string
}

// Sample data for the Deleted Controls table.
export const DeletedControlsRowsData: DeletedControlsRowData[] = [
  {
    instrument:'DXI600',
    testName:"Prolactin",
    qcLevel:'Level 2 Range',
    rangeType:'Range',
    low:'20.3',
    high:'39.4',
  },
  {
    instrument:'AU700',
    testName:"Triglycerides",
    qcLevel:'Level 2 Range',
    rangeType:'Range',
    low:'189',
    high:'261',
  },
  {
    instrument:'AU700',
    testName:"Iron",
    qcLevel:'Level 2 Range',
    rangeType:'Range',
    low:'20.3',
    high:'39.4',
  },
  {
    instrument:'AU700',
    testName:"APO B (Apolipoprotein B)",
    qcLevel:'Level 2 Range',
    rangeType:'Range',
    low:'122',
    high:'176',
  },
  {
    instrument:'AU700',
    testName:"APO A1 (Apolipoprotein A1)",
    qcLevel:'Level 2 Range',
    rangeType:'Range',
    low:'84',
    high:'118',
  },
];


// Props for the DeletedControlsRow component
interface DeletedControlsRowProps {
  data: DeletedControlsRowData;
}

// Component for rendering a single row in the Deleted Controls table.
const DeletedControlsRow: React.FC<DeletedControlsRowProps> = ({ data }) => {
  const { t } = useLang();
  const [openalert, setOpenAlert] = useState(false);
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
              <MenuItem className="w-auto">
                  <i className="fa fa-refresh text-success mr-2 w-20px"></i>
                            {t("Restore")}
              </MenuItem>
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

export default DeletedControlsRow;
