import React, { useEffect, useState } from "react";
import Input from "../../Shared/Common/Input/Input";
import Radio from "../../Shared/Common/Input/Radio";
import Select from "../../Shared/Common/Input/Select";

import Tooltip from "@mui/material/Tooltip";
import { AxiosError, AxiosResponse } from "axios";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiSelect from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { LabType } from "Utils/Common/Enums/Enums";
import { savePdfUrls } from "../../Redux/Actions/Index";
import FacilityService from "../../Services/FacilityService/FacilityService";
import Splash from "../../Shared/Common/Pages/Splash";
import useForm from "../../Shared/hooks/useForm";
import {
  EyeIcon,
  EyeIconSlash,
  LoaderIcon,
  RefreshIcon,
} from "../../Shared/Icons";
import { Decrypt } from "../../Utils/Auth";
import {
  generateAutoGeneratePassword,
  setFormState,
  stateDropdownArray,
  styles,
} from "../../Utils/Common";
import { checkFormState, initialState } from "../../Utils/InitialStates";
import validate from "../../Utils/validate";
import { filterTenantByLabKey } from "./AddFacility";
import FacilityLogoUploader from "./FacilityLogo";

export const getImageFileSize = (bytes: any) => {
  let decimals = 2;
  if (!+bytes) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = [
    "Bytes",
    "KiB",
    "MiB",
    "GiB",
    "TiB",
    "PiB",
    "EiB",
    "ZiB",
    "YiB",
  ];

  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};
export const extractLastModifiedDate = (file: any) => {
  const dateObject = new Date(file);
  const extractedTime = dateObject.toUTCString();

  return extractedTime;
};

const EditFacility = (props: any) => {
  const { t } = useLang();
  const labType = useSelector((state: any) => state?.Reducer?.labType);

  const [noProvider, setNoProvider] = useState(false);
  const [labAssignmentLookup, setLabAssignmentLook] = useState<any>(null);
  const [labAssingnmentIds, setLabAssignmentIds] = useState<any>(null);
  const [request, setRequest] = useState<any>(false);
  const [isVisibility, setIsVisibility] = useState(false);
  const [facultyOptions, setFacultyOptions] = React.useState([]);
  const [isRequest, setIsRequest] = useState(false);
  const [showtemplate, setShowTemplate] = useState<any>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<any>([]);
  const [selectedTemplateArray, setSelectedTemplateArray] = useState<any>([]);
  const [phyId, setPhyId] = useState<any>("");
  const [selectedReqType, setSelectedReqType] = useState<string>("");
  const [formValues, setFormValues] = useState<any>({
    activationType: "",
    password: generateAutoGeneratePassword(),
    facilityOpt: [],
    files: [],
  });
  const dispatch = useDispatch();
  const getLabAssignmentLookups = async () => {
    let response = await FacilityService.getLabAssignmentLookup();
    setLabAssignmentLook(response.data.result);
  };
  const handleChangeGroups = (selectedOptions: any) => {
    const selectedValues = selectedOptions?.map((option: any) => option?.value);
    setLabAssignmentIds(selectedValues);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      groupNames: {
        value: selectedValues,
      },
    }));
  };

  useEffect(() => {
    getLabAssignmentLookups();
  }, []);
  let decryptedData = Decrypt(props?.User?.userInfo);
  if (decryptedData) {
    let parsedData = JSON.parse(decryptedData);
    decryptedData = parsedData;
  }
  let LabKey = "";
  LabKey = props.User.labKey;
  const matchedTenantId = filterTenantByLabKey(
    decryptedData?.authTenants,
    LabKey
  );

  const handleSelect = (e: any) => {
    const selectedFiles = Array.from(e?.target?.files);

    // Check for max file size (10 MB)
    const largeFiles = (selectedFiles as File[]).filter(
      (file: File) => file.size > 10 * 1024 * 1024
    ); // 10 MB

    // Combine invalid file checks
    const allInvalidFiles = [...largeFiles];

    if (allInvalidFiles.length > 0) {
      toast.error(
        "Some files are invalid. Ensure the files are of type .pdf, .docx, .docm, .csv, .xlsx and no larger than 10 MB."
      );
      return;
    }

    // Check if the number of files exceeds the limit of 10
    const newFiles = [...formData?.files, ...selectedFiles];
    if (newFiles.length > 10) {
      toast.error("You can only upload a maximum of 10 files.");
      return;
    }

    // Proceed with updating the formData
    setFormData({ ...formData, files: newFiles });

    // Reset the file input field
    e.target.value = "";
  };

  const handleImageDeselect = (fileId: any, index: any) => {
    if (fileId === undefined) {
      const updatedFiles = [...formData.files];
      updatedFiles.splice(index, 1);
      setFormData({ ...formData, files: updatedFiles });
    } else {
      const obj = {
        FacilityId: 0,
        fileId,
      };
      FacilityService.RemoveFacilityUpload(obj)
        .then(() => {
          const updatedFiles = formData.files.filter(
            (file: any) => file.id !== fileId
          );
          setFormData({ ...formData, files: updatedFiles });
        })
        .catch((error: any) => {
          console.error("Failed to delete file:", error);
        });
    }
  };

  const LoadTemplate = async () => {
    try {
      const res: AxiosResponse = await FacilityService.LoadTemplate();
      setShowTemplate(res.data.data);
      return res;
    } catch (err) {
      console.error("Error loading template:", err);
    }
  };
  const [check, setCheck] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  let initState = checkFormState(
    initialState,
    formValues.activationType,
    check ? false : true
  );
  const { formData, setFormData, errors, changeHandler, setErrors }: any =
    useForm(initState, validate, formValues?.activationType, check);
  const { id }: any = useParams();
  let D_id = atob(id);

  useEffect(() => {
    async function apiCalls() {
      fetchFacultyOptions("");
      const response = await LoadTemplate();
      if (D_id !== "" && D_id !== undefined) {
        getFacilityById(response?.data?.data);
      }
    }
    apiCalls();
  }, []);

  useEffect(() => {
    if (showtemplate.length > 0) {
      const templateValue = showtemplate.filter((item: any) =>
        selectedTemplateArray?.includes(item.id)
      );
      setSelectedTemplate(templateValue);
      if (templateValue !== undefined) {
        setSelectedReqType(templateValue[0]?.reqType);
      }
    }
  }, [showtemplate, selectedTemplateArray]);

  const getFacilityById = async (templates: any[]) => {
    setLoading(true);
    try {
      const res: AxiosResponse = await FacilityService.getFacilityById(D_id);
      setSelectedTemplateArray(res?.data?.data.templateIds);
      let editData = setFormState(initialState, res?.data?.data);
      setPhyId(res?.data?.data?.providerInfo?.providerId);
      setNoProvider(res?.data?.data?.isNoProvider);
      setFormData(editData);
      setFormData((prev: any) => ({
        ...prev,
        labAssignment: {
          ...prev.labAssignment,
          value: res?.data?.data.profileInfo.isDefault === false ? "1" : "0",
        },
      }));
      setFormData((prev: any) => ({
        ...prev,
        groupNames: {
          ...prev.groupNames,
          value: res?.data?.data.profileInfo.labAssignmentIds,
        },
      }));
      fetchFacultyOptions(res?.data?.data.facilityOpt);
    } catch (err) {
      console.error("Error fetching facility by ID:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchFacultyOptions = async (opts: any) => {
    await FacilityService?.getFacultyOptions()
      .then((res: AxiosResponse) => {
        let newArray: any = res?.data?.data;
        const facilityCheckboxesArray = newArray?.map((entry: any) => ({
          ...entry,
          checked: opts?.some((a2: any) => a2?.optionId === entry.key),
        }));
        setFacultyOptions(facilityCheckboxesArray);
        let checkedOptionArr: any = [];
        facilityCheckboxesArray?.forEach((items: any) => {
          if (items.checked == true) {
            let obj = {
              optionId: items?.key,
            };
            checkedOptionArr?.push(obj);
          }
          return checkedOptionArr;
        });
        setFormValues((preVal: any) => {
          return {
            ...preVal,
            facilityOpt: checkedOptionArr,
          };
        });
      })
      .catch((err: AxiosError) => {});
  };

  // const handleTemplateChange = (
  //   id: number,
  //   url: string,
  //   e: any,
  //   reqType: string
  // ) => {
  //   setSelectedTemplate((prevTemplates: any[]) => {
  //     const updatedTemplates = [...prevTemplates];
  //     const index = updatedTemplates.findIndex(
  //       (template) => template.reqType === reqType
  //     );
  //     const newTemplate = {
  //       reqType: reqType,
  //       id: id,
  //       templateName: e.target.value,
  //       fileUrl: url,
  //     };
  //     setSelectedReqType(reqType);
  //     // If the reqType already exists, update it
  //     if (index > -1) {
  //       updatedTemplates[index] = newTemplate;
  //     } else {
  //       // Otherwise, add a new selection
  //       updatedTemplates.push(newTemplate);
  //     }

  //     return updatedTemplates;
  //   });
  // };

  const handleTemplateChange = (
    id: number,
    url: string,
    e: any,
    reqType: string
  ) => {
    // Set the selectedReqType immediately when a new selection is made
    setSelectedReqType(reqType);

    // Update the selected template in the array
    setSelectedTemplate((prevTemplates: any[]) => {
      // Create a new template object with the selected values
      const newTemplate = {
        reqType: reqType,
        id: id,
        templateName: e.target.value,
        fileUrl: url,
      };

      // Check if this reqType already exists in the selected templates
      const index = prevTemplates.findIndex(
        (template) => template.reqType === reqType
      );

      // If it exists, replace the old one, else add the new one
      if (index > -1) {
        const updatedTemplates = [...prevTemplates];
        updatedTemplates[index] = newTemplate;
        return updatedTemplates;
      } else {
        return [...prevTemplates, newTemplate];
      }
    });
  };

  const onFacultyOptionsSelect = (
    checked: boolean,
    key: string,
    index: number
  ) => {
    const objToSend = {
      optionId: parseInt(key),
    };
    let optArray: any = [...formValues.facilityOpt];
    if (checked) {
      optArray = [...optArray, objToSend];
      let copyFacilityOptArr: any = [...facultyOptions];
      let slicedArray: any = facultyOptions.splice(index, 1);
      let objToReplace = {
        key: slicedArray[0].key,
        value: slicedArray[0].value,
        displayOrder: slicedArray[0].displayOrder,
        checked: true,
      };
      copyFacilityOptArr.splice(index, 1, objToReplace);
      setFacultyOptions(copyFacilityOptArr);
    }
    if (!checked) {
      let copyFacilityOptArr: any = [...facultyOptions];
      let slicedArray: any = facultyOptions.splice(index, 1);
      let objToReplace = {
        key: slicedArray[0].key,
        value: slicedArray[0].value,
        displayOrder: slicedArray[0].displayOrder,
        checked: false,
      };
      copyFacilityOptArr.splice(index, 1, objToReplace);
      setFacultyOptions(copyFacilityOptArr);
      optArray = optArray.filter((items: any) => items?.optionId != key);
    }
    setFormValues((preVal: any) => {
      return {
        ...preVal,
        facilityOpt: optArray,
      };
    });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    let size;
    let formErrors: any;
    formErrors = validate(formData, true);

    if (noProvider) {
      delete formErrors.physicianFirstName;
      delete formErrors.physicianLastName;
      delete formErrors.npi;
      delete formErrors.activationType;
    }

    setErrors(formErrors);
    size = Object.keys(formErrors).length;
    const idsArray = selectedTemplate.map((template: any) =>
      template.id ? template.id : template
    );
    const objToSend = {
      generalInfo: {
        facilityId: D_id,
        facilityName: formData.facilityName.value,
        facilityStatus: "Active",
        zipCode: formData.zipCode.value,
        facilityPhone: formData.facilityPhone.value,
        facilityFax: formData.facilityFax.value,
        facilityWebsite: formData?.facilityWebsite?.value,
        activationType: parseInt(formData?.activationType.value),
        addressView: {
          address1: formData.address1.value,
          address2: formData.address2.value,
          zipCode: formData.zipCode.value,
          state: formData.state.value,
          city: formData.city.value,
        },
        mdFirstName: formData.mdFirstName.value,
        mdLastName: formData.mdLastName.value,
        facilityLogoUrl: formData.facilityLogoUrl.value,
        isShowFacilityLogoAsLabLogo: formData.facilityLogoUrl.value
          ? true
          : false,
      },
      contactInfo: {
        contactFirstName: formData.contactFirstName.value,
        contactLastName: formData.contactLastName.value,
        contactPrimaryEmail: formData.contactPrimaryEmail.value,
        contactPhone: formData.contactPhone.value,
      },
      criticalInfo: {
        criticalFirstName: formData.criticalFirstName.value,
        criticalLastName: formData.criticalLastName.value,
        criticalEmail: formData.criticalEmail.value,
        criticalPhoneNo: formData.criticalPhoneNo.value,
      },
      providerInfo: noProvider
        ? null
        : {
            physicianFirstName: formData.physicianFirstName.value,
            physicianLastName: formData.physicianLastName.value,
            phoneNumber: formData.phoneNumber.value,
            npi: formData.npi.value,
            stateLicense: formData.stateLicense.value,
            activationType: parseInt(formData?.activationType.value),
            ProviderId: phyId,
            gender: formData.gender.value,
            username:
              formData?.activationType.value == 0
                ? formData.username.value
                : null,
            password:
              formData?.activationType.value == 0
                ? formData.password.value
                : null,
            email:
              formData?.activationType.value == 1 ? formData.email.value : null,
          },
      shippingInfo: {
        shippingName: formData.shippingName.value,
        shippingAddress: formData.shippingAddress.value,
        shippingPhoneNumber: formData.shippingPhoneNumber.value,
        shippingEmail: formData.shippingEmail.value,
        shippingNote: formData.shippingNote.value,
      },
      facilityOpt: formValues.facilityOpt,
      templateIds: idsArray,
      files: [
        {
          ...formData.files,
          labId: matchedTenantId,
        },
      ],
      profileInfo: {
        isDefault:
          formData.labAssignment.value.toString() === "1" ? false : true,
        labAssignmentIds:
          formData.labAssignment.value.toString() === "1"
            ? formData?.groupNames?.value
            : [],
      },
      isNoProvider: noProvider,
    };
    if (size === 0) {
      setIsRequest(true);
      FacilityService.createFacility(objToSend)
        .then((res: AxiosResponse) => {
          if (res.data.data.status === 200) {
            toast.success(res.data.title);
            setIsRequest(false);
            setTimeout(() => {
              navigate("/facilitylist");
            }, 1000);
          } else {
          }
        })
        .catch((err: AxiosError) => {
          setIsRequest(false);
        });
    } else {
      toast.error(t("Please fill the required fields!"), {
        position: "top-center",
      });
    }
  };

  const handleUpload = async (files: any) => {
    setRequest(true);
    const formData = new FormData();
    let newImageArray: any = [];
    files.map((image: any) => {
      newImageArray.push(image);
    });
    for (let i = 0; i < newImageArray.length; i++) {
      formData.append("Files", newImageArray[i]);
    }
    formData.append("FacilityId", D_id);

    for (var pair of formData.entries()) {
    }
    FacilityService.facilityfileupload(formData)
      .then((res: AxiosResponse) => {
        setRequest(false);
        toast.success(res?.data?.message);
      })
      .catch((err: AxiosError) => {
        setRequest(false);
      });
  };

  const RemoveFacilityUpload = async () => {
    const obj = {
      FacilityId: D_id,
      fileId: 0,
    };
    FacilityService.RemoveFacilityUpload(obj)
      .then((res: AxiosResponse) => {
        toast.success(res.data.message);
        setFormData((pre: any) => ({
          ...pre,
          files: [],
        }));
      })
      .catch((err: AxiosError) => {});
  };

  const downloadFile = async (filePath: any, filename: any) => {
    let name = filename.split(".");

    const obj = {
      path: filePath,
    };
    try {
      const response = await FacilityService.DownloadBlob(obj);
      const { Content, Extension, FileName } = response.data;
      const blob = b64toBlob(Content, `application/octet-stream`);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${name[0]}${Extension}`;
      link.target = "_blank";
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };
  function b64toBlob(base64: string, contentType = "") {
    const sliceSize = 512;
    const byteCharacters = atob(base64);
    const byteArrays = [];
    let offset = 0;
    while (offset < byteCharacters.length) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
      offset += sliceSize;
    }
    return new Blob(byteArrays, { type: contentType });
  }
  const [errormessage, setErrorMessage] = useState({
    zipCode: "",
    npi: "",
  });
  const handleChangefornumeric = (event: any) => {
    const { name, value } = event.target;

    if (name === "zipCode") {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 5);
      setFormData((prev: any) => ({
        ...prev,
        [name]: {
          value: sanitizedValue,
        },
      }));
      if (sanitizedValue.length === 5) {
        setErrorMessage((prevError) => ({
          ...prevError,
          zipCode: "",
        }));
      } else {
        setErrorMessage((prevError) => ({
          ...prevError,
          zipCode: t("Enter valid zip code!"),
        }));
      }
    } else {
      const sanitizedValue = value.replace(/\D/g, "").slice(0, 10);
      setFormData((prev: any) => ({
        ...prev,
        [name]: {
          value: sanitizedValue,
        },
      }));
      if (sanitizedValue.length === 10) {
        setErrorMessage((prevError) => ({
          ...prevError,
          npi: "",
        }));
      } else {
        setErrorMessage((prevError) => ({
          ...prevError,
          npi: t("Enter valid npi!"),
        }));
      }
    }
  };
  const handleLabAssignment = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev: any) => ({
      ...prev,
      labAssignment: event.target.value,
    }));
  };

  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <form onSubmit={handleSubmit} className="form">
          <div id="kt_app_body" className="app-default">
            <div
              className="app-wrapper flex-column flex-row-fluid"
              id="kt_app_wrapper"
              style={{ marginLeft: "0px" }}
            >
              <div
                className="app-main flex-column flex-row-fluid"
                id="kt_app_main"
              >
                <div className="d-flex flex-column flex-column-fluid">
                  <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                    <div
                      id="kt_app_toolbar_container"
                      className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
                    >
                      <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                        <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                          <li className="breadcrumb-item text-muted">
                            <Link
                              to="#"
                              className="text-muted text-hover-primary"
                            >
                              {t("Home")}
                            </Link>
                          </li>
                          <li className="breadcrumb-item">
                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                          </li>
                          <li className="breadcrumb-item text-muted">
                            {t("Facility")}
                          </li>
                          <li className="breadcrumb-item">
                            <span className="bullet bg-gray-400 w-5px h-2px"></span>
                          </li>
                          <li className="breadcrumb-item text-muted">
                            {t("Edit a Facility")}
                          </li>
                        </ul>
                      </div>
                      <div className="d-flex align-items-center gap-2 gap-lg-3">
                        <Link
                          to="/facilitylist"
                          className="btn btn-sm fw-bold btn-cancel"
                        >
                          {t("Cancel")}
                        </Link>
                        <button
                          className="btn btn-sm fw-bold btn-primary"
                          onClick={handleSubmit}
                        >
                          {isRequest ? t("Updating...") : t("Update")}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div
                    id="kt_app_content"
                    className="app-content flex-column-fluid"
                  >
                    <div
                      id="kt_app_content_container"
                      className="container-fluid"
                      style={{ paddingLeft: "0px !important" }}
                    >
                      <div className="card shadow-xl">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("General Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("Company Name")}
                              name="facilityName"
                              //onBlur={isFacilityAlreadyExist}
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Company Name")}
                              value={formData?.facilityName?.value}
                              error={errors?.facilityName}
                              loading={loading}
                              disabled={true}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Address")}
                              name="address1"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address")}
                              value={formData?.address1?.value}
                              error={errors?.address1}
                              loading={loading}
                              disabled={true}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Address 2")}
                              name="address2"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address 2")}
                              value={formData?.address2.value}
                              error={errors?.address2}
                              // required={true}
                              loading={loading}
                            />
                            <Input
                              type="text"
                              label={t("Zip Code")}
                              name="zipCode"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Zip Code")}
                              value={formData?.zipCode?.value}
                              error={errors.zipCode}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("City")}
                              name="city"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("City")}
                              value={formData?.city?.value}
                              error={errors?.city}
                              loading={loading}
                              required={true}
                            />
                            <Select
                              menuPortalTarget={document.body}
                              label={t("State")}
                              name="state"
                              id="state2"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              options={stateDropdownArray}
                              value={formData?.state?.value}
                              onChange={changeHandler}
                              error={errors.state}
                              required={true}
                              loading={loading}
                            />

                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="facilityPhone"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.facilityPhone?.value}
                              error={errors?.facilityPhone}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Fax")}
                              name="facilityFax"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Fax")}
                              value={formData?.facilityFax?.value}
                              error={errors?.facilityFax}
                              required={true}
                              loading={loading}
                            />
                            {/* <Input
                              type="text"
                              label={t("Website")}
                              name="facilityWebsite"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Website")}
                              value={formData?.facilityWebsite?.value}
                              error={errors?.facilityWebsite}
                              loading={loading}
                            /> */}
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Contact Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("First Name")}
                              name="contactFirstName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("First Name")}
                              value={formData?.contactFirstName?.value}
                              error={errors?.contactFirstName}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Last Name")}
                              name="contactLastName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Last Name")}
                              value={formData?.contactLastName?.value}
                              error={errors?.contactLastName}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Email")}
                              name="contactPrimaryEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Email")}
                              value={formData?.contactPrimaryEmail?.value}
                              error={errors?.contactPrimaryEmail}
                              loading={loading}
                              required={true}
                            />

                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="contactPhone"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.contactPhone?.value}
                              error={errors?.contactPhone}
                              loading={loading}
                              required={true}
                            />
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Critical Contact Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("First Name")}
                              name="criticalFirstName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("First Name")}
                              value={formData?.criticalFirstName?.value}
                              error={errors?.criticalFirstName}
                              loading={loading}
                              required={true}
                            />

                            <Input
                              type="text"
                              label={t("Last Name")}
                              name="criticalLastName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Last Name")}
                              value={formData?.criticalLastName?.value}
                              error={errors?.criticalLastName}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="text"
                              label="Email"
                              name="criticalEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Email")}
                              value={formData?.criticalEmail?.value}
                              error={errors?.criticalEmail}
                              loading={loading}
                              required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="criticalPhoneNo"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.criticalPhoneNo?.value}
                              error={errors?.criticalPhoneNo}
                              loading={loading}
                              required={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Ordering Provider Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div>
                            <input
                              className="form-check-input mr-2 mb-4"
                              type="checkbox"
                              id="noProvider"
                              name="noProvider"
                              checked={noProvider}
                              onChange={() => setNoProvider(!noProvider)}
                              disabled
                            />
                            <label htmlFor="noProvider">
                              {t("No Provider")}
                            </label>
                          </div>
                          <div className="row">
                            <Input
                              type="text"
                              label={t("Provider First Name")}
                              name="physicianFirstName"
                              onChange={changeHandler}
                              className="form-control"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Provider First Name")}
                              value={formData?.physicianFirstName?.value}
                              error={errors?.physicianFirstName}
                              loading={loading}
                              required={true}
                              disabled
                            />
                            <Input
                              type="text"
                              label={t("Provider Last Name")}
                              name="physicianLastName"
                              onChange={changeHandler}
                              className="form-control"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Provider Last Name")}
                              value={formData?.physicianLastName?.value}
                              error={errors?.physicianLastName}
                              loading={loading}
                              required={true}
                              disabled
                            />

                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="phoneNumber"
                              onChange={changeHandler}
                              className="form-control"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.phoneNumber?.value}
                              error={errors?.phoneNumber}
                              loading={loading}
                              disabled
                            />

                            <Input
                              type="text"
                              label="NPI #"
                              name="npi"
                              onChange={changeHandler}
                              className="form-control"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("NPI #")}
                              value={formData?.npi?.value}
                              error={errors.npi}
                              loading={loading}
                              required={true}
                              disabled
                            />
                            <Input
                              type="text"
                              label={t("State License")}
                              name="stateLicense"
                              onChange={changeHandler}
                              className="form-control"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("State License")}
                              value={formData?.stateLicense?.value}
                              error={errors?.stateLicense}
                              loading={loading}
                              disabled
                            />
                            <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                <Radio
                                  label={t("Account Activation Type")}
                                  name="activationType"
                                  onChange={changeHandler}
                                  choices={[
                                    {
                                      id: "Username1",
                                      label: t("Username"),
                                      value: "0",
                                    },
                                    {
                                      id: "Email1",
                                      label: t("Email"),
                                      value: "1",
                                    },
                                  ]}
                                  checked={formData?.activationType?.value?.toString()}
                                  loading={loading}
                                  disabled
                                />
                              </div>
                            </div>
                            {formData.activationType.value == "0" ? (
                              <>
                                <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 thenuser">
                                  {/* <!--begin::Input group--> */}

                                  <div className="fv-row mb-4">
                                    <label className="required   mb-2">
                                      {t("UserName")}
                                    </label>
                                    <input
                                      type="text"
                                      name="username"
                                      // onBlur={ValidUsername}
                                      onChange={changeHandler}
                                      className="form-control"
                                      placeholder={t("UserName")}
                                      value={formData?.username?.value}
                                      autoComplete="off"
                                      disabled
                                    />
                                    {errors?.username && (
                                      <div className="form__error">
                                        <span>{errors?.username}</span>
                                      </div>
                                    )}
                                    {/* <span style={{ color: 'red' }}>
                                      {isUserNameExistError}
                                    </span> */}
                                    {/* <!--end::Input--> */}
                                  </div>
                                  {/* <!--end::Input group--> */}
                                </div>

                                {check === true ? (
                                  <>
                                    <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 showpass thenuser">
                                      <div
                                        className="fv-row mb-8"
                                        data-kt-password-meter="true"
                                      >
                                        <label className="required mb-2">
                                          {t("Password")}
                                        </label>
                                        <div className="mb-1">
                                          <div className="position-relative mb-3 getPass">
                                            <input
                                              className="form-control"
                                              name="password"
                                              onChange={changeHandler}
                                              type={
                                                isVisibility
                                                  ? "text"
                                                  : "password"
                                              }
                                              placeholder={t("Password")}
                                              autoComplete="off"
                                              value={formData?.password?.value}
                                              disabled
                                            />

                                            <span
                                              onClick={() => {
                                                let updatedData = {
                                                  ...formData,
                                                  password: {
                                                    ...formData["password"],
                                                    value:
                                                      generateAutoGeneratePassword(),
                                                    touched: true,
                                                  },
                                                };
                                                // setDataAndErrors(updatedData)
                                              }}
                                              className="generate-password "
                                              data-toggle="tooltip"
                                              title=""
                                              data-original-title="Generate Password"
                                              aria-describedby="tooltip419827"
                                            >
                                              {/* <RefreshIcon /> */}
                                              <RefreshIcon />
                                            </span>
                                            <span
                                              onClick={() =>
                                                setIsVisibility(!isVisibility)
                                              }
                                              className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                                            >
                                              {isVisibility ? (
                                                <i className="fa fa-eye text-primary"></i>
                                              ) : (
                                                <EyeIconSlash />
                                              )}
                                            </span>
                                          </div>
                                          {errors?.password && (
                                            <div className="form__error">
                                              <span> {errors?.password}</span>
                                            </div>
                                          )}
                                          {/* <!--end::Input wrapper--> */}
                                          {/* <!--begin::Meter--> */}
                                          <div
                                            className="d-flex align-items-center mb-3 d-none"
                                            data-kt-password-meter-control="highlight"
                                          >
                                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                            <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                                          </div>
                                          {/* <!--end::Meter--> */}
                                        </div>
                                      </div>
                                    </div>
                                  </>
                                ) : (
                                  <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 showpass thenuser">
                                    <div
                                      className="fv-row mb-8"
                                      data-kt-password-meter="true"
                                    >
                                      <label className=" mb-2">
                                        {t("Password")}
                                      </label>
                                      <div className="mb-1">
                                        <div className="position-relative mb-3 getPass">
                                          <input
                                            className="form-control bg-light-secondary"
                                            name="password"
                                            placeholder={t("Password")}
                                            disabled
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}

                                {isVisibility ? (
                                  <></>
                                ) : (
                                  <>
                                    {check === true ? (
                                      <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 showpass thenuser">
                                        <div
                                          className="fv-row mb-8"
                                          data-kt-password-meter="true"
                                        >
                                          <label className="required   mb-2">
                                            {t("Re-enter Password")}
                                          </label>

                                          <div className="mb-1">
                                            <div className="position-relative mb-3 getPass">
                                              <input
                                                type={
                                                  isVisibility
                                                    ? "text"
                                                    : "password"
                                                }
                                                className="form-control"
                                                name="reEnterPassword"
                                                onChange={changeHandler}
                                                placeholder={t(
                                                  "Re-enter Password"
                                                )}
                                                autoComplete="off"
                                                value={
                                                  formData?.reEnterPassword
                                                    ?.value
                                                }
                                                disabled
                                              />

                                              <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                                {isVisibility ? (
                                                  <EyeIconSlash />
                                                ) : (
                                                  <EyeIcon />
                                                )}
                                              </span>
                                            </div>
                                            {errors?.reEnterPassword && (
                                              <div className="form__error">
                                                <span>
                                                  {errors?.reEnterPassword}
                                                </span>
                                              </div>
                                            )}
                                            {/* <!--end::Input wrapper--> */}
                                            {/* <!--begin::Meter--> */}
                                            <div
                                              className="d-flex align-items-center mb-3 d-none"
                                              data-kt-password-meter-control="highlight"
                                            >
                                              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px me-2"></div>
                                              <div className="flex-grow-1 bg-secondary bg-active-success rounded h-5px"></div>
                                            </div>
                                            {/* <!--end::Meter--> */}
                                          </div>
                                          {/* <!--end::Wrapper--> */}
                                          {/* <!--begin::Hint--> */}
                                          <div className="text-muted d-none">
                                            {t(
                                              "Use 8 or more characters with a mix of letters, numbers symbols."
                                            )}
                                          </div>
                                          {/* <!--end::Hint--> */}
                                        </div>
                                        {/* <!--end::Input group--> */}
                                      </div>
                                    ) : (
                                      <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 showpass thenuser">
                                        <div
                                          className="fv-row mb-8"
                                          data-kt-password-meter="true"
                                        >
                                          <label className="mb-2">
                                            {t("Re-enter Password")}
                                          </label>

                                          <div className="mb-1">
                                            <div className="position-relative mb-3 getPass">
                                              <input
                                                className="form-control bg-light-secondary"
                                                name="reEnterPassword"
                                                placeholder={t(
                                                  "Re-enter Password"
                                                )}
                                                autoComplete="off"
                                                disabled
                                              />
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </>
                                )}
                              </>
                            ) : null}
                            {formData.activationType.value == "1" ? (
                              <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 thenemail">
                                {/* <!--begin::Input group--> */}
                                <div className="fv-row mb-4">
                                  {/* <!--begin::Label--> */}
                                  <label className="required   mb-2">
                                    {t("Provider Email")}
                                  </label>
                                  {/* <!--end::Label--> */}
                                  {/* <!--begin::Input--> */}
                                  <input
                                    type="text"
                                    name="email"
                                    // onBlur={ValidEmail}
                                    onChange={changeHandler}
                                    value={formData?.email?.value}
                                    className="form-control"
                                    placeholder={t("Provider Email")}
                                    disabled
                                  />
                                  <span style={{ color: "red" }}>
                                    {/* {isEmailExistError} */}
                                  </span>
                                  {errors?.email && (
                                    <div className="form__error">
                                      <span> {errors?.email}</span>
                                    </div>
                                  )}
                                  {/* <!--end::Input--> */}
                                </div>

                                {/* <!--end::Input group--> */}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header  minh-42px ">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Shipping Information")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("Facility Name")}
                              name="shippingName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Facility Name")}
                              value={formData?.shippingName?.value}
                              error={errors?.shippingName}
                              // required={true}
                              loading={loading}
                            />

                            <Input
                              type="text"
                              label={t("Address")}
                              name="shippingAddress"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address")}
                              value={formData?.shippingAddress?.value}
                              error={errors?.shippingAddress}
                              // required={true}
                              loading={loading}
                            />
                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="shippingPhoneNumber"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Phone")}
                              value={formData?.shippingPhoneNumber?.value}
                              // error={errors?.shippingPhoneNumber}
                              // required={true}
                              loading={loading}
                            />
                            <Input
                              type="text"
                              label={t("Email")}
                              name="shippingEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Email")}
                              value={formData?.shippingEmail?.value}
                              error={errors?.shippingEmail}
                              // required={true}
                              loading={loading}
                            />
                            <Input
                              type="text"
                              label={t("Note/Instructions")}
                              name="shippingNote"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Note/Instructions")}
                              value={formData?.shippingNote?.value}
                              error={errors?.shippingNote}
                              // required={true}
                              loading={loading}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Lab Profile")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          {/* <div className="d-flex gap-8 lab-assignment-profile"> */}
                            <div className="row">
                              <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                                <Radio
                                  label={t("Lab Service Assignment")}
                                  name="labAssignment"
                                  onChange={changeHandler}
                                  choices={[
                                    {
                                      id: "",
                                      label: t("Default"),
                                      value: "0",
                                    },
                                    {
                                      id: "",
                                      label: t("Custom"),
                                      value: "1",
                                    },
                                  ]}
                                  error={errors.labAssignment}
                                  checked={formData.labAssignment.value}
                                />
                              </div>
                              <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                                {formData.labAssignment.value === "1" && (
                                  <MultiSelect
                                    theme={(theme: any) => styles(theme)}
                                    isMulti
                                    options={labAssignmentLookup}
                                    name="groupNames"
                                    placeholder={t("Lab Assignments")}
                                    onChange={handleChangeGroups}
                                    value={labAssignmentLookup?.filter(
                                      (option: any) =>
                                        formData?.groupNames?.value?.includes(
                                          option?.value
                                        )
                                    )}
                                  />
                                )}
                              </div>

                            </div>
                          {/* </div> */}
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4 ">
                        <div className="card-header  minh-42px minh-42px d-flex justify-content-between align-items-center">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Result Report Template")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-3 py-2">
                          <div className="col-lg-12 col-sm-12 col-md-12 col-xxl-12">
                            <div className="row">
                              <h6 className="text-primary mb-5">
                                {t(
                                  "Select the required report template for resulting"
                                )}
                              </h6>
                              <div className="col-xxl-2 col-lg-4 col-sm-12 col-md-6">
                                {[
                                  ...new Set(
                                    showtemplate.map(
                                      (template: any) => template.reqType
                                    )
                                  ),
                                ].map((uniqueReqType: any) => (
                                  <div key={uniqueReqType}>
                                    <span className="fw-500">
                                      {uniqueReqType}
                                    </span>
                                    <div className="mt-5">
                                      {showtemplate
                                        .filter(
                                          (template: any) =>
                                            template.reqType === uniqueReqType
                                        )
                                        .map((template: any) => (
                                          <div
                                            key={template.templateName}
                                            className="mb-3"
                                          >
                                            <label className="form-check form-check-inline form-check-solid me-5">
                                              <input
                                                className="form-check-input ifuser"
                                                type="radio"
                                                name={`template_${uniqueReqType}`}
                                                value={template.templateName}
                                                checked={selectedTemplate.find(
                                                  (sel: any) =>
                                                    sel.id === template.id
                                                )}
                                                onChange={(e: any) =>
                                                  handleTemplateChange(
                                                    template.id,
                                                    template.templateUrl,
                                                    e,
                                                    uniqueReqType
                                                  )
                                                }
                                              />
                                              {template.templateDisplayName}
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {selectedTemplate.length > 0 &&
                                selectedReqType && (
                                  <div className="col-xxl-10 col-lg-8 col-sm-12 col-md-6 d-flex justify-content-sm-end justify-content-center">
                                    <div className="card card-bordered shadow-xs bg-light-secondary">
                                      <div className="d-flex justify-content-around">
                                        <div className="card-body h-md-375px px-5 py-5">
                                          {(() => {
                                            const selected =
                                              selectedTemplate.find(
                                                (template: any) =>
                                                  template.reqType ===
                                                  selectedReqType
                                              );

                                            if (!selected) return null;

                                            switch (
                                              selected.templateName.toLowerCase()
                                            ) {
                                              case "rpp":
                                                return (
                                                  <Link
                                                    className="h-100"
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          selected.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      className="h-100"
                                                      src="/RPP.png"
                                                      alt="template"
                                                    />
                                                  </Link>
                                                );
                                              case "uti":
                                                return (
                                                  <Link
                                                    className="h-100"
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          selected.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      className="h-100"
                                                      src="/UTI.png"
                                                      alt="template"
                                                    />
                                                  </Link>
                                                );
                                              case "wound":
                                                return (
                                                  <Link
                                                    className="h-100"
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          selected.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      className="h-100"
                                                      src="/Wound.png"
                                                      alt="template"
                                                    />
                                                  </Link>
                                                );
                                              case "id standard":
                                                return (
                                                  <Link
                                                    className="h-100"
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          selected.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      className="h-100"
                                                      src="/IDStandard.png"
                                                      alt="template"
                                                    />
                                                  </Link>
                                                );
                                              case "tox template":
                                                return (
                                                  <Link
                                                    className="h-100"
                                                    to={`/docs-viewer`}
                                                    target="_blank"
                                                    onClick={() => {
                                                      dispatch(
                                                        savePdfUrls(
                                                          selected.fileUrl
                                                        )
                                                      );
                                                    }}
                                                  >
                                                    <img
                                                      className="h-100"
                                                      src="/Tox_Standard.jpg"
                                                      alt="template"
                                                    />
                                                  </Link>
                                                );
                                              default:
                                                return null;
                                            }
                                          })()}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* <div className="card mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              Facility Options{" "}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="d-flex align-items-center mt-3 row">
                            {facultyOptions.length > 0 &&
                              facultyOptions.map((opt: any, i) => (
                                <div
                                  key={i}
                                  className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-6"
                                >
                                  <label className="form-check form-check-inline form-check-solid m-0 mb-5">
                                    <input
                                      className="form-check-input"
                                      name="optionId"
                                      onChange={(e: any) =>
                                        onFacultyOptionsSelect(
                                          e.target.checked,
                                          e.target.value,
                                          i
                                        )
                                      }
                                      type="checkbox"
                                      checked={opt?.checked}
                                      value={opt.key}
                                    />
                                    <span className=" ps-2 ">{opt.value}</span>
                                  </label>
                                </div>
                              ))}
                          </div>
                        </div>
                      </div> */}
                      <div className="card shadow-xl mt-4">
                        <div className="card-header  minh-42px ">
                          <div className="card-title d-flex flex-wrap">
                            <span className="card-label fw-bold text-dark">
                              {t("Upload files")}
                            </span>
                            <span
                              className="card-label"
                              style={{ fontSize: "10px" }}
                            >
                              (Facility Agreements, BAA, Signature log, etc)
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="mt-3">
                            <input
                              type="file"
                              onChange={handleSelect}
                              multiple
                              id="upload-file"
                              className="d-none"
                              accept=".pdf, .docx, .docm, .csv, .xlsx"
                            />
                            <label
                              htmlFor="upload-file"
                              className="dropzone"
                              id="kt_ecommerce_add_product_media"
                            >
                              <div className="dz-message needsclick">
                                <i className="bi bi-file-earmark-arrow-up text-primary fs-3x"></i>
                                <div className="ms-4">
                                  <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                                    {t("Drop files here or click to upload.")}
                                  </h3>
                                  <span className="fs-7  text-gray-400">
                                    {t("Upload Upto 10 Files")}
                                  </span>
                                </div>
                              </div>
                            </label>
                          </div>
                          {formData?.files?.length > 0 && (
                            <>
                              {formData?.files?.map(
                                (fileData: any, index: any) => (
                                  <div
                                    className="col-lg-6 col-sm-12 col-md-6"
                                    key={index}
                                  >
                                    <div className="border bg-light-secondary rounded p-2 my-3">
                                      <div className="d-flex justify-content-between">
                                        <div className="text-dark-65">
                                          <span>
                                            <span className="fw-bold">
                                              {" "}
                                              {t("File Name:")}
                                            </span>
                                            {fileData?.name}
                                          </span>
                                          <br />
                                          {parseInt(
                                            getImageFileSize(fileData.size)
                                          ) > 1000 && (
                                            <span className="fw-500 text-dark">
                                              {t(
                                                "File is too big. Max filesize: 1MiB."
                                              )}
                                            </span>
                                          )}
                                        </div>
                                        <div>
                                          <Tooltip title="Download File">
                                            <span className="px-5">
                                              <i
                                                className="fa fa-download text-primary"
                                                style={{
                                                  fontSize: "16px",
                                                }}
                                                onClick={() =>
                                                  downloadFile(
                                                    fileData.filePath,
                                                    fileData?.name
                                                  )
                                                }
                                              ></i>
                                            </span>
                                          </Tooltip>
                                          <span
                                            style={{
                                              fontSize: "13px",
                                              cursor: "pointer",
                                            }}
                                            onClick={() =>
                                              handleImageDeselect(
                                                fileData.id,
                                                index
                                              )
                                            }
                                          >
                                            &#x2716;
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              )}
                              <div className="my-2">
                                <span className="fs-7 text-gray-400">
                                  <span className="fw-bold">{t("Note:")} </span>
                                  {t(
                                    " Max file size is 10MB and max number of files is 10."
                                  )}
                                </span>
                              </div>
                              <div className="mt-2">
                                <a
                                  className="dropzone-select btn btn-light-primary font-weight-bold btn-sm dz-clickable mr-2"
                                  onClick={() => handleUpload(formData?.files)}
                                >
                                  {request ? <LoaderIcon /> : null}{" "}
                                  {t("Upload All")}
                                </a>
                                <a
                                  onClick={RemoveFacilityUpload}
                                  className="dropzone-select btn btn-light-danger font-weight-bold btn-sm dz-clickable"
                                >
                                  {t("Remove All")}
                                </a>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      {labType == LabType.POL ? (
                        <div className="card shadow-xl mt-4">
                          <div className="card-header  minh-42px minh-42px d-flex justify-content-between align-items-center">
                            <div className="card-title">
                              <span className="card-label fw-bold text-dark">
                                {t("POL")}
                              </span>
                            </div>
                          </div>
                          <div className="d-flex justify-content-between">
                            <div className="card-body py-md-3 py-2">
                              <div className="row">
                                <Input
                                  type="text"
                                  label={t("MD First Name")}
                                  name="mdFirstName"
                                  onChange={changeHandler}
                                  className="form-control bg-transparent"
                                  parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                                  placeholder={t("Md First Name")}
                                  value={formData?.mdFirstName?.value}
                                  error={errors?.mdFirstName}
                                  required
                                />
                                <Input
                                  type="text"
                                  label={t("MD Last Name")}
                                  name="mdLastName"
                                  onChange={changeHandler}
                                  className="form-control bg-transparent"
                                  parentDivClassName="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12"
                                  placeholder={t("Md Last Name")}
                                  value={formData?.mdLastName?.value}
                                  error={errors?.mdLastName}
                                  required
                                />
                              </div>
                            </div>
                            <div className="d-flex gap-2 p-2">
                              <div className="text-center">
                                <label
                                  htmlFor=""
                                  className="required mb-1 text-center"
                                >
                                  Facility Logo
                                </label>
                                <FacilityLogoUploader
                                  formData={formData}
                                  setFormData={setFormData}
                                />
                              </div>
                              {/* <div className="text-center">
                                <label htmlFor="" className="mb-1 text-center">
                                  Smart Logo
                                </label>
                                <SmartLogoUploader setFormData={setFormData} />
                              </div> */}
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="kt_engage_demos"
            className="bg-body"
            data-kt-drawer="true"
            data-kt-drawer-name="explore"
            data-kt-drawer-activate="true"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="{default:'350px', 'lg': '475px'}"
            data-kt-drawer-direction="end"
            data-kt-drawer-toggle="#kt_engage_demos_toggle"
            data-kt-drawer-close="#kt_engage_demos_close"
          >
            <div className="card shadow-none rounded-0 w-100">
              <div
                className="card-header "
                id="kt_engage_demos_header"
              >
                <h3 className="card-title fw-bold text-gray-700">
                  {t("Demos")}
                </h3>
                <div className="card-toolbar">
                  <button
                    type="button"
                    className="btn btn-sm btn-icon btn-active-color-primary h-40px w-40px me-n6"
                    id="kt_engage_demos_close"
                  >
                    <span className="svg-icon svg-icon-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          opacity="0.5"
                          x="6"
                          y="17.3137"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(-45 6 17.3137)"
                          fill="currentColor"
                        />
                        <rect
                          x="7.41422"
                          y="6"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(45 7.41422 6)"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card-body px-3 px-md-8" id="kt_engage_demos_body">
                <div
                  id="kt_explore_scroll"
                  className="scroll-y me-n5 pe-5"
                  data-kt-scroll="true"
                  data-kt-scroll-height="auto"
                  data-kt-scroll-wrappers="#kt_engage_demos_body"
                  data-kt-scroll-dependencies="#kt_engage_demos_header"
                  data-kt-scroll-offset="5px"
                >
                  <div className="mb-0"></div>
                </div>
              </div>
            </div>
          </div>
          <div
            id="kt_help"
            className="bg-body"
            data-kt-drawer="true"
            data-kt-drawer-name="help"
            data-kt-drawer-activate="true"
            data-kt-drawer-overlay="true"
            data-kt-drawer-width="{default:'350px', 'md': '525px'}"
            data-kt-drawer-direction="end"
            data-kt-drawer-toggle="#kt_help_toggle"
            data-kt-drawer-close="#kt_help_close"
          >
            <div className="card shadow-xl rounded-0 w-100">
              <div className="card-header  minh-42px " id="kt_help_header">
                <h5 className="card-title fw-bold text-gray-700">
                  {t("Support Guidelines")}
                </h5>
                <div className="card-toolbar">
                  <button
                    type="button"
                    className="btn btn-sm btn-icon explore-btn-dismiss me-n5"
                    id="kt_help_close"
                  >
                    <span className="svg-icon svg-icon-2">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          opacity="0.5"
                          x="6"
                          y="17.3137"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(-45 6 17.3137)"
                          fill="currentColor"
                        />
                        <rect
                          x="7.41422"
                          y="6"
                          width="16"
                          height="2"
                          rx="1"
                          transform="rotate(45 7.41422 6)"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </div>
              <div className="card-body px-3 px-md-8" id="kt_help_body">
                <div
                  id="kt_help_scroll"
                  className="hover-scroll-overlay-y"
                  data-kt-scroll="true"
                  data-kt-scroll-height="auto"
                  data-kt-scroll-wrappers="#kt_help_body"
                  data-kt-scroll-dependencies="#kt_help_header"
                  data-kt-scroll-offset="5px"
                >
                  <form
                    id="kt_modal_new_ticket_form"
                    className="form"
                    action="#"
                  >
                    <div className="d-flex flex-column mb-8 fv-row">
                      <label className="d-flex align-items-center   mb-2">
                        <span className="required">{t("Subject")}</span>
                        <i
                          className="fas fa-exclamation-circle ms-2 fs-7"
                          data-bs-toggle="tooltip"
                          title={t("Specify a subject for your issue")}
                        ></i>
                      </label>
                      <input
                        type="text"
                        className="form-control form-control-solid"
                        placeholder={t("Enter your ticket subject")}
                        name="subject"
                      />
                    </div>
                    <div className="d-flex flex-column mb-8 fv-row">
                      <label className="  mb-2">{t("Description")}</label>
                      <textarea
                        className="form-control form-control-solid"
                        name="description"
                        placeholder={t("Type your ticket description")}
                      ></textarea>
                    </div>
                    <div className="fv-row mb-8">
                      <label className="  mb-2">{t("Attachments")}</label>
                      <div
                        className="dropzone"
                        id="kt_modal_create_ticket_attachments"
                      >
                        <div className="dz-message needsclick align-items-center">
                          <span className="svg-icon svg-icon-3hx svg-icon-primary">
                            <svg
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                opacity="0.3"
                                d="M19 22H5C4.4 22 4 21.6 4 21V3C4 2.4 4.4 2 5 2H14L20 8V21C20 21.6 19.6 22 19 22ZM14.5 12L12.7 9.3C12.3 8.9 11.7 8.9 11.3 9.3L10 12H11.5V17C11.5 17.6 11.4 18 12 18C12.6 18 12.5 17.6 12.5 17V12H14.5Z"
                                fill="currentColor"
                              />
                              <path
                                d="M13 11.5V17.9355C13 18.2742 12.6 19 12 19C11.4 19 11 18.2742 11 17.9355V11.5H13Z"
                                fill="currentColor"
                              />
                              <path
                                d="M8.2575 11.4411C7.82942 11.8015 8.08434 12.5 8.64398 12.5H15.356C15.9157 12.5 16.1706 11.8015 15.7425 11.4411L12.4375 8.65789C12.1875 8.44737 11.8125 8.44737 11.5625 8.65789L8.2575 11.4411Z"
                                fill="currentColor"
                              />
                              <path
                                d="M15 8H20L14 2V7C14 7.6 14.4 8 15 8Z"
                                fill="currentColor"
                              />
                            </svg>
                          </span>
                          <div className="ms-4">
                            <h3 className="fs-5 fw-bold text-gray-900 mb-1">
                              {t("Drop files here or click to upload.")}
                            </h3>
                            <span className=" fs-7 text-gray-400">
                              {t("Upload up to 10 files")}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button type="reset" className="btn btn-light me-3">
                        {t("Cancel")}
                      </button>
                      <button type="submit" className="btn btn-primary">
                        <span className="indicator-label">{t("Submit")}</span>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </form>
      )}
    </>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(EditFacility);
