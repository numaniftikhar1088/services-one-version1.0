import React from "react";

const Blood: React.FC = () => {
  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="row">
          {/* ***************** Lab information ****************** */}
          <div className="col-lg-12">
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0 ">Lab Information</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div>
                      {" "}
                      <span style={{ color: "#69A54B" }}>Lab Name:</span>
                      <span className="text-muted p-2"> Assure lab</span>
                    </div>
                  </div>
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                    <div>
                      {" "}
                      <span className="p-2 text-muted ">
                        <i
                          className="bi bi-dash"
                          style={{ color: "#69A54B" }}
                        ></i>
                        in-house Lab
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ***************** Specimen Information ****************** */}
          <div className="col-lg-12">
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0">Specimen information</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-5 col-xl-5 col-lg-5 col-md-5 col-sm-12">
                    <h6 className=" mb-2">Specimen ID</h6>
                    <input
                      type="text"
                      name="email"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Specimen ID"
                      value=""
                    />
                  </div>

                  <div className="col-xl-7 col-lg-7 col-md-7 col-sm-12">
                    <h6 className=" mb-2">Specimen type</h6>
                    <div className="d-flex mb-3">
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className=" form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">Blood Serum</span>
                      </label>
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">EDTA Lavender</span>
                      </label>
                    </div>

                    <div className="d-flex">
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className=" form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">eSwab</span>
                      </label>
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">Frozen Plasma</span>
                      </label>
                    </div>
                  </div>
                  <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div className="mt-2 d-flex">
                      <span className="mr-2">Was the patient fasting</span>

                      <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          role="switch"
                          id="flexSwitchCheckDefault"
                        />
                        <label
                          className="form-check-label"
                          htmlFor="flexSwitchCheckDefault"
                        ></label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}

      {/* ***************** Testing Option ****************** */}
      <div className="col-lg-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="card-header d-flex justify-content-between align-items-center mb-5">
            <h5 className="m-0 ">Testing Options</h5>
          </div>
          <div className="card-body px-3 px-md-8">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  {/* ***************** 1/4 ****************** */}
                  <div className="col-lg-12">
                    <div className="card shadow-sm mb-3 rounded">
                      <div
                        className="card-header d-flex justify-content-between align-items-center rounded"
                        style={{ background: "#F3F6F9", borderRadius: "8px" }}
                      >
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid col-12">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Albumin/Creatinine Ratio (9029)</span>
                          </label>
                        </div>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="row">
                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid mb-3">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Albumin, Urine ( 1077 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Albumin/Creatinine Ratio</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Creatinine, Urine ( 1078 )</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ***************** 3/4 ****************** */}
                  <div className="col-lg-12 mt-3">
                    <div className="card shadow-sm mb-3 rounded">
                      <div
                        className="card-header d-flex justify-content-between align-items-center rounded"
                        style={{ background: "#F3F6F9", borderRadius: "8px" }}
                      >
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid col-12">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Basic Metabolic Panel (BMP) (9042)</span>
                          </label>
                        </div>
                      </div>

                      <div className="card-body py-md-4 py-3">
                        <div className="row">
                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Anion Gap ( 1041 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>BUN/CREA Ratio ( 1038 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Chloride ( 1027 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>eGFRcr ( 1086 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Potassium ( 1026 )</span>
                            </label>
                          </div>
                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Bicarbonate (CO2) ( 1002 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Calcium ( 1014 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Creatinine ( 1007 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Glucose ( 1021 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Sodium ( 1025 )</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="row">
                  {/* ***************** 2/4 ****************** */}
                  <div className="col-lg-12 ">
                    <div className="card shadow-sm mb-3 rounded">
                      <div
                        className="card-header d-flex justify-content-between align-items-center rounded"
                        style={{ background: "#F3F6F9", borderRadius: "8px" }}
                      >
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid col-12">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>ANA Autoimmune Profile (C011)</span>
                          </label>
                        </div>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="row">
                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>ANA Ab ( C012 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Antichromatin Antibodies ( C015 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Complement C3 ( C022 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Rheumatoid Factor ( C024 )</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Anti-Centromere B Antibody ( C026 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Antiribosomal Antibodies ( C014 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Complement C4 ( C023 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>RNP Antibodies ( C013 )</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ***************** 4/4 ****************** */}
                  <div className="col-lg-12">
                    <div className="card shadow-sm mb-3 rounded">
                      <div
                        className="card-header d-flex justify-content-between align-items-center rounded"
                        style={{ background: "#F3F6F9", borderRadius: "8px" }}
                      >
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid col-12">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>CBC w/ Diff (9022)</span>
                          </label>
                        </div>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="row">
                          <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>BA ( 3036 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>EO ( 3035 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>HCT ( 3024 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>MCHC ( 3027 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>MO ( 3034 )</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>BA# ( 3041 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>EO# ( 3040 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>HGB ( 3023 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>MCV ( 3025 )</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>MO# ( 3039 )</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ***************** Specimen source****************** */}

      {/* ***************** Diagnosis / ICD 10 Codes****************** */}
      <div className="col-lg-12 bg-white">
        <div className="card shadow-sm p-3 rounded">
          <div className="card-header d-flex justify-content-between align-items-center mb-5">
            <h5 className="m-0 "> Diagnosis / ICD 10 Codes</h5>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                {/* ***************** 1/4****************** */}
                <div className="col-lg-12 ">
                  <div className="card shadow-sm mb-3 rounded border border-warning">
                    <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-warning">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <h6>Hormone/Endocrine</h6>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3">
                      <div className="row">
                        <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>N40.0: </strong>BPH
                            </p>
                          </label>

                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong> E34.9:</strong> Hormone Disorder, unspec.
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>E20.9:</strong> Hypoparathyroidism, unspec
                            </p>
                          </label>
                        </div>
                        <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>R97.2:</strong> Elevated PSA
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>E03.9:</strong> Hypothyroidism, unspec.
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* ***************** 3/4****************** */}

                <div className="col-lg-12 ">
                  <div className="card shadow-sm mb-3 rounded border border-info">
                    <div
                      className="card-header d-flex justify-content-between align-items-center rounded"
                      style={{ backgroundColor: "#EEE5FF" }}
                    >
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <h6>Cariovascular</h6>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3">
                      <div className="row">
                        <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong>I20.9:</strong> Angina, unspec.
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong>I51.9:</strong> Cardiovascular Disease
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong> I50.9:</strong> Congestive Heart Failure
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong> I10: </strong>Hypertension
                            </p>
                          </label>
                        </div>
                        <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong>I48.91: </strong>Atrial Fibrillation,
                              unspec
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong> R07.9:</strong> Chest Pain, NOS
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>Z82.49:</strong> Family History of CAD
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="row">
                <div className="row">
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <h6 className=" mb-2">ICD 10 Code</h6>
                    <input
                      type="text"
                      name="ICD 10 Code"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="ICD 10 Code"
                      value=""
                    />
                  </div>

                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <h6 className="required mb-2">Description</h6>
                    <input
                      type="text"
                      name="description"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Description"
                      value=""
                    />

                    <div className="mt-3">
                      <button
                        type="button"
                        className="btn btn-primary btn-sm px-4 mx-2 p-2"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  <hr className="bg-secondary mt-10 mb-5" />
                </div>
                <div className="col-lg-12">
                  {/* **************Table************ */}

                  <div className="p-3 mt-8">
                    <h6 className="text-primary mb-3">Diagnosis Code(s)</h6>
                    <div className="mb-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                      <table
                        className="table table-bordered table-vertical rounded"
                        id="Icd 10 codes"
                      >
                        <thead className="rounded bg-secondary mt-2 mb-2">
                          <tr>
                            <th className="text-center text-muted">Actions</th>
                            <th className="text-center text-muted">
                              Icd 10 codes
                            </th>
                            <th className="text-muted text-center">
                              Description
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="text-center">
                              <a
                                href="#"
                                className="btn btn-light-info btn-active-info btn-sm btn-action mt-2 mb-2"
                              >
                                <i className="bi bi-three-dots-vertical p-0" />
                              </a>
                            </td>
                            <td>
                              <a
                                href="# "
                                className="text-gray-800 text-center p-3"
                              >
                                F10.20
                              </a>
                            </td>
                            <td>
                              <a href="# " className="text-gray-800 p-3 ">
                                Alcohol dependence,uncomp
                              </a>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blood;
