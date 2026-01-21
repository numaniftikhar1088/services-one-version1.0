import React from "react";

const SpecimenSource = ({ fieldsData }: any) => {
  return (
    <>
      {" "}
      <>
        <div className="row">
          {fieldsData?.fieldValue.map((item: any, index: number) => (
            <div key={index} className="col-lg-6 col-md-6 col-sm-6">
              <div className="card card-bordered border-gray-500">
                <div className="card-header d-flex align-items-center bg-gray-100i">
                  <span className="fw-bold">{item.panelName}</span>
                </div>

                {item?.specimenSourceOption ? (
                  <div className="card-body">
                    <span className="badge badge-secondary round-3 py-1 text-wrap text-start">
                      {item?.specimenSourceOption?.specimenType}
                    </span>{" "}
                    <span className="text-muted">
                      {item?.specimenSourceOption?.specimenTypeOther}
                    </span>
                  </div>
                ) : (
                  <>
                    <div className="card-body">
                      <span className="badge badge-secondary round-3 py-1 text-wrap text-start">
                        {item?.specimenType}
                      </span>{" "}
                      <span className="text-muted">
                        {item?.specimenTypeOther}
                      </span>
                    </div>
                  </>
                )
                }
              </div>
            </div>
          ))}
        </div>

      </>
    </>
  );
};

export default SpecimenSource;
