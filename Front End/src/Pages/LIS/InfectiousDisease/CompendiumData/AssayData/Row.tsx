import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";

import Box from "@mui/material/Box";
import { Dropdown } from "react-bootstrap";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import PanelAndReportingRule from "./PanelAndReportingRule";
export interface ITableObj {
  id: number;
  testName: string;
  testDisplayName: string;
  testCode: string;
  referenceLabId: number;
  createDate: string;
  referenceLabName: string;
  rowStatus: boolean | undefined;
}

const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  updateRow: Function;
  handleDelete: Function;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: Function;
  setIsAddButtonDisabled: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    updateRow,
    handleDelete,
    handleSubmit,
    loadGridData,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [open, setOpen] = React.useState(false);
  const getValues = (r: any, action: string) => {
    // if (action === 'Delete') {
    //   handleDelete(r?.id)
    // }
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);

      //updateRow(row)
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {!row.rowStatus ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                {open ? (
                  <button
                    id={`IDCompendiumDataAssayDataExpandHide_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`IDCompendiumDataAssayDataExpandShow_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </IconButton>
            ) : null}
          </div>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  <button
                    id={`IDCompendiumDataAssayDataSaveRow`}
                    onClick={() => handleSubmit(row)}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    id={`IDCompendiumDataAssayDataCancelRow`}
                    onClick={() => {
                      // const updatedRows = rows.map((row: any) => {
                      //   if (row.id === r.id) {
                      //     return { ...row, rowStatus: false }
                      //   }
                      //   return row
                      // })
                      // setRows(updatedRows)
                      if (row.id != 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        loadGridData(true, false);
                        setRows(updatedRows);
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
                  id={`IDCompendiumDataAssayData_${row.id}`}
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
                        id={`IDCompendiumDataAssayDataEdit`}
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
          id={`IDCompendiumDataAssayDataAssayName_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataAssayDataAssayName`}
                  type="text"
                  autoComplete="off"
                  name="testName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Assay Name")}
                  value={row?.testName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.testName}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataAssayDataDisplayName_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataAssayDataDisplayName`}
                  type="text"
                  autoComplete="off"
                  name="testDisplayName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Display Name")}
                  value={row?.testDisplayName}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.testDisplayName}
            </span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataAssayDataTestCode_${row.id}`}
          component="th"
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`IDCompendiumDataAssayDataTestCode`}
                  type="text"
                  autoComplete="off"
                  name="testCode"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Test Code")}
                  value={row?.testCode}
                  onChange={(event: any) =>
                    handleChange(event.target.name, event.target.value, row?.id)
                  }
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.testCode}
            </span>
          )}
        </TableCell>

        <TableCell
          id={`IDCompendiumDataAssayDataReferenceLabsList_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataAssayDataReferenceLabsList`}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.ReferenceLabsList}
                  onChange={(event: any) =>
                    handleChange("referenceLabId", event.value, row?.id)
                  }
                  value={dropDownValues?.ReferenceLabsList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.referenceLabId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.referenceLabName}
            </span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="table-expend-sticky">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6">
                    <PanelAndReportingRule id={row?.id} />
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
