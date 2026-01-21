import { AxiosError, AxiosResponse } from "axios";
import SectionComp from "Pages/Requisition/SingleRequisition/SectionComp";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import PatientServices from "Services/PatientServices/PatientServices";
import useLang from "Shared/hooks/useLanguage";
import { IRequisitionInputs } from "../../Interface/SingleRequisition";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import Splash from "../../Shared/Common/Pages/Splash";
import useYupForm from "../../Shared/hooks/Requisition/useYupForm";
import useYupFormInfectiousData from "../../Shared/hooks/Requisition/useYupFormInfectiousData";
import { formValuesForPatient } from "../../Utils/Auth";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import {
  getValueFromSessionStorage,
  setValueIntoSessionStorage,
} from "../../Utils/Common/CommonMethods";
import { countKeysWithValues } from "../../Utils/Common/Requisition";
import { ValidateInput } from "../../Utils/Requisition/Validation";
import LayoutButtons from "./LayoutButtons";
import Preview from "./Preview/Preview";

interface PreviewPageI {
  exists: boolean;
  showPreviewPage: boolean;
}

export const DynamicForm = () => {
  const { pageId } = useParams();

  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");

  const [showButton, setShowButton] = useState(true);
  const [isShown, setIsShown] = useState<boolean>(true);
  const [Inputs, setInputs] = useState<IRequisitionInputs | {}>({});
  const [infectiousData, setInfectiousData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [formState, setFormState] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [layoutButtons, setLayoutButtons] = useState<any>([]);
  const [previewData, setPreviewData] = useState<any>("");
  const [previewPage, setPreviewPage] = useState<PreviewPageI>({
    exists: false,
    showPreviewPage: false,
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getInputs(id);

    return () => {
      setInputs({});
    };
  }, [pageId]);

  const getInputs = async (id: string | null = "0") => {
    setLoading(true);

    const formId = location.pathname.split("/");

    let queryModel = {
      pageId: window.atob(formId?.[2]) || getValueFromSessionStorage("pageId"),
      id: Number(id),
    };
    await RequisitionType?.loadDynamicCustomForm(queryModel)
      .then((res: AxiosResponse) => {
        let resCopy: any = [...res?.data?.allPageSections];

        setLayoutButtons(res?.data?.formActionButton);
        setPreviewPage({
          exists: res?.data?.isPreviewScreen,
          showPreviewPage: false,
        });

        let inputsToShow = resCopy.filter((res: any) => res.isSelected);

        setInputs(inputsToShow);
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() => setLoading(false));
  };

  const {
    inputsForValidation,
    setInputsForValidation,
    submitPayloadForValidation,
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
    apiCallFunction: (payload: any) => any
  ) => {
    setIsSaving(true);
    try {
      const formDataForApi = formValuesForPatient(Inputs);

      const { commonSections } = formDataForApi;
      setPreviewData(commonSections);

      const updateFieldValue = updateFieldValues(commonSections);
      const ObjToSend = {
        id: id ? +id : 0,
        commonSections: updateFieldValue,
      };

      let validatedData = await submitPayloadForValidation(
        fieldsToValidate,
        true
      );

      setInputsForValidation(validatedData?.data);
      let errorCount: any = await countKeysWithValues(
        validatedData?.validation
      );

      if (errorCount !== 0) {
        setIsSaving(false);
        return;
      }

      const response = await apiCallFunction(ObjToSend);

      if (response.data) {
        setValueIntoSessionStorage("pageId", response.data.redirectData.pageId);
        navigate(
          `${response.data.redirectData.pageUrl}/${window.btoa(
            response.data.redirectData.pageId
          )}`
        );
      }
      toast.success(response.data.responseMessage);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const onSave = () => {
    const saveButtonAction = layoutButtons.find(
      (btn: any) => btn.actionName === "Continue Button"
    );

    if (saveButtonAction) {
      const apiCall = async (payload: any) => {
        return await PatientServices.makeApiCallForDynamicGrid(
          saveButtonAction.actionUrl,
          saveButtonAction.methodType,
          { actionName: saveButtonAction.actionName, ...payload }
        );
      };

      savePatientInfo([], apiCall);
    }
  };

  return (
    <>
      {loading ? (
        <div
          style={{ height: "fit-content" }}
          className="d-flex justify-content-center align-items-center"
        >
          <Splash />
        </div>
      ) : (
        <div className="d-flex flex-column flex-column-fluid">
          <div id="kt_app_content" className="app-content flex-column-fluid">
            <div
              id="kt_app_content_container"
              className="app-container container-fluid req-preview-wrapper row"
            >
              <div className="d-flex p-2 justify-content-between align-items-center">
                <BreadCrumbs />
                {!previewPage.showPreviewPage ? (
                  <LayoutButtons
                    Inputs={Inputs}
                    setPreviewData={setPreviewData}
                    buttons={layoutButtons}
                    savePatientInfo={savePatientInfo}
                    setShowPreviewPage={setPreviewPage}
                    previewExists={previewPage.exists}
                    isSaving={isSaving}
                  />
                ) : (
                  <PreviewRequisitionsButtons
                    onSave={onSave}
                    setShowPreviewPage={setPreviewPage}
                  />
                )}
              </div>
              {previewPage.showPreviewPage ? (
                <Preview previewData={previewData} />
              ) : (
                Array.isArray(inputsForValidation) &&
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
                      showButton={showButton}
                      setShowButton={setShowButton}
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
                    />
                  </div>
                ))
              )}
              {!previewPage.showPreviewPage ? (
                <div
                  className="d-flex p-2 justify-content-end align-items-center"
                  style={{ position: "sticky", bottom: 10, right: 0 }}
                >
                  <div className="d-flex align-items-center gap-2 gap-lg-3">
                    <LayoutButtons
                      Inputs={Inputs}
                      buttons={layoutButtons}
                      setPreviewData={setPreviewData}
                      savePatientInfo={savePatientInfo}
                      setShowPreviewPage={setPreviewPage}
                      previewExists={previewPage.exists}
                      isSaving={isSaving}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const PreviewRequisitionsButtons = ({ onSave, setShowPreviewPage }: any) => {
  const { t } = useLang();

  return (
    <div className="d-flex align-items-center mt-3 justify-content-end gap-2 gap-lg-3">
      <button
        className="btn btn-sm fw-bold btn-primary"
        data-bs-toggle="modal"
        data-bs-target="#kt_modal_new_target"
        type="button"
        onClick={() => onSave()}
      >
        {t("Save")}
      </button>
      <button
        className="btn btn-sm fw-bold btn-cancel"
        onClick={() =>
          setShowPreviewPage((prev: any) => ({
            ...prev,
            showPreviewPage: false,
          }))
        }
      >
        {"Back"}
      </button>
    </div>
  );
};
