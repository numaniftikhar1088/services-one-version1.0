import MuiSkeleton from "../MuiSkeleton";
import useLang from "./../../hooks/useLanguage";
const Switch = (props: any) => {
  const { t } = useLang();
  return (
    <div
      className={
        props?.parentDivClassName
          ? `${props?.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <div className="form__group form__group--checkbox d-flex">
        {props?.loading ? (
          <MuiSkeleton height={22} />
        ) : (
          <span
            className={`${
              props?.spanClassName
                ? `${props?.spanClassName} text-break fw-400`
                : ""
            }  ${props?.required ? "required" : ""}`}
          >
            {props?.testCode ? t(props?.testCode) + `:` : ""}
            {t(props.label)}
          </span>
        )}
        <div className="form-check form-switch">
          <input
            className="form-check-input"
            type="checkbox"
            id={props.label.split(" ").join("")}
            name={props.label}
            value={props.value}
            onChange={props.onChange}
            defaultChecked={props.defaultValue === "True" ? true : false}
            disabled={props?.disabled}
          />
        </div>
        {props.error && <div className="form__error">{t(props.error)}</div>}
      </div>
    </div>
  );
};

export default Switch;
