import { MenuItem, TableCell, TableRow } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import { RestoreRecordUser } from "Services/UserManagement/UserManagementService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

function Row(props: { row: any; loadData: Function }) {
  const { row, loadData } = props;

  const { t } = useLang();

  const [value, setValue] = useState<any>(null);
  const [show, setShow] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openDrop = Boolean(anchorEl);

  const ModalhandleClose = () => setShow(false);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (userid: any) => {
    setShow(true);
    setValue(userid);
  };

  const RestoreRecord = (id: number) => {
    RestoreRecordUser(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadData(true, false);
          setShow(false);
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  return (
    <>
      <Modal
        show={show}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Restore Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to restore this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AdminArchivedRestoreModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AdminArchivedRestoreModalConfirm`}
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              RestoreRecord(value);
            }}
          >
            {t("Restore")}
          </button>
        </Modal.Footer>
      </Modal>
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`AdminArchived3Dots_${row.id}`}
              aria-controls={openDrop ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop ? "true" : undefined}
              onClick={handleClick}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl}
              open={openDrop}
              onClose={handleClose}
              anchorOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <PermissionComponent
                moduleName="Admin"
                pageName="User List"
                permissionIdentifier="Restore"
              >
                <MenuItem className="p-0">
                  <a
                    id={`AdminArchivedRestore`}
                    onClick={() => {
                      handleClose();
                      handleClickOpen(row.id);
                    }}
                    className=" w-125px p-0 text-dark"
                  >
                    <i
                      className="fa fa-undo text-primary mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Restore")}
                  </a>
                </MenuItem>
              </PermissionComponent>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell
          id={`AdminArchivedFirstName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.firstName}
        </TableCell>
        <TableCell id={`AdminArchivedLastName_${row.id}`}>
          {row?.lastName}
        </TableCell>
        <TableCell
          id={`AdminArchivedEmail_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row.adminEmail}
        </TableCell>
        <TableCell
          id={`AdminArchivedAdminType_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.adminType}
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
