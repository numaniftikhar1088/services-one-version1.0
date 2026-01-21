import { IconButton } from "@mui/material";
import React, { useEffect, useState } from "react";
import Select, { SingleValue } from "react-select";
import { AddIcon } from "../../../../../Shared/Icons";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import { closeMenuOnScroll } from "../Shared";
import AdditionalSetupIndividual from "./AdditionalSetupindividual";
import InputMask from "./InputMask";
import useLang from "Shared/hooks/useLanguage";
import {
  GetGenderLookup,
  GetResultFlagLookup,
} from "Services/Compendium/BloodLisCompendium/BloodLisCompendium";

// Define types for options and sections
interface Option {
  value: string;
  label: string;
}

export type inputChild = {
  name: string;
  placeholder: string;
};

export type SingleFiledI = {
  type: string;
  label?: string;
  placeholder?: string;
  options?: Option[];
  separatorAfter?: boolean;
  name?: string;
  InputWidth?: string;
  InputMask?: string;
  children?: inputChild[];
};

interface Field extends SingleFiledI {
  mappingArray?: SingleFiledI[];
}

const ResultingRule = ({ formData, setFormData, labId }: any) => {
  const { t } = useLang();

  const [genderOptions, setGenderOptions] = useState<any>([]);
  const [resultFlagOptions, setResultFlagOptions] = useState<any>([]);
  const [selectedValueType, setSelectedValueType] = useState<string | null>(
    null
  );

  const resultingRulesObj = {
    ruleType: "",
    sex: 0,
    ageType: "",
    ageFrom: "",
    ageTo: "",
    reference: "",
    resultRules: [
      {
        reportingRuleId: 0,
        name: "",
        minLow: "",
        maxLow: "",
        withInRangeFlag: "",
        lowFlag: "",
        highFlagOrResultFlag: "",
        minCriticalLow: "",
        maxCriticalLow: "",
        criticalLowFlag: "",
        criticalHighFlag: "",
        commentText: "",
        cuttoffExpression: "",
        cuttOffValue: null,
        criticalCuttoffExpression: "",
        criticalCuttOffValue: null,
        criticalHighCuttoffExpression: "",
        criticalHighCuttOffValue: null,
        cuttOffFlag: "",
        minLowExpression: "",
        maxLowExpression: "",
        minInter: null,
        maxInter: null,
        minHighExpression: "",
        minHigh: null,
        maxHighExpression: "",
        maxHigh: null,
        minCriticalHighExpression: "",
        minCriticalHigh: null,
        maxCriticalHighExpression: "",
        maxCriticalHigh: null,
        minCriticalLowExpression: "",
        maxCriticalLowExpression: "",
      },
    ],
  };

  const age = [
    { value: "year", label: "Year" },
    { value: "month", label: "Month" },
  ];

  const expressions = [
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
  ];

  const expressionsDash = [
    { value: "<", label: "<" },
    { value: "<=", label: "<=" },
    { value: ">", label: ">" },
    { value: ">=", label: ">=" },
    { value: "-", label: "-" },
  ];

  const options: Option[] = [
    { value: "none", label: "None" },
    { value: "range", label: "Range" },
    { value: "comment", label: "Comment" },
    { value: "cutoff", label: "Cutoff" },
    { value: "text", label: "Text" },
    { value: "list", label: "List" },
    { value: "multiRange", label: "Multi-Range" },
    { value: "listRange", label: "List Range" },
  ];

  const sections: { [key: string]: Field[] } = {
    range: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "inputMask",
            label: "Range",
            name: "range",
            InputWidth: "w-100px mr-2",
            children: [
              {
                name: "minLow",
                placeholder: "Low",
              },
              {
                name: "maxLow",
                placeholder: "High",
              },
            ],
          },
          {
            type: "text",
            label: "Within Range Flag",
            placeholder: "Within",
            name: "withInRangeFlag",
            InputWidth: "w-125px",
          },
          {
            type: "text",
            label: "Flag-L",
            placeholder: "Flag",
            name: "lowFlag",
            InputWidth: "w-55px",
          },
          {
            type: "text",
            label: "Flag-H",
            placeholder: "Flag",
            name: "highFlagOrResultFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "numberInput",
            label: "Critical Low",
            placeholder: "Value",
            name: "minCriticalLow",
            InputWidth: "w-80px",
          },
          {
            type: "text",
            label: "Flag-L",
            placeholder: "Flag",
            name: "criticalLowFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "numberInput",
            label: "Critical High",
            placeholder: "Value",
            name: "maxCriticalLow",
            InputWidth: "w-80px",
          },
          {
            type: "text",
            label: "Flag-H",
            placeholder: "Flag",
            name: "criticalHighFlag",
            InputWidth: "w-55px mr-2",
          },
        ],
      },
    ],
    comment: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "text",
            label: "Comment Text",
            placeholder: "...",
            name: "commentText",
            InputWidth: "w-150px mr-2",
          },
        ],
      },
    ],
    cutoff: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "dropdown",
            label: "Cut Off",
            placeholder: "Select",
            options: expressions,
            name: "cuttoffExpression",
            InputWidth: "w-100px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "cuttOffValue",
            InputWidth: "w-100px",
          },
          {
            type: "text",
            label: "Normal Flag",
            placeholder: "Flag",
            name: "cuttOffFlag",
            InputWidth: "w-85px",
          },
          {
            type: "text",
            label: "Abnormal Flag",
            placeholder: "Flag",
            name: "highFlagOrResultFlag",
            InputWidth: "w-85px mr-2",
          },
          {
            type: "dropdown",
            label: "Critical Low Cut off",
            placeholder: "Select",
            options: expressions,
            name: "criticalCuttoffExpression",
            InputWidth: "w-125px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "criticalCuttOffValue",
            InputWidth: "w-100px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "criticalLowFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "dropdown",
            label: "Critical High Cut off",
            placeholder: "Select",
            options: expressions,
            name: "criticalHighCuttoffExpression",
            InputWidth: "w-125px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "criticalHighCuttOffValue",
            InputWidth: "w-100px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "criticalHighFlag",
            InputWidth: "w-55px mr-2",
          },
        ],
      },
    ],
    text: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "text",
            label: "Text",
            placeholder: "...",
            name: "commentText",
            InputWidth: "w-125px mr-2",
          },
          {
            type: "text",
            label: "Matching Flag",
            placeholder: "Flag",
            name: "withInRangeFlag",
            InputWidth: "w-125px mr-2",
          },
          {
            type: "text",
            label: "Non-Matching Flag",
            placeholder: "Flag",
            name: "highFlagOrResultFlag",
            InputWidth: "w-125px mr-2",
          },
        ],
      },
    ],
    list: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "text",
            label: "Text",
            placeholder: "...",
            name: "commentText",
            InputWidth: "w-125px mr-2",
          },
          {
            type: "dropdown",
            label: "Result Flag",
            placeholder: "Select",
            name: "highFlagOrResultFlag",
            options: resultFlagOptions,
            InputWidth: "w-125px mr-2",
          },
        ],
      },
    ],
    multiRange: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "dropdown",
            label: "Optimal",
            placeholder: "Select",
            options: expressions,
            name: "minLowExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "minLow",
            InputWidth: "w-70px",
          },
          {
            type: "dropdown",
            label: "",
            placeholder: "Select",
            options: expressionsDash,
            name: "maxLowExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "maxLow",
            InputWidth: "w-70px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "lowFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "inputMask",
            label: "Intermediate",
            name: "range",
            InputWidth: "w-100px mr-2",
            children: [
              {
                name: "minInter",
                placeholder: "Low",
              },
              {
                name: "maxInter",
                placeholder: "High",
              },
            ],
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "withInRangeFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "dropdown",
            label: "High Risk",
            placeholder: "Select",
            options: expressions,
            name: "minHighExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "minHigh",
            InputWidth: "w-70px",
          },
          {
            type: "dropdown",
            label: "",
            placeholder: "Select",
            options: expressionsDash,
            name: "maxHighExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "maxHigh",
            InputWidth: "w-70px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "highFlagOrResultFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "dropdown",
            label: "Critical High",
            placeholder: "Select",
            options: expressions,
            name: "minCriticalHighExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "minCriticalHigh",
            InputWidth: "w-70px",
          },
          {
            type: "dropdown",
            label: "",
            placeholder: "Select",
            options: expressionsDash,
            name: "maxCriticalHighExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "maxCriticalHigh",
            InputWidth: "w-70px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "criticalHighFlag",
            InputWidth: "w-55px mr-2",
          },
          {
            type: "dropdown",
            label: "Critical Low",
            placeholder: "Select",
            options: expressions,
            name: "minCriticalLowExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "minCriticalLow",
            InputWidth: "w-70px",
          },
          {
            type: "dropdown",
            label: "",
            placeholder: "Select",
            options: expressionsDash,
            name: "maxCriticalLowExpression",
            InputWidth: "w-70px",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "maxCriticalLow",
            InputWidth: "w-70px",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "criticalLowFlag",
            InputWidth: "w-55px mr-2",
          },
        ],
      },
    ],
    listRange: [
      {
        type: "dropdown",
        label: "Sex",
        placeholder: "Select",
        name: "sex",
        options: genderOptions,
        InputWidth: "w-100px mr-2",
      },
      {
        type: "dropdown",
        label: "Age",
        placeholder: "Select",
        name: "ageType",
        options: age,
        InputWidth: "w-100px",
      },
      {
        type: "inputMask",
        label: "",
        name: "ageRange",
        InputWidth: "w-100px mr-2",
        children: [
          {
            name: "ageFrom",
            placeholder: "From",
          },
          {
            name: "ageTo",
            placeholder: "To",
          },
        ],
      },
      {
        type: "mapped",
        name: "resultRules",
        mappingArray: [
          {
            type: "dropdown",
            label: "Optimal",
            placeholder: "Select",
            options: expressions,
            name: "minLowExpression",
            InputWidth: "w-70px mr-2",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "minLow",
            InputWidth: "w-70px mr-2",
          },
          {
            type: "dropdown",
            label: "",
            placeholder: "Select",
            options: expressionsDash,
            name: "maxLowExpression",
            InputWidth: "w-70px mr-2",
          },
          {
            type: "numberInput",
            label: "",
            placeholder: "Value",
            name: "maxLow",
            InputWidth: "w-70px mr-2",
          },
          {
            type: "text",
            label: "Flag",
            placeholder: "Flag",
            name: "lowFlag",
            InputWidth: "w-55px mr-2",
          },
        ],
      },
    ],
  };

  const addMappingArray = (mainIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      resultingRules: prev.resultingRules.map((rule: any, index: number) =>
        index === mainIndex
          ? {
              ...rule,
              resultRules: [
                ...rule.resultRules,
                ...resultingRulesObj.resultRules,
              ],
            }
          : rule
      ),
    }));
  };

  const removeMappingArray = (mainIndex: number, resultRuleIndex: number) => {
    setFormData((prev: any) => ({
      ...prev,
      resultingRules: prev.resultingRules.map((rule: any, index: number) =>
        index === mainIndex
          ? {
              ...rule,
              resultRules: rule.resultRules.filter(
                (_: any, i: number) => i !== resultRuleIndex
              ),
            }
          : rule
      ),
    }));
  };

  const handleSelectChange = (selectedOption: SingleValue<Option>) => {
    setSelectedValueType(selectedOption ? selectedOption.value : null);
    if (selectedOption?.value !== "none") {
      setFormData((prev: any) => ({
        ...prev,
        resultingRules: [
          { ...resultingRulesObj, ruleType: selectedOption?.value },
        ],
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        resultingRules: [],
      }));
    }
  };

  const addSection = () => {
    if (selectedValueType && sections[selectedValueType]) {
      setFormData((prev: any) => ({
        ...prev,
        resultingRules: [
          ...prev.resultingRules,
          {
            ...resultingRulesObj,
            ruleType: selectedValueType,
            reference: prev?.resultingRules[0]?.reference,
          },
        ],
      }));
    }
  };

  const removeSection = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      resultingRules: prev.resultingRules.filter(
        (_: any, i: any) => i !== index
      ),
    }));
  };

  const handleChange = (
    e: any,
    mainIndex: number,
    resultRuleIndex?: number
  ) => {
    let { value } = e.target;
    const { name } = e.target;

    const numberedValues = [
      "criticalCuttOffValue",
      "cuttOffValue",
      "criticalHighCuttOffValue",
    ];
    const nameFound = numberedValues.includes(name);

    if (nameFound) {
      value = value || null;
    }
    setFormData((prev: any) => {
      // Create a deep copy of the resultingRules array to maintain immutability
      const updatedResultingRules = [...prev.resultingRules];

      // If it's a regular field, update it directly
      if (resultRuleIndex === undefined) {
        updatedResultingRules[mainIndex][name] = value;
      } else {
        // If it's inside the mappingArray, update the specific field
        updatedResultingRules[mainIndex].resultRules[resultRuleIndex][name] =
          value;
      }

      // Return the new state with the updated array in place
      return {
        ...prev,
        resultingRules: updatedResultingRules,
      };
    });
  };

  const handleReferenceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setFormData((prev: any) => {
      const updatedResultingRules = [...prev.resultingRules];
      updatedResultingRules.map((rule: any) => {
        rule.reference = value;
      });
      return {
        ...prev,
        resultingRules: updatedResultingRules,
      };
    });
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const response = await GetGenderLookup();
        const response2 = await GetResultFlagLookup();

        setGenderOptions(response.data);
        setResultFlagOptions(response2.data);
      } catch (error) {
        console.error(t("Failed to fetch lookup data:"), error);
      }
    };

    fetchLookupData();
  }, []);

  useEffect(() => {
    if (formData?.resultingRules[0]?.ruleType) {
      setSelectedValueType(formData.resultingRules[0].ruleType);
    }
  }, [formData.resultingRules]);

  return (
    <>
      <AdditionalSetupIndividual
        formData={formData}
        setFormData={setFormData}
        labId={labId}
      />
      <div
        className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
        style={{ border: "2px solid orange" }}
      >
        <div className="card mb-4 border">
          <div className="card-header bg-light-warning d-flex justify-content-between align-items-center px-4 min-h-40px">
            <h5 className="m-0 " style={{ color: "orange" }}>
              {t("Resulting Rules")}
            </h5>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded p-5">
            <div className="d-flex align-items-end gap-5">
              <div>
                <label>{t("Reference Value Type")}</label>
                <Select
                  inputId="ReferenceValueType"
                  theme={(theme) => styles(theme)}
                  options={options}
                  name="ruleType"
                  styles={reactSelectSMStyle}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  onChange={handleSelectChange}
                  closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                  value={options.filter(
                    (item) => item.value === selectedValueType
                  )}
                  isSearchable={true}
                  className="z-index-3 w-100"
                />
              </div>
              <button
                id={`AddReferanceValueType`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded w-25px"
                onClick={addSection}
              >
                <AddIcon />
              </button>
              {selectedValueType === "list" ? (
                <div>
                  <label>{t("Reference Range")}</label>
                  <input
                    id={`referenceRange`}
                    type="text"
                    name="reference"
                    className="h-30px rounded form-control bg-transparent"
                    placeholder={t("Reference Range")}
                    value={formData.resultingRules[0]?.reference || ""}
                    onChange={handleReferenceChange}
                  />
                </div>
              ) : null}
            </div>
            <hr className="mb-0" />

            {/* Render dynamically added sections */}
            {formData.resultingRules?.map((section: any, i: number) => (
              <div key={section.id}>
                <div className="row px-2" style={{ gap: "3px" }}>
                  {sections[section.ruleType]?.map((field, index) => {
                    if (field.type === "mapped") {
                      return selectedValueType === "list" ||
                        selectedValueType === "listRange" ? (
                        <div style={{ width: "fit-content", padding: "0px" }}>
                          {section.resultRules.map(
                            (resultRule: any, resultRuleIndex: number) => {
                              return (
                                <div
                                  className="d-flex align-items-center"
                                  key={resultRuleIndex}
                                >
                                  {field.mappingArray?.map(
                                    (
                                      mappingField: any,
                                      mappingIndex: number
                                    ) => (
                                      <div
                                        key={mappingIndex}
                                        className="mapping-group d-flex align-items-end"
                                      >
                                        <React.Fragment key={mappingIndex}>
                                          <div
                                            className={`${mappingField.InputWidth} mt-4 px-0`}
                                          >
                                            <label className="small fw-600">
                                              {t(mappingField.label)}
                                            </label>
                                            {mappingField.type ===
                                            "dropdown" ? (
                                              <select
                                                id={`ResultingRule${
                                                  mappingField.name
                                                }${resultRuleIndex + 1}`}
                                                name={mappingField.name}
                                                value={
                                                  resultRule[
                                                    mappingField.name ?? ""
                                                  ] || ""
                                                }
                                                // placeholder={t(
                                                //   mappingField.placeholder ?? ""
                                                // )}
                                                className="form-control h-25px p-0 rounded"
                                                onChange={(e) =>
                                                  handleChange(
                                                    {
                                                      target: {
                                                        name: mappingField.name as string,
                                                        value: e.target.value,
                                                      },
                                                    },
                                                    i,
                                                    resultRuleIndex
                                                  )
                                                }
                                              >
                                                <option value="" disabled>
                                                  {t(
                                                    mappingField.placeholder ||
                                                      "Select an option"
                                                  )}
                                                </option>
                                                {mappingField.options?.map(
                                                  (item: any) => (
                                                    <option
                                                      key={item.value}
                                                      value={item.value}
                                                    >
                                                      {item.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            ) : (
                                              <input
                                                id={`ResultingRule${
                                                  mappingField.name
                                                }${resultRuleIndex + 1}`}
                                                type={mappingField.type}
                                                name={mappingField.name}
                                                value={
                                                  resultRule[
                                                    mappingField.name ?? ""
                                                  ]
                                                }
                                                className="form-control h-25px rounded p-1"
                                                placeholder={t(
                                                  mappingField.placeholder ?? ""
                                                )}
                                                onChange={(e) =>
                                                  handleChange(
                                                    e,
                                                    i,
                                                    resultRuleIndex
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                        </React.Fragment>
                                        {/* Add and Remove Buttons */}
                                        {field?.mappingArray &&
                                          mappingIndex ===
                                            field?.mappingArray.length - 1 && (
                                            <div className="d-flex mt-2 gap-2">
                                              {section.resultRules.length ===
                                              1 ? null : (
                                                <IconButton
                                                  id={`ResultingRulesCloseRow${
                                                    resultRuleIndex + 1
                                                  }`}
                                                  sx={{
                                                    height: "25px",
                                                    width: "25px",
                                                    borderRadius: "5px",
                                                  }}
                                                  className="bg-light-danger"
                                                  color="error"
                                                  onClick={() =>
                                                    removeMappingArray(
                                                      i,
                                                      resultRuleIndex
                                                    )
                                                  }
                                                >
                                                  <i className="fa fa-close text-danger"></i>
                                                </IconButton>
                                              )}
                                              {(selectedValueType === "list" ||
                                                selectedValueType ===
                                                  "listRange") &&
                                                resultRuleIndex ===
                                                  section.resultRules.length -
                                                    1 && (
                                                  <IconButton
                                                    id={`ResultingRulesAddRow${
                                                      resultRuleIndex + 1
                                                    }`}
                                                    sx={{
                                                      height: "25px",
                                                      width: "25px",
                                                      borderRadius: "5px",
                                                    }}
                                                    className="bg-light-success"
                                                    color="error"
                                                    onClick={() =>
                                                      addMappingArray(i)
                                                    }
                                                  >
                                                    <i className="fa fa-plus text-success"></i>
                                                  </IconButton>
                                                )}
                                            </div>
                                          )}
                                      </div>
                                    )
                                  )}
                                </div>
                              );
                            }
                          )}
                        </div>
                      ) : (
                        <>
                          {section.resultRules.map(
                            (resultRule: any, resultRuleIndex: number) => {
                              return (
                                <>
                                  {field.mappingArray?.map(
                                    (
                                      mappingField: any,
                                      mappingIndex: number
                                    ) => (
                                      <>
                                        <React.Fragment key={mappingIndex}>
                                          <div
                                            className={`${mappingField.InputWidth} mt-4 px-0`}
                                          >
                                            <label className="small fw-600">
                                              {t(mappingField.label)}
                                            </label>
                                            {mappingField.type ===
                                            "dropdown" ? (
                                              <select
                                                id={`ResultingRules${
                                                  mappingField.name
                                                }${i + 1}`}
                                                name={mappingField.name}
                                                value={
                                                  resultRule[
                                                    mappingField.name ?? ""
                                                  ] || ""
                                                }
                                                // placeholder={t(
                                                //   mappingField.placeholder ?? ""
                                                // )}
                                                className="form-control h-25px p-0 rounded"
                                                onChange={(e) =>
                                                  handleChange(
                                                    {
                                                      target: {
                                                        name: mappingField.name as string,
                                                        value: e.target.value,
                                                      },
                                                    },
                                                    i,
                                                    resultRuleIndex
                                                  )
                                                }
                                              >
                                                <option value="" disabled>
                                                  {t(
                                                    mappingField.placeholder ||
                                                      "Select an option"
                                                  )}
                                                </option>
                                                {mappingField.options?.map(
                                                  (item: any) => (
                                                    <option
                                                      key={item.value}
                                                      value={item.value}
                                                    >
                                                      {item.label}
                                                    </option>
                                                  )
                                                )}
                                              </select>
                                            ) : mappingField.type ===
                                              "inputMask" ? (
                                              <InputMask
                                                child={mappingField.children}
                                                onChange={handleChange}
                                                mainIndex={i}
                                                section={resultRule}
                                                resultRuleIndex={
                                                  resultRuleIndex
                                                }
                                              />
                                            ) : mappingField.type ===
                                              "numberInput" ? (
                                              <input
                                                id={`ResultingRules_${
                                                  mappingField.name
                                                }${i + 1}`}
                                                type="text"
                                                name={mappingField.name}
                                                value={
                                                  resultRule[
                                                    mappingField.name ?? ""
                                                  ]
                                                }
                                                className="form-control h-25px rounded p-1"
                                                placeholder={t(
                                                  mappingField.placeholder ?? ""
                                                )}
                                                onChange={(e) =>
                                                  handleChange(
                                                    e,
                                                    i,
                                                    resultRuleIndex
                                                  )
                                                }
                                                onKeyDown={(e) => {
                                                  const regex = /^[0-9.-]*$/;
                                                  if (
                                                    !(
                                                      regex.test(e.key) ||
                                                      e.key === "Backspace" ||
                                                      e.key === "Tab"
                                                    )
                                                  ) {
                                                    e.preventDefault();
                                                  }
                                                }}
                                              />
                                            ) : (
                                              <input
                                                id={`ReportingRules${
                                                  mappingField.name
                                                }${i + 1}`}
                                                type={mappingField.type}
                                                name={mappingField.name}
                                                value={
                                                  resultRule[
                                                    mappingField.name ?? ""
                                                  ]
                                                }
                                                className="form-control h-25px rounded p-1"
                                                placeholder={t(
                                                  mappingField.placeholder ?? ""
                                                )}
                                                onChange={(e) =>
                                                  handleChange(
                                                    e,
                                                    i,
                                                    resultRuleIndex
                                                  )
                                                }
                                              />
                                            )}
                                          </div>
                                        </React.Fragment>
                                        {/* Add and Remove Buttons */}
                                      </>
                                    )
                                  )}
                                </>
                              );
                            }
                          )}
                        </>
                      );
                    }

                    return (
                      <React.Fragment key={index}>
                        <div className={`${field.InputWidth} mt-4 px-0`}>
                          <label className="small fw-600">
                            {t(field.label ?? "")}
                          </label>
                          {field.type === "dropdown" ? (
                            <select
                              id={`ResultingRules${field.name}${i + 1}`}
                              name={field.name}
                              value={section[field.name ?? ""] || ""}
                              // placeholder={field.placeholder}
                              className="form-control h-25px p-0 rounded"
                              onChange={(e) =>
                                handleChange(
                                  {
                                    target: {
                                      name: field.name as string,
                                      value: e.target.value,
                                    },
                                  },
                                  i
                                )
                              }
                            >
                              <option value="" disabled>
                                {field.placeholder || "Select an option"}
                              </option>
                              {field.options?.map((item) => (
                                <option key={item.value} value={item.value}>
                                  {item.label}
                                </option>
                              ))}
                            </select>
                          ) : field.type === "inputMask" ? (
                            <InputMask
                              child={field.children}
                              onChange={handleChange}
                              mainIndex={i}
                              section={section}
                            />
                          ) : field.type === "numberInput" ? (
                            <input
                              type="text"
                              name={field.name}
                              value={section[field.name ?? ""]}
                              className="form-control h-25px rounded p-1"
                              placeholder={field.placeholder}
                              onChange={(e) => handleChange(e, i)}
                              onKeyDown={(e) => {
                                const regex = /^[0-9.-]*$/;
                                if (
                                  !(
                                    regex.test(e.key) ||
                                    e.key === "Backspace" ||
                                    e.key === "Tab"
                                  )
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          ) : (
                            <input
                              type={field.type}
                              name={field.name}
                              value={section[field.name ?? ""]}
                              className="form-control h-25px rounded p-1"
                              placeholder={field.placeholder}
                              onChange={(e) => handleChange(e, i)}
                            />
                          )}
                        </div>
                        {field.separatorAfter && (
                          <div className="col-12">
                            <hr />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}

                  {section.ruleType ? (
                    <div className="w-30px d-flex align-items-end px-0 mt-4">
                      <IconButton
                        id={`ResultingRulesDeleteButton${i + 1}`}
                        sx={{
                          height: "25px",
                          width: "25px",
                          borderRadius: "5px",
                        }}
                        className="bg-light-danger"
                        color="error"
                        onClick={() => removeSection(i)}
                      >
                        <i className="fa fa-trash text-danger"></i>
                      </IconButton>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultingRule;
