import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useParams } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "../../../Services/FacilityService/FacilityService";
import { Loader } from "../../../Shared/Common/Loader";

const ViewSingleFacilityForApproval = () => {
  const { t } = useLang()
  const [FacilityInfo, setFacilityInfo] = useState<any>();
  const params: any = useParams();
  const ViewFacility = (id: number) => {
    FacilityService.getFacilityById(id).then((result: AxiosResponse) => {
      var data = result.data.data;
      setFacilityInfo(data);
    });
  };
  useEffect(() => {
    const id = parseInt(atob(params.id));
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

              <li className="breadcrumb-item text-muted">{t("Facility Approval")}</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">{t("View")}</li>
            </ul>
          </div>
        </div>
      </div>

      {typeof FacilityInfo !== "undefined" ? (
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <Link to="/facilityApproval" className="">
                  <div className="text-muted mt-2">
                    <i className="bi bi-arrow-left fs-2qx"></i>
                  </div>
                </Link>
              </div>
              <div className="card-body py-md-4 py-3">
                <h2 className="fw-bold text-primary mb-6 mt-3">{t("General")}</h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Facility Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.generalInfo?.facilityName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Address :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.generalInfo?.addressView?.address1}
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
                          {FacilityInfo?.generalInfo?.addressView?.address2}
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
                          {FacilityInfo?.generalInfo?.addressView?.city}
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
                          {FacilityInfo?.generalInfo?.addressView?.state}
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
                          {FacilityInfo?.generalInfo?.zipCode}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Phone No :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.generalInfo?.facilityPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Fax No :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.generalInfo?.facilityFax}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-4 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Facility Website")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.generalInfo?.facilityWebsite}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                  {t("Contact Information")}
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
                          {FacilityInfo?.contactInfo?.contactFirstName}
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
                          {FacilityInfo?.contactInfo?.contactLastName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Contact Email :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.contactInfo?.contactPrimaryEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Phone No :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.contactInfo?.contactPhone}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                  {t("Provider Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Physician First Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.physicianFirstName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Physician Last Name :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.physicianLastName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Phone Number")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.phoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("NPI :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.npi}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("State License :")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.stateLicense}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Account Activation Type")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.providerInfo?.activationType === 0 ? (
                            <>
                              <span>{t("Username")}</span>
                            </>
                          ) : (
                            <>
                              <span>{t("Email")}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                  {t("Critical Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("First Name:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalFirstName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Last Name:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalLastName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Phone Number:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalPhoneNo}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Email:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                  {t("Shipping Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Shipping Name")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.shippingInfo?.shippingName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Shipping Address")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.shippingInfo?.shippingAddress}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Shipping Phone Number")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.shippingInfo?.shippingPhoneNumber}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Shipping Email")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.shippingInfo?.shippingEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Shipping Notes")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.shippingInfo?.shippingNote}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">
                  {t("Critical Information")}
                </h2>
                <div className="row">
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("First Name:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalFirstName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Last Name:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalLastName}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Phone Number:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalPhoneNo}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                    <div className="row">
                      <div className="col-4">
                        <div className="fw-semibold text-dark fs-6 d-block lh-1">
                          {t("Email:")}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="fw-semibold text-muted fs-6 d-block lh-1">
                          {FacilityInfo?.criticalInfo?.criticalEmail}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <hr className="text-muted" />
                <h2 className="fw-bold text-primary my-6">{t("Files")}</h2>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    {FacilityInfo?.files?.map((file: any) => (

                      <div className="col-xl-2 col-lg-2 col-md-3 col-sm-4 mb-3">
                        <div className="px-5">
                          {
                            <i
                              className="fa fa-file text-light-primary"
                              style={{ fontSize: "48px" }}
                            ></i>
                          }
                        </div>
                        <span className="fw-semibold text-dark px-3 mt-3">
                          {file?.name}
                        </span>
                      </div>

                    ))}
                  </div>
                </div>
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
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(ViewSingleFacilityForApproval);
