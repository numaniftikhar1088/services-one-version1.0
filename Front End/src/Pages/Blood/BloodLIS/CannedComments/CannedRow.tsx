import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { CannedAndRejectionSave } from "../../../../Services/BloodLisSetting/BloodLisSetting";
import useLang from "../../../../Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon } from "../../../../Shared/Icons";

function CannedRow({
  row,
  index,
  onDelete,
  rows,
  setRows,
  setIsAddButtonDisabled,
  getCannedCommentsRejectionRecords,
}: any) {
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

  const handleDelete = (id: number) => {
    onDelete(id);
  };

  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };

  const getValues = (r: any) => {
    const updatedRows = rows.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setRows(updatedRows);
  };

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const handlesave = async () => {
    if (row.displayText.length === 0 && row.displayName.length === 0) {
      toast.error(t("Please Enter Comment ."));
      return;
    }
    if (row.displayName.length === 0) {
      toast.error(t("Please Enter Comment Name."));
      return;
    }
    if (row.displayText.length === 0) {
      toast.error(t("Please Enter Comment Text."));
      return;
    }

    let resp = await CannedAndRejectionSave(row);
    console.log(row, "row");
    getCannedCommentsRejectionRecords();
    setIsAddButtonDisabled(false);
    handleClose("dropdown2");
  };

  return (
    <>
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            {row?.rowStatus ? (
              <div className="gap-2 d-flex">
                <button
                  id={`BloodLisSettingCannedCommentSave`}
                  onClick={() => {
                    handlesave();
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`BloodLisSettingCannedCommentCancel`}
                  onClick={() => {
                    getCannedCommentsRejectionRecords();
                    handleClose("dropdown2");
                    if (row?.id != 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === row?.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                    } else {
                      let newArray = [...rows];
                      newArray.splice(index, 1);
                      setRows(newArray);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`BloodLisSettingCannedComment3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="EditCannedComment"
                  >
                    <Dropdown.Item
                      id={`BloodLisSettingCannedCommentEdit`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => {
                        getValues(row);
                      }}
                    >
                      <i className={"fa fa-edit text-primary mr-2"}></i>
                      {t("Edit")}
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="DeleteCannedComment"
                  >
                    <Dropdown.Item
                      id={`BloodLisSettingCannedCommentDelete`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => handleClickOpen(row, row.id)}
                    >
                      <i className={"fa fa-trash text-danger mr-2 w-20px"}></i>
                      {t("Delete")}
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`BloodLisSettingCannedCommentDisplayName_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`BloodLisSettingCannedCommentDisplayName`}
                type="text"
                placeholder={t("Display Name")}
                name="displayName"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.displayName}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.displayName
          )}
        </TableCell>
        <TableCell
          id={`BloodLisSettingCannedCommentDisplayText_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`BloodLisSettingCannedCommentDisplayText`}
                type="text"
                placeholder={t("Display Text")}
                name="displayText"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.displayText}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.displayText
          )}
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
            id={`BloodLisSettingCannedCommentModalDeleteCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BloodLisSettingCannedCommentModalDelete`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row?.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default CannedRow;
