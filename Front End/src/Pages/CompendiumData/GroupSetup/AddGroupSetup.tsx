import { AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import useLang from "Shared/hooks/useLanguage";
import GroupSetupService from "../../../Services/Compendium/GroupSetup";

interface Props {
  values: any;
  handleChange: any;
  errors: any;
  setErrors: any;
  setValues: any;
}
const AddGroupSetup: React.FC<Props> = ({
  values,
  handleChange,
  errors,
  setErrors,
  setValues,
}) => {
  const { t } = useLang();

  const [req, setReq] = useState<any>([]);
  const Lookuprequisition = () => {
    GroupSetupService.getRequisitionTypeLookup()
      .then((res: AxiosResponse) => {
        setReq(res?.data?.data);
      })
      .catch((err: string) => {});
  };

  useEffect(() => {
    Lookuprequisition();
  }, []);
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;

    if (type === "checkbox") {
      setValues((preVal: any) => {
        return {
          ...preVal,
          isActive: e.target.checked,
        };
      });
    } else {
      setValues((preVal: any) => {
        return {
          ...preVal,
          name: value,
          description: value,
        };
      });
      setErrors((preVal: any) => {
        return {
          ...preVal,
          GroupNameError: "",
        };
      });
    }
  };
  const handleOnChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValues((preVal: any) => {
      return {
        ...preVal,
        description: value,
      };
    });
    setErrors((preVal: any) => {
      return {
        ...preVal,
        DisplayNameError: "",
      };
    });
  };
  return (
    <div className="row">
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="required mb-2 fw-500">{t("Group Name")}</label>

        {values.id ? (
          <input
            id={`GroupSetupGroupName`}
            className="form-control bg-secondary mb-2"
            placeholder={t("Group Name")}
            name="name"
            value={values?.name}
            onChange={handleOnChange}
            disabled
          />
        ) : (
          <>
            <input
              id={`GroupSetupGroupName`}
              className="form-control bg-transparent mb-2"
              placeholder={t("Group Name")}
              name="name"
              value={values?.name}
              onChange={handleOnChange}
            />
            <span style={{ color: "red" }}>{t(errors.GroupNameError)}</span>
          </>
        )}
      </div>
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="required mb-2 fw-500">{t("Display Name")}</label>
        <input
          id={`GroupSetupDescription`}
          className="form-control bg-transparent mb-2"
          placeholder={"Display Name"}
          name="description"
          value={values?.description}
          onChange={handleOnChange2}
        />
        <span style={{ color: "red" }}>{t(errors.DisplayNameError)}</span>
      </div>

      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="mb-2 fw-500">{t("Requisition Type")}</label>
        <select
          id={`GroupSetupRequisitionType`}
          className="form-select"
          name="reqTypeName"
          onChange={handleChange}
          value={values?.reqTypeId + "," + values?.reqTypeName}
          disabled={values.id ? true : false}
        >
          <option>{t("--- Select Option ---")}</option>
          {req?.map((item: any) => (
            <option
              id={item?.requisitionTypeName}
              value={item?.reqTypeId + "," + item?.requisitionTypeName}
            >
              {item?.requisitionTypeName}
            </option>
          ))}
        </select>
      </div>
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="mr-2 mb-2 fw-bold">{t("Inactive/Active")}</label>
        <div className="form-check form-switch mt-2">
          <input
            id={`GroupSetupSwitchButton`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="isActive"
            onChange={handleOnChange}
            checked={values?.isActive ? true : false}
            defaultChecked={true}
          />
        </div>
      </div>
    </div>
  );
};

export default AddGroupSetup;
