import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { Table } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import CreatInvoiceRow from "./Row";
import CustomPagination from "Shared/JsxPagination";
import CreateInvoice from "./CreatInvoice";
import { useEffect, useState } from "react";

interface Lookups {
  value: number;
  label: string;
}
//////////////-------Start-------------///////////
// Declaring types for Each Row

interface InvoiceItem {
  id: number;
  facilityName: string;
  serviceDate: string;
  receiveDate: string;
  orderNumber: string;
  accessionNumber: string;
  accessionStatus: string;
  patientId: string;
  billingType: string;
  totalAmount: string;
  addedDate: string;
}

// Creating Dummy arrya to populate the data into the tables
const dummyInvoices: InvoiceItem[] = [
  {
    id: 1,
    facilityName: "City Lab",
    serviceDate: "2025-07-20",
    receiveDate: "2025-07-21",
    orderNumber: "ORD123",
    accessionNumber: "ACC123",
    accessionStatus: "Completed",
    patientId: "PAT001",
    billingType: "Insurance",
    totalAmount: "$100",
    addedDate: "2025-07-21",
  },
  {
    id: 2,
    facilityName: "Health Center",
    serviceDate: "2025-07-18",
    receiveDate: "2025-07-19",
    orderNumber: "ORD124",
    accessionNumber: "ACC124",
    accessionStatus: "Pending",
    patientId: "PAT002",
    billingType: "Self-pay",
    totalAmount: "$200",
    addedDate: "2025-07-19",
  },
  {
    id: 3,
    facilityName: "Wellness Lab",
    serviceDate: "2025-07-17",
    receiveDate: "2025-07-18",
    orderNumber: "ORD125",
    accessionNumber: "ACC125",
    accessionStatus: "In Progress",
    patientId: "PAT003",
    billingType: "Government",
    totalAmount: "$300",
    addedDate: "2025-07-18",
  },
];

//////////////-------End-------------///////////
const CreateInvoiceINdex = () => {
  const { t } = useLang();
  const [creatInvoice, setCreatInvoice] = useState(false);

  const [invoiceList, setInvoiceList] = useState<InvoiceItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleCreatInvoice = () => {
    setCreatInvoice(true);
  };
  // Load dummy data and select the first item
  useEffect(() => {
    setInvoiceList(dummyInvoices);
    setSelectedIds([dummyInvoices[0].id]);
  }, []);
  const selectedRows = invoiceList.filter((invoice) =>
    selectedIds.includes(invoice.id)
  );
  return (
    <>
      {creatInvoice ? (
        <>
          <CreateInvoice
            setCreatInvoice={setCreatInvoice}
            selectedInvoice={selectedRows[0] || null}
          />
        </>
      ) : (
        <>
          <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
            <div className="d-flex align-items-center responsive-flexed-actions gap-2">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  className="form-select w-100px h-33px rounded py-2"
                  data-allow-clear="true"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2">
                <button
                  className="btn btn-primary btn-sm btn-primary--icon"
                  onClick={handleCreatInvoice}
                >
                  <span
                    style={{
                      fontSize: "11px",
                    }}
                  >
                    {t("Create Invoice")}
                  </span>
                </button>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                aria-controls="Search"
                className="btn btn-info btn-sm fw-500"
              >
                {t("Search")}
              </button>
              <button
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id="kt_reset"
                type="button"
              >
                <span>
                  <span>{t("Reset")}</span>
                </span>
              </button>
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
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell>
                          <Select
                            menuPortalTarget={document.body}
                            theme={(theme: any) => styles(theme)}
                            name="trainingAidsCategory"
                            styles={reactSelectSMStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            menuPortalTarget={document.body}
                            theme={(theme: any) => styles(theme)}
                            name="trainingAidsCategory"
                            styles={reactSelectSMStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder="Search ..."
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="h-30px">
                        <TableCell>
                          {" "}
                          <label className="form-check form-check-sm form-check-solid">
                            <input
                              className="form-check-input"
                              type="checkbox"
                            />
                          </label>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Facility Name")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                              // CustomeClass={`${
                              //   sort.sortingOrder === "desc" &&
                              //   sort.clickedIconData === "fileName"
                              //     ? "text-success fs-7"
                              //     : "text-gray-700 fs-7"
                              // } p-0 m-0`}
                              />
                              <ArrowDown
                              // CustomeClass={`${
                              //   sort.sortingOrder === "asc" &&
                              //   sort.clickedIconData === "fileName"
                              //     ? "text-success fs-7"
                              //     : "text-gray-700 fs-7"
                              // } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell
                          sx={{
                            width: "max-content",
                          }}
                        >
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                          >
                            <div
                              style={{
                                width: "max-content",
                              }}
                            >
                              {t("Service Date")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="d-flex justify-content-between align-items-center min-w-80px">
                            <div>{t("Receive Date")}</div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Order #")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Accession #")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Accession Status")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Patient ID")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between">
                            <div style={{ width: "max-content" }}>
                              {t("Billing Type")}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Total Amount")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: "max-content" }}>
                          <div className="d-flex justify-content-between cursor-pointer">
                            <div style={{ width: "max-content" }}>
                              {t("Added Date")}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp />
                              <ArrowDown />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {invoiceList.map((item) => (
                        <CreatInvoiceRow
                          key={item.id}
                          data={item}
                       selected={selectedIds.includes(item.id)}
                          onSelect={() => {
                            setSelectedIds(
                              (prev) =>
                                prev.includes(item.id)
                                  ? prev.filter((id) => id !== item.id) // deselect
                                  : [...prev, item.id] // select
                            );
                          }}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>
        </>
      )}
    </>
  );
};

export default CreateInvoiceINdex;
