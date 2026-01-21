import {
  ChangeEvent,
  FC,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
} from "react";
import MuiSkeleton from "../MuiSkeleton";
import useLang from "./../../hooks/useLanguage";

interface TextAreaProps {
  parentDivClassName?: string;
  required?: boolean;
  id?: string;
  label: string;
  loading?: boolean;
  value: string;
  placeholder?: string;
  name: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void;
  length?: number;
  error?: string;
  errorFocussedInput?: string;
  onKeyDown?: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  setErrorFocussedInput?: any;
}

const TextArea: FC<TextAreaProps> = (props) => {
  const { t } = useLang();
  const textAreaElement = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      textAreaElement.current &&
      props.errorFocussedInput === textAreaElement.current.name
    ) {
      textAreaElement.current.focus();
    }
  }, [props.errorFocussedInput]);
  const divElement = useRef<HTMLDivElement | null>(null); // Initialize ref for div
  useEffect(() => {
    // Scroll to the div if props.error is present
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);
  return (
    <div
      className={
        props.parentDivClassName
          ? `${props.parentDivClassName} mb-4`
          : "col-lg-6 col-md-6 col-sm-12 mb-4"
      }
    >
      <label
        className={
          props.required
            ? "required mb-2 fw-500"
            : props.label === null || props.label === " "
            ? "d-none"
            : "mb-2 fw-500"
        }
        htmlFor={props.id}
      >
        {t(props.label)}
      </label>
      {props.loading ? (
        <MuiSkeleton />
      ) : (
        <textarea
          value={props.value}
          placeholder={t(props?.placeholder ? props?.placeholder : "...")}
          className="form-control bg-transparent min-h-50px"
          name={props.name}
          id={props.id}
          autoComplete="off"
          onChange={props.onChange}
          onBlur={props.onBlur}
          required={props.required}
          ref={textAreaElement}
          onKeyDown={props.onKeyDown}
        />
      )}
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
    </div>
  );
};

export default TextArea;
