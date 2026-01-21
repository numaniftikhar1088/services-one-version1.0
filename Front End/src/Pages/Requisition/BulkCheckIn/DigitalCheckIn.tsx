import { Paper } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import DymoLabel from "Pages/Printing/DymoPrint";
import printBarcode from "Pages/Printing/ZebraPrint";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectStyle, styles } from "Utils/Common";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import DataUpdateModal from "../SingleRequisition/ViewReq/DataUpdateModal";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";

const DigitalCheckIn = () => {


  const isMobile = useIsMobile();

  const { t } = useLang();
  const defaultEntry = {
    number: "",
    accessionNumber: "",
    status: "",
    specimenType: "",
    facilityName: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    dateOfCollection: "",
    dateScanned: "",
    user: "",
  };

  const [value, setValue] = useState<any>("");
  const [check, setCheck] = useState<any>(true);
  const [missingDateIndex, setMissingDateIndex] = useState<number | undefined>(
    undefined
  );
  const [barcodePrint, setBarcodePrint] = useState<any>(false);
  const [rows, setRows] = useState<any>([]);
  const [selectedPrinter, setSelectedPrinter] = useState<any>();
  const [printer, setPrinter] = useState([]);

  const handleNumberOfRowsAddition = (number: number) => {
    let newRows = Array.from({ length: number }, (_, index) => ({
      ...defaultEntry,
    }));
    setRows([...rows, ...newRows]);
  };

  useLayoutEffect(() => {
    handleNumberOfRowsAddition(30);
  }, []);

  const LoadDigitalCheckIn = async (index: number | undefined) => {
    if (index === undefined) return;

    const ObjtoSend = {
      number: value,
      isOrder: check,
    };

    await RequisitionType.getDigitalCheckIn(ObjtoSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          res.data.data["number"] = value;
          let rowsCopy = [...rows];
          rowsCopy[index] = res.data.data;
          setRows([...rowsCopy]);

          if (barcodePrint) {
            PrintLabel(
              res.data.data.requisitionID,
              res.data.data.requisitionOrderID
            );
          }
        }
      })
      .catch((error: any) => {
        if (error?.response?.status === 409) {
          setOpenModal(true);
          toast.error(t(error?.response?.data?.message));
          setMissingDateIndex(index);
          setModalData({
            RequisitionId: error?.response?.data?.data?.requisitionID,
            RequisitionOrderId: error?.response?.data?.data?.requisitionOrderID,
            RequisitionType: error?.response?.data?.data?.requisitionTypeID,
            missingFields: error?.response?.data?.data?.missingFields,
          });
        }
      })
      .finally(() => {});
  };

  const UndoDigitalCheckIn = (id: any) => {
    if (!id) return toast.error(t("Please undo a record with a value"));
    RequisitionType.UndoDigitalCheckIn(id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t("Record Successfully Processed"));
          setRows((prevRows: any) => {
            const updatedRows = prevRows.filter((row: any) => row.id !== id);
            return updatedRows;
          });
        } else {
          toast.error(t("Error ..."));
        }
      })
      .catch((error: any) => {});
  };

  const inputsRef = useRef<HTMLInputElement[]>([]);

  const focusInputByIndex = (index: number) => {
    if (inputsRef.current[index]) {
      inputsRef.current[index].focus();
    } else {
      console.error("Index out of bounds");
    }
  };

  const handleKeyDown = async (e: any, index: number, rowData: any) => {
    if (rowData === "") return;
    if (e.key === "Enter" || e.key === "Tab") {
      e.preventDefault();
      await LoadDigitalCheckIn(index);
      if (rows.length === index + 1) return;
      focusInputByIndex(index + 1);
    }
  };

  const handleChangeSwitch = (e: any) => {
    setCheck(e.target.checked);
  };

  const handleChange = (value: any, index: any) => {
    const updatedRowData = [...rows];
    updatedRowData[index] = {
      ...updatedRowData[index],
      number: value,
    };
    setRows(updatedRowData);
    setValue(value);
  };

  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const PrintLabel = async (
    requisitionId: number,
    requisitionOrderId: number
  ) => {
    const payload = {
      printerId: selectedPrinter.value,
      contentList: [
        {
          requisitionOrderId,
          requisitionId,
        },
      ],
    };
    const content = await getPrinterContentData(payload);

    if (
      selectedPrinter.label?.includes("zebra") ||
      selectedPrinter.label?.includes("Zebra")
    ) {
      let i: any;
      for (i = 0; i < content.length; i++) {
        printBarcode(content[i]);
      }
      // handleClose("dropdown4");
      return;
    }
    if (
      selectedPrinter.label?.includes("dymo") ||
      selectedPrinter.label?.includes("Dymo")
    ) {
      let i: any;
      for (i = 0; i < content.length; i++) {
        DymoLabel(content[i]);
      }
      // handleClose("dropdown4");
      return;
    } else {
      toast.error(t("Configuration not available"));
      return;
    }
  };

  function formatDate(inputDate: any) {
    if (!inputDate) {
      return "";
    } else {
      const date = new Date(inputDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const year = date.getFullYear();
      const formattedDate = `${month}-${day}-${year}`;
      return formattedDate;
    }
  }

  const handleChangePrinter = (e: any) => {
    setSelectedPrinter(e);
  };

  const getPrintersInfo = async () => {
    await RequisitionType.GetPrintersInfo().then((res: any) => {
      setPrinter(res.data.data);
      setSelectedPrinter(
        res.data.data.find((item: any) => item.isDefault === true)
      );
    });
  };

  useEffect(() => {
    getPrintersInfo();
  }, []);
  console.log(rows, "Rowwwwsss");

  const [openModal, setOpenModal] = useState(false);
  interface ModalDataType {
    RequisitionId: number;
    RequisitionOrderId: number;
    RequisitionType: string;
    missingFields?: string[];
  }

  const [modalData, setModalData] = useState<ModalDataType | null>(null);

  const closeModal = () => {
    setOpenModal(false);
  };

  return (
    <>
      <DataUpdateModal
        open={openModal}
        onClose={closeModal}
        modalData={modalData}
        callFrom="digitalcheckin"
        LoadDigitalCheckIn={LoadDigitalCheckIn}
        missingDateIndex={missingDateIndex}
      />
      <div className="card">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="card">
            <div className="card-body py-md-3 py-2">
              <div className="d-flex gap-2 my-5 justify-content-between align-items-center">
                <div className="d-flex gap-2 align-items-center">
                  <div className="d-flex">
                    <span className="fw-600 px-2">{t("Record #:")}</span>
                    <label className="form-check form-switch ">
                      <input
                        id="BulkCheckInDigitalCheckInOrderNumber"
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        name="isOrder"
                        onChange={handleChangeSwitch}
                        checked={check}
                      />
                    </label>
                  </div>
                  <div className="d-flex">
                    <span className="fw-600 px-2">{t("Print Barcode:")}</span>
                    <label className="form-check form-switch fw-600">
                      <input
                        id="BulkCheckInDigitalCheckInPrintBarCode"
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        onChange={() => setBarcodePrint(!barcodePrint)}
                        checked={barcodePrint}
                      />
                    </label>
                  </div>
                </div>
                <div
                  className={
                    isMobile
                      ? "d-flex flex-column align-items-stretch w-100"
                      : "d-flex align-items-center"
                  }
                  style={isMobile ? { gap: 8 } : {}}
                >
                  <button
                    id="BulkCheckInDigitalCheckInAdd10Rows"
                    className="btn btn-primary btn-sm btn-primary--icon"
                    style={
                      isMobile
                        ? { width: "100%" }
                        : { minWidth: 120, marginRight: 8 }
                    }
                    onClick={() => handleNumberOfRowsAddition(10)}
                  >
                    <span>{t("More Rows")}</span>
                  </button>
                  <div style={isMobile ? { width: "100%" } : {}}>
                    <Select
                      inputId="BulkCheckInDigitalCheckInPrintertype"
                      menuPortalTarget={document.body}
                      styles={reactSelectStyle}
                      theme={(theme: any) => styles(theme)}
                      options={printer}
                      name="selectedPrinter"
                      placeholder={t("Select...")}
                      onChange={handleChangePrinter}
                      value={printer.filter(
                        (printer: any) =>
                          printer.value === selectedPrinter?.value
                      )}
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
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
                      className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0 bg-light-warning"
                    >
                      <TableHead className="h-40px">
                        <TableRow className="h-30px">
                          <TableCell className="min-w-60px w-60px">
                            {t("Sr No.")}
                          </TableCell>
                          <TableCell className="min-w-200px w-200px">
                            {t("Accession No/Record #")}
                          </TableCell>
                          <TableCell className="min-w-40px w-40px">
                            {t("Action")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Accession No")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Status")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Specimen Type")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Facility Name")}
                          </TableCell>
                          <TableCell className="min-w-125px">
                            {t("First Name")}
                          </TableCell>
                          <TableCell className="min-w-125px">
                            {t("Last Name")}
                          </TableCell>
                          <TableCell className="min-w-150px">
                            {t("Date Of Birth")}
                          </TableCell>
                          <TableCell className="min-w-150px">
                            {t("Date Of Collection")}
                          </TableCell>
                          <TableCell className="min-w-150px">
                            {t("Date Scanned")}
                          </TableCell>
                          <TableCell className="min-w-150px">
                            {t("User")}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((rowData: any, index: any) => (
                          <Row
                            key={index}
                            index={index}
                            rowData={rowData}
                            handleChange={handleChange}
                            UndoDigitalCheckIn={UndoDigitalCheckIn}
                            formatDate={formatDate}
                            onKey={handleKeyDown}
                            inputsRef={inputsRef}
                            setRows={setRows}
                            rows={rows}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DigitalCheckIn;
