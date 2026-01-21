import React, { memo, useState } from "react";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";

import Box from "@mui/material/Box";
import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Typography,
} from "@mui/material";
import { SampleRow } from ".";
const Row = (props: { i: any }) => {
  const { i } = props;
  const [open, setopen] = useState<any>(false);
  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <button
            className="btn btn-sm btn-warning px-1 py-1"
            onClick={() => setopen(!open)}
          >
            Press
          </button>
        </TableCell>
        <TableCell></TableCell>
        <TableCell scope="row"></TableCell>
        <TableCell scope="row"></TableCell>
        <TableCell scope="row"></TableCell>

        <TableCell align="left"></TableCell>
        <TableCell></TableCell>
        <TableCell></TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      {SampleRow.map(() => (
                        <div className="table_bordered overflow-hidden">
                          <TableContainer
                            sx={{
                              maxHeight: 400,
                              "&::-webkit-scrollbar": {
                                width: 7,
                              },
                              "&::-webkit-scrollbar-track": {
                                backgroundColor: "#fff",
                              },
                              "&:hover": {
                                "&::-webkit-scrollbar-thumb": {
                                  backgroundColor: "var(--kt-gray-400)",
                                  borderRadius: 2,
                                },
                              },
                              "&::-webkit-scrollbar-thumb": {
                                backgroundColor: "var(--kt-gray-400)",
                                borderRadius: 2,
                              },
                            }}
                            className="shadow-none"
                          >
                            <Table
                              aria-label="sticky table collapsible"
                              className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                            >
                              <TableHead>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>{" "}
                                <TableRow className="h-35px">
                                  <TableCell />
                                  <TableCell className="min-w-50px">
                                    Demo
                                  </TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                  <TableCell>Demo</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </div>
                      ))}
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
