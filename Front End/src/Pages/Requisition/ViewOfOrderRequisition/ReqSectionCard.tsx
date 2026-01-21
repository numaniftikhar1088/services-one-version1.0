import React from "react";
import SectionsList from "./SectionsList";
import { t } from "i18next";

const ReqSectionCard = (props: any) => {
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

  if (props.sectionData?.reqtypeID) {
    props.setReqTypeId && props.setReqTypeId(props.sectionData?.reqtypeID);
  }
  return (
    <>
      <div
        style={{ background: `#dcebd5` }}
        className="card-header min-h-35px justify-content-between align-items-center mb-3"
      >
        <h3 className="m-0">{t(props.sectionData?.reqDisplayName)}</h3>
      </div>
      {props?.sectionData?.sections?.map((SectionsInfo: any, i: number) => (
        <div
          className={`ViewGrid-item ${SectionsInfo.sectionDisplayType}`}
          key={i}
        >
          <SectionsList
            SectionsInfo={SectionsInfo}
            colorList={colorList[0]}
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

export default ReqSectionCard;
