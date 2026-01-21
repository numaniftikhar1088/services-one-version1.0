import { useEffect, useRef, useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import { assignFormValues } from "../../../Utils/Auth";
import { useLocation } from "react-router-dom";

const AdditionalTest = (props: any) => {
  const { t } = useLang();
  function FindIndex(arr: any[], rid: any) {
    return arr.findIndex((i: any) => i.reqId === rid);
  }
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOption, setSelectedOption] = useState("");
  const [displayOptions, setDisplayOptions] = useState<any>(
    props.panels[0]?.testOptions.filter(
      (option: any) => option?.isSelected === true
    )
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const handleSearch = (e: any) => {
    setSearchTerm(e.target.value);
  };
  const location = useLocation();
  useEffect(() => {
    // Define an async function within useEffect
    const handleFormValues = async () => {
      const array = [
        {
          ...props.panels[0],
          isSelected: true,
          testOptions: displayOptions,
        },
      ];
      try {
        // Assign form values and await the response
        const newInputs = await assignFormValues(
          props?.Inputs,
          props?.index,
          props?.depControlIndex,
          props?.fieldIndex,
          array,
          props?.isDependency,
          props?.repeatFieldSection,
          props?.isDependencyRepeatFields,
          props?.repeatFieldIndex,
          props?.repeatDependencySectionIndex,
          props?.repeatDepFieldIndex,
          undefined,
          props?.setInputs
        );

        // Update infectious data
        const infectiousDataCopy = [...props?.infectiousData];
        const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
        infectiousDataCopy[index] = {
          ...infectiousDataCopy[index],
          sections: newInputs,
        };
        props?.setInfectiousData(infectiousDataCopy);
      } catch (error) {
        console.error("Error assigning form values:", error);
      }
    };
    if (location?.state?.reqId) {
      handleFormValues();
    }
  }, []);
  const handleOptionClick = async (option: any) => {
    const obj = {
      testID: option?.testID,
      testName: option?.testName,
      testCode: option?.testCode,
      specimenType: option?.specimenType,
      specimenTypeId: option?.specimenTypeId,
      panelType: option?.panelType,
      correspondingPanelID: option?.correspondingPanelID,
      isSelected: true,
    };
    props.fields.enableRule = "";
    setDisplayOptions((prevOptions: any[]) => {
      const optionExists = prevOptions.some(
        (displayedOption: any) => displayedOption.testName === option.testName
      );
      return optionExists ? prevOptions : [...prevOptions, obj];
    });
    const array = [
      {
        ...props.panels[0],
        isSelected: true,
        testOptions: [
          ...displayOptions.filter((option: any) => option.isSelected),
          obj,
        ],
      },
    ];
    setSelectedOption(option.testName);
    setIsDropdownOpen(false);
    try {
      const newInputs = await assignFormValues(
        props?.Inputs,
        // props?.dependenceyControls,
        props?.index,
        props?.depControlIndex,
        props?.fieldIndex,
        array,
        props?.isDependency,
        props?.repeatFieldSection,
        props?.isDependencyRepeatFields,
        props?.repeatFieldIndex,
        props?.repeatDependencySectionIndex,
        props?.repeatDepFieldIndex,
        undefined,
        props?.setInputs
      );
      const infectiousDataCopy = [...props?.infectiousData];
      const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
      infectiousDataCopy[index] = {
        ...infectiousDataCopy[index],
        sections: newInputs,
      };

      props?.setInfectiousData(infectiousDataCopy);
    } catch (error) {
      console.error("Error assigning form values:", error);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const filteredOptions = props?.panels[0]?.testOptions?.filter((option: any) =>
    option?.testName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const handleselectedCheckbox = async (option: any) => {
    setDisplayOptions((prevOptions: any[]) => {
      const updatedOptions = prevOptions.filter(
        (i: any) => option?.testID !== i?.testID
      );
      const array = [
        {
          ...props.panels[0],
          isSelected: true,
          testOptions: updatedOptions,
        },
      ];
      const processUpdate = async () => {
        try {
          const newInputs = await assignFormValues(
            props?.Inputs,
            props?.index,
            props?.depControlIndex,
            props?.fieldIndex,
            array,
            props?.isDependency,
            props?.repeatFieldSection,
            props?.isDependencyRepeatFields,
            props?.repeatFieldIndex,
            props?.repeatDependencySectionIndex,
            props?.repeatDepFieldIndex,
            undefined,
            props?.setInputs
          );

          const infectiousDataCopy = [...props?.infectiousData];
          const index = FindIndex(props?.infectiousData, props?.ArrayReqId);
          if (index !== -1) {
            infectiousDataCopy[index] = {
              ...infectiousDataCopy[index],
              sections: newInputs,
            };
            props?.setInfectiousData(infectiousDataCopy);
          }
        } catch (error) {
          console.error("Error in handleselectedCheckbox:", error);
        }
      };
      processUpdate();
      return updatedOptions;
    });
  };
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
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
      <div className="dropdown" ref={divElement}>
        <div className="form-control bg-transparent" onClick={toggleDropdown}>
          {selectedOption || t("Select an option")}
          <span className={`arrow ${isDropdownOpen ? "open" : ""}`}></span>
        </div>
        {isDropdownOpen && (
          <div
            className="mt-3 p-3 dropdown-menu d-block w-100"
            style={{
              maxHeight: "250px", // Adjust height to fit approximately based on their height
              overflowY: "auto", // Enable vertical scrolling
            }}
          >
            <input
              type="text"
              placeholder={t("Search...")}
              value={searchTerm}
              onChange={handleSearch}
              className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 mb-2"
            />
            <ul className="p-0 m-0 mt-2">
              {filteredOptions?.map((option: any, index: any) => (
                <li
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  className="dropdown-item"
                >
                  <div className="d-flex justify-content-between">
                    <div> {option?.testName}</div>
                    <div className="text-muted"> {option?.specimenType}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {displayOptions?.length > 0 && (
        <div className="selected-options">
          <div className="d-flex gap-5 mt-5">
            {displayOptions?.map(
              (option: any, index: any) =>
                option?.isSelected && (
                  <>
                    <input
                      className="form-check-input h-20px w-20px"
                      type="checkbox"
                      name={option?.testName}
                      value={props?.value}
                      checked={option?.isSelected}
                      onChange={() => handleselectedCheckbox(option)}
                    />
                    <span key={index}>
                      {" "}
                      {option?.testName}{" "}
                      <span
                        className="text-muted"
                        style={{ fontWeight: "2px" }}
                      >
                        ({option?.specimenType})
                      </span>
                    </span>
                  </>
                )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AdditionalTest;
