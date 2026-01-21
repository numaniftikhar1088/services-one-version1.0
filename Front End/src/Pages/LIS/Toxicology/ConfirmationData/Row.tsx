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

  const saveNewConfirmationTabData = async () => {
    const { isValid, invalidField } = validateFields(row);

    if (isValid) {
      await RequisitionType.saveConfirmationTabData(row)
        .then((res: any) => {
          toast.success(res.data.message);
          setIsAddButtonDisabled(false);
          loadGridData(true);
        })
        .catch((err: any) => {
          console.error(err, "err");
        });
    } else {
      toast.error(
        `Please Fill ${queryDisplayTagNames[invalidField ?? ""]} field`
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
                      id={`compendiumDataConfirmationDataLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataConfirmationDataSave`}
                      onClick={() => saveNewConfirmationTabData()}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataConfirmationDataCancel`}
                    onClick={(e) => {
                      e.preventDefault();
                      if (row.ID !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.ID === row.ID) {
                            return { ...r, rowStatus: false };
                          }
                          setRequest(false);
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
                  id={`compendiumDataConfirmationData3Dotd_${row.ID}`}
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
                        id={`compendiumDataConfirmationDataEdit_${row.ID}`}
                        className="w-auto"
                        eventKey="2"
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
        {/* <TableCell
          id={`compendiumDataConfirmationDataDrugClass_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataDrugClass`}
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

        <TableCell
          id={`compendiumDataConfirmationDataAnalyte_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataAnalyte`}
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
        <TableCell
          id={`compendiumDataConfirmationDataCutOff_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataCutOff`}
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

        <TableCell
          id={`compendiumDataConfirmationDataLinearity_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataLinearity`}
                  type="number"
                  name="Linearity"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Linearity")}
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
        <TableCell
          id={`compendiumDataConfirmationDataUnit_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataUnit`}
                  type="text"
                  name="Unit"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Unit")}
                  value={row?.Unit}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />{" "}
              </div>
            </div>
          ) : (
            <span>{row?.Unit}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataConfirmationDataSpecimenType_${row.ID}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataConfirmationDataSpecimenID`}
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
                />{" "}
              </div>
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataConfirmationDataTestCode_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataTestCode`}
                  type="text"
                  name="TestCode"
                  className="form-control bg-white min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Test Code")}
                  value={row?.TestCode}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.TestCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataConfirmationDataPerformingLab_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataConfirmationDataPerformingLab`}
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
        </TableCell>
        <TableCell
          id={`compendiumDataConfirmationDataDetectionWindow_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataDetectionWindow`}
                  type="text"
                  name="DetectionWindow"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Detection Window")}
                  value={row?.DetectionWindow}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.ID)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.DetectionWindow}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataConfirmationDataShadowbox_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataShadowBox`}
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
          id={`compendiumDataConfirmationDataStabilityDay_${row.ID}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataConfirmationDataStabilityDay`}
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
