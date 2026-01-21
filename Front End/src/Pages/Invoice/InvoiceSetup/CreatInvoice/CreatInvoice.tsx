import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Select from "react-select";
import LoadButton from "Shared/Common/LoadButton";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "Utils/Common";
import { ArrowDown, ArrowUp } from "Shared/Icons";
import AddAccession from "./AddAccession";
import BalanceTable from "./BalanceTable";

//Types for Ivoice Data
interface InvoiceData {
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


function CreateInvoice({
  setCreatInvoice,
  selectedInvoice,
}: {
  setCreatInvoice: any;
 selectedInvoice: InvoiceData | null | undefined;
}) {
  const { t } = useLang();
   const [moreAccessions, setMoreAccessions] = useState(true);
     const [formData, setFormData] = useState({
    customer: "",
    facilityName: "",
    invoiceNumber: "",
    customerEmail: "",
    invoiceDate: "",
    dueDate: "",
    billingAddress: "",
    invoiceType: "",
  });


//set initial values for the form data
  useEffect(() => {
    if (selectedInvoice) {
      setFormData({
        customer: selectedInvoice.patientId,
        facilityName: selectedInvoice.facilityName,
        invoiceNumber: selectedInvoice.orderNumber,
        customerEmail: "demo@email.com", 
        invoiceDate: selectedInvoice.serviceDate,
        dueDate: selectedInvoice.receiveDate,
        billingAddress: "123 Billing St.", 
        invoiceType: selectedInvoice.billingType,
      });
    }
  }, [selectedInvoice]);
  return (
    <>
        {moreAccessions ? (
          <>
            <div id="ModalCollapse" className="card mb-5">
              <div className="align-items-center  card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1">
                <h4 className="m-1">{t("Create Invoice")}</h4>
              </div>

            <div id="form-search" className="card-body py-2 py-md-3">
              <div className="row">
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Customer")}</label>
                    <input
                    style={{ backgroundColor: '#eaf1fb' }}
                      type="text"
                      name="Customer"
                      value={formData.customer}
                      className="form-control "
                      placeholder="Customer"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Facility Name")}</label>
                    <input
                    style={{ backgroundColor: '#eaf1fb' }}

                      type="text"
                      name="FacilityName"
                      value={formData.facilityName}
                      className="form-control"
                      placeholder="Facility Name"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Invoice Number")}</label>
                    <input
                    style={{ backgroundColor: '#eaf1fb' }}

                      type="text"
                      name="InvoiceNumber"
                      value={formData.invoiceNumber}
                      className="form-control"
                      placeholder="Invoice Number"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Customer email")}</label>
                    <input
                    style={{ backgroundColor: '#eaf1fb' }}

                      type="email"
                      name="CustomerEmail"
                      value={formData.customerEmail}
                      className="form-control"
                      placeholder="Customer email"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Invoice Date")}</label>
                    <input
                      type="date"
                      name="InvoiceDate"
                      value={formData.invoiceDate}
                      className="form-control bg-transparent"
                      placeholder="Invoice Date"
                      
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Due Date")}</label>
                    <input
                      type="date"
                      name="DueDate"
                      value={formData.dueDate}
                      className="form-control bg-transparent"
                      placeholder="Due Date"
                      
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Billing Address")}</label>
                    <input
                    style={{ backgroundColor: '#eaf1fb' }}

                      type="text"
                      name="BillingAddress"
                      value={formData.billingAddress}
                      className="form-control "
                      placeholder="Billing Address"
                      readOnly
                    />
                  </div>
                </div>
                <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
                  <div className="fv-row mb-4">
                    <label className="mb-2 fw-500">{t("Invoice Type")}</label>
                    <Select
                   

                      menuPortalTarget={document.body}
                      theme={(theme: any) => styles(theme)}
                      placeholder="Invoice Type"
                      name="InvoiceType"
                      styles={reactSelectSMStyle}
                      value={{ label: formData.invoiceType, value: formData.invoiceType }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
            <hr />
            <BalanceTable setCreatInvoice={setCreatInvoice} setMoreAccessions={setMoreAccessions} />
          </>
        ) : (
          <AddAccession setMoreAccessions={setMoreAccessions} />
        )}
      
    </>
  );
}

export default React.memo(CreateInvoice, (prevProps, nextProps) => {
  return prevProps.setCreatInvoice === nextProps.setCreatInvoice;
});
