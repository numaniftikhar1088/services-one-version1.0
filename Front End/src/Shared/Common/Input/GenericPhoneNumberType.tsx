import { forwardRef, useEffect, useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import useLang from "Shared/hooks/useLanguage";
import {
  formatPhoneNumber,
  patterns,
  supportedCountries,
} from "Shared/PhoneNumberFormatter";

interface InputProps {
  label?: string;
  name?: string;
  onChange?: (value: string) => void;
  className?: string;
  parentDivClassName?: string;
  placeholder?: string;
  value?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  defaultCountry?: string;
}

const GenericPhoneNumberInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const { t } = useLang();
    const [countryCode, setCountryCode] = useState<string>(
      props.defaultCountry || "us"
    );
    const [phoneNumber, setPhoneNumber] = useState<string>(props.value || "");
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      if (props.value) {
        setPhoneNumber(props.value);
      }
    }, [props.value]);

    const validatePhoneNumber = (
      number: string,
      countryCode: string
    ): boolean => {
      if (!supportedCountries.includes(countryCode)) {
        setError(null);
        return true;
      }
      const pattern = patterns[countryCode];
      if (!pattern || !pattern.test(number)) {
        setError(
          t("Invalid phone number format. Please follow the required pattern.")
        );
        return false;
      }
      setError(null);
      return true;
    };

    const handlePhoneChange = (value: string, country: any) => {
      setPhoneNumber(value);
      setCountryCode(country.countryCode);
      const formatNum = formatPhoneNumber(
        value,
        country.countryCode,
        country.dialCode
      );

      const isValid = validatePhoneNumber(formatNum, country.countryCode);
      if (props.onChange && isValid) {
        props.onChange(formatNum);
      }
    };

    return (
      <div
        className={
          props?.parentDivClassName
            ? `${props.parentDivClassName} mb-4`
            : "col-lg-6 col-md-6 col-sm-12 mb-4"
        }
      >
        {props.label && (
          <label
            className={props?.required ? "required mb-2 fw-500" : "mb-2 fw-500"}
            htmlFor={props.name}
          >
            {t(props.label)}
          </label>
        )}
        <div>
          <PhoneInput
            country={countryCode}
            value={phoneNumber}
            onChange={(value: string, country: any) =>
              handlePhoneChange(value, country)
            }
            enableSearch={true}
            onlyCountries={supportedCountries} // Restrict dropdown to supported countries
            inputProps={{
              name: props.name || "",
              required: props.required || false,
              disabled: props.disabled || false,
            }}
            placeholder={props.placeholder || t("Enter phone number")}
          />
          <input
            type="hidden"
            ref={ref} // Attach the ref to a hidden input to expose the phone number
            value={phoneNumber} // Sync with the formatted phone number
            id={props.label?.split(" ").join("")}
          />
        </div>
        {error && (
          <div className="form__error">
            <span>{t(error)}</span>
          </div>
        )}
      </div>
    );
  }
);

export default GenericPhoneNumberInput;
