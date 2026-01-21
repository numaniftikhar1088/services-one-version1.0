import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Paper } from "@mui/material";
const ViewInfectiousDisease = () => {
  return (
    <>
      {" "}
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="row">
          {/* **************** Lab information section *********************/}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Lab Information</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-3 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <span className="fw-500 text-primary">Lab Name:</span>{" "}
                    <span className="text-muted">Lab Name</span>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* **************** Medical Necessity section *********************/}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Medical Necessity</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                    <span className="fw-500 ">Exposure to covid-19</span>
                    <div>
                      <div>
                        <span className="fw-500">N/A</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* **************** Specimen section *********************/}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Specimen information</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-3 col-xl-12 col-lg-12 col-md-12 col-sm-12 d-flex justify-content-between align-items-center">
                    <span className="fw-500 ">Specimen ID</span>
                    <div>
                      <div>
                        <span className="fw-500">....</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>{" "}
          {/* **************** Drug allergy section *********************/}
          <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Drug Allergies</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                  Daptomycin
                </div>
              </div>
            </div>
          </div>
          {/* **************** Testing section *********************/}
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Testing Option</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
                      <div className="shadow card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <span className="m-0">SARS-CoV2,NAAT</span>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                            covid
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
                      <div className="shadow card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <span className="m-0">SARS-CoV2,NAAT</span>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                            covid
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
                      <div className="shadow card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <span className="m-0">SARS-CoV2,NAAT</span>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                            covid
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
                      <div className="shadow card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <span className="m-0">SARS-CoV2,NAAT</span>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                            covid
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* **************** Specimen Source section *********************/}
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Specimen Source</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 rounded">
                      <div className="shadow card mb-4">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <span className="m-0">COVID-19</span>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="badge badge-pill badge-secondary px-4 py-2 rounded-4 fw-400 fa-1x">
                            covid
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* **************** Diagnosis section *********************/}
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded">
            <div className="shadow card mb-4">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h3 className="m-0">Diagnosis / ICD 10 Codes</h3>
              </div>
              <div className="card-body py-md-4 py-3">
                <h6 className="text-primary">Diagnosis Code(s)</h6>
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={{
                        maxHeight: 'calc(100vh - 100px)',
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
                      component={Paper}
                      className="shadow-none"
                    >
                      <Table
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                      >
                        <TableHead className="h-40px">
                          <TableRow>
                            <TableCell className="min-w-150px w-150px">
                              Icd 10 codes
                            </TableCell>
                            <TableCell className="min-w-600px w-600px">
                              Description
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewInfectiousDisease;
