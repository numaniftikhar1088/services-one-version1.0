import React from "react";

const Medication = ({ fieldsData }: any) => {
  return (
    <>
      {fieldsData?.fieldValue ? (
        fieldsData?.fieldValue?.map((item: any) => (
          <>
            <span className="badge badge-secondary round-3 py-1">
              {item?.medicationName}
            </span>
            <span> </span>
          </>
        ))
      ) : (
        <span className="text-muted fw-bold">Not Selected</span>
      )}
    </>
  );
};

export default Medication;
