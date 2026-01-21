import React from "react";
import useLang from "Shared/hooks/useLanguage";
import { ReactState } from "../../../Shared/Type";

interface Props {
  modalheader: string;
  handleSubmit: any;
  UserGroupList: Item[];
  AdminTypeList: Item1[];
  dropDownValues: any;
  isOpen: boolean;
  formData: any;
  changeHandler: any;
  errors: any;
  setDataAndErrors: any;
  setIsOpen: ReactState;
  onClose: any;

  editGridHeader: any;
}

export interface Item {
  [x: string]: any;
  userGroupId: number;
  name: string;
}
export interface Item1 {
  [x: string]: any;
  value: number;
  label: string;
}
const AddReferenceLab: React.FC<Props> = ({
  handleSubmit,
  UserGroupList,
  AdminTypeList,
  dropDownValues,
  isOpen,
  modalheader,
  formData,
  changeHandler,
  setDataAndErrors,
  errors,
  onClose,
  setIsOpen,

  editGridHeader,
}) => {
  const { t } = useLang();
  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3">
            <h5 className="m-0 ">{t(modalheader)}</h5>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                className={`btn btn-secondary btn-sm fw-bold ${
                  isOpen ? "" : "collapse"
                }`}
                onClick={onClose}
                aria-controls="SearchCollapse"
                aria-expanded={isOpen}
              >
                <span>
                  <i className="fa fa-times"></i>
                  <span>{t("Cancel")}</span>
                </span>
              </button>
              <button
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={handleSubmit}
              >
                <span>
                  <span>{t("Save")}</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AddReferenceLab;
