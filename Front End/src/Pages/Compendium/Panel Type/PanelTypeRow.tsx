import { MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { statusChangeType } from "../../../Services/Compendium/PanelTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../Utils/Style/Dropdownstyle";
import useLang from "Shared/hooks/useLanguage";

export interface StatusChangeObject {
  id: number;
  isActive: boolean;
}
function PanelTypeRow({
  row,
  onEdit,
  setPosttable,
  onDelete,
  showData,
  setFreezeInput,
}: any) {
  const { t } = useLang();
  const [isActive, setIsActive] = useState<boolean>(true); // Initial state
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const [statusChangeAlert, setStatusChangeAlert] = useState(false);
  const handleCloseStatusChangeAlert = () => setStatusChangeAlert(false);
  const [newStatus, setNewStatus] = useState(row.isActive);

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleDelete = (id: number) => {
    onDelete(id);
  };
  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (row: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };
  const handleOpenStatusChangeAlert = (status: boolean) => {
    handleClose("dropdown2");
    setNewStatus(status);
    setStatusChangeAlert(true);
  };
  const handleStatusChange = async (id: number, currentStatus: boolean) => {
    try {
      const newStatus = !row.isActive;
      console.log(newStatus, "newStatus");
      const statusChangeObj: StatusChangeObject = { id, isActive: newStatus };
      await statusChangeType(statusChangeObj);
      setIsActive(newStatus);
      toast.success(
        t("Status changed to {{status}}", {
          status: newStatus ? t("Active") : t("Inactive"),
        })
      );
    } catch (error) {
      console.error("Error handling status change :", error);
      toast.error(t("Error handling status change. Please try again."));
    } finally {
      showData();
    }
  };

  const handleConfirmStatusChange = () => {
    handleStatusChange(row.id, newStatus);
    handleCloseStatusChangeAlert();
  };

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id="demo-positioned-button"
              aria-haspopup="true"
              onClick={(event) => handleClick(event, "dropdown2")}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
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
              {row.isActive ? (
                <>
                  <PermissionComponent
                    moduleName=""
                    pageName="Panel Type"
                    permissionIdentifier="Edit"
                  >
                    <MenuItem
                      className=" w-100px p-0"
                      onClick={() => setPosttable(true)}
                    >
                      <Link
                        className="text-dark w-100 h-100"
                        to={``}
                        onClick={() => {
                          onEdit(row);
                          setFreezeInput(true);
                        }}
                      >
                        <i className="fa fa-edit text-success w-20px" />
                        {t("Edit")}
                      </Link>
                    </MenuItem>
                  </PermissionComponent>

                  <PermissionComponent
                    moduleName=""
                    pageName="Panel Type"
                    permissionIdentifier="Delete"
                  >
                    <MenuItem
                      onClick={() => handleClickOpen(row, row.id)}
                      className=" w-100px"
                    >
                      <i
                        className="fa fa-trash text-danger mr-2"
                        aria-hidden="true"
                      ></i>
                      {t("Delete")}
                    </MenuItem>
                  </PermissionComponent>
                </>
              ) : null}
              <PermissionComponent
                moduleName=""
                pageName="Panel Type"
                permissionIdentifier="StatusChange"
              >
                <MenuItem
                  onClick={() => handleOpenStatusChangeAlert(!row.isActive)}
                  className=" w-100px"
                >
                  <span className="menu-item">
                    {row.isActive ? (
                      <i
                        className="fa-solid fa-ban text-danger w-20px"
                        style={{ fontSize: "16px", color: "green" }}
                      ></i>
                    ) : (
                      <i
                        className="fa fa-circle-check text-success w-20px"
                        style={{ fontSize: "16px", color: "green" }}
                      ></i>
                    )}
                    {row.isActive ? "Inactive" : "Active"}
                  </span>
                </MenuItem>
              </PermissionComponent>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            {row.panelType}
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.description}</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.reqTypeName}</div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-center">
            <div style={{ width: "max-content" }}>
              {" "}
              {row.isActive ? (
                <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
              ) : (
                <i className="fa fa-ban text-danger mr-2 w-20px"></i>
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
      <BootstrapModal
        BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        show={statusChangeAlert}
        onHide={handleCloseStatusChangeAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Change Status")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to change the status to {{status}}?", {
            status: newStatus ? t("active") : t("inactive"),
          })}
        </BootstrapModal.Body>

        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseStatusChangeAlert}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-info m-2"
            onClick={handleConfirmStatusChange}
          >
            {t("Confirm")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default PanelTypeRow;
