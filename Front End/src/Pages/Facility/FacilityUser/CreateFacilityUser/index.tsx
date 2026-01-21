import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Commonservice from "../../../../Services/CommonService";
import UserManagementService from "../../../../Services/UserManagement/UserManagementService";
import useForm from "../../../../Shared/hooks/useForm";
import { InputChangeEvent } from "../../../../Shared/Type";
import { PortalTypeEnum } from "../../../../Utils/Common/Enums/Enums";
import validate from "../../../../Utils/validate";
import {
  initialState
} from "../../../Admin/InitialState";
import { AddUser } from "./AddUser";
export interface IFormValues {
  facilitiesIds: [];
  [key: string]: string | boolean | null | number | Array<string>;
}
export interface IPage {
  claimsId: number;
  isChecked: boolean;
}
export interface IAdminType {
  value: number;
  label: string;
}
export interface IUserGroup {
  userGroupId: number;
  name: string;
}
export default function AddFacilityUser() {
  const navigate = useNavigate();
  const [activeType, setActiveType] = useState("0");
  const [check, setCheck] = useState(true);
  const {
    formData,
    setFormData,
    setDataAndErrors,
    errors,
    changeHandler,
    setErrors,
  }: any = useForm(initialState, validate, activeType, check);
  useEffect(() => {
    loadFacilities();
    loadData();
    loadData1();
  }, []);
  const [dropDownValues, setDropDownValues] = useState({
    UserGroupList: [],
    AdminTypeList: [],
  });

  const [values, setValues] = useState<IFormValues>({
    facilitiesIds: [],
  });
  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const type = e.target.type;
    const name = e.target.name;
    const value = e.target.value;
    setValues((preVal: any) => {
      return {
        ...preVal,
        [name]: value,
      };
    });
  };

  const changeHandlerForNames = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: {
        value: value,
      },
    });
  };
  const changeHandlerForNpi = (e: any) => {
    const inputValue = e.target.value;
    const numericValue = inputValue.replace(/\D/g, "").slice(0, 10);
    setFormData({
      ...formData,
      npiNumber: {
        ...formData.npiNumber,
        value: numericValue,
      },
    });
  };
  const [emailError, setEmailError] = useState(true);
  const [userNameError, setUserNameError] = useState(true);
  function isValidEmail(email: any) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
  const changeHandlerForEmail = (e: any) => {
    const inputValue = e.target.value.toLowerCase();
    setEmailError(true);
    setFormData({
      ...formData,
      email: {
        ...formData.email,
        value: inputValue,
      },
    });
  };
  const changeHandlerForUserName = (e: any) => {
    setUserNameError(true);
    setFormData({
      ...formData,
      username: {
        ...formData?.username,
        value: e?.target?.value,
      },
    });
  };
  const [isEmailExistError, setIsEmailExistError] = useState("");

  const ValidEmail = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var validEmailRequest = {
        keyValue: e.target.value,
        id: null,
      };
      Commonservice.isValidEmail(validEmailRequest)
        .then((res: AxiosResponse) => {
          if (res.data === true) {
            toast.error("Email Already Exist");
            setIsEmailExistError("Email Already Exist");
          } else {
            setIsEmailExistError("");
          }
        })
        .catch((err: AxiosError) => {
          console.log(err);
        });
    }
  };
  const [isUserNameExistError, setIsUserNameExistError] = useState("");
  const ValidUsername = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var usernameRequest = {
        keyValue: e.target.value,
        id: null,
      };
      Commonservice.isValidUsername(usernameRequest)
        .then((res: AxiosResponse) => {
          if (!res.data) {
            toast.warning("Username Already Exist");
            setCheck(false);
            setIsUserNameExistError("Username Already Exist");
          } else {
            setIsUserNameExistError("");
            setCheck(true);
          }
        })
        .catch((err: AxiosError) => {});
    }
  };
  const loadData = () => {
    UserManagementService.getUserType()
      .then((res: AxiosResponse) => {
        let AdminTypeArray: any = [];
        res?.data?.forEach((val: IAdminType) => {
          let adminTypeDetails = {
            value: val?.value,
            label: val?.label,
          };
          AdminTypeArray.push(adminTypeDetails);
        });
        setDropDownValues((pre: any) => {
          return {
            ...pre,
            AdminTypeList: AdminTypeArray,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const loadData1 = () => {
    UserManagementService.GetAllUserRoleList(PortalTypeEnum.Facility)
      .then((res: AxiosResponse) => {
        setDropDownValues((pre: any) => {
          return {
            ...pre,
            UserGroupList: res?.data?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const [loading, setLoading] = useState(false);
  const [facilities, setFacilities] = useState([]);
  const loadFacilities = () => {
    setLoading(true);
    UserManagementService.GetFacilitiesLookup()
      .then((res: AxiosResponse) => {
        setFacilities(res?.data);
        setSports2(res.data.data.facilities);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => setLoading(false));
  };

  const [checkboxes, setCheckboxes] = useState([]);
  ////////////-----------------Get Data Against Roles-------------------///////////////////
  const GetDataAgainstRoles = async (RoleId: number) => {
    await UserManagementService?.getByIdAllUserRolesAndPermissions(RoleId)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          setCheckboxes(res?.data?.data.modules);
        } else if (res?.data?.status === 400) {
          toast.error(res?.data?.message);
        }
      })
      .catch((err: AxiosError) => {
        console.log(err);
      });
  };

  const [loader, setLoader] = useState(false);
  const handleSubmit = (e: any) => {
    let formErrors: any;
    formErrors = validate(formData, true);
    setErrors(formErrors);
    let size = Object.keys(formErrors).length;
    // if (
    //   (size === 0 && formData?.adminType?.value === "72") ||
    //   (formData?.adminType?.value != "72" && (size == 0 || size == 1))
    // ) {
      setLoader(false);
      if (isValidEmail(formData.email.value) || formData.email.value === "") {
        setEmailError(true);
        if (isEmailExistError === "" || isUserNameExistError === "") {
          e.preventDefault();
          if (values.facilitiesIds.length === 0) {
            toast.error("Please select at least one facility");
            setLoader(false);
            return;
          }
          setLoader(true);
          let objToSend = {
            id: null,
            facilities: values.facilitiesIds,
            adminEmail: formData.email.value,
            adminType: formData.adminType.value,
            firstName: formData.firstName.value,
            lastName: formData.lastName.value,
            npiNumber: formData.npiNumber.value,
            stateLicense: formData.stateLicense.value,
            accountType: parseInt(formData.accountType.value),
            phoneNumber: formData.phoneNumber.value,
            gender: formData.gender.value,
            username: formData.username.value,
            password: formData.password.value,
            modules: checkboxes,
          };
          UserManagementService.SaveOrEditFacilityUser(objToSend)
            .then((res: AxiosResponse) => {
              if (res.data.statusCode === 200) {
                setLoader(false);
                toast.success(res.data.responseMessage);
                navigate("/facility-user-list");
              } else if (res.data.statusCode === 409) {
                toast.error(res.data.responseMessage);
                setLoader(false);
              } else {
                console.log("Something went wrong in update or save facility");
              }
            })
            .catch((err: AxiosError) => setLoader(false))

            .finally(() => setLoader(false));
        }
      } else {
        setEmailError(false);
        setLoader(false);
      }
    // } else {
    //   toast.error("Please fill the required fields");
    // }
  };
  console.log(isEmailExistError, "isEmailExistError")
  const [sports2, setSports2] = useState<any>([]);
  return (
    <>
      <AddUser
        handleOnChange={handleOnChange}
        setDataAndErrors={setDataAndErrors}
        errors={errors}
        changeHandler={changeHandler}
        changeHandlerForNames={changeHandlerForNames}
        values={values}
        formData={formData}
        setValues={setValues}
        handleSubmit={handleSubmit}
        facilities={facilities}
        setActiveType={setActiveType}
        UserGroupList={dropDownValues?.UserGroupList}
        AdminTypeList={dropDownValues?.AdminTypeList}
        dropDownValues={dropDownValues}
        GetDataAgainstRoles={GetDataAgainstRoles}
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        sports2={sports2}
        setSports2={setSports2}
        changeHandlerForNpi={changeHandlerForNpi}
        changeHandlerForEmail={changeHandlerForEmail}
        ValidEmail={ValidEmail}
        isEmailExistError={isEmailExistError}
        ValidUsername={ValidUsername}
        isUserNameExistError={isUserNameExistError}
        emailError={emailError}
        changeHandlerForUserName={changeHandlerForUserName}
        loading={loader}
      />
    </>
  );
}
