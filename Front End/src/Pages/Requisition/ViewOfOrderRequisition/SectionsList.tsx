import React from "react";
import SectionListCard from "./SectionListCard";
import ReqSectionCard from "./ReqSectionCard";
import { t } from "i18next";

const SectionBody = (props: any) => {
  if (props?.SectionsInfo?.requisitionStatusId) {
    props?.setReqStatus &&
      props?.setReqStatus(props?.SectionsInfo?.requisitionStatusId);
    props.setStatus(props?.SectionsInfo?.requisitionStatus);
    props.setStatusID(props?.SectionsInfo?.requisitionStatusId);
  }
  return (
    <>
      <div className="card shadow mb-4">
        {props?.SectionsInfo?.sectionId === 24 ? null : (
          <div
            style={{ background: `${props.colorList}` }}
            className="card-header min-h-40px d-flex justify-content-between align-items-center"
          >
            <h3 className="m-0">
              {" "}
              {t(props?.SectionsInfo?.sectionDisplayName) ??
                t(props?.SectionsInfo?.reqDisplayName)}
            </h3>
          </div>
        )}

        <div className="row card-body px-6 py-4">
          {props?.SectionsInfo?.requistions?.length > 0 ? (
            props?.SectionsInfo?.requistions?.map((sectionData: any) => (
              <ReqSectionCard
                sectionData={sectionData}
                setReqTypeId={props.setReqTypeId}
                sectionId={props?.SectionsInfo?.sectionId}
                RequisitionId={props.RequisitionId}
                RequisitionOrderId={props.RequisitionOrderId}
                RecordId={props.RecordId}
                RequisitionType={props.RequisitionType}
                loadData={props.loadData}
              />
            ))
          ) : (
            <SectionListCard
              fields={props?.SectionsInfo?.fields}
              sectionDisplayName={
                props?.SectionsInfo?.sectionDisplayName ??
                props?.SectionsInfo?.reqDisplayName
              }
              RequisitionId={props.RequisitionId}
              RequisitionOrderId={props.RequisitionOrderId}
              RecordId={props.RecordId}
              RequisitionType={props.RequisitionType}
              sectionId={props?.SectionsInfo?.sectionId}
              loadData={props.loadData}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SectionBody;
