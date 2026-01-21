import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { memo, useState } from "react";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AddIcon, RemoveICon } from "../../../../Shared/Icons";
import IDBatchQCExpandableRow from "./IDBatchQCExpandableRow";

const Row = (props: {
  row: any;
  selectedBox: any;
  handleSelectedResultDataIds: any;
  IDLISReportView: any;
  isPreviewing: any;
  open: any;
  value: any;
}) => {
  const navigate = useNavigate();
  const {
    row,
    selectedBox,
    handleSelectedResultDataIds,
    IDLISReportView,
    isPreviewing,
    open,
    value,
  } = props;
  const [Duplicate, setDuplicate] = useState<any>(false);
  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };
  console.log(row, "rowrow");

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          className="w-10px text-center"
        >
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setDuplicate(!Duplicate)}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
          >
            {Duplicate || open ? (
              <button
                id={`IdBatchQcExpandClose_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                id={`IdBatchQcExpandOpen_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
          className="w-10px text-center"
        >
          <label className="form-check form-check-sm form-check-solid">
            <input
              id={`IdBatchQcCheckBox_${row.id}`}
              className="form-check-input"
              type="checkbox"
              // checked={selectedBox?.requisitionId?.includes(row?.requisitionId)}
              checked={selectedBox?.fileId?.some(
                (item: any) => item.fileId === row?.fileId
              )}
              onChange={(e) =>
                handleSelectedResultDataIds(e.target.checked, row)
              }
            />
          </label>
        </TableCell>
        <TableCell
          id={`IdBatchQcBatchId _${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.fileName}
        </TableCell>

        {/* <TableCell>{row?.publishdBy}</TableCell> */}

        <TableCell
          id={`IdBatchQcTestType_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.panelName}
        </TableCell>
        <TableCell
          id={`IdBatchQcCreatedBy_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.createdBy}
        </TableCell>
        <TableCell
          id={`IdBatchQcCreatedDate_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.createdDate}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse in={open ? open : Duplicate} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <IDBatchQCExpandableRow
                      fileId={row?.fileId}
                      ControlsList={row?.controls}
                      IDLISReportView={IDLISReportView}
                      isPreviewing={isPreviewing}
                      value={value}
                    />
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

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(memo(Row));
