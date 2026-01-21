const AdditionalPanel = ({ fieldsData }: any) => {
  return (
    <>
      <div className="row">
        <div className="col-lg-12 col-xl-12 col-xxl-12 col-sm-12 fs-6 gap-3 mb-2">
          {Array.isArray(fieldsData?.fieldValue[0]?.testOptions) &&
            fieldsData?.fieldValue[0]?.testOptions?.map((option: any) => (
              <>
                <span className="badge badge-secondary round-3 py-1 text-wrap text-start">
                  {option?.testName}
                </span>
                <span></span>
              </>
            ))}
        </div>
      </div>
    </>
  );
};

export default AdditionalPanel;
