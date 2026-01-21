import { ICheckbox } from "../../../Interface/Shared/Interfaces";
import MuiSkeleton from "../MuiSkeleton";

const CheckBoxDuplicate = (props: ICheckbox) => {
  return (
    <div
      className={
        props?.parentDivClassName
          ? `${props?.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4 w-100"
      }
    >
      <div className="form__group form__group--checkbox">
        <label
          className={
            props?.labelClassName
              ? `${props?.labelClassName} fw-500 `
              : "form-check form-check-inline form-check-solid m-0 fw-500"
          }
        >
          <input
            className="form-check-input"
            type="checkbox"
            id={props.id}
            name={props.label}
            value={props.value}
            onChange={props.onChange}
            defaultChecked={props.checked}
            checked={props.checked}
            disabled={props?.disabled}
          />
          {props?.loading ? (
            <MuiSkeleton height={22} />
          ) : (
            <span
              className={
                props?.spanClassName
                  ? `${props?.spanClassName} text-break fw-400`
                  : ""
              }
            >
              {props?.testCode ? props?.testCode + `:` : ""}
              {props.label}
            </span>
          )}
        </label>
        {props.error && <div className="form__error">{props.error}</div>}
      </div>
    </div>
  );
};

export default CheckBoxDuplicate;
