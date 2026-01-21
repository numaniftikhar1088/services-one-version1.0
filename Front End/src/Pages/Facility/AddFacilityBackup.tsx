import { generate } from "@wcj/generate-password";
import { AxiosError, AxiosResponse } from "axios";
import HttpClient from "HttpClient";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import { InputChangeEvent } from "../../Interface/Shared/Types";
import routes from "../../Routes/Routes.json";
import Commonservice from "../../Services/CommonService";
import FacilityService from "../../Services/FacilityService/FacilityService";


const AddFacility = (props: any) => {
  const { t } = useLang()
  const navigate = useNavigate();
  const { id } = useParams();
  const [facilityNameError, setFacilityNameError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [address2Error, setAddress2Error] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [zipCodeError, setZipCodeError] = useState(false);
  const [contactFnameError, setContactFnameError] = useState(false);
  const [contactLnameError, setContactLnameError] = useState(false);
  const [contactEmailError, setContactEmailError] = useState(false);
  const [facilityPhoneNoError, setFacilityPhoneNoError] = useState(false);
  const [contactPhoneNoError, setContactPhoneNoError] = useState(false);
  const [criticalFnameError, setCriticalFnameError] = useState(false);
  const [criticalLnameError, setCriticalLnameError] = useState(false);
  const [criticalEmailError, setCriticalEmailError] = useState(false);
  const [criticalPhoneNoError, setCriticalPhoneNoError] = useState(false);
  const [physFnameError, setPhysFnameError] = useState(false);
  const [physLnameError, setPhysLnameError] = useState(false);
  const [physPhonoNoError, setPhysPhoneNoError] = useState(false);
  const [physNpiError, setPhysNpiError] = useState(false);
  const [physLicenseNoError, setPhysLicenseError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [physEmailError, setPhysEmailError] = useState(false);
  const [confirmPasswordError, setConfirmPasswordError] = useState(false);
  const [activationTypeError, setActivationTypeError] = useState(false);
  const [generalPhoneFormatError, setGeneralPhoneFormatError] = useState("");
  const [contactPhoneFormatError, setContactPhoneFormatError] = useState("");
  const [criticalPhoneFormatError, setCriticalPhoneFormatError] = useState("");
  const [providerPhoneFormatError, setProviderPhoneFormatError] = useState("");
  const [shippingPhoneFormatError, setShippingPhoneFormatError] = useState("");
  const [contactEmailFormatError, setContactEmailFormatError] = useState("");
  const [criticalEmailFormatError, setCriticalEmailFormatError] = useState("");
  const [providerEmailFormatError, setProviderEmailFormatError] = useState("");
  const [shippingEmailFormatError, setShippingEmailFormatError] = useState("");
  const generateAutoGeneratePassword = () => {
    return generate({
      lowerCase: true,
      upperCase: true,
      numeric: true,
      special: true,
      length: 14,
    });
  };

  useEffect(() => {
    setFacilityReq({
      ...facilityReq,
      providerInfo: {
        ...facilityReq.providerInfo,
        password: generateAutoGeneratePassword(),
        reEnterPassword: generateAutoGeneratePassword(),
      },
    });
  }, []);
  const [facilityReq, setFacilityReq] = useState<any>({
    generalInfo: {
      facilityId: 0,
      facilityName: "",
      addressView: {
        address1: "",
        address2: "",
        zipCode: "",
        state: "",
        city: "",
      },
      facilityPhone: "",
      facilityFax: "",
      facilityWebsite: "",
    },
    contactInfo: {
      contactFirstName: "",
      contactLastName: "",
      contactPrimaryEmail: "",
      contactPhone: "",
    },
    criticalInfo: {
      criticalFirstName: "",
      criticalLastName: "",
      criticalEmail: "",
      criticalPhoneNo: "",
    },
    providerInfo: {
      physicianFirstName: "",
      physicianLastName: "",
      phoneNumber: "",
      npi: "",
      stateLicense: "",
      username: "",
      password: "",
      reEnterPassword: "",
      email: "",
      activationType: null,
    },
    shippingInfo: {
      shippingName: "",
      shippingAddress: "",
      shippingPhoneNumber: "",
      shippingEmail: "",
      shippingNote: "",
    },
    facilityOpt: [],
    uploadsInfo: {
      files: [{}],
    },
  });
  const getFacilityById = () => {
    FacilityService.getFacilityById(id)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          let facilityData = res.data.data;
          const {
            generalInfo,
            contactInfo,
            criticalInfo,
            providerInfo,
            shippingInfo,
          } = facilityData;
          setFacilityReq({
            ...facilityReq,
            generalInfo: {
              facilityId: generalInfo.facilityId,
              facilityName: generalInfo.facilityName,
              addressView: {
                address1: generalInfo.addressView.address1,
                address2: generalInfo.addressView.address2,
                zipCode: generalInfo.addressView.zipCode,
                state: generalInfo.addressView.state,
                city: generalInfo.addressView.city,
              },
              facilityPhone: generalInfo.facilityPhone,
              facilityFax: generalInfo.facilityFax,
              facilityWebsite: generalInfo.facilityWebsite,
            },
            contactInfo: {
              contactFirstName: contactInfo.contactFirstName,
              contactLastName: contactInfo.contactLastName,
              contactPrimaryEmail: contactInfo.contactPrimaryEmail,
              contactPhone: contactInfo.contactPhone,
            },
            criticalInfo: {
              criticalFirstName: criticalInfo.criticalFirstName,
              criticalLastName: criticalInfo.criticalLastName,
              criticalEmail: criticalInfo.criticalEmail,
              criticalPhoneNo: criticalInfo.criticalPhoneNo,
            },
            providerInfo: {
              physicianFirstName: providerInfo.physicianFirstName,
              physicianLastName: providerInfo.physicianLastName,
              phoneNumber: providerInfo.phoneNumber,
              npi: providerInfo.npi,
              stateLicense: providerInfo.stateLicense,
              username: providerInfo.username,
              password: providerInfo.password,
              reEnterPassword: providerInfo.reEnterPassword,
              email: providerInfo.email,
              activationType: providerInfo.activationType,
            },
            shippingInfo: {
              shippingName: shippingInfo.shippingName,
              shippingAddress: shippingInfo.shippingAddress,
              shippingPhoneNumber: shippingInfo.shippingPhoneNumber,
              shippingEmail: shippingInfo.shippingEmail,
              shippingNote: shippingInfo.shippingNote,
            },
          });

        } else {

        }
      })
      .catch((err: AxiosError) => {

      });
  };
  const [websiteUrlError, setWebsiteUrlError] = useState(false);
  const { facilityName, facilityPhone, facilityFax, facilityWebsite } =
    facilityReq.generalInfo;
  const { address1, address2, city, state, zipCode } =
    facilityReq.generalInfo.addressView;
  const {
    contactFirstName,
    contactLastName,
    contactPrimaryEmail,
    contactPhone,
  } = facilityReq.contactInfo;
  const {
    shippingName,
    shippingAddress,
    shippingPhoneNumber,
    shippingEmail,
    shippingNote,
  } = facilityReq.shippingInfo;
  const {
    criticalFirstName,
    criticalLastName,
    criticalEmail,
    criticalPhoneNo,
  } = facilityReq.criticalInfo;
  const {
    physicianFirstName,
    physicianLastName,
    phoneNumber,
    npi,
    stateLicense,
    username,
    password,
    reEnterPassword,
    email,
    activationType,
  } = facilityReq.providerInfo;
  const onInputFieldChange = (e: React.ChangeEvent<InputChangeEvent>) => {
    let name = e.target.name;
    if (
      name === "facilityName" ||
      name === "facilityPhone" ||
      name === "facilityFax" ||
      name === "facilityWebsite"
    ) {
      setFacilityReq({
        ...facilityReq,
        generalInfo: {
          ...facilityReq.generalInfo,
          [e.target.name]: e.target.value,
        },
      });
      if (name === "facilityWebsite") {
        let isValidUrl = Commonservice.urlPatternValidation(e.target.value);
        if (isValidUrl) {
          setWebsiteUrlError(false);
        } else {
          setWebsiteUrlError(true);
        }
      }
      if (e.target.name === "facilityName" && e.target.value.length > 0) {
        setFacilityNameError(false);
      }
      if (e.target.name === "facilityPhone" && e.target.value.length > 0) {
        setFacilityPhoneNoError(false);
        let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
        if (!validPhoneNo) {
          setGeneralPhoneFormatError("Only Digit Accepted");
        } else {
          setGeneralPhoneFormatError("");
        }
      }
    } else if (
      name === "address1" ||
      name === "address2" ||
      name === "city" ||
      name === "state" ||
      name === "zipCode"
    ) {
      setFacilityReq({
        ...facilityReq,
        generalInfo: {
          ...facilityReq.generalInfo,
          addressView: {
            ...facilityReq.generalInfo.addressView,
            [e.target.name]: e.target.value,
          },
        },
      });
      if (e.target.name === "state" && e.target.value.length > 0) {
        setStateError(false);
      }
      if (e.target.name === "address1" && e.target.value.length > 0) {
        setAddressError(false);
      }
      if (e.target.name === "address2" && e.target.value.length > 0) {
        setAddress2Error(false);
      }
      if (e.target.name === "city" && e.target.value.length > 0) {
        setCityError(false);
      }
      if (e.target.name === "zipCode" && e.target.value.length > 0) {
        setZipCodeError(false);
      }
    } else if (
      name === "contactFirstName" ||
      name === "contactLastName" ||
      name === "contactPrimaryEmail" ||
      name === "contactPhone"
    ) {
      setFacilityReq({
        ...facilityReq,
        contactInfo: {
          ...facilityReq.contactInfo,
          [e.target.name]: e.target.value,
        },
      });
      if (e.target.name === "contactFirstName" && e.target.value.length > 0) {
        setContactFnameError(false);
      }
      if (e.target.name === "contactLastName" && e.target.value.length > 0) {
        setContactLnameError(false);
      }
      if (
        e.target.name === "contactPrimaryEmail" &&
        e.target.value.length > 0
      ) {
        setContactEmailError(false);
        let res = Commonservice.isValidEmailFormat(e.target.value);
        if (!res) {
          setContactEmailFormatError("Invalid Email");
        } else {
          setContactEmailFormatError("");
        }
      }
      if (e.target.name === "contactPhone" && e.target.value.length > 0) {
        setContactPhoneNoError(false);
        let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
        if (!validPhoneNo) {
          setContactPhoneFormatError("Only Digit Accepted");
        } else {
          setContactPhoneFormatError("");
        }
      }
    } else if (
      name === "physicianFirstName" ||
      name === "physicianLastName" ||
      name === "phoneNumber" ||
      name === "npi" ||
      name === "stateLicense" ||
      name === "username" ||
      name === "password" ||
      name === "reEnterPassword" ||
      name === "email" ||
      name === "activationType"
    ) {
      setFacilityReq({
        ...facilityReq,
        providerInfo: {
          ...facilityReq.providerInfo,
          [e.target.name]: e.target.value,
        },
      });
      if (e.target.name === "physicianFirstName" && e.target.value.length > 0) {
        setPhysFnameError(false);
      }
      if (e.target.name === "physicianLastName" && e.target.value.length > 0) {
        setPhysLnameError(false);
      }
      if (e.target.name === "phoneNumber" && e.target.value.length > 0) {
        setPhysPhoneNoError(false);
        let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
        if (!validPhoneNo) {
          setProviderPhoneFormatError("Only Digit Accepted");
        } else {
          setProviderPhoneFormatError("");
        }
      }
      if (e.target.name === "npi" && e.target.value.length > 0) {
        setPhysNpiError(false);
      }
      if (e.target.name === "stateLicense" && e.target.value.length > 0) {
        setPhysLicenseError(false);
      }
      if (e.target.name === "username" && e.target.value.length > 0) {
        setUsernameError(false);
      }
      if (e.target.name === "password" && e.target.value.length > 0) {
        setPasswordError(false);
      }
      if (e.target.name === "reEnterPassword" && e.target.value.length > 0) {
        setConfirmPasswordError(false);
        if (e.target.value !== password) {
          setMatchPasswordError(true);
        } else {
          setMatchPasswordError(false);
        }
      }
      if (e.target.name === "email" && e.target.value.length > 0) {
        setPhysEmailError(false);
        let res = Commonservice.isValidEmailFormat(e.target.value);
        if (!res) {
          setProviderEmailFormatError("Invalid Email");
        } else {
          setProviderEmailFormatError("");
        }
      }
      if (e.target.name === "activationType" && e.target.value !== null) {
        setActivationTypeError(false);
      }
    } else if (
      name === "criticalFirstName" ||
      name === "criticalLastName" ||
      name === "criticalEmail" ||
      name === "criticalPhoneNo"
    ) {
      setFacilityReq({
        ...facilityReq,
        criticalInfo: {
          ...facilityReq.criticalInfo,
          [e.target.name]: e.target.value,
        },
      });
      if (e.target.name === "criticalFirstName" && e.target.value.length > 0) {
        setCriticalFnameError(false);
      }
      if (e.target.name === "criticalLastName" && e.target.value.length > 0) {
        setCriticalLnameError(false);
      }
      if (e.target.name === "criticalEmail" && e.target.value.length > 0) {
        setCriticalEmailError(false);
        let res = Commonservice.isValidEmailFormat(e.target.value);
        if (!res) {
          setCriticalEmailFormatError("Invalid Email");
        } else {
          setCriticalEmailFormatError("");
        }
      }
      if (e.target.name === "criticalPhoneNo" && e.target.value.length > 0) {
        setCriticalPhoneNoError(false);
        let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
        if (!validPhoneNo) {
          setCriticalPhoneFormatError(t("Only Digit Accepted"));
        } else {
          setCriticalPhoneFormatError("");
        }
      }
    } else if (
      name === "shippingName" ||
      name === "shippingAddress" ||
      name === "shippingPhoneNumber" ||
      name === "shippingEmail" ||
      name === "shippingNote"
    ) {
      setFacilityReq({
        ...facilityReq,
        shippingInfo: {
          ...facilityReq.shippingInfo,
          [e.target.name]: e.target.value,
        },
      });
      if (name === "shippingPhoneNumber" && e.target.value.length > 0) {
        let validPhoneNo = Commonservice.isValidPhoneNo(e.target.value);
        if (!validPhoneNo) {
          setShippingPhoneFormatError("Only Digit Accepted");
        } else {
          setShippingPhoneFormatError("");
        }
      }
      if (name === "shippingEmail" && e.target.value.length > 0) {
        let res = Commonservice.isValidEmailFormat(e.target.value);
        if (!res) {
          setShippingEmailFormatError("Invalid Email");
        } else {
          setShippingEmailFormatError("");
        }
      }
    }
  };
  const validateAddFacilityFields = () => {
    if (facilityName === "") {
      setFacilityNameError(true);
    }
    if (address1 === "") {
      setAddressError(true);
    }
    if (address2 === "") {
      setAddress2Error(true);
    }
    if (city === "") {
      setCityError(true);
    }
    if (state === "") {
      setStateError(true);
    }
    if (zipCode === "") {
      setZipCodeError(true);
    }
    if (facilityPhone === "") {
      setFacilityPhoneNoError(true);
    }
    if (contactFirstName === "") {
      setContactFnameError(true);
    }
    if (contactLastName === "") {
      setContactLnameError(true);
    }
    if (contactPrimaryEmail === "") {
      setContactEmailError(true);
    }
    if (contactPhone === "") {
      setContactPhoneNoError(true);
    }
    if (criticalFirstName === "") {
      setCriticalFnameError(true);
    }
    if (criticalLastName === "") {
      setCriticalLnameError(true);
    }
    if (criticalEmail === "") {
      setCriticalEmailError(true);
    }
    if (criticalPhoneNo === "") {
      setCriticalPhoneNoError(true);
    }
    if (physicianFirstName === "") {
      setPhysFnameError(true);
    }
    if (physicianLastName === "") {
      setPhysLnameError(true);
    }
    if (phoneNumber === "") {
      setPhysPhoneNoError(true);
    }
    if (activationType === null) {
      setActivationTypeError(true);
    }

    if (npi === "") {
      setPhysNpiError(true);
    }

    if (stateLicense === "") {
      setPhysLicenseError(true);
    }

    if (password === "") {
      setPasswordError(true);
    }
    if (reEnterPassword === "") {
      setConfirmPasswordError(true);
    }
    if (username === "") {
      setUsernameError(true);
    }
    if (email === "") {
      setPhysEmailError(true);
    }
  };
  const [matchPasswordError, setMatchPasswordError] = useState(false);
  const addFacility = () => {
    if (
      facilityName.length > 0 &&
      address1.length > 0 &&
      isFacilityExist === false &&
      address2.length > 0 &&
      city.length > 0 &&
      state.length > 0 &&
      zipCode.length > 0 &&
      facilityPhone.length > 0 &&
      contactFirstName.length > 0 &&
      contactLastName.length > 0 &&
      contactPrimaryEmail.length > 0 &&
      contactPhone.length > 0 &&
      criticalFirstName.length > 0 &&
      criticalLastName.length > 0 &&
      criticalEmail.length > 0 &&
      criticalPhoneNo.length > 0 &&
      physicianFirstName.length > 0 &&
      physicianLastName.length > 0 &&
      phoneNumber.length > 0 &&
      npi.length > 0 &&
      stateLicense.length > 0 &&
      activationType !== null &&
      password.length > 0 &&
      reEnterPassword.length > 0 &&
      matchPasswordError === false &&
      generalPhoneFormatError === "" &&
      contactPhoneFormatError === "" &&
      websiteUrlError === false &&
      criticalPhoneFormatError === "" &&
      providerPhoneFormatError === "" &&
      shippingPhoneFormatError === "" &&
      contactEmailFormatError === "" &&
      criticalEmailFormatError === "" &&
      providerEmailFormatError === "" &&
      shippingEmailFormatError === "" &&
      isEmailExistError === "" &&
      isUserNameExistError === ""
    ) {
      FacilityService.createFacility(facilityReq)
        .then((res: AxiosResponse) => {
          if (res.status === 200) {

            navigate("/facilitylist");
          } else {

          }
        })
        .catch((err: AxiosError) => {

        });
    } else {
      validateAddFacilityFields();
    }
  };
  const [usernameType, setUserNameType] = useState(false);
  const [emailType, setEmailType] = useState(false);
  const accountActivationByUsername = (
    e: React.ChangeEvent<InputChangeEvent>
  ) => {
    setUserNameType(true);
    setActivationTypeError(false);
    setEmailType(false);
    setFacilityReq({
      ...facilityReq,
      providerInfo: {
        ...facilityReq.providerInfo,
        email: null,
        activationType: parseInt(e.target.value),
      },
    });
  };
  const accountActivationByEmail = (e: React.ChangeEvent<InputChangeEvent>) => {
    setUserNameType(false);
    setActivationTypeError(false);
    setEmailType(true);
    setFacilityReq({
      ...facilityReq,
      providerInfo: {
        ...facilityReq.providerInfo,
        username: null,
        activationType: parseInt(e.target.value),
      },
    });
  };
  const options1 = {
    headers: {
      Authorization: `Bearer ${props.User.userInfo.token}`,
      "X-Portal-Key": "DemoApp",
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  };
  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    var formData = new FormData();
    formData.append("file", e.target.files![0]);
    HttpClient().post(
      `/${routes.UserManagement.UploadFile}`,
      formData,
      options1
    )
      .then((res) => {
        setFacilityReq({
          ...facilityReq,
          uploadsInfo: [
            {
              name: e.target.files![0].name,
              filePath: res.data.data,
            },
          ],
        });

      })
      .catch((err) => {

      });
  };
  const [isEmailExistError, setIsEmailExistError] = useState("");
  const [isFacilityExist, setIsFacilityExist] = useState(false);
  const ValidEmail = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var validEmailRequest = {
        keyValue: e.target.value,
        id: "",
      };
      Commonservice.isValidEmail(validEmailRequest)
        .then((res: AxiosResponse) => {
          if (!res.data) {
            setIsEmailExistError("Email Already Exist");
          } else {
            setIsEmailExistError("");
          }

        })
        .catch((err: AxiosError) => {

        });
    }
  };
  const isFacilityAlreadyExist = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      FacilityService.isFacilityUnique(e.target.value)
        .then((res: AxiosResponse) => {
          if (res.data.isExist) {
            setIsFacilityExist(true);
          } else {
            setIsFacilityExist(false);
          }
        })
        .catch((err: AxiosError) => {

        });
    }
  };
  const [isUserNameExistError, setIsUserNameExistError] = useState("");
  const ValidUsername = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.value !== "") {
      var usernameRequest = {
        keyValue: e.target.value,
        id: "",
      };
      Commonservice.isValidUsername(usernameRequest)
        .then((res: AxiosResponse) => {
          if (!res.data) {
            setIsUserNameExistError("Username Already Exist");
          } else {
            setIsUserNameExistError("");
          }

        })
        .catch((err: AxiosError) => {

        });
    }
  };
  const [isVisibility, setIsVisibility] = useState(false);
  const [isConfirmPasswordVisibility, setIsConfirmPasswordVisibility] =
    useState(false);
  const [passwordType, setPasswordType] = useState("password");
  const [confirmPasswordType, setConfirmPasswordType] = useState("password");
  const generatePassword = () => {
    setFacilityReq({
      ...facilityReq,
      providerInfo: {
        ...facilityReq.providerInfo,
        password: generateAutoGeneratePassword(),
      },
    });
  };
  const generateConfirmPassword = () => {
    setFacilityReq({
      ...facilityReq,
      providerInfo: {
        ...facilityReq.providerInfo,
        reEnterPassword: generateAutoGeneratePassword(),
      },
    });
  };
  const showPassword = () => {
    setIsVisibility(true);
    setPasswordType("text");
  };
  const hidePassword = () => {
    setIsVisibility(false);
    setPasswordType("password");
  };
  const showConfirmPassword = () => {
    setIsConfirmPasswordVisibility(true);
    setConfirmPasswordType("text");
  };
  const hideConfirmPassword = () => {
    setIsConfirmPasswordVisibility(false);
    setConfirmPasswordType("password");
  };
  const [facultyOptions, setFacultyOptions] = React.useState([]);
  const fetchFacultyOptions = () => {
    FacilityService.getFacultyOptions()
      .then((res: AxiosResponse) => {

        setFacultyOptions(res.data.data);
      })
      .catch((err: AxiosError) => {

      });
  };
  React.useEffect(() => {
    fetchFacultyOptions();
    if (id !== "" && id !== undefined) {
      getFacilityById();
    }
  }, []);
  const onFacultyOptionsSelect = (e: any) => {
    var optionObject = {
      optionId: parseInt(e.target.value),
    };
    if (e.target.checked) {
      setFacilityReq({
        ...facilityReq,
        facilityOpt: [...facilityReq.facilityOpt, optionObject],
      });
    } else {
      let optionIndex = facilityReq?.facilityOpt.findIndex(
        (opt: any) => opt.optionId === parseInt(e.target.value)
      );
      facilityReq.facilityOpt.splice(optionIndex, 1);

      setFacilityReq({
        ...facilityReq,
        facilityOpt: facilityReq.facilityOpt,
      });
    }
  };
  const MAX_COUNT = 10;
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [fileLimit, setFileLimit] = useState(false);
  const handleUploadFiles = (files: any) => {
    const uploaded = [...uploadedFiles];
    let limitExceeded = false;
    files.some((file: any) => {
      if (uploaded.findIndex((f: any) => f.name === file.name) === -1) {
        // if(file){
        //   uploaded.push(file);
        // }

        if (uploaded.length === MAX_COUNT) setFileLimit(true);
        if (uploaded.length > MAX_COUNT) {
          alert(t("You can only add a maximum of {{count}} files", { count: MAX_COUNT }));
          setFileLimit(false);
          limitExceeded = true;
          return true;
        }
      }
    });
    if (!limitExceeded) {
      setUploadedFiles(uploaded);
    }
  };
  const handleFileEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
    uploadFile(e);
    const chosenFiles = Array.prototype.slice.call(e.target.files);
    handleUploadFiles(chosenFiles);
  };
  const removeUploadedFile = (file: any) => {
    let fileIndex = uploadedFiles.findIndex((f: any) => f.name === file.name);
    uploadedFiles.splice(fileIndex, 1);
    if (uploadedFiles.length > 0) {
      setUploadedFiles([...uploadedFiles]);
    } else {
      setUploadedFiles([...uploadedFiles]);
    }
  };
  const current = new Date();
  const date = `${current.getDate()}/${current.getMonth() + 1
    }/${current.getFullYear()}`;
  return (
    <div>
      <div id="kt_app_body" className="app-default">
        <div
          className="app-wrapper flex-column flex-row-fluid"
          id="kt_app_wrapper"
          style={{ marginLeft: "0px" }}
        >
          <div className="app-main flex-column flex-row-fluid" id="kt_app_main">
            <div className="d-flex flex-column flex-column-fluid">
              <div id="kt_app_toolbar" className="app-toolbar py-3 py-lg-6">
                <div
                  id="kt_app_toolbar_container"
                  className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center"
                >
                  <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                    {/* <!--begin::Breadcrumb--> */}
                    <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                      {/* <!--begin::Item--> */}
                      <li className="breadcrumb-item text-muted">
                        <a href="#" className="text-muted text-hover-primary">
                          {t("Home")}
                        </a>
                      </li>
                      {/* <!--end::Item--> */}
                      {/* <!--begin::Item--> */}
                      <li className="breadcrumb-item">
                        <span className="bullet bg-gray-400 w-5px h-2px"></span>
                      </li>
                      {/* <!--end::Item--> */}
                      {/* <!--begin::Item--> */}
                      <li className="breadcrumb-item text-muted">{t("Facility")}</li>
                      {/* <!--end::Item--> */}
                      {/* <!--begin::Item--> */}
                      <li className="breadcrumb-item">
                        <span className="bullet bg-gray-400 w-5px h-2px"></span>
                      </li>
                      {/* <!--end::Item--> */}
                      {/* <!--begin::Item--> */}
                      <li className="breadcrumb-item text-muted">
                        {t("Add a Facility")}
                      </li>
                      {/* <!--end::Item--> */}
                    </ul>
                    {/* <!--end::Breadcrumb--> */}
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
                      data-bs-toggle="modal"
                      data-bs-target="#kt_modal_new_target"
                      onClick={addFacility}
                    >
                      {t("save")}
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
                  <form className="form">
                    <div
                      className="d-flex flex-column scroll-y me-n7 pe-7"
                      id="kt_modal_add_user_scroll"
                      data-kt-scroll="true"
                      data-kt-scroll-activate="{default: false, lg: true}"
                      data-kt-scroll-max-height="auto"
                      data-kt-scroll-dependencies="#kt_modal_add_user_header"
                      data-kt-scroll-wrappers="#kt_modal_add_user_scroll"
                      data-kt-scroll-offset="190px"
                    >
                      <div className="card">
                        <div className="card-header bg-light-primary">
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("General")}
                            </span>
                          </div>
                        </div>
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required   mb-2">
                                  {t("Facility Name")}
                                </label>
                                <input
                                  type="text"
                                  name="facilityName"
                                  onBlur={isFacilityAlreadyExist}
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Facility Name")}
                                  value={facilityName}
                                />
                                {isFacilityExist ? (
                                  <span style={{ color: "red" }}>
                                    {t("Facility Already Exist")}
                                  </span>
                                ) : null}
                                {facilityNameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Firstname is Required!")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              <div className="fv-row mb-4">
                                <label className="required mb-2">{t("Address")}</label>
                                <input
                                  type="text"
                                  name="address1"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Address")}
                                  value={address1}
                                />
                                {addressError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Address is Required!")}
                                  </span>
                                ) : null}
                              </div>
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">{t("Address 2")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="address2"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Address 2")}
                                  value={address2}
                                />
                                {address2Error ? (
                                  <span style={{ color: "red" }}>
                                    {t("Address is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required mb-2">{t("City")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="city"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Address 2")}
                                  value={city}
                                />
                                {cityError ? (
                                  <span style={{ color: "red" }}>
                                    {t("City is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">{t("State")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <select
                                  name="state"
                                  value={state}
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-select form-control bg-transparent"
                                  data-control="select2"
                                  data-hide-search="true"
                                  data-placeholder={t("--Select Option--")}
                                >
                                  <option value="" hidden>
                                    {t("Select State...")}
                                  </option>
                                  <option value="Item 1">{t("Item 1")}</option>
                                  <option value="Item 2">{t("Item 2")}</option>
                                  <option value="Item 3">{t("Item 3")}</option>
                                  <option value="Item 4">{t("Item 4")}</option>
                                </select>
                                {stateError ? (
                                  <span style={{ color: "red" }}>
                                    {t("State is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Zip Code")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="zipCode"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Zip Code")}
                                  value={zipCode}
                                />
                                {zipCodeError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Zipcode is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required mb-2">
                                  {t("Phone No")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="facilityPhone"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Phone No")}
                                  value={facilityPhone}
                                />
                                <span style={{ color: "red" }}>
                                  {t(generalPhoneFormatError)}
                                </span>
                                {facilityPhoneNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("PhoneNo is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="mb-2">{t("Fax No")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="facilityFax"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Fax No")}
                                  value={facilityFax}
                                />
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Facility Website")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="facilityWebsite"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Facility Website")}
                                  value={facilityWebsite}
                                />
                                {websiteUrlError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Enter Valid Url")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      {/* <!--end::General Card--> */}

                      {/* <!--end::Contact Information Card--> */}
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
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
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required mb-2">
                                  {t("First Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="contactFirstName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("First Name")}
                                  value={contactFirstName}
                                />
                                {contactFnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Firstname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required mb-2">
                                  {t("Last Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="contactLastName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Last Name")}
                                  value={contactLastName}
                                />
                                {contactLnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Lastname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Contact Email")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="contactPrimaryEmail"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Contact Email")}
                                  value={contactPrimaryEmail}
                                />
                                <span style={{ color: "red" }}>
                                  {t(contactEmailFormatError)}
                                </span>
                                {contactEmailError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Email is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Phone No")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="contactPhone"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Phone No")}
                                  value={contactPhone}
                                />
                                <span style={{ color: "red" }}>
                                  {t(contactPhoneFormatError)}
                                </span>
                                {contactPhoneNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("PhoneNo is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      {/* <!--end::Contact Information Card--> */}

                      {/* <!--end::Critical Information Card--> */}
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Critical Information")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("First Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="criticalFirstName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("First Name")}
                                  value={criticalFirstName}
                                />
                                {criticalFnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Firstname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Last Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="criticalLastName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Last Name")}
                                  value={criticalLastName}
                                />
                                {criticalLnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Lastname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Critical Email")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="criticalEmail"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Email")}
                                  value={criticalEmail}
                                />
                                <span style={{ color: "red" }}>
                                  {t(criticalEmailFormatError)}
                                </span>
                                {criticalEmailError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Email is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required mb-2">
                                  {t("Phone No")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="criticalPhoneNo"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Phone No")}
                                  value={criticalPhoneNo}
                                />
                                <span style={{ color: "red" }}>
                                  {t(criticalPhoneFormatError)}
                                </span>
                                {criticalPhoneNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("PhoneNo is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      {/* <!--end::Critical Information Card--> */}

                      {/* <!--end::Provider Information Card--> */}
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Provider Information")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Physician First Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="physicianFirstName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Physician First Name")}
                                  value={physicianFirstName}
                                />
                                {physFnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Firstname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Physician Last Name")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="physicianLastName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Physician Last Name")}
                                  value={physicianLastName}
                                />
                                {physLnameError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Lastname is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Phone Number")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="phoneNumber"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("(999) 999-9999")}
                                  value={phoneNumber}
                                />
                                <span style={{ color: "red" }}>
                                  {t(providerPhoneFormatError)}
                                </span>
                                {physPhonoNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("PhoneNo is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">{t("NPI #")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="npi"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("NPI #")}
                                  value={npi}
                                />
                                {physNpiError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Npi is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("State License")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="stateLicense"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("State License")}
                                  value={stateLicense}
                                />
                                {physLicenseNoError ? (
                                  <span style={{ color: "red" }}>
                                    {t("LicenseNo is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="required   mb-2">
                                  {t("Account Activation Type")}
                                </label>
                                {activationTypeError ? (
                                  <span style={{ color: "red" }}>
                                    {t("Account Type is Required!")}
                                  </span>
                                ) : null}
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Options--> */}
                                <div className="d-flex align-items-center mt-3">
                                  {/* <!--begin::Option--> */}
                                  <label className="form-check form-check-inline form-check-solid me-5">
                                    <input
                                      className="form-check-input ifuser"
                                      onChange={accountActivationByUsername}
                                      value={0}
                                      name="accountType"
                                      type="radio"
                                      checked={usernameType}
                                    />
                                    <span className=" ps-2 ">{t("Username")}</span>
                                  </label>
                                  {/* <!--end::Option--> */}
                                  {/* <!--begin::Option--> */}
                                  <label className="form-check form-check-inline form-check-solid">
                                    <input
                                      className="form-check-input ifemail"
                                      onChange={accountActivationByEmail}
                                      value={1}
                                      name="accountType"
                                      type="radio"
                                      checked={emailType}
                                    />
                                    <span className=" ps-2 ">{t("Email")}</span>
                                  </label>
                                </div>
                              </div>
                            </div>
                            {usernameType ? (
                              <>
                                <div className="col-lg-3 col-md-6 col-sm-12 thenuser">
                                  {/* <!--begin::Input group--> */}
                                  <div className="fv-row mb-4">
                                    {/* <!--begin::Label--> */}
                                    <label className="required   mb-2">
                                      {t("UserName")}
                                    </label>
                                    {/* <!--end::Label--> */}
                                    {/* <!--begin::Input--> */}
                                    <input
                                      type="text"
                                      name="username"
                                      onBlur={ValidUsername}
                                      onChange={(e) => onInputFieldChange(e)}
                                      className="form-control bg-transparent"
                                      placeholder={t("UserName")}
                                      value={username}
                                    />
                                    <span style={{ color: "red" }}>
                                      {t(isUserNameExistError)}
                                    </span>
                                    {usernameError ? (
                                      <span style={{ color: "red" }}>
                                        {t("Username is Required!")}
                                      </span>
                                    ) : null}
                                    {/* <!--end::Input--> */}
                                  </div>
                                  {/* <!--end::Input group--> */}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 showpass thenuser">
                                  {/* <!--begin::Input group--> */}
                                  <div
                                    className="fv-row mb-8"
                                    data-kt-password-meter="true"
                                  >
                                    {/* <!--begin::Label--> */}
                                    <label className="required   mb-2">
                                      {t("Password")}
                                    </label>
                                    {/* <!--end::Label--> */}
                                    {/* <!--begin::Wrapper--> */}
                                    <div className="mb-1">
                                      {/* <!--begin::Input wrapper--> */}
                                      <div className="position-relative mb-3 getPass">
                                        <input
                                          className="form-control bg-transparent"
                                          name="password"
                                          onChange={(e) =>
                                            onInputFieldChange(e)
                                          }
                                          type={passwordType}
                                          placeholder={t("Password")}
                                          autoComplete="off"
                                          value={password}
                                        />
                                        {passwordError ? (
                                          <span style={{ color: "red" }}>
                                            {t("Password is Required!")}
                                          </span>
                                        ) : null}
                                        <span
                                          onClick={generatePassword}
                                          className="generate-password "
                                          data-toggle="tooltip"
                                          title=""
                                          data-original-title="Generate Password"
                                          aria-describedby="tooltip419827"
                                        >
                                          {/* <RefreshIcon /> */}
                                          <i className="bi bi-arrow-counterclockwise fs-2"></i>
                                        </span>
                                        <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                          {!isVisibility ? (
                                            <i
                                              className="bi bi-eye-slash fs-2"
                                              onClick={showPassword}
                                            ></i>
                                          ) : (
                                            <i
                                              className="bi bi-eye fs-2"
                                              onClick={hidePassword}
                                            ></i>
                                          )}
                                        </span>
                                      </div>
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
                                      {t("Use 8 or more characters with a mix of letters, numbers symbols.")}
                                    </div>
                                    {/* <!--end::Hint--> */}
                                  </div>
                                  {/* <!--end::Input group--> */}
                                </div>
                                <div className="col-lg-3 col-md-6 col-sm-12 showpass thenuser">
                                  {/* <!--begin::Input group--> */}
                                  <div
                                    className="fv-row mb-8"
                                    data-kt-password-meter="true"
                                  >
                                    {/* <!--begin::Label--> */}
                                    <label className="required   mb-2">
                                      {t("Re-enter Password")}
                                    </label>
                                    {/* <!--end::Label--> */}
                                    {/* <!--begin::Wrapper--> */}
                                    <div className="mb-1">
                                      {/* <!--begin::Input wrapper--> */}
                                      <div className="position-relative mb-3 getPass">
                                        <input
                                          type={confirmPasswordType}
                                          className="form-control bg-transparent"
                                          name="reEnterPassword"
                                          onChange={(e) =>
                                            onInputFieldChange(e)
                                          }
                                          placeholder={t("Re-enter Password")}
                                          autoComplete="off"
                                          value={reEnterPassword}
                                        />
                                        {confirmPasswordError ? (
                                          <span style={{ color: "red" }}>
                                            {t("Password is Required!")}
                                          </span>
                                        ) : null}
                                        {matchPasswordError ? (
                                          <span style={{ color: "red" }}>
                                            {t("Password Does Not Match!")}
                                          </span>
                                        ) : null}
                                        <span
                                          onClick={generateConfirmPassword}
                                          className="generate-password "
                                          data-toggle="tooltip"
                                          title=""
                                          data-original-title="Generate Password"
                                          aria-describedby="tooltip419827"
                                        >
                                          <i className="bi bi-arrow-counterclockwise fs-2"></i>
                                        </span>
                                        <span className="btn btn-sm btn-icon position-absolute translate-middle top-50 end-0 me-n2">
                                          {!isConfirmPasswordVisibility ? (
                                            <i
                                              className="bi bi-eye-slash fs-2"
                                              onClick={showConfirmPassword}
                                            ></i>
                                          ) : (
                                            <i
                                              className="bi bi-eye fs-2"
                                              onClick={hideConfirmPassword}
                                            ></i>
                                          )}
                                        </span>
                                      </div>
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
                                      {t("Use 8 or more characters with a mix of letters, numbers symbols.")}
                                    </div>
                                    {/* <!--end::Hint--> */}
                                  </div>
                                  {/* <!--end::Input group--> */}
                                </div>
                              </>
                            ) : null}
                            {emailType ? (
                              <div className="col-lg-3 col-md-6 col-sm-12 thenemail">
                                {/* <!--begin::Input group--> */}
                                <div className="fv-row mb-4">
                                  {/* <!--begin::Label--> */}
                                  <label className="required   mb-2">
                                    {t("Email (Associated with Account Login)")}
                                  </label>
                                  {/* <!--end::Label--> */}
                                  {/* <!--begin::Input--> */}
                                  <input
                                    type="email"
                                    name="email"
                                    onBlur={ValidEmail}
                                    onChange={(e) => onInputFieldChange(e)}
                                    value={email}
                                    className="form-control bg-transparent"
                                    placeholder={t("Email (Associated with Account Login)")}
                                  />
                                  <span style={{ color: "red" }}>
                                    {t(providerEmailFormatError)}
                                  </span>
                                  <span style={{ color: "red" }}>
                                    {t(isEmailExistError)}
                                  </span>
                                  {physEmailError ? (
                                    <span style={{ color: "red" }}>
                                      {t("Email is Required!")}
                                    </span>
                                  ) : null}
                                  {/* <!--end::Input--> */}
                                </div>
                                {/* <!--end::Input group--> */}
                              </div>
                            ) : null}
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
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
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">{t("Shipping Name")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="shippingName"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Shipping Name")}
                                  value={shippingName}
                                />
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">
                                  {t("Shipping Address")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="shippingAddress"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Shipping Address")}
                                  value={shippingAddress}
                                />
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">
                                  {t("Shipping Phone Number")}
                                </label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="shippingPhoneNumber"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Shipping Phone Number")}
                                  value={shippingPhoneNumber}
                                />
                                <span style={{ color: "red" }}>
                                  {t(shippingPhoneFormatError)}
                                </span>
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">{t("Shipping Email")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="e"
                                  name="shippingEmail"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Shipping Email")}
                                  value={shippingEmail}
                                />
                                <span style={{ color: "red" }}>
                                  {t(shippingEmailFormatError)}
                                </span>

                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                            <div className="col-lg-3 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <div className="fv-row mb-4">
                                {/* <!--begin::Label--> */}
                                <label className="  mb-2">{t("Shipping Note")}</label>
                                {/* <!--end::Label--> */}
                                {/* <!--begin::Input--> */}
                                <input
                                  type="text"
                                  name="shippingNote"
                                  onChange={(e) => onInputFieldChange(e)}
                                  className="form-control bg-transparent"
                                  placeholder={t("Shipping Note")}
                                  value={shippingNote}
                                />
                                {/* <!--end::Input--> */}
                              </div>
                              {/* <!--end::Input group--> */}
                            </div>
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Facility Options")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-4 py-3">
                          <div className="d-flex align-items-center mt-3 row">
                            {facultyOptions.length > 0 &&
                              facultyOptions.map((opt: any, i) => (
                                <div
                                  key={i}
                                  className="col-xl-3 col-lg-3 col-md-4 col-sm-4 col-6"
                                >
                                  <label className="form-check form-check-inline form-check-solid m-0 mb-5">
                                    <>
                                      <input
                                        className="form-check-input"
                                        name="optionId"
                                        onChange={onFacultyOptionsSelect}
                                        type="checkbox"
                                        value={opt.key}
                                      />
                                      <span className=" ps-2 ">
                                        {opt.value}
                                      </span>
                                    </>
                                  </label>
                                </div>
                              ))}
                            {/* <!--end::Options--> */}
                          </div>
                        </div>
                        {/* <!--end::Card body--> */}
                      </div>

                      {/* <!--end::Facility Options  Card--> */}

                      {/* <!--end::Upload files Card--> */}
                      <div className="card mt-4">
                        {/* <!--begin::Card Header--> */}
                        <div className="card-header bg-light-primary">
                          {/* <!--begin::Card title--> */}
                          <div className="card-title">
                            <span className="card-label fw-bold text-dark">
                              {t("Upload files")}
                            </span>
                          </div>
                          {/* <!--end::Card title--> */}
                        </div>
                        {/* <!--end::Card Header--> */}
                        {/* <!--begin::Card body--> */}
                        <div className="card-body py-md-4 py-3">
                          <div className="row">
                            <div className="col-lg-4 col-md-6 col-sm-12">
                              {/* <!--begin::Input group--> */}
                              <input
                                type="file"
                                onChange={handleFileEvent}
                                disabled={fileLimit}
                                multiple
                                id="upload-file"
                                className="d-none"
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
                                      {t("Upload up to 10 files")}
                                    </span>
                                  </div>
                                </div>
                              </label>
                            </div>
                            <div className="col-lg-8 col-md-6 col-sm-12">
                              {uploadedFiles && uploadedFiles.length > 0 ? (
                                <table className="table table-bordered table-cutome-expend table-head-bg table-head-custom table-vertical-center">
                                  <thead>
                                    <tr>
                                      <th
                                        className="text-center"
                                        scope="col"
                                        style={{ width: "100px" }}
                                      >
                                        {t("Action")}
                                      </th>
                                      <th
                                        scope="col"
                                        style={{ minWidth: "200px" }}
                                      >
                                        {t("FileName")}
                                      </th>
                                      <th
                                        scope="col"
                                        style={{ minWidth: "130px" }}
                                      >
                                        {t("Date")}
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {uploadedFiles &&
                                      uploadedFiles.length > 0 &&
                                      uploadedFiles.map((file: any, i) => (
                                        <tr key={i}>
                                          <td>
                                            <div className="d-flex justify-content-center">
                                              <button
                                                className="btn btn-icon btn-sm fw-bold btn-danger btn-icon-light h-32px w-32px fas-icon-20px"
                                                onClick={() =>
                                                  removeUploadedFile(file)
                                                }
                                              >
                                                <i className="bi bi-trash3-fill"></i>
                                              </button>
                                            </div>
                                          </td>
                                          <td>{file.name}</td>
                                          <td>{date}</td>
                                        </tr>
                                      ))}
                                  </tbody>
                                </table>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
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
        <div className="card shadow-none rounded-0 w-100">
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
    </div>
  );
};
function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(AddFacility);
