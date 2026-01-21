import { forwardRef, useEffect, useRef } from "react";
import useLang from "../../hooks/useLanguage";
import MuiSkeleton from "../MuiSkeleton";
import { FindIndex } from "Utils/Common/CommonMethods";
import { CrossIcon } from "Shared/Icons";

const AlphabaticField = forwardRef<HTMLInputElement, any>(
    (props: any, ref: any) => {
        const { t } = useLang();
        const divElement = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (props.error && divElement.current) {
                divElement.current.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            props.setErrorFocussedInput && props.setErrorFocussedInput();
        }, [props?.errorFocussedInput]);

        const incrementAlphabet = (value: string) => {
            let carry = 1;
            let result = "";

            for (let i = value.length - 1; i >= 0; i--) {
                let charCode = value.charCodeAt(i) - 65 + carry;
                carry = charCode >= 26 ? 1 : 0;
                charCode = charCode % 26;
                result = String.fromCharCode(charCode + 65) + result;
            }

            if (carry) result = "A" + result;
            return result;
        };

        /* ---------------- ADD FIELD ---------------- */
        const handleDuplicateFields = async () => {
            // 2️⃣ Get all Site fields
            const siteFields = props.Inputs[props.index].fields.filter(
                (field: any) => field.systemFieldName === "Site"
            );

            if (siteFields.length === 0) return;

            // 3️⃣ Get last Site field (Site A, Site B, etc.)
            const lastSite = siteFields[siteFields.length - 1];

            // 4️⃣ Extract letter (A, B, C...)
            const match = lastSite.displayFieldName.match(/Site\s+([A-Z]+)/i);
            const lastLetter = match ? match[1] : "A";

            // 5️⃣ Increment alphabet
            const nextLetter = incrementAlphabet(lastLetter);

            // 6️⃣ Clone Site field
            const newSiteField = {
                ...lastSite,
                displayFieldName: `Site ${nextLetter}`,
                defaultValue: "",

            };
            // 7️⃣ Push new Site field
            props.Inputs[props.index].fields.push(newSiteField);
            props.infectiousData[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = props.Inputs;
            props?.setInfectiousData &&
                props?.setInfectiousData([...props.infectiousData]);
        };

        /* ---------------- REMOVE FIELD ---------------- */
        const handleRemoveField = async (fieldIndex: any) => {
            // get all Site fields
            const siteFields = props.Inputs[props.index].fields.filter(
                (field: any) => field.systemFieldName === "Site"
            );
            if (siteFields.length <= 1) return;

            if (fieldIndex !== -1) {
                props.Inputs[props.index].fields.splice(fieldIndex, 1);
            }
            props.infectiousData[
                FindIndex(props?.infectiousData, props.ArrayReqId)
            ].sections = props.Inputs;
            props?.setInfectiousData &&
                props?.setInfectiousData([...props.infectiousData]);

        };



        const fields = props.Inputs?.[props.index]?.fields || [];
        const siteFields = fields.filter(
            (f: any) => f.systemFieldName === "Site"
        );

        const lastSiteIndex =
            siteFields.length > 0
                ? fields.lastIndexOf(siteFields[siteFields.length - 1])
                : -1;

        const showAddButton = props.fieldIndex === lastSiteIndex;
        const showRemoveButton =
            props.fieldIndex === lastSiteIndex

        return (
            <>
                <div
                    className={
                        props?.parentDivClassName
                            ? `${props?.parentDivClassName} mb-4 position-relative`
                            : "col-lg-12 col-md-12 col-sm-12 mb-4 position-relative"
                    }
                    ref={divElement}
                >
                    {showRemoveButton && siteFields.length > 1 && (
                        <span
                            onClick={() => handleRemoveField(props.fieldIndex)}
                            title="Remove"
                            className="d-flex justify-content-end"
                        >
                            <CrossIcon className="fs-2hx text-gray-700 bi bi-x cursor-pointer" />
                        </span>
                    )}

                    <label
                        className={
                            props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"
                        }
                    >
                        {t(props.label)}
                    </label>

                    {props?.loading ? (
                        <MuiSkeleton />
                    ) : (
                        <input
                            value={props?.value}
                            type={props?.type ?? "text"}
                            name={props.name}
                            autoComplete="off"
                            onChange={props.onChange}
                            onBlur={props.onBlur}
                            className="form-control bg-transparent"
                            maxLength={props?.length}
                            required={props.required}
                            ref={ref}
                            onKeyDown={props.onKeyDown}
                        />
                    )}
                    {showAddButton && (
                        <div className="d-flex justify-content-end mb-2 mt-2">
                            <button
                                type="button"
                                className="btn btn-sm btn-primary"
                                onClick={handleDuplicateFields}
                            >
                                <span><i style={{ fontSize: "16px" }} className="fa">&#xf067;</i></span>  Add Site
                            </button>
                        </div>
                    )}

                    {props.error && (
                        <div className="form__error">
                            <span>{t(props.error)}</span>
                        </div>
                    )}
                </div>
            </>
        );
    }
);

export default AlphabaticField;


