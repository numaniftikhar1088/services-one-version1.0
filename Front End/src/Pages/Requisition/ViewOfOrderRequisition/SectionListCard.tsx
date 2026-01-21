import SectionCardBody from "./SectionCardBody";

const SectionBodyData = (props: any) => {
  return (
    <>
      {Array.isArray(props?.fields) &&
        props?.fields.map((fieldsInfo: any) => (
          <SectionCardBody
            fieldsInfo={fieldsInfo}
            sectionDisplayName={props?.sectionDisplayName}
            sectionId={props?.sectionId}
            RequisitionId={props.RequisitionId}
            RequisitionOrderId={props.RequisitionOrderId}
            RecordId={props.RecordId}
            RequisitionType={props.RequisitionType}
            loadData={props.loadData}
            fieldData={props?.fields}
          />
        ))}
    </>
  );
};

export default SectionBodyData;
