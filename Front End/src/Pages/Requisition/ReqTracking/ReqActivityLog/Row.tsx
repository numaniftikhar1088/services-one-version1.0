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

function Row({ row }: any) {
  const [open, setOpen] = useState(false);

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
        <TableCell>{row.UserName}</TableCell>
        <TableCell>{row.ActivityAction}</TableCell>
        <TableCell>{row.ActivityName}</TableCell>
        <TableCell>{row.ActivityDate}</TableCell>
        <TableCell>{row.ActivityTime}</TableCell>
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
                              __html: row.ColumnAuditString,
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
