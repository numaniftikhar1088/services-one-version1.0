import { Iinput } from "../../../Interface/Shared/Interfaces";
import MuiSkeleton from "../MuiSkeleton";

const SingleCheckbox = (props: Iinput) => {
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
      <div className="row mx-0">
          <label
          className={
              props?.checkTypeClassName
                ? `${props?.checkTypeClassName} mb-4`
                : "form-check form-check-inline form-check-solid col-6 mx-0"
            } 
            htmlFor={`#${props.id}`} > 
            {props?.loading ? (
                <MuiSkeleton />
            ) : (
                <input
                className="form-check-input ifuser" 
                type="checkbox"
                id={props.id}
                name={props.name}
                value={props.value}
                onChange={props.onChange}
                checked={props.checked}
                disabled={props?.disabled}
                />
            )}
                <span className="ps-2"></span>
            </label>
        </div>

      {props.error && (
        <div className="form__error">
          <span>{props.error}</span>
        </div>
      )}
    </div>
  );
};

export default SingleCheckbox;
