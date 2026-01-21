import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import LoadButton from "../../../Shared/Common/LoadButton";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import useLang from "Shared/hooks/useLanguage";

type AnalyteItem = { id: number; [key: string]: any };

const ResultDataExpandableRow = (props: any) => {
  const {
    row,
    requisitionId,
    reqTypeId,
    requisitionOrderId,
    facilityId,
    setDuplicate,
  } = props;

  const { t } = useLang();
  const dispatch = useDispatch();

  const {
    data,
    apiCalls,
    loadAllResultData,
    filterData,
    rowsToExpand,
    setRowsToExpand,
    isMasterExpandTriggered,
  } = useToxResultDataContext();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [medications, setMedications] = useState<any>(false);
  const [medicationList, setMedicationList] = useState<any>([]);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState<any>([]);
  const [selectedMedications, setSelectedMedications] = useState<any>([]);
  const [confirmation, setConfirmation] = useState<any>([]);
  const [validity, setValidity] = useState<any>([]);
  const [screen, setScreen] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [disable, setDisable] = useState<any>(true);
  const targetRef = useRef(null);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [reportNotes, setReportNotes] = useState<any>({
    lisNotes: "",
    criticalReport: "",
  });
  const [reportCheckboxes, setReportCheckboxes] = useState({
    isCorrected: false,
    isAmended: false,
  });

  const handleClose = () => {
    setDuplicate(false);
  };

  const SaveToxResultDataExpand = () => {
    // Extract all analytes from the different test types
    const screeningAnalytes =
      screen?.flatMap((panel: any) => panel.analyteList) || [];
    const validityAnalytes =
      validity?.flatMap((panel: any) => panel.analyteList) || [];
    const confirmationAnalytes =
      confirmation?.flatMap((panel: any) => panel.analyteList) || [];

    const row = {
      requisitionOrderId: requisitionOrderId,
      analytes: [
        ...screeningAnalytes,
        ...validityAnalytes,
        ...confirmationAnalytes,
      ],
      lisComment: reportNotes?.lisNotes,
      isCorrected: reportCheckboxes?.isCorrected,
      isAmended: reportCheckboxes?.isAmended,
    };
    setIsSubmitting(true);
    RequisitionType.SaveToxResultDataExpand(row)
      .then(async (res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setIsSubmitting(false);
          await loadAllResultData(false);
          GetExpandDataById(requisitionOrderId);
        }
      })
      .catch((err: any) => {
        setIsSubmitting(false);
        console.trace(err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const ApplyRerun = (ids: any) => {
    RequisitionType.ToxApplyRerun(ids)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          GetExpandDataById(requisitionOrderId);
          setSelectedBox({
            screenIds: [],
            confirmationIds: [],
            validityTestIds: [],
          });
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const TOXLISReportView = (
    reqId: any,
    requisitionOrderId: any,
    facilityId: any
  ) => {
    const row = {
      requisitionId: reqId,
      requisitionOrderId: requisitionOrderId,
      isPreview: true,
      facilityId: facilityId,
      reqType: props.row.RequisitionTypeId,
    };
    setIsPreviewing(true);
    RequisitionType.TOXLISReportView(row)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setIsPreviewing(false);
          dispatch(savePdfUrls(res?.data?.data));
          window.open("/docs-viewer", "_blank", "noreferrer");
        }
        if (res?.data.statusCode === 400) {
          toast.error(t(res?.data?.message));
          setIsPreviewing(false);
        }
      })
      .catch((err: any) => {
        setIsPreviewing(false);
        console.trace(err);
      });
  };

  const PublishAndValidate = async (reqId: any, requisitionOrderId: any) => {
    const basePayload = {
      requisitionId: reqId,
      requisitionOrderId,
      isPreview: true,
      facilityId,
      reqType: reqTypeId,
    };

    try {
      if (props.row.LISStatus?.toLowerCase() === "pending") {
        toast.error(t("Result is not completed in all tests"));
        return;
      }

      setIsPublishing(true);

      const publishPayload = [{ ...basePayload }];

      const publishResponse: AxiosResponse =
        await RequisitionType.ToxPublishAndValidate(publishPayload);

      if (publishResponse?.data?.statusCode === 200) {
        toast.success(t(publishResponse.data.message));
        apiCalls();
        setDuplicate(false);
      } else {
        toast.error(t(publishResponse?.data?.message || "Publish failed"));
      }
    } catch (error) {
      console.error("PublishAndValidate Error:", error);
      toast.error(t("An unexpected error occurred. Please try again."));
    } finally {
      setIsPublishing(false);
    }
  };

  // Define a function to handle the checkbox change
  const handleCheckboxChange = (name: string) => {
    // Update the state with the new checkbox value
    if (name === "isCorrected") {
      setReportCheckboxes({
        isCorrected: !reportCheckboxes.isCorrected,
        isAmended: reportCheckboxes.isAmended,
      });
    } else {
      setReportCheckboxes({
        isCorrected: reportCheckboxes.isCorrected,
        isAmended: !reportCheckboxes.isAmended,
      });
    }
  };

  const handleFieldChangeTextArea = (value: any, names: any) => {
    if (names === "lisNotes") {
      setReportNotes((prev: any) => ({ ...prev, lisNotes: value }));
    } else {
      setReportNotes((prev: any) => ({ ...prev, criticalReport: value }));
    }
  };

  const GetExpandDataById = (requisitionOrderId: any) => {
    setLoading(true);
    RequisitionType.GetToxExpandDataById(requisitionOrderId)
      .then((res: any) => {
        setConfirmation(res.data.data.confirmationTest);
        setValidity(res.data.data.validityTests);
        setScreen(res.data.data.screenTests);
        setReportNotes({
          lisNotes: res?.data?.data?.lisNotes,
          criticalReport: res?.data?.data?.criticalReport,
        });
        setReportCheckboxes({
          isAmended: res?.data?.data?.isAmended,
          isCorrected: res?.data?.data?.isCorrected,
        });
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  const GetMedicationData = () => {
    const objToSend = {
      item1: requisitionId,
      item2: requisitionOrderId,
    };
    RequisitionType.GetToxMedicationList(objToSend)
      .then((res: any) => {
        setMedicationList(res.data.data);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const SaveMedicationData = (Medarray: any) => {
    const BuildMedicationArray = Medarray?.map((item: any) => ({
      medicationId: item.id || item?.medicationRequisitionId,
      medicationCode: item?.medicationCode,
      medicationName: item?.medicationName || item?.medictionName,
    }));
    const objToSend = {
      requistionID: requisitionId,
      requistionOrderID: requisitionOrderId,
      medicationList: BuildMedicationArray,
    };
    RequisitionType.SaveToxMedicationExpand(objToSend)
      .then(async () => {
        setMedications(false);
        await GetMedicationData();
        // Refresh the main result data to update blanks based on medication selection
        GetExpandDataById(requisitionOrderId);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  useEffect(() => {
    GetExpandDataById(requisitionOrderId);
    GetMedicationData();
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const response = await RequisitionType.GetToxMedication(inputValue);
        setSuggestions(response.data.data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };
    if (inputValue !== "") {
      const timeoutId = setTimeout(fetchSuggestions, 300);
      return () => clearTimeout(timeoutId);
    } else {
      setSuggestions([]);
    }
  }, [inputValue]);

  const handleChangeab = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleItemClick = (suggestion: any) => {
    setInputValue(suggestion);
    selectedMedications.push(suggestion);
  };

  const removeMedicationFromList = (medicationCode: any) => {
    const updatedList = [...selectedMedications];
    const indexToRemove = updatedList.findIndex(
      (medication) => medication.medicationCode === medicationCode
    );
    if (indexToRemove !== -1) {
      updatedList.splice(indexToRemove, 1);
      setSelectedMedications(updatedList);
    }
  };

  const [selectedBox, setSelectedBox] = useState<any>({
    screenIds: [],
    confirmationIds: [],
    validityTestIds: [],
  });

  // checked: boolean, item: any
  const handleCheckBoxCheck =
    (
      item: AnalyteItem | null,
      isMainCheckBox = false,
      testType: "ValidityTests" | "ScreenTests" | "ConfirmationTests"
    ) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const { checked } = event.target;

      const listMap: Record<typeof testType, any[]> = {
        ValidityTests: validity?.flatMap((panel: any) => panel.analyteList) || [],
        ScreenTests: screen?.flatMap((panel: any) => panel.analyteList) || [],
        ConfirmationTests:
          confirmation?.flatMap((panel: any) => panel.analyteList) || [],
      };

      const keyMap: Record<typeof testType, keyof typeof selectedBox> = {
        ValidityTests: "validityTestIds",
        ScreenTests: "screenIds",
        ConfirmationTests: "confirmationIds",
      };

      const selectedKey = keyMap[testType];
      const fullList = listMap[testType].map((test) => test.id);

      setSelectedBox((prev: any) => {
        if (isMainCheckBox) {
          return {
            ...prev,
            [selectedKey]: checked ? fullList : [],
          };
        }

        if (item) {
          const current = prev[selectedKey] || [];

          return {
            ...prev,
            [selectedKey]: checked
              ? [...current, item.id]
              : current.filter((id: number) => item.id !== id),
          };
        }

        return prev;
      });
    };

  const handleChangeScreening = (
    controlsIndex: any,
    field: any,
    value: any,
    List: any
  ) => {
    const updatedControlsList = [...List];
    const controlsToUpdate = updatedControlsList?.[controlsIndex];

    if (controlsToUpdate) {
      controlsToUpdate[field] = value;
    }

    // Update the screen state directly
    const updatedScreen = screen.map((panel: any) => {
      const updatedAnalyteList = panel.analyteList.map((item: any) => {
        if (item.id === controlsToUpdate.id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
      return {
        ...panel,
        analyteList: updatedAnalyteList,
      };
    });

    setScreen(updatedScreen);
  };

  const handleChangeValidity = (
    controlsIndex: any,
    field: any,
    value: any,
    List: any
  ) => {
    const updatedControlsList = [...List];
    const controlsToUpdate = updatedControlsList?.[controlsIndex];
    if (controlsToUpdate) {
      controlsToUpdate[field] = value;
    }

    // Update the validity state directly
    const updatedValidity = validity.map((panel: any) => {
      const updatedAnalyteList = panel.analyteList.map((item: any) => {
        if (item.id === controlsToUpdate.id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
      return {
        ...panel,
        analyteList: updatedAnalyteList,
      };
    });

    setValidity(updatedValidity);
  };

  const handleChangeConfirmation = (
    controlsIndex: number,
    field: string,
    value: any,
    List: any[]
  ) => {
    const updatedControlsList = [...List];
    const controlsToUpdate = updatedControlsList[controlsIndex];

    if (controlsToUpdate) {
      controlsToUpdate[field] = value;
    }

    // Update the confirmation state directly
    const updatedConfirmation = confirmation.map((panel: any) => {
      const updatedAnalyteList = panel.analyteList.map((item: any) => {
        if (item.id === controlsToUpdate.id) {
          return {
            ...item,
            [field]: value,
          };
        }
        return item;
      });
      return {
        ...panel,
        analyteList: updatedAnalyteList,
      };
    });

    setConfirmation(updatedConfirmation);
  };

  useEffect(() => {
    if (!isMasterExpandTriggered) return;

    const allData = data.gridData;
    const totalRows = allData.length;

    // If we're close to the end, just expand all remaining rows
    if (rowsToExpand.length >= totalRows - 10) {
      const allIds = allData.map((item: any) => item.RequisitionOrderID);
      setRowsToExpand(allIds);
      return;
    }

    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const lastElement = rowsToExpand[rowsToExpand.length - 1];
          const lastIndex = allData.findIndex(
            (item: any) => item.RequisitionOrderID === lastElement
          );

          const remainingRows = totalRows - (lastIndex + 1);
          const batchSize = Math.min(5, remainingRows); // Don't exceed remaining rows

          if (remainingRows > 0) {
            const nextBatchIds = allData
              .slice(lastIndex + 1, lastIndex + 1 + batchSize)
              .map((item: any) => item.RequisitionOrderID);

            setRowsToExpand((prev: any) => [...prev, ...nextBatchIds]);
          }
        }
      },
      {
        root: null,
        rootMargin: "200px", // Larger margin for earlier detection
        threshold: 0.1,
      }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [rowsToExpand, isMasterExpandTriggered]);

  return (
    <div
      ref={
        rowsToExpand.length > 0 &&
        // Set ref on the last few expanded rows to trigger loading earlier
        rowsToExpand.slice(-3).includes(row?.RequisitionOrderID)
          ? targetRef
          : null
      }
      className="d-flex flex-column flex-column-fluid table-expend-sticky table-expend-sm-sticky"
    >
      <div id="kt_app_content" className="app-content flex-column-fluid pb-0">
        <div
          id="kt_app_content_container"
          className="app-container container-fluid mb-container"
        >
          <div
            className="card-header d-flex justify-content-between align-items-center px-4 min-h-40px mb-2"
            style={{ background: "#BFE0FF" }}
          >
            <h5 className="m-0" style={{ color: "#3776B2" }}>
              {t("Results")}
            </h5>
          </div>
          <div className="d-flex">
            <h6 className="mb-0" style={{ color: "#181C32" }}>
              {t("Medications:")}
            </h6>
            {medicationList.length ? (
              <div className="d-flex flex-wrap gap-2">
                {medicationList.map((i: any, index: number) => (
                  <span className="text-gray-600 text-wrap" key={i.medictionId}>
                    {i.medictionName || i.medicationName}
                    {index < medicationList.length - 1 && ", "}
                  </span>
                ))}
              </div>
            ) : (
              <span>No Prescribed Medication</span>
            )}
          </div>
          {medications && (
            <>
              <div className="col-lg-6 col-md-6 col-sm-6 col-xxl-6">
                <div className="w-100">
                  <input
                    id={`ToxResultDataMedicationInput`}
                    type="text"
                    name="Medication"
                    className="form-control bg-white mb-3 mb-lg-0"
                    placeholder={t("Medications")}
                    onChange={handleChangeab}
                  />
                  {loading && <span>{t("Loading...")}</span>}
                  <div className="position-absolute">
                    {suggestions?.length ? (
                      <div className="bg-white card h-300px overflow-scroll px-3 py-2 shadow-xs w-100">
                        {suggestions?.map((item: any, index: any) => (
                          <div
                            onClick={() => {
                              handleItemClick(item);
                            }}
                            key={index}
                            className="bg-hover-light-primary d-flex gap-2 flex-wrap py-2 px-4 rounded-4"
                            style={{
                              borderBottom: "1.5px solid var(--kt-primary)",
                            }}
                          >
                            <div className="text-hover-primary d-flex">
                              <span className="fw-600 fs-7">
                                {item?.medicationCode}
                              </span>
                              <span className="pl-2 fs-7">
                                {item?.medicationName}
                              </span>
                              <br />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              {selectedMedications.length ? (
                <div className="d-flex flex-wrap gap-2 mt-4">
                  {selectedMedications.map((i: any) => (
                    <div
                      key={i.medicationCode}
                      className="d-flex badge badge-secondary px-2 fw-500 gap-2 align-items-center pt-2"
                    >
                      <i
                        className="bi bi-x-lg fs-7"
                        onClick={() =>
                          removeMedicationFromList(i.medicationCode)
                        }
                      ></i>
                      <span>{i.medicationName || i?.medictionName}</span>
                    </div>
                  ))}
                </div>
              ) : null}
              <div className="d-flex flex-wrap gap-2 mt-3">
                <button
                  id={`ToxResultDataSaveMedication`}
                  className="btn btn-sm fw-bold fw-500 text-light"
                  style={{ background: "#E3CC20" }}
                  onClick={() => {
                    SaveMedicationData(selectedMedications);
                  }}
                >
                  {t("Save")}
                </button>

                <button
                  id={`ToxResultDataCancelMedication`}
                  className="btn btn-secondary btn-sm fw-bold search d-block fs-12px py-0 fw-500"
                  onClick={() => setMedications(false)}
                >
                  {t("Cancel")}
                </button>
              </div>
              <div className="row pb-2 border-dashed border-bottom-1 border-0 border-gray-400"></div>
            </>
          )}

          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center mt-3">
            <div className="align-items-center d-flex mb-md-5 mb-3 gap-2 flex-wrap">
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Result Data"
                permissionIdentifier="EditMedications"
              >
                <button
                  id={`ToxResultDataEditMedication`}
                  className="btn btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-light"
                  style={{ background: "#008000" }}
                  onClick={() => {
                    setMedications(true);
                    setSelectedMedications([...medicationList]);
                  }}
                >
                  {t("Edit Medications")}
                </button>
              </PermissionComponent>
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Result Data"
                permissionIdentifier="EditResultValue"
              >
                <button
                  id={`ToxResultDataEditResultValue`}
                  className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  onClick={() => setDisable(false)}
                >
                  {t("Edit Result Value")}
                </button>
              </PermissionComponent>
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Result Data"
                permissionIdentifier="PublishAndValidate"
              >
                <button
                  id={`ToxResultDataPublishAndValidate`}
                  className="btn btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-light"
                  style={{ background: "#34C0FF" }}
                  onClick={() =>
                    PublishAndValidate(requisitionId, requisitionOrderId)
                  }
                >
                  {isPublishing
                    ? `${t("Processing...")}`
                    : `${t("Publish & Validate")}`}
                </button>
              </PermissionComponent>
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Result Data"
                permissionIdentifier="Preview"
              >
                <LoadButton
                  id={`ToxResultDataExpandPreview`}
                  className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isPreviewing}
                  btnText={t("Preview")}
                  loadingText="Previewing"
                  onClick={() =>
                    TOXLISReportView(
                      requisitionId,
                      requisitionOrderId,
                      facilityId
                    )
                  }
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Result Data"
                permissionIdentifier="save"
              >
                <LoadButton
                  id={`ToxResultDataExpandSave`}
                  className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isSubmitting}
                  btnText={t("Save")}
                  loadingText={t("Saving")}
                  onClick={() => SaveToxResultDataExpand()}
                />
              </PermissionComponent>
              {filterData.tabId === 2 ? (
                <>
                  <div>
                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                      <input
                        id={`ToxResultDataExpandCorrectReport`}
                        className="form-check-input"
                        type="checkbox"
                        checked={reportCheckboxes.isCorrected}
                        onChange={() => handleCheckboxChange("isCorrected")}
                      />
                      {t("Corrected Report")}
                    </label>
                  </div>
                  <div>
                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                      <input
                        id={`ToxResultDataExpandAmendedReport`}
                        className="form-check-input"
                        type="checkbox"
                        checked={reportCheckboxes.isAmended}
                        onChange={() => handleCheckboxChange("isAmended")}
                      />
                      {t("Amended Report")}
                    </label>
                  </div>
                </>
              ) : null}
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mb-2"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
                <h5 className="m-0 text-info">{t("Screening")}</h5>
                {selectedBox.screenIds.length ? (
                  <PermissionComponent
                    moduleName="TOX LIS"
                    pageName="Result Data"
                    permissionIdentifier="ApplyReRun"
                  >
                    <button
                      id={`ToxResultDataExpandApplyReRun`}
                      className="btn btn-sm text-light"
                      style={{ background: "#702AFB" }}
                      onClick={() => ApplyRerun(selectedBox.screenIds)}
                    >
                      {t("Apply ReRun")}
                    </button>
                  </PermissionComponent>
                ) : null}
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="table_bordered overflow-hidden">
                  <TableContainer className="shadow-none">
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="plate-mapping-table mb-1"
                    >
                      <TableHead className="h-35px">
                        <TableRow>
                          <TableCell className="min-w-80px w-80px">
                            {t("Drug Class")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Cutoff")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Result Value")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            {t("Interpretation")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                id={`ToxResultDataExpandScreeningReRun`}
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  screen?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length > 0 &&
                                  screen?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length === selectedBox?.screenIds?.length
                                }
                                onChange={handleCheckBoxCheck(
                                  null,
                                  true,
                                  "ScreenTests"
                                )}
                              />
                              {t("Re-Run")}
                            </label>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={5} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : screen && screen.length > 0 ? (
                          screen.map((data: any, controlsIndex: any) => (
                            <>
                              <TableRow className="">
                                <TableCell
                                  id={`ToxResultDataScreenPanelName_${
                                    controlsIndex + 1
                                  }`}
                                  colSpan={5}
                                  className="padding-0"
                                  style={{
                                    background: "#dbeacf",
                                  }}
                                >
                                  <span
                                    className="px-2 fw-bold"
                                    style={{ fontSize: "16px" }}
                                  >
                                    {data.panelName}
                                  </span>
                                </TableCell>
                              </TableRow>
                              {data?.analyteList?.map((i: any, index: any) => (
                                <TableRow
                                  key={i.id}
                                  className={
                                    i?.interpretation === "Positive"
                                      ? "bg-crititcal-red"
                                      : ""
                                  }
                                >
                                  <TableCell
                                    id={`ToxResultDataScreeningAnalyte_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.testName}
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataScreeningCutOff_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.referanceRange}
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      id={`ToxResultDataScreeningResultValue_${
                                        index + 1
                                      }`}
                                      type="text"
                                      className="form-control bg-transparent"
                                      value={i?.results}
                                      onChange={(e) =>
                                        handleChangeScreening(
                                          index,
                                          "results",
                                          e.target.value,
                                          data?.analyteList
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        const regex = /^[0-9.]*$/;
                                        if (
                                          !(
                                            regex.test(e.key) ||
                                            e.key === "Backspace" ||
                                            e.key === "Tab"
                                          )
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      disabled={disable}
                                    />
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataScreeningInterpretation_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.interpretation}
                                  </TableCell>
                                  <TableCell>
                                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                      <input
                                        id={`ToxResultDataScreeningReRun_${
                                          index + 1
                                        }`}
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                          selectedBox?.screenIds?.includes(
                                            i.id
                                          ) || false
                                        }
                                        onChange={handleCheckBoxCheck(
                                          i,
                                          false,
                                          "ScreenTests"
                                        )}
                                      />
                                    </label>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              {t("No screening data available")}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mb-2"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
                <h5 className="m-0 text-info">{t("Confirmation")}</h5>
                {selectedBox?.confirmationIds?.length ? (
                  <PermissionComponent
                    moduleName="TOX LIS"
                    pageName="Result Data"
                    permissionIdentifier="ApplyReRun"
                  >
                    <button
                      id={`ToxResultDataConfirmationApplyReRunButton`}
                      className="btn btn-sm text-light"
                      style={{ background: "#702AFB" }}
                      onClick={() => ApplyRerun(selectedBox.confirmationIds)}
                    >
                      {t("Apply ReRun")}
                    </button>
                  </PermissionComponent>
                ) : null}
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="table_bordered overflow-hidden">
                  <TableContainer className="shadow-none">
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="plate-mapping-table mb-1"
                    >
                      <TableHead className="h-35px">
                        <TableRow>
                          <TableCell className="min-w-80px w-80px">
                            {t("Analyte")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Cutoff")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Linearity")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Result Value")}
                          </TableCell>
                          {filterData.tabId === 2 && (
                            <>
                              <TableCell className="min-w-125px w-125px">
                                {t("Comments")}
                              </TableCell>
                            </>
                          )}
                          <TableCell className="min-w-125px w-125px">
                            {t("Interpretation")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                id={`ToxResultDataConfirmationReRunCheckBox`}
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  confirmation?.length &&
                                  confirmation?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length > 0 &&
                                  confirmation?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length ===
                                    selectedBox?.confirmationIds?.length
                                }
                                onChange={handleCheckBoxCheck(
                                  null,
                                  true,
                                  "ConfirmationTests"
                                )}
                              />
                              {t("Re-Run")}
                            </label>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={5} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : (
                          confirmation?.map((data: any, controlsIndex: any) => (
                            <>
                              <TableRow className="">
                                <TableCell
                                  id={`ToxResultDataConfirmationPanelName_${
                                    controlsIndex + 1
                                  }`}
                                  colSpan={6}
                                  className="padding-0"
                                  style={{
                                    background: "#dbeacf",
                                  }}
                                >
                                  <span
                                    className="px-2 fw-bold"
                                    style={{ fontSize: "16px" }}
                                  >
                                    {data.panelName}
                                  </span>
                                </TableCell>
                              </TableRow>
                              {data?.analyteList.map((i: any, index: any) => (
                                <TableRow
                                  key={i.id}
                                  className={
                                    i?.interpretation === "Positive"
                                      ? "bg-crititcal-red"
                                      : ""
                                  }
                                >
                                  <TableCell
                                    id={`ToxResultDataConfirmationAnalyte_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.testName}
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataConfirmationCutOff_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.referanceRange}
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataLinearity_${index + 1}`}
                                  >
                                    {i?.linearity}
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      id={`ToxResultDataConfirmationResultValue_${
                                        index + 1
                                      }`}
                                      type="text"
                                      className="form-control bg-transparent"
                                      value={i.results}
                                      onChange={(e) =>
                                        handleChangeConfirmation(
                                          index,
                                          "results",
                                          e.target.value,
                                          data?.analyteList
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        const regex = /^[0-9.]*$/;
                                        if (
                                          !(
                                            regex.test(e.key) ||
                                            e.key === "Backspace" ||
                                            e.key === "Tab"
                                          )
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      disabled={disable}
                                    />
                                  </TableCell>
                                  {filterData.tabId === 2 && (
                                    <TableCell>
                                      <input
                                        id={`ToxResultDataConfirmationComments_${
                                          index + 1
                                        }`}
                                        type="text"
                                        className="form-control bg-transparent"
                                        value={i.comments}
                                        onChange={(e) =>
                                          handleChangeConfirmation(
                                            index,
                                            "comments",
                                            e.target.value,
                                            data?.analyteList
                                          )
                                        }
                                        disabled={disable}
                                      />
                                    </TableCell>
                                  )}
                                  <TableCell
                                    id={`ToxResultDataConfirmationInterpretation_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.interpretation}
                                  </TableCell>
                                  <TableCell>
                                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                      <input
                                        id={`ToxResultDataConfirmationReRun_${
                                          index + 1
                                        }`}
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                          selectedBox?.confirmationIds?.includes(
                                            i.id
                                          ) || false
                                        }
                                        onChange={handleCheckBoxCheck(
                                          i,
                                          false,
                                          "ConfirmationTests"
                                        )}
                                      />
                                    </label>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
                <h5 className="m-0 text-info">{t("Validity")}</h5>
                {selectedBox?.validityTestIds?.length ? (
                  <button
                    id={`ToxResultDataExpandApplyReRun`}
                    className="btn btn-sm text-light"
                    style={{ background: "#702AFB" }}
                    onClick={() => ApplyRerun(selectedBox.validityTestIds)}
                  >
                    {t("Apply ReRun")}
                  </button>
                ) : null}
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="table_bordered overflow-hidden">
                  <TableContainer className="shadow-none">
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="plate-mapping-table mb-1"
                    >
                      <TableHead className="h-35px">
                        <TableRow>
                          <TableCell className="min-w-80px w-80px">
                            {t("Analyte")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Cutoff")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Result Value")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            {t("Interpretation")}
                          </TableCell>

                          <TableCell className="min-w-125px w-125px">
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                id={`ToxResultDataExpandScreeningReRun`}
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  validity?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length > 0 &&
                                  validity?.flatMap(
                                    (panel: any) => panel.analyteList
                                  )?.length ===
                                    selectedBox?.validityTestIds?.length
                                }
                                onChange={handleCheckBoxCheck(
                                  null,
                                  true,
                                  "ValidityTests"
                                )}
                              />
                              {t("Re-Run")}
                            </label>
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={5} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : validity && validity.length > 0 ? (
                          validity.map((data: any, controlsIndex: any) => (
                            <>
                              <TableRow className="">
                                <TableCell
                                  id={`ToxResultDataValidityPanelName_${
                                    controlsIndex + 1
                                  }`}
                                  colSpan={5}
                                  className="padding-0"
                                  style={{
                                    background: "#dbeacf",
                                  }}
                                >
                                  <span
                                    className="px-2 fw-bold"
                                    style={{ fontSize: "16px" }}
                                  >
                                    {data.panelName}
                                  </span>
                                </TableCell>
                              </TableRow>
                              {data?.analyteList?.map((i: any, index: any) => (
                                <TableRow
                                  key={i.id}
                                  className={
                                    i?.interpretation === "Positive"
                                      ? "bg-crititcal-red"
                                      : ""
                                  }
                                >
                                  <TableCell
                                    id={`ToxResultDataValidityAnalyte_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.testName}
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataValidityRefranceRange_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.referanceRange}
                                  </TableCell>
                                  <TableCell>
                                    <input
                                      id={`ToxResultDataValidityResultValue_${
                                        index + 1
                                      }`}
                                      type="text"
                                      className="form-control bg-transparent"
                                      value={i?.results}
                                      onChange={(e) =>
                                        handleChangeValidity(
                                          index,
                                          "results",
                                          e.target.value,
                                          data?.analyteList
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        const regex = /^[0-9.]*$/;
                                        if (
                                          !(
                                            regex.test(e.key) ||
                                            e.key === "Backspace" ||
                                            e.key === "Tab"
                                          )
                                        ) {
                                          e.preventDefault();
                                        }
                                      }}
                                      disabled={disable}
                                    />
                                  </TableCell>
                                  <TableCell
                                    id={`ToxResultDataValidityInterpretation_${
                                      index + 1
                                    }`}
                                  >
                                    {i?.interpretation}
                                  </TableCell>
                                  <TableCell>
                                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                      <input
                                        id={`ToxResultDataValidityReRun_${
                                          index + 1
                                        }`}
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                          selectedBox?.validityTestIds?.includes(
                                            i.id
                                          ) || false
                                        }
                                        onChange={handleCheckBoxCheck(
                                          i,
                                          false,
                                          "ValidityTests"
                                        )}
                                      />
                                    </label>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center">
                              {t("No validity data available")}
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
            style={{ border: "2px solid #ffc700" }}
          >
            <div className="card border">
              <div className="card-body py-md-4 py-3 px-4">
                <h6 className="text bold">{t("Comments")}</h6>
                <textarea
                  id="ToxResultDataExpandComments"
                  className="form-control  h-80px mt-2"
                  name="lisNotes"
                  rows={5}
                  value={reportNotes.lisNotes}
                  onChange={(e) =>
                    handleFieldChangeTextArea(e.target.value, "lisNotes")
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-2 py-4 d-flex mb-5 gap-2">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Result Data"
              permissionIdentifier="PublishAndValidate"
            >
              <button
                id="ToxResultDataExpandPublishAndValiDateBottom"
                className="btn btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-light"
                style={{ background: "#34C0FF" }}
                onClick={() =>
                  PublishAndValidate(requisitionId, requisitionOrderId)
                }
              >
                {isPublishing
                  ? `${t("Processing...")}`
                  : `${t("Publish & Validate")}`}
              </button>
            </PermissionComponent>
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Result Data"
              permissionIdentifier="Preview"
            >
              <LoadButton
                id="ToxResultDataExpandPreviewBottom"
                className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isPreviewing}
                btnText={t("Preview")}
                loadingText="Previewing"
                onClick={() =>
                  TOXLISReportView(
                    requisitionId,
                    requisitionOrderId,
                    facilityId
                  )
                }
              />
            </PermissionComponent>
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Result Data"
              permissionIdentifier="save"
            >
              <LoadButton
                id="ToxResultDataExpandSaveBottom"
                className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isSubmitting}
                btnText={t("Save")}
                loadingText={t("Saving")}
                onClick={() => SaveToxResultDataExpand()}
              />
            </PermissionComponent>
            <button
              id="ToxResultDataExpandCancelBottom"
              className="btn btn-sm btn-secondary fs-12px h-30px py-0 fw-500"
              onClick={handleClose}
            >
              {t("Cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDataExpandableRow;
