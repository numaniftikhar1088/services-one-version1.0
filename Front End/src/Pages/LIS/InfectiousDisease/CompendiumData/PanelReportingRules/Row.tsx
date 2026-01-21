import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import InputMask from "react-input-mask";
import Select from "react-select";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";
import PanelInfo from "./PanelInfo";
import { closeMenuOnScroll } from "Pages/Blood/BloodCompendium/Test/Shared";
import { ampStatusDropDown } from "Pages/Requisition/ResultData/ResultDataExpandableRow";
import { stylesResultData } from "Utils/Common";

export interface ITableObj {
  id: number;
  name: string;
  ageRange: string;
  negative: string;
  low: string;
  medium: string;
  high: string;
  criticalhigh: string;
  ampScore: number;
  cqConf: number;
  ampStatus: string;
  roxSignal: number;
  createDate: string;
  rowStatus: boolean | undefined;
  lowQualitative: string;
  mediumQualitative: string;
  highQualitative: string;
  criticalHighQualitative: string;
}
const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  // updateRow: Function
  handleDelete: Function;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: Function;
  handleChangePanelReportingId: any;
  selectedBox: any;
  setIsAddButtonDisabled: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    handleChange,
    // updateRow,
    handleDelete,
    handleSubmit,
    loadGridData,
    handleChangePanelReportingId,
    selectedBox,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [open, setOpen] = React.useState(false);

  const getValues = (r: any, action: string) => {
    if (action === "Delete") {
      handleDelete(r?.id);
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

  const handleChangeAgeRange = (name: string, value: string, id: number) => {
    // Format the value to ensure it follows the "00-000" format
    let formattedValue = value.replace(/[^\d]/g, ""); // Remove any non-numeric characters

    // Insert a hyphen after the second digit
    if (formattedValue.length > 2) {
      formattedValue =
        formattedValue.slice(0, 2) + "-" + formattedValue.slice(2);
    }

    // Limit the length to 6 characters ("00-000")
    if (formattedValue.length > 6) {
      formattedValue = formattedValue.slice(0, 6);
    }

    // Update the state with the formatted value
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: formattedValue,
            }
          : x
      )
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, selectionStart } = event.target;

    // Allow only numbers, dots, and dashes
    const sanitizedValue = value.replace(/[^0-9.-]/g, "");

    // Call change handler with cleaned value
    handleChange(name, sanitizedValue, row?.id);

    // Reset cursor
    setTimeout(() => {
      event.target.setSelectionRange(selectionStart, selectionStart);
    }, 0);
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell sx={{ width: "max-content", whiteSpace: "nowrap" }}>
          {!row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              {open ? (
                <button
                  id={`IDCompendiumDataPanelReportingExpandClose_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`IDCompendiumDataPanelReportingExpandOpen_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell
          className="w-20px min-w-20px"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          <label className="form-check form-check-sm form-check-solid">
            <input
              id={`IDCompendiumDataPanelReportingCheckbox_${row.id}`}
              className="form-check-input"
              type="checkbox"
              checked={selectedBox?.id?.includes(row?.id)}
              onChange={(e) =>
                handleChangePanelReportingId(e.target.checked, row?.id)
              }
            />
          </label>
        </TableCell>
        <TableCell sx={{ width: "max-content", whiteSpace: "nowrap" }}>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  <button
                    id={`IDCompendiumDataPanelReportingSaveRow`}
                    onClick={() => handleSubmit(row)}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    id={`IDCompendiumDataPanelReportingCancel`}
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
                  id={`IDCompendiumDataPanelReporting3Dots_${row.id}`}
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
                        id={`IDCompendiumDataPanelReportingEdit`}
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
        <TableCell
          id={`IDCompendiumDataPanelReportingRuleName_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataPanelReportingRuleName`}
                  type="text"
                  name="name"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Reporting Rule Name")}
                  value={row?.name}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.name}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingAgeRange_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingageRange`}
              type="text"
              name="ageRange"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("00-000")}
              maxLength={6}
              value={row?.ageRange}
              onChange={(event: any) =>
                handleChangeAgeRange(
                  event.target.name,
                  event.target.value,
                  row?.id
                )
              }
            />
          ) : (
            <span>{row?.ageRange}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingNegative_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <InputMask
                  id={`IDCompendiumDataPanelReportingNegative`}
                  mask="99.99-99.99"
                  inputMode="numeric"
                  type="text"
                  name="negative"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("00.00-00.00")}
                  value={row?.negative}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
                <>{(inputProps: any) => <input {...inputProps} />}</>
              </div>
            </div>
          ) : (
            <span>{row?.negative}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingLow_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className=" d-flex">
              <div className="w-100">
                <InputMask
                  id={`IDCompendiumDataPanelReportingLow`}
                  mask="99.99-99.99"
                  inputMode="numeric"
                  type="text"
                  name="low"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("00.00-00.00")}
                  value={row?.low}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
                <>{(inputProps: any) => <input {...inputProps} />}</>
              </div>
            </div>
          ) : (
            <span>{row?.low}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingMedium_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className=" d-flex">
              <div className="w-100">
                <InputMask
                  id={`IDCompendiumDataPanelReportingMedium`}
                  mask="99.99-99.99"
                  inputMode="numeric"
                  type="text"
                  name="medium"
                  placeholder={t("00.00-00.00")}
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  // placeholder="Medium"
                  value={row?.medium}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
                <>{(inputProps: any) => <input {...inputProps} />}</>
              </div>
            </div>
          ) : (
            <span>{row?.medium}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingHigh_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <InputMask
                  id={`IDCompendiumDataPanelReportingHigh`}
                  mask="99.99-99.99"
                  inputMode="numeric"
                  type="text"
                  name="high"
                  placeholder={t("00.00-00.00")}
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  // placeholder="High"
                  value={row?.high}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
                <>{(inputProps: any) => <input {...inputProps} />}</>
              </div>
            </div>
          ) : (
            <span>{row?.high}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingCriticalHigh_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className="d-flex">
              <div className="w-100">
                <InputMask
                  id={`IDCompendiumDataPanelReportingCriticalHigh`} 
                  mask="99.99-99.99"
                  inputMode="numeric"
                  type="text"
                  name="criticalhigh"
                  placeholder={t("00.00-00.00")}
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  // placeholder="Critical High"
                  value={row?.criticalhigh}
                  onChange={(event) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
                <>{(inputProps: any) => <input {...inputProps} />}</>
              </div>
            </div>
          ) : (
            <span>{row?.criticalhigh}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingAmpScore_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <div className=" d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataPanelReportingAmpScore`}
                  type="text"
                  name="ampScore"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Amp Score")}
                  value={row?.ampScore}
                  onChange={(event) => handleInputChange(event)}
                />
              </div>
            </div>
          ) : (
            <span>{row?.ampScore}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingCqConf_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingCqConf`}
              type="text"
              name="cqConf"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Cq Conf")}
              value={row?.cqConf}
              onChange={(event) => handleInputChange(event)}
            />
          ) : (
            <span>{row?.cqConf}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingampStatus_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <Select
              id={`WoundPanelAmpStatusSelect_${row.id}`}
              menuPortalTarget={document.body}
              theme={(theme) => stylesResultData(theme)}
              className="bg-transparent"
              placeholder={t("Select...")}
              options={ampStatusDropDown}
              onChange={(e) => handleChange("ampStatus", e?.value, row?.id)}
              value={ampStatusDropDown.filter(function (option: any) {
                return option.value === row?.ampStatus;
              })}
              closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
            />
          ) : (
            <span>{row?.ampStatus}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingroxSignal_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingroxSignal`}
              type="text"
              name="roxSignal"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Rox Signal")}
              value={row?.roxSignal}
              onChange={(event) => handleInputChange(event)}
            />
          ) : (
            <span>{row?.roxSignal}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingLowQualitative_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingLowQualitative`}
              type="text"
              name="lowQualitative"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Low Qualitative")}
              value={row?.lowQualitative}
              onChange={(event) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span>{row?.lowQualitative}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingMediumQualitative_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingMediumQualitative`}
              type="text"
              name="mediumQualitative"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Medium Qualitative")}
              value={row?.mediumQualitative}
              onChange={(event) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span>{row?.mediumQualitative}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingHighQualitative_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingHighQualitative`}
              type="text"
              name="highQualitative"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("High Qualitative")}
              value={row?.highQualitative}
              onChange={(event) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span>{row?.highQualitative}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelReportingCriticalHighQualitative_${row.id}`}
          component="th"
          scope="row"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <input
              id={`IDCompendiumDataPanelReportingCriticalHighQualitative`}
              type="text"
              name="criticalHighQualitative"
              className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
              placeholder={t("Critical High Qualitative")}
              value={row?.criticalHighQualitative}
              onChange={(event) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span>{row?.criticalHighQualitative}</span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={18} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <PanelInfo id={row?.id} />
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
