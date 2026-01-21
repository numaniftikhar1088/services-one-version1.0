import Files from "./SectionsUi/Files";
import InternalNote from "./SectionsUi/InternalNote";
import RequisitionFields from "./SectionsUi/RequisitionFields";
import SignatureText from "./SectionsUi/SignatureText";
export const renderSwitch = (props: any) => {
  const { sectionDisplayName, fieldsInfo, sectionId, fieldData } = props;

  switch (true) {
    case sectionDisplayName.toLowerCase() === "files":
      return (
        <Files
          fieldsInfo={fieldsInfo}
          RequisitionId={props.RequisitionId}
          RequisitionOrderId={props.RequisitionOrderId}
          RecordId={props.RecordId}
          RequisitionType={props.RequisitionType}
          loadData={props.loadData}
        />
      );

    case sectionId === 94 || sectionId === 76:
      return (
        <InternalNote
          fieldsInfo={fieldsInfo}
          RequisitionId={props.RequisitionId}
          RequisitionOrderId={props.RequisitionOrderId}
          RecordId={props.RecordId}
          RequisitionType={props.RequisitionType}
          loadData={props.loadData}
        />
      );
    case sectionId === 13 || sectionId === 14:
      return <SignatureText fieldsInfo={fieldsInfo} />;
    case sectionDisplayName !== "Files" ||
      sectionId !== 76 ||
      sectionId === 94 ||
      sectionDisplayName !== "Requisition" ||
      sectionId !== 13 ||
      sectionId !== 14:
      return <RequisitionFields fieldsInfo={fieldsInfo} fieldData={fieldData} />;
    default:
      return "";
  }
};
