import RequisitionFields from "./SectionsUi/RequisitionFields";

const SectionCardBody = (props: any) => {
  return (
    <>
      <RequisitionFields
        fieldsInfo={props.fieldsInfo}
        sectionIndex={props?.sectionIndex}
        fieldIndex={props?.fieldIndex}
        displayData={props?.displayData}
        setDisplay={props?.setDisplay}
        loadData={props.loadData}
      />
    </>
  );
};

export default SectionCardBody;
