///////////////////////////////////
// src\Pages\MicroBiologyLis\LisSetting/Row.tsx
import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import { MicroBioSaveData } from "Services/MicroBiologyLIS/MicroBiologyLISSetting";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon } from "Shared/Icons";

function MicrobiologyLisRow({
  row,
  index,
  onDelete,
  rows,
  setRows,
  setIsAddButtonDisabled,
  getMicroBiologyLISRecords,
  isDeleting,
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

  // const getValues = (r: any) => {
  //   const updatedRows = rows.map((row: any) => {
  //     if (row.id === r.id) {
  //       return { ...row, rowStatus: true };
  //     }
  //     return row;
  //   });
  //   setRows(updatedRows);
  // };

  // Add this check to determine if any row is in edit mode
  const isAnyRowInEditMode = rows.some((r: any) => r.rowStatus === true);

  // Update the getValues function (keep it as is)
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

  // Add a new state for managing the saving status
  const [isSaving, setIsSaving] = useState(false);

  // Update the handlesave function
  const handlesave = async () => {
    setIsSaving(true); // Disable the button
    try {
      let resp = await MicroBioSaveData(row);
      if (resp?.data?.statusCode === 200) {
        console.log(resp, "resprespresp");
        console.log(row, "row");
        getMicroBiologyLISRecords();
        setIsAddButtonDisabled(false);
        handleClose("dropdown2");
      } else {
        toast.error(resp?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An error occurred while saving.");
    } finally {
      setIsSaving(false); // Re-enable the button
    }
  };

  console.log(row, "rowrow");

  return (
    <>
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            {row?.rowStatus ? (
              <div className="gap-2 d-flex">
                <button
                  id={`MicrobiologyLisSettingSave`}
                  onClick={() => {
                    handlesave();
                  }}
                  disabled={isSaving} // Add this line
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  {isSaving ? (
                    <span
                      // className="spinner-border spinner-border-sm align-middle ms-2"
                      role="status"
                      aria-hidden="true"
                    >
                      ...
                    </span>
                  ) : (
                    <DoneIcon />
                  )}

                  {/* <DoneIcon /> */}
                </button>
                <button
                  id={`MicrobiologyLisSettingCancel`}
                  onClick={() => {
                    getMicroBiologyLISRecords();
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
                  id={`MicrobiologyLisSetting3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`MicrobiologyLisSettingEdit`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => {
                        getValues(row);
                      }}
                      disabled={isAnyRowInEditMode} // Add this line
                    >
                      <i className={"fa fa-edit text-primary mr-2"}></i>
                      {t("Edit")}
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="LIS Setting"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`MicrobiologyLisSettingDelete`}
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
          id={`MicrobiologyLisSettingColonyCount_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologyLisSettingColonyCount`}
                type="text"
                placeholder={t("Colony Count")}
                name="colonyCount"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.colonyCount}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.colonyCount
          )}
        </TableCell>
        <TableCell
          id={`MicrobiologyLisSettingPlateDescription_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologyLisSettingPlateDescription`}
                type="text"
                placeholder={t("Plate Description")}
                name="plateDescription"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.plateDescription}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.plateDescription
          )}
        </TableCell>
        <TableCell
          id={`MicrobiologyLisSettingOrganisms_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologyLisSettingOrganisms`}
                type="text"
                placeholder={t("Organism")}
                name="organismName"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.organismName}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.organismName
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
            id={`MicrobiologyLisSettingModalDeleteCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`MicrobiologyLisSettingModalDelete`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row?.id)}
            disabled={isDeleting}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default MicrobiologyLisRow;
