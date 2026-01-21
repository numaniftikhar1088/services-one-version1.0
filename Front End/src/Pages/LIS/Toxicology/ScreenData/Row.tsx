import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon, LoaderIcon } from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { validateFields } from "../CommonFunctions";
import useLang from "Shared/hooks/useLanguage";

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
}
const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  loadGridData: Function;
  request: any;
  setRequest: any;
  setIsAddButtonDisabled: any;
  queryDisplayTagNames: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    loadGridData,
    request,
    setRequest,
    setIsAddButtonDisabled,
    queryDisplayTagNames,
  } = props;

  const { t } = useLang();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.ID === r.ID) {
          return { ...row, rowStatus: true };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  const saveNewScreenTabData = async () => {
    let isValid = true;
    let invalidField: string | null = null;
    const ignoreFields: string[] = ["DetectionWindow", "Linearity"];

    if (!(row.DetectionWindow || row.Linearity)) {
      ({ isValid, invalidField } = validateFields(row, ignoreFields));
    }

    if (isValid) {
      try {
        await RequisitionType.saveScreenDataTabTox(row).then((res: any) => {
          setIsAddButtonDisabled(false);
          toast.success(res.data.message);
          loadGridData(true);
        });
      } catch (err) {
        console.error(err, "err");
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`
        : "Invalid field found";
      toast.error(errorMessage);
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
                      id={`compendiumDataScreenDataLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataScreenDataSave`}
                      onClick={() => saveNewScreenTabData()}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataScreenDataCansel`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (row.ID !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.ID === row.ID) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(false);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
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
                  id={`compendiumDataScreenData3Dots_${row.ID}`}
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
                        id={`compendiumDataScreenDataEdit`}
                        eventKey="2"
                        onClick={() => getValues(row, "Edit")}
                        className="w-auto"
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
        {/* <TableCell
          id={`compendiumDataScreenDataDrugClass_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataDrugClass`}
                  type="text"
                  name="DrugClass"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Drug Class")}
                  value={row?.DrugClass}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.DrugClass}</span>
          )}
        </TableCell> */}
        <TableCell id={`compendiumDataScreenDataAnalyte_${row.ID}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataAnalyte`}
                  type="text"
                  name="Analyte"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Analyte")}
                  value={row?.Analyte}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.Analyte}</span>
          )}
        </TableCell>
        <TableCell id={`compendiumDataScreenDataCutOff_${row.ID}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataCutOff`}
                  name="Cutoff"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("CuttOff")}
                  value={row?.Cutoff}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.Cutoff}</span>
          )}
        </TableCell>
        <TableCell id={`compendiumDataScreenDataUnit_${row.ID}`} align="left">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataUnit`}
                  type="text"
                  name="Unit"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Unit")}
                  value={row?.Unit}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.Unit}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenDataSpecimenType_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataScreenDataSpecimenType`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.SpecimenTypeLookup}
                  placeholder={"Select..."}
                  onChange={(event: any) =>
                    handleChange("SpecimenTypeId", event.value, row?.ID)
                  }
                  value={dropDownValues?.SpecimenTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.SpecimenTypeId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenDataTestCode_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`compendiumDataScreenDataTestCode`}
                type="text"
                name="TestCode"
                className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                placeholder={t("Test Code")}
                value={row?.TestCode}
                onChange={(event: any) =>
                  handleChange(event.target.name, event.target.value, row?.ID)
                }
              />
            </div>
          ) : (
            <span>{row?.TestCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenDataPerformingLab_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataScreenDataPerformingLab`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.ReferenceLabLookup}
                  placeholder={"Select..."}
                  onChange={(event: any) =>
                    handleChange("PerformingLabId", event.value, row?.ID)
                  }
                  value={dropDownValues?.ReferenceLabLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.PerformingLabId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.PerformingLab}</span>
          )}
        </TableCell>{" "}
        <TableCell
          id={`compendiumDataScreenDataShadowBox_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataShadowBox`}
                  type="text"
                  name="ShadowBox"
                  className="form-control bg-white min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Shadow Box")}
                  value={row?.ShadowBox}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.ShadowBox}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenDataStabilityDay_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenDataStabilityDay`}
                  type="text"
                  name="StabilityDay"
                  className="form-control bg-white min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Stability Days")}
                  value={row?.StabilityDay}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.StabilityDay}</span>
          )}
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
