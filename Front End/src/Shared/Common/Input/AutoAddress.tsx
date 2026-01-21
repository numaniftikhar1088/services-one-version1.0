import { useEffect, useRef } from "react";
import Autocomplete from "react-google-autocomplete";
import useLang from "Shared/hooks/useLanguage";

const AutoAddress = (props: any) => {
  const { t } = useLang();
  const divElement = useRef<HTMLDivElement | null>(null);
  const autoCompleteRef = useRef<any>(null);

  useEffect(() => {
    if (props.error && divElement.current) {
      divElement.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
    props.setErrorFocussedInput && props.setErrorFocussedInput();
  }, [props?.errorFocussedInput]);
  useEffect(() => {
    if (autoCompleteRef.current && props.value !== undefined) {
      autoCompleteRef.current.value = props.value;
    }
  }, [props.value]);

  return (
    <div className={props.parentDivClassName + "mb-2"} ref={divElement}>
      <label className={`mb-2 fw-500 ${props.required ? "required" : ""}`}>
        {t(props.label)}
      </label>
      <Autocomplete
        apiKey={process.env.GOOGLE_MAPS_API_KEY}
        onPlaceSelected={(place) => {
          let streetNumber = "";
          let route = "";
          let city = "";
          let state = "";
          let zip = "";
          const lat = place.geometry?.location?.lat();
          const lng = place.geometry?.location?.lng();

          if (place.address_components) {
            for (const component of place.address_components) {
              const types = component.types;

              if (types.includes("street_number"))
                streetNumber = component.short_name;
              if (types.includes("route")) route = component.short_name;
              if (types.includes("locality")) city = component.long_name;
              if (types.includes("administrative_area_level_1"))
                state = component.short_name;
              if (types.includes("postal_code")) zip = component.long_name;
            }
          }

          const simpleAddress = `${streetNumber} ${route}`.trim();
          props.onChange(simpleAddress);

          props?.Inputs[props?.index]?.fields?.map((i: any) => {
            const fieldName = i?.systemFieldName?.toLowerCase();
            if (fieldName === "city") i.defaultValue = city;
            if (fieldName === "state") i.defaultValue = state;
            if (fieldName === "zipcode") i.defaultValue = zip;
            if (fieldName === "latitude") i.defaultValue = lat;
            if (fieldName === "longitude") i.defaultValue = lng;
          });
        }}
        onChange={(e: any) => {
          props.onChange(e.target.value);
        }}
        // placeholder={t(props.label)}
        className="form-control"
        ref={autoCompleteRef}
        options={{
          types: [],
          componentRestrictions: { country: "us" },
        }}
      />
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}
    </div>
  );
};

export default AutoAddress;
