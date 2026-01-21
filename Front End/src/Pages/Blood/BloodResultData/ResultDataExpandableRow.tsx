import { IconButton } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import LoadButton from "../../../Shared/Common/LoadButton";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  reactSelectSMStyle,
  reactSelectSMStyle2,
  styles,
} from "../../../Utils/Common";
import { ReferenceLab } from "../BloodCompendium/Panel/Headers";
import { useBloodResultDataContext } from "./BloodResultDataContext";
import DraggableTests from "./DraggableTests";
import useLang from "Shared/hooks/useLanguage";
import NoRecord from "Shared/Common/NoRecord";
import FacilityService from "Services/FacilityService/FacilityService";
import {
  ApplyPrelim,
  BloodLISReportView,
  BloodResultDataRejectTest,
  BloodResultDataReRunTest,
  BloodResultDataTransferTest,
  BloodResultDataValidateTest,
  DeleteCriticalNote,
  GetCannedComments,
  GetCriticalNoteFormData,
  GetExpandData,
  SaveBloodResultDataExpand,
  SaveCriticalNote,
  SaveValidateBloodData,
  UnValidateData,
} from "Services/BloodLisResultData";

interface ExpandableI {
  requisitionOrderId: number;
  row: any;
  setReportCheckboxes: any;
  reportCheckboxes: any;
}

export interface OptionType {
  value: number; // Adjust type based on your data
  label: string;
}

interface TransferI {
  item1: number; // Adjust type based on your data
  item2: number;
}

interface RejectedI {
  item1: number; // Adjust type based on your data
  item2: number;
}

const ResultDataExpandableRow = (props: ExpandableI) => {
  const { t } = useLang();
  const { requisitionOrderId, row, setReportCheckboxes, reportCheckboxes } =
    props;
  const {
    filterData,
    loadGridData,
    data,
    rowsToExpand,
    setRowsToExpand,
    isMasterExpandTriggered,
  } = useBloodResultDataContext();

  const targetRef = useRef(null);
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bulkIds, setBulkIds] = useState<number[]>([]);
  const [expandData, setExpandData] = useState<any>([]);
  const [rejectedReason, setRejectReason] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [cannedComments, setCannedComments] = useState([]);
  const [transferList, setTransferList] = useState<TransferI[]>([]);
  const [rejectedList, setRejectedList] = useState<RejectedI[]>([]);
  const [allRejectedReason, setAllRejectReason] = useState<number>(0);
  const [showCriticalNotice, setShowCriticalNotice] = useState(false);
  const [referenceLab, setReferenceLab] = useState<ReferenceLab[]>([]);
  const [criticalNoticeData, setCriticalNoticeData] = useState<any>([]);

  const dispatch = useDispatch();

  const ModalhandleClose = () => {
    setShow(false);
    setAllRejectReason(0);
  };
  const ModalhandleClose1 = () => setShow1(false);
  const ModalhandleClose2 = () => setShow2(false);
  const ModalhandleCloseCriticalNotice = () => {
    setCriticalNoticeData([]);
    setShowCriticalNotice(false);
  };

  const handleClickOpen1 = () => {
    if (bulkIds.length === 0) {
      toast.error(t("Please select atleast one test"));
    } else {
      fetchReferenceLab();
      setShow1(true);
      setTransferList(bulkIds.map((id: number) => ({ item1: id, item2: 0 })));
    }
  };

  const handleClickOpen2 = () => {
    if (bulkIds.length === 0) {
      toast.error(t("Please select atleast one test"));
    } else {
      setShow2(true);
    }
  };

  const handleClickOpenCriticalNotice = () => {
    if (bulkIds.length === 1) {
      GetCriticalNoteFormDataApi(bulkIds[0]);
      setShowCriticalNotice(true);
    } else {
      toast.error(
        t("Please choose only one test at a time for the Critical Notice.")
      );
    }
  };

  const handleClickOpen = () => {
    if (bulkIds.length === 0) {
      toast.error(t("Please select atleast one test"));
    } else {
      GetCannedCommentsLookup("rejection");
      setShow(true);
      setRejectedList(bulkIds.map((id: number) => ({ item1: id, item2: 0 })));
    }
  };

  const SaveBloodExpandResultData = () => {
    setIsSubmitting(true);
    const sortedOrder = {
      ...expandData,
      panels: expandData.panels.map((panel: any) => ({
        ...panel,
        tests: panel.tests.map((test: any, index: number) => ({
          ...test,
          testSortOrder: index + 1,
        })),
      })),
    };
    SaveBloodResultDataExpand(sortedOrder)
      .then(async (res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setIsSubmitting(false);
          GetExpandDataById();
          loadGridData(false);
        } else {
          toast.error(t(res?.data?.message));
          setIsSubmitting(false);
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

  const BloodLISReport = () => {
    const row = {
      requisitionOrderId: requisitionOrderId,
      isPreview: true,
    };

    setIsPreviewing(true);
    BloodLISReportView(row)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          loadGridData(false);
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
        console.trace(err);
      });
  };

  const [isPublishing, setIsPublishing] = useState(false);
  const Validate = async () => {
    setIsPublishing(true);

    const obj = {
      reqOrderId: requisitionOrderId,
      selectedTests: bulkIds,
    };
    if (bulkIds.length > 0) {
      BloodResultDataValidateTest(obj)
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(t(res?.data?.message));
            GetExpandDataById();
            setIsPublishing(false);
            loadGridData(false);
          } else {
            toast.error(t(res?.data?.message));
            setIsPublishing(false);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t("Please select at least one test."));
      setIsPublishing(false);
    }
  };

  const [isPrelim, setIsPrelim] = useState(false);
  const Prelim = async () => {
    setIsPrelim(true);

    if (row.LisStatus.toLowerCase() === "preliminary") {
      ApplyPrelim(requisitionOrderId)
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(res?.data?.message);
            GetExpandDataById();
            setIsPrelim(false);
            loadGridData(false);
          } else {
            toast.error(t(res?.data?.message));
            setIsPrelim(false);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t("Record LIS status is not preliminary."));
      setIsPrelim(false);
    }
  };

  const UnValidate = async () => {
    UnValidateData([requisitionOrderId])
      .then((res: AxiosResponse) => {
        if (res?.data.status === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(false);
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const SaveAndValidate = async () => {
    if (bulkIds.length === 0) {
      toast.error(t("Please select atleast one test"));
      return;
    }

    const sortedOrder = {
      ...expandData,
      panels: expandData.panels.map((panel: any) => ({
        ...panel,
        tests: panel.tests.map((test: any, index: number) => ({
          ...test,
          testSortOrder: index + 1,
        })),
      })),
    };

    const row = {
      requisitionOrderId: requisitionOrderId,
      isPreview: false,
      isCorrectedReport: reportCheckboxes.isCorrectedReport,
      isAmendedReport: reportCheckboxes.isAmendedReport,
    };

    const payload = {
      save: sortedOrder,
      validate: {
        reqOrderId: requisitionOrderId,
        selectedTests: bulkIds,
      },
    };

    SaveValidateBloodData(payload)
      .then(async (res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          const response: AxiosResponse = await BloodLISReportView(row);
          if (response?.data.statusCode === 200) {
            toast.success(response?.data?.message);
          } else if (response?.data.statusCode === 400) {
            toast.error(response?.data?.message);
          }
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => {
        GetExpandDataById();
        loadGridData(false);
      });
  };

  const [isRerun, setIsRerun] = useState(false);
  const ApplyReRun = async () => {
    setIsRerun(true);
    BloodResultDataReRunTest(bulkIds)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          GetExpandDataById();
          setIsRerun(false);
          loadGridData(false);
          setShow2(false);
        } else {
          toast.error(t(res?.data?.message));
          setIsRerun(false);
          setShow2(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  //Critical Notice Save API Call
  const CriticalNoticeSave = () => {
    if (criticalNoticeData.notifyTo && criticalNoticeData.readBack) {
      SaveCriticalNote({
        ...criticalNoticeData,
        requisitionOrderId: requisitionOrderId,
      })
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(t(res?.data?.message));
            GetExpandDataById();
            setShowCriticalNotice(false);
            loadGridData(false);
          } else {
            toast.error(t(res?.data?.message));
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t("Please fill the required fields."));
      setIsRerun(false);
    }
  };
  //Transfer API Call
  const Transfer = () => {
    const selectAllLabs = transferList.filter(
      (item: TransferI) => item.item2 === 0
    );

    if (selectAllLabs.length === 0) {
      BloodResultDataTransferTest(transferList)
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(t(res?.data?.message));
            GetExpandDataById();
            setShow1(false);
            loadGridData(false);
          } else if (res?.data.statusCode === 400) {
            toast.error(t(res?.data?.message));
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t("Please select lab for all the tests."));
      setIsRerun(false);
    }
  };

  //Reject APi Call
  const Reject = () => {
    const selectAllReason = rejectedList.filter(
      (item: RejectedI) => item.item2 === 0
    );

    if (selectAllReason.length === 0) {
      BloodResultDataRejectTest(rejectedList)
        .then((res: AxiosResponse) => {
          if (res?.data.statusCode === 200) {
            toast.success(t(res?.data?.message));
            GetExpandDataById();
            setShow(false);
            setAllRejectReason(0);
            loadGridData(false);
          }
          if (res?.data.statusCode === 400) {
            toast.error(t(res?.data?.message));
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t("Please select reason for all the tests."));
      setIsRerun(false);
    }
  };

  const handleFieldChange = (value: any, name: any) => {
    setExpandData((data: any) => {
      return {
        ...data,
        [name]: value,
      };
    });
    if (name === "isCorrected") {
      setReportCheckboxes((prev: any) => ({
        ...prev,
        isCorrectedReport: value,
      }));
    }
    if (name === "isAmended") {
      setReportCheckboxes((prev: any) => ({
        ...prev,
        isAmendedReport: value,
      }));
    }
  };

  //LookUp APi calls
  const fetchReferenceLab = async () => {
    try {
      const res: AxiosResponse = await FacilityService.referenceLabLookup();

      const referenceArray: ReferenceLab[] =
        res?.data?.data?.map((val: any) => ({
          value: val?.labId,
          label: val?.labDisplayName,
        })) || [];
      setReferenceLab(referenceArray);
    } catch (err: any) {
      console.error(t("Error fetching reference labs:"), err.message);
    }
  };

  const GetCriticalNoteFormDataApi = async (id: number) => {
    const test = expandData?.panels
      ?.find((panel: any) => panel.tests.some((test: any) => test.id === id))
      ?.tests.find((test: any) => test.id === id);
    try {
      const res: AxiosResponse = await GetCriticalNoteFormData(test.testId);
      setCriticalNoticeData(res?.data?.data);
    } catch (err: any) {
      console.error(t("Error fetching reference labs:"), err.message);
    }
  };

  const RemoveNote = async (id: number) => {
    try {
      const res: AxiosResponse = await DeleteCriticalNote(id);
      if (res?.data.statusCode === 200) {
        toast.success(t(res?.data?.message));
        GetExpandDataById();
        loadGridData(false);
      } else {
        toast.error(t(res?.data?.message));
      }
    } catch (error) {
      console.error("Error removing note:", error);
    }
  };

  const GetExpandDataById = async () => {
    setLoading(true);

    GetExpandData(requisitionOrderId)
      .then((res: any) => {
        const panelsData = res?.data?.data;
        const sortedTests = {
          ...panelsData,
          panels: panelsData.panels.map((panel: any) => ({
            ...panel,
            tests: panel.tests.sort(
              (a: any, b: any) => a.testSortOrder - b.testSortOrder
            ),
          })),
        };

        setExpandData(sortedTests);
        setBulkIds([]);
        setLoading(false);
        setReportCheckboxes(() => ({
          isCorrectedReport: res?.data?.data?.isCorrected,
          isAmendedReport: res?.data?.data?.isAmended,
        }));
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  useEffect(() => {
    GetExpandDataById();
  }, []);

  const GetCannedCommentsLookup = async (name: string) => {
    GetCannedComments(name)
      .then((res: any) => {
        if (name === "canned") {
          setCannedComments(res.data);
        } else {
          setRejectReason(res.data);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const handleSelectAll = (checked: boolean, panelIndex: number) => {
    if (!checked) {
      const newIds = expandData.panels[panelIndex].tests.map(
        (row: any) => row.id
      );

      const remainingIds = bulkIds.filter((id) => !newIds.includes(id));
      setBulkIds(remainingIds);
    } else {
      setBulkIds((ids) => {
        const newIds = expandData.panels[panelIndex].tests.map(
          (row: any) => row.id
        );
        const uniqueIds = new Set([...ids, ...newIds]); // Ensure uniqueness
        return Array.from(uniqueIds); // Convert Set back to an array
      });
    }
  };

  const handlePanelSelectAll = (checked: boolean) => {
    if (!checked) {
      setBulkIds([]);
    } else {
      setBulkIds(
        expandData.panels.flatMap((panel: any) =>
          panel.tests.map((test: any) => test.id)
        )
      );
    }
  };

  const handleIdsSelections = (id: number) => {
    setBulkIds((prevIds: number[]) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((existingId) => existingId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  useEffect(() => {
    GetCannedCommentsLookup("canned");
  }, []);

  const handleChange = (
    name: string,
    value: any,
    panelIndex: number,
    testIndex: number
  ) => {
    setExpandData((prev: any) => ({
      ...prev,
      panels: prev.panels.map((panel: any, pIndex: number) =>
        pIndex === panelIndex
          ? {
              ...panel,
              tests: panel.tests.map((test: any, tIndex: number) =>
                tIndex === testIndex ? { ...test, [name]: value } : test
              ),
            }
          : panel
      ),
    }));
  };

  let testIdLength = 0;
  expandData?.panels?.forEach((panel: any) =>
    panel.tests.forEach((_: any) => (testIdLength += 1))
  );

  const handleTransfer = (event: any, index: number) => {
    if (event.value) {
      setTransferList((prevList) =>
        prevList.map((item, idx) =>
          idx === index ? { ...item, item2: event.value } : item
        )
      );
    }
  };

  const handleReject = (event: any, index: number) => {
    if (event.value) {
      setRejectedList((prevList) =>
        prevList.map((item, idx) =>
          idx === index ? { ...item, item2: event.value } : item
        )
      );
    }
  };

  const handleAllSelectReason = (event: OptionType) => {
    setAllRejectReason(event.value);
    setRejectedList((prevVal) =>
      prevVal.map((item) => ({
        ...item,
        item2: event.value,
      }))
    );
  };

  useEffect(() => {
    if (!targetRef.current || !isMasterExpandTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const allData = data.gridData;
          const lastElement = rowsToExpand[rowsToExpand.length - 1];

          const lastIndex = allData.findIndex(
            (item: any) => item.RequisitionOrderId === lastElement
          );

          // Get next 5 elements after lastElement
          const nextFiveIds = allData
            .slice(lastIndex + 1, lastIndex + 4)
            .map((item: any) => item.RequisitionOrderId);

          setRowsToExpand((prev: any) => [...prev, ...nextFiveIds]);

          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    observer.observe(targetRef.current);

    return () => {
      observer.disconnect();
    };
  }, [targetRef.current]);

  // Code for scroll bar for the inner tables.
  return (
    <div
      ref={
        rowsToExpand.length > 0 &&
        row?.RequisitionOrderId === rowsToExpand[rowsToExpand.length - 2]
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
          <h5 className="mb-2">{t("Result")}</h5>
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center mt-3">
            <div className="align-items-center d-flex mb-md-3 mb-3 gap-2 flex-wrap">
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="Save"
              >
                <LoadButton
                  id={`BloodResultDataExpandSave`}
                  className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isSubmitting}
                  btnText={t("Save")}
                  loadingText={t("Saving")}
                  onClick={() => SaveBloodExpandResultData()}
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="Preview"
              >
                <LoadButton
                  id={`BloodResultDataExpandPreview`}
                  className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                  loading={isPreviewing}
                  btnText={t("Preview")}
                  loadingText={t("Previewing")}
                  onClick={() => BloodLISReport()}
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="Validate"
              >
                <LoadButton
                  id={`BloodResultDataExpandValiDate`}
                  className="btn btn-excle btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isPublishing}
                  btnText={t("Validate")}
                  loadingText={t("Validating.....")}
                  disabled={props?.row?.RequisitionStatus === "On Hold"}
                  onClick={async () => {
                    await Validate();
                  }}
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="Transfer"
              >
                <LoadButton
                  id={`BloodResultDataExpandTransfer`}
                  className="btn btn-setting btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                  btnText={t("Transfer")}
                  loadingText={t("Transfer...")}
                  onClick={() => handleClickOpen1()}
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="Reject"
              >
                <LoadButton
                  id={`BloodResultDataExpandReject`}
                  className="btn btn-danger btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                  btnText={t("Reject")}
                  loadingText={t("Rejecting...")}
                  onClick={() => handleClickOpen()}
                />
              </PermissionComponent>
              {filterData.tabId === 1 ? (
                <PermissionComponent
                  moduleName="Blood LIS"
                  pageName="Result Data"
                  permissionIdentifier="Re-Run"
                >
                  <LoadButton
                    id={`BloodResultDataExpandReRun`}
                    className="btn btn-info btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                    loading={isRerun}
                    btnText={t("Re-run")}
                    loadingText={t("Reruning...")}
                    onClick={() => handleClickOpen2()}
                  />
                </PermissionComponent>
              ) : null}
              {filterData.tabId === 1 ? (
                <PermissionComponent
                  moduleName="Blood LIS"
                  pageName="Result Data"
                  permissionIdentifier="Prelim"
                >
                  <LoadButton
                    id={`BloodResultDataExpandPrelim`}
                    className="btn btn-linkedin btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                    loading={isPrelim}
                    disabled={props?.row?.RequisitionStatus === "On Hold"}
                    btnText={t("Prelim")}
                    loadingText={t("Previewing")}
                    onClick={() => Prelim()}
                  />
                </PermissionComponent>
              ) : null}
              <PermissionComponent
                moduleName="Blood LIS"
                pageName="Result Data"
                permissionIdentifier="CriticalNotice"
              >
                <LoadButton
                  id={`BloodResultDataExpandCriticalNotice`}
                  className="btn btn-dark-brown btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                  loading={isPrelim}
                  // disabled={props?.row?.RequisitionStatus === "On Hold"}
                  btnText={t("Critical Notice")}
                  loadingText={t("Critical Notice")}
                  onClick={() => handleClickOpenCriticalNotice()}
                />
              </PermissionComponent>
              {filterData.tabId === 2 ? (
                <>
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="Result Data"
                    permissionIdentifier="CorrectedReport"
                  >
                    <button
                      className="btn btn-secondary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                      onClick={() => UnValidate()}
                    >
                      Un-Validate
                    </button>
                  </PermissionComponent>
                </>
              ) : null}
              {filterData.tabId === 1 ? (
                <>
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="Result Data"
                    permissionIdentifier="Save,Validate,Report"
                  >
                    <button
                      className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                      onClick={SaveAndValidate}
                    >
                      Save, Validate & Report
                    </button>
                  </PermissionComponent>
                </>
              ) : null}
              {filterData.tabId === 2 ? (
                <>
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="Result Data"
                    permissionIdentifier="CorrectedReport"
                  >
                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                      <input
                        id={`BloodResultDataExpandCorrectReport`}
                        className="form-check-input"
                        type="checkbox"
                        checked={reportCheckboxes.isCorrectedReport}
                        onChange={(e) =>
                          handleFieldChange(e.target.checked, "isCorrected")
                        }
                      />
                      {t("Corrected Report")}
                    </label>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Blood LIS"
                    pageName="Result Data"
                    permissionIdentifier="AmmendedReport"
                  >
                    <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                      <input
                        id={`BloodResultDataExpandAmendedReport`}
                        className="form-check-input"
                        type="checkbox"
                        checked={reportCheckboxes.isAmendedReport}
                        onChange={(e) =>
                          handleFieldChange(e.target.checked, "isAmended")
                        }
                      />
                      {t("Amended Report")}
                    </label>
                  </PermissionComponent>
                </>
              ) : null}
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
              <h5 className="m-0 text-info">{t("Patient Test Results")}</h5>
            </div>
            <div className="card border">
              <div className="card-body py-md-4 py-3 px-4">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="table_bordered overflow-hidden position-relative">
                    <TableContainer className="shadow-none">
                      <Table
                        stickyHeader
                        aria-label="sticky table collapsible"
                        className="plate-mapping-table mb-1"
                      >
                        <TableHead className="h-40px">
                          <TableRow>
                            <TableCell className="min-w-40px w-40px">
                              <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                <input
                                  id={`BloodResultDataExpandCheckAll`}
                                  className="form-check-input"
                                  type="checkbox"
                                  checked={
                                    bulkIds.length === 0
                                      ? false
                                      : bulkIds.length === testIdLength
                                        ? true
                                        : false
                                  }
                                  onChange={(e) =>
                                    handlePanelSelectAll(e.target.checked)
                                  }
                                />
                              </label>
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Test Name")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Previous Value")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Result Value")}
                            </TableCell>
                            <TableCell className="min-w-75px w-75px">
                              {t("Normalization")}
                            </TableCell>
                            <TableCell className="min-w-75px w-75px">
                              {t("Reference")}
                            </TableCell>
                            <TableCell className="min-w-60px w-60px">
                              {t("Units")}
                            </TableCell>
                            <TableCell className="min-w-50px w-50px">
                              {t("Flag")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Canned Comments")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Labs Comments")}
                            </TableCell>
                            <TableCell className="min-w-125px w-125px">
                              {t("Performing Labs")}
                            </TableCell>
                            <TableCell className="min-w-150px w-150px">
                              {t("Validate By and Date")}
                            </TableCell>
                            <TableCell className="min-w-100px w-100px">
                              {t("Test Status")}
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody className="scroll-start">
                          {loading ? (
                            <TableCell colSpan={11} className="py-3">
                              <Loader />
                            </TableCell>
                          ) : expandData?.panels?.length > 0 ? (
                            expandData?.panels?.map(
                              (panel: any, panelIndex: number) => (
                                <>
                                  <TableRow key={panel.panelId}>
                                    <TableCell className="min-w-40px">
                                      <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                        <input
                                          id={`BloodResultDataExpandMetabolicCheckBox_${
                                            panelIndex + 1
                                          }`}
                                          className="form-check-input"
                                          type="checkbox"
                                          checked={panel.tests.every(
                                            (test: any) =>
                                              bulkIds.includes(test.id)
                                          )}
                                          onChange={(e) =>
                                            handleSelectAll(
                                              e.target.checked,
                                              panelIndex
                                            )
                                          }
                                        />
                                      </label>
                                    </TableCell>
                                    <TableCell
                                      className="fw-bolder fs-5"
                                      colSpan={11}
                                    >
                                      {t(panel.panelName)}
                                    </TableCell>
                                  </TableRow>
                                  <DraggableTests
                                    bulkIds={bulkIds}
                                    handleChange={handleChange}
                                    panelIndex={panelIndex}
                                    cannedComments={cannedComments}
                                    handleIdsSelections={handleIdsSelections}
                                    panel={panel}
                                    setExpandData={setExpandData}
                                  />
                                </>
                              )
                            )
                          ) : (
                            <NoRecord
                              message="No test assigned to this record"
                              colSpan={11}
                            />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5">
            <div className="card border">
              <div className="card-body py-md-4 py-3 px-4">
                <label htmlFor="reportComments" className="fw-bolder">
                  {t("Report Comments:")}
                </label>
                <textarea
                  id="reportComments"
                  className="form-control h-50px mt-2 rounded"
                  name="reportComments"
                  rows={3}
                  value={expandData.reportComments}
                  onChange={(e) =>
                    handleFieldChange(e.target.value, "reportComments")
                  }
                />
                <div className="mt-3"></div>
                <label htmlFor="criticalNotice" className="fw-bolder">
                  {t("Critical Notice:")}
                </label>
                <textarea
                  id="criticalNotice"
                  className="form-control h-50px mt-2 rounded"
                  name="criticalNotice"
                  rows={3}
                  value={expandData.criticalNotice}
                  onChange={(e) =>
                    handleFieldChange(e.target.value, "criticalNotice")
                  }
                />
                <div className="mt-3"></div>
                <label htmlFor="internalNotes" className="fw-bolder">
                  {t("Internal Notes:")}
                </label>
                <textarea
                  id="internalNotes"
                  className="form-control h-80px mt-2 rounded"
                  name="internalNotes"
                  rows={5}
                  value={expandData.internalNotes}
                  onChange={(e) =>
                    handleFieldChange(e.target.value, "internalNotes")
                  }
                />
              </div>
            </div>
          </div>
          {/* Critical Notice Section */}
          {expandData?.bloodCriticalNotes?.length > 0 && (
            <div
              className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
              style={{ border: "1px solid #8B0000" }}
            >
              <div
                className="card-header bg-light-brown d-flex justify-content-between align-items-center px-4 min-h-40px"
                style={{ backgroundColor: "#e8b7b7" }}
              >
                <h6 className="m-0" style={{ color: "#8B0000" }}>
                  {t("Critical Notice")}
                </h6>
              </div>
              <div
                className="p-4"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "20px",
                }}
              >
                {expandData?.bloodCriticalNotes?.map(
                  (item: any, index: number) => (
                    // NEW wrapper div per item - no overflow hidden here
                    <div
                      key={index}
                      style={{
                        position: "relative" /* relative for absolute icon */,
                        overflow: "visible",
                      }}
                    >
                      <IconButton
                        sx={{
                          height: "20px",
                          width: "20px",
                          borderRadius: "5px",
                          position: "absolute",
                          right: "-8px",
                          top: "-8px",
                          zIndex: 9999,
                        }}
                        className="bg-light-danger"
                        color="error"
                        onClick={() => RemoveNote(item.id)} // example remove function
                      >
                        <i className="fa fa-close text-danger"></i>
                      </IconButton>

                      {/* Keep the table_bordered with overflow hidden and border */}
                      <div className="table_bordered overflow-hidden position-relative">
                        <TableContainer className="shadow-none">
                          <Table
                            stickyHeader
                            aria-label="sticky table collapsible"
                            className="plate-mapping-table mb-1"
                          >
                            <TableBody>
                              <TableRow>
                                <TableCell>Test</TableCell>
                                <TableCell>{item.testName}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>{item.date}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>Time</TableCell>
                                <TableCell>{item.time}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Responsible Individual Communicating the
                                  Results
                                </TableCell>
                                <TableCell>{item.notifyBy}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>
                                  Person Notified (Full Name)
                                </TableCell>
                                <TableCell>{item.notifyTo}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>ReadBack Complete</TableCell>
                                <TableCell>{item.readBack}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell
                                  colSpan={2}
                                  className="text-center fw-bold"
                                >
                                  {item.note}
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          )}

          <div className="mt-2 py-4 d-flex mb-5 gap-2">
            <PermissionComponent
              moduleName="Blood LIS"
              pageName="Result Data"
              permissionIdentifier="Validate"
            >
              <LoadButton
                id={`BloodResultDataExpandValidateBottom`}
                className="btn btn-excle btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isPublishing}
                btnText={t("Validate")}
                disabled={props?.row?.RequisitionStatus === "On Hold"}
                loadingText={t("Validating.....")}
                onClick={async () => {
                  await Validate();
                }}
              />
            </PermissionComponent>
            <PermissionComponent
              moduleName="Blood LIS"
              pageName="Result Data"
              permissionIdentifier="Preview"
            >
              <LoadButton
                id={`BloodResultDataExpandPrevireBottom`}
                className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                loading={isPreviewing}
                btnText={t("Preview")}
                loadingText={t("Previewing")}
                onClick={() => BloodLISReport()}
              />
            </PermissionComponent>
            <PermissionComponent
              moduleName="Blood LIS"
              pageName="Result Data"
              permissionIdentifier="Save"
            >
              <LoadButton
                id={`BloodResultDataExpandSaveBottom`}
                className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isSubmitting}
                btnText={t("Save")}
                loadingText={t("Saving")}
                onClick={() => SaveBloodExpandResultData()}
              />
            </PermissionComponent>
          </div>
        </div>
      </div>
      {/* Transfer Tests Modal */}
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t("Transfer Tests")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table_bordered overflow-hidden position-relative">
            <TableContainer
              className="shadow-none"
              //  ref={div2Ref}
            >
              <Table
                // ref={div4Ref}
                stickyHeader
                aria-label="sticky table collapsible"
                className="plate-mapping-table mb-1"
              >
                <TableHead className="h-40px">
                  <TableRow>
                    <TableCell className="min-w-125px w-125px">
                      {t("Test")}
                    </TableCell>
                    <TableCell className="min-w-250px w-250px">
                      {t("Transfer to Lab")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bulkIds?.map((id: number, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {expandData.panels.flatMap((panel: any) =>
                            panel.tests.map((test: any) =>
                              test.id === id ? test.testName : null
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            name="performingLab"
                            menuPortalTarget={document.body}
                            options={referenceLab} // Ensure options have the correct type
                            theme={(theme) => styles(theme)}
                            onChange={(e) => handleTransfer(e, index)}
                            value={referenceLab?.find(
                              (option) =>
                                option.value === transferList[index]?.item2
                            )}
                            isSearchable={true}
                            styles={reactSelectSMStyle2("25px")}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => Transfer()}
          >
            {t("Transfer")}
          </button>
        </Modal.Footer>
      </Modal>
      {/* Critical Notice Modal */}
      <Modal
        show={showCriticalNotice}
        onHide={ModalhandleCloseCriticalNotice}
        // backdrop="static"
        keyboard={false}
        // size="lg"
      >
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t("Critical Notice")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="table_bordered overflow-hidden position-relative">
            <TableContainer
              className="shadow-none"
              //  ref={div2Ref}
            >
              <Table
                // ref={div4Ref}
                stickyHeader
                aria-label="sticky table collapsible"
                className="plate-mapping-table mb-1"
              >
                <TableBody>
                  <TableRow>
                    <TableCell>Test</TableCell>
                    <TableCell className="h-30px">
                      {criticalNoticeData.testName}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>
                      <input
                        // id={`BloodResultDataExpandDate_${testIndex + 1}`}
                        name="date"
                        className="form-control h-30px"
                        value={criticalNoticeData.date}
                        disabled={true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Time</TableCell>
                    <TableCell>
                      <input
                        // id={`BloodResultDataExpandTime_${testIndex + 1}`}
                        name="time"
                        className="form-control h-30px"
                        value={criticalNoticeData.time}
                        disabled={true}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      Responsible Individual Communicating the Results
                    </TableCell>
                    <TableCell className="h-30px">
                      {criticalNoticeData.notifyBy}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="required">
                      Person Notified (Full Name)
                    </TableCell>
                    <TableCell>
                      <input
                        // id={`BloodResultDataExpandPersonNotified_${testIndex + 1}`}
                        name="notifyTo"
                        className="form-control h-30px"
                        value={criticalNoticeData.notifyTo}
                        // disabled={true}
                        onChange={(e) =>
                          setCriticalNoticeData((prev: any) => ({
                            ...prev,
                            notifyTo: e.target.value,
                          }))
                        }
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="required">
                      ReadBack Complete
                    </TableCell>
                    <TableCell>
                      <input
                        // id={`BloodResultDataExpandReadBackComplete_${testIndex + 1}`}
                        name="readBackComplete"
                        className="form-control h-30px"
                        type="text"
                        value={criticalNoticeData.readBack}
                        onChange={(e) =>
                          setCriticalNoticeData((prev: any) => ({
                            ...prev,
                            readBack: e.target.value,
                          }))
                        }
                        // disabled={true}
                      />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={ModalhandleCloseCriticalNotice}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => CriticalNoticeSave()}
          >
            {t("Save")}
          </button>
        </Modal.Footer>
      </Modal>
      {/* Rejected Reason Modal */}
      <Modal
        show={show}
        onHide={ModalhandleClose}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t("Rejected Reason")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-between flex-wrap pb-4 gap-2">
            <span className="fw-bold">
              {t("Select rejected reasons for all the tests:")}
            </span>
            <div>
              <Select
                name="rejectedId"
                menuPortalTarget={document.body}
                options={rejectedReason} // Ensure options have the correct type
                theme={(theme) => styles(theme)}
                onChange={(e: any) => handleAllSelectReason(e)}
                value={rejectedReason?.find(
                  (option: OptionType) => option.value === allRejectedReason
                )}
                isSearchable={true}
                styles={reactSelectSMStyle}
                className="w-175px"
              />
            </div>
          </div>
          <div className="table_bordered overflow-hidden position-relative">
            <TableContainer
              className="shadow-none"
              //  ref={div2Ref}
            >
              <Table
                // ref={div4Ref}
                stickyHeader
                aria-label="sticky table collapsible"
                className="plate-mapping-table mb-1"
              >
                <TableHead className="h-40px">
                  <TableRow>
                    <TableCell className="min-w-125px w-125px">
                      {t("Test")}
                    </TableCell>
                    <TableCell className="min-w-250px w-250px">
                      {t("Rejected Reason")}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bulkIds?.map((id: number, index: number) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          {expandData.panels.flatMap((panel: any) =>
                            panel.tests.map((test: any) =>
                              test.id === id ? test.testName : null
                            )
                          )}
                        </TableCell>
                        <TableCell>
                          <Select
                            name="rejectedId"
                            menuPortalTarget={document.body}
                            options={rejectedReason as OptionType[]} // Ensure options have the correct type
                            theme={(theme) => styles(theme)}
                            onChange={(e) => handleReject(e, index)}
                            value={rejectedReason?.find(
                              (option: OptionType) =>
                                option.value === rejectedList[index]?.item2
                            )}
                            isSearchable={true}
                            styles={reactSelectSMStyle2("25px")}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => Reject()}
          >
            {t("Reject")}
          </button>
        </Modal.Footer>
      </Modal>
      {/* Apply Rerun Modal */}
      <Modal
        show={show2}
        onHide={ModalhandleClose2}
        // backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t("Apply Re-run")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="d-flex align-items-center justify-content-between flex-wrap pb-4 gap-2">
            <span>{t("Are you sure ! you want to Re-Run?")}</span>
          </div>
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={ModalhandleClose2}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={() => ApplyReRun()}
          >
            {t("Re-run")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultDataExpandableRow;
