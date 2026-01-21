import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo, MouseEventHandler } from "react";
import Select from "react-select";
import DropdownButton from "../../../../Shared/DropdownButton";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../Shared/Icons";
import { styles } from "../../../../Utils/Common";
import { TestSetupActionsArray } from "../../../../Utils/Compendium/ActionsArray";
import useLang from './../../../../Shared/hooks/useLanguage';

const Row = (props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  updateRow:any;
  handleDelete: any;
  handleChange: any;
  handleSubmit: MouseEventHandler<HTMLButtonElement>;
}) => {
  const {t} = useLang()
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
  } = props;
  const [open, setOpen] = React.useState(false);
  const getValues = (row: any, action: string) => {
    if (action === "Delete") {
      handleDelete(row?.id);
    }
    if (action === "Edit")
    {
      updateRow(row)
    }
  };
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          {!row.rowStatus ? (
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              {open ? (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                  <RemoveICon />
                </button>
              ) : (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                  <AddIcon />
                </button>
              )}
            </IconButton>
          ) : null}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
                <div className="gap-2 d-flex">
                  <button
                    onClick={() => handleSubmit(row)}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                  <button
                    onClick={() => {
                      let newArray = [...rows];
                      newArray.splice(index, 1);
                      setRows(newArray);
                    }}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                </div>
            ) : (
              <DropdownButton
                getValues={getValues}
                iconArray={TestSetupActionsArray}
                row={row}
              />
            )}
          </div>
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="panelName"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("Panel Name")}
            value={row?.panelName}
            onChange={(event: any) =>
              handleChange(event.target.name, event.target.value, row?.id)
            }
          />
        </TableCell>
        <TableCell component="th" scope="row">
          <input
            type="text"
            name="tmitcode"
            className="form-control bg-transparent mb-3 mb-lg-0"
            placeholder={t("Tmit Code")}
            value={row?.tmitcode}
            onChange={(event: any) =>
              handleChange(event.target.name, event.target.value, row?.id)
            }
          />
        </TableCell>
        <TableCell align="right">
          <div className="col-12">
            <Select
              menuPortalTarget={document.body}
              theme={(theme) => styles(theme)}
              options={dropDownValues?.requisitionList}
              onChange={(event: any) =>
                handleChange("reqTypeId", event.value, row?.id)
              }
              //defaultValue={row.requisitionTypeName || "Select"}
              value={dropDownValues?.requisitionList.filter(function (
                option: any
              ) {
                return option.value === row.reqTypeId;
              })}
            />
          </div>
        </TableCell>
        <TableCell align="right">
          <div className="col-12">
            <Select
              menuPortalTarget={document.body}
              theme={(theme) => styles(theme)}
              options={dropDownValues?.departments}
              onChange={(event: any) =>
                handleChange("deptId", event.value, row?.id)
              }
              value={dropDownValues?.departments.filter(function (option: any) {
                return option.value === row?.deptId;
              })}
            />
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={6} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
              <div className=' table-expend-sticky'>
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6">
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
