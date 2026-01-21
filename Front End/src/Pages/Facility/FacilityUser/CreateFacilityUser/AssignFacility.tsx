import React, { useState } from "react";
import Facilities from "./Facilities";
import useLang from "Shared/hooks/useLanguage";
import { AxiosError, AxiosResponse } from "axios";
import UserManagementService from "Services/UserManagement/UserManagementService";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
const AssignFacility = () => {
  const [sports2, setSports2] = useState<any>([]);
  const [facilities, setFacilities] = useState([]);
  const [values, setValues] = useState<any>({
    facilitiesIds: [],
  });
  const navigate = useNavigate();
  const params = useParams();
  const { t } = useLang();
  const [UserInfo, setUserInfo] = useState<any>();
  const SaveFacilityAgainstId = async () => {
    if (params.id && typeof params.id === "string") {
      try {
        const decodedId = atob(params.id);
        const obj = {
          id: decodedId,
          facilities: values.facilitiesIds,
        };
        UserManagementService.saveAssignedFacility(obj).then(
          (result: AxiosResponse) => {
            if (result.data.statusCode == 200) {
              toast.success(result.data.responseMessage);
              navigate("/facility-user-list");
            }
          }
        );
      } catch (error) {
        console.error("Error decoding Base64 string:", error);
      }
    } else {
      console.error("params.id is missing or invalid");
    }
  };

  const loadFacilities = () => {
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const EditFacilityUser = async (id: any) => {
    await UserManagementService.getFacilityUserAgainstId(atob(id))
      .then((res: AxiosResponse) => {
        var data = res.data.data;
        setUserInfo(data);
        setSports2(res.data.data.facilities);
      })
      .catch((err: AxiosError) =>
        console.error(err, "err while creating user")
      );
  };

  React.useEffect(() => {
    const id = params.id;
    loadFacilities();
    EditFacilityUser(id);
  }, []);
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-3 py-lg-6">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                <li className="breadcrumb-item text-muted">
                  <a href="" className="text-muted text-hover-primary">
                    {t("Home")}
                  </a>
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
              <a
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon"
                id="kt_reset"
                href="/facility-user-list"
              >
                <span>
                  <span>cancel</span>
                </span>
              </a>
              <button
                className="btn btn-sm btn-primary"
                onClick={SaveFacilityAgainstId}
              >
                Save
              </button>
            </div>
          </div>
        </div>

        {/* <Link
                    to="/facility-user-list"
                    className="btn btn-sm btn-secondary"
                  >
                    cancel
                  </Link> */}
        {typeof UserInfo !== "undefined" ? (
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div
              id="kt_app_content_container"
              className="app-container container-fluid"
            >
              <div className="card">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h4> Assign Facility</h4>
                </div>
                <div className="card-body py-md-4 py-3">
                  <h5 className="fw-bold text-primary mb-6 mt-3">
                    {t("Facility User Information")}
                  </h5>
                  <div className="row">
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-5">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            {t("First Name :")}
                          </div>
                        </div>
                        <div className="col-7">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {UserInfo?.firstName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-5">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            {t("Last Name :")}
                          </div>
                        </div>
                        <div className="col-7">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {UserInfo?.lastName}
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
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default AssignFacility;
