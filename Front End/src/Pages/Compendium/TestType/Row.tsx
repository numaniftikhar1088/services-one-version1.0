import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { Item, StatusChangeObject } from ".";
import { statusChangeTestType } from "../../../Services/Compendium/TestTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "../../../Shared/Icons";

type HandleEdit = (item: Item) => void;

type HandleDelete = (id: number) => void;
interface RowProps {
  item: Item;
  setAddBtn: React.Dispatch<React.SetStateAction<boolean>>;
  handleEdit: HandleEdit;
  onDelete: HandleDelete;
  deleting: boolean;
  loadRowsData: any;
  setFreezeInput: React.Dispatch<React.SetStateAction<boolean>>;
}

const Row: React.FC<RowProps> = ({
  item,
  setAddBtn,
  handleEdit,
  onDelete,
  deleting,
  loadRowsData,
  setFreezeInput,
}) => {
  const { t } = useLang();

  const [openAlert, setOpenAlert] = useState(false);
  const [statusChangeAlert, setStatusChangeAlert] = useState(false);
  const [newStatus, setNewStatus] = useState(item.isActive);

  const handleCloseAlert: () => void = () => setOpenAlert(false);
  const handleClickOpen: () => void = () => setOpenAlert(true);

  const handleCloseStatusChangeAlert: () => void = () =>
    setStatusChangeAlert(false);
  const handleOpenStatusChangeAlert: (status: boolean) => void = (
    status: boolean
  ) => {
    setNewStatus(status);
    setStatusChangeAlert(true);
  };

  const handleDelete: (id: number) => void = (id: number) => {
    onDelete(id);
  };

  const handleStatusChange: (
    id: number,
    currentStatus: boolean
  ) => Promise<void> = async (id: number, currentStatus: boolean) => {
    try {
      // Toggle the status
      const newStatus: boolean = !item.isActive;

      // Call API with updated status
      const statusChangeObj: StatusChangeObject = { id, isActive: newStatus };
      await statusChangeTestType(statusChangeObj);

      // Update local state after successful API call
      // setIsActive(newStatus);
      toast.success(
        t("Status changed to {{status}}", {
          status: newStatus ? t("Active") : t("Inactive"),
        })
      );
    } catch (error) {
      console.error("Error handling status change:", error);
      toast.error(t("Error handling status change. Please try again."));
    } finally {
      // You may want to reload data after status change
      loadRowsData();
    }
  };

  const handleConfirmStatusChange: () => void = () => {
    handleStatusChange(item.id, newStatus);
    handleCloseStatusChangeAlert();
  };

  const rows = [
    { label: "Test Type", value: item.testType },
    { label: "Description", value: item.description },
    { label: "Requisition Type", value: item.reqTypeName },
    {
      label: "Status",
      value: item.isActive ? (
        <div className="d-flex justify-content-center">
          <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
        </div>
      ) : (
        <div className="d-flex justify-content-center">
          <i className="fa fa-ban text-danger mr-2 w-20px"></i>
        </div>
      ),
    },
  ];

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} key={item.id}>
        <TableCell>
          <div className="d-flex justify-content-center">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id="dropdown-button-drop-end"
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              <>
                {item.isActive ? (
                  <>
                    <PermissionComponent
                      moduleName=""
                      pageName="Test Type"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        eventKey="1"
                        onClick={() => {
                          setAddBtn(true);
                          setFreezeInput(true);
                          handleEdit(item);
                        }}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-edit text-success mr-2 w-20px"
                            style={{ fontSize: "16px", color: "green" }}
                          ></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>

                    <PermissionComponent
                      moduleName=""
                      pageName="Test Type"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item eventKey="3" onClick={handleClickOpen}>
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-trash text-danger mr-2"
                            style={{ fontSize: "16px", color: "green" }}
                          ></i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                ) : null}

                <PermissionComponent
                  moduleName=""
                  pageName="Test Type"
                  permissionIdentifier="StatusChange"
                >
                  <Dropdown.Item
                    eventKey="2"
                    onClick={() => handleOpenStatusChangeAlert(!item.isActive)}
                  >
                    <span className="menu-item px-3">
                      {item.isActive ? (
                        <i
                          className="fa-solid fa-ban text-danger mr-2 w-20px"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                      ) : (
                        <i
                          className="fa fa-circle-check text-success mr-2 w-20px"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                      )}
                      {item.isActive ? t("Inactive") : t("Active")}
                    </span>
                  </Dropdown.Item>
                </PermissionComponent>
              </>
            </DropdownButton>
          </div>
        </TableCell>
        {rows.map((row, index) => (
          <TableCell key={index} align="left" scope="row">
            {row.value}
          </TableCell>
        ))}
      </TableRow>

      {/* Delete Confirmation Modal */}
      <BootstrapModal
        show={openAlert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record?")}
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
            onClick={() => handleDelete(item.id)}
            disabled={deleting}
          >
            {deleting ? <LoaderIcon /> : t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>

      {/* Status Change Confirmation Modal */}
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
            disabled={deleting}
          >
            {deleting ? t("Processing...") : t("Confirm")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default Row;
