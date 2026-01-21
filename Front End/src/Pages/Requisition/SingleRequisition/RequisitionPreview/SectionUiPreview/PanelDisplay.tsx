const PanelDisplay = ({ fieldsData }: any) => {
  return (
    <>
      <div className="row">
        {fieldsData?.fieldValue.map((item: any) => (
          <>
            <div className="col-12">
              <div className="card shadow mb-4">
                <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
                  {item.isSelected && item.panelName}
                </div>
                <div className="card-body px-6 py-4 row ">
                  {item.testOptions.map(
                    (inner: any) =>
                      inner.isSelected && (
                        <div className="col-lg-2 col-md-2 col-sm-2 col-xl-2 my-1">
                          <span className="badge badge-secondary round-3 py-1 text-wrap text-start">
                            {inner.isSelected && inner.testName}
                          </span>
                        </div>
                      )
                  )}
                </div>
              </div>
            </div>
          </>
        ))}
      </div>
    </>
  );
};

export default PanelDisplay;
