import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Requisition from "../../../Services/Requisition/RequisitionTypeService";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
interface Props {
  handleOnChange: any;
  values: any;
  setValues: any;
  handleChangePanel: any;
  handleChangeFacility: any;
  handleChangecode: any;
  errors: any;
  setErrors: any;
  reference: any;
  setReference: any;
  setRequisition: any;
  requisition: any;
}
const AddDrugAllergy: React.FC<Props> = ({
  handleOnChange,
  values,
  handleChangePanel,
  handleChangeFacility,
  handleChangecode,
  errors,
  setErrors,
  setValues,
  reference,
  setReference,
  requisition,
  setRequisition,
}) => {
  const { t } = useLang();

  const [pen, setPen] = useState<any>([]);
  const handleChangeReference = (e: any) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        refLabId: e?.value,
        referenceLab: e?.label,
      };
    });
    setReference((preVal: any) => {
      return {
        ...preVal,
        value: e?.value,
        label: e?.label,
      };
    });
  };
  const handleChangeRequisition = (e: any) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        reqTypeId: e?.value,
        requisition: e?.label,
      };
    });
    setRequisition((preVal: any) => {
      return {
        ...preVal,
        value: e?.value,
        label: e?.label,
      };
    });
    setErrors((preVal: any) => {
      return {
        ...preVal,
        RequisitionError: "",
      };
    });
  };
  const GetPanelLookup = (id: number) => {
    Requisition.GetPanelLookup(id)
      .then((res: AxiosResponse) => {
        setPen(res?.data?.data);
      })
      .catch((err: string) => {});
  };
  useEffect(() => {
    GetPanelLookup(values.reqTypeId);
  }, [values.reqTypeId]);
  const [ref, setRef] = useState<any>([]);
  const [req, setReq] = useState<any>([]);
  const [fac, setFac] = useState<any>([]);
  const [des, setDes] = useState<any>([]);
  const ReferenceLabLookup = () => {
    Requisition.GetReferenceLabLookup()
      .then((res: AxiosResponse) => {
        setRef(res?.data);
      })
      .catch((err: string) => {});
  };
  const RequisitionLookup = () => {
    Requisition.GetRequisitionLookup()
      .then((res: AxiosResponse) => {
        setReq(res?.data);
      })
      .catch((err: string) => {});
  };
  const FacilityLookup = () => {
    Requisition.GetFacilityLookup()
      .then((res: AxiosResponse) => {
        const transformedFac = res?.data.map((item: any) => ({
          value: item.facilityId,
          label: item.facilityName,
        }));
        setFac(transformedFac);
      })
      .catch((err: string) => {});
  };
  const DescriptionLookup = () => {
    Requisition.GetDescriptionLookup()
      .then((res: AxiosResponse) => {
        setDes(res.data[0]);
      })
      .catch((err: string) => {});
  };
  useEffect(() => {
    ReferenceLabLookup();
    RequisitionLookup();
    FacilityLookup();
  }, []);
  useEffect(() => {
    DescriptionLookup();
  }, []);

  return (
    <>
      <div className="row">
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="required mb-2 fw-500">
            {t("Drug Description")}
          </label>
          <select
            id={`AssignedDrugAllergyDrugDescription`}
            className="form-select"
            name="drugDescription"
            onChange={handleChangecode}
            value={values?.drugDescription}
          >
            <option>{t("Select an option")}</option>
            {des?.map((item: any) => (
              <>
                <option id={item?.description} value={item.description}>
                  {item?.description}
                </option>
              </>
            ))}
          </select>
          <span style={{ color: "red" }}>{errors.DrugDescriptionErrors}</span>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="required mb-2 fw-500">{t("Code")}</label>
          <input
            id={`AssignedDrugAllergyCode`}
            className="form-control bg-light-secondary mb-2"
            placeholder={t("Drug Code")}
            name="code"
            value={values?.code}
            disabled
          />
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="required mb-2 fw-500">{t("Requisition")}</label>

          <Select
            inputId={`AssignedDrugAllergyRequisition`}
            menuPortalTarget={document.body}
            className="z-index-3"
            name="requisition"
            value={req.filter(
              (option: any) => option.value === values.reqTypeId
            )}
            onChange={handleChangeRequisition}
            options={req}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            placeholder={t("Select Requisition")}
            isSearchable={true}
            isClearable={true}
          />
          <span style={{ color: "red" }}>{errors.RequisitionError}</span>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="mb-2 fw-500">{t("Reference Lab")}</label>
          <Select
            inputId={`AssignedDrugAllergyReferenceLab`}
            menuPortalTarget={document.body}
            className="z-index-3"
            name="referenceLab"
            placeholder={t("Select Refernce Lab")}
            value={ref.filter(
              (option: any) => option.value === values.refLabId
            )}
            onChange={handleChangeReference}
            options={ref}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            isSearchable={true}
            isClearable={true}
          />
          <span style={{ color: "red" }}>{errors.ReferenceError}</span>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="mb-2 fw-500">{t("Facility")}</label>
          <Select
            inputId={`AssignedDrugAllergyFacility`}
            menuPortalTarget={document.body}
            className="z-index-3"
            name="facility"
            placeholder={t("Select Facility")}
            value={fac.filter(
              (option: any) => option.value === values.facilityId
            )}
            onChange={handleChangeFacility}
            options={fac}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            isSearchable={true}
            isClearable={true}
          />
          <span style={{ color: "red" }}>{errors.FacilityError}</span>
        </div>
        <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className="mb-2 fw-500">{t("Panel")}</label>
          <select
            id={`AssignedDrugAllergyPanel`}
            className="form-select"
            name="panel"
            onChange={handleChangePanel}
            value={values?.panelId + "++" + values?.panel}
          >
            <option>{t("--- Select Panel ---")}</option>
            {pen?.map((item: any) => (
              <option
                id={item?.panelDisplayName}
                value={item?.panelId + "++" + item?.panelDisplayName}
              >
                {item?.panelDisplayName}
              </option>
            ))}
          </select>
        </div>
        <div className=" col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
          <label className=" required mr-2 mb-2 fw-bold">
            {t("Inactive/Active")}
          </label>
          <div className="form-check form-switch mb-2">
            <input
              id={`AssignedDrugAllergySwitchButton`}
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="status"
              onChange={handleOnChange}
              checked={values?.status}
              defaultChecked={true}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDrugAllergy;
