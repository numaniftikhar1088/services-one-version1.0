import { useEffect, useRef } from "react";
import useLang from "Shared/hooks/useLanguage";

interface CopyCheckBoxProps {
  parentDivClassName?: string;
  labelClassName?: string;
  required?: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: boolean;
  checked?: boolean;
  disabled?: boolean;
  error?: string;
}

const CopyCheckBox: React.FC<CopyCheckBoxProps> = (props) => {
  const { t } = useLang();

  const inputElement = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputElement.current && props.error) {
      inputElement.current.focus();
    }
  }, [props.error]);

  return (
    <>
      <div
        className={
          props?.parentDivClassName
            ? `${props?.parentDivClassName} mb-4`
            : "col-lg-6 col-md-6 col-sm-12 mb-4"
        }
      >
        <div className="form__group form__group--checkbox">
          <label
            className={
              props?.labelClassName
                ? `${props?.labelClassName} fw-500 ` + `${props?.required}`
                : "form-check form-check-inline form-check-solid m-0 fw-500" +
                  `${props?.required}`
            }
          >
            <span>{t(props?.label)}</span>
            <input
              className="form-check-input h-20px w-20px"
              type="checkbox"
              name={props?.label}
              value={props?.value}
              onChange={props?.onChange}
              checked={props?.defaultValue}
              defaultChecked={props?.checked}
              disabled={props?.disabled}
              ref={inputElement}
              id={props?.label.split(" ").join("")}
            />
          </label>
          {props.error && <div className="form__error">{t(props.error)}</div>}
        </div>
      </div>
    </>
  );
};

export default CopyCheckBox;
