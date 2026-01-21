import React, { SetStateAction, useEffect } from "react";
import Select from "react-select";
import Input from "../../../../Shared/Common/Input/Input";
// import useLang from "Shared/hooks/useLanguage";
import useLang from "../../../../Shared/hooks/useLanguage";
import { ReactState } from "../../../../Shared/Type";
import { reactSelectStyle, styles } from "../../../../Utils/Common";
import AdditionalUserRole from "./AdditionalUserRole";
import InputMask from 'react-input-mask';
interface Props {
  modalheader: string;
  handleSubmit: any;
  // setValues: any;
  // values: IFormValues;
  UserGroupList: Item[];
  AdminTypeList: Item1[];
  dropDownValues: any;
  isOpen: boolean;
  formData: any;
  changeHandler: any;
  changeHandlerForNames: any;
  errors: any;
  setDataAndErrors: any;
  setIsOpen: ReactState;
  onClose: any;
  GetDataAgainstRoles: any;
  GetDataAgainstRolesByUserId: any;
  checkboxes: any;
  setCheckboxes: any;
  editGridHeader: any;
  ValidEmail: any;
  isEmailExistError: any;
  adminEmail: string;
  setAdminEmail: React.Dispatch<SetStateAction<string>>;
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
const AddUser: React.FC<Props> = ({
  handleSubmit,
  //  values,
  //  setValues,
  UserGroupList,
  dropDownValues,
  isOpen,
  modalheader,
  formData,
  changeHandler,
  changeHandlerForNames,
  setDataAndErrors,
  errors,
  onClose,
  GetDataAgainstRoles,
  checkboxes,
  setCheckboxes,
  editGridHeader,
  isEmailExistError,
  adminEmail,
  setAdminEmail,
}) => {
  const { t } = useLang();

  useEffect(() => {
    if (!adminEmail.length) {
      setAdminEmail(formData?.adminEmail?.value);
    }
  }, [formData?.adminEmail?.value]);

  return (
    <>
      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
        <div className="card shadow-sm mb-3 rounded">
          <div className="align-items-center bg-light-warning card-header d-flex justify-content-center justify-content-sm-between gap-3 minh-42px">
            <h5 className="m-0 ">{t(modalheader)}</h5>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id={`AdminUserListCancel`}
                className={`btn btn-secondary btn-sm fw-bold ${isOpen ? "" : "collapse"
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
                id={`AdminUserListSave`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={handleSubmit}
              >
                <span>
                  <span>{t("Save")}</span>
                </span>
              </button>
            </div>
          </div>

          <div className="card-body py-md-4 py-3">
            <div className="row">
              <input
                type="hidden"
                name="id"
                onChange={changeHandler}
                value={formData?.id?.value}
              //loading={loading}
              />
              <Input
                type="text"
                label={t("First Name")}
                name="firstName"
                onChange={changeHandlerForNames}
                parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                placeholder={t("First Name")}
                value={formData?.firstName?.value}
                error={t(errors?.firstName)}
                //loading={loading}
                required={true}
              />
              <Input
                type="text"
                label={t("Last Name")}
                name="lastName"
                onChange={changeHandlerForNames}
                parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                placeholder={t("Last Name")}
                value={formData?.lastName?.value}
                error={t(errors?.lastName)}
                required={true}
              //loading={loading}
              />
              <>
                <Input
                  type="text"
                  label={t("Admin Email")}
                  name="adminEmail"
                  onChange={changeHandler}
                  parentDivClassName="col-lg-3 col-md-6 col-sm-12"
                  placeholder={t("Admin Email")}
                  value={formData?.adminEmail?.value}
                  error={
                    t(errors?.adminEmail) !== null
                      ? t(errors?.adminEmail)
                      : t(isEmailExistError)
                  }
                  required={true}
                />
              </>
              <div className="col-lg-3 col-md-6 col-sm-12">
                <label className="mb-2 fw-500">
                  {t('Phone Number')}
                </label>
                <InputMask
                  mask="(999) 999 9999"
                  value={formData?.phoneNumber?.value}
                  type="tel"
                  name="phoneNumber"
                  onChange={changeHandler}
                  className={`form-control bg-transparent ${errors.phoneNumber ? 'is-invalid' : ''
                    }`}
                  placeholder={t('(999) 999 9999')}
                  inputMode="numeric"
                />
                {errors.phoneNumber && (
                  <p className="text-danger px-2">
                    {t('Phone number must be 10 digits.')}
                  </p>
                )}
              </div>
              <div
                className="col-lg-3 col-md-6 col-sm-12"
                style={{ zIndex: "10" }}
              >
                <label className="mb-2 fw-500 required">
                  {t("Admin Type")}
                </label>
                <Select
                  inputId={`AdminUserListAdminType`}
                  menuPortalTarget={document.body}
                  styles={reactSelectStyle}
                  theme={(theme: any) => styles(theme)}
                  options={UserGroupList}
                  onChange={(event: any) => {
                    const updatedData = {
                      ...formData,
                      adminType: {
                        ...formData["adminType"],
                        value: event.value,
                        touched: true,
                      },
                    };
                    setDataAndErrors(updatedData);
                    GetDataAgainstRoles(event.value);
                  }}
                  isDisabled={!editGridHeader ? false : true}
                  value={dropDownValues?.UserGroupList.filter(function (
                    option: any
                  ) {
                    return option.value === String(formData.adminType.value);
                  })}
                />
                <div className="form__error">
                  <span>{t(errors?.adminType)}</span>
                </div>
              </div>
            </div>
            <br />

            <AdditionalUserRole
              checkboxes={checkboxes}
              setCheckboxes={setCheckboxes}
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default AddUser;
