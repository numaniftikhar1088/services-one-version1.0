import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

const ViewPatient = () => {
  let location = useLocation();
  let patientInsurence = location?.state?.patientInsurances;

  console.log(location, 'location');
  

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <div className="app-toolbar py-3 py-lg-6">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
            <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
              <li className="breadcrumb-item text-muted">
                <a href="" className="text-muted text-hover-primary">
                  Home
                </a>
              </li>
    
              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">Patient</li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>

              <li className="breadcrumb-item text-muted">
                Patient-Demographic-List
              </li>

              <li className="breadcrumb-item">
                <span className="bullet bg-gray-400 w-5px h-2px"></span>
              </li>
              <li className="breadcrumb-item text-muted">View</li>
            </ul>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <Link to="/patient-demographics-list" className="">
                <div className="text-muted mt-2">
                  <i className="bi bi-arrow-left fs-2qx"></i>
                </div>
              </Link>
            </div>
            <div className="card-body py-md-4 py-3">
              <h2 className="fw-bold text-primary mb-6 mt-3">
                Patient Information
              </h2>
              <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        First Name :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.firstName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Middle Name :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.middleName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Last Name :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.lastName}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Date of Birth :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {moment(
                          location?.state?.dateOfBirth,
                          "YYYY-MM-DD"
                        ).format("MM-DD-YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Gender :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.gender}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Ethnicity :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.ethnicity}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Race :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.race}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Patient Type :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.patientType}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Social Secuirity Number :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.socialSecurityNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Passport Number :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.passportNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        DL/ID Number :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.dlidNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="text-muted" />
              <h2 className="fw-bold text-primary my-6">
                Patient Current Address
              </h2>
              <div className="row">
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Address 1 :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.address1}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Address 2 :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.address2}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Zipcode :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.zipCode}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        City :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.city}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        State :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.state}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        County :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.county}
                      </div>
                    </div>
                  </div>
                </div>
                {/* <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Country :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.country}
                      </div>
                    </div>
                  </div>
                </div> */}
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Mobile No :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.mobileNumber}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Contact Email :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.email}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Weight :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.weight}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Height :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.height}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                  <div className="row">
                    <div className="col-4">
                      <div className="fw-semibold text-dark fs-6 d-block lh-1">
                        Phone No :
                      </div>
                    </div>
                    <div className="col-8">
                      <div className="fw-semibold text-muted fs-6 d-block lh-1">
                        {location?.state?.address?.phoneNumber}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <hr className="text-muted" />
              <h2 className="fw-bold text-primary my-6">
                Insurance Information
              </h2>

              <div className="row">
                {location?.state?.patientInsurances.map((item: any) => (
                  <>
                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Subscriber Full Name :
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.subscriberName}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Subscriber Relation
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.subscriberRelation}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Insurance :
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.insuranceName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Insurance Provider :
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.insuranceProviderName}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Group Number :
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.groupNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-4 col-lg-6 col-md-12 col-sm-12 mb-4">
                      <div className="row">
                        <div className="col-4">
                          <div className="fw-semibold text-dark fs-6 d-block lh-1">
                            Policy Number :
                          </div>
                        </div>
                        <div className="col-8">
                          <div className="fw-semibold text-muted fs-6 d-block lh-1">
                            {item?.policyNumber}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mb-4">
                      <hr className="text-muted" />
                    </div>
                  </>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewPatient;
