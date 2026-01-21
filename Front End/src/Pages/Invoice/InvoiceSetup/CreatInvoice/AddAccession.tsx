import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import { Table } from "react-bootstrap";
import LoadButton from "Shared/Common/LoadButton";
import useLang from "Shared/hooks/useLanguage";

function AddAccession({ setMoreAccessions }: any) {
  const { t } = useLang();
  return (
    <>
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={{
                maxHeight: "calc(100vh - 100px)",
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
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell sx={{ width: "max-content" }}>
                      {/* <div className="d-flex justify-content-between  ">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div> */}
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}></div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          {t("Accession # / SKU")}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Test Performed / Description")}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: "max-content" }}>
                          {t("Total Amount")}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">1</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220002
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Liver Function Panel
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$120</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">2</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220003
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Thyroid Profile Complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$95</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">3</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220004
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Vitamin D & B12 Combo
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$85</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">4</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220005
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Cardiac Risk Marker Panel
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$150</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">5</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220006
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Comprehensive Metabolic Panel
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$110</div>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">6</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220007
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Allergy Screening Test
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$130</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">7</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220008
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Iron Studies Panel
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$75</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">8</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220009
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Complete Blood Count (CBC)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$55</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">9</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220010
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Hormonal Imbalance Test
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$160</div>
                      </div>
                    </TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <label className="form-check form-check-sm form-check-solid">
                          <input className="form-check-input" type="checkbox" />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">10</div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        GDA2504220011
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>
                          Kidney Function Test (KFT)
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div className="d-flex justify-content-between">
                        <div style={{ width: "max-content" }}>$105</div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      <div className="card mb-5">
        <div className="align-items-center  card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
          <div className="d-flex align-items-center gap-2"></div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-secondary btn-sm fw-bold "
              aria-controls="SearchCollapse"
              aria-expanded="true"
              type="button"
              onClick={() => setMoreAccessions(true)}
            >
              <span>
                <span>{t("Cancel")}</span>
              </span>
            </button>
            <LoadButton
              className="btn btn-sm fw-bold btn-primary"
              // loading={isSubmitting}
              btnText="Save"
              loadingText="Saving"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAccession;
