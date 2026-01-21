import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo, useState } from "react";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";

import Select from "react-select";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import PanelReportingRules from "./PanelReportingRules";
import PanelMappingService from "Services/InfectiousDisease/PanelMappingService";
import { toast } from "react-toastify";

export interface ITableObj {
  id: number;
  panelId: number;
  performingLabId: number;
  performingLabName: string;
  panelName: string;
  panelCode: string;
  assayName: string;
  organism: string;
  testCode: string;
  groupName: string;
  antibioticClass: string;
  assayNameId: number;
  reportingRuleId: number;
  groupNameId: number;
  reportingRuleName: string;
  resistance: boolean;
  numberOfRepeated: number;
  numberOfDetected: number;
  createDate: string;
  rowStatus: boolean | undefined;
  subPanelName: string;
}
const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  // updateRow: Function
  // handleDelete: Function;
  handleChange: Function;
  handleChangeCheckBox: Function;
  handleChangeAssay: Function;
  handleSubmit: Function;
  loadGridData: Function;
  handleChangePanelMappinfId: any;
  selectedBox: any;
  request: any;
  setRequest: any;
  handleChangeForDetected: any;
  handleChangeforRepeated: any;
  setIsAddButtonDisabled: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleChangeCheckBox,
    handleChangeAssay,
    // updateRow,
    // handleDelete,
    handleSubmit,
    loadGridData,
    handleChangePanelMappinfId,
    selectedBox,
    request,
    setRequest,
    handleChangeForDetected,
    handleChangeforRepeated,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();
  const [openAlert, setOpenAlert] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const handleCloseAlert: () => void = () => setOpenAlert(false);
  const handleClickOpen: () => void = () => setOpenAlert(true);
  const deleteRow = (id: number) => {
    setDeleting(true);
    PanelMappingService.deletePanelMapping(id)
      .then((res: any) => {
        if (res?.status === 200) {
          toast.success(t("Panel mapping deleted successfully"));
          setOpenAlert(false);

          setRows((prevRows: any) =>
            prevRows.filter((row: any) => row.panelId !== id)
          );
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: any) => {
        console.error("Error deleting panel mapping:", err);
        toast.error(t("Something went wrong while deleting"));
      })
      .finally(() => {
        setDeleting(false);
        setOpenAlert(false);
        loadGridData();
      });
  };
  // const [editMode, setEditMode] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const getValues = (r: any, action: string) => {
    if (action === "Delete") {
      deleteRow(r?.panelId);
    }

    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {!row.rowStatus ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                {open ? (
                  <button
                    id={`IDCompendiumDataPanelMapingCloseExpand_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`IDCompendiumDataPanelMapingShowExpand_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </IconButton>
            ) : null}
          </div>
        </TableCell>
        <TableCell className="w-20px min-w-20px">
          <div className="d-flex justify-content-center">
            <label className="form-check form-check-sm form-check-solid">
              <input
                id={`IDCompendiumDataPanelMaping_${row.id}`}
                className="form-check-input"
                type="checkbox"
                checked={selectedBox?.id?.includes(row?.id)}
                onChange={(e) =>
                  handleChangePanelMappinfId(e.target.checked, row?.id)
                }
              />
            </label>
          </div>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id="PanelMapingLoadButton"
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id="PanelMapingSaveRow"
                      onClick={() => handleSubmit(row)}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id="PanelMapingCloseRow"
                    onClick={() => {
                      if (row.id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setRequest(false);
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
              </>
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`IDCompendiumDataPanelMaping3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`IDCompendiumDataPanelMapingEdit`}
                        className="w-auto"
                        eventKey="2"
                        onClick={() => getValues(row, "Edit")}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-edit"
                            style={{ fontSize: "16px", color: "green" }}
                          ></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id={`IDCompendiumDataPanelMapingDelete`}
                        className="w-auto"
                        eventKey="2"
                        onClick={() => handleClickOpen()}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-trash text-danger"
                            style={{ fontSize: "16px", color: "green" }}
                          ></i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                </DropdownButton>
              </div>
            )}
            <BootstrapModal
              show={openAlert}
              onHide={handleCloseAlert}
              backdrop="static"
              keyboard={false}
            >
              <BootstrapModal.Header
                closeButton
                className="bg-light-primary m-0 p-5"
              >
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
                  onClick={() => deleteRow(row.panelId)}
                  disabled={deleting}
                >
                  {/* {t("Delete")} */}
                  {deleting ? <LoaderIcon /> : t("Delete")}
                </button>
              </BootstrapModal.Footer>
            </BootstrapModal>
          </div>
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingPerformingLab_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingPerformingLab`}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.PerformingLabList}
                  onChange={(event: any) =>
                    handleChange("performingLabId", event.value, row?.id)
                  }
                  value={dropDownValues?.PerformingLabList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.performingLabId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.performingLabName}
            </span>
          )}
        </TableCell>

        <TableCell
          id={`IDCompendiumDataPanelMapingPanelName_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataPanelMapingPanelName`}
                  type="text"
                  name="panelName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Panel Name")}
                  value={row?.panelName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.panelName}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingSubPanelName_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className=" d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataPanelMapingSubPanelName`}
                  type="text"
                  name="subPanelName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Sub Panel Name")}
                  value={row?.subPanelName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.subPanelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingPanelCode_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataPanelMapingPanelCode`}
                  type="text"
                  name="panelCode"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Panel Code")}
                  value={row?.panelCode}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.panelCode}
            </span>
          )}
        </TableCell>

        <TableCell
          id={`IDCompendiumDataPanelMapingAssayDataList_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingAssayDataList`}
                  placeholder={t("Select...")}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.AssayDataList}
                  onChange={(event: any) => {
                    //

                    handleChangeAssay(
                      "assayNameId",
                      event.value,
                      row?.id,
                      event
                    );
                  }}
                  value={dropDownValues?.AssayDataList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.assayNameId;
                  })}
                  isDisabled={row.id === 0 ? false : true}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.assayName}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingorganism_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <span>{row?.organism}</span>
          ) : (
            <span>{row?.organism}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingtestCode_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <span>{row?.testCode}</span>
          ) : (
            <span>{row?.testCode}</span>
          )}
        </TableCell>

        <TableCell
          id={`IDCompendiumDataPanelMapingReportingRulesList_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingReportingRulesList`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Select...")}
                  options={dropDownValues?.ReportingRulesList}
                  onChange={(event: any) =>
                    handleChange("reportingRuleId", event.value, row?.id)
                  }
                  value={dropDownValues?.ReportingRulesList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.reportingRuleId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.reportingRuleName}
            </span>
          )}
        </TableCell>

        <TableCell
          id={`IDCompendiumDataPanelMapingGroupList_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingGroupList`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Select...")}
                  options={dropDownValues?.GroupList}
                  onChange={(event: any) =>
                    handleChange("groupNameId", event.value, row?.id)
                  }
                  value={dropDownValues?.GroupList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.groupNameId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.groupName}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingAntibioticClass_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelMapingAntibioticClass`}
              type="text"
              name="antibioticClass"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Antibiotic Class")}
              value={row?.antibioticClass}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.antibioticClass}
            </span>
          )}
        </TableCell>
        {/* <TableCell scope="row">
          {row.rowStatus ? (
            <Checkbox
              // type="checkbox"
              name="resistance"
              value={row?.resistance}
              onChange={(event: any) => {
                handleChangeCheckBox(
                  event.target.name,
                  event.target.value,
                  row?.id,
                )

                
              }}
              checked={true}
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.resistance ? <span>Yes</span> : <span>No</span>}
            </span>
          )}
        </TableCell> */}

        {/* <TableCell scope="row">
          {row.rowStatus ? (
            editMode ? (
              <Checkbox
                name="resistance"
                value={row?.resistance}
                onChange={(event) =>
                  handleChangeCheckBox(
                    event.target.name,
                    event.target.value,
                    row?.id,
                  )
                }
                checked={row?.resistance}
              />
            ) : (
              <Checkbox
                name="resistance"
                value={row?.resistance}
                onChange={(event) =>
                  handleChangeCheckBox(
                    event.target.name,
                    event.target.value,
                    row?.id,
                  )
                }
                checked={true} // Checked in "add mode"
              />
            )
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.resistance ? <span>Yes</span> : <span>No</span>}
            </span>
          )}
        </TableCell> */}
        <TableCell
          id={`IDCompendiumDataPanelMapingResistance_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <label className="form-check form-check-sm form-check-solid">
              <input
                id={`IDCompendiumDataPanelMapingResistance`}
                className="form-check-input"
                name="resistance"
                type="checkbox"
                checked={row?.resistance} // Set the checked prop based on row.resistance value
                onChange={(event: any) => {
                  handleChangeCheckBox(event, row?.id);
                }}
              />
            </label>
          ) : (
            <span>
              {row?.resistance ? (
                <span>{t("Yes")}</span>
              ) : (
                <span>{t("No")}</span>
              )}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingNumberOfRepeated_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelMapingNumberOfRepeated`}
              type="text"
              name="numberOfRepeated"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Number Of Repeated")}
              value={row?.numberOfRepeated}
              onChange={(event: any) =>
                handleChangeforRepeated(
                  event.target.name,
                  event.target.value,
                  row?.id
                )
              }
              min="1" // Set minimum value to 1
              required // Make the input required
            />
          ) : (
            <span>{row?.numberOfRepeated}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingNumberOfDetected_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelMapingNumberOfDetected`}
              type="text"
              name="numberOfDetected"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Number Of Detected")}
              value={row?.numberOfDetected}
              onChange={(event: any) =>
                handleChangeForDetected(
                  event.target.name,
                  event.target.value,
                  row?.id
                )
              }
              min="1" // Set minimum value to 1
              required // Make the input required
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChangeForDetected(
                  event.target.name,
                  event.target.value,
                  row?.id
                )
              }
            >
              {row?.numberOfDetected}
            </span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <PanelReportingRules id={row?.id} row={row} />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      {/* Delete Confirmation Modal */}
    </React.Fragment>
  );
};

export default memo(Row);
