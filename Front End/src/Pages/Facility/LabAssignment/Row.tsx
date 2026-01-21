import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AxiosResponse } from "axios";
import React, { SetStateAction, memo, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import useLang from "Shared/hooks/useLanguage";
import DropdownButton from "../../../Shared/DropdownButton";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import { TestSetupActionsArray } from "../../../Utils/Compendium/ActionsArray";
import Facility from "./FacilitySelection";

export interface ITableObj {
  id: number;
  profileName: string;
  refLabId: number;
  refLabName: string;
  reqTypeId: number;
  reqTypeName: string;
  insuranceId: number;
  insuranceName: string;
  genderId: number;
  genderName: string;
  groupIds: any;
  groupNames: string;
  isDefault: boolean;
  facilities: any;
  rowStatus: boolean;
}

const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  updateRow: Function;
  handleChange: Function;
  handleSubmit: Function;
  handleChangeGroups: any;
  selectedValues: any;
  handleChangeSwitch: any;
  loadFacilities: any;
  facilities: any;
  loadGridData: any;
  switchValue: any;
  setErrors: any;
  errors: any;
  request: any;
  setRequest: any;
  check: any;
  setCheck: any;
  errorsMessage: any;
  setErrorMessage: any;
  setIsAddButtonDisabled: React.Dispatch<SetStateAction<boolean>>;
  setDropDownValues: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    updateRow,
    handleSubmit,
    handleChangeGroups,
    selectedValues,
    handleChangeSwitch,
    loadFacilities,
    facilities,
    loadGridData,
    switchValue,
    setErrors,
    errors,
    request,
    setRequest,
    check,
    setCheck,
    errorsMessage,
    setErrorMessage,
    setIsAddButtonDisabled,
    setDropDownValues,
  } = props;
  const { t } = useLang();
  const [open, setOpen] = React.useState(false);
  const [sports2, setSports2] = useState<any>([]);

  const getValues = (r: any, action: string) => {
    const emptyRowExists = rows.some((row: any) => row.rowStatus === true);
    if (action === t("Edit") && !emptyRowExists) {
      FacilityService.groupLookup(row.reqTypeId).then((res: AxiosResponse) => {
        let genArray: any = [];
        res?.data?.forEach((val: any) => {
          let genDetails = {
            value: val?.value,
            label: val?.label,
          };
          genArray.push(genDetails);
          setDropDownValues((preVal: any) => {
            return {
              ...preVal,
              group: genArray,
            };
          });
        });
      });
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
    if (action === "Delete" && !emptyRowExists) {
      FacilityService.DeleteLabAssignment(row.id).then((res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.responseMessage);
          loadGridData(true, false);
        }
      });
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };
  console.log(row, "rowrow");

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          id={`Row_RowStatus_${row.id}`}
        >
          {!row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              {open ? (
                <button
                  id={`LabAsignmentHide_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  onClick={() => {
                    setSports2([]);
                  }}
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`LabAsignmentShow_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          id={`RowSave/Cancel_${row.id}`}
        >
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request && check ? (
                    <button id="LabAsignmentLoadButton" className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id="LabAsignmentSave"
                      onClick={() => handleSubmit(row)}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id="LabAsignmentCancel"
                    onClick={() => {
                      if (row.id != 0) {
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
                        setIsAddButtonDisabled(false);
                        setRows(newArray);
                        setErrors(false);
                        setRequest(false);
                        setErrorMessage((pre: any) => {
                          return {
                            profileName: "",
                            refLabName: "",
                            reqTypeName: "",
                            insuranceName: "",
                            groupNames: "",
                          };
                        });
                      }
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
              </>
            ) : (
              // <PermissionComponent
              //   moduleName="Facility"
              //   pageName="Lab Assignment"
              //   permissionIdentifier="Edit"
              // >
              <DropdownButton
                getValues={getValues}
                iconArray={TestSetupActionsArray}
                row={row}
              />
              // </PermissionComponent>
            )}
          </div>
        </TableCell>
        <TableCell
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          id={`ProfileName${row.id}`}
        >
          {row.rowStatus ? (
            <>
              <div className="required d-flex">
                <div className="w-100">
                  <input
                    id="LabAsignmentProfileName"
                    type="text"
                    name="profileName"
                    className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                    placeholder={t("Profile Name")}
                    value={row?.profileName}
                    required
                    onChange={(event: any) =>
                      handleChange("profileName", event.target.value, row?.id)
                    }
                  />
                </div>
              </div>
              {errorsMessage.profileName ? (
                <div className="form__error">
                  <span>{errorsMessage.profileName}</span>
                </div>
              ) : null}
            </>
          ) : (
            <span>{row?.profileName}</span>
          )}
        </TableCell>
        <TableCell
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          id={`RowRefLabName_${row.id}`}
        >
          {row.rowStatus ? (
            <>
              <div className="required d-flex">
                <div className="w-100">
                  <Select
                    inputId="LabAsignmentLab"
                    menuPortalTarget={document.body}
                    placeholder={t("Lab")}
                    theme={(theme) => styles(theme)}
                    options={dropDownValues?.referenceLab}
                    name="refLabName"
                    styles={reactSelectSMStyle}
                    required
                    onChange={(event: any) =>
                      handleChange("refLabId", event.value, row?.id)
                    }
                    value={dropDownValues?.referenceLab.filter(function (
                      option: any
                    ) {
                      return option.value === row.refLabId;
                    })}
                  />
                </div>
              </div>
              {errorsMessage.refLabName ? (
                <div className="form__error">
                  <span>{errorsMessage.refLabName}</span>
                </div>
              ) : null}
            </>
          ) : (
            <span>{row?.refLabName}</span>
          )}
        </TableCell>
        <TableCell
          id={`RowRequisition_${row.id}`}
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <>
              <div className="required d-flex">
                <div className="w-100">
                  <Select
                    inputId="LabAsignmentRequisitionType"
                    menuPortalTarget={document.body}
                    placeholder={t("Requisition")}
                    theme={(theme) => styles(theme)}
                    options={dropDownValues?.requisitionList}
                    styles={reactSelectSMStyle}
                    name="reqTypeName"
                    required
                    onChange={(event: any) =>
                      handleChange("reqTypeId", event.value, row?.id)
                    }
                    value={dropDownValues?.requisitionList.filter(function (
                      option: any
                    ) {
                      return option.value === row.reqTypeId;
                    })}
                  />
                </div>
              </div>
              {errorsMessage.reqTypeName ? (
                <div className="form__error">
                  <span>{errorsMessage.reqTypeName}</span>
                </div>
              ) : null}
            </>
          ) : (
            <span> {row.reqTypeName}</span>
          )}
        </TableCell>

        <TableCell
          id={`RowGroupNamee_${row.id}`}
          align="left"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          <div className="col-12">
            {row.rowStatus ? (
              <>
                <div className="required d-flex">
                  <div className="w-100">
                    <Select
                      inputId="LabAsignmentGroupName"
                      menuPortalTarget={document.body}
                      theme={(theme) => styles(theme)}
                      isMulti
                      options={dropDownValues?.group}
                      name="groupNames"
                      styles={reactSelectSMStyle}
                      placeholder={t("Group")}
                      onChange={(event: any) =>
                        handleChangeGroups(event, row?.id)
                      }
                      value={dropDownValues.group.filter((option: any) =>
                        row.groupIds.includes(option.value)
                      )}
                    />
                  </div>
                </div>
                {errorsMessage.groupNames ? (
                  <div className="form__error">
                    <span>{errorsMessage.groupNames}</span>
                  </div>
                ) : null}
              </>
            ) : (
              <span>{row?.groupNames}</span>
            )}
          </div>
        </TableCell>
        <TableCell
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          id={`RowInsuranceName_${row.id}`}
        >
          {row.rowStatus ? (
            <>
              <Select
                inputId="InsuranceName"
                menuPortalTarget={document.body}
                theme={(theme) => styles(theme)}
                options={dropDownValues?.insuranceType}
                styles={reactSelectSMStyle}
                placeholder={t("Insurance")}
                name="insuranceName"
                onChange={(event: any) =>
                  handleChange("insuranceId", event.value, row?.id)
                }
                value={dropDownValues?.insuranceType.filter(function (
                  option: any
                ) {
                  return option.value === row?.insuranceId;
                })}
              />
              {errors ? (
                <span style={{ color: "red" }}>{t("Fill Required Field")}</span>
              ) : null}
            </>
          ) : (
            <>
              <span>{row.insuranceName}</span>
            </>
          )}
        </TableCell>
        {/* <TableCell sx={{ width: "max-content", whiteSpace: "nowrap" }}>
          {row.rowStatus ? (
            <>
              <Select
                menuPortalTarget={document.body}
                theme={(theme) => styles(theme)}
                options={dropDownValues?.gender}
                styles={reactSelectSMStyle}
                name="genderName"
                placeholder={t("Gender")}
                onChange={(event: any) =>
                  handleChange("genderId", event.value, row?.id)
                }
                value={dropDownValues?.gender.filter(function (option: any) {
                  return option.value === row?.genderId;
                })}
              />
            </>
          ) : (
            <>
              <span>{row.genderName}</span>
            </>
          )}
        </TableCell> */}
        <TableCell
          id={`RowActive/Inactive_${row.id}`}
          className="text-center"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isDefault"
                  id="flexSwitchCheckDefault"
                  onChange={(event: any) => handleChangeSwitch(event, row.id)}
                  checked={row.isDefault ? true : false}
                />
                <label className="form-check-label"></label>
              </div>
            </>
          ) : (
            <>
              {row?.isDefault ? (
                <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
              ) : (
                <i className="fa fa-ban text-danger mr-2 w-20px"></i>
              )}
            </>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      <Facility
                        setSports2={setSports2}
                        facilities={facilities}
                        sports2={sports2}
                        id={row?.id}
                        loadGridData={loadGridData}
                        setOpen={setOpen}
                        row={row.facilities}
                      />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
