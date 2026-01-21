import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IntegrationStepper from "./Components/IntegrationStepper";
import TubeTypeIndex from "./Credential";
import CompendiumMappingTab from "./CompendiumMapping";
import SetupStep from "./Setup/SetupStep";
import useLang from "Shared/hooks/useLanguage";
import BreadCrumbs from "Utils/Common/Breadcrumb";

export const AddNewIntegration = () => {
  const { t } = useLang();
  const { id } = useParams();
  const navigate = useNavigate();
  const masterIntegrationId = id ? parseInt(id, 10) : null;

  const steps = [
    { id: "credential", label: t("Credential") },
    { id: "compendium", label: t("Compendium") },
    { id: "setup", label: t("Setup") },
  ];
  const [currentStep, setCurrentStep] = useState<number>(0);
  
  // Persist selected message format ID across step navigation
  const [selectedMessageFormatId, setSelectedMessageFormatId] = useState<
    number | null
  >(null);

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      return;
    }

    // On last step, navigate to marketplace
    console.log("Submitting integration");
    navigate("/marketplace");
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const renderStepContent = () => {
    switch (steps[currentStep].id) {
      case "credential":
        return <TubeTypeIndex />;
      case "compendium":
        return <CompendiumMappingTab />;
      case "setup":
      default:
        return (
          <SetupStep
            masterIntegrationId={masterIntegrationId}
            selectedMessageFormatId={selectedMessageFormatId}
            onMessageFormatChange={setSelectedMessageFormatId}
          />
        );
    }
  };

  return (
    <>
      {/* Breadcrumb navigation */}
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <div
              className="card shadow-xl d-flex flex-column"
              style={{ minHeight: "70vh" }}
            >
              <div
                className="card-header d-flex justify-content-between align-items-center"
                style={{
                  position: "sticky",
                  top: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  height: "50px",
                }}
              >
                <div className="card-title mb-0">
                  <span
                    className="card-label fw-medium text-dark fs-6"
                    style={{
                      fontFamily: "Poppins",
                    }}
                  >
                    {steps[currentStep].label}
                  </span>
                </div>
                <IntegrationStepper steps={steps} currentStep={currentStep} />
              </div>
              <div className="card-body py-md-4 py-3 flex-grow-1 overflow-auto">
                {renderStepContent()}
              </div>
              <div
                className="card-footer d-flex justify-content-end gap-2"
                style={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 10,
                  backgroundColor: "#fff",
                  borderTop: "1px solid #e4e6ea",
                }}
              >
                <button className="btn btn-secondary" onClick={handlePrevStep}>
                  {t("Back")}
                </button>
                <button
                  className="btn btn-primary btn-primary--icon px-7"
                  onClick={handleNextStep}
                >
                  <span>
                    {currentStep === steps.length - 1 ? t("Submit") : t("Next")}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
