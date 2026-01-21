import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { memo, useState } from "react";
import { AddIcon, RemoveICon } from "../../Shared/Icons";
import useLang from "../../Shared/hooks/useLanguage";
import FacilityService from "Services/FacilityService/FacilityService";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import SignaturePanel from "./SignaturePanel";

export interface ITableObj {
  userId: string;
  firstName: string;
  lastName: string;
  npiNumber: string;
}

const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  loadGridData: any;
  
}) => {
  const {
    row,
    rows,
    setRows,
    loadGridData,
  } = props;
  const { t } = useLang();

  const [open, setOpen] = React.useState(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              // onClick={() => setOpen(!open)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
            >
              <span onClick={() => setOpen(!open)}>
                {open ? (
                  <button
                    id={`FacilityOptionHide_${row.userId}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`FacilityOptionShow_${row.userId}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </span>
            </IconButton>
        </TableCell>
        <TableCell scope="row" id={`OptionName_${row.userId}`}>
          {row?.firstName}
        </TableCell>

        <TableCell id={`IsEnable_${row.userId}`}>
          
            <label className="form-check-label">{row?.lastName}</label>
          
        </TableCell>
        <TableCell>
            <label className="form-check-label">{row?.npiNumber}</label>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      <SignaturePanel id={row.userId} loadGridData={loadGridData} open={open} setOpen={setOpen}  />
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
