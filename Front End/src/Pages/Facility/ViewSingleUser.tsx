import { AxiosResponse } from "axios";
import React, { useState } from "react";
import Moment from "react-moment";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import UserManagementService from "../../Services/UserManagement/UserManagementService";


const ViewSingleUser = () => {
  const { t } = useLang()
  const [UserInfo, setUserInfo] = useState<any>();
  const params = useParams();
  const ViewFacility = async (id: string | undefined) => {
    UserManagementService.fetchUserById(id).then((result: AxiosResponse) => {


      var data = result.data.data;
      setUserInfo(data);
    });
    // var result = await axios.get(`${process.env.REACT_APP_BASE_URL}/${routes.FacilityManagement.GetFacilityById}/${id}`, options);

    // var data = result.data.data;
    //  setUserInfo(data);
  };
  // ViewFacility();
  React.useEffect(() => {
    //
    const id = params.id;
    ViewFacility(id);
  }, []);
  return (
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
              {t("Manage Facility Users")}
              </li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("View")}</li>
            </ul>
          </div>
        </div>
      </div>

      {typeof UserInfo !== "undefined" ? (
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <Link to="/manage-facility-users" className="">
                  <div className="text-muted mt-2">
                    <i className="bi bi-arrow-left fs-2qx"></i>
                  </div>
                </Link>


              </div>
              <div className="card-body py-md-4 py-3">
                <h2 className="fw-bold text-primary mb-6 mt-3">
                {t("User Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("First Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.firstName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Last Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.lastName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Date Of Birth")}
                        </div>
                      </div>
                      <div className="col-8">
                        <Moment
                          format="MM/DD/yyyy"
                          className="fw-semibold text-muted fs-6 d-block lh-1"
                        >
                          {UserInfo.dateOfBirth}
                        </Moment>
                        {/* <div className="fw-semibold text-muted fs-6 d-block lh-1">{UserInfo.dateOfBirth}</div> */}
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Email :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.email}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("User Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.userName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Mobile :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.mobile}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                {t("User Address Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Address :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.addressView.address1}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Address 2 :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.addressView.addres2}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("City :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.addressView.city}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("State :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.addressView.state}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Zip Code :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.addressView.zipCode}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">{t("User Role")}</h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        {t("Role Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {UserInfo.roles?.subRoleName}
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(ViewSingleUser);
