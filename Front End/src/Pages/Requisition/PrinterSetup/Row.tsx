import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../Shared/Icons";

import { Dropdown, DropdownButton } from "react-bootstrap";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import PrinterSetupExpandable from "./PrinterSetupExpandable";
import useLang from "Shared/hooks/useLanguage";
export interface ITableObj {
  id: number;
  printerName: string;
  modelNumber: string;
  labelSize: string;
  labelName: string;
  labName: string;
  labId: number | null;
  isDefault: boolean;
  facilities: any;
  rowStatus: boolean;
  configurationDocumentLink: any;
  labelContent: string;
  softwareDownloadLink: string;
}

const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleChange: Function;
  handleSubmit: Function;
  loadGridData: any;
  setErrors: any;
  errors: any;
  request: any;
  setRequest: any;
  check: any;
  setCheck: any;
  setShow1: any;
  handleClickOpen: any;
  setIsAddButtonDisabled: any;
  isButtonDisabled: any;
  handleIsDefault: any;
  ShowBlob: any;
}) => {
  const { t } = useLang();

  const {
    row,
    rows,
    index,
    setRows,
    dropDownValues,
    handleChange,
    handleSubmit,
    loadGridData,
    setErrors,
    errors,
    request,
    setRequest,
    check,
    setCheck,
    setShow1,
    handleClickOpen,
    setIsAddButtonDisabled,
    isButtonDisabled,
    handleIsDefault,
    ShowBlob,
  } = props;

  const [open, setOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(true);
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
    if (action === "Delete") {
      handleClickOpen(row?.id);
      setShow1(true);
    }
  };
  console.log(row);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setAddOpen(!addOpen)}
            >
              {addOpen ? (
                <button
                  id={`PrinterSetupCloseExpand_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`PrinterSetupOpenExpand_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? (
                <button
                  id={`PrinterSetupCloseExpand_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`PrinterSetupOpenExpand_${row.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          )}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request && check ? (
                    <button
                      id={`PrinterSetupLoadButton`}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id={`PrinterSetupSave`}
                      onClick={() => handleSubmit(row)}
                      disabled={isButtonDisabled}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id={`PrinterSetupCancel`}
                    onClick={() => {
                      if (row.id !== 0) {
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
                        setErrors(false);
                        setRequest(false);
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
              <>
                <div className="rotatebtnn">
                  <DropdownButton
                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                    key="end"
                    id={`PrinterSetup3Dots_${row.id}`}
                    drop="end"
                    title={<i className="bi bi-three-dots-vertical p-0"></i>}
                  >
                    <>
                      <PermissionComponent
                        moduleName="Setup"
                        pageName="Printer Setup"
                        permissionIdentifier="Edit"
                      >
                        <Dropdown.Item
                          id={`PrinterSetupEdit`}
                          className="w-auto"
                          eventKey="1"
                          onClick={() => {
                            getValues(row, "Edit");
                          }}
                        >
                          <div className="menu-item px-3">
                            <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                            {t("Edit")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="Setup"
                        pageName="Printer Setup"
                        permissionIdentifier="Delete"
                      >
                        <Dropdown.Item
                          id={`PrinterSetupDelete`}
                          className="w-auto"
                          eventKey="2"
                          onClick={() => getValues(row, "Delete")}
                        >
                          <div className="menu-item px-3">
                            <i className="fa fa-trash text-danger mr-2 w-20px"></i>
                            {t("Delete")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                    </>
                  </DropdownButton>
                </div>
              </>
            )}{" "}
          </div>
        </TableCell>
        <TableCell id={`PrinterSetupPrinterName_${row.id}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`PrinterSetupPrinterName`}
                  type="text"
                  name="printerName"
                  className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Printer Name")}
                  value={row?.printerName}
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
              {row?.printerName}
            </span>
          )}
        </TableCell>
        <TableCell id={`PrinterSetupModelNumber_${row.id}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`PrinterSetupModelNumber`}
                  type="text"
                  name="modelNumber"
                  className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Model Number")}
                  value={row?.modelNumber}
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
              {row?.modelNumber}
            </span>
          )}
        </TableCell>
        <TableCell id={`PrinterSetupLabelSize_${row.id}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`PrinterSetupLabelSize`}
                  type="text"
                  name="labelSize"
                  className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-33px"
                  placeholder={t("Label Size")}
                  value={row?.labelSize}
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
              {row?.labelSize}
            </span>
          )}
        </TableCell>
        <TableCell id={`PrinterSetupLabelName_${row.id}`} scope="row">
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`PrinterSetupLabelName`}
                  type="text"
                  name="labelName"
                  className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                  placeholder={t("Label Type")}
                  value={row?.labelName}
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
              {row?.labelName}
            </span>
          )}
        </TableCell>
        {row?.rowStatus ? (
          <TableCell id={`PrinterSetupStatus_${row.id}`}>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`PrinterSetupStatusButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isDefault"
                  onChange={(event: any) => handleIsDefault(event, row.id)}
                />
              </div>
            </div>
          </TableCell>
        ) : (
          <TableCell id={`PrinterSetupSwitchButton_${row.id}`}>
            <div className="d-flex justify-content-center">
              <div className="form-check form-switch">
                <input
                  id={`PrinterSetupSwitchButton`}
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isDefault"
                  checked={row.isDefault}
                  disabled={true}
                />
              </div>
            </div>
          </TableCell>
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} className="padding-0">
          <Collapse
            in={row.rowStatus ? addOpen : open}
            timeout="auto"
            unmountOnExit
          >
            <PrinterSetupExpandable
              row={row}
              handleChange={handleChange}
              ShowBlob={ShowBlob}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default memo(Row);
