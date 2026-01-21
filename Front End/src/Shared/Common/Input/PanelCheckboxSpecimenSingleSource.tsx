import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { assignFormValues } from "../../../Utils/Auth";
import useLang from "./../../hooks/useLanguage";

const PanelsCheckboxSpecimenSingleSource = (props: any) => {
    const { t } = useLang();
    const location = useLocation();
    const divElement = useRef<HTMLDivElement | null>(null);
    function FindIndex(arr: any[], rid: any) {
        return arr.findIndex((i: any) => i.reqId === rid);
    }
    const convertPrefilledIcdDataToJson = () => {
        let newInputValue: any[] = [];
        props.panels.forEach((panel: any) =>
            panel.specimenSourceOption.forEach((option: any) => {
                if (option.isSelected) {
                    option.specimenTypeOther = option?.field?.defaultValue; // Update the property
                    newInputValue.push(option);
                }
            })
        );
        props.setInputValueForSpecimen(newInputValue);
        let newInputs = assignFormValues(
            props?.Inputs,
            props?.index,
            props?.depControlIndex,
            props?.fieldIndex,
            newInputValue,
            props?.isDependency,
            props?.repeatFieldSection,
            props?.isDependencyRepeatFields,
            props?.repeatFieldIndex,
            props?.repeatDependencySectionIndex,
            props?.repeatDepFieldIndex,
            undefined,
            props?.setInputs
        );

        newInputs.then((res) => {
            let infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
            );
            infectiousDataCopy[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = res;
            props?.setInfectiousData &&
                props?.setInfectiousData([...infectiousDataCopy]);
        });
    };

    const handleChange = (
        e: any,
        options: any,
        checked: boolean,
        panelName: string,
        index: any
    ) => {
        props.fields.enableRule = "";
        const panelIndex = props.panels.findIndex(
            (panel: any) => panel.panelID === options.panelID
        );
        if (panelIndex === -1) {
            console.warn(
                "Panel not found for the provided panelID:",
                options.panelID
            );
            return;
        }

        // For single selection, first deselect all options in ALL panels
        props.panels.forEach((panel: any) => {
            panel.specimenSourceOption.forEach((specimen: any) => {
                specimen.isSelected = false;
            });
        });

        // Then select the chosen option if checked
        const specimenIndex = props.panels[
            panelIndex
        ].specimenSourceOption.findIndex(
            (specimen: any) => specimen.specimenTypeID === options.specimenTypeID
        );
        if (specimenIndex === -1) {
            console.warn(
                "Specimen not found for the provided specimenTypeID:",
                options.specimenTypeID
            );
            return;
        }
        props.panels[panelIndex].specimenSourceOption[specimenIndex].isSelected =
            checked;

        let updatedInputValue;
        if (checked) {
            // Remove ALL previous selections (single selection across all panels)
            updatedInputValue = [];

            // Add the selected specimen
            const newObj = {
                panelID:
                    props.panels[panelIndex].specimenSourceOption[specimenIndex].panelID,
                specimenPreFix:
                    props.panels[panelIndex].specimenSourceOption[specimenIndex]
                        .specimenPreFix,
                specimenType:
                    props.panels[panelIndex].specimenSourceOption[specimenIndex]
                        .specimenType,
                specimenTypeID:
                    props.panels[panelIndex].specimenSourceOption[specimenIndex]
                        .specimenTypeID,
                panelName,
                isSelected: checked,
                SpecimenTypeOther:
                    props.Inputs[props.index].fields[props?.fieldIndex].specimenSources[
                        index
                    ].specimenSourceOption[specimenIndex].field &&
                    (location?.state?.reqId
                        ? props.Inputs[props.index].fields[props?.fieldIndex]
                            .specimenSources[index].specimenSourceOption[specimenIndex]
                            .field.defaultValue
                        : props.Inputs[props.index].fields[props.fieldIndex]
                            .specimenSources[index].specimenSourceOption[specimenIndex]
                            .specimenTypeOther),
            };

            updatedInputValue = [newObj];
        } else {
            // Remove the unchecked specimen
            updatedInputValue = props.inputValueForSpecimen.filter(
                (item: any) =>
                    !(
                        item.specimenTypeID === options.specimenTypeID &&
                        item.panelID === options.panelID
                    )
            );
        }
        props.setInputValueForSpecimen(updatedInputValue);
        let newInputs = assignFormValues(
            props?.Inputs,
            props?.index,
            props?.depControlIndex,
            props?.fieldIndex,
            updatedInputValue,
            props?.isDependency,
            props?.repeatFieldSection,
            props?.isDependencyRepeatFields,
            props?.repeatFieldIndex,
            props?.repeatDependencySectionIndex,
            props?.repeatDepFieldIndex,
            undefined,
            props?.setInputs
        );
        newInputs.then((res) => {
            let infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
            );
            infectiousDataCopy[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = res;
            props?.setInfectiousData &&
                props?.setInfectiousData([...infectiousDataCopy]);
        });
    };

    const handleChangeFree = async (e: any, index: any, innerIndex: any) => {
        const newValue = e.target.value;

        // Update the input values inside Inputs state
        props.Inputs[props.index].fields[props.fieldIndex].specimenSources[
            index
        ].specimenSourceOption[innerIndex].field.defaultValue = newValue;
        props.Inputs[props.index].fields[props.fieldIndex].specimenSources[
            index
        ].specimenSourceOption[innerIndex].specimenTypeOther = newValue;

        // Update the input values inside inputValueForSpecimen state
        const updatedInputValues = props.inputValueForSpecimen.map((item: any) => {
            if (
                item.specimenTypeID ===
                props.panels[index].specimenSourceOption[innerIndex].specimenTypeID &&
                item.panelID ===
                props.panels[index].specimenSourceOption[innerIndex].panelID
            ) {
                return {
                    ...item,
                    SpecimenTypeOther: newValue,
                };
            }
            return item;
        });

        props.setInputValueForSpecimen(updatedInputValues);
        let newInputs = assignFormValues(
            props?.Inputs,
            props?.index,
            props?.depControlIndex,
            props?.fieldIndex,
            updatedInputValues,
            props?.isDependency,
            props?.repeatFieldSection,
            props?.isDependencyRepeatFields,
            props?.repeatFieldIndex,
            props?.repeatDependencySectionIndex,
            props?.repeatDepFieldIndex,
            undefined,
            props?.setInputs
        );
        newInputs.then((res) => {
            let infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
            );
            infectiousDataCopy[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = res;
            props?.setInfectiousData &&
                props?.setInfectiousData([...infectiousDataCopy]);
        });
    };
    // Event handler
    const handleChangeFreeTextBox = (e: any, index: any, innerIndex: any) => {
        handleChangeFree(e, index, innerIndex);
    };
    useEffect(() => {
        if (location?.state?.reqId) {
            convertPrefilledIcdDataToJson();
        }
    }, [props.defaultValue]);

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

    useEffect(() => {
        const filteredPanels = props.panels
            .filter((panel: any) => panel.isVisible)
            .flatMap((panel: any) => {
                return panel.specimenSourceOption
                    .filter((specimen: any) => specimen.isSelected)
                    .map((specimen: any) => ({
                        ...panel,
                        specimenSourceOption: specimen
                    }));
            });
        const formattedPanels = filteredPanels.map((panel: any) => ({
            panelID: panel.panelID,
            panelName: panel.panelName,
            isSelected: panel.isSelected,
            specimenPreFix: panel.specimenSourceOption?.specimenPreFix || null,
            specimenType: panel.specimenSourceOption?.specimenType || null,
            specimenTypeID: panel.specimenSourceOption?.specimenTypeID || null,
            SpecimenTypeOther: panel.specimenSourceOption?.specimenTypeOther || null
        }));

        let newInputs = assignFormValues(
            props?.Inputs,
            props?.index,
            props?.depControlIndex,
            props?.fieldIndex,
            formattedPanels,
            props?.isDependency,
            props?.repeatFieldSection,
            props?.isDependencyRepeatFields,
            props?.repeatFieldIndex,
            props?.repeatDependencySectionIndex,
            props?.repeatDepFieldIndex,
            undefined,
            props?.setInputs
        );
        newInputs.then((res) => {
            let infectiousDataCopy = JSON.parse(
                JSON.stringify(props?.infectiousData)
            );
            infectiousDataCopy[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = res;
            props?.setInfectiousData &&
                props?.setInfectiousData([...infectiousDataCopy]);
        });
    }, [props.panels]);

    return (
        <div ref={divElement}>
            {props.error && (
                <div className="form__error">
                    <span>{t(props.error)}</span>
                </div>
            )}
            <div id={props?.name} tabIndex={-1}></div>
            <div className={props?.sectionDisplayType}>
                <div className="d-flex flex-wrap ">
                    {props?.panels?.map(
                        (panels: any, index: any) =>
                            panels?.isVisible && (
                                <div
                                    className={`card shadow-sm mb-3 rounded border border-warning ${props?.displayType}`}
                                    key={panels.panelID}
                                >
                                    <div className="card-header min-h-35px d-flex justify-content-between align-items-center rounded bg-light-warning">
                                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                                            <h6 className="m-0">{panels?.panelName}</h6>
                                        </div>
                                    </div>
                                    <div className="card-body py-md-4 py-3">
                                        <div className="row">
                                            {panels?.specimenSourceOption?.map(
                                                (options: any, innerindex: any) => (
                                                    <div
                                                        className="col-xl-3 col-lg-3 col-md-3 col-xxl-3 col-sm-6 d-flex gap-2 mb-1"
                                                        key={options.specimenPreFix}
                                                    >
                                                        <label className="form-check form-check-inline form-check-solid m-0 mb-2 mt-2">
                                                            <input
                                                                className="form-check-input h-20px w-20px"
                                                                type="radio"
                                                                id={`${options.panelID}_${options.specimenTypeID}`}
                                                                name={`${props.label}_${panels.panelID}`}
                                                                value={options.specimenTypeID}
                                                                onChange={(e: any) => {
                                                                    handleChange(
                                                                        e,
                                                                        options,
                                                                        e.target.checked,
                                                                        panels.panelName,
                                                                        index
                                                                    );
                                                                }}
                                                                checked={options.isSelected}
                                                                disabled={props?.disabled}
                                                            />
                                                            {options.specimenType}
                                                        </label>

                                                        {options.field && (
                                                            <div className="">
                                                                <label className="m-0">
                                                                    <input
                                                                        value={
                                                                            location?.state?.reqId
                                                                                ? options.field.defaultValue
                                                                                : options.specimenTypeOther
                                                                        }
                                                                        placeholder=""
                                                                        className={
                                                                            "form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
                                                                        }
                                                                        onChange={(e: any) => {
                                                                            handleChangeFreeTextBox(
                                                                                e,
                                                                                index,
                                                                                innerindex
                                                                            );
                                                                        }}
                                                                    />
                                                                </label>
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                    )}
                </div>
            </div>
        </div>
    );
};

export default PanelsCheckboxSpecimenSingleSource;
