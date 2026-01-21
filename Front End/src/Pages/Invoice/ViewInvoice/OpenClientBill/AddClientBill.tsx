import React from "react";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { styles } from "Utils/Common";
const AddClientBill = () => {
  const { t } = useLang();
  return (
    <>
      <div id="ModalCollapse" className="card mb-5">
        <div id="form-search">
          <div className="row">
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
              <div className="fv-row mb-4">
                <label className="  mb-2 fw-500">{t("First Name")}</label>
                <input
                  type="text"
                  name="Customer"
                  className="form-control bg-transparent"
                  placeholder="First Name"
                />
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
              <div className="fv-row mb-4">
                <label className="  mb-2 fw-500">{t("Last Name")}</label>
                <input
                  type="text"
                  name="FacilityName"
                  className="form-control bg-transparent"
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
              <div className="fv-row mb-4">
                <label className="mb-2 fw-500">{t("Date Of Birth")}</label>
                <input
                  type="Date"
                  name="InvoiceNumber"
                  className="form-control bg-transparent"
                  placeholder="Invoice Number"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
};

export default AddClientBill;
