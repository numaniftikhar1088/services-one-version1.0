import MuiSkeleton from "../MuiSkeleton";

const Select = (props) => {
  console.log('props........', props?.parentDivClassName)
  return (
    <div className={props?.parentDivClassName ? props?.parentDivClassName : "col-lg-3 col-md-6 col-sm-12"}>
    {/* <div className={"col-lg-3 col-md-4 col-sm-6"}> */}
      <div className="fv-row mb-4">
        <label
          className={props?.required ? "mb-2 required" : "required mb-2"}
          htmlFor={props.id}
        >
          {props.label}
        </label>
        {props?.loading ? (
          <MuiSkeleton />
        ) : (
          <select
            name={props.name}
            value={props.value}
            onChange={props.onChange}
            className="form-select form-control bg-transparent"
          >
            {props?.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}

        {props.error && (
          <div className="form__error">
            <span>{props.error}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Select;
