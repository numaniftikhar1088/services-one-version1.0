import React, { useCallback, useState } from "react";
import AutoComplete from "../../../Shared/AutoComplete";
import { CrossIcon } from "../../../Shared/Icons";
import Checkbox from "../../../Shared/Common/Input/Checkbox";
import { icd10Codes } from "../../../Utils/Common";
const Tox: React.FC = () => {
  const [drugAllergies, setDrugAllergies] = useState<any>({});
  const [drugAllergiesCode, setDrugAllergiesCode] = useState<any>([]);
  const [enableTextArea, setEnableTextArea] = useState(true);
  const addDrugAllergies = () => {
    if (!drugAllergies?.icD10Code) {
      return;
    }
    const obj = {
      id: Math.random() * 9,
      icD10Code: drugAllergies?.icD10Code,
    };
    setDrugAllergiesCode([...drugAllergiesCode, obj]);
    setDrugAllergies({});
  };
  const removeDrugAllergies = (id: string) => {
    let drugAllergiesCodeArrCopy = [...drugAllergiesCode];
    let filteredDiagnosisCodeArrCopy = drugAllergiesCodeArrCopy.filter(
      (items: any) => items?.id != id
    );
    setDrugAllergiesCode(filteredDiagnosisCodeArrCopy);
  };
  const handleChangeDrugAllergies = (
    id: string,
    code: string,
    description: string,
    checked: boolean
  ) => {
    if (checked) {
      const obj = {
        id: id,
        icD10Code: code,
      };
      setDrugAllergiesCode([...drugAllergiesCode, obj]);
    }
    if (!checked) {
      setDrugAllergiesCode((preVal: any) => [
        ...preVal.filter((items: any) => items?.id != id),
      ]);
    }
  };
  const handleChangeMedicalNeccisity = (e: any) => {
    const name = e.target.name;
    if (name === "other") setEnableTextArea(false);
    if (name !== "other") setEnableTextArea(true);
  };
  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="row">
          {/* ***************** Lab information ****************** */}
          <div className="col-lg-12 ">
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0 ">Lab Information</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-5 col-xl-7 col-lg-7 col-md-7 col-sm-12">
                    <div>
                      {" "}
                      <span style={{ color: "#69A54B" }}>Lab Name:</span>
                      <span className="text-muted p-2"> Noah clinical</span>
                    </div>
                  </div>
                  <div className="mb-5 col-xl-5 col-lg-5 col-md-5 col-sm-12 ">
                    <div>
                      {" "}
                      <span className="p-2 text-muted ">
                        <i
                          className="bi bi-dash"
                          style={{ color: "#69A54B" }}
                        ></i>
                        Reference Lab
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
                  <div className="mb-5 col-xl-7 col-lg-7 col-md-7 col-sm-12">
                    <h6 className=" mb-2">Specimen ID</h6>
                    <input
                      type="text"
                      name="email"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Specimen ID"
                      value=""
                    />
                    <div className="mt-2 d-flex">
                      <span>
                        Sample Temperature read within 4 minutes and is between
                        90 to 100 ℉?
                      </span>

                      <div className="form-check form-switch mt-5 mr-2">
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

                  <div className="mb-5 col-xl-5 col-lg-5 col-md-5 col-sm-12">
                    <h6 className=" mb-2">Specimen type</h6>
                    <label className="gap-2 p-2 form-check form-check-sm form-check-solid col-6 my-1">
                      <input
                        className=" form-check-input"
                        type="radio"
                        name="specimen-type"
                      />
                      <span className="form-check-label">Urine</span>

                      <input
                        className="form-check-input"
                        type="radio"
                        name="specimen-type"
                      />
                      <span className="form-check-label">Oral</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* ====================================== */}
      <div className="col-lg-6">
        {/* ***************** Active Medication List ****************** */}
        <div className="col-lg-12 ">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0">Active Medication List</h5>
            </div>

            <div className="card-body py-md-4 py-3">
              <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                <div className="row">
                  {icd10Codes.map((options: any) => (
                    <>
                      <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2 ">
                        <label className="form-check form-check-sm form-check-solid align-items-stretch mb-2">
                          <input
                            className="form-check-input"
                            id={options?.id}
                            type="checkbox"
                            onChange={(e: any) =>
                              handleChangeDrugAllergies(
                                options?.id,
                                options?.code,
                                options?.description,
                                e.target.checked
                              )
                            }
                          />
                          <span className="form-check-label">
                            {options.description}
                          </span>
                        </label>
                      </div>
                    </>
                  ))}
                </div>
              </div>
              <div className="row">
                <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                  <h6 className="mb-2">Other</h6>
                  <div className="d-flex">
                    <AutoComplete
                      setValues={setDrugAllergies}
                      placeholder="Search ICD10 Code"
                    />
                    <div className="px-3">
                      <button
                        className="btn btn-icon btn-sm fw-bold btn-primary"
                        onClick={addDrugAllergies}
                      >
                        <i
                          className="bi bi-plus"
                          style={{ fontSize: "30px" }}
                        ></i>
                      </button>
                    </div>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="row">
                      {drugAllergiesCode.map((items: any) => (
                        <>
                          <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 p-2">
                            <div className="d-flex mr-2 mb-2">
                              <span className="badge badge-pill badge-light px-5 rounded">
                                <span
                                  onClick={() => removeDrugAllergies(items?.id)}
                                >
                                  <CrossIcon />
                                </span>
                                <span>{items?.icD10Code}</span>
                              </span>
                            </div>
                          </div>
                        </>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                  <label className="required mb-2">
                    Take Photo for prescribed medications
                  </label>
                  <div className="d-flex align-items-stretch">
                    <div className="d-flex align-items-center bg-hover-light-primary p-2 rounded px-3">
                      <i className="bi bi-card-image icon-2x text-primary pe-2"></i>
                      <div className="text-capitalize">Take Photo </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ***************** Medical Necessity ****************** */}
        <div className="col-lg-12 ">
          <div className="card shadow-sm mb-3 rounded">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="m-0">Medical Necessity</h5>
            </div>

            <div className="card  align-items-center mt-5 rounded bg-light-warning h-2">
              <span className="p-2">
                {" "}
                <strong>
                  Mark all that apply (If not marked, specimen will be returned)
                </strong>
              </span>
            </div>

            <div className="card-body py-md-4 py-3">
              <div className="row">
                <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4 ">
                  <label className="mb-5 form-check form-check-sm form-check-solid">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">Best Practices</span>
                  </label>

                  <label className="mt-10 form-check form-check-sm form-check-solid">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">Baseline Test</span>
                  </label>
                  <label className="mb-5 form-check form-check-sm mt-20  form-check-solid ">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">
                      Periodic Monitoring
                    </span>
                  </label>
                  <label className="mb-5 form-check mt-12 form-check-sm  form-check-solid">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">High Risk Patient</span>
                  </label>
                  <label className="mb-5 form-check mt-10 form-check-sm  form-check-solid ">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">Targeted Testing</span>
                  </label>

                  <label className="mb-5 form-check form-check-sm mt-15  form-check-solid ">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">
                      Confirmation Required
                    </span>
                  </label>
                  <label className="mb-5 form-check mt-16 form-check-sm  form-check-solid">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">Cannabinoids/THC</span>
                  </label>
                  <label className="mb-5 form-check mt-10 form-check-sm  form-check-solid">
                    <input className="form-check-input" type="checkbox" />
                    <span className="form-check-label">
                      Inadequate Detection
                    </span>
                  </label>
                  <label className="mb-5 form-check mt-15 form-check-sm  form-check-solid">
                    <input
                      onChange={handleChangeMedicalNeccisity}
                      className="form-check-input"
                      type="checkbox"
                      name="other"
                    />
                    <span className="form-check-label">other</span>
                  </label>
                </div>

                <div className="mb-5 col-xl-8 col-lg-8 col-md-8 col-sm-8 ">
                  <p>
                    Confirmation required to confirm patient's documented
                    history.
                  </p>
                  <p>
                    Random drug test for current medications prescribed and to
                    rule out abuse/diversion and use of illicit drugs in
                    accordance with patient's risk rating as documented in
                    medical records.
                  </p>
                  <p>
                    High risk by suitable psychological assessment requiring
                    increase testing frequency.{" "}
                  </p>
                  <p>
                    Patient presents with suspicious non-compliant behaviors as
                    documented in medical records.
                  </p>
                  <p>
                    Confirmation required due to absence of reliable validation
                    from patient, required by manufacturer instructions, and to
                    identify the substance causing the positive result.
                  </p>
                  <p>
                    Exception - Confirmation required as patient is actively
                    being prescribed medications that failed to appear on
                    Qualitative test.
                  </p>
                  <p>
                    Confirmation required to confirm discontinuation of THC in
                    accordance to a treatment plan.
                  </p>
                  <p>
                    Confirmation required to confirm discontinuation of THC in
                    accordance to a treatment plan.
                  </p>
                  <div className="input-group">
                    <textarea
                      className="form-control h-75px"
                      aria-label="With textarea"
                      disabled={enableTextArea}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ***************** Testing Option ****************** */}
      <div className="col-lg-12">
        <div className="card shadow-sm mb-3 rounded p-3">
          <div className="card-header d-flex justify-content-between align-items-center mb-5">
            <h5 className="m-0 ">Testing Options</h5>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <label className="form-check form-check-sm  p-3 form-check-solid mb-3">
                  <input className=" form-check-input mr-2" type="checkbox" />
                  <span className="font-weight-bold">Confirmation</span>
                </label>
                {/**************************************** 1/4 **************************************** */}
                <div className="col-lg-12 ">
                  <div className="card shadow-sm mb-3 rounded">
                    <div
                      className="card-header d-flex justify-content-between align-items-center rounded"
                      style={{ background: "#F3F6F9" }}
                    >
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <span>Confirmation</span>
                      </div>
                    </div>

                    <div className="row p-3">
                      <div className="col-lg-6">
                        <div className="row">
                          {/* ***************** 1/4 ****************** */}
                          <div className="col-lg-12 mb-3">
                            <div className="card shadow-sm rounded border border-primary">
                              <div
                                className="card-header d-flex justify-content-between align-items-center rounded"
                                style={{ background: "#D2E4C9" }}
                              >
                                <div className="col-xl- col-lg-6 col-md-6 col-sm-6">
                                  <label className="form-check form-check-sm form-check-solid col-12">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Alkaloid</span>
                                  </label>
                                </div>
                              </div>
                              <div className="card-body py-md-4 py-3">
                                <div className="row">
                                  <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                    <label className="form-check form-check-sm form-check-solid col-12">
                                      <input
                                        className="form-check-input mr-2"
                                        type="checkbox"
                                      />
                                      <span>Mitragynine</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* ***************** 3/4 ****************** */}
                          <div className="col-lg-12">
                            <div className="card shadow-sm rounded border border-warning">
                              <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-warning">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                  <label className="form-check form-check-sm form-check-solid col-12">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Antidepressant (SSRI/SNRI)</span>
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
                                      <span>Fluoxetine</span>
                                    </label>
                                    <label className="form-check form-check-sm form-check-solid mb-2">
                                      <input
                                        className="form-check-input mr-2"
                                        type="checkbox"
                                      />
                                      <span>Norfluoxetine</span>
                                    </label>
                                    <label className="form-check form-check-sm form-check-solid mb-2">
                                      <input
                                        className="form-check-input mr-2"
                                        type="checkbox"
                                      />
                                      <span>Paroxetine</span>
                                    </label>
                                    <label className="form-check form-check-sm form-check-solid mb-2">
                                      <input
                                        className="form-check-input mr-2"
                                        type="checkbox"
                                      />
                                      <span>Venlafaxine</span>
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
                            <div className="card shadow-sm mb-3 rounded border border-info">
                              <div className="card-header d-flex justify-content-between align-items-center rounded bg-light-info">
                                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                  <label className="form-check form-check-sm form-check-solid col-12">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Amphetamine</span>
                                  </label>
                                </div>
                              </div>
                              <div className="card-body py-md-4 py-3">
                                <div className="row">
                                  <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                    <label className="form-check form-check-sm form-check-solid col-12">
                                      <input
                                        className="form-check-input mr-2"
                                        type="checkbox"
                                      />
                                      <span>Methamphetamine</span>
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          {/* ***************** 4/4 ****************** */}
                          <div className="col-lg-12">
                            <div className="card shadow-sm mb-3 rounded border border-danger">
                              <div
                                className="card-header d-flex justify-content-between align-items-center"
                                style={{ background: "#FFE2E5" }}
                              >
                                <label className="form-check form-check-sm form-check-solid col-12">
                                  <input
                                    className="form-check-input mr-2 bg-light-white"
                                    type="checkbox"
                                  />
                                  <span>Antidepressant (TCA)</span>
                                </label>
                              </div>
                              <div className="card-body py-md-4 py-3">
                                <div className=" col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                  <label className="form-check form-check-sm form-check-solid mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Amitriptyline</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Clomipramine</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Desipramine</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Desmethylclomipramine</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Desmethyldoxipin</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Doxepin</span>
                                  </label>
                                  <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                                    <input
                                      className="form-check-input mr-2"
                                      type="checkbox"
                                    />
                                    <span>Imipramine</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* ***************** 4/4 ****************** */}
                    <div className="col-lg-8 p-3">
                      <div className="card shadow-sm mb-3 rounded border border-success">
                        <div className="card-header d-flex justify-content-between align-items-center bg-secondary">
                          <label className="form-check form-check-sm form-check-solid col-12">
                            <input
                              className="form-check-input mr-2 "
                              type="checkbox"
                            />
                            <span>Barbiturate</span>
                          </label>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className=" col-xl-12 col-lg-12 col-md-12 col-sm-12">
                            <label className="form-check form-check-sm form-check-solid mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Butalbital</span>
                            </label>
                          </div>
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
                <label className="form-check form-check-sm form-check-solid mb-3 p-3">
                  <input className="form-check-input mr-2" type="checkbox" />
                  <span>Screening</span>
                </label>
                <div className="col-lg-12 ">
                  <div className="card shadow-sm mb-3 rounded">
                    <div
                      className="card-header d-flex justify-content-between align-items-center rounded"
                      style={{ background: "#F3F6F9", borderRadius: "8px" }}
                    >
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <span>Screening</span>
                      </div>
                    </div>
                    <div className="card-body py-md-4 py-3">
                      <div className="row">
                        <div className="col-xl-4 col-lg-4 col-md-4 col-sm-4">
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Alcohol (Etg)</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Barbiturate</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Cannabinoid</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Methadone</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Phencyclidine</span>
                          </label>
                        </div>
                        <div className="mb-5 col-xl-4 col-lg-4 col-md-4 col-sm-12 ">
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Alcohol (EtOH)</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Benzodiazepine</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Cocaine</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Opiate</span>
                          </label>
                        </div>
                        <div className="mb-5 col-xl-4 col-lg-4 col-md-4 col-sm-12 ">
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Amphetamine</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Benzodiazepine</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>MDMA</span>
                          </label>
                          <label className="form-check form-check-sm form-check-solid col-12 mb-3">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <span>Oxycodone</span>
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
        {/* ***************** Diagnosis / ICD 10 Codes****************** */}
      </div>
      <div className="col-lg-12 bg-white">
        <div className="card shadow-sm p-3 rounded">
          <div className="card-header d-flex justify-content-between align-items-center mb-5">
            <h5 className="m-0 "> Diagnosis / ICD 10 Codes</h5>
          </div>
          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                {/* ***************** 1****************** */}
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
                              <strong>F10.20:</strong> Resistance to unspecified
                              antimicrobial drugs.
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>F11.20:</strong> Opioid dependence,
                              uncomplicated
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>M79.1:</strong> Myalgia
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong>F11.90:</strong> Opioid use, unspecified,
                              uncomplicated
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>F16.120:</strong> Hallucinogen abuse with
                              intoxication, uncomplicated
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
                              <strong>F10.120:</strong> Alcohol abuse with
                              intoxication, uncomplicated
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>F14.220:</strong> Cocaine dependence with
                              intoxication, uncomplicated
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p className="align-items-center">
                              <strong>Z51.81:</strong> Encounter for therapeutic
                              drug level monitoring
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid mb-1 align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>F11.120:</strong> Opioid abuse with
                              intoxication, uncomplicated
                            </p>
                          </label>
                          <label className="form-check form-check-sm form-check-solid align-items-stretch">
                            <input
                              className="form-check-input mr-2"
                              type="checkbox"
                            />
                            <p>
                              <strong>F32.8:</strong> Other depressive episodes
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

export default Tox;
