import { useEffect, useRef, useState } from "react";
import { IPropsGroupSelect } from "../../Interface/SingleRequisition";
import Checkbox from "../Common/Input/Checkbox";
import Input from "../Common/Input/Input";
import { AxiosResponse } from "axios";
import useLang from "Shared/hooks/useLanguage";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  setRequisitionData,
  setSelectedRequisitionData,
} from "../../Redux/Actions/Pages/Requisition";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import { assignFormValues, clearSignature } from "../../Utils/Auth";
import {
  collectorNameOptionsAdd,
  extractDropDownSelectedValue,
  FacilityAdd,
  setDropDownValue,
} from "../../Utils/Common/Requisition";
import FacilityDropdown from "./FacilityDropdown";
import Popup from "./Popup";
import ProviderDropdown from "./ProviderDropdown";
import { toast } from "react-toastify";
import Select from "react-select";
import { styles } from "Utils/Common";
import { FindIndex } from "Utils/Common/CommonMethods";
const GroupedSelect: React.FC<IPropsGroupSelect> = (
  {
    fields,
    isShown,
    setIsShown,
    inputs,
    dependenceyControls,
    index,
    errorFocussedInput,
    setInputs,
    setInfectiousData,
    setPhysicianId,
    setErrorFocussedInput,
    props,
  },
) => {
  const params = new URLSearchParams(window.location.search);
  const workflowId = params.get("workflowId");

  const { t } = useLang();
  const _adminType = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.portalType
  );
  const user = useSelector((state: any) => state?.Reducer);
  useEffect(() => {
    props.Inputs[props.index]?.fields?.forEach((field: any) => {
      if (field?.systemFieldName === "PhysicianID") {
        setPhysicianList(field?.options);
      }
    });
  }, []);

  const ref = useRef<any>(null);
  const [selectedDropDownValue, setSelectedDropDownValue] = useState<any>({});
  const [physicianList, setPhysicianList] = useState([]);

  const [showhide, setshowhide] = useState<boolean>(true);
  const [open, setOpen] = useState<any>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const dispatch = useDispatch();
  const [facilities, setFacilities] = useState<any>([]);
  const [providerNotRequired, setProviderNotRequired] = useState(false);
  const handleChange = (e: any) => {
    if (e.target.checked) {
      setProviderNotRequired(true);
      props.Section.fields.map((field: any) => {
        if (field.systemFieldName === "PhysicianID") {
          field.defaultValue = "";
          field.selectedText = "";
        }
      });
      setSelectedDropDownValue((preVal: any) => {
        return {
          ...preVal,
          selectedProvider: "",
        };
      });
    } else setProviderNotRequired(false);
  };
  useEffect(() => {
    getPreFilledFormValuesToEditfacility();
  }, []);
  const LoadRequisitionSection = (obj: any) => {
    if (obj.insuranceTypeId === undefined || obj.insuranceTypeId === null) return;
    window.dispatchEvent(new Event("storage"));
    RequisitionType?.LoadReqSectionByFacilityIDandInsuranceId(obj)
      .then((res: AxiosResponse) => {
        if (Array.isArray(res.data)) {
          res.data.forEach((requisitionNameLevel: any) => {
            requisitionNameLevel.sections.forEach((sectionsLevel: any) => {
              sectionsLevel.fields.forEach((fieldsLevel: any) => {
                fieldsLevel.singleRequsition = true;
              });
            });
          });
          setInfectiousData(res.data);
          if (location?.state?.reqId) {
            let objToSend: any;
            let ReqIdArray: any = [];
            let ReqNameArray: any = [];
            res.data.map((item: any) => {
              ReqIdArray.push(item?.reqId);
              ReqNameArray.push(item?.requistionName);
            });
            objToSend = {
              requsitionId: ReqIdArray,
              requisitionName: ReqNameArray,
            };
            dispatch(setSelectedRequisitionData(objToSend));
          }
          dispatch(
            setRequisitionData({
              reqRequestData: res?.data,
            })
          );
          ref.current.scrollIntoView({ behavior: "smooth" });
        } else {
          setInfectiousData([]);
          toast.error(res.data.message);
        }
      })
      .catch((err: any) => {
        console.trace("err");
      });
  };
  const ProviderLookup = async (e: any) => {
    await RequisitionType.getProvidersList(e)
      .then((res: any) => {
        setPhysicianList(res?.data);
        getPreFilledFormValuesToEdit(res?.data)
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  const getPreFilledFormValuesToEdit = (physicians: any) => {
    let physicianInfo = fields?.find(
      (info: any) => info?.systemFieldName == "PhysicianID"
    );
    const selectedProvider = physicians?.find((item: any) => item?.value === physicianInfo?.defaultValue);
    onProviderSelect(selectedProvider);
  };
  const getPreFilledFormValuesToEditfacility = () => {
    let selectedFacility = extractDropDownSelectedValue(fields, "FacilityID");
    onFacilitySelect(selectedFacility);
  };
  const [facilitySelect, setFacilitySelect] = useState<any>(false);

  // const onFacilitySelect = async (e: any) => {
  //   const physicianIndex = inputs.findIndex(
  //     (input: any) => input.sectionId === 13
  //   );
  //   const patientIndex = inputs.findIndex(
  //     (input: any) => input.sectionId === 14
  //   );
  //   const updatedInputs = [...inputs];
  //   if (physicianIndex != -1) {
  //     updatedInputs[physicianIndex].fields.map((i: any) => {
  //       i.defaultValue = "";
  //       i.signatureText = "";
  //     });
  //     clearSignature();
  //   }
  //   const facilityId = parseInt(e.value);
  //   // Handle Patient
  //   if (
  //     updatedInputs[patientIndex]?.sectionConfiguration?.facilities &&
  //     Array.isArray(updatedInputs[patientIndex].sectionConfiguration.facilities)
  //   ) {
  //     const isPatientSignature =
  //       updatedInputs[patientIndex].sectionConfiguration.facilities.includes(
  //         facilityId
  //       );
  //     updatedInputs[patientIndex].isSelected = isPatientSignature;
  //   }

  //   // Handle Physician
  //   if (
  //     updatedInputs[physicianIndex]?.sectionConfiguration?.facilities &&
  //     Array.isArray(
  //       updatedInputs[physicianIndex].sectionConfiguration.facilities
  //     )
  //   ) {
  //     const isPhysicianSignature =
  //       updatedInputs[physicianIndex].sectionConfiguration.facilities.includes(
  //         facilityId
  //       );
  //     updatedInputs[physicianIndex].isSelected = isPhysicianSignature;
  //   }

  //   setInputs(updatedInputs);

  //   if (!e?.value) return;
  //   setFacilitySelect(true);
  //   dispatch(
  //     setRequisitionData({
  //       facilityId: e?.value,
  //     })
  //   );
  //   ProviderLookup(e.value);
  //   getCollectorNameList(e?.value);
  //   let newInputs = assignFormValues(
  //     inputs,
  //     index,
  //     undefined,
  //     0,
  //     e.value,
  //     false,
  //     false,
  //     false,
  //     undefined,
  //     undefined,
  //     undefined,
  //     e.label,
  //     setInputs
  //   );
  //   if (!location?.state?.reqId) {
  //     newInputs?.then((res) => {
  //       setInputs(res);
  //     });
  //   }
  //   localStorage.setItem("facilityID", e?.value);
  //   let obj = {
  //     facilityId: e?.value,
  //     insuranceTypeId: localStorage.getItem("insurnceID"),
  //     pageId: 6,
  //     requisitionId: location?.state?.reqId,
  //     requisitionOrderId: location?.state?.orderid,
  //     workflowId: workflowId,
  //   };
  //   if (localStorage.getItem("insurnceID")) {
  //     LoadRequisitionSection(obj);
  //     if (location?.state?.reqId) {
  //       LoadRequisitionSection(obj);
  //     }
  //   }
  //   setSelectedDropDownValue((preVal: any) => {
  //     return {
  //       ...preVal,
  //       selectedFacility: e,
  //       selectedProvider: "",
  //     };
  //   });
  //   setInputs(inputs);
  // };
  const onFacilitySelect = async (e: any) => {
    const facilityId = parseInt(e?.value);
    if (isNaN(facilityId)) return;

    try {
      // Clone inputs
      const updatedInputs = [...inputs];

      // Find indices
      const physicianIndex = updatedInputs.findIndex((i) => i.sectionId === 13);
      const patientIndex = updatedInputs.findIndex((i) => i.sectionId === 14);

      // Clear physician signature fields
      if (physicianIndex !== -1) {
        updatedInputs[physicianIndex].fields?.forEach((field: any) => {
          field.defaultValue = "";
          field.signatureText = "";
        });
        clearSignature();
      }

      // Utility to check if facilityId is in section's facilities list
      const updateSectionSelection = (index: number) => {
        if (
          index !== -1 &&
          Array.isArray(updatedInputs[index]?.sectionConfiguration?.facilities)
        ) {
          const isSelected = updatedInputs[index].sectionConfiguration.facilities.includes(facilityId);
          updatedInputs[index].isSelected = isSelected;
        }
      };

      // Update selection for both sections
      updateSectionSelection(patientIndex);
      updateSectionSelection(physicianIndex);

      setInputs(updatedInputs);
      setFacilitySelect(true);

      // Dispatch to store
      dispatch(setRequisitionData({ facilityId }));

      // Trigger supporting functions
      ProviderLookup(facilityId);
      getCollectorNameList(e?.value);
      localStorage.setItem("facilityID", facilityId.toString());

      // Assign form values
      const newInputsPromise = assignFormValues(
        inputs,
        index,
        undefined,
        0,
        facilityId,
        false,
        false,
        false,
        undefined,
        undefined,
        undefined,
        e.label,
        setInputs
      );

      // Conditionally await and set new inputs
      if (!location?.state?.reqId) {
        const newInputs = await newInputsPromise;
        setInputs(newInputs);
      }

      // Load requisition if insuranceId exists
      const insuranceTypeId = localStorage.getItem("insurnceID");
      const requisitionId = location?.state?.reqId;
      const requisitionOrderId = location?.state?.orderid;

      if (insuranceTypeId) {
        const obj = {
          facilityId,
          insuranceTypeId,
          pageId: 6,
          requisitionId,
          requisitionOrderId,
          workflowId,
        };
        LoadRequisitionSection(obj);
        if (requisitionId) {
          LoadRequisitionSection(obj); // this call looks redundant, but kept as per original logic
        }
      }

      // Update dropdown selection
      setSelectedDropDownValue((prev: any) => ({
        ...prev,
        selectedFacility: e,
        selectedProvider: "",
      }));

    } catch (error) {
      console.error("Error in onFacilitySelect:", error);
    }
  };

  const location = useLocation();
  const onProviderSelect = async (e: any) => {
    if (!e?.value) return;
    if (!facilitySelect && _adminType !== 2 && !location?.state?.reqId) {
      const response = await RequisitionType.GetFacilityByProviderId(e?.value);
      setFacilities(response?.data?.facilities);
      const FacilityInput = FacilityAdd(inputs, response?.data?.facilities);
      let FacilityInputCopy: any = [...FacilityInput];
      setInputs(FacilityInputCopy);
    }
    let newInputs = assignFormValues(
      inputs,
      index,
      undefined,
      1,
      e.value,
      false,
      false,
      false,
      undefined,
      undefined,
      undefined,
      e.label,
      setInputs
    );

    if (!location?.state?.reqId) {
      newInputs?.then((res) => {
        setInputs(res);
      });
    }
    if (e?.value) {
      fields.map((field: any) => {
        if (e.name === field.systemFieldName) {
          field.enableRule = "";
        }
      });
    }
    sessionStorage.setItem("PhysicianID", e?.value);
    sessionStorage.setItem("PhysicianName", e?.label);

    setSelectedDropDownValue((preVal: any) => {
      return {
        ...preVal,
        selectedProvider: e,
      };
    });
  };

  const getCollectorNameList = async (facilityId: string) => {
    await RequisitionType.getCollectorsList(facilityId)
      .then((res: any) => {
        const InputsWithCollectorNameOption = collectorNameOptionsAdd(
          inputs,
          facilityId,
          res?.data
        );
        let InputsWithCollectorNameOptionCopy = [
          ...InputsWithCollectorNameOption,
        ];
        setInputs(InputsWithCollectorNameOptionCopy);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  return (
    <>
      {fields?.map((items: any, fieldIndex: any) => (
        <>
          <div className={`${items?.displayType} mb-4`}>
            {(items?.uiType === "DropDown" ||
              items?.uiType === "ProviderWithNoProviderCheckbox") &&
              items?.visible ? (
              <>
                {!showhide && items?.systemFieldName === "PhysicianID" ? (
                  <label className="mb-2 fw-500"> </label>
                ) : (
                  <label
                    className={
                      items?.required &&
                        items.systemFieldName === "FacilityID" &&
                        _adminType == 2
                        ? ""
                        : "required mb-2 fw-500"
                    }
                  >
                    {items.systemFieldName === "FacilityID" && _adminType == 2
                      ? null
                      : t(items?.displayFieldName)}
                  </label>
                )}
                <div className="col-lg-12">
                  {items?.systemFieldName === "PhysicianID" &&
                    items?.uiType === "DropDown" ? (
                    <>
                      <div className="row">
                        {(showhide &&
                          items?.systemFieldName === "PhysicianID") ||
                          fields?.length === 2 ? (
                          <>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                              <ProviderDropdown
                                physicianArr={physicianList}
                                onProviderSelect={onProviderSelect}
                                selectedProviders={
                                  selectedDropDownValue?.selectedProvider
                                }
                                name={items?.systemFieldName}
                                errorFocussedInput={errorFocussedInput}
                                setPhysicianList={setPhysicianList}
                                setPhysicianId={setPhysicianId}
                                items={items}
                                setErrorFocussedInput={setErrorFocussedInput}
                                error={items.enableRule}
                                inputs={inputs}
                              />
                            </div>

                            <div
                              className={`col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12`}
                            >
                              <button
                                type="button"
                                className="btn btn-light-primary btn-sm px-4 p-2 py-3 mt-2 mt-sm-0"
                                onClick={handleOpen}
                                disabled={providerNotRequired}
                              >
                                <i
                                  className="bi bi-plus"
                                  style={{ fontSize: "20px" }}
                                ></i>
                                {t("Add New Provider")}
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}

                  {items?.systemFieldName === "PhysicianID" &&
                    items?.uiType === "ProviderWithNoProviderCheckbox" ? (
                    <>
                      <div className="row">
                        {(showhide &&
                          items?.systemFieldName === "PhysicianID") ||
                          fields?.length === 2 ? (
                          <>
                            <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                              <ProviderDropdown
                                physicianArr={physicianList}
                                onProviderSelect={onProviderSelect}
                                selectedProviders={
                                  selectedDropDownValue?.selectedProvider
                                }
                                name={items?.systemFieldName}
                                errorFocussedInput={errorFocussedInput}
                                setPhysicianList={setPhysicianList}
                                setPhysicianId={setPhysicianId}
                                items={items}
                                setErrorFocussedInput={setErrorFocussedInput}
                                error={items.enableRule}
                                providerNotRequired={providerNotRequired}
                                inputs={inputs}
                              />
                              <div className="mt-2">
                                <label className="form-check form-check-inline form-check-solid m-0 d-flex align-items-center gap-2">
                                  <input
                                    className="form-check-input h-15px w-15px rounded-01"
                                    type="checkbox"
                                    onChange={handleChange}
                                  />
                                  <span className="text-gray-600 fs-7">
                                    {t("Provider Not Required")}
                                  </span>
                                </label>
                              </div>
                            </div>

                            <div
                              className={`col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12`}
                            >
                              <button
                                type="button"
                                className="btn btn-light-primary btn-sm px-4 p-2 py-3 mt-2 mt-sm-0"
                                onClick={handleOpen}
                                disabled={providerNotRequired}
                              >
                                <i
                                  className="bi bi-plus"
                                  style={{ fontSize: "20px" }}
                                ></i>
                                {t("Add New Provider")}
                              </button>
                            </div>
                          </>
                        ) : null}
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="col-lg-12">
                  {items?.systemFieldName === "FacilityID" ? (
                    <FacilityDropdown
                      facilityList={items.options}
                      onFacilitySelect={onFacilitySelect}
                      selectedFacilities={
                        selectedDropDownValue?.selectedFacility
                      }
                      name={items?.systemFieldName}
                      errorFocussedInput={errorFocussedInput}
                      setSelectedDropDownValue={setSelectedDropDownValue}
                      _adminType={_adminType}
                      items={items}
                      setErrorFocussedInput={setErrorFocussedInput}
                      error={items.enableRule}
                    />
                  ) : null}
                </div>
                {items.systemFieldName === "FacilityID" && _adminType == 2
                  ? null
                  : items.enableRule && (
                    <div className="form__error">
                      <span>{t(items.enableRule)}</span>
                    </div>
                  )}
              </>
            ) : null}
            {(items?.uiType === "TextBox" || items?.uiType === "TextArea") &&
              items?.visible ? (
              <>
                <label className="required mb-2 fw-500">
                  {t(items?.displayFieldName)}
                </label>
                <Input
                  label={items?.displayFieldName}
                  onChange={(e: any) => e.target.value}
                  required={items?.required}
                  setErrorFocussedInput={setErrorFocussedInput}
                  error={items.enableRule}
                  errorFocussedInput={errorFocussedInput}
                />
              </>
            ) : null}
            {items?.uiType === "CheckBox" && items?.visible ? (
              <>
                <Checkbox
                  spanClassName="ms-3"
                  labelClassName="form-check form-check-inline form-check-solid m-0 fw-500"
                  label={t(items?.displayFieldName)}
                  setErrorFocussedInput={setErrorFocussedInput}
                  error={items.enableRule}
                  errorFocussedInput={errorFocussedInput}
                  sectionName={props?.section?.sectionName}
                  parentDivClassName={items?.displayType}
                  systemFieldName={items?.systemFieldName}
                  onChange={async (e: any) => {
                    items.enableRule = "";
                    let newInputs = await assignFormValues(
                      inputs,
                      index,
                      undefined,
                      fieldIndex,
                      //e.target.checked,
                      true,
                      false,
                      false,
                      false,
                      undefined,
                      undefined,
                      undefined,
                      e.target.label,
                      setInputs
                    );

                    setInputs(newInputs);
                  }}
                  sectionId={props.sectionId}
                  defaultValue={items?.defaultValue}
                  Inputs={inputs}
                  setInputs={setInputs}
                  index={index}
                />
              </>
            ) : null}
            {items?.uiType === "DropDown" &&
              items.systemFieldName != "FacilityID" &&
              items?.visible &&
              items?.uiType === "DropDown" &&
              items.systemFieldName != "PhysicianID" &&
              items?.visible ? (
              <>
                <Select
                  menuPortalTarget={document.body}
                  inputId={items.systemFieldName}
                  options={items.options}
                  placeholder={t(items?.displayFieldName)}
                  theme={(theme) => styles(theme)}
                  value={setDropDownValue(
                    items.options,
                    items?.defaultValue,
                    location?.state?.reqId
                  )}
                  onChange={async (e: any) => {
                    fields.enableRule = "";
                    let newInputs = await assignFormValues(
                      inputs,
                      index,
                      undefined,
                      0,
                      e.value,
                      false,
                      false,
                      false,
                      undefined,
                      undefined,
                      undefined,
                      e.label,
                      setInputs
                    );
                    if (props.ArrayReqId) {
                      const infectiousDataCopy = [...props?.infectiousData];
                      infectiousDataCopy[
                        FindIndex(infectiousDataCopy, props.ArrayReqId)
                      ].sections = newInputs;
                      props?.setInfectiousData &&
                        props?.setInfectiousData([...infectiousDataCopy]);
                    } else {
                      props?.setInputs(newInputs);
                    }
                  }}
                  isSearchable={true}
                  styles={{
                    control: (baseStyles, state) => ({
                      ...baseStyles,
                      borderColor: "var(--kt-input-border-color)",
                      color: "var(--kt-input-border-color)",
                    }),
                  }}
                  id={items?.displayFieldName.split(" ").join("")}
                />
              </>
            ) : null}
          </div>
        </>
      ))}
      {/* modalstart */}
      <Popup
        open={open}
        handleClose={handleClose}
        isShown={isShown}
        index={index}
        setIsShown={setIsShown}
        inputs={inputs}
        setInputs={setInputs}
        setSelectedDropDownValue={setSelectedDropDownValue}
        selectedDropDownValue={selectedDropDownValue}
        dependenceyControls={dependenceyControls}
        setPhysicianList={setPhysicianList}
        physicianList={physicianList}
        onFacilitySelect={onFacilitySelect}
        fields={fields}
        getCollectorNameList={getCollectorNameList}
        ProviderLookup={ProviderLookup}
      />
    </>
  );
};
function mapStateToProps(state: any, ownProps: any) {
  return { RequsitionData: state };
}
export default connect(mapStateToProps)(GroupedSelect);
