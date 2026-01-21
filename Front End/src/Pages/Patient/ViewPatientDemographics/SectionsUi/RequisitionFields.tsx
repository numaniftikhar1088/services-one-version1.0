import { showFieldValue } from "./showFields";
const RequisitionFields = (props: any) => {
  if (props?.fieldsInfo?.systemFieldName === "RepeatStart") {
    return (
      <>
        {Array.isArray(props?.fieldsInfo?.repeatFields) &&
          props.fieldsInfo.repeatFields.map((item: any, index: number) => (
            <div key={index}>{showFieldValue(item, props)}</div>
          ))}
      </>
    );
  } else {
    return <div>{showFieldValue(props.fieldsInfo, props)}</div>;
  }
};

export default RequisitionFields;
