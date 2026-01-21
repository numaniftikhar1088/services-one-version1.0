import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import BootstrapModal from "react-bootstrap/Modal";
import AssigmentService from "Services/AssigmentService/AssigmentService";

function AssignComorRow({
  row,
  handleDelete,
  handleEditComor,
  ComorGetAllData,
}: any) {
  const { t } = useLang();
  const statusChange = async () => {
    const data = {
      comorbidityCodeAssignmentId: row.id,
      newStatus: !row.comorbidityStatus,
    };
    let resp = await AssigmentService.changeStatusComor(data);
  };
  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
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
    await statusChange();
    setOpenAlert(false);
    ComorGetAllData();
  };

  const [anchorEl1, setAnchorEl1] = useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const handleClose1 = (dropdownName: string) => {
    setAnchorEl1({ ...anchorEl1, [dropdownName]: null });
  };
  const [openalert1, setOpenAlert1] = useState(false);
  const handleCloseAlert1 = () => setOpenAlert(false);
  const handleClickOpen1 = (item: any, status: string) => {
    handleClose1("dropdown2");
    setOpenAlert1(true);
  };
  const handleDeleteRow = async (id: any) => {
    await handleDelete(id);
    setOpenAlert1(false);
  };

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell className="text-center">
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id={`AssignmentComorbidities3Dots_${row.id}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <PermissionComponent
                moduleName="Setup"
                pageName="Comorbidities Assignment"
                permissionIdentifier="Edit"
              >
                <Dropdown.Item
                  id={`AssignmentComorbiditiesEdit`}
                  className="w-auto"
                  eventKey="2"
                  onClick={() => handleEditComor(row)}
                >
                  <i className={"fa fa-edit text-primary mr-2"}></i>
                  {t("Edit")}
                </Dropdown.Item>
              </PermissionComponent>
              {row.comorbidityStatus ? (
                <PermissionComponent
                  moduleName="Setup"
                  pageName="Comorbidities Assignment"
                  permissionIdentifier="Inactive"
                >
                  <Dropdown.Item
                    id={`AssignmentComorbiditiesInactive`}
                    className="w-auto"
                    eventKey="1"
                    onClick={() => handleClickOpen(row, row.id)}
                  >
                    <i
                      className="fa-solid fa-ban text-danger w-20px mr-2"
                      style={{ fontSize: "16px", color: "green" }}
                    ></i>
                    {t("Inactive")}
                  </Dropdown.Item>
                </PermissionComponent>
              ) : (
                <PermissionComponent
                  moduleName="Setup"
                  pageName="Comorbidities Assignment"
                  permissionIdentifier="Active"
                >
                  <Dropdown.Item
                    id={`AssignmentComorbiditiesActive`}
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
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesComorbidityCode_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {" "}
          <div className="d-flex justify-content-between  ">
            {row.comorbidityCode}{" "}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesCodeDescription_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.comorbidityCodeDescription}{" "}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesGroup_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.comorbidityGroup}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesFacility_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.facility}</div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesReferenceLab_${row.referenceLab}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.referenceLab}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesRequisitionType_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.requisitionType}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesPanelName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.panelName}
          </div>
        </TableCell>
        <TableCell
          id={`AssignmentComorbiditiesStatus_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.comorbidityStatus ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
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
            id={`AssignmentComorbiditiesModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AssignmentComorbiditiesModalConfirm`}
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

export default AssignComorRow;
