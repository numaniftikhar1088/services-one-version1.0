import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { memo, useState } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";
import Select from "react-select";
import { toast } from "react-toastify";
import { reactSelectSMStyle, styles } from "Utils/Common";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon, LoaderIcon } from "Shared/Icons";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import {
  DeleteRecordPanelMapping,
  SavePanelMapping,
} from "Services/MicroBiology/PanelMapping";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";

export interface MicroBiologyPanelMappingRow {
  id: number;
  performingLabId: number;
  performingLabName: string;
  panelId: number;
  panelName: string;
  reflexOnPanelIds: number[];
  reflexOnPaneName: string;
  reflexOn: string;
  indivisualPanel: boolean;
  rowStatus: boolean;
  groupId: number;
  groupName: string;
}

const Row = (props: {
  rows: any;
  setRows: any;
  index: number;
  loadGridData: any;
  dropDownValues: any;
  setDropDownValues: any;
  ReflexOnPanelLookUp: any;
  queryDisplayTagNames: any;
  setIsAddButtonDisabled: any;
  row: MicroBiologyPanelMappingRow;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    loadGridData,
    dropDownValues,
    setDropDownValues,
    ReflexOnPanelLookUp,
    queryDisplayTagNames,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [openalert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCloseAlert = () => setOpenAlert(false);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      ReflexOnPanelLookUp(row.performingLabId);
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return {
            ...row,
            rowStatus: true,
          };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  const handleClickOpen = () => {
    setOpenAlert(true);
  };

  const DeleteRecord = async (id: number) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await DeleteRecordPanelMapping(id);
      if (res?.data?.httpStatusCode === 200) {
        toast.success(res?.data?.message);
        loadGridData(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const { isValid, invalidField } = validateFields({
      performingLabId: row.performingLabId,
      panelName: row.panelName?.trim(),
      reflexOnPanelIds: row.reflexOnPanelIds.length,
      reflexOn: row.reflexOn,
      groupId: row.groupId,
    });

    if (isValid) {
      setLoading(true);
      const submittedResults = {
        id: row.id,
        performingLabId: row.performingLabId,
        panelId: row.panelId,
        panelName: row.panelName,
        reflexOnPanelIds: row.reflexOnPanelIds,
        reflexOn: row.reflexOn,
        groupId: row.groupId,
        indivisualPanel:
          row.indivisualPanel === null || row.indivisualPanel === undefined
            ? true
            : row.indivisualPanel,
      };

      try {
        const response = await SavePanelMapping(submittedResults);

        if (response?.data?.httpStatusCode === 200) {
          setLoading(false);
          toast.success(response?.data?.message);
          loadGridData(true);
          setDropDownValues((prev: any) => ({
            ...prev,
            ReflexOnPanelList: [],
          }));
        } else {
          setLoading(false);
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(t("Something went wrong while saving data."));
        console.error("SavePanelMapping error:", error);
      } finally {
        setLoading(false);
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} Field`
        : "Invalid field found";

      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: any, id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) => {
        if (x.id !== id) return x;

        const updatedRow = {
          ...x,
          [name]: value,
        };

        // Reset reflexOnPanelId when performingLabId changes
        if (name === "performingLabId") {
          ReflexOnPanelLookUp(value);
          updatedRow.reflexOnPanelIds = [];
        }

        return updatedRow;
      })
    );
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {loading ? (
                    <button
                      id={`compendiumDataConfirmationDataLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`MicroBiologyPanelMappingSaveRow`}
                      onClick={handleSubmit}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`MicroBiologyPanelMappingCancelSaveRow`}
                    onClick={() => {
                      if (row.id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true);
                      } else {
                        const newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setDropDownValues((prev: any) => ({
                        ...prev,
                        ReflexOnPanelList: [],
                      }));
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
                  id={`MicroBiologyPanelMapping3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="Panel Mapping"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`MicroBiologyPanelMappingEdit`}
                      eventKey="1"
                      onClick={() => getValues(row, "Edit")}
                      className="w-auto"
                    >
                      <span className="menu-item px-3">
                        <i
                          className="fa fa-edit mr-2"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                        {t("Edit")}
                      </span>
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="Panel Mapping"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`MicroBiologyPanelMappingDelete`}
                      eventKey="2"
                      onClick={handleClickOpen}
                      className="w-auto"
                    >
                      <span className="menu-item px-2">
                        <i
                          className="fa fa-trash text-danger mr-3"
                          style={{ fontSize: "16px" }}
                        ></i>
                        {t("Delete")}
                      </span>
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`MicroBiologyPanelMappingPerformingLab_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="MicroBiologyPanelMapping_performingLab"
                  menuPortalTarget={document.body}
                  options={dropDownValues.PerformingLabList}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Performing Lab")}
                  name="performingLabId"
                  value={dropDownValues.PerformingLabList?.filter(
                    (item: any) => item?.value === row?.performingLabId
                  )}
                  onChange={(event: any) => {
                    handleChange("performingLabId", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.performingLabName}</span>
          )}
        </TableCell>
        <TableCell
          id={`MicroBiologyPanelMappingPanelName_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`MicroBiologyPanelMapping_PanelName`}
                  type="text"
                  name="panelName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Panel Name")}
                  value={row.panelName}
                  onChange={(event: any) => {
                    handleChange("panelName", event.target.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">{row?.panelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`MicroBiologyPanelMappingReflexOnPanel_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="MicroBiologyPanelMapping_reflexOnPanel"
                  menuPortalTarget={document.body}
                  isMulti
                  options={dropDownValues.ReflexOnPanelList}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Reflex On Panel")}
                  name="reflexOnPanelIds"
                  value={dropDownValues.ReflexOnPanelList?.filter(
                    (item: any) =>
                      Array.isArray(row?.reflexOnPanelIds) &&
                      row.reflexOnPanelIds.includes(item.value)
                  )}
                  onChange={(selectedOptions: any) => {
                    const values =
                      selectedOptions?.map((opt: any) => opt.value) || [];
                    handleChange("reflexOnPanelIds", values, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span className="text-capitalize">
              {dropDownValues?.ReflexOnPanelSearchList?.filter(
                (item: any) =>
                  Array.isArray(row?.reflexOnPanelIds) &&
                  row.reflexOnPanelIds.includes(item.value)
              )
                .map((item: any) => item.label)
                .join(", ")}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`MicroBiologyPanelMapping_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="MicroBiologyPanelMapping_reflexOn"
                  menuPortalTarget={document.body}
                  options={dropDownValues.ReflexOnList}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Reflex On")}
                  name="reflexOn"
                  value={dropDownValues.ReflexOnList?.filter(
                    (item: any) => item?.value === row?.reflexOn
                  )}
                  onChange={(event: any) => {
                    handleChange("reflexOn", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.reflexOn}</span>
          )}
        </TableCell>
        <TableCell
          id={`MicroBiologyPanelMapping_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId="MicroBiologyPanelMapping_groupId"
                  menuPortalTarget={document.body}
                  options={dropDownValues.GroupList}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Group Name")}
                  name="groupId"
                  value={dropDownValues.GroupList?.filter(
                    (item: any) => item?.value === row?.groupId
                  )}
                  onChange={(event: any) => {
                    handleChange("groupId", event.value, row.id);
                  }}
                />
              </div>
            </div>
          ) : (
            <span>{row?.groupName}</span>
          )}
        </TableCell>
        {row?.rowStatus ? (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch m-0">
                <input
                  id={`MicroBiologyPanelMappingIndivisualPanel`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="indivisualPanel"
                  checked={row?.indivisualPanel ?? true}
                  onChange={(event: any) => {
                    handleChange(
                      "indivisualPanel",
                      event.target.checked,
                      row.id
                    );
                  }}
                />
              </div>
            </div>
          </TableCell>
        ) : (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.indivisualPanel ?? true}
                  disabled={true}
                />
              </div>
            </div>
          </TableCell>
        )}
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
            id={`MicroBiologyPanelMappingCancel_${row.id}`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`MicroBiologyPanelMappingDelete_${row.id}`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => DeleteRecord(row?.panelId)}
            disabled={loading}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </React.Fragment>
  );
};

export default memo(Row);
