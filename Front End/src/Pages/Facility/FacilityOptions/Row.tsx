import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo, useState } from "react";
import { AddIcon, RemoveICon } from "../../../Shared/Icons";
import useLang from "./../../../Shared/hooks/useLanguage";
import Facility from "./FacilitySelection";
import FacilityService from "Services/FacilityService/FacilityService";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";

export interface ITableObj {
  id: number;
  optionName: string;
  isEnabled: boolean;
  facilities: any;
  rowStatus: boolean;
  isForAllFacility: boolean | null;
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
  } = props;
  const { t } = useLang();

  const [sports2, setSports2] = useState<any>([]);

  const getValues = (r: any, action: string) => {
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

  const allFacilitySwitchChange = (e: any, id: number) => {
    try {
      const payload = {
        optionId: id,
        isForAllFacility: e.target.checked,
      };

      handleSubmitForEnabled(payload);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmitForEnabled = (payload: {
    optionId: number;
    isForAllFacility: boolean;
  }) => {
    FacilityService.changeLabFeature(payload)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.responseMessage));
          loadGridData(false, false);
        } else {
          toast.error(t(res?.data?.responseMessage));
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {!row.isForAllFacility ? (
            <IconButton
              aria-label="expand row"
              size="small"
              // onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              <span onClick={() => setOpen(!open)}>
                {open ? (
                  <button
                    id={`FacilityOptionHide_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`FacilityOptionShow_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </span>
            </IconButton>
          ) : null}
        </TableCell>
        {/* <TableCell>
          <span onClick={() => setDuplicate(!Duplicate)}>
            {Duplicate || open ? (
              <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                <RemoveICon />
              </button>
            ) : (
              <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                <AddIcon />
              </button>
            )}
          </span>
        </TableCell> */}
        {/* <TableCell>
          <div className="d-flex justify-content-center">
            {
              row.rowStatus ? (
                <>
                  <div className="gap-2 d-flex">
                    {request && check ? (
                      <button className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px">
                        <LoaderIcon />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSubmit(row)}
                        className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                      >
                        <DoneIcon />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        if (row.id != 0) {
                          
                          const updatedRows = rows.map((r: any) => {
                            if (r.id === row.id) {
                              return { ...r, rowStatus: false }
                            }
                            return r
                          })
                          setRows(updatedRows)
                        } else {
                          
                          let newArray = [...rows]
                          newArray.splice(index, 1)
                          setRows(newArray)
                          setErrors(false)
                          setRequest(false)
                          setErrorMessage((pre: any) => {
                            return {
                              profileName: '',
                              refLabName: '',
                              reqTypeName: '',
                              insuranceName: '',
                              groupNames: '',
                            }
                          })
                        }
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <CrossIcon />
                    </button>
                  </div>
                </>
              ) : null
              // <DropdownButton
              //   getValues={getValues}
              //   iconArray={TestSetupActionsArray}
              //   row={row}
              // />
            }
          </div>
        </TableCell> */}
        <TableCell scope="row" id={`OptionName_${row.id}`}>
          {row.rowStatus ? (
            <>
              {" "}
              <div className="required d-flex">
                <div className="w-100">
                  <input
                    type="text"
                    name="optionName"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("Option Name")}
                    value={row?.optionName}
                    required
                    onChange={(event: any) =>
                      handleChange("optionName", event.target.value, row?.id)
                    }
                  />
                </div>
              </div>
              {errorsMessage.optionName ? (
                <div className="form__error">
                  <span>{t(errorsMessage.profileName)}</span>
                </div>
              ) : null}
            </>
          ) : (
            <span>{row?.optionName}</span>
          )}
        </TableCell>

        <TableCell className="text-center" id={`IsEnable_${row.id}`}>
          {/* {row.rowStatus ? (
            <> */}
          <div className="form-check form-switch py-1">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isEnabled"
              id={`SwitchButton_${row.id}`}
              onChange={(event: any) => handleChangeSwitch(event, row.id)}
              checked={row.isEnabled ? true : false}
            />
            <label className="form-check-label"></label>
          </div>
          {/* </>
          ) : (
            <>
              {row?.isEnabled ? (
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="isEnabled"
                    id="flexSwitchCheckDefault"
                    onChange={(event: any) => handleChangeSwitch(event, row.id)}
                    checked={row.isEnabled ? true : false}
                  />
                  <label className="form-check-label"></label>
                </div>
              ) : (
                // <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                <div className="form-check form-switch">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    role="switch"
                    name="isEnabled"
                    id="flexSwitchCheckDefault"
                    onChange={(event: any) => handleChangeSwitch(event, row.id)}
                    checked={row.isEnabled ? true : false}
                  />
                  <label className="form-check-label"></label>
                </div>
              )}
            </>
          )} */}
        </TableCell>
        <TableCell className="text-center">
          <div className="form-check form-switch py-1">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isForAllFacility"
              id="isForAllFacility"
              onChange={(event: any) => allFacilitySwitchChange(event, row.id)}
              checked={row.isForAllFacility ? true : false}
            />
            <label className="form-check-label"></label>
          </div>
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
                        row={row.facilities}
                        setOpen={setOpen}
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
