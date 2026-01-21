import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { InitialState, setFormState } from "./InitialState";
import useForm from "../../../Shared/hooks/useForm";
import validate from "../../../Utils/validate";
import { AxiosError, AxiosResponse } from "axios";
import PatientServices from "../../../Services/PatientServices/PatientServices";
import PatientServices2 from "../../../Services/PatientServices/PatientServices";
import { ICompData } from "../../../Interface/Patient/Patient";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PatientDemographicsInputs from "./PatientDemographicsInputs";

const EditPatient = () => {
  const [insuranceDataList, setInsuranceDataList] = useState<any>([]);
  const [insuranceProvider, setInsuranceProvider] = useState<any>([]);
  const [facilitylookup, setFacilityLookup] = useState([]);
  const [compData, setCompData] = useState<ICompData>({
    dropdownData: [],
    insuranceDropdown: [],
    insuranceDropdownProvider: [],
  });
  const [isSubmitting, setisSubmitting] = useState(false);
  useEffect(() => {
    getPatientData();
    getDropdownValues();
  }, []);
  let location = useLocation();
  const navigate = useNavigate();
  const { formData, setFormData, errors, changeHandler, setErrors }: any =
    useForm(InitialState, validate);
  const getPatientData = () => {
    const data = setFormState(InitialState, location.state);
    setFormData(data);
    setInsuranceDataList(location.state.patientInsurances);
  };
  const data = location?.state;

  // ********** get Dropdown Values ************
  const getDropdownValues = async () => {
    var data: any = await PatientServices.getFacilityIdDropdownValues()
      .then((res: AxiosResponse) => {
        setCompData((preVal: any) => {
          return {
            ...preVal,
            dropdownData: res?.data,
          };
        });
        setFacilityLookup(res?.data);
      })
      .catch((err: string) => {
        console.trace(err, "err");
      });
    PatientServices.getInsuranceDropdown().then((res: AxiosResponse) => {
      setCompData((preVal) => {
        return {
          ...preVal,
          insuranceDropdown: res?.data.data,
        };
      });
    });
    PatientServices?.getInsuranceProviderDropdown()
      .then((res: AxiosResponse) => {
        setInsuranceProvider(res.data.data);
        setCompData((preVal) => {
          return {
            ...preVal,
            insuranceDropdownProvider: res?.data?.data,
          };
        });
      })
      .catch((err: string) => console.log(err));
  };
  // ********** get Input Value ************
  const AddPatient = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    let size;
    let formErrors: any;
    formErrors = validate(formData, true);
    setErrors(formErrors);
    size = Object.keys(formErrors).length;
    if (size !== 0) {
      toast.error("Please fill the required fields!");
      return;
    }
    function findNameById(id: any) {
      const result = insuranceProvider.find(
        (item: any) => item.insuranceProviderId === id
      );
      return result ? result.providerName : "";
    }
    const objToSend = {
      patientInformation: {
        patientId: formData?.patientId?.value,
        firstName: formData?.firstName.value,
        middleName: formData?.middleName.value,
        lastName: formData?.lastName.value,
        dateOfBirth: formData?.dateOfBirth.value,
        gender: formData?.gender.value,
        ethnicity: formData?.ethnicity.value,
        race: formData?.race.value,
        patientType: formData?.patientType.value,
        socialSecurityNumber: formData?.socialSecurityNumber.value,
        passportNumber: formData?.passportNumber.value,
        dlidNumber: formData?.dlidNumber.value,
        address: {
          address1: formData?.address1.value,
          address2: formData?.address2.value,
          zipCode: formData?.zipCode.value,
          city: formData?.city.value,
          state: formData?.state.value,
          // country: formData?.country.value,
          county: formData?.county.value,
          phoneNumber: formData?.landPhone.value,
          mobileNumber: formData?.mobile.value,
          email: formData?.email.value,
          weight: formData?.weight.value,
          height: formData?.height.value,
          facility: formData?.facilityId.value,
        },
        patientInsurances: insuranceDataList.map((insuranceData: any) => {
          return {
            ...insuranceData,
            subscriberDateOfBirth:
              insuranceData.subscriberDateOfBirth == ""
                ? null
                : insuranceData.subscriberDateOfBirth,
          };
        }),
      },
    };
    setisSubmitting(true);
    await PatientServices.updatePatient(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(res?.data?.message);
          navigate("/patient-demographics-list");
        }
      })
      .catch((err: AxiosError) => {
        setisSubmitting(false);
        toast.error("error");
      });
  };

  return (
    <PatientDemographicsInputs
      changeHandler={changeHandler}
      formData={formData}
      setFormData={setFormData}
      errors={errors}
      //onKeyUp={onKeyUp}
      // AddInsuranceRowData={AddInsuranceRowData}
      path="Edit a Patient"
      AddPatient={AddPatient}
      compData={compData}
      isSubmitting={isSubmitting}
      facilitylookup={facilitylookup}
      insuranceDataList={insuranceDataList}
      setInsuranceDataList={setInsuranceDataList}
    />
  );
};

export default EditPatient;
