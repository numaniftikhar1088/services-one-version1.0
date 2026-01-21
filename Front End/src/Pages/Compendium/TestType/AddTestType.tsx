import React from "react";
import Select from "react-select";
import { CategoryChangeEvent, FormData } from ".";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";
import useLang from './../../../Shared/hooks/useLanguage';

interface Option {
  value: number;
  label: string;
}
interface Props {
  setAddBtn: React.Dispatch<React.SetStateAction<boolean>>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  dropdown: Option[];
  handleSave: () => Promise<boolean>;
  handleChangeCategory: (e: CategoryChangeEvent) => void;
  handleCheckChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  freezeInput: boolean
  initialFormData: FormData
}

const AddTestType: React.FC<Props> = (
  {
    setAddBtn,
    formData,
    setFormData,
    dropdown,
    handleSave,
    handleChangeCategory,
    handleCheckChange,
    freezeInput,
    initialFormData
  }) => {
    const {t} = useLang()
  return (
    <div id="ModalCollapse" className="card mb-5">
      <div className="align-items-center bg-light-warning card-header minh-2.625rem d-flex justify-content-center justify-content-sm-between gap-1 px-5">
        <h4 className="m-1">{t("Add Test Type")}</h4>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            className="btn btn-secondary btn-sm btn-secondary--icon"
            onClick={() => {
              setAddBtn(false);
              setFormData(initialFormData);
            }
            }
          >
            {t("Cancel")}
          </button>
          <button
            className="btn btn-primary btn-sm btn-primary--icon px-7"
            onClick={() => {
              handleSave();
            }}
          >
            <span>
              <span>{t("Save")}</span>
            </span>
          </button>
        </div>
      </div>

      <div id="form-search" className=" card-body px-5">
        <div className="row">
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
            <div className="fv-row mb-4">
              <label className="required mb-2 fw-500">{t("Test Type")}</label>
              <input
                type="text"
                name="testType"
                placeholder={t("Item Name")}
                className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-1.875rem"
                value={formData.testType}
                disabled={freezeInput}
                onChange={(e) =>
                  setFormData((oldData: FormData) => ({
                    ...oldData,
                    testType: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
            <div className="fv-row mb-4">
              <label className="mb-2 fw-500">{t("Description")}</label>
              <input
                type="text"
                name="description"
                placeholder={t("Description")}
                className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-1.875rem"
                value={formData.description}
                onChange={(e) =>
                  setFormData((oldData: FormData) => ({
                    ...oldData,
                    description: e.target.value,
                  }))
                }
              />
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12">
            <div className="fv-row mb-4">
              <label className="mb-2 fw-500 required">{t("Requisition Type")}</label>
              <Select<Option>
                theme={(theme: any) => styles(theme)}
                menuPortalTarget={document.body}
                name="itemType"
                placeholder={t("Select Item Type")}
                styles={reactSelectSMStyle}
                value={dropdown.filter(function (option: Option) {
                  return option.value === formData.reqTypeId;
                })}
                onChange={(selectedOption, actionMeta) => {
                  handleChangeCategory({ value: selectedOption ? selectedOption.value : 0 });
                }}
                options={dropdown}
              />
            </div>
          </div>
          <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 d-flex flex-column align-items-baseline">
            <label className="mb-2 fw-500 required">{t("Status")}</label>
            <div className="d-flex justify-content-center form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                role="switch"
                name="isActive"
                checked={formData.isActive}
                onChange={handleCheckChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  );
};

export default AddTestType;