import React, { useCallback, useEffect, useState } from "react";
import AutoComplete from "../../../Shared/AutoComplete";
import Checkbox from "../../../Shared/Common/Input/Checkbox";
import { icd10Codes } from "../../../Utils/Common";
import { CrossIcon } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
const InfectionDisease = (props: any) => {
  const { t } = useLang();
  const [ICD10CodeAssigment, setICD10CodeAssigment] = useState<any>({
    icD10CodeDescription: "",
  });
  const [drugAllergies, setDrugAllergies] = useState<any>({});
  const [drugAllergiesCode, setDrugAllergiesCode] = useState<any>([]);
  const [diagnosisCode, setDiagnosisCode] = useState<any>([]);
  const [medicalNecessityFields, setMedicalNecessityFields] = useState<any>({
    exposureToCovid: true,
    signsymptoms: true,
  });
  const addDiagnosisCode = () => {
    const obj = {
      id: Math.random() * 7,
      icD10Code: ICD10CodeAssigment?.icD10Code,
      icD10CodeDescription: ICD10CodeAssigment?.icD10CodeDescription,
    };
    setDiagnosisCode([...diagnosisCode, obj]);
  };
  const removeDiagnosisCode = (id: string) => {
    let diagnosisCodeArrCopy = [...diagnosisCode];
    let filteredDiagnosisCodeArrCopy = diagnosisCodeArrCopy.filter(
      (items: any) => items?.id != id
    );
    setDiagnosisCode(filteredDiagnosisCodeArrCopy);
  };
  const handleChange = (
    id: string,
    code: string,
    description: string,
    checked: boolean
  ) => {
    if (checked) {
      const obj = {
        id: id,
        icD10Code: code,
        icD10CodeDescription: description,
      };
      setDiagnosisCode([...diagnosisCode, obj]);
    }
    if (!checked) {
      setDiagnosisCode((preVal: any) => [
        ...preVal.filter((items: any) => items?.id != id),
      ]);
    }
  };
  // const addDrugAllergies = () => {
  //   const obj = {
  //     id: Math.random() * 9,
  //     icD10Code: drugAllergies?.icD10Code,
  //   };
  //   setDrugAllergiesCode([...drugAllergiesCode, obj]);
  //   setDrugAllergies({});
  // };
  const addDrugAllergies = useCallback(() => {
    const obj = {
      id: Math.random() * 9,
      icD10Code: drugAllergies?.icD10Code,
    };
    setDrugAllergiesCode([...drugAllergiesCode, obj]);
    setDrugAllergies({});
  }, [drugAllergies]);
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
    setMedicalNecessityFields((preVal: any) => {
      return {
        ...preVal,
        [name]: !medicalNecessityFields[name],
      };
    });
  };
  

  return (
    <div className="row">
      <div className="col-lg-6">
        <div className="row">
          {/* ***************** Lab information ****************** */}
          <div className="col-lg-12">
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0 ">{t("Lab Information")}</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="row">
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <div>
                      {" "}
                      <span style={{ color: "#69A54B" }}>{t("Lab Name:")}</span>
                      <span className="text-muted p-2"> {t("Assure lab")}</span>
                    </div>
                  </div>
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                    <div>
                      <span className="p-2 text-muted ">
                        <i
                          className="bi bi-dash"
                          style={{ color: "#69A54B" }}
                        ></i>
                        {t("in-house Lab")}
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
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <h6 className=" mb-2">Specimen ID</h6>
                    <input
                      type="text"
                      name="email"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="Specimen ID"
                      value=""
                    />
                  </div>
                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <h6 className=" mb-2">Specimen type</h6>
                    <div className="d-flex mb-3">
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className=" form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">Blood</span>
                      </label>
                      <label className="form-check form-check-sm form-check-solid col-lg-6">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="specimen-type"
                        />
                        <span className="form-check-label">Nasopharyngeal</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ====================================== */}

      <div className="col-lg-6">
        <div className="row">
          {/* ***************** Medical Necessity ****************** */}
          <div className="col-lg-12">
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0">Medical Necessity</h5>
              </div>
              <div className="card-body py-3">
                <div className="row">
                  <div className="mb-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <div className=" d-flex">
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          onChange={handleChangeMedicalNeccisity}
                          className="form-check-input"
                          type="checkbox"
                          name="exposureToCovid"
                        />
                        <span className="form-check-label">
                          Exposure to covid-19
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <span className="required ">Number of days</span>
                    <input
                      type="text"
                      name="number-of-days"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="No of days"
                      value=""
                      disabled={medicalNecessityFields?.exposureToCovid}
                    />
                  </div>

                  <div className="mb-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <div className=" d-flex">
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          onChange={handleChangeMedicalNeccisity}
                          className="form-check-input"
                          type="checkbox"
                          name="signsymptoms"
                        />
                        <span className="form-check-label">
                          Signs and Symptoms
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <span className="required">Number of days</span>
                    <input
                      type="text"
                      name="number-of-days"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="No of days"
                      value=""
                      disabled={medicalNecessityFields?.signsymptoms}
                    />
                  </div>
                  <div className="mb-6 col-xl-6 col-lg-6 col-md-12 col-sm-12">
                    <div className=" d-flex">
                      <label className="form-check form-check-sm form-check-solid">
                        <input
                          onChange={handleChangeMedicalNeccisity}
                          className="form-check-input"
                          type="checkbox"
                          name="recomendedagency"
                        />
                        <span className="form-check-label">
                          Recomended Agency
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <span className="required">other</span>
                    <input
                      type="text"
                      name="number-of-days"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="..."
                      value=""
                    />
                  </div>

                  <div className="mb-5 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                    <div className="card-header d-flex justify-content-between align-items-center ">
                      <h5 style={{ color: "#69A54B" }}>
                        Reason for testing - Check all that apply
                      </h5>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="mb-2">
                        <strong>Experiencing Symptoms</strong>
                      </label>
                      <div className="row m-0 ">
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">Cough</span>
                        </label>

                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Shortness of breath
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Fever unspecified
                          </span>
                        </label>

                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">Headache</span>
                        </label>

                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Chills without fever
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-6 col-lg-6 align-items-stretch">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Loss of taste and smell
                          </span>
                        </label>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <label className="mb-2">
                        <strong>No Symptoms</strong>
                      </label>
                      <div className="row m-0">
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Exposure to someone with covid
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Travelled internationally
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Work in care facility
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Screening for covid-19
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Suspected exposure
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch mb-2">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Attended large public gathering
                          </span>
                        </label>
                        <label className="form-check form-check-sm form-check-solid col-lg-6 align-items-stretch">
                          <input className="form-check-input" type="checkbox" />
                          <span className="form-check-label">
                            Testing for school
                          </span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* ***************** Drug Allergies ****************** */}
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
            <div className="card  shadow-sm mb-3 rounded">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h5 className="m-0">Drug Allergies</h5>
              </div>

              <div className="card-body py-md-4 py-3">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    {icd10Codes.map((options: any) => (
                      <>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 mb-2">
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
                <div className="mb-5 col-xl-8 col-lg-8 col-md-8 col-sm-12 ">
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
                          <div className="col-xl-3 col-lg-3 col-md-3 col-sm-4 p-2">
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
              </div>
            </div>
          </div>
        </div>
      </div>
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
                            <span>SARS-CoV2, NAAT (LUMIRA DX)</span>
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
                              <span>
                                Covid (ORF1a target- SARS-CoV-2 (FAM))
                              </span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>IC (-Internal Control (ROX))</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* ***************** 3/4 ****************** */}
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
                            <span>COVID-19 PCR</span>
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
                              <span>N2</span>
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
                            <span>iAMP Covid-19 Testing</span>
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
                              <span>GdPH (IC)</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>N+ORF</span>
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
                            <span>COVID-19 / FluA / FluB</span>
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
                              <span>C19</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>FluB</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12 mb-2">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>FluA</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>MS2</span>
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
      <div className="col-lg-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="card-header d-flex justify-content-between align-items-center mb-5">
            <h5 className="m-0 "> Specimen source</h5>
          </div>
          <div className="card-body px-3 px-md-8">
            <div className="row">
              <div className="col-lg-6">
                <div className="row">
                  {/* ***************** 1****************** */}
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
                            <span>COVID-19</span>
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
                              <span>Mid Nare Swab</span>
                            </label>
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Saliva</span>
                            </label>
                          </div>
                          <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                            <label className="form-check form-check-sm form-check-solid col-12">
                              <input
                                className="form-check-input mr-2"
                                type="checkbox"
                              />
                              <span>Nasopharyngeal Swab</span>
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
      {/* ***************** Diagnosis / ICD 10 Codes****************** */}
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
                        {icd10Codes.map((options: any) => (
                          <>
                            <Checkbox
                              spanClassName="mb-2 mr-2"
                              id={options?.id}
                              label={options.description}
                              onChange={(e: any) =>
                                handleChange(
                                  options?.id,
                                  options?.code,
                                  options?.description,
                                  e.target.checked
                                )
                              }
                            />
                          </>
                        ))}
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
                    {/* <h6 className=" mb-2">ICD 10 Code</h6>
                    <input
                      type="text"
                      name="ICD 10 Code"
                      className="form-control bg-transparent mb-3 mb-lg-0"
                      placeholder="ICD 10 Code"
                      value=""
                    /> */}
                    <h6 className=" mb-2">ICD 10 Code</h6>
                    <AutoComplete
                      setValues={setICD10CodeAssigment}
                      placeholder="Search ICD10 Code"
                    />
                  </div>

                  <div className="mb-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                    <h6 className="required mb-2">Description</h6>
                    <textarea
                      className="form-control form-control-solid mb-3 mb-lg-0 min-h-60px h-60px border border-success"
                      name="description"
                      placeholder="ICD10 Description"
                      value={ICD10CodeAssigment?.icD10CodeDescription}
                      style={{ height: "49px" }}
                    ></textarea>

                    <div className="mt-3">
                      <button
                        type="button"
                        onClick={addDiagnosisCode}
                        className="btn btn-primary btn-sm px-4 mx-2 p-2 text-bold"
                      >
                        <span style={{ fontSize: "14px" }}>&#x2713; </span>
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
                    <div className="mb-12 col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <table
                        className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-1 mb-1"
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
                          {diagnosisCode?.map((items: any) => (
                            <>
                              <tr>
                                <td
                                  onClick={() => removeDiagnosisCode(items?.id)}
                                  className="text-center"
                                >
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
                                    {items?.icD10Code}
                                  </a>
                                </td>
                                <td>
                                  <a href="# " className="text-gray-800 p-3 ">
                                    {items?.icD10CodeDescription}
                                  </a>
                                </td>
                              </tr>
                            </>
                          ))}
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

export default InfectionDisease;
