import Facilities from "Pages/Facility/FacilityUser/CreateFacilityUser/Facilities";
import ManageSalesRepServices from "Services/ManageSalesRep/ManageSalesRepServices";
import UserManagementService from "Services/UserManagement/UserManagementService";
import useLang from "Shared/hooks/useLanguage";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const AssignFacilitySalesRep = () => {
  const [sports2, setSports2] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [values, setValues] = useState({ facilitiesIds: [] });
  const [userInfo, setUserInfo] = useState<any>(null);

  const navigate = useNavigate();
  const { id } = useParams();
  const { t } = useLang();

  const saveFacilityAgainstId = async () => {
    if (!id) return console.error("params.id is missing or invalid");

    try {
      const decodedId = atob(id);
      const payload = { id: decodedId, facilities: values.facilitiesIds };
      const result =
        await ManageSalesRepServices.saveFacilityAgainstSalesRepUser(payload);

      if (result.data.statusCode === 200) {
        toast.success(result.data.responseMessage);
        navigate("/Manage-Sales-Rep");
      }
    } catch (error) {
      console.error("Error decoding Base64 string or saving data:", error);
    }
  };

  const loadFacilities = async () => {
    try {
      const response = await UserManagementService.GetFacilitiesLookup();
      setFacilities(response?.data || []);
    } catch (error) {
      console.error("Error fetching facilities:", error);
    }
  };

  const loadFacilityUserInfo = async (encodedId: string) => {
    try {
      const response = await ManageSalesRepServices.GetSalesInfo(
        atob(encodedId)
      );
      const data = response.data?.data;

      if (data) {
        setUserInfo(data);
        setSports2(data.facilities || []);
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    if (id) {
      loadFacilities();
      loadFacilityUserInfo(id);
    }
  }, [id]);

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <span className="text-muted text-hover-primary">
                  {t("Home")}
                </span>
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("Facility")}</li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">
                {t("View All Users")}
              </li>
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">
                {t("Assign Facility")}
              </li>
            </ul>
          </div>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => navigate("/Manage-Sales-Rep")}
            >
              <span>Cancel</span>
            </button>
            <button
              className="btn btn-sm btn-primary"
              onClick={saveFacilityAgainstId}
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {userInfo && (
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4>Assign Facility</h4>
              </div>
              <div className="card-body py-md-4 py-3">
                <h5 className="fw-bold text-primary mb-6 mt-3">
                  {t("Facility User Information")}
                </h5>
                <div className="row">
                  <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-5">
                        <div className="fw-semibold text-dark fs-6">
                          {t("First Name :")}
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="fw-semibold text-muted fs-6">
                          {userInfo?.firstName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-5">
                        <div className="fw-semibold text-dark fs-6">
                          {t("Last Name :")}
                        </div>
                      </div>
                      <div className="col-7">
                        <div className="fw-semibold text-muted fs-6">
                          {userInfo?.lastName}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Facilities
                  facilities={facilities}
                  values={values}
                  setValues={setValues}
                  sports2={sports2}
                  setSports2={setSports2}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignFacilitySalesRep;
