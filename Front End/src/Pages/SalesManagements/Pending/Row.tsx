import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";

type ModalType = "approve" | "reject";

interface RowProps {
  item: any;
  userId: string;
  handleStatusChange: (userId: string, newStatus: string) => Promise<void>;
}

const Row: React.FC<RowProps> = ({ item, userId, handleStatusChange }) => {
  const { t } = useLang();

  const [modalType, setModalType] = useState<ModalType | null>(null);
  const [openAlert, setOpenAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
    setModalType(null);
  };

  const handleOpenModal = (type: ModalType) => {
    setModalType(type);
    setOpenAlert(true);
  };

  const handleAction = async () => {
    if (!modalType) return;
    setDeleting(true);

    try {
      await handleStatusChange(
        item.userId,
        modalType === "approve" ? "Approved" : "Rejected"
      );
    } catch (error) {
      console.error("Error handling status change:", error);
    } finally {
      setDeleting(false);
      setOpenAlert(false);
    }
  };

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
                <PermissionComponent
                  moduleName="Manage Sales Rep"
                  pageName="Sales Rep Request"
                  permissionIdentifier="View"
                >
                  <Dropdown.Item eventKey="1">
                    <Link
                      className="text-dark w-100 h-100"
                      to={`/salesUser-view-by-id/${btoa(item.userId)}`}
                    >
                      <span className="menu-item px-3">
                        <i
                          className="fa fa-eye text-warning mr-2 w-20px"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                        {t("View")}
                      </span>
                    </Link>
                  </Dropdown.Item>
                </PermissionComponent>

                <PermissionComponent
                  moduleName="Manage Sales Rep"
                  pageName="Sales Rep Request"
                  permissionIdentifier="Approve"
                >
                  <Dropdown.Item
                    eventKey="2"
                    onClick={() => handleOpenModal("approve")}
                  >
                    <span className="menu-item px-3">
                      <i
                        className="fa fa-check text-green mr-2  w-20px"
                        style={{ fontSize: "16px", color: "green" }}
                      ></i>
                      {t("Approve")}
                    </span>
                  </Dropdown.Item>
                </PermissionComponent>

                <PermissionComponent
                  moduleName="Manage Sales Rep"
                  pageName="Sales Rep Request"
                  permissionIdentifier="Reject"
                >
                  <Dropdown.Item
                    eventKey="3"
                    onClick={() => handleOpenModal("reject")}
                  >
                    <span className="menu-item px-3">
                      <i
                        className="fa-solid fa-x text-red mr-2  w-20px"
                      ></i>
                      {t("Reject")}
                    </span>
                  </Dropdown.Item>
                </PermissionComponent>
              </>
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.firstName}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.lastName}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.positionTitle}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.salesRepNumber}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.email}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.phoneNumber}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>{item.createdBy}</span>
        </TableCell>
        <TableCell align="left" scope="row">
          <span>
            {new Date(item.createdDate).toLocaleDateString("en-US", {
              month: "numeric",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </TableCell>
      </TableRow>

      <BootstrapModal
        show={openAlert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Change Status")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {`Are you sure you want to ${
            modalType === "approve" ? "approve" : "reject"
          } this record?`}
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
            className="btn btn-info m-2"
            onClick={handleAction}
            disabled={deleting}
          >
            {deleting ? "Processing..." : "Confirm"}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default Row;
