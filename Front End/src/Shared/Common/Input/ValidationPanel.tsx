import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useLang from 'Shared/hooks/useLanguage'

const ValidationPanel = (props: any) => {
  const { t } = useLang();
  const location = useLocation()
  useEffect(() => {
    if (!location?.state?.reqId) return;

    let parsedData: any = props.defaultValue;

    if (typeof props.defaultValue === "string") {
      try {
        parsedData = JSON.parse(props.defaultValue);
      } catch (e) {
        console.error("Failed to parse props.defaultValue:", e);
        parsedData = {}; // fallback to avoid crash
      }
    }
    props.Inputs[props.index].fields[props.fieldIndex].defaultValue = parsedData;
  }, [props.defaultValue]);
  console.log("ValidationPanel props:", props.Inputs[props.index].fields[props.fieldIndex]);
  return (
    <div>
      {props.error && (
        <div className="form__error">
          <span>{t(props.error)}</span>
        </div>
      )}

    </div>
  )
}

export default ValidationPanel