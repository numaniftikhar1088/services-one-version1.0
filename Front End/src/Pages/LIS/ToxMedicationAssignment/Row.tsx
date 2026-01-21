import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo, useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import AsyncSelect from "react-select/async";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: Function;
  request: any;
  setRequest: any;
  setIsAddButtonDisabled: any;
  setCondition: any;
  setId: any;
  setTestCode: any;
  parseJSONToArray: any;
  selectedMedications: any;
  setSelectedMedications: any;
  selectedMetabolite: any;
  setSelectedMetabolite: any;
  facility: any;
  setFacility: any;
  requisition: any;
  setRequisition: any;
  lab: any;
  setLab: any;
  DeleteRow: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    handleChange,
    handleSubmit,
    loadGridData,
    request,
    setRequest,
    setIsAddButtonDisabled,
    setId,
    parseJSONToArray,
    selectedMedications,
    setSelectedMedications,
    setSelectedMetabolite,
    facility,
    requisition,
    lab,
    DeleteRow,
  } = props;

  const { t } = useLang();

  const [selectedMedication, setSelectedMedication] = useState<any>(null);

  // Initialize medication selection when row becomes editable
  useEffect(() => {
    if (row.rowStatus && row.medicationListId && row.medicationName) {
      setSelectedMedication({
        value: row.medicationListId,
        label: `${row.medicationCode} - ${row.medicationName}`,
        medicationCode: row.medicationCode,
        medicationName: row.medicationName,
      });
    } else if (!row.rowStatus) {
      setSelectedMedication(null);
    }
  }, [row.rowStatus, row.medicationListId]);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      setId(r.medicationAssignmentId);
      console.log(row, "Row5858");
      setSelectedMedication({
        value: row.medicationListId,
        label: `${row.medicationCode} - ${row.medicationName}`,
        medicationCode: row.medicationCode,
        medicationName: row.medicationName,
      });
      const updatedRows = rows.map((row: any) => {
        if (row.medicationAssignmentId === r.medicationAssignmentId) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
    if (action === "Delete") {
      DeleteRow(r?.medicationAssignmentId);
      setSelectedMedications(
        row.medicationAssignmentId !== 0
          ? parseJSONToArray(row?.MedicationsJson)
          : []
      );
    }
  };
  // Load medication options for AsyncSelect
  const loadMedicationOptions = async (inputValue: string) => {
    if (!inputValue || inputValue.length < 2) {
      return [];
    }
    
    try {
      const response = await RequisitionType.GetToxMedication(inputValue);
      const medications = response.data.data || [];
      
      return medications.map((item: any) => ({
        value: item.id,
        label: `${item.medicationCode} - ${item.medicationName}`,
        medicationCode: item.medicationCode,
        medicationName: item.medicationName,
      }));
    } catch (error) {
      console.error(t("Error fetching medications:"), error);
      return [];
    }
  };

  const handleMedicationChange = (selectedOption: any) => {
    setSelectedMedication(selectedOption);
    
    if (selectedOption) {
      setRows((curr: any) =>
        curr.map((x: any) =>
          x.medicationAssignmentId === row?.medicationAssignmentId
            ? {
                ...x,
                medicationListId: selectedOption.value,
                medicationCode: selectedOption.medicationCode,
                medicationName: selectedOption.medicationName,
              }
            : x
        )
      );
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id={`MedicationAssignmentLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`MedicationAssignmentSave`}
                      onClick={() => {
                        handleSubmit(row);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`MedicationAssignmentCancel`}
                    onClick={() => {
                      if (row.medicationAssignmentId !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (
                            r.medicationAssignmentId ===
                            row.medicationAssignmentId
                          ) {
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
                      setSelectedMedication(null);
                      setSelectedMedications([]);
                      setSelectedMetabolite([]);
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
                  id={`MedicationAssignment3Dots_${row.medicationAssignmentId}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="Setup"
                      pageName="Medication Assignment"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`MedicationAssignmentEdit`}
                        className="w-auto"
                        eventKey="1"
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
                      moduleName="Setup"
                      pageName="Medication Assignment"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id={`MedicationAssignmentDelete`}
                        className="w-auto"
                        eventKey="2"
                        onClick={() => getValues(row, "Delete")}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa"
                            style={{ fontSize: "16px", color: "red" }}
                          >
                            &#xf014;
                          </i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`MedicationAssignmentMedicationName_${row.medicationAssignmentId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <AsyncSelect
                  inputId={`MedicationAssignmentMedicationName`}
                  cacheOptions
                  loadOptions={loadMedicationOptions}
                  onChange={handleMedicationChange}
                  value={selectedMedication}
                  placeholder={t("Type to search medications...")}
                  noOptionsMessage={({ inputValue }) =>
                    !inputValue || inputValue.length < 2
                      ? t("Type at least 2 characters to search")
                      : t("No medications found")
                  }
                  loadingMessage={() => t("Loading medications...")}
                  isClearable
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  menuPosition={"fixed"}
                  defaultOptions={false}
                />
              </div>
            </div>
          ) : (
            <span>{row?.medicationName}</span>
          )}
        </TableCell>
        <TableCell
          id={`MedicationAssignmentFacility_${row.medicationAssignmentId}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="d-flex">
              <div className="w-100">
                <Select
                  inputId={`MedicationAssignmentFacility`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={facility}
                  onChange={(event: any) => {
                    handleChange(
                      "facilityId",
                      "facilityName",
                      event.value,
                      row?.medicationAssignmentId,
                      event
                    );
                  }}
                  value={facility?.filter(function (option: any) {
                    return option.value === row?.facilityId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.facilityName}</span>
          )}
        </TableCell>
        <TableCell
          id={`MedicationAssignmentRequisition_${row.medicationAssignmentId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`MedicationAssignmentRequisition`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={requisition}
                  onChange={(event: any) => {
                    handleChange(
                      "reqTypeId",
                      "reqType",
                      event.value,
                      row?.medicationAssignmentId,
                      event
                    );
                  }}
                  value={requisition?.filter(function (option: any) {
                    return option.value === row?.reqTypeId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span> {row?.reqType}</span>
          )}
        </TableCell>

        <TableCell
          id={`MedicationAssignmentLab_${row.medicationAssignmentId}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`MedicationAssignmentLab`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={lab}
                  onChange={(event: any) => {
                    handleChange(
                      "labId",
                      "lab",
                      event.value,
                      row?.medicationAssignmentId,
                      event
                    );
                  }}
                  value={lab?.filter(function (option: any) {
                    return option.value === row?.labId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.lab}</span>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
