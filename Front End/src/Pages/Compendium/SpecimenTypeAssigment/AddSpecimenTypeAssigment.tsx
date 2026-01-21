import React, { useEffect, useState } from "react";
import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import SpecimenTypeAssigmentService from "../../../Services/Compendium/SpecimenTypeAssigmentService";
import { reactSelectStyle, styles } from "../../../Utils/Common";
import PanelSelection from "./PanelSelection";

interface SpecimenType {
  value: number;
  label: string;
}

interface SpecimenTypeDetails {
  specimenTypeId: number;
  specimenType: string;
}
interface Requisition {
  value: number;
  label: string;
}

interface RequisitionDetails {
  reqTypeId: number;
  requisitionTypeName: string;
}

interface Props {
  values: any;
  errors: any;
  panels: any;
  sports2: any;
  loadData: any;
  setErrors: any;
  setValues: any;
  setPanels: any;
  setSports2: any;
  handleOnChange: any;
  editGridHeader: any;
  selectedPanels: any;
  setSelectedPanels: any;
  referenceLabOptions: any;
}

const AddSpecimenTypeAssigment: React.FC<Props> = ({
  errors,
  values,
  panels,
  sports2,
  loadData,
  setValues,
  setErrors,
  setPanels,
  setSports2,
  editGridHeader,
  selectedPanels,
  handleOnChange,
  setSelectedPanels,
  referenceLabOptions,
}) => {
  const { t } = useLang();

  const [SpecimenTypeList, setSpecimenTypeList] = useState<SpecimenType[]>([]);
  const [RequsitionList, setRequsitionList] = useState<Requisition[]>([]);

  const GetSpecimenType = () => {
    SpecimenTypeAssigmentService.SpecimenTypeLookup().then((res: any) => {
      let SpecimenTypeArray: SpecimenType[] = [];
      res?.data?.data.map(
        ({ specimenTypeId, specimenType }: SpecimenTypeDetails) => {
          let SpecimenTypeDetails: SpecimenType = {
            value: specimenTypeId,
            label: specimenType,
          };
          SpecimenTypeArray.push(SpecimenTypeDetails);
        }
      );
      setSpecimenTypeList(SpecimenTypeArray);
    });
  };

  const GetRequsition = () => {
    SpecimenTypeAssigmentService.RequisitionTypeLookup().then((res: any) => {
      let RequisitionArray: Requisition[] = [];
      res?.data?.data.forEach(
        ({ reqTypeId, requisitionTypeName }: RequisitionDetails) => {
          let RequisitionDetails: Requisition = {
            value: reqTypeId,
            label: requisitionTypeName,
          };
          RequisitionArray.push(RequisitionDetails);
        }
      );

      setRequsitionList(RequisitionArray);
    });
  };

  const clearPanels = () => {
    setPanels([]);
    setSports2([]);
    setSelectedPanels([]);
  };

  const onRequisitionSelect = async (e: any) => {
    clearPanels();

    setErrors((pre: any) => {
      return {
        ...pre,
        requisitionError: "",
      };
    });
    setValues((preVal: any) => {
      return {
        ...preVal,
        reqTypeId: e?.value,
      };
    });
  };

  const onReferenceSelect = async (e: any) => {
    clearPanels();

    setErrors((pre: any) => {
      return {
        ...pre,
        referenceLabError: "",
      };
    });
    setValues((preVal: any) => {
      return {
        ...preVal,
        refLabId: e?.value,
      };
    });
  };

  const getPanels = async () => {
    try {
      const res =
        await SpecimenTypeAssigmentService.getPanelsByReqTypeIdAndLabId(
          values.reqTypeId,
          values.refLabId
        );
      setPanels(res.data.data);
      setValues((preVal: any) => {
        return {
          ...preVal,
          panels: res.data.data,
        };
      });
    } catch (error) {
      console.error(t("Error fetching data:"), error);
    }
  };

  useEffect(() => {
    if (values.reqTypeId && values.refLabId) {
      getPanels();
    } else {
      setPanels([]);
      setSports2([]);
      setSelectedPanels([]);
    }
  }, [values.reqTypeId, values.refLabId, values.id]);

  const onSpecimenSelect = (e: any) => {
    setErrors((pre: any) => {
      return {
        ...pre,
        specimenError: "",
      };
    });
    setValues((preVal: any) => ({
      ...preVal,
      specimenTypeId: e?.value,
    }));
  };

  useEffect(() => {
    GetSpecimenType();
    GetRequsition();
  }, []);

  return (
    <div className="row">
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="required mb-2">{t("Specimen Type")}</label>
          <Select
            inputId={`SpecimenTypeAssigmentSpecimenType`}
            menuPortalTarget={document.body}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            options={SpecimenTypeList}
            name="specimenTypeId"
            placeholder={t("Select Specimen Type")}
            value={SpecimenTypeList.filter(function (option: any) {
              return option.value === values.specimenTypeId;
            })}
            isDisabled={editGridHeader}
            onChange={(e: any) => onSpecimenSelect(e)}
            isSearchable={true}
            isClearable={true}
            required={true}
            className="z-index-3"
          />
          <span style={{ color: "red" }}>{errors.specimenError}</span>
        </div>
      </div>
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <div className="fv-row mb-4">
          <label className="required mb-2">{t("Requisition Type")}</label>
          <Select
            inputId={`SpecimenTypeAssigmentRequisitionType`}
            menuPortalTarget={document.body}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            options={RequsitionList}
            name="reqTypeId"
            placeholder={t("Select Requisition Type")}
            value={RequsitionList.filter(function (option: any) {
              return option.value === values.reqTypeId;
            })}
            onChange={(e: any) => onRequisitionSelect(e)}
            isSearchable={true}
            isClearable={true}
            isDisabled={editGridHeader}
            className="z-index-3"
          />
          <span style={{ color: "red" }}>{errors.requisitionError}</span>
        </div>
      </div>
      <div className="col-lg-3 col-md-3 col-sm-6">
        <label className="mb-2 fw-500 required">{t("Reference Lab")}</label>
        <Select
          inputId={`SpecimenTypeAssigmentReferenceLab`}
          menuPortalTarget={document.body}
          className="z-index-3"
          styles={reactSelectStyle}
          theme={(theme: any) => styles(theme)}
          options={referenceLabOptions}
          name="refLabId"
          placeholder={t("Select Reference Lab")}
          value={referenceLabOptions.filter(function (option: any) {
            return option.value === values.refLabId;
          })}
          onChange={(e: any) => onReferenceSelect(e)}
          isSearchable={true}
          isClearable={true}
        />
        <span style={{ color: "red" }}>{errors.referenceLabError}</span>
      </div>

      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
        <label className="mr-2 mb-2 fw-bold">
          {t("Enable Specimen Source Field")}
        </label>
        <div className="form-check form-switch mb-2">
          <input
            id={`SpecimenTypeAssigmentSwitchButtonSource`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="isSpecimenSourceFieldShow"
            onChange={handleOnChange}
            checked={values.isSpecimenSourceFieldShow}
          />
        </div>
      </div>
      <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 mb-3">
        <label className="mr-2 mb-2 fw-bold">{t("Inactive/Active")}</label>
        <div className="form-check form-switch mb-2">
          <input
            id={`SpecimenTypeAssigmentSwitchButton`}
            className="form-check-input"
            type="checkbox"
            role="switch"
            name="isActive"
            disabled={editGridHeader}
            onChange={handleOnChange}
            checked={values.isActive}
            defaultChecked={true}
          />
        </div>
      </div>

      <div className="col-xxl-12 col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
        <PanelSelection
          setSports2={setSports2}
          facilities={panels}
          sports2={sports2}
          id={values?.id}
          loadGridData={loadData}
          setOpen={true}
          row={values.panels}
          selectedPanels={selectedPanels}
          setSelectedPanels={setSelectedPanels}
        />
      </div>
    </div>
  );
};

export default AddSpecimenTypeAssigment;
