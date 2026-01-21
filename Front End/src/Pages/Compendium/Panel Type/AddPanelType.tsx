import Select from "react-select";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "../../../Utils/Common";

function AddPanelType({
  setPosttable,
  setPostData,
  postData,
  handlesave,
  dropdown,
  handleCancel,
  handleChangeCategory,
  handleCheckChange,
  freezeInput,
  setFreezeInput,
}: any) {
  const { t } = useLang()
  return (
    <>
      <div id="ModalCollapse" className="card mb-5">
        <div className="align-items-center bg-light-warning card-header minh-42px d-flex justify-content-center justify-content-sm-between gap-1 px-5">
          <h4 className="m-1">{t("Add panel Type")}</h4>
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-secondary btn-sm btn-secondary--icon"
              onClick={handleCancel}
            >
              {t("Cancel")}
            </button>
            <button
              className="btn btn-primary btn-sm btn-primary--icon px-7"
              onClick={handlesave}
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
                <label className="required mb-2 fw-500">{t("Panel Type")}</label>
                <input
                  type="text"
                  name="itemName"
                  placeholder={t("Item Name")}
                  className="form-control bg-white mb-3 mb-lg-0  rounded-2 fs-8 h-30px"
                  value={postData.panelType}
                  disabled={freezeInput}
                  onChange={(e) =>
                    setPostData((oldData: any) => ({
                      ...oldData,
                      panelType: e.target.value,
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
                  name="itemDescription"
                  placeholder={t("Description")}
                  className="form-control bg-white mb-3 mb-lg-0  rounded-2 fs-8 h-30px"
                  value={postData.description}
                  onChange={(e) =>
                    setPostData((oldData: any) => ({
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
                <Select
                  menuPortalTarget={document.body}
                  theme={(theme: any) => styles(theme)}
                  name="itemType"
                  placeholder={("Select Item Type")}
                  options={dropdown}
                  styles={reactSelectSMStyle}
                  onChange={handleChangeCategory}
                  value={dropdown.filter(function (option: any) {
                    return option.value === postData.reqTypeId;
                  })}
                />
              </div>
            </div>
            <div className="col-xxl-3 col-xl-3 col-lg-3 col-md-3 col-sm-6 col-12 d-flex flex-column align-items-baseline">
              <label className="mb-2 fw-500">{("status")}</label>
              <div className="d-flex justify-content-center form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="isActive"
                  checked={postData.isActive}
                  onChange={handleCheckChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddPanelType;
