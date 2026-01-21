import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import BootstrapModal from "react-bootstrap/Modal";
import { InsuranceStatusChange } from "Services/AllInsuranceProvider/InsuranceProvider";

function InsuranceRow({ row, handleDelete, handleEdit, showData }: any) {
  const { t } = useLang();
  const statusChange = async () => {
    const data = {
      insuranceProviderId: row.insuranceProviderId,
      newStatus: !row.providerStatus,
    };
    let resp = await InsuranceStatusChange(data);
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
    showData();
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

  console.log(row, "rowrow");

  return (
    <>
      <TableRow className="h-30px" key={row.insuranceProviderId}>
        <TableCell className="text-center">
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id={`AllInsurance3Dots_${row.insuranceProviderId}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <Dropdown.Item
                id={`AllInsuranceEdit`}
                className="w-auto"
                eventKey="2"
                onClick={() => handleEdit(row)}
              >
                <i className={"fa fa-edit text-primary mr-2"}></i>
                {t("Edit")}
              </Dropdown.Item>
              <Dropdown.Item
                id={`AllInsuranceDelete`}
                className="w-auto"
                eventKey="2"
                onClick={() => handleClickOpen1(row, row.insuranceProviderId)}
              >
                <i className={"fa fa-trash text-danger mr-2 w-20px"}></i>
                {t("Delete")}
              </Dropdown.Item>
              {/* </PermissionComponent> */}
              {row.providerStatus ? (
                // <PermissionComponent
                //   moduleName="Blood LIS"
                //   pageName="LIS Setting"
                //   permissionIdentifier="Inactive"
                // >
                <Dropdown.Item
                  id={`AllInsuranceInactive`}
                  className="w-auto"
                  eventKey="1"
                  onClick={() => handleClickOpen(row, row.insuranceProviderId)}
                >
                  <i
                    className="fa-solid fa-ban text-danger w-20px mr-2"
                    style={{ fontSize: "16px", color: "green" }}
                  ></i>
                  {t("Inactive")}
                </Dropdown.Item>
              ) : (
                // </PermissionComponent>
                // <PermissionComponent
                //   moduleName="Blood LIS"
                //   pageName="LIS Setting"
                //   permissionIdentifier="Active"
                // >
                <Dropdown.Item
                  id={`AllInsuranceActive`}
                  className="w-auto"
                  eventKey="2"
                  onClick={() => handleClickOpen(row, row.insuranceProviderId)}
                >
                  <i
                    className="fa fa-circle-check text-success w-20px"
                    style={{ fontSize: "16px", color: "green" }}
                  ></i>
                  {t("Active")}
                </Dropdown.Item>
                // </PermissionComponent>
              )}
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell
          id={`AllInsuranceProviderName_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          {" "}
          <div className="d-flex justify-content-between  ">
            {row.providerName}{" "}
          </div>
        </TableCell>
        <TableCell
          id={`AllInsuranceProviderCode_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.providerCode}{" "}
          </div>
        </TableCell>
        <TableCell
          id={`AllInsuranceAddress1_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.address1}</div>
        </TableCell>
        <TableCell
          id={`AllInsuranceCity_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.city}</div>
        </TableCell>
        <TableCell
          id={`AllInsuranceState_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.state}</div>
        </TableCell>
        <TableCell
          id={`AllInsuranceZipCode_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.zipCode}</div>
        </TableCell>
        <TableCell
          id={`AllInsurancePhoneNumber_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.landPhone}
          </div>
        </TableCell>
        <TableCell
          id={`AllInsurance_${row.insuranceProviderId}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.providerStatus ? (
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
            id={`AllInsuranceModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AllInsuranceModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleChange(row.insuranceProviderId)}
          >
            {t("Confirm")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        BootstrapModal
        show={openalert1}
        onHide={handleCloseAlert1}
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
            id={`AllInsuranceDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AllInsuranceDeleteMOdalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDeleteRow(row.insuranceProviderId)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default InsuranceRow;
