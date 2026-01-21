import SectionCardBody from "./SectionCardBody";
const SectionBodyData = (props: any) => {
  return (
    <>
      {Array.isArray(props?.fields) &&
        props?.fields.map((fieldsInfo: any, fieldIndex: number) => (
          <SectionCardBody
            fieldsInfo={fieldsInfo}
            sectionDisplayName={props?.sectionDisplayName}
            sectionIndex={props?.sectionIndex}
            fieldIndex={fieldIndex}
            displayData={props?.displayData}
            setDisplay={props?.setDisplay}
            loadData={props.loadData}
          />
        ))}
    </>
  );
};

export default SectionBodyData;
