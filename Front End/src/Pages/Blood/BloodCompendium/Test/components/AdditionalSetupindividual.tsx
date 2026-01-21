import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import Select from "react-select";
import {
  getAutoValidateTestLookup,
  GetDependencyTestsLookup,
  getResultInstrumentNameLookup,
  getSpecimenTypeLookup,
  getStorageTypeLookup,
  getTubeTypeLookup,
} from "../../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import Radio from "../../../../../Shared/Common/Input/Radio";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import { closeMenuOnScroll } from "../Shared";
import useLang from "Shared/hooks/useLanguage";

function AdditionalSetupIndividual({ formData, setFormData, labId }: any) {
  const { t } = useLang();

  const [tubeTypeLookup, setTubeTypeLookup] = useState([]);
  const [storageTypeLookup, setStorageTypeLookup] = useState([]);
  const [specimenTypeLookup, setSpecimenTypeLookup] = useState([]);
  const [orderMethodNameLookup, setOrderMethodNameLookup] = useState([]);
  const [resultMethodNameLookup, setResultMethodNameLookup] = useState([]);
  const [autoValidateTestLookup, setAutoValidateTestLookup] = useState([]);
  const [dependencyTestsOptions, setDependencyTestsOptions] = useState([]);

  const testMethodLookup = [
    {
      id: "Manual",
      value: "Manual",
      label: "Manual",
    },
    {
      id: "Interface",
      value: "Interface",
      label: "Interface",
    },
  ];

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    // Remove the testId suffix from the name if it exists
    const fieldName = name.replace(/_\d+$/, '');
    setFormData((prev: any) => ({
      ...prev,
      [fieldName]: type === "checkbox" ? checked : value,
      ...(fieldName === "isAutoValidateTest" &&
        !checked && { autoValidateTest: "" }),
    }));
  };

  const handleSelectChange = (name: string, value: any) => {
    if (name === "dependencyTestIds") {
      const dependencyTestIds = value.map((selected: any) => selected.value);
      setFormData((prev: any) => ({
        ...prev,
        [name]: dependencyTestIds,
      }));
    } else {
      setFormData((prev: any) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  useEffect(() => {
    const fetchLookupData = async () => {
      try {
        const [
          specimenRes,
          tubeRes,
          storageRes,
          autoValidateRes,
          dependencyRes,
        ] = await Promise.all([
          getSpecimenTypeLookup(),
          getTubeTypeLookup(),
          getStorageTypeLookup(),
          getAutoValidateTestLookup(),
          GetDependencyTestsLookup(),
        ]);

        setSpecimenTypeLookup(specimenRes.data);
        setTubeTypeLookup(tubeRes.data);
        setStorageTypeLookup(storageRes.data);
        setAutoValidateTestLookup(autoValidateRes.data);

        setDependencyTestsOptions(
          dependencyRes.data.filter((t: any) => t.value !== formData.testId)
        );
      } catch (error) {
        console.error("Failed to fetch lookup data:", error);
      }
    };

    fetchLookupData();
  }, []);

  // Fetch Result Instrument Name lookup when resultMethod is Interface
  useEffect(() => {
    const fetchResultInstrumentLookup = async () => {
      // Only fetch if resultMethod is explicitly "Interface" and labId is valid
      if (formData.resultMethod === "Interface" && labId && labId > 0) {
        try {
          const response = await getResultInstrumentNameLookup(
            "ResultInstrumentName",
            labId
          );
          setResultMethodNameLookup(response.data);
        } catch (error) {
          console.error("Failed to fetch result instrument lookup:", error);
        }
      }
    };

    // Only call if resultMethod is "Interface"
    if (formData.resultMethod === "Interface") {
      fetchResultInstrumentLookup();
    }
  }, [formData.resultMethod, labId]);

  // Fetch Order Instrument Name lookup when orderMethodType is Interface
  useEffect(() => {
    const fetchOrderInstrumentLookup = async () => {
      // Only fetch if orderMethodType is explicitly "Interface" and labId is valid
      if (formData.orderMethodType === "Interface" && labId && labId > 0) {
        try {
          const response = await getResultInstrumentNameLookup(
            "OrderInstrumentName",
            labId
          );
          setOrderMethodNameLookup(response.data);
        } catch (error) {
          console.error("Failed to fetch order instrument lookup:", error);
        }
      }
    };

    // Only call if orderMethodType is "Interface"
    if (formData.orderMethodType === "Interface") {
      fetchOrderInstrumentLookup();
    }
  }, [formData.orderMethodType, labId]);

  useEffect(() => {
    if (formData.resultMethod === "Manual") {
      setFormData((prev: any) => ({
        ...prev,
        instrumentName: "",
      }));
    }
  }, [formData.resultMethod]);

  useEffect(() => {
    if (formData.orderMethodType === "Manual") {
      setFormData((prev: any) => ({
        ...prev,
        orderMethodName: "",
      }));
    }
  }, [formData.orderMethodType]);
  
  return (
    <>
      <h6 className="text-primary h5">{t("Additional Setup")}</h6>
      <Grid container spacing={2}>
        <Grid item xs={12} md={12}>
          <Grid container spacing={2} alignItems="flex-end" className="mb-4">
            <Grid item xs={12} sm={7} md={3}>
              <Radio
                id={`ResultMethod`}
                label={t("Result Method")}
                name={`resultMethod_${formData.testId}`}
                noRequired={true}
                onChange={handleChange}
                choices={testMethodLookup}
                checked={formData.resultMethod}
              />
            </Grid>
            <Grid item xs={12} sm={7} md={3}>
              <Select
                inputId={`AdditionalSetupInstrumentName`}
                theme={(theme) => styles(theme)}
                // className="mb-2"
                name="instrumentName"
                options={resultMethodNameLookup}
                styles={reactSelectSMStyle}
                value={resultMethodNameLookup.filter(
                  (specimenType: any) =>
                    String(specimenType.value) === formData.instrumentName
                )}
                menuPortalTarget={document.body}
                closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                onChange={(option: any) =>
                  handleSelectChange("instrumentName", String(option.value))
                }
                isDisabled={
                  formData.resultMethod === "Interface" ? false : true
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="flex-end" className="mb-4">
            <Grid item xs={12} sm={7} md={3}>
              <Radio
                id={`OrderMethod`}
                label={t("Order Method")}
                name={`orderMethodType_${formData.testId}`}
                onChange={handleChange}
                choices={testMethodLookup}
                checked={formData.orderMethodType}
                noRequired={true}
              />
            </Grid>
            <Grid item xs={12} sm={7} md={3}>
              <Select
                inputId={`AdditionalSetupSpecimenType`}
                theme={(theme) => styles(theme)}
                name="orderMethodName"
                options={orderMethodNameLookup}
                styles={reactSelectSMStyle}
                value={orderMethodNameLookup.filter(
                  (specimenType: any) =>
                    String(specimenType.value) === formData.orderMethodName
                )}
                menuPortalTarget={document.body}
                closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                onChange={(option: any) =>
                  handleSelectChange("orderMethodName", String(option.value))
                }
                isDisabled={
                  formData.orderMethodType === "Interface" ? false : true
                }
              />
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="flex-end" className="mb-4">
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span>{t("UOM")}</span>
                <input
                  id={`AdditionalSetupUOM`}
                  type="text"
                  name="uom"
                  className="h-30px rounded form-control bg-transparent mb-2"
                  placeholder={t("UOM")}
                  value={formData.uom}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span className="required">{t("Specimen Type")}</span>
                <Select
                  inputId={`AdditionalSetupSpecimenType`}
                  theme={(theme) => styles(theme)}
                  className="mb-2"
                  name="specimenTypeId"
                  options={specimenTypeLookup}
                  styles={reactSelectSMStyle}
                  value={specimenTypeLookup.filter(
                    (specimenType: any) =>
                      specimenType.value === formData.specimenTypeId
                  )}
                  menuPortalTarget={document.body}
                  closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                  onChange={(option: any) =>
                    handleSelectChange("specimenTypeId", option.value)
                  }
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span className="">
                  {t("Dependency Test (Single/Multiple)")}
                </span>
                <Select
                  inputId={`AdditionalSetupDependencyTest`}
                  theme={(theme) => styles(theme)}
                  options={dependencyTestsOptions}
                  value={dependencyTestsOptions.filter((test: any) =>
                    formData?.dependencyTestIds?.includes(test.value)
                  )}
                  className="mb-2"
                  name="dependencyTestIds"
                  isMulti
                  styles={reactSelectSMStyle}
                  menuPortalTarget={document.body}
                  closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                  onChange={(option: any) =>
                    handleSelectChange("dependencyTestIds", option)
                  }
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div className="form-check form-check-sm form-check-solid">
                <label htmlFor="">{t("Reference Bill")}</label>
                <input
                  id={`AdditionalSetupReferenceBill`}
                  className="form-check-input mr-2 mb-2"
                  type="checkbox"
                  name="isReferenceBill"
                  checked={formData.isReferenceBill}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span>{t("Tube Type")}</span>
                <Select
                  inputId={`AdditionalSetupTubeType`}
                  theme={(theme) => styles(theme)}
                  className="mb-2"
                  name="tubeType"
                  options={tubeTypeLookup}
                  styles={reactSelectSMStyle}
                  value={tubeTypeLookup.filter(
                    (tubeType: any) => tubeType.value === formData.tubeType
                  )}
                  menuPortalTarget={document.body}
                  closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                  onChange={(option: any) =>
                    handleSelectChange("tubeType", option.value)
                  }
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span>{t("Storage Type")}</span>
                <Select
                  inputId={`AdditionalSetupStorageType`}
                  theme={(theme) => styles(theme)}
                  className="mb-2"
                  name="storageType"
                  options={storageTypeLookup}
                  styles={reactSelectSMStyle}
                  value={storageTypeLookup.filter(
                    (storageType: any) =>
                      storageType.value === formData.storageType
                  )}
                  menuPortalTarget={document.body}
                  closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                  onChange={(option: any) =>
                    handleSelectChange("storageType", option.value)
                  }
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div className="form-check form-check-sm form-check-solid">
                <label htmlFor="">{t("Auto Validate Test")}</label>
                <input
                  id={`AdditionalSetupAutoValidate`}
                  className="form-check-input mr-2 mb-2"
                  type="checkbox"
                  name="isAutoValidateTest"
                  checked={formData.isAutoValidateTest}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            {formData.isAutoValidateTest === true && (
              <Grid item xs={7} sm={6} md={3}>
                <div>
                  <Select
                    inputId={`AdditionalSetupAutoValidateTest`}
                    theme={(theme) => styles(theme)}
                    className="mb-2"
                    name="autoValidateTest"
                    options={autoValidateTestLookup}
                    styles={reactSelectSMStyle}
                    value={autoValidateTestLookup.filter(
                      (autoValidateTest: any) =>
                        autoValidateTest.value === formData.autoValidateTest
                    )}
                    menuPortalTarget={document.body}
                    closeMenuOnScroll={(e) => closeMenuOnScroll(e)}
                    onChange={(option: any) =>
                      handleSelectChange("autoValidateTest", option.value)
                    }
                  />
                </div>
              </Grid>
            )}
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span className="">{t("Minimal Volume")}</span>
                <input
                  id={`AdditionalSetupMinimalVolume`}
                  type="text"
                  name="minimalVolume"
                  className="h-30px rounded form-control bg-transparent mb-2"
                  placeholder={t("Minimal Volume")}
                  value={formData.minimalVolume}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span className="">{t("LOINC Code")}</span>
                <input
                  id={`AdditionalSetupLoincCode`}
                  type="text"
                  name="loincCode"
                  className="h-30px rounded form-control bg-transparent mb-2"
                  placeholder={t("LOINC Code")}
                  value={formData.loincCode}
                  onChange={handleChange}
                />
              </div>
            </Grid>
            <Grid item xs={7} sm={6} md={3}>
              <div>
                <span className="">{t("Snomed Code")}</span>
                <input
                  id={`AdditionalSetupSnomedCode`}
                  type="text"
                  name="snomedCode"
                  className="h-30px rounded form-control bg-transparent mb-2"
                  placeholder={t("Snomed Code")}
                  value={formData.snomedCode}
                  onChange={handleChange}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}

export default AdditionalSetupIndividual;
