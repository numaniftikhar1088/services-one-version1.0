import { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  GetAdditionalSetupAsync,
  saveAdditionalSetupAsync,
} from "../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import { ReferenceLab } from "../Panel/Headers";
import AOE from "./components/AOE";
import AdditionalResultsCodes from "./components/AdditionalResultsCodes";
import ReflexTest from "./components/ReflexTest";
import ResultingRule from "./components/ResultingRule";
import Tags from "./components/Tags";
import TestAssignment from "./components/TestAssignment";
import TestComment from "./components/TestComment";
import useLang from "Shared/hooks/useLanguage";
import FacilityService from "Services/FacilityService/FacilityService";

interface ResultRules {
  name: string;
  minLow: string;
  maxLow: string;
  lowFlag: string;
  commentText: string;
  cuttOffFlag: string;
  minHigh: number | null;
  maxHigh: number | null;
  minCriticalLow: string;
  maxCriticalLow: string;
  reportingRuleId: number;
  criticalLowFlag: string;
  withInRangeFlag: string;
  maxInter: number | null;
  minInter: number | null;
  criticalHighFlag: string;
  cuttoffExpression: string;
  minLowExpression: string;
  maxLowExpression: string;
  minHighExpression: string;
  maxHighExpression: string;
  cuttOffValue: number | null;
  highFlagOrResultFlag: string;
  minCriticalHigh: number | null;
  maxCriticalHigh: number | null;
  maxCriticalLowExpression: string;
  minCriticalLowExpression: string;
  maxCriticalHighExpression: string;
  minCriticalHighExpression: string;
  criticalCuttoffExpression: string;
  criticalCuttOffValue: number | null;
  criticalHighCuttoffExpression: string;
  criticalHighCuttOffValue: number | null;
}
interface ResultingRules {
  ruleType: string;
  sex: number;
  ageType: string;
  ageFrom: string;
  ageTo: string;
  reference: string;
  resultRules: ResultRules[];
}

interface AdditionalResultCode {
  code: string;
  reason: string;
}

interface TestComments {
  gender: string;
  comments: string;
}

export interface AoE {
  aoeCode: string;
  aoeQuestion: string;
  dataType: string;
  optionsList: string[];
}

interface ReflexTests {
  id: number;
  reflexTestId: number;
  reflexTestName: string;
  resultOnName: string;
  resultOn: number;
}

export interface GroupTestAssignment {
  testID: number;
  testConfigId: number;
  testName: string;
}

interface GroupTests {
  sendOrder: number;
  panelDisplayType: number;
  groupTestsAssignments: GroupTestAssignment[];
}

export interface FormData {
  aoEs: AoE[];
  uom: string;
  tags: string[];
  testId: number;
  isChild: string;
  testType: string;
  tubeType: string;
  loincCode: string;
  snomedCode: string;
  storageType: string;
  testConfigId: number;
  resultMethod: string;
  minimalVolume: string;
  specimenTypeId: number;
  instrumentName: string;
  orderMethodType: string;
  orderMethodName: string;
  groupTests: GroupTests;
  autoValidateTest: string;
  isReferenceBill: boolean;
  reflexTests: ReflexTests[];
  dependencyTestIds: number[];
  isAutoValidateTest: boolean;
  testComments: TestComments[];
  resultingRules: ResultingRules[];
  additionalResultsCodes: AdditionalResultCode[];
}

function ExpandRow(props: any) {
  const { t } = useLang();

  const { row, setOpen, getAllTestsSetup } = props;
  const [referenceLab, setReferenceLab] = useState<ReferenceLab[]>([]);
  const [selectedLab, setSelectedLab] = useState<number | null>(null);

  const initialBloodCompendiumFormData = {
    testId: row.testId,
    testConfigId: row.testConfigId,
    uom: "",
    testType: "",
    dependencyTestIds: [0],
    specimenTypeId: 0,
    isAutoValidateTest: false,
    snomedCode: "",
    loincCode: "",
    minimalVolume: "",
    isChild: "",
    resultMethod: "",
    orderMethodType: "",
    orderMethodName: "",
    instrumentName: "",
    isReferenceBill: false,
    tubeType: "",
    storageType: "",
    autoValidateTest: "",
    resultingRules: [
      {
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
      },
    ],
    additionalResultsCodes: [
      {
        code: "",
        reason: "",
      },
    ],
    testComments: [
      {
        gender: "",
        comments: "",
      },
    ],
    tags: [""],
    aoEs: [
      {
        aoeCode: "",
        aoeQuestion: "",
        dataType: "",
        optionsList: [""],
      },
    ],
    reflexTests: [],
    groupTests: {
      sendOrder: 0,
      panelDisplayType: 0,
      groupTestsAssignments: [],
    },
  };

  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [formData, setFormData] = useState<FormData>(
    initialBloodCompendiumFormData
  );

  const validateFormData = (formData: FormData) => {
    const errors = [];
    if (row.testType.toLowerCase() === "individual") {
      // Resulting Rules validations
      if (formData.resultMethod === "Interface" && !formData.instrumentName)
        errors.push("Instrument Name is required.");
      if (formData.orderMethodType === "Interface" && !formData.orderMethodName)
        errors.push("Order Method Name is required.");
      if (!formData.specimenTypeId) errors.push("Specimen Type is required.");
      if (formData.resultingRules.length) {
        formData.resultingRules.forEach((rule, index) => {
          if (!rule.sex) errors.push(`Rule #${index + 1}: Sex is required.`);
          if (!rule.ageType)
            errors.push(`Rule #${index + 1}: Age is required.`);
          if (
            rule.ageFrom?.toString().includes("_") ||
            rule.ageTo?.toString().includes("_")
          ) {
            errors.push(
              `Rule #${index + 1
              }: Age Range format is incorrect. Please correct it.`
            );
          }
          if (!rule.ageFrom || !rule.ageTo) {
            errors.push(`Rule #${index + 1}: Age Range is required.`);
          }
          // if (!rule.ageTo)
          //   errors.push(`Rule #${index + 1}: Age To is required.`);
          if (+rule.ageFrom > +rule.ageTo) {
            errors.push(
              `Rule #${index + 1}: 'Age From' cannot be greater than 'Age To'.`
            );
          }
          if (rule.ruleType === "range") {
            rule.resultRules.map((resultRule: any) => {
              if (!resultRule.minLow || !resultRule.maxLow) {
                errors.push(`Rule #${index + 1}: Range is required.`);
              }
            });
          }
          if (rule.ruleType === "comment") {
            rule.resultRules.map((resultRule: any) => {
              if (!resultRule.commentText) {
                errors.push(`Rule #${index + 1}: Comment Text is required.`);
              }
            });
          }
          if (rule.ruleType === "cutoff") {
            rule.resultRules.map((resultRule: any) => {
              if (!resultRule.cuttoffExpression) {
                errors.push(
                  `Rule #${index + 1}: Cutt Off Expression is required.`
                );
              }
              if (resultRule.cuttOffValue === null) {
                errors.push(`Rule #${index + 1}: Cutt Off value is required.`);
              }
            });
          }
          if (rule.ruleType === "text") {
            rule.resultRules.map((resultRule: any) => {
              if (!resultRule.commentText) {
                errors.push(`Rule #${index + 1}: Text is required.`);
              }
            });
          }
          if (rule.ruleType === "list") {
            rule.resultRules.map((resultRule: any, i: number) => {
              if (!resultRule.commentText) {
                errors.push(
                  `Rule # ${index + 1} list # ${i + 1}: Text is required.`
                );
              }
            });
          }
        });
      }
      // Additional Results Code validations
      if (formData.additionalResultsCodes.length > 1) {
        formData.additionalResultsCodes.forEach((resultCode, index) => {
          if (!resultCode.code)
            errors.push(
              `Additional Results Codes #${index + 1}: Code is required.`
            );
          if (!resultCode.reason)
            errors.push(
              `Additional Results Codes #${index + 1}: Reason is required.`
            );
        });
      } else if (
        formData.additionalResultsCodes.length === 1 &&
        formData.additionalResultsCodes.some((obj) => {
          return Object.values(obj).some(
            (value) => value && value.toString().trim() !== ""
          );
        })
      ) {
        if (!formData.additionalResultsCodes[0].code)
          errors.push(`Additional Results Codes #1: Code is required.`);
        if (!formData.additionalResultsCodes[0].reason)
          errors.push(`Additional Results Codes #1: Reason is required.`);
      }

      // test comments validation
      if (formData.testComments.length > 1) {
        formData.testComments.forEach((testComment, index) => {
          if (!testComment.gender)
            errors.push(`Test Comments #${index + 1}: Gender is required.`);
          if (!testComment.comments)
            errors.push(`Test Comments #${index + 1}: Comments is required.`);
        });
      } else if (
        formData.testComments.length === 1 &&
        formData.testComments.some((obj) => {
          return Object.values(obj).some(
            (value) => value.toString().trim() !== ""
          );
        })
      ) {
        if (!formData.testComments[0].gender)
          errors.push(`Test Comments # 1: Gender is required.`);
        if (!formData.testComments[0].comments)
          errors.push(`Test Comments # 1: Comments is required.`);
      }
    } else {
      // Test Type Panel Validation
      if (!formData.groupTests.sendOrder)
        errors.push("Send Order is required.");
      if (!formData.groupTests.panelDisplayType)
        errors.push("Panel Display Type is required.");
      // if (!selectedLab) errors.push("Please select lab.");
      if (formData.groupTests.groupTestsAssignments.length === 0)
        errors.push("Select atleast one Test.");
    }

    // Tags validation
    if (formData.tags.length > 1) {
      formData.tags.forEach((tag, index) => {
        if (!tag) errors.push(`Tags #${index + 1}: Tag is required.`);
      });
    }

    // AOE validation
    if (formData.aoEs.length > 1) {
      formData.aoEs.forEach((aoe, index) => {
        if (!aoe.aoeCode) errors.push(`AOEs #${index + 1}: Code is required.`);
        if (!aoe.aoeQuestion)
          errors.push(`AOEs #${index + 1}: Question is required.`);
        if (!aoe.dataType)
          errors.push(`AOEs #${index + 1}: Data Type is required.`);
        if (aoe.dataType === "Multiple Choice") {
          aoe.optionsList.forEach((option, i) => {
            if (!option)
              errors.push(`AOEs #${index + 1}: Option #${i + 1} is required.`);
          });
        }
      });
    } else if (
      formData.aoEs.length === 1 &&
      formData.aoEs.some((obj) => {
        return Object.values(obj).some(
          (value) => value.toString().trim() !== ""
        );
      })
    ) {
      if (!formData.aoEs[0].aoeCode) errors.push(`AOEs #1: Code is required.`);
      if (!formData.aoEs[0].aoeQuestion)
        errors.push(`AOEs #1: Question is required.`);
      if (!formData.aoEs[0].dataType)
        errors.push(`AOEs #1: Data Type is required.`);
      if (formData.aoEs[0].dataType === "Multiple Choice") {
        formData.aoEs[0].optionsList.forEach((option, i) => {
          if (!option) errors.push(`AOEs #1: Option #${i + 1} is required.`);
        });
      }
    }
    // Add more validation rules as needed
    return errors;
  };

  const handleSave = async () => {
    setIsAddButtonDisabled(true);

    const validationErrors = validateFormData(formData);
    if (validationErrors.length) {
      toast.error(t(validationErrors[0]));
      setIsAddButtonDisabled(false);
      return;
    }
    try {
      const { additionalResultsCodes, ...remainingFormData } = formData;
      const modifiedAdditionalResults = additionalResultsCodes.map(
        (additionalResult) => ({
          code: additionalResult.code ?? null,
          reason: additionalResult.reason,
        })
      );

      const newFormData = {
        ...remainingFormData,
        additionalResultsCodes: modifiedAdditionalResults,
      };

      const response = await saveAdditionalSetupAsync(newFormData);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response?.data?.message));
        getAllTestsSetup(false, false);
        // setOpen(false);
      } else if (response?.data?.status === 400) {
        toast.error(t(response?.data?.title));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAddButtonDisabled(false);
    }
  };

  //LookUp APi calls
  const fetchReferenceLab = async () => {
    try {
      const res: AxiosResponse = await FacilityService.referenceLabLookup();

      const referenceArray: ReferenceLab[] =
        res?.data?.data?.map((val: any) => ({
          value: val?.labId,
          label: val?.labDisplayName,
        })) || [];
      if (referenceArray.length === 1) {
        setSelectedLab(referenceArray[0].value);
      }
      setReferenceLab(referenceArray);
    } catch (err: any) {
      console.error(t("Error fetching reference labs:"), err.message);
    }
  };

  // Load data api call
  useEffect(() => {
    const fetchFormData = async () => {
      const payload = {
        testId: row.testId,
        testConfigId: row.testConfigId,
        testType: row.testType,
      };
      try {
        const response = await GetAdditionalSetupAsync(payload);
        if (response) {
          fetchReferenceLab();
          const { aoEs, ...rest }: FormData = response.data.data;

          setFormData({
            testId: rest.testId ?? 0,
            testConfigId: rest.testConfigId ?? 0,
            uom: rest.uom ?? "",
            testType: rest.testType ?? "",
            dependencyTestIds: rest.dependencyTestIds ?? [0],
            specimenTypeId: rest.specimenTypeId ?? 0,
            resultMethod: rest.resultMethod ?? "",
            orderMethodType: rest.orderMethodType ?? "",
            orderMethodName: rest.orderMethodName ?? "",
            instrumentName: rest.instrumentName ?? "",
            isAutoValidateTest: rest.isAutoValidateTest ?? false,
            isReferenceBill: rest.isReferenceBill ?? false,
            snomedCode: rest.snomedCode ?? "",
            tubeType: rest.tubeType ?? "",
            storageType: rest.storageType ?? "",
            autoValidateTest: rest.autoValidateTest ?? "",
            loincCode: rest.loincCode ?? "",
            minimalVolume: rest.minimalVolume ?? "",
            isChild: rest.isChild ?? "",
            resultingRules:
              rest.resultingRules?.map((rules: ResultingRules) => ({
                ...rules,
                ruleType: rules.ruleType ?? "",
                sex: rules.sex ?? 0,
                ageType: rules.ageType ?? "",
                ageFrom: rules.ageFrom ?? "0",
                ageTo: rules.ageTo ?? "0",
                reference: rules.reference ?? "",
                resultRules: rules.resultRules.map(
                  (resultRule: ResultRules) => ({
                    ...resultRule,
                    reportingRuleId: resultRule.reportingRuleId ?? 0,
                    name: resultRule.name ?? "",
                    minLow: resultRule.minLow ?? "0",
                    maxLow: resultRule.maxLow ?? "0",
                    withInRangeFlag: resultRule.withInRangeFlag ?? "",
                    lowFlag: resultRule.lowFlag ?? "",
                    highFlagOrResultFlag: resultRule.highFlagOrResultFlag ?? "",
                    minCriticalLow: resultRule.minCriticalLow ?? "",
                    maxCriticalLow: resultRule.maxCriticalLow ?? "",
                    criticalLowFlag: resultRule.criticalLowFlag ?? "",
                    criticalHighFlag: resultRule.criticalHighFlag ?? "",
                    commentText: resultRule.commentText ?? "",
                    cuttoffExpression: resultRule.cuttoffExpression ?? "",
                    cuttOffValue: resultRule.cuttOffValue ?? null, // Use the correct value
                    criticalCuttoffExpression:
                      resultRule.criticalCuttoffExpression ?? "",
                    criticalCuttOffValue:
                      resultRule.criticalCuttOffValue ?? null,
                    criticalHighCuttoffExpression:
                      resultRule.criticalHighCuttoffExpression ?? "",
                    criticalHighCuttOffValue:
                      resultRule.criticalHighCuttOffValue ?? null,
                    cuttOffFlag: resultRule.cuttOffFlag ?? "",
                    minLowExpression: resultRule.minLowExpression ?? "",
                    maxLowExpression: resultRule.maxLowExpression ?? "",
                    minInter: resultRule.minInter ?? null,
                    maxInter: resultRule.maxInter ?? null,
                    minHighExpression: resultRule.minHighExpression ?? "",
                    minHigh: resultRule.minHigh ?? null,
                    maxHighExpression: resultRule.maxHighExpression ?? "",
                    maxHigh: resultRule.maxHigh ?? null,
                    minCriticalHighExpression:
                      resultRule.minCriticalHighExpression ?? "",
                    minCriticalHigh: resultRule.minCriticalHigh ?? null,
                    maxCriticalHighExpression:
                      resultRule.maxCriticalHighExpression ?? "",
                    maxCriticalHigh: resultRule.maxCriticalHigh ?? null,
                    minCriticalLowExpression:
                      resultRule.minCriticalLowExpression ?? "",
                    maxCriticalLowExpression:
                      resultRule.maxCriticalLowExpression ?? "",
                  })
                ),
              })) ?? initialBloodCompendiumFormData.resultingRules,
            additionalResultsCodes:
              rest.additionalResultsCodes?.map(
                (code: AdditionalResultCode) => ({
                  code: code.code ?? "",
                  reason: code.reason ?? "",
                })
              ) ?? initialBloodCompendiumFormData.additionalResultsCodes,
            testComments:
              rest.testComments?.map((comment: TestComments) => ({
                gender: comment.gender ?? "",
                comments: comment.comments ?? "",
              })) ?? initialBloodCompendiumFormData.testComments,
            tags: rest.tags ?? initialBloodCompendiumFormData.tags,
            aoEs:
              aoEs?.map((item: AoE) => ({
                aoeCode: item.aoeCode ?? "",
                aoeQuestion: item.aoeQuestion ?? "",
                dataType: item.dataType ?? "",
                optionsList: item.optionsList ?? [""],
              })) ?? initialBloodCompendiumFormData.aoEs,
            reflexTests:
              rest.reflexTests?.map((test: ReflexTests) => ({
                id: test.id ?? 0,
                reflexTestId: test.reflexTestId ?? 0,
                resultOn: test.resultOn ?? 0,
                reflexTestName: test.reflexTestName ?? "",
                resultOnName: test.resultOnName ?? "",
              })) ?? initialBloodCompendiumFormData.reflexTests,
            groupTests:
              Object.values(rest.groupTests ?? {}).length > 0
                ? {
                  sendOrder: rest.groupTests?.sendOrder ?? 0,
                  panelDisplayType: rest.groupTests?.panelDisplayType ?? 0,
                  groupTestsAssignments:
                    rest.groupTests?.groupTestsAssignments?.map(
                      (assignment: GroupTestAssignment) => ({
                        testID: assignment.testID ?? 0,
                        testConfigId: assignment.testConfigId ?? 0,
                        testName: assignment.testName ?? "",
                      })
                    ) ??
                    initialBloodCompendiumFormData.groupTests
                      .groupTestsAssignments,
                }
                : initialBloodCompendiumFormData.groupTests,
          });
        }
      } catch (error) {
        console.error(t("Failed to fetch lookup data:"), error);
      }
    };

    fetchFormData();
  }, []);

  return (
    <div className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky">
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
          <div className="d-flex align-items-center gap-2 mb-4">
            <button
              id={`BloodCompendiumDataTestSetupExpandCancelTop`}
              className="btn btn-warning btn-sm fw-bold mr-3 px-5 text-capitalize text-white h-30px"
              aria-controls="SearchCollapse"
              aria-expanded="true"
              type="button"
              onClick={() => setOpen(false)}
            >
              <span>
                <span>{t("Cancel")}</span>
              </span>
            </button>
            <button
              id={`BloodCompendiumDataTestSetupExpandSaveTop`}
              className="btn btn-primary btn-sm fw-bold mr-3 px-5 text-capitalize h-30px"
              aria-controls="SearchCollapse"
              aria-expanded="true"
              type="button"
              onClick={handleSave}
              disabled={isAddButtonDisabled}
            >
              <span>
                <span>{t("Save")}</span>
              </span>
            </button>
          </div>
          {row.testType === "Panel" ? (
            <TestAssignment
              formData={formData}
              setFormData={setFormData}
              referenceLab={referenceLab}
              selectedLab={selectedLab}
              setSelectedLab={setSelectedLab}
            />
          ) : (
            <ResultingRule formData={formData} setFormData={setFormData} labId={row.labId} />
          )}
          <div className="mt-5 d-flex flex-column">
            {row.testType === "Individual" ? (
              <>
                <AdditionalResultsCodes
                  formData={formData}
                  setFormData={setFormData}
                />
                <hr />
              </>
            ) : null}
            {row.testType === "Panel" ? null : (
              <>
                <TestComment formData={formData} setFormData={setFormData} />
                <hr />
              </>
            )}

            <Tags formData={formData} setFormData={setFormData} />
            <hr />
            <AOE formData={formData} setFormData={setFormData} />
            <hr />
            {row.testType === "Panel" ? null : (
              <ReflexTest formData={formData} setFormData={setFormData} />
            )}
          </div>
          <div className="d-flex align-items-center gap-2 mt-4">
            <button
              id={`BloodCompendiumDataTestSetupExpandCancelBottom`}
              className="btn btn-warning btn-sm fw-bold mr-3 px-5 text-capitalize text-white h-30px"
              aria-controls="SearchCollapse"
              aria-expanded="true"
              type="button"
            >
              <span>
                <span>{t("Cancel")}</span>
              </span>
            </button>
            <button
              id={`BloodCompendiumDataTestSetupExpandSaveBottom`}
              className="btn btn-primary btn-sm fw-bold mr-3 px-5 text-capitalize h-30px"
              aria-controls="SearchCollapse"
              aria-expanded="true"
              type="button"
              onClick={handleSave}
              disabled={isAddButtonDisabled}
            >
              <span>
                <span>{t("Save")}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpandRow;
