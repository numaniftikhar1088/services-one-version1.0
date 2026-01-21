import React, { useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import BootstrapModal from "react-bootstrap/Modal";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { MenuItem, TableCell, TableRow } from "@mui/material";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";

function SpecimenRow({ row, handleSpecimenChabge }: any) {
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
  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };
  const handleChange = async (id: number) => {
    await handleSpecimenChabge(id);
    setOpenAlert(false);
  };

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          <div className="d-flex justify-content-center">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id={`BloodLisSettingSpecimenType3Dots_${row.id}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <span className="menu-item ">
                {row.isActive ? (
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="Inactive"
                  >
                    <Dropdown.Item
                      id={`BloodLisSettingSpecimenTypeInactive`}
                      className="w-auto"
                      eventKey="1"
                      onClick={() => handleClickOpen(row, row.id)}
                    >
                      <i
                        className="fa-solid fa-ban text-danger w-20px"
                        style={{ fontSize: "16px", color: "green" }}
                      ></i>
                      {t("Inactive")}
                    </Dropdown.Item>
                  </PermissionComponent>
                ) : (
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="Active"
                  >
                    <Dropdown.Item
                      id={`BloodLisSettingSpecimenTypeActive`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => handleClickOpen(row, row.id)}
                    >
                      <i
                        className="fa fa-circle-check text-success w-20px"
                        style={{ fontSize: "16px", color: "green" }}
                      ></i>
                      {t("Active")}
                    </Dropdown.Item>
                  </PermissionComponent>
                )}
              </span>
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell
          id={`BloodLisSettingSpecimenTypeSpecimenType_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between">
            {row.specimenType}
          </div>
        </TableCell>
        <TableCell
          id={`BloodLisSettingSpecimenTypePrefix_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between">
            <div style={{ width: "max-content" }}>{row.specimenPrefix}</div>
          </div>
        </TableCell>
        <TableCell
          id={`BloodLisSettingSpecimenTypeSuffix_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between">
            <div style={{ width: "max-content" }}>{row.specimenSuffix}</div>
          </div>
        </TableCell>
        <TableCell
          id={`BloodLisSettingSpecimenTypeStatus_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-center">
            <div style={{ width: "max-content" }}>
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
        keyboard={false}
        show={openalert}
        backdrop="static"
        onHide={handleCloseAlert}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Change Status")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to change the status?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`BloodLisSettingSpecimenTypeModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BloodLisSettingSpecimenTypeModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleChange(row.id)}
          >
            {t("Confirm")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default SpecimenRow;
