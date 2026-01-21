import React from "react";

export type StepConfig = {
  label: string;
};

type IntegrationStepperProps = {
  steps: StepConfig[];
  currentStep: number;
};

const IntegrationStepper: React.FC<IntegrationStepperProps> = ({
  steps,
  currentStep,
}) => {
  const renderStatus = (index: number) => {
    const isCompleted = index < currentStep;
    const isActive = index === currentStep;

    if (isCompleted) {
      return { completed: true, active: false };
    }

    if (isActive) {
      return { completed: false, active: true };
    }

    return { completed: false, active: false };
  };

  return (
    <div className="d-flex align-items-center gap-3">
      {steps.map((step, index) => {
        const { completed, active } = renderStatus(index);

        return (
          <React.Fragment key={step.label}>
            {/* Step Item */}
            <div className="d-flex align-items-center gap-2">
            {/* Step Number Circle */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle"
              style={{
                width: "32px",
                height: "32px",
                fontWeight: "600",
                fontSize: "14px",
                fontFamily: "Poppins, sans-serif",
                lineHeight: "1.25",
                backgroundColor: completed
                  ? "#D2E4C9"
                  : active
                  ? "#69A54B"
                  : "#EBEDF3",
                color: completed
                  ? "#198754"
                  : active
                  ? "white"
                  : "#6c757d",
              }}
            >
              {completed ? (
                <i className="fas fa-check"></i>
              ) : (
                index + 1
              )}
            </div>

              {/* Step Label */}
              <span
                className={`${active ? "fw-bold text-dark" : "text-muted"}`}
                style={{
                  fontSize: "14px",
                  fontFamily: "Poppins, sans-serif",
                  lineHeight: "1.25",
                  fontWeight: active ? undefined : 400,
                }}
              >
                {step.label}
              </span>
            </div>

            {/* Connector Line - don't show after last step */}
            {index < steps.length - 1 && (
              <div
                style={{
                  height: "2px",
                  width: "40px",
                  minWidth: "40px",
                  backgroundColor: completed ? "#D2E4C9" : "#EBEDF3",
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default IntegrationStepper;