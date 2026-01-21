import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import UseDrugAllergiesAutoComplete from "../../../Shared/hooks/Requisition/UseDrugAllergiesAutoComplete";
import { assignFormValues } from "../../../Utils/Auth";
import MuiSkeleton from "../MuiSkeleton";

const ItalicizeCheckboxList = (props: any) => {
    const divElement = useRef<HTMLDivElement | null>(null);
    const location = useLocation();
    const { t } = useLang();
    const [disableAllOptions, setDisableAllOptions] = useState(false);
    useEffect(() => {
        let parsedValue = null;
        if (
            typeof props?.defaultValue === "string" &&
            props.defaultValue.trim() !== ""
        ) {
            parsedValue = JSON.parse(props?.defaultValue);
            if (Array.isArray(parsedValue)) {
                parsedValue?.map((i: any) => {
                    if (i?.value === "Other") {
                        props?.Inputs[props.index]?.fields?.map((field: any) => {
                            if (field?.systemFieldName === "OtherComments") {
                                field.visible = true;
                            }
                        });
                    }
                });
            }
        }
        EditDrugAllergies(parsedValue);
    }, [props.defaultValue]);

    const inputSearchRef = useRef<HTMLInputElement>(null);
    const {
        searchedValue,
        setSearchedValue,
        suggestions,
        setSuggestions,
        handleChange,
        handleKeyDown,
    } = UseDrugAllergiesAutoComplete();

    const EditDrugAllergies = (parsedValue: any) => {
        if (props.sysytemFieldName === "DrugAllergies") {
            assignFormValues(
                props.Inputs,
                props.index,
                props.depControlIndex,
                props.fieldIndex,
                parsedValue ?? props?.defaultValue,
                props.isDependency,
                props.repeatFieldSection,
                props.isDependencyRepeatFields,
                props.repeatFieldIndex,
                props.repeatDependencySectionIndex,
                props.repeatDepFieldIndex,
                undefined,
                props?.setInputs
            );
            if (Array.isArray(props?.defaultValue)) {
                props?.defaultValue?.map((i: any) => {
                    if (i?.value === "NoAllergies") setDisableAllOptions(true);
                });
            }
        } else {
            assignFormValues(
                props.Inputs,
                props.index,
                props.depControlIndex,
                props.fieldIndex,
                props?.defaultValue,
                props.isDependency,
                props.repeatFieldSection,
                props.isDependencyRepeatFields,
                props.repeatFieldIndex,
                props.repeatDependencySectionIndex,
                props.repeatDepFieldIndex,
                undefined,
                props?.setInputs
            );
        }
    };

    const removeDrugAllergy = (
        value: string | number,
        label: any,
        id: number
    ) => {
        if (label === "No Allergies") {
            setDisableAllOptions(false);
        }
        let inputsCopy = [...props?.Inputs];
        let index = props?.index;
        if (index) {
            let indexDrugs = inputsCopy[index]?.fields?.findIndex(
                (i: any) => i?.systemFieldName === "DrugAllergies"
            );

            const currentDefault = inputsCopy[index].fields[indexDrugs]?.defaultValue;

            if (typeof currentDefault === "string") {
                const parsed = JSON.parse(currentDefault);
                if (Array.isArray(parsed)) {
                    inputsCopy[index].fields[indexDrugs].defaultValue = parsed.filter(
                        (innerDrug: any) => innerDrug.label !== label
                    );
                }
            }
        }

        const updatedArray = [...props.defaultValue];
        const indexToRemove = updatedArray.findIndex(
            (item: any) => item.value === value
        );
        if (indexToRemove !== -1) {
            props.Inputs[props.index].fields[props.fieldIndex].defaultValue =
                props.defaultValue.filter((option: any) => value !== option.value);
        }

        const modifiedEvent = {
            target: {
                checked: false,
                id,
            },
        };
        props.onChange(modifiedEvent, id, label);
    };

    const addNewDrugAllergy = () => {
        if (searchedValue) {
            const alreadySelectedInCheckboxes = props?.RadioOptions.some(
                (option: any) =>
                    option.label === searchedValue &&
                    props?.defaultValue?.some((list: any) => list.value === option.value)
            );
            if (alreadySelectedInCheckboxes) {
                toast.error(`${searchedValue} is already selected in checkboxes`);
                return;
            }
            const newDrug = {
                id: Date.now(),
                label: searchedValue,
                value: searchedValue.toLowerCase().replace(/ /g, "_"),
            };
            const modifiedEvent = {
                target: {
                    checked: true,
                    id: newDrug.id,
                },
            };
            props.onChange(modifiedEvent, newDrug.value, newDrug.label);
            setSearchedValue("");
        }
    };

    const handleSuggestionClick = (suggestion: any) => {
        if (
            !props.defaultValue.some((drug: any) => drug.label === suggestion.label)
        ) {
            const modifiedEvent = {
                target: {
                    checked: true,
                    id: suggestion.value,
                },
            };
            props.onChange(modifiedEvent, suggestion.value, suggestion.label);
            setSearchedValue("");
            setSuggestions([]);
        } else {
            toast.error(`${suggestion.label} is already selected!`);
        }
    };

    const handleOptionChange = (e: any, option: any) => {
        if (
            e?.target.value === "Other" &&
            props?.sectionId == 45 &&
            e?.target?.checked
        ) {
            props?.Inputs[props.index]?.fields?.map((field: any) => {
                if (field?.systemFieldName === "OtherComments") {
                    field.visible = true;
                }
            });
        }
        if (
            e?.target?.value === "Other" &&
            props?.sectionId == 45 &&
            !e?.target?.checked
        ) {
            props?.Inputs[props.index]?.fields?.map((field: any) => {
                if (field?.systemFieldName === "OtherComments") {
                    field.visible = false;
                }
            });
        }
        const checked = e.target.checked;
        const id = e.target.id;
        if (option.value === "NoAllergies" || option.value === "No Allergies") {
            if (checked) {
                setSearchedValue("");
                setDisableAllOptions(true);
            } else {
                setDisableAllOptions(false);
            }
        } else if (!disableAllOptions) {
        }
        props.onChange(e, option.value, option.label, option.id);
    };

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
    function numberDollarSections(text: any) {
        let count = 1;
        return text.replace(/\$\$/g, () => `\n\n${count++}. `);
    }

    return (
        <>
            {props.error && (
                <div className="form__error">
                    <span>{t(props.error)}</span>
                </div>
            )}
            <div
                className={
                    props?.parentDivClassName
                        ? `${props?.parentDivClassName}`
                        : "col-lg-6 col-md-6 col-sm-12 mb-3"
                }
                ref={divElement}
            >
                {
                    <div
                        className={
                            props.required
                                ? "fw-500 mb-5 required text-primary fst-italic"
                                : "fw-500 mb-5 fst-italic"
                        }
                        dangerouslySetInnerHTML={{
                            __html: t(numberDollarSections(props?.displayFieldName))
                                ?.replace(/(\d+\.)/g, "<br>$1")
                        }}
                    />
                }
                <div className="row">
                    {props?.RadioOptions?.map(
                        (options: any) =>
                            options?.isVisable &&
                            (options.value === "NoAllergies" ||
                                options.value === "No Allergies" ? (
                                <div className="col-12 py-2" key={options.id}>
                                    <div className="form__group form__group--checkbox mb-3">
                                        <label
                                            className={
                                                props?.labelClassName
                                                    ? `${props?.labelClassName} fw-bold text-break`
                                                    : "form-check form-check-inline form-check-solid m-0 fw-bold text-break"
                                            }
                                            style={{ fontSize: "1.1rem" }}
                                        >
                                            <input
                                                className="form-check-input h-20px w-20px"
                                                type="checkbox"
                                                id={options.id}
                                                name={options.name}
                                                onChange={(e: any) => handleOptionChange(e, options)}
                                                checked={
                                                    Array.isArray(props?.defaultValue) &&
                                                    props.defaultValue.some(
                                                        (option: any) => options?.value === option.value
                                                    )
                                                }
                                            />
                                            {props?.loading ? (
                                                <MuiSkeleton height={22} />
                                            ) : (
                                                <span className={props?.spanClassName || ""}>
                                                    {t(options.label)}
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className={
                                        props.sysytemFieldName == "ExperiencingSymptom" ||
                                            props.sysytemFieldName == "NoSymptom"
                                            ? "col-xxl-6 col-xl-4 col-lg-6 col-md-6 col-12 py-1"
                                            : "col-xxl-4 col-xl-3 col-lg-4 col-md-6 py-1"
                                    }
                                    key={options.id}
                                >
                                    <div className="form__group form__group--checkbox mb-3">
                                        <label
                                            className={
                                                props?.labelClassName
                                                    ? `${props?.labelClassName} fw-400 text-break`
                                                    : "form-check form-check-inline form-check-solid m-0 fw-400 text-break"
                                            }
                                        >
                                            <input
                                                className="form-check-input h-20px w-20px"
                                                type="checkbox"
                                                id={options.id}
                                                name={options.name}
                                                value={options.value}
                                                onChange={(e: any) => handleOptionChange(e, options)}
                                                defaultChecked={options?.isSelectedDefault}
                                                checked={
                                                    Array.isArray(props?.defaultValue) &&
                                                    props.defaultValue.some(
                                                        (option: any) => options?.value === option.value
                                                    )
                                                }
                                                disabled={
                                                    props.sectionId === 45 || props.sectionId === 46
                                                        ? props.isEnable
                                                        : disableAllOptions
                                                }
                                            />
                                            {props?.loading ? (
                                                <MuiSkeleton height={22} />
                                            ) : (
                                                <span className={props?.spanClassName || ""}>
                                                    {t(options.label)}
                                                </span>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            ))
                    )}
                </div>
                {props?.sectionId === 9 && (
                    <>
                        <div className="d-flex align-items-start gap-2 mt-2">
                            <div className="w-100 w-md-300px position-relative">
                                <label className="mb-1 fw-500">{t("Others")}</label>
                                <div className="d-flex position-relative gap-2 align-items-center">
                                    <input
                                        type="text"
                                        name="DrugOthers"
                                        placeholder={t("Allergies / Drug Allergies")}
                                        className="form-control bg-transparent"
                                        value={searchedValue}
                                        onChange={(e) => {
                                            handleChange(e);
                                        }}
                                        onKeyDown={handleKeyDown}
                                        ref={inputSearchRef}
                                        disabled={disableAllOptions}
                                    />
                                    <button
                                        className="btn btn-icon btn-sm fw-bold btn-primary w-40px"
                                        style={{ height: "38px" }}
                                        onClick={() => {
                                            if (
                                                searchedValue &&
                                                !props.defaultValue.some(
                                                    (drug: any) => drug.label === searchedValue
                                                )
                                            ) {
                                                addNewDrugAllergy();
                                            }
                                        }}
                                    >
                                        <span>
                                            {" "}
                                            <i className="bi bi-plus fs-2qx"></i>
                                        </span>
                                    </button>
                                </div>
                                {suggestions.length > 0 && searchedValue && (
                                    <div
                                        className="shadow-sm mt-2 rounded-2"
                                        style={{
                                            maxHeight: "300px",
                                            overflowY: "auto",
                                        }}
                                    >
                                        {suggestions.map((suggestion: any, index: number) => (
                                            <div
                                                key={index}
                                                className="py-1 bg-hover-light-primary px-3"
                                                onClick={() => handleSuggestionClick(suggestion)}
                                            >
                                                {suggestion.label}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 mt-4">
                            {Array.isArray(props?.defaultValue) &&
                                props?.defaultValue?.map((selectedDrugAllergiesInfo: any) => (
                                    <div className="d-flex badge badge-secondary px-2 fw-500 gap-2 align-items-center pt-2">
                                        <i
                                            className="bi bi-x-lg fs-7"
                                            onClick={() =>
                                                removeDrugAllergy(
                                                    selectedDrugAllergiesInfo.value,
                                                    selectedDrugAllergiesInfo.label,
                                                    selectedDrugAllergiesInfo.id
                                                )
                                            }
                                        ></i>
                                        <span>{t(selectedDrugAllergiesInfo.label)}</span>
                                    </div>
                                ))}
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default ItalicizeCheckboxList;
