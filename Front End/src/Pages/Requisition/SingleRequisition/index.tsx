import { AxiosError, AxiosResponse } from "axios";
import MapWithSearchAndResults from "Pages/MapTest";
import { useCallback, useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setPhysicianSignature } from "Redux/Actions/Index";
import PermissionComponent, {
  getPermissionDisplayName,
} from "Shared/Common/Permissions/PermissionComponent";
import { useBilling } from "Shared/hooks/useBilling";
import useIsMobile from "Shared/hooks/useIsMobile";
import useLang from "Shared/hooks/useLanguage";
import { IRequisitionInputs } from "../../../Interface/SingleRequisition";
import {
  setRequisitionData,
  setSelectedRequisitionData,
} from "../../../Redux/Actions/Pages/Requisition";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import Splash from "../../../Shared/Common/Pages/Splash";
import useYupForm from "../../../Shared/hooks/Requisition/useYupForm";
import useYupFormInfectiousData from "../../../Shared/hooks/Requisition/useYupFormInfectiousData";
import { formValuesForApi } from "../../../Utils/Auth";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import {
  countEntriesWithSpecificText,
  countKeysWithValues,
  extractFocussedInputAddress,
  getDataForRequsitionLoad,
} from "../../../Utils/Common/Requisition";
import {
  ValidateInput,
  getInputsEmptyValues,
} from "../../../Utils/Requisition/Validation";
import RequisitionPreview from "./RequisitionPreview";
import SectionComp from "./SectionComp";

const SingleRequisition = (props: any) => {
  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get("workflowId");

  const isMobile = useIsMobile();

  const { t } = useLang();
  const [ins, setIns] = useState(false);
  const { clearBillingInfo } = useBilling();
  const [showButton, setShowButton] = useState(true);
  const [
    IsSelectedByDefaultCompendiumData,
    setIsSelectedByDefaultCompendiumData,
  ] = useState(false);

  const removeLocalStorageVariables = () => {
    localStorage.removeItem("insurnceID");
    localStorage.removeItem("insuranceDataID");
    localStorage.removeItem("facilityID");
    localStorage.removeItem("insuranceOptionId");
    sessionStorage.removeItem("billingInsurances");
    sessionStorage.removeItem("PhysicianName");
    localStorage.removeItem("patientID");
  };

  useEffect(() => {
    removeLocalStorageVariables();

    return () => {
      removeLocalStorageVariables();
    };
  }, []);

  const removePhysicianValue = () => {
    sessionStorage.removeItem("PhysicianID");
    dispatch(setPhysicianSignature(null));
  };
  const [checkbox, setCheckbox] = useState(false);
  useEffect(() => {
    const navigationEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload"
    ) {
      removePhysicianValue();
      clearBillingInfo();
    } else {
      console.log("This is a fresh load or navigated differently");
    }
  }, []);

  const requisitionErrors = useSelector(
    (state: any) => state?.ReqReducer?.requisitionUnhandledError
  );
  const [checkreqType, setCheckReqType] = useState(false);
  const [selectedReqIds, setSelectedReqIds] = useState<any>({
    requsitionId: [],
    requisitionName: [],
  });
  const [isShown, setIsShown] = useState<boolean>(true);
  const [disableCheckbox, setDisableCheckbox] = useState(false);
  const [check, setCheck] = useState<boolean>(false);
  const [Inputs, setInputs] = useState<IRequisitionInputs | any>();
  const [infectiousData, setInfectiousData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [formState, setFormState] = useState<any>();
  const [toggleRequisitionModal, setToggleRequisitionModal] = useState(false);
  const [previewData, setPreviewData] = useState();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmittingForSave, setisSubmittingForSave] = useState(false);
  const [disablessn, setDisableSSN] = useState(false);
  const [isSubmittingForSaveForLater, setisSubmittingForSaveForLater] =
    useState(false);
  const [isSubmittingForSaveForSignature, setisSubmittingForSaveForSignature] =
    useState(false);
  const [errorFocussedInput, setErrorFocussedInput] = useState<any>();
  const [focusOnInfectiousData, setFocusOnInfectiousData] = useState(false);
  const [noMedication, setNoMedication] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [validationBackup, setValidationBackup] = useState<any>([]);
  const [SignPadValue, setSignPadValue] = useState<any>("");
  const [SignPadVal, setSignPadVal] = useState<any>("");
  const [noFamilyHistroy, setNoFamilyHistory] = useState(false);
  const [noActiveMedication, setNoActiveMedication] = useState(false);
  const [screening, setScreening] = useState(false);
  const [invalidDateFields, setInvalidDateFields] = useState<Set<string>>(new Set());
  const ref = useRef<any>(null);

  // Track invalid date fields
  const handleDateValidityChange = useCallback((isInvalid: boolean, fieldName: string) => {
    setInvalidDateFields((prev) => {
      const newSet = new Set(prev);
      if (isInvalid) {
        newSet.add(fieldName);
      } else {
        newSet.delete(fieldName);
      }
      return newSet;
    });
  }, []);

  // Check if any date fields are invalid
  const hasInvalidDates = invalidDateFields.size > 0;

  useEffect(() => {
    getInputs(location?.state?.reqId);
    if (!location?.state?.reqId) {
      localStorage.removeItem("insurnceID");
      localStorage.removeItem("insuranceDataID");
      localStorage.removeItem("facilityID");
      localStorage.removeItem("insuranceOptionId");
      sessionStorage.removeItem("billingInsurances");
      sessionStorage.removeItem("PhysicianName");
      localStorage.removeItem("patientID");

      Inputs?.map((inp: any) => {
        inp?.fields?.map((i: any) => {
          i.defaultValue = "";
          if (i.repeatFields) {
            i.repeatFields.map((j: any) => {
              j.defaultValue = "";
            });
          }
        });
      });
      setInfectiousData([]);
      setInputs(Inputs);
      getInputs(location?.state?.reqId);
    }
  }, [location?.state?.data?.id]);
  useEffect(() => {
    setInfectiousDataEmptyOnLoad();
  }, []);

  const setInfectiousDataEmptyOnLoad = () => {
    dispatch(
      setSelectedRequisitionData({
        requisitionName: [],
        requsitionId: [],
      })
    );
  };
  const [inputValueForSpecimen, setInputValueForSpecimen] = useState<any[]>([]);
  function removeRepeatStartFromBilling(newRefPreviewData: any) {
    newRefPreviewData.requisitions.forEach((requisition: any) => {
      if (requisition.reqName === "common") {
        requisition.reqSections.forEach((section: any) => {
          if (section.sectionId === 5) {
            for (let i = section?.fields?.length - 1; i >= 0; i--) {
              if (
                section?.fields[i]?.displayName?.toLowerCase() ===
                "repeat start"
              ) {
                section?.fields?.splice(i, 1);
              }
            }
          }
        });
      }
    });
    return newRefPreviewData;
  }
  function remove_fromMaskedInput(newRefPreviewData: any) {
    newRefPreviewData.requisitions.forEach((requisition: any) => {
      if (requisition?.reqName === "common") {
        requisition?.reqSections?.forEach((section: any) => {
          if (section.sectionId === 3) {
            section?.fields?.forEach((i: any) => {
              if (typeof i?.fieldValue === "string") {
                i.fieldValue = i?.fieldValue?.replace(/_/g, ""); // Replaces all "_"
              }
            });
          }
        });
      }
    });
    return newRefPreviewData;
  }

  function removeRepeatStart(newRefPreviewData: any) {
    newRefPreviewData.requisitions.forEach((requisition: any) => {
      if (requisition.reqName !== "common") {
        requisition.reqSections.forEach(
          (section: any, sectionIndex: number) => {
            // Check if the section contains the field with displayName "Repeat Start"
            const hasRepeatStartField = section?.fields?.some(
              (field: any) =>
                field.displayName?.toLowerCase() === "repeat start"
            );
            // If the section contains the field, remove the entire section
            if (hasRepeatStartField) {
              requisition.reqSections.splice(sectionIndex, 1);
            }
          }
        );
      }
    });
    return newRefPreviewData;
  }

  function FindBillingTypeLength(newRefPreviewData: any) {
    let countBilling = 0;
    newRefPreviewData.requisitions.forEach((requisition: any) => {
      if (requisition.reqName === "common") {
        requisition.reqSections.forEach((section: any) => {
          if (section.sectionId === 5) {
            countBilling++;
          }
        });
      }
    });
    return countBilling;
  }
  function FindNoSecondaryCheckbox() {
    let SecondaryCheckboxVisibility = false;
    Inputs.forEach((section: any) => {
      if (section.sectionId === 5) {
        section.fields.map((i: any) => {
          if (i?.displayFieldName?.toLowerCase() === "repeat start") {
            i?.repeatFields.map((f: any) => {
              if (f?.systemFieldName === "NoSecondaryInsurance" && f?.visible) {
                SecondaryCheckboxVisibility = true;
              }
            });
          }
        });
      }
    });

    return SecondaryCheckboxVisibility;
  }
  interface QueryModel {
    pageId: number;
    requisitionId: number;
    workflowId: string | null;
    patientId?: number;
    redirectFromPage?: number;
  }
  const getInputs = async (id: any) => {
    setLoading(true);
    let queryModel: QueryModel = {
      pageId: 6,
      requisitionId: id ?? 0,
      workflowId: workflowId,
    };
    if (location?.state?.patientId) {
      queryModel.patientId = location?.state?.patientId;
      queryModel.requisitionId = location?.state?.requisitionId;
      queryModel.redirectFromPage = 14;
    }
    await RequisitionType?.GetCommonSectionForRequisition(queryModel)
      .then((res: AxiosResponse) => {
        let resCopy: any = [...res?.data];
        setInputs(resCopy);
        const Backup =
          resCopy
            ?.flatMap((input: any) => input.fields || [])
            .map((field: any) => ({
              systemFieldName: field.systemFieldName,
              validationExpression: field.validationExpression,
            })) || [];
        if (Backup.length > 0) {
          localStorage.setItem(
            "Backup",
            JSON.stringify(Backup)
          );
        }
        let dataToLoadRequisition = getDataForRequsitionLoad(resCopy);

        dataToLoadRequisition.pageId = 6;
        dataToLoadRequisition.requisitionId = id ? id : 0;
        dataToLoadRequisition.workflowId = workflowId;
        dataToLoadRequisition.requisitionOrderId = location?.state?.orderid
          ? location?.state?.orderid
          : 0;
        if (id || workflowId) {
          LoadRequisitionSection(dataToLoadRequisition);
        }
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() => setLoading(false));
  };


  const LoadRequisitionSection = useCallback((obj: any) => {
    if (!obj.insuranceTypeId && !obj.insuranceDataId) return;
    localStorage.setItem("insurnceID", obj.insuranceTypeId);
    localStorage.setItem("insuranceOptionId", obj.insuranceDataId);
    RequisitionType?.LoadReqSectionByFacilityIDandInsuranceId(obj)
      .then((res: AxiosResponse) => {
        res.data.forEach((requisitionNameLevel: any) => {
          requisitionNameLevel.sections.forEach((sectionsLevel: any) => {
            sectionsLevel.fields.forEach((fieldsLevel: any) => {
              fieldsLevel.singleRequsition = true;
              if (fieldsLevel.defaultValue) {
                fieldsLevel.visible = true;
              }
            });
          });
        });
        setInfectiousData(res.data);

        if (location?.state?.reqId) {
          let objToSend: any;
          let ReqIdArray: any = [];
          let ReqNameArray: any = [];
          res.data.map((item: any) => {
            ReqIdArray.push(item?.reqId);
            ReqNameArray.push(item?.requistionName);
          });
          objToSend = {
            requsitionId: ReqIdArray,
            requisitionName: ReqNameArray,
          };
          dispatch(setSelectedRequisitionData(objToSend));
        }
        dispatch(
          setRequisitionData({
            reqRequestData: res?.data,
          })
        );
        ref.current.scrollIntoView({ behavior: "smooth" });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  }, []);

  const {
    inputsForValidation,
    setInputsForValidation,
    submitForValidation,
  }: any = useYupForm(Inputs, ValidateInput);

  const {
    submitInfectiousInputsForValidation,
    inputDataInputsForValidation,
    setInfectiousDataInputsForValidation,
    submitFormSaveForLaterRequisitionValidation,
  } = useYupFormInfectiousData(infectiousData, setInfectiousData);

  const [finaliseArray, setFinalizeArray] = useState<any>([]);

  useEffect(() => {
    const checkReqTypeId = () => {
      infectiousData.forEach((item: any, index: any) => {
        if (item?.isSelected) {
          setCheckReqType(true);

        }
      });
    };
    checkReqTypeId();
  }, [IsSelectedByDefaultCompendiumData]);
  // Continue Button Function
  const previewRequisition = () => {
    let concattedArray: any = [];
    let requisitionObj = {
      requisitionName: "common",
    };
    const formDataForApi = formValuesForApi(
      Inputs,
      requisitionObj,
      location?.state?.reqId,
      ""
    );

    let formDataApi2: any;
    submitForValidation(true, false).then((validatedData: any) => {

      let validatedDataForInfectiousDataInputs: any;
      submitInfectiousInputsForValidation().then((data) => {
        validatedDataForInfectiousDataInputs = data;

        setInputsForValidation(validatedData.data);
        let errorCount = countKeysWithValues(validatedData.validation);

        setErrorFocussedInput(validatedData.validation);
        errorCount.then(async (validationCount: any) => {
          let infectiousDataErrorCount = countEntriesWithSpecificText(
            validatedDataForInfectiousDataInputs.validation
          );
          let focusInputAddress = extractFocussedInputAddress(
            validatedData.data
          );
          let focusInputAddress2: any;
          if (infectiousData.length != 0) {
            if (checkreqType) {
              // this is for checking errors that are stored within store
              let unHandledErrors =
                await countKeysWithValues(requisitionErrors);
              if (unHandledErrors) {
                toast.error(t("Please Resolve all the errors."), {
                  position: "top-center",
                });
                return;
              }
              infectiousData.forEach((item: any, index: any) => {
                if (item?.isSelected) {
                  if (!focusInputAddress) {
                    focusInputAddress2 = extractFocussedInputAddress(
                      validatedDataForInfectiousDataInputs.data[index]?.sections
                    );
                    setErrorFocussedInput(focusInputAddress2);
                  }
                  setErrorFocussedInput(
                    focusInputAddress ?? focusInputAddress2
                  );
                  if (validationCount === 0 && infectiousDataErrorCount === 0) {
                    if (item.sections) {
                      formDataApi2 = formValuesForApi(
                        item.sections,
                        props?.Requisition.ReqReducer.selectedReqObjData,
                        location?.state?.reqId,
                        "",
                        item?.reqId,
                        item?.requistionName
                      );
                      concattedArray.push(formDataApi2?.requisitions);
                    }
                    let concatedArrForFormDataApi =
                      formDataForApi.requisitions.concat(...concattedArray);
                    let newFormDataApi = {
                      ...formDataForApi,
                      requisitions: concatedArrForFormDataApi,
                    };
                    let newRefPreviewData = { ...newFormDataApi };
                    let countBilling = FindBillingTypeLength(newRefPreviewData);
                    let VisibilityCheckbox = FindNoSecondaryCheckbox();

                    if (countBilling === 2 && !ins && VisibilityCheckbox) {
                      toast.error(
                        t("Select the No Secondary Insurance Checkbox"),
                        {
                          position: "top-center",
                        }
                      );
                      return;
                    }

                    if (countBilling > 2 && ins && VisibilityCheckbox) {
                      toast.error(
                        t("Uncheck the No Secondary Insurance Checkbox"),
                        {
                          position: "top-center",
                        }
                      );
                      return;
                    }

                    newRefPreviewData =
                      removeRepeatStartFromBilling(newRefPreviewData);
                    newRefPreviewData =
                      remove_fromMaskedInput(newRefPreviewData);
                    newRefPreviewData = removeRepeatStart(newRefPreviewData);
                    setPreviewData(newRefPreviewData);
                    setToggleRequisitionModal(true);
                  } else {
                    return;
                  }
                }
              });
            } else {
              setCheckReqType(false);
              toast.error(t("Select atleast one requisition"), {
                position: "top-center",
              });
            }
          }
        });
      });
    });
  };

  const handleRequisitionSave = async (data: any) => {
    setisSubmittingForSave(true);
    try {
      const res = await RequisitionType.saveRequsitionFormData({
        ...data,
        workflowId: workflowId,
      });
      if (res?.data?.httpStatusCode === 200) {
        const insuranceID = localStorage.getItem("insurnceID");
        if (insuranceID) {
          localStorage.removeItem("insurnceID");
          localStorage.removeItem("insuranceDataID");
          localStorage.removeItem("facilityID");
          sessionStorage.removeItem("PhysicianName");
          localStorage.removeItem("patientID");
        }
        navigateToNext(res.data);
        toast.success(t("Requisition Saved"), {
          position: "top-center",
        });
      }
    } catch (err) {
      console.error("Error saving requisition:", err);
    } finally {
      setisSubmittingForSave(false);
    }
  };

  const navigateToNext = (data: any) => {
    if (location?.state?.reqId > 0) {
      const path =
        location?.state?.Check || location?.state?.status === "Missing Info"
          ? `/RequisitionSummary`
          : `/OrderView/${window.btoa(location?.state?.reqId)}/${window.btoa(
            location?.state?.orderid
          )}`;
      navigate(path, { state: data });
      if (
        !location?.state?.Check &&
        location?.state?.status !== "Missing Info"
      ) {
        sessionStorage.removeItem("PhysicianID");
        dispatch(setPhysicianSignature(null));
      }
    } else {
      navigate(`/RequisitionSummary`, { state: { ...data, workflowId } });
    }
  };

  const saveRequisition = async () => {
    let objtoSend;
    let concattedArray = [];
    const requisitionObj = {
      requisitionName: "common",
      requisitionId: 0,
    };
    const formDataForApi = formValuesForApi(
      Inputs,
      requisitionObj,
      location?.state?.reqId,
      ""
    );
    if (location?.state?.reqId && !signatureCheck) {
      try {
        const validatedData = await submitForValidation(true, false);
        const validatedDataForInfectiousDataInputs =
          await submitInfectiousInputsForValidation();
        setInputsForValidation(validatedData?.data);
        const validationCount = await countKeysWithValues(
          validatedData?.validation
        );
        const infectiousDataErrorCount = countEntriesWithSpecificText(
          validatedDataForInfectiousDataInputs?.validation
        );
        const focusInputAddress = extractFocussedInputAddress(
          validatedData.data
        );
        let focusInputAddress2;
        let reqCondition: any = false;
        infectiousData.forEach((item: any, index: any) => {
          if (item?.isSelected) {
            reqCondition = true;
          }
        });
        if (!reqCondition && infectiousData.length === 0) {
          toast.error(t("Select at least one requisition"), {
            position: "top-center",
          });
          setFocusOnInfectiousData(!focusOnInfectiousData);
          return;
        }

        if (infectiousData.length > 0) {
          for (const item of infectiousData) {
            if (item?.isSelected) {
              focusInputAddress2 =
                focusInputAddress2 ||
                extractFocussedInputAddress(item?.sections);
              setErrorFocussedInput(focusInputAddress ?? focusInputAddress2);

              if (validationCount === 0 && infectiousDataErrorCount === 0) {
                if (item?.sections) {
                  const formDataApi2 = formValuesForApi(
                    item.sections,
                    props?.Requisition.ReqReducer.selectedReqObjData,
                    location?.state?.reqId,
                    "",
                    item?.reqId,
                    item?.requistionName
                  );
                  concattedArray.push(formDataApi2?.requisitions);
                }
              } else {
                return;
              }
            }
          }
        }

        const newFormDataApi = {
          ...formDataForApi,
          requisitions: [
            ...formDataForApi.requisitions,
            ...concattedArray.flat(),
          ],
          MissingFields: [],
        };
        const countBilling = FindBillingTypeLength(newFormDataApi);
        let VisibilityCheckbox = FindNoSecondaryCheckbox();
        if (countBilling === 2 && !ins && VisibilityCheckbox) {
          toast.error(t("Select the No Secondary Insurance Checkbox"), {
            position: "top-center",
          });
          return;
        }

        if (countBilling > 2 && ins && VisibilityCheckbox) {
          toast.error(t("Uncheck the No Secondary Insurance Checkbox"), {
            position: "top-center",
          });
          return;
        }
        objtoSend = removeRepeatStartFromBilling(newFormDataApi);
        objtoSend = remove_fromMaskedInput(newFormDataApi);
        objtoSend = removeRepeatStart(newFormDataApi);
        let unHandledErrors = await countKeysWithValues(requisitionErrors);
        if (unHandledErrors) {
          toast.error(t("Please Resolve all the errors."), {
            position: "top-center",
          });
          return;
        }
        await handleRequisitionSave(objtoSend);
      } catch (error) {
        console.error("Error during requisition processing:", error);
      }
    } else {
      await handleRequisitionSave(previewData);
    }
  };
  const saveRequisitionForLater = async () => {
    let objtoSend: any;
    let concattedArray: any = [];
    const promises: any[] = [];
    let requisitionObj = {
      requisitionName: "common",
    };
    const formDataForApi = formValuesForApi(
      inputsForValidation,
      requisitionObj,
      location?.state?.reqId,
      "saveForLater"
    );
    let reqCondition: any = false;
    let formDataApi2: any;
    let validatedData = await submitForValidation(false);
    infectiousData.forEach((item: any, index: any) => {
      if (item?.isSelected) {
        reqCondition = true;
      }
    });
    await submitFormSaveForLaterRequisitionValidation();
    setInputsForValidation(validatedData?.data);

    let errorCount: any = await countKeysWithValues(validatedData?.validation);
    if (infectiousData.length === 0) {
      toast.error(t("Select at least one requisition"), {
        position: "top-center",
      });
      return;
    }
    // this is for checking errors that are stored within store
    let unHandledErrors = await countKeysWithValues(requisitionErrors);
    if (unHandledErrors) {
      toast.error("Please resolve all the errors.", {
        position: "top-center",
      });
      return;
    }

    if (errorCount === 0) {
      if (infectiousData.length != 0) {
        if (!reqCondition) {
          toast.error(t("Select at least one requisition"), {
            position: "top-center",
          });
          return;
        }

        // Collect MissingFields from Inputs
        let allMissingFields = getInputsEmptyValues(Inputs);

        infectiousData.forEach((item: any, index: any) => {
          if (item?.isSelected) {
            const promise = new Promise((resolve, reject) => {
              if (item?.sections) {
                formDataApi2 = formValuesForApi(
                  item?.sections,
                  props?.Requisition.ReqReducer.selectedReqObjData,
                  location?.state?.reqId,
                  "",
                  item?.reqId,
                  item?.requistionName
                );
                concattedArray.push(formDataApi2?.requisitions);
              }
              let concatedArrForFormDataApi = formDataApi2?.requisitions
                ? formDataForApi.requisitions.concat(...concattedArray)
                : formDataForApi.requisitions;
              let newFormDataApi = {
                ...formDataForApi,
                requisitions: concatedArrForFormDataApi,
              };

              // Collect MissingFields from item.sections and combine with allMissingFields
              let itemEmptyValues = getInputsEmptyValues(item?.sections || []);
              allMissingFields = [...allMissingFields, ...itemEmptyValues];

              newFormDataApi.MissingFields = allMissingFields;
              const countBilling = FindBillingTypeLength(newFormDataApi);
              let VisibilityCheckbox = FindNoSecondaryCheckbox();
              if (countBilling === 2 && !ins && VisibilityCheckbox) {
                toast.error(t("Select the No Secondary Insurance Checkbox"), {
                  position: "top-center",
                });
                return;
              }

              if (countBilling > 2 && ins && VisibilityCheckbox) {
                toast.error(t("Uncheck the No Secondary Insurance Checkbox"), {
                  position: "top-center",
                });
                return;
              }
              setisSubmittingForSaveForLater(true);

              newFormDataApi = removeRepeatStartFromBilling(newFormDataApi);
              newFormDataApi = remove_fromMaskedInput(newFormDataApi);
              newFormDataApi = removeRepeatStart(newFormDataApi);
              resolve(newFormDataApi);
            });
            promises.push(promise);
          }
        });

        Promise.all(promises)
          .then((results) => {
            results.forEach((newFormDataApi) => {
              if (newFormDataApi) {
                objtoSend = newFormDataApi;
              } else {
                console.error("One of the promises resolved to undefined.");
              }
            });
            RequisitionType.saveRequsitionFormData({
              ...objtoSend,
              workflowId: workflowId,
            })
              .then((res: any) => {
                if (res?.data.httpStatusCode === 200) {
                  setisSubmittingForSaveForLater(false);
                  navigate(`/view-requisition`);
                  toast.success(t("requisition Saved"), {
                    position: "top-center",
                  });
                }
              })
              .catch((err: any) => { })
              .finally(() => {
                setisSubmittingForSaveForLater(false);
              });
          })
          .catch((error) => {
            console.error("Error occurred while processing promises:", error);
          });
      } else {
        const promise = new Promise((resolve, reject) => {
          let newFormDataApi = {
            ...formDataForApi,
          };

          // Collect MissingFields from Inputs
          let emptyValuesArr = getInputsEmptyValues(Inputs);
          newFormDataApi.MissingFields = emptyValuesArr;
          setisSubmittingForSaveForLater(true);
          resolve(newFormDataApi);
        });
        promises.push(promise);
        Promise.all(promises)
          .then((results) => {
            results.forEach((newFormDataApi) => {
              if (newFormDataApi) {
                objtoSend = newFormDataApi;
              } else {
                console.error("One of the promises resolved to undefined.");
              }
            });
            RequisitionType.saveRequsitionFormData({
              ...objtoSend,
              workflowId: workflowId,
            })
              .then((res: any) => {
                if (res?.data.httpStatusCode === 200) {
                  const insuranceID = localStorage.getItem("insurnceID");
                  if (insuranceID) {
                    localStorage.removeItem("insurnceID");
                    localStorage.removeItem("insuranceDataID");
                    localStorage.removeItem("facilityID");
                    sessionStorage.removeItem("PhysicianName");
                    localStorage.removeItem("patientID");
                  }
                  setisSubmittingForSaveForLater(false);
                  navigate(`/view-requisition`);
                  toast.success(
                    t("requisition Saved", {
                      position: "top-center",
                    })
                  );
                }
              })
              .catch((err: any) => { })
              .finally(() => {
                setisSubmittingForSaveForLater(false);
              });
          })
          .catch((error) => {
            console.error("Error occurred while processing promises:", error);
          });
      }
    } else {
      return;
    }
  };

  const checkPhysicianSignature = (inputs: any): boolean => {
    for (const item of inputs) {
      if (item?.sectionId === 13) {
        for (const field of item.fields) {
          if (field.systemFieldName === "PhysicianSignature") {
            return !!field.defaultValue;
          }
        }
      }
    }
    return false;
  };
  const [signatureCheck, setSignatureCheck] = useState(false);
  const saveRequisitionForSignature = async () => {
    const hasSignature = checkPhysicianSignature(Inputs);
    if (hasSignature) {
      toast.warning(t("Physician Signature already there"), {
        position: "top-center",
      });
    } else {
      let concattedArray: any = [];
      let requisitionObj = {
        requisitionName: "common",
      };
      const formDataForApi = formValuesForApi(
        Inputs,
        requisitionObj,
        location?.state?.reqId,
        "saveForSignature"
      );
      let reqCondition: any = false;
      infectiousData.forEach((item: any, index: any) => {
        if (item?.isSelected) {
          reqCondition = true;
        }
      });

      let formDataApi2: any;
      let validatedDataForInfectiousDataInputs: any;
      validatedDataForInfectiousDataInputs =
        await submitInfectiousInputsForValidation();
      let validatedData = await submitForValidation(true, true);

      setInputsForValidation(validatedData?.data);
      let errorCount: any = countKeysWithValues(validatedData?.validation);
      errorCount.then(async (validationCount: any) => {
        let infectiousDatavalidationCount = countEntriesWithSpecificText(
          validatedDataForInfectiousDataInputs?.validation
        );

        let focusInputAddress = extractFocussedInputAddress(validatedData.data);
        let focusInputAddress2: any;

        // this is for checking errors that are stored within store
        let unHandledErrors = await countKeysWithValues(requisitionErrors);
        if (unHandledErrors) {
          toast.error("Please Resolve all the errors.", {
            position: "top-center",
          });
          return;
        }

        infectiousData.forEach((item: any, index: any) => {
          if (!reqCondition) {
            toast.error(t("Select atleast one requisition"), {
              position: "top-center",
            });
            return;
          }
          if (item?.isSelected) {
            if (!focusInputAddress) {
              focusInputAddress2 = extractFocussedInputAddress(
                validatedDataForInfectiousDataInputs.data[index]?.sections
              );
              setErrorFocussedInput(focusInputAddress2);
            }
            setErrorFocussedInput(focusInputAddress ?? focusInputAddress2);
            if (validationCount === 0 && infectiousDatavalidationCount === 0) {
              if (reqCondition) {
                if (item.sections) {
                  formDataApi2 = formValuesForApi(
                    item.sections,
                    props?.Requisition.ReqReducer.selectedReqObjData,
                    location?.state?.reqId,
                    "",
                    item?.reqId,
                    item?.requistionName
                  );
                  concattedArray.push(formDataApi2?.requisitions);
                }
                let concatedArrForFormDataApi =
                  formDataForApi.requisitions.concat(...concattedArray);
                let newFormDataApi = {
                  ...formDataForApi,
                  requisitions: concatedArrForFormDataApi,
                };
                let newRefPreviewData: any = { ...newFormDataApi };
                let countBilling = FindBillingTypeLength(newRefPreviewData);
                let VisibilityCheckbox = FindNoSecondaryCheckbox();
                if (countBilling === 2 && !ins && VisibilityCheckbox) {
                  toast.error(t("Select the No Secondary Insurance Checkbox"), {
                    position: "top-center",
                  });
                  return;
                }

                if (countBilling > 2 && ins && VisibilityCheckbox) {
                  toast.error(
                    t("Uncheck the No Secondary Insurance Checkbox"),
                    {
                      position: "top-center",
                    }
                  );
                  return;
                }
                newRefPreviewData =
                  removeRepeatStartFromBilling(newRefPreviewData);
                newRefPreviewData = remove_fromMaskedInput(newRefPreviewData);
                newRefPreviewData = removeRepeatStart(newRefPreviewData);
                setSignatureCheck(true);
                setPreviewData(newRefPreviewData);
                setToggleRequisitionModal(true);
                setisSubmittingForSaveForSignature(false);
              } else {
                toast.error(t("Select at least one requisition"), {
                  position: "top-center",
                });
              }
            }
          }
        });
      });
    }
  };
  let FinalAppendedArray: any = [];
  return (
    <>
      {loading ? (
        <div
          style={{ height: "100vh" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Splash />
        </div>
      ) : (
        <div className="d-flex flex-column flex-column-fluid">
          <div className="app-toolbar py-2 py-lg-3">
            <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
              <BreadCrumbs />
              {isMobile ? (
                <div className="d-flex align-items-center gap-2 gap-lg-3 justifi-content-center w-100">
                  {/* start */}
                  <div className="row row-cols-md-auto justify-content-center justify-content-md-end  mb-3 w-70 border gap-2">
                    {/* if we are Creating new requisition*/}
                    {!location?.state?.reqId && !toggleRequisitionModal ? (
                      <>
                        <div className="d-flex gap-2 justify-content-center">
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForLater"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-warning "
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForLater}
                                disabled={isSubmittingForSaveForLater}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save For Later"
                                )}
                              </button>
                            )}
                          </PermissionComponent>

                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForSignature"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForSignature}
                                disabled={isSubmittingForSaveForSignature}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save for Authorized Signature"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        </div>
                        <div className="d-flex gap-2 justify-content-center">
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="Continue"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={previewRequisition}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Continue"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                          {workflowId ? null : (
                            <button
                              className="btn btn-sm fw-bold btn-cancel"
                              onClick={() => {
                                setToggleRequisitionModal(false);
                                if (!toggleRequisitionModal) {
                                  workflowId
                                    ? navigate("/MyFavorites")
                                    : navigate("/view-requisition");
                                }
                              }}
                            >
                              {toggleRequisitionModal ? t("Back") : t("Cancel")}
                            </button>
                          )}
                        </div>
                      </>
                    ) : (
                      <></>
                    )}
                    {/* if we are Coming from pending requisition*/}
                    {location?.state?.reqId &&
                      location?.state?.Check &&
                      !toggleRequisitionModal ? (
                      <>
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForLater"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForLater}
                                disabled={isSubmittingForSaveForLater}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save For Later"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForSignature"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForSignature}
                                disabled={isSubmittingForSaveForSignature}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save for Authorized Signature"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="Continue"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={previewRequisition}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Continue"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                        {workflowId ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-cancel"
                            onClick={() => {
                              const insuranceID =
                                localStorage.getItem("insurnceID");
                              if (insuranceID) {
                                localStorage.removeItem("insurnceID");
                                localStorage.removeItem("insuranceDataID");
                                localStorage.removeItem("facilityID");
                                sessionStorage.removeItem("PhysicianName");
                                localStorage.removeItem("patientID");
                              }
                              setToggleRequisitionModal(false);
                              if (!toggleRequisitionModal) {
                                location?.state?.link
                                  ? navigate(`/${location?.state?.link}`, {
                                    state: { tab: 2 },
                                  })
                                  : navigate("/Pending-requisition");
                              }
                            }}
                          >
                            {t("Cancel")}
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {/* if we are editing requisition */}
                    {location?.state?.reqId &&
                      !location?.state?.Check &&
                      !toggleRequisitionModal ? (
                      <>
                        {workflowId ? null : (
                          <Link
                            to={
                              workflowId ? "/MyFavorites" : "/view-requisition"
                            }
                            className="btn btn-sm fw-bold btn-cancel"
                          >
                            {t("Cancel")}
                          </Link>
                        )}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={saveRequisition}
                            disabled={isSubmittingForSave || hasInvalidDates}
                          >
                            {isSubmittingForSave ? t("Saving") : t("Save")}
                          </button>
                        )}
                        {location?.state?.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="Continue"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={previewRequisition}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Continue"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        ) : null}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <>
                            {
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="New Order"
                                permissionIdentifier="SaveForSignature"
                              >
                                {({
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                }) => (
                                  <button
                                    className="btn btn-sm fw-bold btn-info"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target"
                                    type="button"
                                    onClick={saveRequisitionForSignature}
                                    disabled={isSubmittingForSaveForSignature}
                                  >
                                    {getPermissionDisplayName(
                                      pageName,
                                      moduleName,
                                      permissionIdentifier,
                                      "Save for Authorized Signature"
                                    )}
                                  </button>
                                )}
                              </PermissionComponent>
                            }
                          </>
                        ) : null}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <>
                            {
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="New Order"
                                permissionIdentifier="SaveForLater"
                              >
                                {({
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                }) => (
                                  <button
                                    className="btn btn-sm fw-bold btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target"
                                    type="button"
                                    onClick={saveRequisitionForLater}
                                    disabled={isSubmittingForSaveForLater}
                                  >
                                    {getPermissionDisplayName(
                                      pageName,
                                      moduleName,
                                      permissionIdentifier,
                                      "Save For Later"
                                    )}
                                  </button>
                                )}
                              </PermissionComponent>
                            }
                          </>
                        ) : null}
                      </>
                    ) : (
                      <></>
                    )}
                    {toggleRequisitionModal ? (
                      <>
                        <button
                          className="btn btn-sm fw-bold btn-cancel"
                          type="button"
                          onClick={() => {
                            setToggleRequisitionModal(false);
                            if (!toggleRequisitionModal) {
                              const insuranceID =
                                localStorage.getItem("insurnceID");
                              if (insuranceID) {
                                localStorage.removeItem("insurnceID");
                                localStorage.removeItem("insuranceDataID");
                                localStorage.removeItem("facilityID");
                              }
                              workflowId
                                ? navigate("/MyFavorites")
                                : navigate("/view-requisition");
                            }
                          }}
                          disabled={
                            isSubmittingForSave ||
                            isSubmittingForSaveForLater ||
                            isSubmittingForSaveForSignature
                          }
                        >
                          {toggleRequisitionModal ? t("Back") : t("Cancel")}
                        </button>
                        <button
                          className="btn btn-sm fw-bold btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#kt_modal_new_target"
                          type="button"
                          disabled={isSubmittingForSave || hasInvalidDates}
                          onClick={saveRequisition}
                        >
                          {isSubmittingForSave ? t("Saving...") : t("Save")}
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </div>
                  {/* end */}
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  {!location?.state?.reqId && !toggleRequisitionModal ? (
                    <>
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="New Order"
                        permissionIdentifier="SaveForLater"
                      >
                        {({ pageName, moduleName, permissionIdentifier }) => (
                          <button
                            className="btn btn-sm fw-bold btn-warning"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={saveRequisitionForLater}
                            disabled={isSubmittingForSaveForLater}
                          >
                            {getPermissionDisplayName(
                              pageName,
                              moduleName,
                              permissionIdentifier,
                              "Save For Later"
                            )}
                          </button>
                        )}
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="New Order"
                        permissionIdentifier="SaveForSignature"
                      >
                        {({ pageName, moduleName, permissionIdentifier }) => (
                          <button
                            className="btn btn-sm fw-bold btn-info"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={saveRequisitionForSignature}
                            disabled={isSubmittingForSaveForSignature}
                          >
                            {getPermissionDisplayName(
                              pageName,
                              moduleName,
                              permissionIdentifier,
                              "Save for Authorized Signature"
                            )}
                          </button>
                        )}
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="New Order"
                        permissionIdentifier="Continue"
                      >
                        {({ pageName, moduleName, permissionIdentifier }) => (
                          <button
                            className="btn btn-sm fw-bold btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={previewRequisition}
                          >
                            {getPermissionDisplayName(
                              pageName,
                              moduleName,
                              permissionIdentifier,
                              "Continue"
                            )}
                          </button>
                        )}
                      </PermissionComponent>
                      {workflowId ? null : (
                        <button
                          className="btn btn-sm fw-bold btn-cancel"
                          onClick={() => {
                            setToggleRequisitionModal(false);
                            if (!toggleRequisitionModal) {
                              workflowId
                                ? navigate("/MyFavorites")
                                : navigate("/view-requisition");
                            }
                          }}
                        >
                          {toggleRequisitionModal ? t("Back") : t("Cancel")}
                        </button>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* if we are Coming from pending requisition*/}
                  {location?.state?.reqId &&
                    location?.state?.Check &&
                    !toggleRequisitionModal ? (
                    <>
                      {
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="SaveForLater"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-warning"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={saveRequisitionForLater}
                              disabled={isSubmittingForSaveForLater}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Save For Later"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                      }
                      {
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="SaveForSignature"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-info"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={saveRequisitionForSignature}
                              disabled={isSubmittingForSaveForSignature}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Save for Authorized Signature"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                      }
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="New Order"
                        permissionIdentifier="Continue"
                      >
                        {({ pageName, moduleName, permissionIdentifier }) => (
                          <button
                            className="btn btn-sm fw-bold btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={previewRequisition}
                          >
                            {getPermissionDisplayName(
                              pageName,
                              moduleName,
                              permissionIdentifier,
                              "Continue"
                            )}
                          </button>
                        )}
                      </PermissionComponent>
                      {workflowId ? null : (
                        <button
                          className="btn btn-sm fw-bold btn-cancel"
                          onClick={() => {
                            const insuranceID =
                              localStorage.getItem("insurnceID");
                            if (insuranceID) {
                              localStorage.removeItem("insurnceID");
                              localStorage.removeItem("insuranceDataID");
                              localStorage.removeItem("facilityID");
                              sessionStorage.removeItem("PhysicianName");
                              localStorage.removeItem("patientID");
                            }
                            setToggleRequisitionModal(false);
                            if (!toggleRequisitionModal) {
                              location?.state?.link
                                ? navigate(`/${location?.state?.link}`, {
                                  state: { tab: 2 },
                                })
                                : navigate("/Pending-requisition");
                            }
                          }}
                        >
                          {t("Cancel")}
                        </button>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                  {/* if we are editing requisition */}
                  {location?.state?.reqId &&
                    !location?.state?.Check &&
                    !toggleRequisitionModal ? (
                    <>
                      {workflowId ? null : (
                        <Link
                          to={workflowId ? "/MyFavorites" : "/view-requisition"}
                          className="btn btn-sm fw-bold btn-cancel"
                        >
                          {t("Cancel")}
                        </Link>
                      )}
                      {location.state.status === "Missing Info" &&
                        !toggleRequisitionModal ? null : (
                        <button
                          className="btn btn-sm fw-bold btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#kt_modal_new_target"
                          type="button"
                          onClick={saveRequisition}
                          disabled={isSubmittingForSave || hasInvalidDates}
                        >
                          {isSubmittingForSave ? t("Saving") : t("Save")}
                        </button>
                      )}
                      {location?.state?.status === "Missing Info" &&
                        !toggleRequisitionModal ? (
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="Continue"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={previewRequisition}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Continue"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                      ) : null}
                      {location.state.status === "Missing Info" &&
                        !toggleRequisitionModal ? (
                        <>
                          {
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForSignature"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-info"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForSignature}
                                  disabled={isSubmittingForSaveForSignature}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save for Authorized Signature"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          }
                        </>
                      ) : null}
                      {location.state.status === "Missing Info" &&
                        !toggleRequisitionModal ? (
                        <>
                          {
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForLater"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-warning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForLater}
                                  disabled={isSubmittingForSaveForLater}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save For Later"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          }
                        </>
                      ) : null}
                    </>
                  ) : (
                    <></>
                  )}
                  {toggleRequisitionModal ? (
                    <>
                      <button
                        className="btn btn-sm fw-bold btn-cancel"
                        type="button"
                        onClick={() => {
                          setToggleRequisitionModal(false);
                          if (!toggleRequisitionModal) {
                            const insuranceID =
                              localStorage.getItem("insurnceID");
                            if (insuranceID) {
                              localStorage.removeItem("insurnceID");
                              localStorage.removeItem("insuranceDataID");
                              localStorage.removeItem("facilityID");
                            }
                            workflowId
                              ? navigate("/MyFavorites")
                              : navigate("/view-requisition");
                          }
                        }}
                        disabled={
                          isSubmittingForSave ||
                          isSubmittingForSaveForLater ||
                          isSubmittingForSaveForSignature
                        }
                      >
                        {toggleRequisitionModal ? t("Back") : t("Cancel")}
                      </button>
                      <button
                        className="btn btn-sm fw-bold btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#kt_modal_new_target"
                        type="button"
                        disabled={isSubmittingForSave || hasInvalidDates}
                        onClick={saveRequisition}
                      >
                        {isSubmittingForSave ? t("Saving...") : t("Save")}
                      </button>
                    </>
                  ) : (
                    <></>
                  )}

                  {/* end */}
                </div>
              )}
            </div>
          </div>

          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div
              id="kt_app_content_container"
              className="app-container container-fluid req-preview-wrapper"
            >
              {toggleRequisitionModal && (
                <RequisitionPreview
                  previewData={previewData}
                  requisitionID={location?.state?.reqId}
                  infectiousData={infectiousData}
                />
              )}
              <div
                className={
                  !toggleRequisitionModal ? `grid row` : "grid row d-none"
                }
              >
                {Array.isArray(inputsForValidation) &&
                  inputsForValidation?.map(
                    (section, index: number) =>
                      section.isSelected && (
                        <div
                          className={`${section.displayType} col-sm-6 pb-4 grid-item`}
                        >
                          <SectionComp
                            Section={section}
                            Inputs={inputsForValidation}
                            setInputs={setInputs}
                            index={index}
                            isShown={!isShown}
                            setIsShown={setIsShown}
                            //masonryRef={masonryRef}
                            pageId={location?.state?.data?.id}
                            //editRequisitionId={location?.state?.reqId}
                            formData={formData}
                            setFormData={setFormData}
                            formState={formState}
                            setFormState={setFormState}
                            infectiousData={infectiousData}
                            errorFocussedInput={errorFocussedInput}
                            setInfectiousData={setInfectiousData}
                            inputDataInputsForValidation={
                              inputDataInputsForValidation
                            }
                            setInfectiousDataInputsForValidation={
                              setInfectiousDataInputsForValidation
                            }
                            setInputsForValidation={setInputsForValidation}
                            focusOnInfectiousData={focusOnInfectiousData}
                            setCheck={setCheck}
                            editID={location?.state?.reqId}
                            finaliseArray={finaliseArray}
                            setFinalizeArray={setFinalizeArray}
                            FinalAppendedArray={FinalAppendedArray}
                            LoadRequisitionSection={LoadRequisitionSection}
                            setSelectedReqIds={setSelectedReqIds}
                            selectedReqIds={selectedReqIds}
                            setIns={setIns}
                            disableCheckbox={disableCheckbox}
                            setDisableCheckbox={setDisableCheckbox}
                            inputValueForSpecimen={inputValueForSpecimen}
                            setInputValueForSpecimen={setInputValueForSpecimen}
                            checkbox={checkbox}
                            setCheckbox={setCheckbox}
                            showButton={showButton}
                            setShowButton={setShowButton}
                            validationBackup={validationBackup}
                            setValidationBackup={setValidationBackup}
                            disablessn={disablessn}
                            setDisableSSN={setDisableSSN}
                            noMedication={noMedication}
                            setNoMedication={setNoMedication}
                            SignPadValue={SignPadValue}
                            setSignPadValue={setSignPadValue}
                            setErrorFocussedInput={setErrorFocussedInput}
                            noFamilyHistroy={noFamilyHistroy}
                            setNoFamilyHistory={setNoFamilyHistory}
                            setSignPadVal={setSignPadVal}
                            noActiveMedication={noActiveMedication}
                            setNoActiveMedication={setNoActiveMedication}
                            IsSelectedByDefaultCompendiumData={
                              IsSelectedByDefaultCompendiumData
                            }
                            setIsSelectedByDefaultCompendiumData={
                              setIsSelectedByDefaultCompendiumData
                            }
                            setCheckReqType={setCheckReqType}
                            screening={screening}
                            setScreening={setScreening}
                            onDateValidityChange={handleDateValidityChange}
                          />
                        </div>
                      )
                  )}

                {isMobile ? (
                  <div className="d-flex align-items-center gap-2 gap-lg-3 justifi-content-center w-100">
                    {/* start */}
                    <div className="row row-cols-md-auto justify-content-center justify-content-md-end  mb-3 w-70 border gap-2">
                      {/* if we are Creating new requisition*/}
                      {!location?.state?.reqId && !toggleRequisitionModal ? (
                        <>
                          <div className="d-flex gap-2 justify-content-center">
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForLater"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-warning "
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForLater}
                                  disabled={isSubmittingForSaveForLater}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save For Later"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForSignature"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-info"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForSignature}
                                  disabled={isSubmittingForSaveForSignature}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save for Authorized Signature"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          </div>
                          <div className="d-flex gap-2 justify-content-center">
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="Continue"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={previewRequisition}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Continue"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                            {workflowId ? null : (
                              <button
                                className="btn btn-sm fw-bold btn-cancel"
                                onClick={() => {
                                  setToggleRequisitionModal(false);
                                  if (!toggleRequisitionModal) {
                                    workflowId
                                      ? navigate("/MyFavorites")
                                      : navigate("/view-requisition");
                                  }
                                }}
                              >
                                {toggleRequisitionModal
                                  ? t("Back")
                                  : t("Cancel")}
                              </button>
                            )}
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {/* if we are Coming from pending requisition*/}
                      {location?.state?.reqId &&
                        location?.state?.Check &&
                        !toggleRequisitionModal ? (
                        <>
                          {
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForLater"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-warning"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForLater}
                                  disabled={isSubmittingForSaveForLater}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save For Later"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          }
                          {
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="SaveForSignature"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-info"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={saveRequisitionForSignature}
                                  disabled={isSubmittingForSaveForSignature}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Save for Authorized Signature"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          }
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="Continue"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={previewRequisition}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Continue"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                          {workflowId ? null : (
                            <button
                              className="btn btn-sm fw-bold btn-cancel"
                              onClick={() => {
                                const insuranceID =
                                  localStorage.getItem("insurnceID");
                                if (insuranceID) {
                                  localStorage.removeItem("insurnceID");
                                  localStorage.removeItem("insuranceDataID");
                                  localStorage.removeItem("facilityID");
                                  sessionStorage.removeItem("PhysicianName");
                                  localStorage.removeItem("patientID");
                                }
                                setToggleRequisitionModal(false);
                                if (!toggleRequisitionModal) {
                                  location?.state?.link
                                    ? navigate(`/${location?.state?.link}`, {
                                      state: { tab: 2 },
                                    })
                                    : navigate("/Pending-requisition");
                                }
                              }}
                            >
                              {t("Cancel")}
                            </button>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                      {/* if we are editing requisition */}
                      {location?.state?.reqId &&
                        !location?.state?.Check &&
                        !toggleRequisitionModal ? (
                        <>
                          {workflowId ? null : (
                            <Link
                              to={
                                workflowId
                                  ? "/MyFavorites"
                                  : "/view-requisition"
                              }
                              className="btn btn-sm fw-bold btn-cancel"
                            >
                              {t("Cancel")}
                            </Link>
                          )}
                          {location.state.status === "Missing Info" &&
                            !toggleRequisitionModal ? null : (
                            <button
                              className="btn btn-sm fw-bold btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={saveRequisition}
                              disabled={isSubmittingForSave || hasInvalidDates}
                            >
                              {isSubmittingForSave ? t("Saving") : t("Save")}
                            </button>
                          )}
                          {location?.state?.status === "Missing Info" &&
                            !toggleRequisitionModal ? (
                            <PermissionComponent
                              moduleName="Requisition"
                              pageName="New Order"
                              permissionIdentifier="Continue"
                            >
                              {({
                                pageName,
                                moduleName,
                                permissionIdentifier,
                              }) => (
                                <button
                                  className="btn btn-sm fw-bold btn-primary"
                                  data-bs-toggle="modal"
                                  data-bs-target="#kt_modal_new_target"
                                  type="button"
                                  onClick={previewRequisition}
                                >
                                  {getPermissionDisplayName(
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                    "Continue"
                                  )}
                                </button>
                              )}
                            </PermissionComponent>
                          ) : null}
                          {location.state.status === "Missing Info" &&
                            !toggleRequisitionModal ? (
                            <>
                              {
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="New Order"
                                  permissionIdentifier="SaveForSignature"
                                >
                                  {({
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                  }) => (
                                    <button
                                      className="btn btn-sm fw-bold btn-info"
                                      data-bs-toggle="modal"
                                      data-bs-target="#kt_modal_new_target"
                                      type="button"
                                      onClick={saveRequisitionForSignature}
                                      disabled={isSubmittingForSaveForSignature}
                                    >
                                      {getPermissionDisplayName(
                                        pageName,
                                        moduleName,
                                        permissionIdentifier,
                                        "Save for Authorized Signature"
                                      )}
                                    </button>
                                  )}
                                </PermissionComponent>
                              }
                            </>
                          ) : null}
                          {location.state.status === "Missing Info" &&
                            !toggleRequisitionModal ? (
                            <>
                              {
                                <PermissionComponent
                                  moduleName="Requisition"
                                  pageName="New Order"
                                  permissionIdentifier="SaveForLater"
                                >
                                  {({
                                    pageName,
                                    moduleName,
                                    permissionIdentifier,
                                  }) => (
                                    <button
                                      className="btn btn-sm fw-bold btn-warning"
                                      data-bs-toggle="modal"
                                      data-bs-target="#kt_modal_new_target"
                                      type="button"
                                      onClick={saveRequisitionForLater}
                                      disabled={isSubmittingForSaveForLater}
                                    >
                                      {getPermissionDisplayName(
                                        pageName,
                                        moduleName,
                                        permissionIdentifier,
                                        "Save For Later"
                                      )}
                                    </button>
                                  )}
                                </PermissionComponent>
                              }
                            </>
                          ) : null}
                        </>
                      ) : (
                        <></>
                      )}
                      {toggleRequisitionModal ? (
                        <>
                          {workflowId ? null : (
                            <button
                              className="btn btn-sm fw-bold btn-cancel"
                              type="button"
                              onClick={() => {
                                setToggleRequisitionModal(false);
                                if (!toggleRequisitionModal) {
                                  const insuranceID =
                                    localStorage.getItem("insurnceID");
                                  if (insuranceID) {
                                    localStorage.removeItem("insurnceID");
                                    localStorage.removeItem("insuranceDataID");
                                    localStorage.removeItem("facilityID");
                                  }
                                  workflowId
                                    ? navigate("/MyFavorites")
                                    : navigate("/view-requisition");
                                }
                              }}
                              disabled={
                                isSubmittingForSave ||
                                isSubmittingForSaveForLater ||
                                isSubmittingForSaveForSignature
                              }
                            >
                              {toggleRequisitionModal ? t("Back") : t("Cancel")}
                            </button>
                          )}
                          <button
                            className="btn btn-sm fw-bold btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            disabled={isSubmittingForSave || hasInvalidDates}
                            onClick={saveRequisition}
                          >
                            {isSubmittingForSave ? t("Saving...") : t("Save")}
                          </button>
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                    {/* end */}
                  </div>
                ) : (
                  <div className="d-flex align-items-center mt-3 justify-content-end gap-2 gap-lg-3">
                    {/* start */}

                    {/* if we are Creating new requisition*/}
                    {!location?.state?.reqId && !toggleRequisitionModal ? (
                      <>
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForLater"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForLater}
                                disabled={isSubmittingForSaveForLater}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save For Later"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForSignature"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForSignature}
                                disabled={isSubmittingForSaveForSignature}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save for Authorized Signature"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="Continue"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={previewRequisition}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Continue"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                        {workflowId ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-cancel"
                            onClick={() => {
                              setToggleRequisitionModal(false);
                              if (!toggleRequisitionModal) {
                                workflowId
                                  ? navigate("/MyFavorites")
                                  : navigate("/view-requisition");
                              }
                            }}
                          >
                            {toggleRequisitionModal ? t("Back") : t("Cancel")}
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {/* if we are Coming from pending requisition*/}

                    {location?.state?.reqId &&
                      location?.state?.Check &&
                      !toggleRequisitionModal ? (
                      <>
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForLater"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-warning"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForLater}
                                disabled={isSubmittingForSaveForLater}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save For Later"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        {
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="SaveForSignature"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-info"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={saveRequisitionForSignature}
                                disabled={isSubmittingForSaveForSignature}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Save for Authorized Signature"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        }
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="New Order"
                          permissionIdentifier="Continue"
                        >
                          {({ pageName, moduleName, permissionIdentifier }) => (
                            <button
                              className="btn btn-sm fw-bold btn-primary"
                              data-bs-toggle="modal"
                              data-bs-target="#kt_modal_new_target"
                              type="button"
                              onClick={previewRequisition}
                            >
                              {getPermissionDisplayName(
                                pageName,
                                moduleName,
                                permissionIdentifier,
                                "Continue"
                              )}
                            </button>
                          )}
                        </PermissionComponent>
                        {workflowId ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-cancel"
                            onClick={() => {
                              setToggleRequisitionModal(false);
                              if (!toggleRequisitionModal) {
                                navigate("/Pending-requisition");
                              }
                            }}
                          >
                            {t("Cancel")}
                          </button>
                        )}
                      </>
                    ) : (
                      <></>
                    )}
                    {/* if we are editing requisition */}
                    {location?.state?.reqId &&
                      !location?.state?.Check &&
                      !toggleRequisitionModal ? (
                      <>
                        {workflowId ? null : (
                          <Link
                            to={
                              workflowId ? "/MyFavorites" : "/view-requisition"
                            }
                            className="btn btn-sm fw-bold btn-cancel"
                          >
                            {t("Cancel")}
                          </Link>
                        )}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#kt_modal_new_target"
                            type="button"
                            onClick={saveRequisition}
                            disabled={isSubmittingForSave || hasInvalidDates}
                          >
                            {isSubmittingForSave ? t("Saving...") : t("Save")}
                          </button>
                        )}
                        {location?.state?.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <PermissionComponent
                            moduleName="Requisition"
                            pageName="New Order"
                            permissionIdentifier="Continue"
                          >
                            {({
                              pageName,
                              moduleName,
                              permissionIdentifier,
                            }) => (
                              <button
                                className="btn btn-sm fw-bold btn-primary"
                                data-bs-toggle="modal"
                                data-bs-target="#kt_modal_new_target"
                                type="button"
                                onClick={previewRequisition}
                              >
                                {getPermissionDisplayName(
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                  "Continue"
                                )}
                              </button>
                            )}
                          </PermissionComponent>
                        ) : null}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <>
                            {
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="New Order"
                                permissionIdentifier="SaveForSignature"
                              >
                                {({
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                }) => (
                                  <button
                                    className="btn btn-sm fw-bold btn-info"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target"
                                    type="button"
                                    onClick={saveRequisitionForSignature}
                                    disabled={isSubmittingForSaveForSignature}
                                  >
                                    {getPermissionDisplayName(
                                      pageName,
                                      moduleName,
                                      permissionIdentifier,
                                      "Save for Authorized Signature"
                                    )}
                                  </button>
                                )}
                              </PermissionComponent>
                            }
                          </>
                        ) : null}
                        {location.state.status === "Missing Info" &&
                          !toggleRequisitionModal ? (
                          <>
                            {
                              <PermissionComponent
                                moduleName="Requisition"
                                pageName="New Order"
                                permissionIdentifier="SaveForLater"
                              >
                                {({
                                  pageName,
                                  moduleName,
                                  permissionIdentifier,
                                }) => (
                                  <button
                                    className="btn btn-sm fw-bold btn-warning"
                                    data-bs-toggle="modal"
                                    data-bs-target="#kt_modal_new_target"
                                    type="button"
                                    onClick={saveRequisitionForLater}
                                    disabled={isSubmittingForSaveForLater}
                                  >
                                    {getPermissionDisplayName(
                                      pageName,
                                      moduleName,
                                      permissionIdentifier,
                                      "Save For Later"
                                    )}
                                  </button>
                                )}
                              </PermissionComponent>
                            }
                          </>
                        ) : null}
                      </>
                    ) : (
                      <></>
                    )}
                    {toggleRequisitionModal ? (
                      <>
                        {workflowId ? null : (
                          <button
                            className="btn btn-sm fw-bold btn-cancel"
                            type="button"
                            onClick={() => {
                              setToggleRequisitionModal(false);
                              if (!toggleRequisitionModal) {
                                workflowId
                                  ? navigate("/MyFavorites")
                                  : navigate("/view-requisition");
                              }
                            }}
                            disabled={
                              isSubmittingForSave ||
                              isSubmittingForSaveForLater ||
                              isSubmittingForSaveForSignature
                            }
                          >
                            {toggleRequisitionModal ? t("Back") : t("Cancel")}
                          </button>
                        )}
                        <button
                          className="btn btn-sm fw-bold btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#kt_modal_new_target"
                          type="button"
                          disabled={isSubmittingForSave || hasInvalidDates}
                          onClick={saveRequisition}
                        >
                          {isSubmittingForSave ? t("Saving...") : t("Save")}
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                    {/* end */}
                  </div>
                )}
                <div className="col-lg-6 col-md-12 col-sm-12 col-sm-6 pb-4 grid-item grid-sizer"></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

function mapStateToProps(state: any, ownProps: any) {
  return { Requisition: state, User: state.Reducer };
}
export default connect(mapStateToProps)(SingleRequisition);
