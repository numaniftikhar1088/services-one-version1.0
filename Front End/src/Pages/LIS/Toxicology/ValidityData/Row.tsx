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

  const saveNewValidityTabData = async () => {
    let isValid = true;
    let invalidField: string | null = null;
    const ignoreFields: string[] = [
      "DetectionWindow",
      "DrugClass",
      "ShadowBox",
      "StabilityDay",
    ];

    if (!row.DetectionWindow) {
      ({ isValid, invalidField } = validateFields(row, ignoreFields));
    }
    if (isValid) {
      try {
        const res = await RequisitionType.saveNewValidityTabData(row);
        setIsAddButtonDisabled(false);
        toast.success(res.data.message);
        loadGridData(true);
      } catch (err) {
        console.error(err, "err");
      }
    } else {
      if (invalidField === "Linearity") {
        toast.error(`Please Fill Reference Range High field`);
        return;
      } else if (invalidField === "Cutoff") {
        toast.error(`Please Fill Reference Range Low field`);
        return;
      } else {
        toast.error(
          `Please Fill ${queryDisplayTagNames[invalidField ?? ""]} field`
        );
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
                      id={`compendiumDataValidityDataLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataValidityDataSave`}
                      onClick={(e) => saveNewValidityTabData()}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataValidityDataCancel`}
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
                        loadGridData(true);
                      } else {
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        loadGridData(false);
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
                  id={`compendiumDataValidityData3Dots_${row.ID}`}
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
                        id={`compendiumDataValidityDataEdit`}
                        eventKey="2"
                        className="w-auto"
                        onClick={(e) => {
                          e.preventDefault();
                          getValues(row, "Edit");
                        }}
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
          id={`compendiumDataValidityDataAnalyte_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataValidityDataAnalyte`}
                  type="text"
                  name="Analyte"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Drug Class")}
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
        <TableCell
          id={`compendiumDataValidityDataCutOff_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataValidityDataCutOff`}
                  type="number"
                  name="Cutoff"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Reference Range Low")}
                  value={row?.Cutoff}
                  onChange={(event: any) =>
                    handleChange(
                      event.target.name,
                      event.target.value,
                      row?.ID
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.Cutoff}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataValidityDataLinearity_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataValidityDataLinearity`}
                  type="number"
                  name="Linearity"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Reference Range High")}
                  value={row?.Linearity || ""}
                  onChange={(event: any) =>
                    handleChange(
                      event.target.name,
                      +event.target.value,
                      row?.ID
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.Linearity}</span>
          )}
        </TableCell>
        <TableCell id={`compendiumDataValidityDataUnit_${row.ID}`} align="left">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataValidityDataUnit`}
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
          id={`compendiumDataValidityDataSpecimenType_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <Select
                inputId={`compendiumDataValidityDataSpecimenType`}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme) => styles(theme)}
                placeholder={"Select..."}
                options={dropDownValues?.SpecimenTypeLookup}
                onChange={(event: any) => {
                  handleChange("SpecimenTypeId", event.value, row?.ID, event);
                }}
                value={dropDownValues?.SpecimenTypeLookup.filter(function (
                  option: any
                ) {
                  return option.value === row?.SpecimenTypeId;
                })}
              />
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataValidityDataTestCode_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`compendiumDataValidityDataTestCode`}
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
          id={`compendiumDataValidityDataPerformingLab_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <Select
                inputId={`compendiumDataValidityDataPerformingLab`}
                menuPortalTarget={document.body}
                styles={reactSelectSMStyle}
                theme={(theme) => styles(theme)}
                options={dropDownValues?.ReferenceLabLookup}
                placeholder={"Select..."}
                onChange={(event: any) => {
                  handleChange("PerformingLabId", event.value, row?.ID, event);
                }}
                value={dropDownValues?.ReferenceLabLookup.filter(function (
                  option: any
                ) {
                  return option.value === row?.PerformingLabId;
                })}
              />
            </div>
          ) : (
            <span>{row?.PerformingLab}</span>
          )}
        </TableCell>
        {/* <TableCell scope="row">
          {row.rowStatus ? (
            <Select
                  menuPortalTarget={document.body}

              theme={(theme) => styles(theme)}
              options={dropDownValues?.GroupLookup}
              onChange={(event: any) => {
                handleChange("GroupNameId", event.value, row?.ID, event);
              }}
              value={dropDownValues?.GroupLookup.filter(function (option: any) {
                return option.value === row?.GroupNameId;
              })}
            />
          ) : (
            <span>{row?.GroupName}</span>
          )}
        </TableCell> */}
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
