import { TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import useLang from "Shared/hooks/useLanguage";
import BootstrapModal from "react-bootstrap/Modal";
import {
  DrugAllergyStatusChange,
  UniqueDescription,
} from "Services/DrugAllergy/DrugAllergy";

function DrugRow({ row, handleEdit, handleDelete, showData }: any) {
  const { t } = useLang();

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

  const statusChange = async () => {
    const data = {
      id: row.id,
      isActive: !row.isActive,
    };
    let resp = await DrugAllergyStatusChange(data);
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

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id={`NewDrugAllergy3Dots_${row.id}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <Dropdown.Item
                id={`NewDrugAllergyEdit`}
                className="w-auto"
                eventKey="2"
                onClick={() => handleEdit(row, row.id)}
              >
                <i className={"fa fa-edit text-primary mr-2"}></i>
                {t("Edit")}
              </Dropdown.Item>
              <Dropdown.Item
                id={`NewDrugAllergyDelete`}
                className="w-auto"
                eventKey="2"
                onClick={() => handleClickOpen1(row, row.id)}
              >
                <i className={"fa fa-trash text-danger mr-2 w-20px"}></i>
                {t("Delete")}
              </Dropdown.Item>
              {/* </PermissionComponent> */}
              {row.isActive ? (
                <Dropdown.Item
                  id={`NewDrugAllergyInactive`}
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
              ) : (
                <Dropdown.Item
                  id={`NewDrugAllergyActive`}
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
              )}
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell
          id={`NewDrugAllergyCode_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.dacode}</div>
        </TableCell>
        <TableCell
          id={`NewDrugAllergyDescription_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.description}
          </div>
        </TableCell>
        <TableCell
          id={`NewDrugAllergyStatus_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.isActive ? (
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
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleChange(row.id)}
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
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert1}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDeleteRow(row.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default DrugRow;
