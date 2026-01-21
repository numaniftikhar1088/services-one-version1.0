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
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import useLang from "Shared/hooks/useLanguage";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import DeleteModal from "./DeleteModal";
import { Rows } from "./Row";
import { TBL_HEADERS } from "./tableHeaders";

interface DefaultEntryI {
  id: number;
  srNo: number;
  barCode: string;
  itemDescription: string;
  lotSerialNumber: string;
  quantity: number;
}

function BulkCheckIn() {
  const defaultEntry = {
    id: 0,
    srNo: 1,
    barCode: "",
    itemDescription: "",
    lotSerialNumber: "",
    quantity: 0,
  };

  const { t } = useLang();

  const [rows, setRows] = useState<DefaultEntryI[]>([]);
  const [isBarCodeActive, setIsBarCodeActive] = useState(false);
  const [reset, setReset] = useState<boolean>(false);
  const [supplyItemsData, setSupplyItemsData] = useState([]);
  const [openalert, setOpenAlert] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);

  const searchRef = useRef<any>(null);

  const handleNumberOfRowsAddition = (number: number) => {
    let newRows = Array.from({ length: number }, (_, index) => ({
      ...defaultEntry,
      srNo: rows.length + index + 1,
    }));
    setRows([...rows, ...newRows]);
  };

  const getSupplyItemsData = async () => {
    try {
      const response = await InsuranceService.getSupplyItemsLookup();
      setSupplyItemsData(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getSupplyItemsData();
  }, []);

  const SaveCheckInInventory = async () => {
    const filterPayload = rows.filter(
      (row: any) => (row.id !== 0 && row.quantity <= 0) || row.quantity === ""
    );
    if (filterPayload.length) {
      toast.error(t("Entered quantity should be greater than 0"));
    } else {
      try {
        let payload = {
          tab: "check-in",
          data: rows.filter((row) => row.id !== 0),
        };
        const res = await InsuranceService.inventorySaveCheckInOut(payload);
        if (res.data.httpStatusCode === 200) {
          toast.success(res.data.status);
          handleReset();
        } else {
          toast.error(res.data.message);
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleRemoveRow = (index: number) => {
    const filteredRows = rows.filter((_, rowIndex) => rowIndex !== index);
    const updatedRows = filteredRows.map((row, rowIndex) => ({
      ...row,
      srNo: rowIndex + 1,
    }));

    setRows(updatedRows);
  };

  useEffect(() => {
    handleNumberOfRowsAddition(10);
  }, []);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleReset = () => {
    setReset(!reset);
    setRows([]);
  };

  const handleBarCodeToggle = () => {
    handleReset();
    setIsBarCodeActive(!isBarCodeActive);
  };

  useEffect(() => {
    handleNumberOfRowsAddition(10);
  }, [reset]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <DeleteModal
        handleCloseAlert={handleCloseAlert}
        openalert={openalert}
        deleteIndex={deleteIndex}
        handleRemoveRow={handleRemoveRow}
      />
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="mb-5 hover-scroll-x">
            <div className="tab-pane" id="activetab" role="tabpanel">
              <div className="card tab-content-card">
                <div className="card-body py-2">
                  <div className="d-flex align-items-center mb-2 justify-content-between gap-2 responsive-flexed-actions">
                    <div className="d-flex gap-4">
                      <label>{t("Scan on Barcode:")}</label>
                      <div className="d-flex justify-content-center form-check form-switch">
                        <input
                        id={`BulkCheckInInvertoryScanBarCode`}
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          name="barcode"
                          defaultChecked={false}
                          onChange={handleBarCodeToggle}
                        />
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-4">
                      <button
                      id={`BulkCheckInInvertoryAddRows`}
                        className="btn btn-primary btn-sm btn-primary--icon px-7"
                        onClick={(e) => handleNumberOfRowsAddition(10)}
                      >
                        <span>
                          <i style={{ fontSize: "15px" }} className="fa">
                            &#xf067;
                          </i>
                          <span>{t("Add 10 New Rows")}</span>
                        </span>
                      </button>
                    </div>
                  </div>
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
                          stickyHeader
                          aria-label="sticky table collapsible"
                          className="plate-mapping-table mb-0"
                        >
                          <TableHead className="h-40px">
                            <TableRow className="h-30px">
                              {TBL_HEADERS.map((header) =>
                                header.name === "" ? (
                                  <TableCell key={header.variable}></TableCell>
                                ) : (
                                  <TableCell
                                    key={header.variable}
                                    className="min-w-50px"
                                  >
                                    <div
                                      className="d-flex justify-content-between cursor-pointer"
                                      ref={searchRef}
                                    >
                                      <div style={{ width: "max-content" }}>
                                        {t(header.name)}
                                      </div>
                                    </div>
                                  </TableCell>
                                )
                              )}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row, index) => (
                              <Rows
                                row={row}
                                key={index}
                                rows={rows}
                                index={index}
                                setRows={setRows}
                                setOpenAlert={setOpenAlert}
                                setDeleteIndex={setDeleteIndex}
                                isBarCodeActive={isBarCodeActive}
                                handleRemoveRow={handleRemoveRow}
                                supplyItemsData={supplyItemsData}
                                handleNumberOfRowsAddition={
                                  handleNumberOfRowsAddition
                                }
                              />
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    <button
                      className="btn btn-primary btn-sm btn-primary--icon px-7 mt-2"
                      onClick={SaveCheckInInventory}
                      disabled={rows.length ? false : true}
                    >
                      <span>{t("Check-In Inventory")}</span>
                    </button>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BulkCheckIn;
