import useLang from "./hooks/useLanguage";

const FormInput = (props: any) => {
  const { t } = useLang();
  const { label, onChange, id, onKeyDown, required, ...inputProps } = props;
  return (
    <>
      <label className={`mb-2 fw-500${required ? " required" : ""}`}>
        {t(label)}
      </label>
      <input
        className="form-control bg-transparent mb-2"
        {...inputProps}
        onChange={onChange}
        onKeyDown={props.onKeyDown}
        id={id}
      />
    </>
  );
};

export default FormInput;
