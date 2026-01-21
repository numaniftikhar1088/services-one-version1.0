import PPSignature from "Pages/Requisition/SingleRequisition/RequisitionPreview/SectionUiPreview/PPSignature";
import useLang from "Shared/hooks/useLanguage";
import { isJson } from "Utils/Common/Requisition";

const Preview = ({ previewData }: any) => {
  const { t } = useLang();
  const data = previewData;

  let signArray: any = [];
  data?.map((item: any) =>
    item?.sectionId === 13 || item?.sectionId === 14
      ? signArray?.push(item)
      : null
  );

  // SectionCard component
  const SectionCard = ({ section }: any) => (
    <div className="col-lg-6 col-md-6 col-sm-12 px-3">
      <div className="card border-gray-500 shadow-xs mb-3">
        <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
          {t(section?.sectionName)}
        </div>
        <div className="card-body px-5 py-3">
          {section?.fields?.map((field: any, fieldIndex: number) => {
            const fieldValue = isJson(field?.fieldValue ?? "{}")
              ? JSON.parse(field?.fieldValue)
              : field?.fieldValue;

            return (
              <div key={field?.displayName} className="row mb-1">
                {section?.sectionId !== 5 && (
                  <div className="col-lg-6 fw-600 fs-6">
                    {t(field?.displayName)}
                  </div>
                )}
                <div
                  style={typeof fieldValue === "object" ? jsonStyle : {}}
                  className={
                    typeof fieldValue === "object"
                      ? ""
                      : `col-lg-6 fs-6 text-end`
                  }
                >
                  {typeof fieldValue === "object"
                    ? Object.entries(fieldValue).map(([key, value]) => (
                        <div style={{ display: "flex" }} key={key}>
                          <strong style={{ width: "100%", textAlign: "left" }}>
                            {t(key)}:
                          </strong>
                          <span style={{ width: "100%", textAlign: "right" }}>
                            {value as string | number | boolean}
                          </span>
                        </div>
                      ))
                    : field?.selectedText ?? fieldValue}
                </div>
                {typeof fieldValue === "object" &&
                  fieldIndex < section?.fields?.length - 1 && (
                    <hr className="my-2" />
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="mt-5">
      <div className="req-preview">
        <div className="card card-bordered border-gray-500 overflow-hidden shadow-xs mb-3">
          <div className="card-body px-2 row grid1">
            {previewData
              .filter((item: any) => ![13, 14].includes(item?.sectionId))
              .map((section: any) => (
                <SectionCard key={t(section.sectionName)} section={section} />
              ))}
          </div>
        </div>
      </div>
      <div className="d-flex">
        {signArray.map((signatureData: any) => (
          <PPSignature key={signatureData.id} signatureData={signatureData} />
        ))}
      </div>
    </div>
  );
};

// Extracted JSON styling for better readability
const jsonStyle = {
  background: "#f6fdff",
  borderRadius: 10,
  padding: 10,
};

export default Preview;
