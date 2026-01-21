import { AxiosError, AxiosResponse } from "axios";
import SectionComp from "Pages/Requisition/SingleRequisition/SectionComp";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FacilityService from "Services/FacilityService/FacilityService";
import { IRequisitionInputs } from "../../../Interface/SingleRequisition";
import { setSelectedRequisitionData } from "../../../Redux/Actions/Pages/Requisition";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import LoadButton from "../../../Shared/Common/LoadButton";
import Splash from "../../../Shared/Common/Pages/Splash";
import useYupForm from "../../../Shared/hooks/Requisition/useYupForm";
import useYupFormInfectiousData from "../../../Shared/hooks/Requisition/useYupFormInfectiousData";
import { formValuesForPatient } from "../../../Utils/Auth";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { setValueIntoSessionStorage } from "../../../Utils/Common/CommonMethods";
import { countKeysWithValues } from "../../../Utils/Common/Requisition";
import { ValidateInput } from "../../../Utils/Requisition/Validation";
import useLang from "Shared/hooks/useLanguage";

const AddFacility = () => {
  const [isShown, setIsShown] = useState<boolean>(true);
  const [Inputs, setInputs] = useState<IRequisitionInputs | any>();
  const [infectiousData, setInfectiousData] = useState<any>([]);
  const [formData, setFormData] = useState<any>({});
  const [formState, setFormState] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const { t } = useLang();
  const location = useLocation();
  const { patientId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    let id = atob(patientId ?? "");
    if (id) {
      getInputs(id);
    } else {
      getInputs();
    }
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
      pageId: 3,
      id: patientId ? Number(patientId) : 0,
    };
    await RequisitionType?.GetCommonSectionForPatient(queryModel)
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

  const savePatientInfo = async (patientId?: string) => {
    try {
      const formDataForApi = formValuesForPatient(Inputs);

      const { commonSections } = formDataForApi;
      const updateFieldValue = updateFieldValues(commonSections);
      const ObjToSend = {
        id: patientId ? Number(patientId) : 0,
        commonSections: updateFieldValue,
      };

      let validatedData = await submitForValidation(true, true);
      setInputsForValidation(validatedData?.data);
      let errorCount: any = await countKeysWithValues(
        validatedData?.validation
      );

      if (errorCount !== 0) return;

      const response = await FacilityService.saveDynamicFacility(ObjToSend);
      if (response.data.statusCode === 409) {
        toast.error(response.data.responseMessage);
      }
      if (response.data) {
        if (response.data) {
          setValueIntoSessionStorage(
            "pageId",
            response.data.redirectData.pageId
          );
          navigate(response.data.redirectData.pageUrl);
        }
      }
      toast.success(response.data.responseMessage);
    } catch (error) {
      console.error(error);
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
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    type="button"
                    onClick={() => navigate("/patient-demographics-list")}
                  >
                    Cancel
                  </button>
                  <LoadButton
                    className="btn btn-sm fw-bold btn-primary"
                    btnText="Save"
                    loadingText={t("Saving")}
                    onClick={() => savePatientInfo(atob(patientId ?? ""))}
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
                    />
                  </div>
                ))}
              <div
                className="d-flex p-2 justify-content-end align-items-center"
                style={{ position: "sticky", bottom: 0, right: 0 }}
              >
                <div className="d-flex align-items-center gap-2 gap-lg-3">
                  <button
                    className="btn btn-secondary btn-sm fw-bold "
                    aria-controls="SearchCollapse"
                    aria-expanded="true"
                    type="button"
                    onClick={() => navigate("/patient-demographics-list")}
                  >
                    Cancel
                  </button>
                  <LoadButton
                    className="btn btn-sm fw-bold btn-primary"
                    btnText="Save"
                    loadingText={t("Saving")}
                    onClick={() => savePatientInfo(atob(patientId ?? ""))}
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

export default AddFacility;
