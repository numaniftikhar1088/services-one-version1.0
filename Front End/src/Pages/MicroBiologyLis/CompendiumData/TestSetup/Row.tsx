import { TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { CannedAndRejectionSave } from "../../../../Services/BloodLisSetting/BloodLisSetting";
import useLang from "../../../../Shared/hooks/useLanguage";
import Select from "react-select";
import { CrossIcon, DoneIcon } from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { MicroBioTestSetupPostData } from "Services/MicroBiologyCompendium/MicrobiologyCompendium";

function CompendiumTestSetupRow({
  row,
  index,
  onDelete,
  rows,
  referenceLab,
  setRows,
  setIsAddButtonDisabled,
  handleChangePerformingLab,
  GetAllTestSetupData,
}: any) {
  const { t } = useLang();
  const [disableSaveBbutton, setDisableSaveBbutton] = useState(false);

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
  console.log(row);

  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };

  const getValues = (r: any) => {
    const updatedRows = rows.map((row: any) => {
      if (row.testId === r.testId) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setRows(updatedRows);
  };

  // ✅ FIXED: Now testMethod, testName, testCode update correctly
  const handleChange = (name: string, value: string, testId: number) => {
    setRows((curr: any) =>
      curr.map((x: any) => (x.testId === testId ? { ...x, [name]: value } : x))
    );
  };

  const handlesave = async () => {
    try {
      if (!row.testName || !row.testName.trim()) {
        toast.error(t("Test Name cannot be empty."));
        return;
      }
      if (row.labId === 0) {
        toast.error(t("Performing Lab cannot be empty."));
        return;
      }
      if (!row.testCode || !row.testCode.trim()) {
        toast.error(t("Test Code cannot be empty."));
        return;
      }
      setDisableSaveBbutton(true);
      const res = await MicroBioTestSetupPostData(row);

      if (res?.data?.httpStatusCode === 200) {
        setDisableSaveBbutton(false);
        GetAllTestSetupData();
        setIsAddButtonDisabled(false);
        handleClose("dropdown2");
        toast.success(res?.data?.message);
      } else {
        toast.error(res?.data?.message || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error in handlesave:", error);
      toast.error("An unexpected error occurred.");
    }
  };
  console.log(row, "TestSetupRow");

  return (
    <>
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            {row?.rowStatus ? (
              <div className="gap-2 d-flex">
                <button
                  disabled={disableSaveBbutton}
                  id={`MicrobiologuCompendiumSave`}
                  onClick={() => {
                    handlesave();
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`MicrobiologuCompendiumCancel`}
                  onClick={() => {
                    GetAllTestSetupData();
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
                  id={`MicrobiologuCompendium3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`MicrobiologuCompendiumEdit`}
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
                    moduleName="Microbiology LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`MicrobiologuCompendiumDelete`}
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

        {/* Test Name */}
        <TableCell
          id={`MicrobiologuCompendiumtestName_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologuCompendiumDisplayName`}
                type="text"
                placeholder={t("Display Name")}
                name="testName"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.testName}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.testId)
                }
              />
            </div>
          ) : (
            row?.testName
          )}
        </TableCell>

        {/* Lab Select */}
        <TableCell
          id={`MicrobiologuCompendiumDisplayText_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`BloodCompendiumDataCategorySetupGroup`}
                  menuPortalTarget={document.body}
                  theme={(theme) => styles(theme)}
                  options={referenceLab}
                  name="labId"
                  styles={reactSelectSMStyle}
                  placeholder={t("Performing Lab")}
                  value={referenceLab.find((i: any) => i.value === row.labId)}
                  onChange={
                    (e: any) => handleChangePerformingLab(row.testId, e) 
                  }
                />
              </div>
            </div>
          ) : (
            row?.labName
          )}
        </TableCell>

        {/* Test Method */}
        <TableCell
          id={`MicrobiologuCompendiumtestMethod_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className=" d-flex">
              <input
                id={`MicrobiologuCompendiumtestMethod`}
                type="text"
                placeholder={t("Display Name")}
                name="testMethod"
                disabled
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.testMethod || ""}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.testId)
                }
              />
            </div>
          ) : (
            row?.testMethod
          )}
        </TableCell>

        {/* Test Code */}
        <TableCell
          id={`MicrobiologuCompendiumtestCode_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologuCompendiumtestCode`}
                type="text"
                placeholder={t("Display Name")}
                name="testCode"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.testCode || ""}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.testId)
                }
              />
            </div>
          ) : (
            row?.testCode
          )}
        </TableCell>
      </TableRow>

      {/* Delete Modal */}
      <BootstrapModal
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
            id={`MicrobiologuCompendiumModalCancel_${row.id}`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`MicrobiologuCompendiumModalDelete_${row.id}`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row?.testId)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default CompendiumTestSetupRow;
