import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import Select from "react-select";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../Utils/Common";
import InnerSectionTemplateSetting from "./InnerSectionTemplateSetting";

import { Dropdown, DropdownButton } from "react-bootstrap";
import { useSelector } from "react-redux";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";

export interface ITableObj {
  templateId: number;
  labId: number;
  templateName: string;
  rowStatus: boolean;
}

const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  handleSubmit: Function;
  setErrors: any;
  errors: any;
  request: any;
  setRequest: any;
  check: any;
  setCheck: any;
  loadGridData: any;
  setButtonClicked: any;
  validation: any;
  setValidation: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleSubmit,
    setErrors,
    errors,
    request,
    setRequest,
    check,
    setCheck,
    loadGridData,
    setButtonClicked,
    validation,
    setValidation,
  } = props;

  const { t } = useLang();

  const [open, setOpen] = React.useState(false);
  const [originalRowState, setOriginalRowState] = React.useState<any>(null);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      // Store original state before editing
      setOriginalRowState({ ...r });
      
      const updatedRows = rows.map((row: any) => {
        if (row.templateId === r.templateId) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleIsActive = (event: any, templateId: any) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.templateId === templateId
          ? {
              ...x,
              isActive: event.target.checked,
            }
          : x
      )
    );
  };
  const selectedLab = useSelector(
    (state: any) => state?.Reducer?.selectedTenantInfo
  );
  const selectedLabVal = {
    value: selectedLab.tenantId,
    label: selectedLab.name,
  };
  const selectedLabArr = [selectedLabVal];
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell className="text-center">
          {!row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              {open ? (
                <button
                  id={`IDResultDataPreconfTemplateSettingExpandClose_${row.templateId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`IDResultDataPreconfTemplateSettingExpandOpen_${row.templateId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request && check ? (
                    <button
                      id={`IDResultDataPreconfTemplateSettingLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`IDResultDataPreconfTemplateSettingSaveRow`}
                      onClick={() => {
                        handleSubmit(row);
                        setButtonClicked(false);
                        setOriginalRowState(null); // Clear original state after save
                      }}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`IDResultDataPreconfTemplateSettingCancel`}
                    onClick={() => {
                      if (row.labId != 0 && row.templateId != 0) {
                        // Revert to original state for existing records
                        const updatedRows = rows.map((r: any) => {
                          if (r.templateId === row.templateId) {
                            return originalRowState ? { ...originalRowState, rowStatus: false } : { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        loadGridData(true, false);
                        setRows(updatedRows);
                        setOriginalRowState(null); // Clear original state
                      } else {
                        // Remove new records that weren't saved
                        let newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setErrors(false);
                        setRequest(false);
                        setButtonClicked(false);
                        setValidation((pre: any) => {
                          return {
                            ...pre,
                            TemplateName: "",
                            Lab: "",
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
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`IDResultDataPreconfTemplateSetting3Dots_${row.templateId}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Result Data Pre-Configuration"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`IDResultDataPreconfTemplateSettingEdit_${row.templateId}`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => getValues(row, "Edit")}
                    >
                      {" "}
                      <i className={"fa fa-edit text-primary mr-2"}></i>
                      {t("Edit")}
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfTemplateSettingTemplateNameCell_${row.templateId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <>
              <input
                id={`IDResultDataPreconfTemplateSettingTemplateNameInput`}
                type="text"
                name="templateName"
                className={`form-control min-w-100px w-100 rounded-2 fs-8 h-30px ${
                  row?.templateId ? "bg-gray" : "bg-white"
                }`}
                placeholder={t("Template Name")}
                value={row?.templateName}
                onChange={(event: any) =>
                  handleChange(
                    "templateName",
                    event.target.value,
                    row?.templateId
                  )
                }
                disabled={row?.templateId ? true : false} // Add this line
              />
              {!row.templateId && validation.TemplateName ? (
                <span style={{ color: "red" }}>{validation.TemplateName}</span>
              ) : null}
            </>
          ) : (
            <span className="px-2">{row?.templateName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDResultDataPreconfTemplateSettingLabCell_${row.templateId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <>
              <div className="p-2">
                <Select
                  inputId={`IDResultDataPreconfTemplateSettingLabSelect`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  placeholder={t("Select a Lab")}
                  theme={(theme: any) => styles(theme)}
                  options={selectedLabArr}
                  // options={dropDownValues?.referenceLab}
                  className={`${row?.templateId ? "bg-gray" : "bg-white"}`}
                  name="labId"
                  onChange={(event: any) =>
                    handleChange("labId", event.value, row?.templateId)
                  }
                  value={selectedLabArr.filter(function (option: any) {
                    return option.value === row.labId;
                  })}
                  // value={selectedLabVal}
                  isDisabled={row?.templateId ? true : false} // Add this line
                />
              </div>
              {!row.labId && validation.Lab ? (
                <span className="p-2" style={{ color: "red" }}>
                  {validation.Lab}
                </span>
              ) : null}
            </>
          ) : (
            <span className="px-2">{row?.labName}</span>
          )}
        </TableCell>
        {row?.rowStatus ? (
          <TableCell>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch m-0">
                <input
                  id={`IDResultDataPreconfTemplateSettingSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.isActive}
                  onChange={(event: any) =>
                    handleIsActive(event, row.templateId)
                  }
                />
              </div>
            </div>
          </TableCell>
        ) : (
          <TableCell
            id={`IDResultDataPreconfTemplateSettingSwitchCell_${row.templateId}`}
          >
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={row?.isActive}
                  disabled={true}
                />
              </div>
            </div>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xxl-12 px-lg-14 px-md-10 px-4">
                      <InnerSectionTemplateSetting
                        innerRow={row.cells}
                        setOpen={setOpen}
                        loadGridData={loadGridData}
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
