import { Popover } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import MultiSelect from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { LabType } from "Utils/Common/Enums/Enums";
import { InputChangeEvent } from "../../Interface/Shared/Types";
import { savePdfUrls } from "../../Redux/Actions/Index";
import Commonservice from "../../Services/CommonService";
import FacilityService from "../../Services/FacilityService/FacilityService";
import Input from "../../Shared/Common/Input/Input";
import Radio from "../../Shared/Common/Input/Radio";
import Select from "../../Shared/Common/Input/Select";
import LoadButton from "../../Shared/Common/LoadButton";
import Splash from "../../Shared/Common/Pages/Splash";
import useForm from "../../Shared/hooks/useForm";
import useLang from "../../Shared/hooks/useLanguage";
import { EyeIconSlash, LoaderIcon, RefreshIcon } from "../../Shared/Icons";
import { Decrypt } from "../../Utils/Auth";
import {
  generateAutoGeneratePassword,
  stateDropdownArray,
} from "../../Utils/Common";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import { checkFormState, initialState } from "../../Utils/InitialStates";
import validate from "../../Utils/validate";
import FacilityLogoUploader from "./FacilityLogo";

type InputField = "npi" | "physicianFirstName" | "physicianLastName";

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

export const filterTenantByLabKey = (authTenants: any, labKey: string) => {
  const matchedTenant = authTenants?.find(
    (tenant: any) => tenant.key === labKey
  );
  return matchedTenant ? matchedTenant.tenantId : null;
};

const AddFacility = (props: any) => {
  const labType = useSelector((state: any) => state?.Reducer?.labType);
  const [copyContactInfo, setCopyContactInfo] = useState(false);

  const { t } = useLang();
  const [showtemplate, setShowTemplate] = useState<any>([]);
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
  const [images, setImages] = useState<any>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFiles = 10;
    const maxFileSize = 10 * 1024 * 1024;

    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];
    let validFiles: File[] = [];

    for (const file of selectedFiles) {
      if (file.size > maxFileSize) {
        toast.error(`File ${file.name} exceeds the 10MB size limit.`);
        continue;
      }

      validFiles.push(file);
    }

    if (images.length + validFiles.length > maxFiles) {
      toast.error(`You can only upload up to ${maxFiles} files.`);
      return;
    }

    setImages([...images, ...validFiles]);
    e.target.value = "";
  };

  const handleImageDeselect = (image: any) => {
    const _images = [...images];
    const index = _images.map((_) => _.name).indexOf(image.name);
    if (index > -1) {
      _images.splice(index, 1);
    }
    setImages([..._images]);
  };
  const dispatch = useDispatch();
  // const [selectedTemplate, setSelectedTemplate] = useState<any>({
  //   id: 4,
  //   templateName: "ID Standard",
  //   fileUrl:
  //     "https://truemedpo.blob.core.windows.net/demoapp-pdf/IDRawResult_638333297867482199_Infectious Disease Sample file_638333297874793050_.pdf",
  // });
  // const handleTemplateChange = (id: number, url: string, e: any) => {
  //   const updatedState = {
  //     id: id,
  //     templateName: e.target.value,
  //     fileUrl: url,
  //   };
  //   setSelectedTemplate(updatedState);
  // };
  const [selectedTemplates, setSelectedTemplates] = useState<any[]>([
    // {
    //   reqType: "ID Standard", // Default reqType for selection
    //   id: 4, // Default selected ID for this reqType
    //   templateName: "ID Standard", // Default template name for this reqType
    //   fileUrl:
    //     "https://truemedpo.blob.core.windows.net/demoapp-pdf/IDRawResult_638333297867482199_Infectious Disease Sample file_638333297874793050_.pdf", // Default file URL
    // },
  ]);

  const [selectedReqType, setSelectedReqType] = useState<string>("");
  const handleTemplateChange = (
    id: number,
    url: string,
    e: any,
    reqType: string
  ) => {
    setSelectedTemplates((prevTemplates: any[]) => {
      const updatedTemplates = [...prevTemplates];
      const index = updatedTemplates.findIndex(
        (template) => template.reqType === reqType
      );

      const newTemplate = {
        reqType: reqType,
        id: id,
        templateName: e.target.value,
        fileUrl: url,
      };
      setSelectedReqType(reqType);
      // If the reqType already exists, update it
      if (index > -1) {
        updatedTemplates[index] = newTemplate;
      } else {
        // Otherwise, add a new selection
        updatedTemplates.push(newTemplate);
      }

      return updatedTemplates;
    });
  };

  const [noProvider, setNoProvider] = useState(false);
  const [path, setPath] = React.useState<any>([]);
  const [facultyOptions, setFacultyOptions] = React.useState([]);
  const [isVisibility, setIsVisibility] = useState(false);
  const [isVisibility2, setIsVisibility2] = useState(false);
  const [isFacilityExist, setIsFacilityExist] = useState(false);
  const [isUserNameExistError, setIsUserNameExistError] = useState("");
  const [isEmailExistError, setIsEmailExistError] = useState("");
  const [isRequest, setIsRequest] = useState(false);
  const [file, setFilename] = useState("");
  const [formValues, setFormValues] = useState<any>({
    activationType: 0,
    password: generateAutoGeneratePassword(),
    facilityOpt: [],
    // files: [],
  });
  //const { formData2 }: any = useForm(initialState, validate);

  const [formData2, setformData2] = useState();
  const [providerFormData, setProviderFormData] = useState<any[]>([]);
  const [lastTypedInput, setLastTypedInput] = useState<InputField | null>(null);
  const [loadingProvider, setLoadingProvider] = useState<any>(false);
  const [labAssignmentLookup, setLabAssignmentLook] = useState<any>(null);
  const [labAssingnmentIds, setLabAssignmentIds] = useState<any>(null);
  const [check, setCheck] = useState(true);
  const [newProvider, setNewProvider] = useState("");

  let initState = checkFormState(
    initialState,
    formValues.activationType,
    check ? false : true
  );

  const {
    formData,
    errors,
    changeHandler,
    setErrors,
    setDataAndErrors,
    setFormData,
  }: any = useForm(
    initState,
    validate,
    formValues?.activationType,
    check,
    noProvider
  );
  const { id } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    fetchFacultyOptions("");
  }, []);
  const fetchFacultyOptions = async (opts: any) => {
    await FacilityService.getFacultyOptions()
      .then((res: AxiosResponse) => {
        setFacultyOptions(res.data.data);
      })
      .catch((err: AxiosError) => {});
  };
  const [loading, setLoading] = useState<any>(false);

  const handleUpload = async () => {
    let obj: any = {};
    // Convert the FileList into an array and iterate
    let files = Array.from(images).map((file: any) => {
      // Define a new file reader
      let reader = new FileReader();
      // Create a new promise
      return new Promise((resolve) => {
        // Resolve the promise after reading file
        reader.onload = (event: any) => {
          const content = event.target.result;
          const byteArray = new Uint8Array(content);
          const byteRepresentation = Array.from(byteArray);
          const filename = file.name;
          const extension = filename.split(".").pop();
          setFilename(filename);
          obj = {
            name: filename,
            portalKey: "demo-app",
            fileType: file.type,
            extention: extension,
            content: byteRepresentation,
            isPublic: true,
          };
          resolve(obj);
        };
        reader.readAsArrayBuffer(file);
      });
    });
    // At this point you'll have an array of results
    let res = await Promise.all(files);
    setLoading(true);
    await FacilityService.UploadFilesToBlobFormModel(res)
      .then((res: AxiosResponse) => {
        setPath(res?.data?.Data);
        toast.success(res?.data?.Title);
        setLoading(false);
      })
      .catch((err: AxiosError) => {});
  };

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

  const [combinedArray, setCombinedArray] = useState<
    { name: string; fileLength: number; filePath: string }[]
  >([]);
  useEffect(() => {
    const mergedData = images.map((image: any, index: any) => ({
      // id: 0,
      name: image.name,
      fileLength: image.size,
      filePath: path[index],
      labId: matchedTenantId,
    }));
    setCombinedArray(mergedData);
  }, [images, path]);

  const hasSpacesInUsername = (username: string) => {
    return username.includes(" ");
  };

  const isUsernameAnEmail = (username: string) => {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(username);
  };
  const handleSubmit = (e: any) => {
    if (isEmailExistError === "" || isUserNameExistError === "") {
      e.preventDefault();
      let size;
      let formErrors: any;
      formErrors = validate(formData, true);
      setErrors(formErrors);
      if (hasSpacesInUsername(formData?.username?.value)) {
        toast.error(t("Username cannot contain spaces!"), {
          position: "top-center",
        });
        return;
      }

      if (isUsernameAnEmail(formData?.username?.value)) {
        toast.error(t("Username cannot be an email!"), {
          position: "top-center",
        });
        return;
      }

      if (labType == LabType.POL && !formData?.mdFirstName?.value) {
        toast.error(t("MD First Name is required!"), {
          position: "top-center",
        });
        return;
      } else if (labType == LabType.POL && !formData?.mdLastName?.value) {
        toast.error(t("MD Last Name is required!"), {
          position: "top-center",
        });
        return;
      } else if (labType == LabType.POL && !formData?.facilityLogoUrl?.value) {
        toast.error(t("Facility Logo is required!"), {
          position: "top-center",
        });
        return;
      }

      size = Object.keys(formErrors).length;
      const idsArray = selectedTemplates.map((template) => template.id);
      const objToSend: any = {
        generalInfo: {
          facilityId: id ? parseInt(id) : 0,
          facilityName: formData.facilityName.value,
          facilityStatus: "Active",
          zipCode: formData.zipCode.value,
          facilityPhone: formData.facilityPhone.value,
          facilityFax: formData.facilityFax.value,
          facilityWebsite: formData?.facilityWebsite?.value,
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
        providerInfo: {
          physicianFirstName: formData.physicianFirstName.value,
          physicianLastName: formData.physicianLastName.value,
          phoneNumber: formData.phoneNumber.value,
          npi: formData.npi.value,
          ProviderId: physicianId,
          stateLicense: formData.stateLicense.value,
          activationType: parseInt(formData?.activationType.value),
          gender: formData.gender.value,
          username:
            formData?.activationType.value.toString() === "0"
              ? formData.username.value
              : null,
          password:
            formData?.activationType.value.toString() === "0"
              ? formData.password.value
              : null,
          email:
            formData?.activationType.value.toString() === "1"
              ? formData.email.value
              : null,
        },
        shippingInfo: {
          shippingName: formData.shippingName.value,
          shippingAddress: formData.shippingAddress.value,
          shippingPhoneNumber: formData.shippingPhoneNumber.value,
          shippingEmail: formData.shippingEmail.value,
          shippingNote: formData.shippingNote.value,
        },
        facilityOpt: formValues.facilityOpt,
        files: combinedArray,
        templateIds: idsArray,
        profileInfo: {
          isDefault: formData.labAssignment.value === "1" ? false : true,
          labAssignmentIds:
            formData.labAssignment.value === "1" ? labAssingnmentIds : [0],
        },
      };

      objToSend["isNoProvider"] = noProvider;

      if (noProvider) {
        delete objToSend.providerInfo;
      }

      if (size === 0) {
        setIsRequest(true);
        FacilityService.createFacility(objToSend)
          .then((res: AxiosResponse) => {
            if (res.data.status === 200) {
              toast.success(res.data.title);
              setTimeout(() => {
                navigate("/facilitylist");
              }, 100);
              setIsRequest(false);
            } else {
              toast.error(t("Facility Name Already Exist..."), {
                position: "top-center",
              });
            }
          })
          .catch((err: AxiosError) => {
            setIsRequest(false);
          })
          .finally(() => {
            setIsRequest(false);
          });
      } else {
        toast.error(t("Please enter all the required fields"), {
          position: "top-center",
        });
      }
    }
  };
  const isFacilityAlreadyExist = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      FacilityService.isFacilityUnique(e.target.value)
        .then((res: AxiosResponse) => {
          if (res.data.isExist) {
            setIsFacilityExist(true);
            toast.error(t("Facility Name already exist"), {
              position: "top-center",
            });
          } else {
            setIsFacilityExist(false);
          }
        })
        .catch((err: AxiosError) => {});
    }
  };
  const LoadTemplate = () => {
    FacilityService.LoadTemplate()
      .then((res: AxiosResponse) => {
        setShowTemplate(res.data.data);
      })
      .catch((err: AxiosError) => {});
  };

  const ValidUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // If the input value is empty, set check to false and return early.
    if (inputValue === "") {
      setCheck(false);
      return;
    }
    // Prepare the request object for the API call.
    const usernameRequest = {
      keyValue: inputValue,
      id: null,
    };
    // Call the API to check if the username exists.
    Commonservice.isValidUsername(usernameRequest)
      .then((res: AxiosResponse) => {
        // If the username exists, set check to true and clear any error message.
        if (res.data) {
          setCheck(true);
          setIsUserNameExistError("");
        } else {
          // If the username does not exist, show an error message and set check to false.
          toast.info(t("Username Already Exist"));
          setCheck(false);
        }
      })
      .catch((err: AxiosError) => {
        // Handle any errors from the API call.
        console.error(err);
        // Optionally, set check to false if there's an error.
        setCheck(false);
      });
  };

  const ValidEmail = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var validEmailRequest = {
        keyValue: e.target.value,
        id: null,
      };
      Commonservice.isValidEmail(validEmailRequest)
        .then((res: AxiosResponse) => {
          if (res.data) {
            toast.info(t("Email Already Exist"));
            setIsEmailExistError(t("Email Already Exist"));
            // setIsEmailExistError('Email Already Exist')
          } else {
            setIsEmailExistError("");
          }
          //
        })
        .catch((err: AxiosError) => {
          console.error(err);
        });
    }
  };
  useEffect(() => {
    LoadTemplate();
  }, []);

  // Search Physician on the basis of NPI number

  const onSearchNpiNmuber = () => {
    setLoading((preVal: any) => {
      return {
        ...preVal,
        search: true,
      };
    });
    RequisitionType.searchNpi(formData.npi.value)
      .then((res: AxiosResponse) => {
        if (Object.values(res?.data).every((value) => value === null)) {
          toast.error(t("No matching records found"), {
            position: "top-center",
          });
        }

        setFormData((preVal: any) => {
          return {
            ...preVal,
            physicianFirstName: {
              ...formData["physicianFirstName"],
              value: res?.data?.FirstName,
            },
            physicianLastName: {
              ...formData["physicianLastName"],
              value: res?.data?.LastName,
            },
            // gender: {
            //   ...formData["gender"],
            //   value:
            //     res?.data?.Gender === "M"
            //       ? "Male"
            //       : res?.data?.Gender === "F"
            //       ? "Female"
            //       : res?.data?.Gender === "U"
            //       ? "Unknown"
            //       : "",
            // },
          };
        });
      })
      .catch((err: AxiosError) => console.trace(err))
      .finally(() =>
        setLoading((preVal: any) => {
          return {
            ...preVal,
            search: false,
          };
        })
      );
  };
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>();

  useEffect(() => {
    if (newProvider === "new") return;

    let filtersToSearchWith = {
      physicianFirstName: formData?.physicianFirstName?.value,
      physicianLastName: formData?.physicianLastName?.value,
      npi: formData?.npi?.value,
    };
    setLoadingProvider(true);

    const delayDebounceFn = setTimeout(async () => {
      try {
        let { data: providerData } =
          await FacilityService.getProviderByFnameLnameNpi(filtersToSearchWith);
        setProviderFormData(providerData?.data);
        if (lastTypedInput) {
          setAnchorEl(inputRef.current[lastTypedInput]?.current);
          setPopoverWidth(inputRef.current.npi.current?.offsetWidth);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingProvider(false);
      }
    }, 2000);

    return () => clearTimeout(delayDebounceFn);
  }, [
    formData?.physicianFirstName?.value,
    formData?.physicianLastName?.value,
    formData?.npi?.value,
  ]);

  const handleInputChange = (e: any) => {
    setLastTypedInput(e.target.name);
  };

  const [physicianId, setPhysicianId] = useState("");
  const setProviderFieldValue = (provider: any) => {
    setPhysicianId(provider.PhysicianId);
    const updatedFormData = Object.keys(formData).reduce(
      (acc: any, key: any) => {
        const providerKey = Object.keys(provider).find(
          (providerKey) =>
            providerKey.charAt(0).toLowerCase() + providerKey.slice(1) === key
        );
        if (providerKey) {
          acc[key] = { ...formData[key], value: provider[providerKey] };
          setFormValues((prevVal: any) => ({
            ...prevVal,
            activationType: provider?.ActivationType,
          }));
        } else {
          acc[key] = { ...formData[key] };
        }
        return acc;
      },
      {}
    );
    setFormData(updatedFormData);
    closeSuggestions();
  };

  const getLabAssignmentLookups = async () => {
    let response = await FacilityService.getLabAssignmentLookup();
    setLabAssignmentLook(response.data.result);
  };

  useEffect(() => {
    getLabAssignmentLookups();
  }, []);

  const handleChangeGroups = (event: any) => {
    const values = event.map((item: any) => item.value);
    setLabAssignmentIds(values);
  };
  const CheckUsernameValidity = (val: any) => {
    const usernameRequest = {
      keyValue: val,
      id: null,
    };
    Commonservice.isValidUsername(usernameRequest)
      .then((res: AxiosResponse) => {
        if (res.data) {
          setCheck(true);
          setIsUserNameExistError("");
        } else {
          toast.warning(t("Username Already Exist"));
          setCheck(false);
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
        setCheck(false);
      });
  };

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null); // State to store anchor element reference
  const inputRef = useRef({
    npi: React.createRef<HTMLInputElement>(),
    physicianFirstName: React.createRef<HTMLInputElement>(),
    physicianLastName: React.createRef<HTMLInputElement>(),
  });

  // Function to close the popover
  const closeSuggestions = () => {
    setAnchorEl(null); // Close the popover
    setLastTypedInput(null);
  };
  const open = Boolean(anchorEl); // Popover opens when anchorEl is not null
  const SearchedDataOutsiderAlert = React.memo(() => {
    return (
      <>
        {providerFormData?.length ? (
          <Popover
            id="simple-popover"
            open={open}
            anchorEl={anchorEl}
            onClose={closeSuggestions}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            sx={{
              height: "200px",
            }}
          >
            {providerFormData?.map((provider: any, index) => (
              <div
                onClick={() => setProviderFieldValue(provider)}
                key={`${index + provider}`}
                className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                style={{
                  borderBottom: "1.5px solid var(--kt-primary)",
                  width: `${popoverWidth}px`,
                }}
              >
                {Object.keys(provider)?.map((key, i) => (
                  <div className="text-hover-primary d-flex" key={`${i + key}`}>
                    <span className="fw-600 fs-7">
                      {key?.toLocaleUpperCase()} :
                    </span>
                    <span className="pl-2 fs-7">{provider[key]}</span>
                    <br />
                  </div>
                ))}
              </div>
            ))}
          </Popover>
        ) : null}
      </>
    );
  });
  useEffect(() => {
    if (anchorEl) {
      setPopoverWidth(anchorEl.offsetWidth);
    }
  }, [anchorEl]);

  useEffect(() => {
    if (copyContactInfo) {
      setFormData((preVal: any) => {
        return {
          ...preVal,
          criticalFirstName: {
            ...formData["criticalFirstName"],
            value: formData.contactFirstName.value,
          },
          criticalLastName: {
            ...formData["criticalLastName"],
            value: formData.contactLastName.value,
          },
          criticalEmail: {
            ...formData["criticalEmail"],
            value: formData.contactPrimaryEmail.value,
          },
          criticalPhoneNo: {
            ...formData["criticalPhoneNo"],
            value: formData.contactPhone.value,
          },
        };
      });
    } else {
      setFormData((preVal: any) => {
        return {
          ...preVal,
          criticalFirstName: {
            ...formData["criticalFirstName"],
            value: "",
          },
          criticalLastName: {
            ...formData["criticalLastName"],
            value: "",
          },
          criticalEmail: {
            ...formData["criticalEmail"],
            value: "",
          },
          criticalPhoneNo: {
            ...formData["criticalPhoneNo"],
            value: "",
          },
        };
      });
    }
  }, [copyContactInfo]);

  return (
    <div>
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
                <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
                  <div
                    id="kt_app_toolbar_container"
                    className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
                  >
                    <BreadCrumbs />
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <Link
                        id="AddFacilityCancelTop"
                        to="/facilitylist"
                        className="btn btn-sm fw-bold btn-cancel"
                      >
                        {t("Cancel")}
                      </Link>
                      <LoadButton
                        className="btn btn-sm fw-bold btn-primary"
                        loading={isRequest}
                        btnText={t("Save")}
                        loadingText={t("Saving")}
                        name="facilitySaveButtonTop"
                      />
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
                    <div
                      className="d-flex flex-column me-n7 pe-7"
                      id="kt_modal_add_user_scroll"
                      data-kt-scroll="true"
                      data-kt-scroll-activate="{default: false, lg: true}"
                      data-kt-scroll-max-height="auto"
                      data-kt-scroll-dependencies="#kt_modal_add_user_header"
                      data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                      data-kt-scroll-offset="190px"
                    >
                      <div className="card shadow-xl shadow-xl">
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("General Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-3 py-2">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("Company Name")}
                              name="facilityName"
                              //onBlur={isFacilityAlreadyExist}
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Facility Name")}
                              value={formData?.facilityName?.value}
                              error={errors?.facilityName}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Address")}
                              name="address1"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address")}
                              value={formData?.address1?.value}
                              error={errors?.address1}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Address 2")}
                              name="address2"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address 2")}
                              value={formData?.address2.value}
                              error={errors?.address2}
                              required={false}
                            />
                            <Input
                              type="text"
                              label={t("Zip Code")}
                              name="zipCode"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Zip Code")}
                              value={formData?.zipCode?.value}
                              error={errors.zipCode}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("City")}
                              name="city"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("City")}
                              value={formData?.city?.value}
                              error={errors?.city}
                              required={true}
                            />
                            <Select
                              menuPortalTarget={document.body}
                              label={t("State")}
                              name="state"
                              id="state2"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              options={stateDropdownArray}
                              value={formData?.state?.value}
                              onChange={changeHandler}
                              error={errors.state}
                              required={true}
                            />

                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="facilityPhone"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.facilityPhone?.value}
                              error={errors?.facilityPhone}
                              required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Fax")}
                              name="facilityFax"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Fax No")}
                              value={formData?.facilityFax?.value}
                              error={errors?.facilityFax}
                              required={true}
                            />
                            {/* <Input
                              type="text"
                              label={t("Website")}
                              name="facilityWebsite"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Facility Website")}
                              value={formData?.facilityWebsite?.value}
                              error={errors?.facilityWebsite}
                              required={false}
                            /> */}
                          </div>
                        </div>
                      </div>
                      <div className="card shadow-xl mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Contact Information")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-3 py-2">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("First Name")}
                              name="contactFirstName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("First Name")}
                              value={formData?.contactFirstName?.value}
                              error={errors?.contactFirstName}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Last Name")}
                              name="contactLastName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Last Name")}
                              value={formData?.contactLastName?.value}
                              error={errors?.contactLastName}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Email")}
                              name="contactPrimaryEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Contact Email")}
                              value={formData?.contactPrimaryEmail?.value}
                              error={errors?.contactPrimaryEmail}
                              required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="contactPhone"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.contactPhone?.value}
                              error={errors?.contactPhone}
                              required={true}
                            />
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Critical Contact Information")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-3 py-2">
                          <div>
                            <input
                              id="copyContactInfo"
                              className="form-check-input mr-2 mb-4"
                              type="checkbox"
                              name="copyContactInfo"
                              checked={copyContactInfo}
                              onChange={() =>
                                setCopyContactInfo((prev) => !prev)
                              }
                            />
                            <label htmlFor="allUsersCheckbox">
                              {t("Copy Contact Info")}
                            </label>
                          </div>
                          <div className="row">
                            {/* <!--begin::Input group--> */}
                            <Input
                              type="text"
                              label={t("First Name")}
                              name="criticalFirstName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("First Name")}
                              value={formData?.criticalFirstName?.value}
                              error={errors?.criticalFirstName}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Last Name")}
                              name="criticalLastName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Last Name")}
                              value={formData?.criticalLastName?.value}
                              error={errors?.criticalLastName}
                              required={true}
                            />
                            <Input
                              type="text"
                              label={t("Email")}
                              name="criticalEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Email")}
                              value={formData?.criticalEmail?.value}
                              error={errors?.criticalEmail}
                              required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="criticalPhoneNo"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.criticalPhoneNo?.value}
                              error={errors?.criticalPhoneNo}
                              required={true}
                            />
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      {/* <!--end::Critical Information Card--> */}

                      {/* <!--end::Provider Information Card--> */}
                      <div className="card shadow-xl mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Ordering Provider Information")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-3 py-2">
                          <div>
                            <input
                              className="form-check-input mr-2 mb-4"
                              type="checkbox"
                              id="noProvider"
                              name="noProvider"
                              checked={noProvider}
                              onChange={() => setNoProvider(!noProvider)}
                            />
                            <label htmlFor="noProvider">
                              {t("No Provider")}
                            </label>
                          </div>
                          {!noProvider && (
                            <div className="mb-2">
                              <Radio
                                name="provider"
                                onChange={(e: any) => {
                                  setNewProvider(e.target.value);
                                }}
                                choices={[
                                  {
                                    id: "new",
                                    label: t("New"),
                                    value: "new",
                                  },
                                  {
                                    id: "existing",
                                    label: t("Existing"),
                                    value: "existing",
                                  },
                                ]}
                                checked={newProvider}
                              />
                            </div>
                          )}

                          <div className={noProvider ? "overlay" : ""}>
                            <div
                              className="row"
                              style={{ position: "relative" }}
                            >
                              <div className="row align-items-center">
                                <Input
                                  ref={inputRef.current.npi}
                                  type="text"
                                  label={t("NPI #")}
                                  name="npi"
                                  onChange={(e: any) => {
                                    changeHandler(e);
                                    handleInputChange(e);
                                  }}
                                  className="form-control bg-transparent"
                                  parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                                  placeholder={t("NPI #")}
                                  value={formData?.npi?.value}
                                  error={errors.npi}
                                  required={!noProvider}
                                  aria-describedby="simple-popover"
                                />
                                <SearchedDataOutsiderAlert />

                                <div className="mb-3 mb-md-0 col-xl-6 col-lg-6 col-md-6 col-sm-12">
                                  <button
                                    id="AddFacilityNPIData"
                                    onClick={onSearchNpiNmuber}
                                    type="button"
                                    className="btn btn-light btn-sm px-4 mx-2 py-3"
                                    disabled={loading.search}
                                  >
                                    {loading.search
                                      ? t("Search & Adding...")
                                      : t("Add NPI Data")}
                                  </button>
                                </div>
                              </div>

                              <Input
                                ref={inputRef.current.physicianFirstName}
                                type="text"
                                label={t("Provider First Name")}
                                name="physicianFirstName"
                                onChange={(e: any) => {
                                  changeHandler(e);

                                  handleInputChange(e);
                                }}
                                className="form-control bg-transparent"
                                parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                                placeholder={t("Provider First Name")}
                                value={formData?.physicianFirstName?.value}
                                error={errors?.physicianFirstName}
                                required={!noProvider}
                              />

                              <div style={{ position: "absolute", top: 0 }}>
                                {loadingProvider ? <Splash /> : null}
                              </div>
                              <Input
                                ref={inputRef.current.physicianLastName}
                                type="text"
                                label={t("Provider Last Name")}
                                name="physicianLastName"
                                onChange={(e: any) => {
                                  changeHandler(e);

                                  handleInputChange(e);
                                }}
                                className="form-control bg-transparent"
                                parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                                placeholder={t("Provider Last Name")}
                                value={formData?.physicianLastName?.value}
                                error={errors?.physicianLastName}
                                required={!noProvider}
                              />

                              <Input
                                type="tel"
                                label={t("Phone")}
                                name="phoneNumber"
                                onChange={changeHandler}
                                className="form-control bg-transparent"
                                parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                                placeholder={t("(999) 999-9999")}
                                value={formData?.phoneNumber?.value}
                                error={errors?.phoneNumber}
                              />

                              <Input
                                type="text"
                                label={t("State License")}
                                name="stateLicense"
                                onChange={changeHandler}
                                className="form-control bg-transparent"
                                parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                                placeholder={t("State License")}
                                value={formData?.stateLicense?.value}
                                // error={errors?.stateLicense}
                              />
                              <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12">
                                {/* <!--begin::Input group--> */}
                                <div className="fv-row mb-4">
                                  <Radio
                                    label={t("Account Activation Type")}
                                    name="activationType"
                                    onChange={(e: any) => {
                                      setFormValues((prevVal: any) => ({
                                        ...prevVal,
                                        activationType: +e.target.value,
                                      }));
                                      changeHandler(e);
                                    }}
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
                                    error={errors.activationType}
                                    checked={formData.activationType.value.toString()}
                                    setformData2={setformData2}
                                  />
                                </div>
                              </div>

                              {formData.activationType.value === "0" ||
                              formData.activationType.value === 0 ? (
                                <>
                                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 thenuser">
                                    {/* <!--begin::Input group--> */}

                                    <div className="fv-row mb-4">
                                      <label className="required   mb-2">
                                        {t("UserName")}
                                      </label>
                                      <input
                                        type="text"
                                        name="username"
                                        onBlur={ValidUsername}
                                        onChange={changeHandler}
                                        className="form-control bg-transparent"
                                        placeholder={t("UserName")}
                                        value={formData?.username?.value}
                                        autoComplete="off"
                                      />
                                      {errors?.username != null ? (
                                        <div className="form__error">
                                          <span>{errors?.username}</span>
                                        </div>
                                      ) : (
                                        <div className="form__error">
                                          <span>{isUserNameExistError}</span>
                                        </div>
                                      )}
                                      {/* <!--end::Input--> */}
                                    </div>
                                    {/* <!--end::Input group--> */}
                                  </div>
                                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 showpass thenuser">
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
                                            className={
                                              check
                                                ? "form-control bg-transparent"
                                                : "form-control bg-secondary"
                                            }
                                            name="password"
                                            onChange={changeHandler}
                                            type={
                                              isVisibility ? "text" : "password"
                                            }
                                            placeholder={t("Password")}
                                            autoComplete="off"
                                            value={formData?.password?.value}
                                            disabled={check ? false : true}
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
                                              setDataAndErrors(updatedData);
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
                                  <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 showpass thenuser">
                                    <div
                                      className="fv-row mb-8"
                                      data-kt-password-meter="true"
                                    >
                                      <label className="required mb-2">
                                        {t("Re-enter Password")}
                                      </label>

                                      <div className="mb-1">
                                        <div className="position-relative mb-3 getPass">
                                          <input
                                            type={
                                              isVisibility2
                                                ? "text"
                                                : "password"
                                            }
                                            className={
                                              check
                                                ? "form-control bg-transparent"
                                                : "form-control bg-secondary"
                                            }
                                            name="reEnterPassword"
                                            onChange={changeHandler}
                                            placeholder={t("Re-enter Password")}
                                            autoComplete="off"
                                            value={
                                              formData?.reEnterPassword?.value
                                            }
                                            disabled={check ? false : true}
                                          />

                                          <span
                                            onClick={() =>
                                              setIsVisibility2(!isVisibility2)
                                            }
                                            className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2"
                                          >
                                            {isVisibility2 ? (
                                              <i className="fa fa-eye text-primary"></i>
                                            ) : (
                                              <EyeIconSlash />
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
                                </>
                              ) : null}
                              {formData.activationType.value === "1" ||
                              formData.activationType.value === 1 ? (
                                <div className="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12 thenemail">
                                  {/* <!--begin::Input group--> */}
                                  <div className="fv-row mb-4">
                                    {/* <!--begin::Label--> */}
                                    <label className="required   mb-2">
                                      {t(
                                        "Email (Associated with Account Login)"
                                      )}
                                    </label>
                                    {/* <!--end::Label--> */}
                                    {/* <!--begin::Input--> */}
                                    <input
                                      type="text"
                                      name="email"
                                      onBlur={ValidEmail}
                                      onChange={changeHandler}
                                      value={formData?.email?.value}
                                      className="form-control bg-transparent"
                                      placeholder={t(
                                        "Email (Associated with Account Login)"
                                      )}
                                    />
                                    {errors?.email != null ? (
                                      <div className="form__error">
                                        <span>{errors?.email}</span>
                                      </div>
                                    ) : (
                                      <div className="form__error">
                                        <span>{isEmailExistError}</span>
                                      </div>
                                    )}
                                    {/* <span style={{ color: 'red' }}>
                                    {isEmailExistError}
                                  </span>
                                  {errors?.email && (
                                    <div className="form__error">
                                      <span> {errors?.email}</span>
                                    </div>
                                  )} */}
                                    {/* <!--end::Input--> */}
                                  </div>

                                  {/* <!--end::Input group--> */}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card shadow-xl mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
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
                        <div className="card-body py-md-3 py-2">
                          <div className="row">
                            <Input
                              type="text"
                              label={t("Facility Name")}
                              name="shippingName"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Name")}
                              value={formData?.shippingName?.value}
                              error={errors?.shippingName}
                              // required={true}
                            />

                            <Input
                              type="text"
                              label={t("Address")}
                              name="shippingAddress"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Address")}
                              value={formData?.shippingAddress?.value}
                              error={errors?.shippingAddress}
                              // required={true}
                            />
                            <Input
                              type="tel"
                              label={t("Phone")}
                              name="shippingPhoneNumber"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("(999) 999-9999")}
                              value={formData?.shippingPhoneNumber?.value}
                              error={errors?.shippingPhoneNumber}
                              // required={true}
                            />
                            <Input
                              type="email"
                              label={t("Email")}
                              name="shippingEmail"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Email")}
                              value={formData?.shippingEmail?.value}
                              error={errors?.shippingEmail}
                              // required={true}
                            />
                            <Input
                              type="text"
                              label={t("Notes/Instructions")}
                              name="shippingNote"
                              onChange={changeHandler}
                              className="form-control bg-transparent"
                              parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
                              placeholder={t("Shipping Note")}
                              value={formData?.shippingNote?.value}
                              error={errors?.shippingNote}
                              // required={true}
                            />
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card shadow-xl mt-4">
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Lab Profile")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-3 py-2">
                          <div className="row">
                            <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                              <Radio
                                label={t("Lab Service Assignment")}
                                name="labAssignment"
                                onChange={changeHandler}
                                choices={[
                                  {
                                    id: "Addfacility-default",
                                    label: t("Default"),
                                    value: "0",
                                  },
                                  {
                                    id: "Addfacility-Custom",
                                    label: t("Custom"),
                                    value: "1",
                                  },
                                ]}
                                error={errors?.labAssignment}
                                checked={formData?.labAssignment?.value}
                              />
                            </div>
                            <div className="col-xxl-3 col-xl-4 col-md-6 col-sm-12 col-12 mb-3">
                              {formData.labAssignment.value === "1" && (
                                <MultiSelect
                                  id="AddFacilityLabAssignment"
                                  isMulti
                                  options={labAssignmentLookup}
                                  name="groupNames"
                                  placeholder={t("Lab Assignments")}
                                  onChange={handleChangeGroups}
                                  required={true}
                                />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* Template selection */}
                      <div className="card shadow-xl mt-4 ">
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
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
                                      {t(uniqueReqType)}
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
                                                checked={
                                                  selectedTemplates.find(
                                                    (sel) =>
                                                      sel.reqType ===
                                                      uniqueReqType
                                                  )?.templateName ===
                                                  template.templateName
                                                }
                                                onChange={(e: any) =>
                                                  handleTemplateChange(
                                                    template.id,
                                                    template.templateUrl,
                                                    e,
                                                    uniqueReqType
                                                  )
                                                }
                                              />
                                              {t(template.templateDisplayName)}
                                            </label>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                ))}
                              </div>
                              {selectedTemplates.length > 0 &&
                                selectedReqType && (
                                  <div className="col-xxl-10 col-lg-8 col-sm-12 col-md-6 d-flex justify-content-sm-end justify-content-center">
                                    <div className="card shadow-xl card-bordered shadow-xs bg-light-secondary">
                                      <div className="d-flex justify-content-around">
                                        <div className="card-body h-md-375px px-5 py-5">
                                          {(() => {
                                            const selected =
                                              selectedTemplates.find(
                                                (template) =>
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

                      <div className="card shadow-xl mt-4">
                        <div className="card-header minh-42px d-flex justify-content-between align-items-center">
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
                        <div className="card-body py-md-3 py-2">
                          <div className="mt-3">
                            <input
                              type="file"
                              onChange={handleFileSelect}
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
                          {images.length > 0 ? (
                            <>
                              {images?.map((filesData: any) => (
                                <>
                                  <div
                                    className="col-lg-8 col-sm-12 col-md-8"
                                    key={filesData}
                                  >
                                    <div className="border bg-light-secondary rounded p-2 my-3">
                                      <div
                                        id="AddFacilityUploadFile"
                                        className="d-flex justify-content-between"
                                      >
                                        <>
                                          <div className="text-dark-65">
                                            <span>
                                              <span className="fw-bold">
                                                {t("File Name:")}
                                              </span>
                                              {filesData?.name}
                                              <span className="fw-bold">
                                                {t("File Size:")}
                                              </span>
                                              {getImageFileSize(
                                                filesData?.size
                                              )}
                                            </span>
                                            <br />
                                            {parseInt(
                                              getImageFileSize(filesData?.size)
                                            ) > 1000 ? (
                                              <span className="fw-500 text-dark">
                                                {t(
                                                  "File is too big. Max filesize: 1MiB."
                                                )}
                                              </span>
                                            ) : null}
                                          </div>
                                          <div>
                                            <span className="px-5">
                                              {extractLastModifiedDate(
                                                filesData?.lastModifiedDate
                                              )}
                                            </span>

                                            <span
                                              style={{
                                                fontSize: "13px",
                                                cursor: "pointer",
                                              }}
                                              onClick={() =>
                                                handleImageDeselect(filesData)
                                              }
                                            >
                                              &#x2716;
                                            </span>
                                          </div>
                                        </>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              ))}

                              <>
                                <div className="my-2">
                                  <span className="fs-7 text-gray-400">
                                    <span className="fw-bold">
                                      {t("Note:")}
                                    </span>
                                    {t(
                                      "Max file size is 10MB and max number of files is 10."
                                    )}
                                  </span>
                                </div>
                                <div className="mt-2">
                                  <button
                                    id="AddFacilityUploadAll"
                                    className="dropzone-select btn btn-light-primary font-weight-bold btn-sm dz-clickable mr-2"
                                    onClick={handleUpload}
                                  >
                                    {loading ? (
                                      <span>
                                        <LoaderIcon />
                                      </span>
                                    ) : (
                                      <span></span>
                                    )}
                                    <span>{t("Upload All")}</span>
                                  </button>
                                  <button
                                    id="AddFacilityRemoveAll"
                                    onClick={() => setImages([])}
                                    className="dropzone-select btn btn-light-danger font-weight-bold btn-sm dz-clickable"
                                  >
                                    {t("Remove All")}
                                  </button>
                                </div>
                              </>
                            </>
                          ) : null}
                        </div>
                      </div>
                      {labType == LabType.POL ? (
                        <div className="card shadow-xl mt-4">
                          <div className="card-header minh-42px d-flex justify-content-between align-items-center">
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
                                  parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
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
                                  parentDivClassName="col-xl-3 col-lg-4 col-md-6 col-sm-12 col-12"
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
                      <div className="d-flex justify-content-end mt-2">
                        <div className="d-flex align-items-center gap-2 gap-lg-3">
                          <Link
                            id="AddFacilityCancelBottom"
                            to="/facilitylist"
                            className="btn btn-sm fw-bold btn-cancel"
                          >
                            {t("Cancel")}
                          </Link>
                          <LoadButton
                            className="btn btn-sm fw-bold btn-primary"
                            loading={isRequest}
                            btnText={t("Save")}
                            loadingText={t("Saving")}
                            name="facilitySaveButtonBottom"
                          />
                        </div>
                      </div>
                    </div>
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
          <div className="card shadow-xl shadow-none rounded-0 w-100">
            <div
              className="card-header bg-light-primary"
              id="kt_engage_demos_header"
            >
              <h3 className="card-title fw-bold text-gray-700">{t("Demos")}</h3>
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
          <div className="card shadow-xl shadow-none rounded-0 w-100">
            <div className="card-header bg-light-primary" id="kt_help_header">
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
                <form id="kt_modal_new_ticket_form" className="form" action="#">
                  <div className="d-flex flex-column mb-8 fv-row">
                    <label className="d-flex align-items-center   mb-2">
                      <span className="required">{t("Subject")}</span>
                      <i
                        className="fas fa-exclamation-circle ms-2 fs-7"
                        data-bs-toggle="tooltip"
                        title="Specify a subject for your issue"
                      ></i>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      placeholder="Enter your ticket subject"
                      name="subject"
                    />
                  </div>
                  <div className="d-flex flex-column mb-8 fv-row">
                    <label className="  mb-2">{t("Description")}</label>
                    <textarea
                      className="form-control form-control-solid"
                      name="description"
                      placeholder="Type your ticket description"
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
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(AddFacility);
