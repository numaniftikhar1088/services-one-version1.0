import { Link, MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

const InventoryRow = () => {
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
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };
  return (
    <>
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
                <i
                  className="fa fa-trash text-danger mr-2"
                  aria-hidden="true"
                ></i>
                {t("Delete")}
              </MenuItem>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">123</div>
        </TableCell>

        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>Truemedit Test Facility</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>123456</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>P88-DIY</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>Test</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>100</div>
          </div>
        </TableCell>

        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>100</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$1500.00</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>$1500.00</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>Active</div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
};

export default InventoryRow;
