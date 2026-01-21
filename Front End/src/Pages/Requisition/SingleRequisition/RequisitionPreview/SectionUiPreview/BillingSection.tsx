import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { savePdfUrls } from "../../../../../Redux/Actions/Index";
import InsuranceService from "../../../../../Services/InsuranceService/InsuranceService";

const BillingSection = ({ billingSection, isLastSection }: any) => {
  const dispatch = useDispatch();
  const [options, setOptions] = useState<
    Array<{ value: number; label: string }>
  >([]);

  // Fetch options once
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const res = await InsuranceService.GetInsuranceProvidersDropdown(0);
        setOptions(res?.data || []);
      } catch (err) {
        console.error("Error fetching insurance providers", err);
      }
    };

    fetchOptions();
  }, []);

  const getProviderName = (id: number) => {
    return (
      options.find((provider) => provider.value === id)?.label ||
      "Unknown Provider"
    );
  };

  return (
    <div className="card card-bordered border-gray-500 overflow-hidden shadow-xs mb-3">
      <div className="card-body px-5 py-3">
        {billingSection.fields?.length > 0 ? (
          billingSection.fields.map((field: any, index: number) => (
            <div key={`${field.systemFieldName}-${index}`} className="row mb-1">
              <div className="col-lg-6 fw-600 fs-6">
                {field.displayName}&nbsp;:&nbsp;
              </div>
              <div className="col-lg-6 fs-6 text-end">
                {renderFieldValue(field, getProviderName, dispatch)}
              </div>
            </div>
          ))
        ) : (
          <span className="fw-500 text-muted">No Data Available</span>
        )}
      </div>
      {!isLastSection && <hr className="section-divider" />}
    </div>
  );
};

const renderFieldValue = (
  field: any,
  getProviderName: Function,
  dispatch: any
) => {
  switch (field?.systemFieldName) {
    case "PhotosForInsuranceCard":
    case "PhotoForDemographicInfo":
    case "PhotoForPrescribedMedication":
      return field?.fieldValue?.length === 0 ? (
        <span className="fw-500 text-muted">No File Selected</span>
      ) : (
        Array.isArray(field?.fieldValue) &&
        field?.fieldValue?.map((item: any, index: number) => (
          <div key={index} className="badge badge-secondary">
            <Link
              to="/docs-viewer"
              target="_blank"
              onClick={() => dispatch(savePdfUrls(item?.fileUrl))}
            >
              <i
                className="fa fa-file text-primary"
                style={{ fontSize: "18px" }}
              ></i>{" "}
              {item?.fileName}
            </Link>
          </div>
        ))
      );
    case "InsuranceProviderID":
      return getProviderName(field.fieldValue);
    case "NoSecondaryInsurance":
      return field?.fieldValue ? "Yes" : "No";

    default:
      return Array.isArray(field.fieldValue) ? field.fieldValue.map((i: any) => (<>
        {i.name}
      </>)) : field.fieldValue || "N/A";
  }
};

export default BillingSection;
