import { IRadio } from "../../../Interface/Shared/Interfaces";
import MuiSkeleton from "../MuiSkeleton";

const Radio = (props: IRadio) => {
  //
  const handleChange = (e: any) => {
    props?.onChange(e);
    if (props?.setformData2) {
      props?.setformData2(e.target.value);
    }
  };
  return (
    <>
      {props?.label?.length ? (
        <label className={`mb-2 fw-500 ${props.noRequired ? "" : "required"}`}>
          {props?.label}
        </label>
      ) : null}
      <div className="d-flex align-items-center flex-wrap gap-2">
        {props.choices.map((choice) => (
          <label
            className="form-check form-check-inline form-check-solid me-5"
            htmlFor={choice?.id}
            key={choice?.id}
          >
            {props?.loading ? (
              <MuiSkeleton />
            ) : (
              <input
                className="form-check-input ifuser"
                type="radio"
                name={props?.name}
                id={`RadioButton${choice?.label}`}
                value={choice?.value}
                onChange={(e: any) => handleChange(e)}
                checked={props?.checked === choice?.value}
                disabled={props?.disabled}
              />
            )}

            <span className="ps-2">{choice?.label}</span>
          </label>
        ))}
      </div>
      {props.error && (
        <div className="form__error">
          {" "}
          <span>{props.error}</span>
        </div>
      )}
    </>
  );
};

export default Radio;
