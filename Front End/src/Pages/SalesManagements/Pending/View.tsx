import React, { useEffect, useState } from "react";
import { getSalesUserAgainstId } from "../../../Services/Marketing/SalesRepRequestService";
import { Link, useParams } from "react-router-dom";
import { Loader } from "../../../Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";

interface Facility {
  id: string; // Assuming each facility has a unique ID
  facilityName: string;
}

interface UserInfo {
  positionTitle: string;
  firstName: string;
  lastName: string;
  phone: string;
  salesEmail: string;
  salesRepNumber: string;
  facilities: Facility[];
}

const View: React.FC = () => {
  const { t } = useLang()
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();

  const viewSaleUsers = async (id: string) => {
    try {
      const res = await getSalesUserAgainstId(atob(id));
      setUserInfo(res.data.data);
    } catch (err) {
      setError("Failed to fetch user information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      viewSaleUsers(id);
    }
  }, [id]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <Link to="/" className="text-muted text-hover-primary">
                  {t("Home")}
                </Link>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Sales Rep Request")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("View")}</li>
            </ul>
          </div>
        </div>
      </div>

      {userInfo ? (
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <Link to="/sales-Rep-Request" className="">
                  <div className="text-muted mt-2">
                    <i className="bi bi-arrow-left fs-2qx"></i>
                  </div>
                </Link>
              </div>
              <div className="card-body py-md-4 py-3">
                <h2 className="fw-bold text-primary mb-6 mt-3">
                  {t("Sales Rep User Information")}
                </h2>
                <div className="row">
                  {[
                    { label: "Position Title", value: userInfo.positionTitle },
                    { label: "First Name", value: userInfo.firstName },
                    { label: "Last Name", value: userInfo.lastName },
                    { label: "Phone #", value: userInfo.phone },
                    { label: "Sales Email", value: userInfo.salesEmail },
                    { label: "Sales Rep Number", value: userInfo.salesRepNumber, },
                  ].map(({ label, value }) => (
                    <div
                      key={label}
                      className="col-xl-6 col-lg-6 col-md-12 col-sm-12 mb-4"
                    >
                      <div className="row">
                        <div className="col-6">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            {t(label)}:
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="fw-semibold text-muted d-block lh-1">
                            {value ?? "N/A"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <h2 className="fw-bold text-primary mb-6 mt-3">{t("Facilities")}</h2>
                {userInfo.facilities.length ? (
                  <div className="row">
                    {userInfo.facilities.map((facility) => (
                      <div className="col-xl-4 col-lg-4 col-md-4 col-sm-6 mb-4">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1"
                          key={facility.id}>
                          {facility.facilityName}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div>{t("No Facilities Available")}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
};

export default View;
