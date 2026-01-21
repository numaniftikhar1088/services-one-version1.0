import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Select from "react-select";
import AssigmentService from "../../../Services/AssigmentService/AssigmentService";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import DatePickerDuplicate from "../../../Shared/Common/DatePicker/DatePickerDuplicate";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
const LeveyJenning = () => {
  const { t } = useLang();

  //Use States
  const [dropDownValues, setDropDownValues] = useState<any>([]);
  const [value, setValue] = useState<any>({
    panelId: 0,
    dateRange: "",
  });
  const [filterData, setFilterData] = useState<any>();
  //Split date
  const dateRange = filterData ? filterData : "";
  const [startDate, endDate] = dateRange.split("to");
  const start = moment(startDate).format("MM/DD/YYYY");
  const end = moment(endDate).format("MM/DD/YYYY");
  //LookUp Function
  const GetPanelLookup = () => {
    AssigmentService.PanelLookUp()
      .then((res: AxiosResponse) => {
        setDropDownValues(res?.data);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  //UseEffect
  useEffect(() => {
    GetPanelLookup();
  }, []);
  // OnChange Function
  const handleChange = (event: any) => {
    setValue((prev: any) => ({
      ...prev,
      panelId: event?.value,
    }));
  };

  //Download Button
  const DownloadReport = async () => {
    const ObjToSend = {
      fromDate: start,
      tomDate: end,
      panelId: value?.panelId,
    };
    await RequisitionType.LeveyJenningReport(ObjToSend).then(
      (res: AxiosResponse) => {
        RequisitionType.ShowBlob(res?.data?.data).then((res: any) => {
          window.open(res?.data?.Data.replace("}", ""), "_blank");
        });
      }
    );
  };

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid py-2 py-lg-3">
        <div className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
          </div>
        </div>
        <div className="app-toolbar py-2 py-lg-3">
          <div className="d-flex flex-column flex-column-fluid">
            <div className="app-content flex-column-fluid">
              <div className="app-container container-fluid">
                <div className="bg-white p-6">
                  <h3 className="mb-5">{t("ID Levey Jenning Report")}</h3>
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                    <div className="d-flex gap-2 responsive-flexed-actions">
                      <div className="align-items-center">
                        <label className="required mb-2 fw-500">
                          {t("Date Range")}
                        </label>
                        <div>
                          <DatePickerDuplicate
                            setFilterData={setFilterData}
                            filterData={filterData}
                          />
                        </div>
                      </div>
                      <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start responsive-flexed-actions">
                        <div className="mt-0">
                          <label className="required mb-2 fw-500">
                            {t("Panel Name")}
                          </label>
                          <Select
                            menuPortalTarget={document.body}
                            theme={(theme) => styles(theme)}
                            placeholder="Select Panel"
                            options={dropDownValues}
                            styles={reactSelectSMStyle}
                            onChange={(event: any) => handleChange(event)}
                            value={dropDownValues?.filter(function (
                              option: any
                            ) {
                              return option.value === value?.panelId;
                            })}
                          />
                        </div>
                        <div className="col-sm-2 col-md-2 col-xl-2 col-xxl-2 d-flex align-items-end">
                          <PermissionComponent
                            moduleName="ID LIS"
                            pageName="Levey jenning Report"
                            permissionIdentifier="View"
                          >
                            <button
                              className="btn btn-icon btn-sm fw-bold btn-warning"
                              onClick={DownloadReport}
                            >
                              <i className="bi bi-cloud-download"></i>
                            </button>
                          </PermissionComponent>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
                      <div className="d-flex align-items-center gap-2 gap-lg-3"></div>
                    </div>
                  </div>
                  <hr />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LeveyJenning;
