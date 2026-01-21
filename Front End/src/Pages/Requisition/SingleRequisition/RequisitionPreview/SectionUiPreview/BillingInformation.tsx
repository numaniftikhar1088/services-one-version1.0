import BillingSection from "./BillingSection";

const BillingInformation = ({ reqSectionsInfo }: any) => {
  const billingSections =
    reqSectionsInfo?.reqSections?.filter(
      (section: { sectionId: number }) => section.sectionId === 5 || section.sectionId === 112
    ) || [];

  return (
    <div className="col-lg-6 col-md-6 col-sm-12 grid-item1">
      <div className="card card-bordered border-gray-500 overflow-hidden shadow-xs mb-3">
        {/* Common Heading */}
        <div className="align-items-center bg-gray-100i card-header d-flex fs-5 fw-500 min-h-35px px-5 text-dark">
          {billingSections.length > 0 && (
            <div>{billingSections[0].sectionName}</div>
          )}
        </div>

        {/* Body with All Sections */}
        <div className="card-body px-5 py-3">
          {billingSections.map((billingSection: any, index: number) => (
            <BillingSection
              key={`billing-${index}`}
              billingSection={billingSection}
              isLastSection={index === billingSections.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BillingInformation;
