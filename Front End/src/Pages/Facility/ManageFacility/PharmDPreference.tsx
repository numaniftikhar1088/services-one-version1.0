import React, { useEffect, useState } from "react";
import { AxiosResponse } from "axios";
import FacilityService from "Services/FacilityService/FacilityService";
import useLang from "Shared/hooks/useLanguage";

interface AssignedSalesRepProps {
  id: string | number;
}

interface PharmDOption {
  id: string | number;
  optionName: string;
}

const PharmDPreference: React.FC<AssignedSalesRepProps> = ({ id }) => {
  const { t } = useLang();
  const [loading, setLoading] = useState(false);
  const [assignedUsers, setAssignedUsers] = useState<PharmDOption[]>([]);

  useEffect(() => {
    const fetchAssignedUsers = async () => {
      setLoading(true);
      try {
        const response: AxiosResponse =
          await FacilityService.getPharmDPreference(id);
        const data = response?.data?.data;
        setAssignedUsers(Array.isArray(data) ? data : []);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignedUsers();
  }, [id]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-3">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <h6 className="my-2 mt-0 text-primary">{t("PharmD Preference")}</h6>

          <div className="card-body py-md-0 py-0">
            {loading ? (
              <div className="text-center py-3">{t("Loading...")}</div>
            ) : (
              <div className="row mt-3">
                {assignedUsers?.map((item) => (
                  <div
                    key={item.id}
                    className="col-xl-3 col-lg-3 col-md-4 col-sm-6 mb-2"
                  >
                    <span className="badge bg-primary text-white px-3 py-2 rounded-pill">
                      {item.optionName}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmDPreference;
