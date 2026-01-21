import { Iinput } from "../../../Interface/Shared/Interfaces";
import MuiSkeleton from "../MuiSkeleton";
const Input2 = (props: Iinput) => {
  return (
    <div
      custom-attribute={props?.depOptionID}
      //data-depoptionid={props?.depOptionID}
      className={
        props?.parentDivClassName
          ? `${props?.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <label
        className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
        htmlFor={props.id}
      >
        {props.label}
      </label>
      {props?.loading ? (
        <MuiSkeleton />
      ) : (
        <input
          type={props.type || "text"}
          max={props.max}
          name={props.name}
          id={props.id}
          autoComplete="off"
          value={props.value}
          onChange={props.onChange}
          onBlur={props.onBlur}
          placeholder={props.label}
          className={
            props.disabled === true
              ? "form-control bg-light-secondary"
              : "form-control bg-transparent"
          }
          disabled={props?.disabled}
          maxLength={props?.maxLengthValue}
        />
      )}

      {props.error && (
        <div className="form__error">
          <span>{props.error}</span>
        </div>
      )}
    </div>
  );
};

export default Input2;
