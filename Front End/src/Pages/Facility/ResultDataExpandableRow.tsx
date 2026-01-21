import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Paper } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";


const ResultDataExpandableRow = () => {
  const { t } = useLang()
  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
          <h5 className="mb-5">{t("Result Summary")}</h5>
          <div className="d-flex mb-5 gap-2">
            <button className="btn btn-success btn-sm fw-bold search d-block">
              <span  >{t("Publish & Validate")}</span>
            </button>
            <button className="btn btn-warning btn-sm fw-bold search d-block">
              <span  >{t("Preview")}</span>
            </button>
            <button className="btn btn-primary btn-sm fw-bold search d-block">
              <span  >{t("Save")}</span>
            </button>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center">
                <h5 className="m-0 text-info">{t("Controls")}</h5>
              </div>
              <div className="card-body py-lg-4 py-3 px-md-6 px-3">
                <div className="d-flex mb-5 gap-2">
                  <button className="btn btn-primary btn-sm fw-bold search d-block">
                    <span  >{t("All Pass")}</span>
                  </button>
                  <button className="btn btn-danger btn-sm fw-bold search d-block">
                    <span  >{t("All Fail")}</span>
                  </button>
                </div>
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
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="plate-mapping-table mb-1"
                    >
                      <TableHead className="h-40px">
                        <TableRow>
                          <TableCell className="min-w-80px w-80px">
                            {t("Control Name")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            {t("Results")}
                          </TableCell>
                          <TableCell className="min-w-80px w-80px">
                            {t("Combined Result")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            {t("CT Value")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            {t("Amp Score")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            {t("Crt SD")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            {t("Cq Conf")}
                          </TableCell>
                          <TableCell className="min-w-50px w-50px">
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />{" "}
                              {t("Re-Run")}
                            </label>
                            {""}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        <TableRow>
                          <TableCell>{t("Xeno")}</TableCell>
                          <TableCell>{t("Fail")}</TableCell>
                          <TableCell>
                            {" "}
                            <select name="" className="form-select">
                              <option className="fw-500 text-dark">
                                {t("Select...")}
                              </option>
                            </select>
                          </TableCell>
                          <TableCell>
                            <input
                              type="text"
                              className="form-control bg-transparent"
                            />
                          </TableCell>
                          <TableCell>
                            {" "}
                            <input
                              type="text"
                              className="form-control bg-transparent"
                            />
                          </TableCell>
                          <TableCell>
                            {" "}
                            <input
                              type="text"
                              className="form-control bg-transparent"
                            />
                          </TableCell>
                          <TableCell>
                            {" "}
                            <input
                              type="text"
                              className="form-control bg-transparent"
                            />
                          </TableCell>
                          <TableCell className="text-center">
                            {" "}
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                className="form-check-input"
                                type="checkbox"
                              />{" "}
                            </label>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
            style={{ border: "2px solid #ffc700" }}
          >
            <div className="card border">
              <div className="card-body py-md-4 py-3">
                <div className="d-flex gap-2 mb-2">
                  <button className="btn btn-success btn-sm fw-bold search d-block">
                    <span  >
                      {t("Full Undetermined")}
                    </span>
                  </button>
                  <button className="btn btn-danger btn-sm fw-bold search d-block">
                    <span  >{t("Inconclusive")}</span>
                  </button>
                </div>
                <h4 className="text-warning">{t("UTI-Open Array")}</h4>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
                        stickyHeader
                        aria-label="sticky table collapsible"
                        className="plate-mapping-table mb-1"
                      >
                        <TableHead className="h-40px">
                          <TableRow>
                            <TableCell className="min-w-100px">
                              {t("Organism")}
                            </TableCell>
                            <TableCell className="min-w-100px">
                              {t("Results")}
                            </TableCell>
                            <TableCell className="min-w-150px">
                              {t("Combined Result")}
                            </TableCell>
                            <TableCell className="min-w-100px">
                              {t("CT Value")}
                            </TableCell>
                            <TableCell className="min-w-100px">
                              {t("Amp Score")}
                            </TableCell>
                            <TableCell className="min-w-100px">
                              {t("Crt SD")}
                            </TableCell>
                            <TableCell className="min-w-100px">
                              {t("Cq Conf")}
                            </TableCell>
                            <TableCell className="min-w-150px">
                              <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                />{" "}
                                {t("Re-Run")}
                              </label>
                            </TableCell>
                            <TableCell className="min-w-450px">
                              {t("Comments")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell>{t("Acinetobacter baumanii")}</TableCell>
                            <TableCell>{t("Not Detected")}</TableCell>
                            <TableCell>
                              {" "}
                              <select name="" className="form-select">
                                <option className="fw-500 text-dark">
                                  {t("Select...")}
                                </option>
                              </select>
                            </TableCell>
                            <TableCell>
                              {" "}
                              <input
                                type="text"
                                className="form-control bg-transparent"
                              />
                            </TableCell>
                            <TableCell>
                              {" "}
                              <input
                                type="text"
                                className="form-control bg-transparent"
                              />
                            </TableCell>
                            <TableCell>
                              {" "}
                              <input
                                type="text"
                                className="form-control bg-transparent"
                              />
                            </TableCell>
                            <TableCell>
                              {" "}
                              <input
                                type="text"
                                className="form-control bg-transparent"
                              />
                            </TableCell>
                            <TableCell className="text-center">
                              {" "}
                              <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                />{" "}
                              </label>
                            </TableCell>
                            <TableCell>
                              <input
                                type="text"
                                className="form-control bg-transparent"
                              />
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
                <div className="mt-5 mt-mb-5 mt-sm-5">
                  <h4 className="text-warning">{t("Resistance")}</h4>
                </div>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5">
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
                          stickyHeader
                          aria-label="sticky table collapsible"
                          className="plate-mapping-table mb-1"
                        >
                          <TableHead className="h-40px">
                            <TableRow>
                              <TableCell className="min-w-100px">
                                {t("Organism")}
                              </TableCell>
                              <TableCell className="min-w-100px">
                                {t("Results")}
                              </TableCell>
                              <TableCell className="min-w-150px">
                                {t("Combined Result")}
                              </TableCell>
                              <TableCell className="min-w-100px">
                                {t("CT Value")}
                              </TableCell>
                              <TableCell className="min-w-100px">
                                {t("Amp Score")}
                              </TableCell>
                              <TableCell className="min-w-100px">
                                {t("Crt SD")}
                              </TableCell>
                              <TableCell className="min-w-100px">
                                {t("Cq Conf")}
                              </TableCell>
                              <TableCell className="min-w-150px">
                                <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />{" "}
                                  {t("Re-Run")}
                                </label>
                              </TableCell>
                              <TableCell className="min-w-450px">
                                {t("Comments")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            <TableRow>
                              <TableCell>{t("AIMC")}</TableCell>
                              <TableCell>{t("Not Detected")}</TableCell>
                              <TableCell>
                                {" "}
                                <select name="" className="form-select">
                                  <option className="fw-500 text-dark">
                                    {t("Select...")}
                                  </option>
                                </select>
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                />
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                />
                              </TableCell>
                              <TableCell className="text-center">
                                {" "}
                                <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                  />{" "}
                                </label>
                              </TableCell>
                              <TableCell>
                                <input
                                  type="text"
                                  className="form-control bg-transparent"
                                />
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-2 py-4 d-flex mb-5 gap-2">
            <button className="btn btn-success btn-sm fw-bold search d-block">
              <span  >{t("Publish & Validate")}</span>
            </button>
            <button className="btn btn-warning btn-sm fw-bold search d-block">
              <span  >{t("Preview")}</span>
            </button>
            <button className="btn btn-primary btn-sm fw-bold search d-block">
              <span  >{t("Save")}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDataExpandableRow;
