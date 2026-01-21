import { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { styles } from "../../Utils/Common";
const FacilityDropdown = (props: any) => {
  const inputElementReactSelect = useRef(props?.name);
  const [selectedFacility, setSelectedFacility] = useState(null);
  useEffect(() => {
    if (inputElementReactSelect.current && props._adminType != 2) {
      if (props.errorFocussedInput === inputElementReactSelect.current.id) {
        inputElementReactSelect.current.focus();
      }
    }
  }, [props.errorFocussedInput]);
  useEffect(() => {
    if (props.facilityList?.length === 1) {
      setSelectedFacility(props.facilityList[0]);
      props.onFacilitySelect(props.facilityList[0]);
    }
  }, []);

  useEffect(() => {
    setSelectedFacility(props.selectedFacilities);
  }, [props.selectedFacilities]);
  const handleFacilitySelect = (selectedOption: any) => {
    props.items.enableRule = "";
    setSelectedFacility(selectedOption);
    props.onFacilitySelect(selectedOption);
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
    <div id={props.name} tabIndex={-1}>
      {props._adminType != 2 && (
        <Select
          menuPortalTarget={document.body}
          ref={inputElementReactSelect}
          options={props.facilityList}
          inputId={props.name}
          theme={(theme) => styles(theme)}
          value={selectedFacility}
          onChange={handleFacilitySelect}
          isSearchable={true}
          styles={{
            control: (baseStyles, state) => ({
              ...baseStyles,
              borderColor: "var(--kt-input-border-color)",
              color: "var(--kt-input-border-color)",
            }),
          }}
        />
      )}
    </div>
  );
};

export default FacilityDropdown;
