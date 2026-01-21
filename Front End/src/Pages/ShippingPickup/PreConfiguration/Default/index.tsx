import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import useLang from "Shared/hooks/useLanguage";

function Default() {

  const { t } = useLang()

  const [archiveDays, setArchiveDays] = useState(0);

  const handleArchiveDaysChange = (event: any) => {
    setArchiveDays(event.target.value);
  };

  const SaveArchiveDays = async () => {
    const response = await InsuranceService.saveArchiveDays(archiveDays);
    if (response?.data?.httpStatusCode === 200) {
      toast.success(response?.data?.message);
    }
  };

  const getAutoArchiveSettings = async () => {
    let obj = {
      pageNumber: 1,
      pageSize: 10,
      queryModel: 0,
      sortColumn: "",
      sortDirection: "",
    };
    const response = await InsuranceService.getAutoArchiveSettings(obj);
    setArchiveDays(response.data.data);
  };

  useEffect(() => {
    getAutoArchiveSettings();
  }, []);

  return (
    <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
      <div className="d-flex align-items-center mb-2 mt-3 gap-2">
        <div className="container-fluid px-10 py-5 d-flex flex-column flex-md-row gap-20">
          <div>
            <div>
              <label>{t("Archived After How many days?")}</label>
              <input
              id={`ShippingPreConfigrationDefaultPathName`}
                type="number"
                name="pathName"
                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 mt-2"
                value={archiveDays}
                onChange={handleArchiveDaysChange}
              />
            </div>
            <div className="d-flex align-items-center gap-2 mt-8">
              <button
                type="button"
                className="btn btn-secondary btn-sm fw-500"
                id={`ShippingPreConfigrationDefaultReset`}
              >
                <span>{t("Cancel")}</span>
              </button>
              <button
              id={`ShippingPreConfigrationDefaultSave`}
                className="btn btn-primary btn-sm fw-500"
                aria-controls="Search"
                onClick={SaveArchiveDays}
              >
                {t("Save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Default;
