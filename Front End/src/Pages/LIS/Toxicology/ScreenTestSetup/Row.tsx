import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import TestSetupExpandableRow from "./TestSetupExpandableRow";

export interface ITableObj {
  DrugClassCode: string;
  DrugClassId: number | null | undefined;
  DrugClassName: string;
  SpecimenType: string;
  SpecimenTypeID: number | null | undefined;
  rowStatus: boolean;
}

interface PerformingLab {
  label: string;
  value: string;
}

const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: (name: string, value: any, id: number) => void;
  handleSubmit: (row: any) => void;
  loadGridData: (loader: boolean, reset: boolean, sortingState?: any) => void;
  request: any;
  setRequest: any;
  setIsAddButtonDisabled: any;
  performingLabs: PerformingLab[];
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
    performingLabs,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [open, setOpen] = React.useState(false);
  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.DrugClassId === r.DrugClassId) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };
  const Close = () => {
    setOpen(!open);
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
                    id={`compendiumDataScreenTestExpandClose_${row.DrugClassId}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`compendiumDataScreenTestOpen_${row.DrugClassId}`}
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
                  {request ? (
                    <button
                      id={`compendiumDataScreenTestLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`compendiumDataScreenTestSave`}
                      onClick={() => handleSubmit(row)}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`compendiumDataScreenTestCancel`}
                    onClick={() => {
                      if (row.DrugClassId !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.DrugClassId === row.DrugClassId) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false);
                      } else {
                        const newArray = [...rows];
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
                  id={`compendiumDataScreenTest3Dots_${row.DrugClassId}`}
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
                        id={`compendiumDataScreenTestEdit`}
                        className="w-auto"
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
          id={`compendiumDataScreenTestDrugClassName_${row.DrugClassId}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenTestClassName`}
                  type="text"
                  name="DrugClassName"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33pxs"
                  placeholder={t("Drug Class")}
                  value={row?.DrugClassName}
                  onChange={(event: any) =>
                    handleChange(
                      event.target.name,
                      event.target.value,
                      row?.DrugClassId
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.DrugClassName}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenTestClassCode_${row.DrugClassId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`compendiumDataScreenTestClassCode`}
                  type="text"
                  name="DrugClassCode"
                  className="form-control bg-white  min-w-250px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Test Code")}
                  value={row?.DrugClassCode}
                  onChange={(event: any) =>
                    handleChange(
                      event.target.name,
                      event.target.value,
                      row?.DrugClassId
                    )
                  }
                />
              </div>
            </div>
          ) : (
            <span>{row?.DrugClassCode}</span>
          )}
        </TableCell>
        <TableCell
          id={`compendiumDataScreenTestSpecimenId_${row.DrugClassId}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`compendiumDataScreenTestSpecimenId`}
                  menuPortalTarget={document.body}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={"Select..."}
                  options={dropDownValues?.SpecimenTypeLookup}
                  onChange={(event: any) =>
                    handleChange(
                      "SpecimenTypeID",
                      event?.value,
                      row?.DrugClassId
                    )
                  }
                  value={dropDownValues?.SpecimenTypeLookup.filter(function (
                    option: any
                  ) {
                    return option.value === row?.SpecimenTypeID;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.SpecimenType}</span>
          )}
        </TableCell>
        <TableCell>
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  menuPortalTarget={document.body}
                  options={performingLabs}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  placeholder={t("Performing Lab")}
                  name="PerformingLabID"
                  value={performingLabs?.filter(
                    (item: any) => item?.value === row?.PerformingLabID
                  )}
                  onChange={(event: any) => {
                    handleChange(
                      "PerformingLabID",
                      event.value,
                      row.PerformingLabID
                    );
                  }}
                />
              </div>
            </div>
          ) : (
            row?.PerformingLab
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <TestSetupExpandableRow
                        Close={Close}
                        RowId={row.DrugClassId}
                        specimenTypeId={row.SpecimenTypeID}
                        performingLabId={row.PerformingLabID}
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
