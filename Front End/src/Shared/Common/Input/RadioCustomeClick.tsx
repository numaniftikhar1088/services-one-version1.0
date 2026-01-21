import { IRadio } from "../../../Interface/Shared/Interfaces";
import MuiSkeleton from "../MuiSkeleton";
const Radio = (props: IRadio) => {
  // 
  const handleChange = (e: any) => {
    props?.onChange(e);
    props?.setformData2(e.target.value);
  };
  return (
    <>
      <label className="mb-2 fw-500 required">{props?.label}</label>
      <div className="d-flex align-items-center">
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
                id={choice?.id}
                value={choice?.value}
                onChange={(e: any) => handleChange(e)}
                checked={props?.checked == choice?.value}
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
