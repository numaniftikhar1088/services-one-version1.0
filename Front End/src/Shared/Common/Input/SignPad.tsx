import { setPhysicianSignature } from "Redux/Actions/Index";
import { FindIndex } from "Utils/Common/CommonMethods";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { assignFormValues, Decrypt } from "../../../Utils/Auth";
import { TrashIcon } from "../../Icons";
import useLang from "./../../hooks/useLanguage";

const SignPad = (props: any) => {

  const { t } = useLang();
  const dispatch = useDispatch();
  const userTKN = sessionStorage.getItem("userinfo");
  const DECRYPTED_TKN = Decrypt(userTKN);
  const userInfo = JSON?.parse(DECRYPTED_TKN);
  const location = useLocation();
  const signCanvas = useRef(
    props?.sysytemFieldName + props?.controlId
  ) as React.MutableRefObject<any>;
  const clear = () => {
    if (signCanvas?.current) {
      signCanvas?.current?.clear();
      props?.Inputs[props.index].fields.forEach((Innerfields: any) => {
        if (Innerfields?.systemFieldName === props.name) {
          Innerfields.defaultValue = "";
          Innerfields.signatureText = "";
        }
      });
      props.Inputs[props.index].fields[props.fieldIndex - 1].defaultValue = "";
      props.Inputs[props.index].fields[props.fieldIndex - 1].defaultValue =
        false;

      props.Inputs[props.index].fields[props.fieldIndex - 1].options.map(
        (i: any) => {
          i.isSelectedDefault = false;
        }
      );

      if (!props?.ArrayReqId) {
        props.setInputs([...props.Inputs]);
      }
      signCanvas?.current?.on();
    }
    props?.Inputs[props.index].fields.forEach((Innerfields: any) => {
      Innerfields.defaultValue = "";
      Innerfields.signatureText = "";
    });
  };
  useEffect(() => {
    if (props.defaultValue === "clear") {
      clear();
    }
    if (props?.defaultValue && !location?.state?.reqId) {
      if (props?.defaultValue?.includes("data:image/png;base64,")) {
        signCanvas?.current?.clear();
        TextAssign(props.defaultValue);
      }
    } else {
      if (props?.defaultValue?.includes("data:image/png;base64,")) {
        TextAssign(props?.defaultValue);
      }
    }
  }, [props?.padValue]);

  useEffect(() => {
    const handleCustomEvent = () => {
      clear();
    };
    // Listen to the custom event
    document.addEventListener("clearSignature", handleCustomEvent);

    // Cleanup listener when component unmounts
    return () => {
      document.removeEventListener("clearSignature", handleCustomEvent);
    };
  }, []);
  const TextAssign = async (padVal?: any) => {
    signCanvas?.current?.clear();
    if (props.defaultValue && props.defaultValue.length > 200) {
      if (location?.state?.reqId) {
        let newInputs = await assignFormValues(
          props.Inputs,
          props.index,
          props.depControlIndex,
          props.fieldIndex,
          padVal,
          props.isDependency,
          props.repeatFieldSection,
          props.isDependencyRepeatFields,
          props.repeatFieldIndex,
          props.repeatDependencySectionIndex,
          props.repeatDepFieldIndex,
          undefined,
          props?.setInputs
        );
        if (props?.ArrayReqId) {
          let infectiousDataCopy = JSON?.parse(
            JSON?.stringify(props?.infectiousData)
          );
          infectiousDataCopy[
            FindIndex(props?.infectiousData, props?.ArrayReqId)
          ].sections = newInputs;
          props?.setInfectiousData([...infectiousDataCopy]);
        } else {
          props?.setInputs(newInputs);
        }
      }
      setTimeout(() => {
        signCanvas?.current?.clear();
        signCanvas?.current?.fromDataURL(padVal);
      });
      signCanvas?.current?.off();
    }
  };

  const handleEndSignature = async () => {
    const imageBase64 = signCanvas?.current?.toDataURL();
    let newInputs = await assignFormValues(
      props.Inputs,
      props.index,
      props.depControlIndex,
      props.fieldIndex,
      imageBase64,
      props.isDependency,
      props.repeatFieldSection,
      props.isDependencyRepeatFields,
      props.repeatFieldIndex,
      props.repeatDependencySectionIndex,
      props.repeatDepFieldIndex,
      undefined,
      props?.setInputs
    );

    if (props?.ArrayReqId) {
      let infectiousDataCopy = JSON?.parse(
        JSON?.stringify(props?.infectiousData)
      );
      infectiousDataCopy[
        FindIndex(props?.infectiousData, props?.ArrayReqId)
      ].sections = newInputs;
      props?.setInfectiousData([...infectiousDataCopy]);
    } else {
      props.setInputs(newInputs);
    }
  };
  const [phyId, setPhyId] = useState(sessionStorage.getItem("PhysicianID"));
  useEffect(() => {
    const intervalId = setInterval(() => {
      const currentPhyId = sessionStorage.getItem("PhysicianID");
      if (currentPhyId !== phyId) {
        setPhyId(currentPhyId);
      }
    }, 100);
    return () => {
      clearInterval(intervalId);
    };
  }, [phyId]);

  useEffect(() => {
    if (!phyId) return;

    const fetchPhysicianSignature = async () => {
      const obj = {
        user_id: userInfo?.userId,
        physician_id: phyId,
      };
      try {
        const res = await RequisitionType.GetPhysicianSignature(obj);
        if (props.name === "PhysicianSignature") {
          // if (res?.data) PreSelected(res.data);
          // if (!location?.state?.reqId && !res?.data) clear();

          if (res.data) {
            dispatch(setPhysicianSignature(res?.data));
          } else {
            dispatch(setPhysicianSignature(null));
          }
        }
      } catch (error) {
        console.error("Failed to fetch physician signature", error);
      }
    };
    fetchPhysicianSignature();
  }, [phyId]);

  const currentPad = props.Inputs[props.index].fields[props.fieldIndex];

  useEffect(() => {
    if (currentPad) {
      signCanvas.current.fromDataURL(currentPad.signatureText);
    }
  }, [currentPad]);

  // added refresh page state
  useEffect(() => {
    const navigationType = window.performance?.navigation?.type;
    if (navigationType === 1) {
      sessionStorage.removeItem("PhysicianID");
      dispatch(setPhysicianSignature(null));
    }
  }, []);
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);
  return (
    <>
      <div className="overflow-hidden" ref={divElement}>
        <SignatureCanvas
          penColor="black"
          canvasProps={{
            height: 200,
            className: "signatureCanvas",
            style: { backgroundColor: "#F3F6F9", width: "100%" },
            id: props.name,
          }}
          ref={signCanvas}
          onEnd={() => {
            handleEndSignature();
            props.fields.enableRule = "";
          }}
        />
      </div>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
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
    </>
  );
};

export default SignPad;
