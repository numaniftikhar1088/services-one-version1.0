import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { AddIcon, RemoveICon } from "Shared/Icons";

function Row(props: any) {
  const { row } = props;
  const [open, setOpen] = useState(false);

  const styledAuditString = row.ExpandAuditString.replace(
    "{{Pending}}",
    "badge-status-pending"
  ).replace("{{Final}}", "badge-status-complete");

  return (
    <>
      <TableRow className="h-40px">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {open ? (
              <button
                // id={`ResultDataHide_${props?.RowData.requisitionOrderId}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                // id={`ResultDataShow_${props?.RowData.requisitionOrderId}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell>N/A</TableCell>
        <TableCell>{row.FirstName}</TableCell>
        <TableCell>{row.LastName}</TableCell>
        <TableCell>N/A</TableCell>
        <TableCell>{row.NewStatus}</TableCell>
        <TableCell>{row.Action}</TableCell>
        <TableCell>{row.PreviousStatus}</TableCell>
        <TableCell>{row.DateofCollection}</TableCell>
        <TableCell>{row.ReceivedDate}</TableCell>
        {/* <TableCell>N/A</TableCell> */}
        {/* <TableCell>N/A</TableCell>
        <TableCell>N/A</TableCell>
        <TableCell>N/A</TableCell> */}
        {/* <TableCell>N/A</TableCell>
        <TableCell>N/A</TableCell> */}
        <TableCell>{row.FacilityName}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <div className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky">
                      <div
                        id="kt_app_content"
                        className="app-content flex-column-fluid pb-0"
                      >
                        <div
                          id="kt_app_content_container"
                          className="app-container container-fluid mb-container"
                        >
                          <span
                            dangerouslySetInnerHTML={{
                              __html: styledAuditString,
                            }}
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
