import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React from "react";
import LoadButton from "Shared/Common/LoadButton";
import useLang from "Shared/hooks/useLanguage";
//Dummy array for accessions
const dummyAccessions = [
  {
    id: 1,
    accessionNumber: "ACC001",
    testDescription: "Blood Test",
    totalAmount: 50,
  },
  {
    id: 2,
    accessionNumber: "ACC002",
    testDescription: "Urine Test",
    totalAmount: 75,
  },
  {
    id: 3,
    accessionNumber: "ACC003",
    testDescription: "X-Ray",
    totalAmount: 100,
  },
];

interface BalanceTableProps {
  setCreatInvoice: React.Dispatch<React.SetStateAction<boolean>>;
  setMoreAccessions: React.Dispatch<React.SetStateAction<boolean>>;
}

function BalanceTable({
  setCreatInvoice,
  setMoreAccessions,
}: BalanceTableProps) {
  const { t } = useLang();

  const handleAddMoreAccessions = () => {
    console.log("Setting moreAccessions to false");
    setMoreAccessions(false);
  };

  const handleCancel = () => {
    console.log("Cancelling invoice creation");
    setCreatInvoice(false);
  };
  //Calculate Subtotal
const subtotal = dummyAccessions.reduce((sum, item) => sum + item.totalAmount, 0);
  return (
    <>
      <div id="ModalCollapse" className="card mb-0">
        <div className="align-items-center card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
          <div className="d-flex align-items-center gap-2">
            <h4 className="m-1">{t("Balance Due:")}</h4>
            <h2>$0.00</h2>
          </div>
        </div>
      </div>

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
              <Table className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0">
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell />
                    <TableCell>{t("Accession # / SKU")}</TableCell>
                    <TableCell>{t("Test Performed / Description")}</TableCell>
                    <TableCell>{t("Total Amount")}</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* Map Accession array data  */}
                  {dummyAccessions.map((item) => (
                    <TableRow className="h-30px" key={item.id}>
                      <TableCell sx={{ width: "max-content" }}></TableCell>
                      <TableCell sx={{ width: "max-content" }}>
                        {item.accessionNumber}
                      </TableCell>
                      <TableCell sx={{ width: "max-content" }}>
                        {item.testDescription}
                      </TableCell>
                      <TableCell sx={{ width: "max-content" }}>
                        {item.totalAmount}
                      </TableCell>
                      <TableCell sx={{ width: "max-content" }}></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>

      <div
        className="row"
        style={{
          backgroundColor: "#E9EEF4",
          borderRadius: "7px",
          margin: "1px",
        }}
      >
        <div className="align-items-center minh-42px d-flex gap-1 justify-content-end px-20 col-10">
          <h4 className="m-0">{t("Subtotal")}:</h4>
          <p className="m-0">${subtotal.toFixed(2)}</p>
        </div>
      </div>

      <div className="card mb-5">
        <div className="align-items-center card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
          {/* <div className="d-flex align-items-center gap-2">
            <button
              className="btn btn-primary btn-sm btn-primary--icon"
              onClick={handleAddMoreAccessions}
            >
              <span style={{ fontSize: "11px" }}>
                {t("Add More Accessions")}
              </span>
            </button>
          </div> */}
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-secondary btn-sm fw-bold"
              type="button"
              onClick={handleCancel}
            >
              <span>{t("Cancel")}</span>
            </button>
            <LoadButton
              className="btn btn-sm fw-bold btn-primary"
              // loading={isSubmitting}
              btnText={t("Save")}
              loadingText={t("Saving")}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default BalanceTable;
