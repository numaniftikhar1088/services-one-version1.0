
import SectionsList from "./SectionsList";

const SectionCard = (props: any) => {
  const colorList: string[] = [
    "#dcebd5",
    "#50cd89",
    "#7239ea",
    "#ffc700",
    "#f1416c",
    "#8B8989",
    "#8B0000",
    "#FF0000",
  ];
  props.setRecordId(props?.sectionData?.recordID);
  return (
    <>
      {props?.sectionData?.sections?.map((SectionsInfo: any, i: number) => (
        <div className={`ViewGrid-item ${SectionsInfo.sectionDisplayType}`}>
          <SectionsList
            SectionsInfo={SectionsInfo}
            colorList={colorList[0]}
            setReqStatus={props.setReqStatus}
            setStatus={props.setStatus}
            setStatusID={props.setStatusID}
            setReqTypeId={props.setReqTypeId}
            RequisitionId={props.RequisitionId}
            RequisitionOrderId={props.RequisitionOrderId}
            RecordId={props.RecordId}
            RequisitionType={props.RequisitionType}
            loadData={props.loadData}
          />
        </div>
      ))}
    </>
  );
};

export default SectionCard;
