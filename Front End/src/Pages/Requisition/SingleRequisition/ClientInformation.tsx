import React, { useState } from "react";
import GroupedSelect from "../../../Shared/GroupedSelect";
import useLang from "Shared/hooks/useLanguage";

const ClientInformation = (props: any) => {
  const { t } = useLang();
  const [showhide, setshowhide] = useState<boolean>(false);
  return (
    <div className="card mb-4">
      <div className="card-header d-flex justify-content-between align-items-center">
        <h3 className="m-0">{t("Client Information")}</h3>
      </div>
      <div className="card-body py-md-4 py-3">
        <div className="row">
          {/* <GroupedSelect id={props?.id} show={showhide} /> */}
          <div
            className={`mb-5 mt-4 col-xl-6 col-lg-6 col-md-6 col-sm-12 ${
              showhide ? "collapse" : ""
            }`}
          >
            <button
              type="button"
              className="btn btn-light btn-sm px-4 mx-2 p-2 text-primary py-3"
              onClick={props?.handleOpen}
            >
              <span className="bi bi-plus "></span>{t("Add New Provider")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientInformation;
