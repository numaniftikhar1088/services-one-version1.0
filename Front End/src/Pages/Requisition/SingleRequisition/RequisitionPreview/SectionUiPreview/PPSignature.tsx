import useLang from "Shared/hooks/useLanguage";

const PPSignature = ({ signatureData }: any) => {
  const { t } = useLang();

  return (
    <>
      {" "}
      <div
        key={signatureData?.sectionName}
        className="col-lg-6 col-md-6 col-sm-12 px-3"
      >
        <div className="card border-gray-500 shadow-xs mb-3">
          <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
            {t(signatureData?.sectionName)}
          </div>
          <div className="card-body py-5">
            {signatureData.fields.map((signatureDataFields: any) => (
              <>
                {signatureDataFields.systemFieldName === "PatientSignature" ||
                signatureDataFields.systemFieldName === "PhysicianSignature" ? (
                  <>
                    {typeof signatureDataFields.fieldValue === "string" &&
                    signatureDataFields?.fieldValue?.startsWith(
                      "data:image/png;base64,"
                    ) ? (
                      <img
                        src={signatureDataFields?.fieldValue}
                        alt=""
                        style={{ width: "300px", height: "auto" }} // Adjust the width as needed
                      />
                    ) : (
                      <span>{atob(signatureDataFields?.fieldValue)}</span>
                    )}
                  </>
                ) : null}
              </>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default PPSignature;
