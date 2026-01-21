import SectionListCard from "./SectionListCard";
import { t } from "i18next";
const SectionBody = (props: any) => {
  return (
    <>
      <div className="card shadow mb-4">
        <div
          style={{ background: `${props.colorList}` }}
          className="card-header min-h-40px d-flex justify-content-between align-items-center"
        >
          <h3 className="m-0"> {t(props?.SectionsInfo?.sectionName)}</h3>
        </div>
        <div className="row card-body px-6 py-4">
          <SectionListCard
            fields={props?.SectionsInfo?.fields}
            sectionDisplayName={props?.SectionsInfo?.sectionName}
            sectionIndex={props?.sectionIndex}
            displayData={props?.displayData}
            setDisplay={props?.setDisplay}
            loadData={props.loadData}
          />
        </div>
      </div>
    </>
  );
};

export default SectionBody;
