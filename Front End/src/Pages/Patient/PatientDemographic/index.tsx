import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { IRequisitionInputs } from "../../../Interface/SingleRequisition";
import { setSelectedRequisitionData } from "../../../Redux/Actions/Pages/Requisition";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import Splash from "../../../Shared/Common/Pages/Splash";
import useYupForm from "../../../Shared/hooks/Requisition/useYupForm";
import useYupFormInfectiousData from "../../../Shared/hooks/Requisition/useYupFormInfectiousData";
import { formValuesForPatient } from "../../../Utils/Auth";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { setValueIntoSessionStorage } from "../../../Utils/Common/CommonMethods";
import { countKeysWithValues } from "../../../Utils/Common/Requisition";
import { ValidateInput } from "../../../Utils/Requisition/Validation";
import SectionComp from "./SectionComp";
import { useBilling } from "Shared/hooks/useBilling";
import useLang from "Shared/hooks/useLanguage";
import LayoutButtons from "../../DynamicForm/LayoutButtons";
import PatientServices from "../../../Services/PatientServices/PatientServices";

const AddPatient = () => {
  const [disableCheckbox, setDisableCheckbox] = useState(false);
  const [ins, setIns] = useState(false);
  const [isShown, setIsShown] = useState<boolean>(true);
  const [Inputs, setInputs] = useState<IRequisitionInputs | any>();
  const [infectiousData, setInfectiousData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [formState, setFormState] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [checkbox, setCheckbox] = useState(false);

  const [errorFocussedInput, setErrorFocussedInput] = useState<any>();
  const [layoutButtons, setLayoutButtons] = useState<any>([]);
  const [showButton, setShowButton] = useState(true);
  const [previewData, setPreviewData] = useState<any>("");
  const [isSaving, setIsSaving] = useState<boolean>(false);


  const { clearBillingInfo } = useBilling();
  const { patientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useLang();

  useEffect(() => {
    const navigationEntries = performance.getEntriesByType(
      "navigation"
    ) as PerformanceNavigationTiming[];
    if (
      navigationEntries.length > 0 &&
      navigationEntries[0].type === "reload"
    ) {
      clearBillingInfo();
    }
  }, []);
  useEffect(() => {
    let id = atob(patientId ?? "");
    if (id) {
      getInputs(id);
    } else {
      getInputs();
    }

    return () => {
      setInputs([]);
    };
  }, [patientId]);

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

  const getInputs = async (patientId?: string) => {
    setLoading(true);
    let queryModel = {
      pageId: 19,
      id: patientId ? Number(patientId) : 0,
    };
    await RequisitionType?.GetCommonSectionForPatient(queryModel)
      .then((res: AxiosResponse) => {
        let resCopy: any = [...res?.data?.allPageSections];
        let inputsToShow = resCopy.filter((res: any) => res.isSelected);
        setLayoutButtons(res?.data?.formActionButton);
        setInputs(inputsToShow);
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() => setLoading(false));
  };

  const {
    inputsForValidation,
    setInputsForValidation,
    submitForValidation,
  }: any = useYupForm(Inputs, ValidateInput);

  const { inputDataInputsForValidation, setInfectiousDataInputsForValidation } =
    useYupFormInfectiousData(infectiousData, setInfectiousData);

  const updateFieldValues = (sections: any) => {
    return sections.map((section: any) => {
      const updatedFields = section.fields
        .map((field: any) => {
          return {
            ...field,
            Value: field.fieldValue,
          };
        })
        .map((field: any) => {
          const { fieldValue, ...rest } = field;
          return rest;
        });

      return {
        ...section,
        fields: updatedFields,
      };
    });
  };

  const savePatientInfo = async (
    fieldsToValidate: string[] = [],
    apiCallFunction?: (payload: any) => any
  ) => {
    setIsSaving(true);
    try {
      const formDataForApi = formValuesForPatient(Inputs);
      const { commonSections } = formDataForApi;
      setPreviewData(commonSections);
      const updateFieldValue = updateFieldValues(commonSections);
      const ObjToSend = {
        id: patientId ? Number(atob(patientId ?? "")) : 0,
        commonSections: updateFieldValue,
      };
      let validatedData = await submitForValidation(true, true);
      setInputsForValidation(validatedData?.data);
      setErrorFocussedInput(validatedData?.validation);
      let errorCount: any = await countKeysWithValues(
        validatedData?.validation
      );
      if (errorCount !== 0) {
        setIsSaving(false);
        return;
      }

      let response;
      if (apiCallFunction) {
        response = await apiCallFunction(ObjToSend);
      } else {
        response = await RequisitionType.saveCommonSectionForPatient(
          ObjToSend
        );
      }

      if (response.data.statusCode === 409) {
        toast.error(response.data.responseMessage);
        setIsSaving(false);
        return;
      }
      if (response.data) {
        if (response.data.redirectData) {
          setValueIntoSessionStorage(
            "pageId",
            response.data.redirectData.pageId
          );
          navigate(`${response.data.redirectData.pageUrl}/${window.btoa(response.data.redirectData.pageId)}`, {
            replace: true,
          });
        }
      }
      toast.success(response.data.responseMessage);
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    localStorage.removeItem("insurnceID");
    localStorage.removeItem("insuranceDataID");
    localStorage.removeItem("facilityID");
    localStorage.removeItem("insuranceOptionId");
    sessionStorage.removeItem("billingInsurances");
  }, []);

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
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div
              id="kt_app_content_container"
              className="app-container container-fluid req-preview-wrapper"
            >
              <div
                className="d-flex p-2 justify-content-between align-items-center"
                style={{ position: "sticky", top: 0, right: 20 }}
              >
                <div>
                  <BreadCrumbs />
                </div>
                <LayoutButtons
                  Inputs={Inputs}
                  setPreviewData={setPreviewData}
                  buttons={layoutButtons}
                  savePatientInfo={savePatientInfo}
                  setShowPreviewPage={() => { }}
                  previewExists={false}
                  isSaving={isSaving}
                />
              </div>
              {Array.isArray(inputsForValidation) &&
                inputsForValidation?.map((section, index: number) => (
                  <div
                    className={`${section.displayType} mb-2 ${section.cssStyle}`}
                  >
                    <SectionComp
                      Section={section}
                      Inputs={inputsForValidation}
                      setInputs={setInputs}
                      index={index}
                      isShown={!isShown}
                      setIsShown={setIsShown}
                      pageId={location?.state?.data?.id}
                      formData={formData}
                      setFormData={setFormData}
                      formState={formState}
                      setFormState={setFormState}
                      infectiousData={infectiousData}
                      setInfectiousData={setInfectiousData}
                      inputDataInputsForValidation={
                        inputDataInputsForValidation
                      }
                      setInfectiousDataInputsForValidation={
                        setInfectiousDataInputsForValidation
                      }
                      setInputsForValidation={setInputsForValidation}
                      editID={location?.state?.reqId}
                      disableCheckbox={disableCheckbox}
                      setDisableCheckbox={setDisableCheckbox}
                      ins={ins}
                      setIns={setIns}
                      patientId={patientId}
                      showButton={showButton}
                      setShowButton={setShowButton}
                      checkbox={checkbox}
                      errorFocussedInput={errorFocussedInput}
                      setErrorFocussedInput={setErrorFocussedInput}
                      setCheckbox={setCheckbox}
                    />
                  </div>
                ))}
              <div
                className="d-flex p-2 justify-content-end align-items-center"
                style={{ position: "sticky", bottom: 0, right: 0 }}
              >
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <LayoutButtons
                    Inputs={Inputs}
                    setPreviewData={setPreviewData}
                    buttons={layoutButtons}
                    savePatientInfo={savePatientInfo}
                    setShowPreviewPage={() => { }}
                    previewExists={false}
                    isSaving={isSaving}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AddPatient;
