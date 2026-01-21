import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { styles } from "../../Utils/Common";
import { clearSignature } from "Utils/Auth";

const ProviderDropdown = (props: any) => {
  const inputElementReactSelect = useRef(props?.name);
  const [selectedProvider, setSelectedProvider] = useState(null);
  useEffect(() => {
    if (inputElementReactSelect.current) {
      if (props.errorFocussedInput === inputElementReactSelect.current.id) {
        inputElementReactSelect.current.focus();
      }
    }
  }, [props.errorFocussedInput]);

  useEffect(() => {
    if (props.physicianArr?.length === 1) {
      setSelectedProvider(props.physicianArr[0]);
      props.onProviderSelect(props.physicianArr[0]);
      sessionStorage.setItem("PhysicianID", props.physicianArr[0].value);
      sessionStorage.setItem("PhysicianName", props.physicianArr[0].label);
    }
  }, []);
  useEffect(() => {
    setSelectedProvider(props.selectedProviders);
  }, [props.selectedProviders]);

  const handleProviderSelect = async (selectedOption: any) => {
    setSelectedProvider(selectedOption);
    props.items.enableRule = "";
    props.onProviderSelect(selectedOption);
    clearSignature();

    const physicianIndex = props?.inputs.findIndex(
      (input: any) => input?.sectionId === 13
    );
    const updatedInputs = [...props?.inputs];

    if (physicianIndex != -1) {
      updatedInputs[physicianIndex].fields.map((i: any) => {
        i.defaultValue = "";
        i.signatureText = "";
      });
    }

    props.setPhysicianId(selectedOption?.value);
    sessionStorage.setItem("PhysicianID", selectedOption?.value);
    sessionStorage.setItem("PhysicianName", selectedOption?.label);
  };
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);
  return (
    <>
      <div id={props.name} ref={inputElementReactSelect} tabIndex={-1}></div>
      <Select
        menuPortalTarget={document.body}
        options={props.physicianArr}
        theme={(theme) => styles(theme)}
        value={selectedProvider}
        inputId={props.name}
        defaultValue={props.physicianArr}
        onChange={(e: any) => {
          handleProviderSelect(e)
        }}
        isSearchable={true}
        isDisabled={props?.providerNotRequired}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: "var(--kt-input-border-color)",
            color: "var(--kt-input-border-color)",
          }),
        }}
      />
    </>
  );
};

export default ProviderDropdown;
