import React, { useState, useEffect } from "react";
import ResultingRules from "./ResultingRules";
import TestAssignmentTable from "./TestAssignmentTable";
import AsyncSelect from "react-select/async";
import { styles } from "../../../../../Utils/Common";
import SpecimenType from "../../../../../Services/Compendium/SpecimentType";
import { AxiosResponse } from "axios";
import Select from "react-select";
import useLang from './../../../../../Shared/hooks/useLanguage';

const dropdownInterface = [
  {
    value: "1dropdownInterface",
    label: "Architect",
  },
  {
    value: "2dropdownInterface",
    label: "Clinitek",
  },
  {
    value: "3dropdownInterface",
    label: "Cobas",
  },
  {
    value: "4dropdownInterface",
    label: "Sysmex",
  },
  {
    value: "5dropdownInterface",
    label: "Ruby",
  },
  {
    value: "6dropdownInterface",
    label: "Reference Lab",
  },
];
const dropdownOptional = [
  {
    value: "1dropdownOptional",
    label: "Quantitative",
  },
  {
    value: "2dropdownOptional",
    label: "Interpreted",
  },
];
const calculationDropdown = [
  {
    value: "1calculationDropdown",
    label: "eGFR",
  },
  {
    value: "2calculationDropdown",
    label: "BUN/Creatinine Ratio",
  },
];
const AdditionalSetup: React.FC<{}> = () => {
  const {t} = useLang()
  const [renderComponent, setRenderComponent] = useState("Individual");
  const [conditionDropdown, setconditionDropdown] = useState();
  const [optionsRendering, setOptionsRendering] = useState();
  const [dropDownValues, setDropDownValues] = useState({
    specimenType: [],
    dependencyTest: [],
  });
  useEffect(() => {
    getDropDownValues();
  }, []);
  const getDropDownValues = () => {
    SpecimenType.getSpecimenTypeDropdown()
      .then((res: AxiosResponse) => {
        
        let specimenTypeArray: any = [];
        res?.data?.data?.forEach((val: any) => {
          let specimenDetails = {
            value: val?.specimenTypeId,
            label: val?.specimenType,
          };
          specimenTypeArray.push(specimenDetails);
        });
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            specimenType: specimenTypeArray,
          };
        });
      })
      .catch((err: any) => {
        
      });
  };
  const handleChange = (e: any) => {
    const value = e.target.value;
    setRenderComponent(value);
  };
  return (
    <>
      <hr className="bg-secondary mt-10 mb-5 mx-3" />
      <div className="d-flex justify-content-between align-items-center">
        <h5 className="m-0 text-primary mb-5">{t("Additional Setup")}</h5>
        <div className="d-flex gap-3 justify-content-center align-items-center mb-5">
        <label className="mb-2 text-danger fw-bold">{t("Copy From:")}</label>
          <AsyncSelect
            theme={(theme) => styles(theme)}
            cacheOptions
            className="w-200px"
          // onChange={(event: any) => {
          //   return setValues((preVal: any) => {
          //     return {
          //       ...preVal,
          //       reqTypeId: event?.value,
          //     };
          //   });
          // }}
          //defaultValue={{ value: values.reqTypeId, label: values.label }}
          //loadOptions={loadOptions}
          defaultOptions
          />
        </div>

      </div>
      <div className="row">
        <div className="col-lg-12">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <label className="fw-bold mb-2 required">{t("Test Type")}</label>
              <div className="row m-0">
                <label className="form-check form-check-sm form-check-solid col-6 my-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Individual"
                    onChange={handleChange}
                    checked={renderComponent === "Individual"}
                  />
                  <span className="form-check-label">{t("Individual")}</span>
                </label>
                <label className="form-check form-check-sm form-check-solid col-6 my-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    value="Group"
                    onChange={handleChange}
                    checked={renderComponent === "Group"}
                  />
                  <span className="form-check-label">{t("Profile")}</span>
                </label>
              </div>
            </div>
            <div className=" col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <label className="mb-2">{t("UOM")}</label>
              <input
                name=""
                className="form-control bg-transparent mb-lg-0"
                placeholder={t("UOM")}
                value=""
              />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <label className="mb-2">{t("Dependency Test")}</label>
              <AsyncSelect
                theme={(theme) => styles(theme)}
                cacheOptions
                // onChange={(event: any) => {
                //   return setValues((preVal: any) => {
                //     return {
                //       ...preVal,
                //       reqTypeId: event?.value,
                //     };
                //   });
                // }}
                //defaultValue={{ value: values.reqTypeId, label: values.label }}
                //loadOptions={loadOptions}
                defaultOptions
              />
            </div>
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <label className="mb-2">{t("Specimen Type")}</label>
              <Select
                menuPortalTarget={document.body}
                theme={(theme) => styles(theme)}
                options={dropDownValues?.specimenType}
                // onChange={(event: any) =>
                //   handleChange("department", event.value, row?.id)
                // }
                // value={dropDownValues?.departments.filter(function (option: any) {
                //   return option.value === row?.department;
                // })}
              />
            </div>
          </div>
          {renderComponent === "Individual" ? (
            <>
              <div className="mt-3 row">
                <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
                  <label className="fw-bold mb-2">{t("Result Method")}</label>
                  <div className="row m-0">
                    <label className="form-check form-check-sm form-check-solid col-6 my-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="manResultmethod"
                        value="manResultmethod"
                        onChange={(e: any) =>
                          setconditionDropdown(e.target.value)
                        }
                        checked={conditionDropdown === "manResultmethod"}
                      />
                      <span className="form-check-label">{t("Manual")}</span>
                    </label>
                    <label className="form-check form-check-sm form-check-solid col-6 my-1">
                      <input
                        className="form-check-input"
                        type="radio"
                        name="resultMethodInterface"
                        value="resultMethodInterface"
                        onChange={(e: any) =>
                          setconditionDropdown(e.target.value)
                        }
                        checked={conditionDropdown === "resultMethodInterface"}
                      />
                      <span className="form-check-label">{t("Interface")}</span>
                    </label>
                  </div>
                </div>
                <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12">
                  <div className="row">
                    <div className="mt-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <Select
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={
                          conditionDropdown === "resultMethodInterface"
                            ? dropdownInterface
                            : []
                        }
                        onChange={(event: any) =>
                          setOptionsRendering(event.label)
                        }
                        // value={dropDownValues?.departments.filter(function (option: any) {
                        //   return option.value === row?.department;
                        // })}
                      />
                    </div>
                    <div className="mt-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                      <Select
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={
                          optionsRendering === "Architect" &&
                          conditionDropdown === "resultMethodInterface"
                            ? dropdownOptional
                            : []
                        }
                        // onChange={(event: any) =>
                        //   handleChange("department", event.value, row?.id)
                        // }
                        // value={dropDownValues?.departments.filter(function (option: any) {
                        //   return option.value === row?.department;
                        // })}
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-5 col-xl-4 col-lg-4 col-md-4 col-sm-12 d-flex justify-content-end align-items-center">
                  <label className="form-check form-check-sm form-check-solid mx-5">
                    <input
                      className="mr-4 form-check-input"
                      type="radio"
                      name="resultMethodcalculation"
                      value="resultMethodcalculation"
                      onChange={(e: any) =>
                        setconditionDropdown(e.target.value)
                      }
                      checked={conditionDropdown === "resultMethodcalculation"}
                    />
                    <span className="form-check-label">{t("Calculation")}</span>
                  </label>
                  <Select
                    menuPortalTarget={document.body}
                    theme={(theme) => styles(theme)}
                    options={
                      conditionDropdown === "resultMethodcalculation"
                        ? calculationDropdown
                        : []
                    }
                    // onChange={(event: any) =>
                    //   handleChange("department", event.value, row?.id)
                    // }
                    // value={dropDownValues?.departments.filter(function (option: any) {
                    //   return option.value === row?.department;
                    // })}
                  />
                </div>
              </div>
            </>
          ) : null}
          <div className="mt-3 row">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-12">
              <label className="fw-bold mb-2 required">{t("Order Method")}</label>
              <div className="row m-0">
                <label className="form-check form-check-sm form-check-solid col-6 my-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderMethodmanual"
                    value="orderMethodmanual"
                    onChange={(e: any) => setconditionDropdown(e.target.value)}
                    checked={conditionDropdown === "orderMethodmanual"}
                  />
                  <span className="form-check-label">{t("Manual")}</span>
                </label>
                <label className="form-check form-check-sm form-check-solid col-6 my-1">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="orderMethodinterface"
                    value="orderMethodinterface"
                    onChange={(e: any) => setconditionDropdown(e.target.value)}
                    checked={conditionDropdown === "orderMethodinterface"}
                  />
                  <span className="form-check-label">{t("Interface")}</span>
                </label>
              </div>
            </div>
            <div className="col-xl-5 col-lg-5 col-md-5 col-sm-12">
              <div className="row">
                <div className="mt-5 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                  <Select
                    menuPortalTarget={document.body}
                    theme={(theme) => styles(theme)}
                    options={
                      conditionDropdown === "orderMethodinterface"
                        ? dropdownInterface
                        : []
                    }
                    // onChange={(event: any) =>
                    //   handleChange("department", event.value, row?.id)
                    // }
                    // value={dropDownValues?.departments.filter(function (option: any) {
                    //   return option.value === row?.department;
                    // })}
                  />
                </div>
              </div>
            </div>
          </div>
          {renderComponent === "Individual" ? (
            <>
              <div className="mt-5 row">
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 ">
                  <div className="d-flex">
                    <h4 className="text-info p-3">{t("Comment:")}</h4>
                    <input
                      name=""
                      className="form-control bg-transparent mb-lg-0"
                      placeholder={t("Comment")}
                      value=""
                    />
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </div>
      </div>
      {renderComponent === "Individual" ? (
        <ResultingRules />
      ) : (
        <TestAssignmentTable />
      )}
    </>
  );
};
export default AdditionalSetup;
