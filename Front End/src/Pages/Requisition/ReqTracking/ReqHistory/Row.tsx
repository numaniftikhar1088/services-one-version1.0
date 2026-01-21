import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { savePdfUrls } from "Redux/Actions/Index";
import { Link } from "react-router-dom";
import Status from "Shared/Common/Status";
import { AddIcon, RemoveICon } from "Shared/Icons";
import { useDispatch } from "react-redux";

const statusClassMap: Record<string, string> = {
  "Specimen Collected": "badge-status-specimen-collected",
  "Result Available": "badge-status-result-available",
  Processing: "badge-status-processing",
  Complete: "badge-status-complete",
  Deleted: "badge-status-deleted",
  Validated: "badge-status-validated",
  "Save For Signature": "badge-status-waiting-for-Signature",
  "On Hold": "badge-status-hold",
  "Missing Info": "badge-status-missing-info",
  "In Transit": "badge-status-in-transit",
  Canceled: "badge-status-canceled",
  Approved: "badge-status-approved",
  Pending: "badge-status-pending",
  Rejected: "badge-status-rejected",
  Shipped: "badge-status-shipped",
};

const defaultStatusClass = "badge-status-default";

function Row({ row }: any) {
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const styledAuditString = row.ExpandAuditString.replace(
    /{{(.*?)}}/g,
    (_: string, statusKey: string) =>
      statusClassMap[statusKey] || defaultStatusClass
  );

  const getStatusClass = (status: string) =>
    statusClassMap[status] || defaultStatusClass;

  return (
    <>
      <TableRow className="h-40px">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            <button
              className={`btn btn-icon btn-icon-light btn-sm fw-bold ${
                open ? "btn-table-expend-row" : "btn-primary"
              } rounded h-20px w-20px min-h-20px`}
            >
              {open ? <RemoveICon /> : <AddIcon />}
            </button>
          </IconButton>
        </TableCell>
        <TableCell>{row.RecordId}</TableCell>
        <TableCell>{row.DateofCollection}</TableCell>
        <TableCell>{row.ReceivedDate}</TableCell>
        <TableCell sx={{ width: "max-content", textAlign: "center" }}>
          <Status
            cusText={row.PreviousStatus}
            cusClassName={getStatusClass(row.PreviousStatus)}
          />
        </TableCell>
        <TableCell className="min-w-150px">{row.Action}</TableCell>
        <TableCell sx={{ width: "max-content", textAlign: "center" }}>
          <Status
            cusText={row.NewStatus}
            cusClassName={getStatusClass(row.NewStatus)}
          />
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.UploadedFile && (
              <Link to={`/docs-viewer`} target="_blank">
                <i
                  className="bi bi-file-earmark-pdf text-danger fa-2x cursor-pointer"
                  onClick={() => dispatch(savePdfUrls(row.UploadedFile))}
                ></i>
              </Link>
            )}
          </div>
        </TableCell>
        <TableCell>{row.FirstName}</TableCell>
        <TableCell>{row.LastName}</TableCell>
        <TableCell>{row.Phone}</TableCell>
        <TableCell className="min-w-150px">{row.PhysicianName}</TableCell>
        <TableCell>{row.FacilityName}</TableCell>
        <TableCell>{row.RequisitionType}</TableCell>
        <TableCell className="min-w-125px">{row.AddedBy}</TableCell>
        <TableCell className="min-w-125px">{row.UpdatedBy}</TableCell>
        <TableCell>{row.UpdatedDate}</TableCell>
        <TableCell>{row.TimeOnStatus}</TableCell>
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
