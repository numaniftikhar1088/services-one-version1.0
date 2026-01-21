import { memo, useCallback, useEffect, useState, useRef } from "react";
import SignatureCanvas from "react-signature-canvas";
import useLang from "Shared/hooks/useLanguage";
import { TrashIcon } from "Shared/Icons";
import { assignFormValues } from "Utils/Auth";

interface Field {
  systemFieldName?: string;
  defaultValue: string | boolean;
  signatureText?: string;
}

interface Inputs {
  fields: Field[];
  dependencyControls: any;
}

interface InfectiousData {
  sections: Inputs[];
}

interface SignaturePadProps {
  Inputs: Inputs[];
  index: number;
  fieldIndex: number;
  depControlIndex?: number;
  name: string;
  error?: string;
  isDependency: boolean;
  repeatFieldSection: boolean;
  isDependencyRepeatFields: boolean;
  repeatFieldIndex?: number;
  repeatDependencySectionIndex?: number;
  repeatDepFieldIndex?: number;
  ArrayReqId?: string;
  infectiousData?: InfectiousData[];
  setInputs: (inputs: Inputs[]) => void;
  setInfectiousData?: (data: InfectiousData[]) => void;
  defaultValue: string;
  label: string;
  required: boolean;
  setErrorFocussedInput?: any;
  errorFocussedInput?: any;
}

const SignaturePad: React.FC<SignaturePadProps> = ({
  Inputs,
  index,
  fieldIndex,
  depControlIndex,
  name,
  error,
  isDependency,
  repeatFieldSection,
  isDependencyRepeatFields,
  repeatFieldIndex,
  repeatDependencySectionIndex,
  repeatDepFieldIndex,
  ArrayReqId,
  infectiousData,
  setInputs,
  setInfectiousData,
  defaultValue,
  label,
  required,
  setErrorFocussedInput,
  errorFocussedInput,
}) => {
  const { t } = useLang();
  const [signCanvas, setSignCanvas] = useState<SignatureCanvas | null>(null);

  const clear = () => {
    if (signCanvas) {
      signCanvas.clear();
      Inputs[index].fields.forEach((field) => {
        if (field.systemFieldName === name) {
          field.defaultValue = "";
          field.signatureText = "";
        }
      });
      Inputs[index].fields[fieldIndex].defaultValue = false;

      if (!ArrayReqId) {
        setInputs([...Inputs]);
      }
    }
  };

  const handleEndSignature = async () => {
    if (signCanvas) {
      const imageBase64 = signCanvas.toDataURL();
      await assignFormValues(
        Inputs,
        index,
        depControlIndex,
        fieldIndex,
        imageBase64,
        isDependency,
        repeatFieldSection,
        isDependencyRepeatFields,
        repeatFieldIndex,
        repeatDependencySectionIndex,
        repeatDepFieldIndex,
        undefined,
        setInputs
      );
    }
  };

  useEffect(() => {
    if (defaultValue && signCanvas) {
      const currentSignature = signCanvas.toDataURL();
      if (currentSignature !== defaultValue) {
        signCanvas.fromDataURL(defaultValue);
      }
    }
  }, [defaultValue, signCanvas]);

  const setCanvasRef = useCallback((node: SignatureCanvas | null) => {
    if (node !== null) {
      setSignCanvas(node);
    }
  }, []);

  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    setErrorFocussedInput && setErrorFocussedInput();
  }, [errorFocussedInput]);
  return (
    <div className="overflow-hidden" ref={divElement}>
      <p className={required ? "required mb-2 fw-500" : "mb-2 fw-500"}>
        {t(label)}
      </p>
      <SignatureCanvas
        maxWidth={2}
        penColor="black"
        ref={setCanvasRef}
        onEnd={handleEndSignature}
        clearOnResize={false}
        canvasProps={{
          width: 500,
          height: 200,
          style: {
            backgroundColor: "#F3F6F9",
          },
          id: name,
        }}
      />
      {error && (
        <div className="form__error">
          <span>{t(error)}</span>
        </div>
      )}
      <div>
        <button
          onClick={clear}
          className="mt-3 mb-3 btn btn-primary btn-sm px-4 mx-2 p-2"
          id={"clearSignature"}
        >
          <TrashIcon />
          {t("Clear")}
        </button>
      </div>
    </div>
  );
};

export default memo(SignaturePad);
