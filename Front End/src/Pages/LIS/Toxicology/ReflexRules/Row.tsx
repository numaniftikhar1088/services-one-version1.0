import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";

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
  confirmationTestLookup: any;
}
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
  testCode: any;
  confirmationTestLookup: any;
  setIsEditing: any;
  screeningConfirmationTestLookup: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleSubmit,
    loadGridData,
    request,
    setRequest,
    setIsAddButtonDisabled,
    testCode,
    confirmationTestLookup,
    setIsEditing,
    screeningConfirmationTestLookup,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const rowIndex = rows.findIndex((row: any) => row.Id === r.Id);

      if (rowIndex !== -1) {
        setIsEditing({
          isEditing: true,
          rowIndex: rowIndex,
        });

        const updatedRows = rows.map((row: any, index: number) => {
          if (index === rowIndex) {
            return { ...row, rowStatus: true };
          }
          return row;
        });

        setRows(updatedRows);
      }
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
                      id={`compendiumDataReflexRulesLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataReflexRulesSave`}
                      onClick={() => {
                        handleSubmit(row);
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataReflexRulesCancel`}
                    onClick={() => {
                      if (row.Id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.Id === row.Id) {
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
                  id={`compendiumDataReflexRules3Dots_${row.Id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="TOX LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`compendiumDataReflexRulesEdit`}
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
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesPerformingLab_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataReflexRulesPerformingLab`}
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={dropDownValues?.ReferenceLabLookup}
                  onChange={(event: any) => {
                    handleChange(
                      "PerformingLabId",
                      event.value,
                      row?.Id,
                      event
                    );
                  }}
                  value={dropDownValues?.ReferenceLabLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.PerformingLabId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.PerformingLab}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesSpecimenType_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataReflexRulesSpecimenType`}
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={dropDownValues?.SpecimenTypeLookup}
                  onChange={(event: any) => {
                    handleChange("SpecimenTypeId", event.value, row?.Id, event);
                  }}
                  value={dropDownValues?.SpecimenTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.SpecimenTypeId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesScreenTestName_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataReflexRulesScreenTestName`}
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={testCode?.ScreeningLookup}
                  onChange={(event: any) => {
                    handleChange("ScreenTestId", event.value, row?.Id, event);
                  }}
                  value={testCode?.ScreeningLookup?.filter(function (
                    option: any
                  ) {
                    return option.value === row?.ScreenTestId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ScreenDrugClass}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesTestName_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={screeningConfirmationTestLookup}
                  onChange={(event: any) => {
                    handleChange("ScreenTestName", event.value, row?.Id, event);
                  }}
                  value={screeningConfirmationTestLookup.filter(function (
                    option: any
                  ) {
                    return option.label === row?.ScreenTestName;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ScreenTestName}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesScreenTestCode_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataReflexRulesScreenTestCode`}
                  type="text"
                  name="ScreenTestCode"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Screen Test Code")}
                  value={row?.ScreenTestCode}
                  disabled={true}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ScreenTestCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesConfirmationDrugClass_${row.Id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataReflexRulesConfirmationDrugClass`}
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={testCode?.ConfirmationLookup}
                  onChange={(event: any) => {
                    handleChange(
                      "ConfirmationDrugClass",
                      event.value,
                      row?.Id,
                      event
                    );
                  }}
                  value={testCode?.ConfirmationLookup?.filter(function (
                    option: any
                  ) {
                    return option.value === row?.ConfirmationDrugClassId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ConfirmationDrugClass}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesTestName_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataReflexRulesTestName`}
                  placeholder={"Select..."}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme: any) => styles(theme)}
                  options={confirmationTestLookup}
                  onChange={(event: any) => {
                    handleChange(
                      "ConfirmationTestId",
                      event.value,
                      row?.Id,
                      event
                    );
                  }}
                  value={confirmationTestLookup.filter(function (option: any) {
                    return option.value === row?.ConfirmationTestId;
                  })}
                  menuPosition={"fixed"}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ConfirmationTestName}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataReflexRulesTestCode_${row.Id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`compendiumDataReflexRulesTestCode`}
                type="text"
                name="ConfirmationTestCode"
                className="form-control min-w-250px w-100 rounded-2 fs-8 h-33px"
                placeholder={t("Confirmation Test Code")}
                value={row?.ConfirmationTestCode}
                disabled={true}
              />
            </div>
          ) : (
            <span>{row?.ConfirmationTestCode}</span>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
