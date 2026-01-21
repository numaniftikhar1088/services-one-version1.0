import { AxiosError, AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import useLang from "Shared/hooks/useLanguage";
import { IRequisitionInputs } from "../../../Interface/SingleRequisition";
import LoadButton from "../../../Shared/Common/LoadButton";
import Splash from "../../../Shared/Common/Pages/Splash";
import useYupForm from "../../../Shared/hooks/Requisition/useYupForm";
import useYupFormInfectiousData from "../../../Shared/hooks/Requisition/useYupFormInfectiousData";
import { formValuesForPatient } from "../../../Utils/Auth";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import {
  getValueFromSessionStorage,
  setValueIntoSessionStorage,
} from "../../../Utils/Common/CommonMethods";
import { countKeysWithValues } from "../../../Utils/Common/Requisition";
import { ValidateInput } from "../../../Utils/Requisition/Validation";
import SectionComp from "../../Patient/PatientDemographic/SectionComp";

export const DynamicFacility = () => {
  const { t } = useLang();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const pageId = queryParams.get("pageId");

  const [isShown, setIsShown] = useState<boolean>(true);
  const [Inputs, setInputs] = useState<IRequisitionInputs | any>();
  const [infectiousData, setInfectiousData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [formState, setFormState] = useState<any>();
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorFocussedInput, setErrorFocussedInput] = useState<any>();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref = useRef<any>(null);

  useEffect(() => {
    getInputs(id ?? 0);

    return () => {
      setInputs([]);
    };
  }, [id]);

  const getInputs = async (recordId: any) => {
    setLoading(true);
    let queryModel = {
      pageId: Number(pageId) || getValueFromSessionStorage("pageId"),
      id: Number(recordId),
    };
    await FacilityService.facilityDynamicCustomPage(queryModel)
      .then((res: AxiosResponse) => {
        let resCopy: any = [...res?.data];
        let inputsToShow = resCopy.filter((res: any) => res.isSelected);

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

  const savePatientInfo = async () => {
    try {
      setIsSaving(true);
      const formDataForApi = formValuesForPatient(Inputs);

      const { commonSections } = formDataForApi;
      const updateFieldValue = updateFieldValues(commonSections);
      const ObjToSend = {
        id: id ? Number(id) : 0,
        commonSections: updateFieldValue,
      };

      let validatedData = await submitForValidation(true, true);
      console.log(validatedData, 'validatedData')
      setInputsForValidation(validatedData?.data);
      let errorCount: any = await countKeysWithValues(
        validatedData?.validation
      );
      console.log(errorCount, "errorCount");
      
      setErrorFocussedInput(validatedData?.validation);
      if (errorCount !== 0) return;

      const response = await FacilityService.saveDynamicFacility(ObjToSend);

      if (response.data.statusCode === 200) {
        toast.success(response.data.responseMessage);
        navigate("/facilitylist");
        setValueIntoSessionStorage("pageId", response.data.redirectData.pageId);
      } else {
        toast.error(response.data.responseMessage);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

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
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id="DunamicFacilityCancelTop"
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    type="button"
                    onClick={() => navigate("/facilitylist")}
                  >
                    {t("Cancel")}
                  </button>
                  <LoadButton
                    name="DunamicFacilitySaveTop"
                    className="btn btn-sm fw-bold btn-primary"
                    btnText={Number(id ?? 0) ? t("Update") : t("Save")}
                    loadingText={t("Saving")}
                    loading={isSaving}
                    onClick={savePatientInfo}
                    id={"save"}
                  />
                </div>
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
                      errorFocussedInput={errorFocussedInput}
                      setErrorFocussedInput={setErrorFocussedInput}
                    />
                  </div>
                ))}
              <div
                className="d-flex p-2 justify-content-end align-items-center"
                style={{ position: "sticky", bottom: 0, right: 0 }}
              >
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    id="DunamicFacilityCancelBottom"
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    type="button"
                    onClick={() => navigate("/facilitylist")}
                  >
                    {t("Cancel")}
                  </button>
                  <LoadButton
                    name="DunamicFacilitySaveBottom"
                    className="btn btn-sm fw-bold btn-primary"
                    btnText={Number(id ?? 0) ? t("Update") : t("Save")}
                    loadingText={t("Saving")}
                    loading={isSaving}
                    onClick={savePatientInfo}
                    id="save"
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
