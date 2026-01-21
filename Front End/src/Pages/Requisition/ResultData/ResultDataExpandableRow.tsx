import { Button } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { memo, useEffect, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { toast } from "react-toastify";
import { Modal } from "react-bootstrap";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import LoadButton from "../../../Shared/Common/LoadButton";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent, {
  PermissionObject,
} from "../../../Shared/Common/Permissions/PermissionComponent";
import { useResultDataContext } from "../../../Shared/ResultDataContext";
import { stylesResultData } from "../../../Utils/Common";
import useLang from "Shared/hooks/useLanguage";
import { closeMenuOnScroll } from "Pages/Blood/BloodCompendium/Test/Shared";

interface ExpandableI {
  row: any;
  requisitionId: number;
  reqTypeId: number;
  requisitionOrderId: number;
  PathogensList: any[];
  facilityId: number;
}

export const ampStatusDropDown = [
  {
    value: "amp",
    label: "Amp",
  },
  {
    value: "no amp",
    label: "No Amp",
  },
];

const ResultDataExpandableRow = (props: ExpandableI) => {
  const {
    row,
    requisitionId,
    reqTypeId,
    requisitionOrderId,
    PathogensList,
    facilityId,
  } = props;

  const initialMainCheckboxes = {
    controlCheckbox: [],
    organismCheckbox: [],
    resistanceCheckbox: [],
  };

  // const pathogensDropDown = [
  //   {
  //     value: "Detected",
  //     label: "Detected",
  //   },
  //   {
  //     value: "Not Detected",
  //     label: "Not Detected",
  //   },
  // ];

  const controlsDropDown = [
    {
      value: "Pass",
      label: "Pass",
    },
    {
      value: "Fail",
      label: "Fail",
    },
  ];

  const {
    data,
    loadGridData,
    filterData,
    rowsToExpand,
    setRowsToExpand,
    isMasterExpandTriggered,
  } = useResultDataContext();

  const { t } = useLang();

  const dispatch = useDispatch();
  const [bar, setBar] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [configs, setConfigs] = useState<any>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);
  const renderedControls: { [key: string]: boolean } = {};
  const renderedOrganisms: { [key: string]: boolean } = {};
  const [mControlsList, setMControlsList] = useState<any>([]);
  const [isReRunCheckBox, setIsReRunCheckBox] = useState(false);
  const [mPathogensList, setMPathogensList] = useState<any>([]);
  const [mainCheckboxes, setMainCheckboxes] = useState(initialMainCheckboxes);
  // const [isVisible, setIsVisible] = useState(false);
  const targetRef = useRef(null);
  const [reportNotes, setReportNotes] = useState<any>({
    lisNotes: "",
    criticalReport: "",
  });

  const [reportCheckboxes, setReportCheckboxes] = useState({
    isCorrected: false,
    isAmended: false,
  });

  const allowedKeys: string[] = [
    "Backspace",
    "Tab",
    "+",
    "-",
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ];
  const ModalhandleClose = () => setShow(false);

  const isNumericKey = (key: string): boolean => {
    return /^[0-9.]$/.test(key) || allowedKeys.includes(key);
  };

  const changeControlsStatus = (Status: string) => {
    const r = {
      status: Status,
      controls: mControlsList,
    };
    RequisitionType.ChangeControlStatus(r)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          GetExpandDataById(requisitionOrderId);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const ChangeOrganismStatus = (
    status: string,
    item: any,
    itemIndex: number
  ): void => {
    const shouldUpdateCtValue = (
      ctValue: string | null | undefined,
      status: string
    ): boolean => {
      if (status === "Invalid") {
        return true; // Update all values for Invalid
      }
      return ctValue === "" || ctValue === null; // Only update empty/null for other statuses
    };

    const updateCtValues = (items: any[], newCtValue: string): any[] => {
      return items?.map((data: any) => ({
        ...data,
        ctValue: shouldUpdateCtValue(data.ctValue, newCtValue)
          ? newCtValue
          : data.ctValue,
      }));
    };

    const updatePathogensListLocally = (newCtValue: string): void => {
      const updatedPathogensList = [...mPathogensList];
      const currentItem = updatedPathogensList[itemIndex];

      updatedPathogensList[itemIndex] = {
        ...currentItem,
        resistance: updateCtValues(currentItem.resistance, newCtValue),
        organisms: updateCtValues(currentItem.organisms, newCtValue),
      };

      setMPathogensList(updatedPathogensList);
    };

    const updateStatusViaApi = async (): Promise<void> => {
      const requestPayload = {
        status,
        pathogens: item,
      };

      try {
        const response =
          await RequisitionType.ChangeOrganismStatus(requestPayload);

        if (response?.data?.statusCode === 200) {
          toast.success(t(response.data.message));
          await GetExpandDataById(requisitionOrderId);
        }
      } catch (error) {
        console.error("Error changing organism status:", error);
      }
    };

    // Main logic
    if (status === "Undetermined" || status === "Invalid") {
      updatePathogensListLocally(status);
    } else {
      updateStatusViaApi();
    }
  };

  const SaveIdResultDataExpand = () => {
    const row = {
      requisitionOrderId: requisitionOrderId,
      controls: mControlsList,
      pathogens: mPathogensList,
      lisNotes: reportNotes?.lisNotes,
      criticalReport: reportNotes?.criticalReport,
    };
    setIsSubmitting(true);
    RequisitionType.SaveIdResultDataExpand(row)
      .then(async (res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setIsSubmitting(false);
          await loadGridData(false);
          GetExpandDataById(requisitionOrderId);
        }
      })
      .catch((err: any) => {
        setIsSubmitting(false);
        console.trace(err);
      });
  };

  const ApplyRerun = () => {
    const row = {
      requisitionOrderId: requisitionOrderId,
      reqTypeId: reqTypeId,
      controls: mControlsList,
      pathogens: mPathogensList,
    };
    setIsReRunCheckBox(true);
    RequisitionType.ApplyRerun(row)
      .then(async (res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          await loadGridData(false);
          GetExpandDataById(requisitionOrderId);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => {
        setIsReRunCheckBox(false);
        setBar(false);
        setMainCheckboxes(initialMainCheckboxes);
      });
  };

  const GenerateBlanksAgainstReqOrderId = () => {
    RequisitionType.GenerateBlanksAgainstReqOrderId(requisitionOrderId)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          GetExpandDataById(requisitionOrderId);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const handleFieldChange = (
    panelIndex: any,
    Index: any,
    field: any,
    value: any,
    type: string
  ) => {
    const updatedPathogensList = [...mPathogensList];
    if (type === "resistance") {
      const resistanceToUpdate =
        updatedPathogensList[panelIndex]?.resistance?.[Index];
      if (resistanceToUpdate) {
        if (field === "isReRun") {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              resistanceCheckbox: [
                ...pre.resistanceCheckbox,
                resistanceToUpdate.id,
              ],
            };
          });
        }
        resistanceToUpdate[field] = value;
        if (field === "isReRun" && value === false) {
          setMainCheckboxes((prev: any) => {
            return {
              ...prev,
              resistanceCheckbox: prev.resistanceCheckbox.filter(
                (id: any) => id !== resistanceToUpdate.id
              ),
            };
          });
        }
      }
    } else {
      const organismToUpdate =
        updatedPathogensList[panelIndex]?.organisms?.[Index];
      if (organismToUpdate) {
        if (field === "isReRun") {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              organismCheckbox: [...pre.organismCheckbox, organismToUpdate.id],
            };
          });
        }
        organismToUpdate[field] = value === "" ? null : value;
        if (field === "isReRun" && value === false) {
          setMainCheckboxes((prev: any) => {
            return {
              ...prev,
              organismCheckbox: prev.organismCheckbox.filter(
                (id: any) => id !== organismToUpdate.id
              ),
            };
          });
        }
      }
    }

    setMPathogensList(updatedPathogensList);
  };

  const IDLISReportView = (
    reqId: any,
    reqType: any,
    facilityId: any,
    requisitionOrderId: any
  ) => {
    const row = {
      reqId: reqId,
      templateId: "",
      reqType: reqType,
      facilityId: facilityId,
      requisitionOrderId: requisitionOrderId,
      isPreview: true,
    };
    setIsPreviewing(true);
    RequisitionType.IDLISReportView(row)
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
        console.trace(err);
      });
  };

  const PublishAndValidate = async (
    reqId: any,
    reqType: any,
    facilityId: any,
    requisitionOrderId: any
  ) => {
    setIsPublishing(true);
    const foundRecord = data?.gridData?.data?.data?.find(
      (item: any) => item?.requisitionId === reqId
    );
    if (
      foundRecord.lisStatus.toLowerCase() === "pending" ||
      foundRecord.lisStatus.toLowerCase() === "pending abr"
    ) {
      setIsPublishing(false);
      return toast.error(t("Result is not completed in all tests"));
    } else if (foundRecord.lisStatus.toLowerCase() === "pending pharmd") {
      setIsPublishing(false);
      return toast.error(t("Result is not completed due to Pending PharmD"));
    }
    const publishObj = {
      requisitionId: reqId,
      requisitionOrderId: requisitionOrderId,
      isCorrected: reportCheckboxes?.isCorrected,
      isAmended: reportCheckboxes?.isAmended,
      lisStatus: foundRecord.lisStatus,
    };
    try {
      const publishRes: AxiosResponse =
        await RequisitionType.PublishAndValidate(publishObj);
      if (publishRes?.data?.statusCode === 200) {
        toast.success(t(publishRes?.data?.message));

        const row = {
          reqId: reqId,
          templateId: "",
          reqType: reqType,
          facilityId: facilityId,
          requisitionOrderId: requisitionOrderId,
          isPreview: false,
        };
        const viewRes: AxiosResponse =
          await RequisitionType.IDLISReportView(row);
        if (viewRes?.data?.statusCode === 200) {
          await loadGridData();
          GetExpandDataById(requisitionOrderId);
          toast.success(t(publishRes?.data?.message));
          setShow(false);
        } else {
          toast.error(t(viewRes?.data?.message));
          GetExpandDataById(requisitionOrderId);
          setShow(false);
        }
      }
    } catch (err) {
      console.trace(err);
      toast.error(t("Something went wrong during publishing."));
    } finally {
      setIsPublishing(false);
    }
  };

  const handleControlsFieldChange = (
    controlsIndex: any,
    field: any,
    value: any
  ) => {
    const updatedControlsList = [...mControlsList];
    const controlsToUpdate = updatedControlsList?.[controlsIndex];

    if (controlsToUpdate) {
      controlsToUpdate[field] = value;
      if (field === "isReRun") {
        if (value) {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              controlCheckbox: [...pre.controlCheckbox, controlsToUpdate.id],
            };
          });
        } else {
          setMainCheckboxes((prev: any) => {
            return {
              ...prev,
              controlCheckbox: prev.controlCheckbox.filter(
                (id: any) => id !== controlsToUpdate.id
              ),
            };
          });
        }
      }
    }

    setMControlsList(updatedControlsList);
  };

  const handleSetReRunControlsForAll = (value: boolean) => {
    const updatedControlsList = [...mControlsList];
    setMainCheckboxes((pre: any) => {
      return {
        ...pre,
        controlCheckbox: value
          ? [
              ...pre.controlCheckbox,
              updatedControlsList.forEach((item) => item.id),
            ]
          : [],
      };
    });

    updatedControlsList.forEach((item) => {
      item.isReRun = value;
    });

    setMControlsList(updatedControlsList);
  };

  const handleCheckboxChange = (name: string) => {
    // Update the state with the new checkbox value
    if (name === "isCorrected") {
      setReportCheckboxes({ isCorrected: true, isAmended: false });
    } else {
      setReportCheckboxes({ isCorrected: false, isAmended: true });
    }
  };

  const handleSetReRunForAll = (
    value: boolean,
    itemIndex: number,
    type: string
  ) => {
    const updatedPathogensList = [...mPathogensList];
    if (updatedPathogensList[itemIndex]) {
      if (type === "resistance") {
        updatedPathogensList[itemIndex].resistance = updatedPathogensList[
          itemIndex
        ].resistance?.map((data: any) => ({
          ...data,
          isReRun: value,
        }));

        if (value) {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              resistanceCheckbox: updatedPathogensList[
                itemIndex
              ].resistance.map((item: any) => item.id),
            };
          });
        } else {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              resistanceCheckbox: [],
            };
          });
        }
      } else {
        updatedPathogensList[itemIndex].organisms = updatedPathogensList[
          itemIndex
        ].organisms?.map((data: any) => ({
          ...data,
          isReRun: value,
        }));

        if (value) {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              organismCheckbox: updatedPathogensList[itemIndex].organisms?.map(
                (item: any) => item.id
              ),
            };
          });
        } else {
          setMainCheckboxes((pre: any) => {
            return {
              ...pre,
              organismCheckbox: [],
            };
          });
        }
      }

      // Update the state with the modified pathogens list
      setMPathogensList(updatedPathogensList);
    }
  };

  const handleFieldChangeTextArea = (value: any, names: any) => {
    if (names === "lisNotes") {
      setReportNotes((prev: any) => ({ ...prev, lisNotes: value }));
    } else {
      setReportNotes((prev: any) => ({ ...prev, criticalReport: value }));
    }
  };

  // Start IXpress condtion on the base on Upload
  const permissions = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.permissions ||
      []
  );

  const hasPermission = permissions.some(
    (permission: PermissionObject) =>
      permission.subject.replace(/\n/g, "").toLowerCase() ===
        "Result Data".replace(/\n/g, "").toLowerCase() &&
      permission.moduleName.replace(/\n/g, "").toLowerCase() ===
        "ID LIS".replace(/\n/g, "").toLowerCase() &&
      permission.action.replace(/\n/g, "").toLowerCase() ===
        "FileUpload".replace(/\n/g, "").toLowerCase()
  );
  // End IXpress condtion on the base on Upload

  const GetExpandDataById = (requisitionOrderId: any) => {
    setLoading(true);

    RequisitionType.GetExpandDataById(requisitionOrderId)
      .then((res: any) => {
        setConfigs(res?.data?.data?.pathogens[0].configs);
        setMControlsList(res?.data?.data?.controls);
        setMPathogensList(res?.data?.data?.pathogens);
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

  useEffect(() => {
    GetExpandDataById(requisitionOrderId);
  }, []);

  useEffect(() => {
    setMPathogensList(PathogensList);
  }, [PathogensList]);

  useEffect(() => {
    const { organismCheckbox, resistanceCheckbox, controlCheckbox } =
      mainCheckboxes;
    setBar(
      organismCheckbox.length > 0 ||
        resistanceCheckbox.length > 0 ||
        controlCheckbox.length > 0
    );
  }, [mainCheckboxes]);

  useEffect(() => {
    if (!targetRef.current || !isMasterExpandTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // setIsVisible(true);
          const allData = data.gridData.data.data;
          const lastElement = rowsToExpand[rowsToExpand.length - 1];

          const lastIndex = allData.findIndex(
            (item: any) => item.requisitionOrderId === lastElement
          );

          // Get next 5 elements after lastElement
          const nextFiveIds = allData
            .slice(lastIndex + 1, lastIndex + 4)
            .map((item: any) => item.requisitionOrderId);

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

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);

    try {
      const formData = new FormData();

      // Append all other fields
      formData.append("ReqId", row?.requisitionId);
      formData.append("RequisitionOrderId", row?.requisitionOrderId);
      formData.append("ReqType", row?.requisitionTypeId);
      formData.append("FacilityId", row?.facilityId);
      formData.append("File", file);

      const response = await RequisitionType.fileUpload(formData);

      if (response?.data?.statusCode === 400) {
        toast.error(t(response?.data?.message));
      } else {
        toast.success(t(response?.data?.message));
      }

      setFile(null);
    } catch (error) {
      console.error(error);
      alert("Upload failed!");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      ref={
        rowsToExpand.length > 0 &&
        row?.requisitionOrderId === rowsToExpand[rowsToExpand.length - 2]
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
          <h5 className="mb-2">{t("Result Summary")}</h5>
          <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center mt-3">
            <div className="align-items-center d-flex mb-md-3 mb-3 gap-2 flex-wrap">
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Result Data"
                permissionIdentifier="PublishandValidate"
              >
                <LoadButton
                  id={`ResultDataExpandPublishAndValidate`}
                  className="btn btn-success btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isPublishing}
                  btnText={
                    filterData.tabId === 1
                      ? t("Publish & Validate")
                      : reportCheckboxes.isCorrected ||
                          reportCheckboxes.isAmended
                        ? t("Republish & Revalidate")
                        : t("Publish & Validate")
                  }
                  loadingText={t("Processing.....")}
                  onClick={async () => {
                    if (
                      hasPermission === true &&
                      row?.graphImageFileBit === false
                    ) {
                      setShow(true);
                    } else {
                      await PublishAndValidate(
                        requisitionId,
                        reqTypeId,
                        facilityId,
                        row?.requisitionOrderId
                      );
                    }
                    // setDuplicate(false);
                  }}
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Result Data"
                permissionIdentifier="Preview"
              >
                <LoadButton
                  id={`ResultDataExpandPreviewButton`}
                  className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                  loading={isPreviewing}
                  btnText={t("Preview")}
                  loadingText={t("Previewing")}
                  onClick={() =>
                    IDLISReportView(
                      requisitionId,
                      reqTypeId,
                      facilityId,
                      row.requisitionOrderId
                    )
                  }
                />
              </PermissionComponent>
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Result Data"
                permissionIdentifier="Save"
              >
                <LoadButton
                  id={`ResultDataExpandSaveButton`}
                  className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isSubmitting}
                  btnText={t("Save")}
                  loadingText={t("Saving")}
                  onClick={() => SaveIdResultDataExpand()}
                />
              </PermissionComponent>
              {filterData.tabId === 1 || filterData.tabId === 2 ? (
                <div>
                  {!file ? (
                    <>
                      <input
                        type="file"
                        id="hiddenFileInput"
                        accept=".png,.jpg"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                      />
                      <PermissionComponent
                        moduleName="ID LIS"
                        pageName="Result Data"
                        permissionIdentifier="FileUpload"
                      >
                        <LoadButton
                          className="btn btn-danger btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                          loading={uploading}
                          btnText={t("File Upload")}
                          loadingText={t("Uploading...")}
                          onClick={() =>
                            document.getElementById("hiddenFileInput")?.click()
                          }
                        />
                      </PermissionComponent>
                    </>
                  ) : (
                    <div
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                      }}
                    >
                      <span
                        style={{
                          flex: 1,
                          fontSize: "14px",
                          wordBreak: "break-word",
                        }}
                      >
                        {file.name}
                      </span>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        sx={{ minWidth: "30px" }}
                        onClick={handleRemoveFile}
                      >
                        <AiOutlineClose size={16} />
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        onClick={handleUpload}
                        disabled={uploading}
                        startIcon={<AiOutlineUpload />}
                      >
                        {uploading ? t("Uploading...") : t("Upload")}
                      </Button>
                    </div>
                  )}
                </div>
              ) : null}
              {bar ? (
                <LoadButton
                  className="btn btn-info btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                  loading={isReRunCheckBox}
                  btnText={t("Apply ReRun")}
                  loadingText={t("Applying")}
                  onClick={() => ApplyRerun()}
                />
              ) : null}
              {filterData.tabId === 2 ? (
                <>
                  <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                    <input
                      id="ResultDataExpandCorrectedReportCheckBox"
                      className="form-check-input"
                      type="checkbox"
                      checked={reportCheckboxes.isCorrected}
                      onChange={() => handleCheckboxChange("isCorrected")}
                    />
                    {t("Corrected Report")}
                  </label>
                  <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                    <input
                      id="ResultDataExpandAmendedReportCheckBox"
                      className="form-check-input"
                      type="checkbox"
                      checked={reportCheckboxes.isAmended}
                      onChange={() => handleCheckboxChange("isAmended")}
                    />
                    {t("Amended Report")}
                  </label>
                </>
              ) : null}

              {/* <span  >Save</span> */}
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3 mb-2">
              {loading ? null : mPathogensList?.length === 0 ? (
                <button
                  id="ResultDataExpandCreatManualResult"
                  onClick={() => GenerateBlanksAgainstReqOrderId()}
                  className="btn btn-linkedin btn-sm fs-12px h-30px py-0 fw-500"
                  aria-controls="Search"
                >
                  {t(" + Create Manual Results")}
                </button>
              ) : null}
            </div>
          </div>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: "2px solid #7239ea" }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center px-4 min-h-40px">
                <h5 className="m-0 text-info">Controls</h5>
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="d-flex mb-5 gap-2">
                  <button
                    id="ResultDataExpandAllPassButton"
                    className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                    onClick={() => changeControlsStatus("Pass")}
                  >
                    <span>{t("All Pass")}</span>
                  </button>
                  <button
                    id="ResultDataExpandAllFailButton"
                    className="btn btn-danger btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                    onClick={() => changeControlsStatus("Fail")}
                  >
                    <span>{t("All Fail")}</span>
                  </button>
                </div>
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
                            {t("Control Name")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Results")}
                          </TableCell>
                          <TableCell className="min-w-125px w-125px">
                            {t("Combined Result")}
                          </TableCell>
                          {configs?.calculationOnCt === true ? (
                            <TableCell className="min-w-125px w-125px">
                              {t("CT Value")}
                            </TableCell>
                          ) : null}
                          {configs?.calculationOnAmpScore === true ? (
                            <TableCell className="min-w-125px w-125px">
                              {t("Amp Score")}
                            </TableCell>
                          ) : null}
                          {configs?.calculationOnCqConf === true ? (
                            <TableCell className="min-w-100px w-100px">
                              {t("Cq Conf")}
                            </TableCell>
                          ) : null}
                          {configs?.calculationOnAmpStatus === true ? (
                            <TableCell className="min-w-100px w-100px">
                              {t("Amp Status")}
                            </TableCell>
                          ) : null}
                          {configs?.calculationOnRoxSignal === true ? (
                            <TableCell className="min-w-100px w-100px">
                              {t("Rox Signal")}
                            </TableCell>
                          ) : null}
                          {configs?.calculationOnTaiScore === true ? (
                            <TableCell className="min-w-100px w-100px">
                              {t("TAI Score")}
                            </TableCell>
                          ) : null}

                          <TableCell className="min-w-125px w-125px">
                            <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                              <input
                                id="ResultDataExpandReRunCheckBox"
                                className="form-check-input"
                                type="checkbox"
                                checked={
                                  mControlsList.length > 0 &&
                                  mControlsList.length ===
                                    mainCheckboxes.controlCheckbox.length
                                }
                                onChange={(e) =>
                                  handleSetReRunControlsForAll(e.target.checked)
                                }
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
                          mControlsList?.map(
                            (data: any, controlsIndex: any) => (
                              <TableRow key={data.id}>
                                <TableCell
                                  id={`ControlsControlName_${controlsIndex}`}
                                >
                                  {data?.controlName}
                                </TableCell>
                                <TableCell
                                  id={`ControlsControlResults_${controlsIndex}`}
                                >
                                  {data?.results}
                                </TableCell>

                                <TableCell
                                  id={`ControlsControlCombinedResult_${controlsIndex}`}
                                >
                                  <Select
                                    id={`ControlsControlCombinedResultSelect_${controlsIndex}`}
                                    menuPortalTarget={document.body}
                                    theme={(theme) => stylesResultData(theme)}
                                    className="bg-transparent"
                                    options={controlsDropDown}
                                    value={controlsDropDown.filter(function (
                                      option: any
                                    ) {
                                      return (
                                        option.value === data?.combinedResult
                                      );
                                    })}
                                    onChange={(e) =>
                                      handleControlsFieldChange(
                                        controlsIndex,
                                        "combinedResult",
                                        e?.value
                                      )
                                    }
                                    closeMenuOnScroll={(e) =>
                                      closeMenuOnScroll(e)
                                    }
                                  />
                                  {(renderedControls[data.controlName] = true)}
                                </TableCell>
                                {configs?.calculationOnCt === true && (
                                  <TableCell
                                    id={`ControlsControlCtValue_${controlsIndex}`}
                                  >
                                    <input
                                      id={`ControlsControlCtValueInput_${controlsIndex}`}
                                      type="text"
                                      autoComplete="off"
                                      className="form-control bg-transparent"
                                      value={data?.ctValue ?? ""}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "ctValue",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (!isNumericKey(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {configs?.calculationOnAmpScore && (
                                  <TableCell
                                    id={`ControlsControlAmpScore_${controlsIndex}`}
                                  >
                                    <input
                                      id={`ControlsControlAmpScoreInput_${controlsIndex}`}
                                      type="text"
                                      autoComplete="off"
                                      className="form-control bg-transparent"
                                      value={data?.ampScore ?? ""}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "ampScore",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (!isNumericKey(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {configs?.calculationOnCqConf && (
                                  <TableCell
                                    id={`ControlsControlCqConf_${controlsIndex}`}
                                  >
                                    <input
                                      id={`ControlsControlCqConfInput_${controlsIndex}`}
                                      type="text"
                                      autoComplete="off"
                                      className="form-control bg-transparent"
                                      value={data?.cqConf ?? ""}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "cqConf",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (!isNumericKey(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {configs?.calculationOnAmpStatus && (
                                  <TableCell
                                    id={`ControlsControlCqConf_${controlsIndex}`}
                                  >
                                    <Select
                                      id={`WoundPanelAmpStatusSelect_${
                                        controlsIndex + 1
                                      }`}
                                      menuPortalTarget={document.body}
                                      theme={(theme) => stylesResultData(theme)}
                                      className="bg-transparent"
                                      options={ampStatusDropDown}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "ampStatus",
                                          e?.value
                                        )
                                      }
                                      value={ampStatusDropDown.filter(function (
                                        option: any
                                      ) {
                                        return option.value === data?.ampStatus;
                                      })}
                                      closeMenuOnScroll={(e) =>
                                        closeMenuOnScroll(e)
                                      }
                                    />
                                  </TableCell>
                                )}
                                {configs?.calculationOnRoxSignal && (
                                  <TableCell
                                    id={`ControlsControlRoxSignal_${controlsIndex}`}
                                  >
                                    <input
                                      id={`ControlsControlRoxSignalInput_${controlsIndex}`}
                                      type="text"
                                      autoComplete="off"
                                      className="form-control bg-transparent"
                                      value={data?.roxSignal ?? ""}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "roxSignal",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (!isNumericKey(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}
                                {configs?.calculationOnTaiScore && (
                                  <TableCell
                                    id={`ControlsControlTAIScore_${controlsIndex}`}
                                  >
                                    <input
                                      id={`ControlsControlTAIScoreInput_${controlsIndex}`}
                                      type="text"
                                      autoComplete="off"
                                      className="form-control bg-transparent"
                                      value={data?.taiScore ?? ""}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "taiScore",
                                          e.target.value
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        if (!isNumericKey(e.key)) {
                                          e.preventDefault();
                                        }
                                      }}
                                    />
                                  </TableCell>
                                )}

                                <TableCell
                                  id={`ControlsControlIsReRun_${controlsIndex}`}
                                >
                                  <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                    <input
                                      id={`ControlsControlIsReRunCheckBox_${controlsIndex}`}
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={data?.isReRun}
                                      value={data?.isReRun}
                                      onChange={(e) =>
                                        handleControlsFieldChange(
                                          controlsIndex,
                                          "isReRun",
                                          e.target.checked
                                        )
                                      }
                                    />
                                  </label>
                                </TableCell>
                              </TableRow>
                            )
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
          {mPathogensList?.map((item: any, panelIndex: any) => (
            <div
              className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
              style={{ border: "2px solid #ffc700" }}
              key={item.id}
            >
              <div className="card border">
                <div className="card-body py-md-4 py-3 px-4">
                  <div className="d-flex gap-2 mb-2">
                    <button
                      id="ResultDataExpandFillUndetermined"
                      className="btn btn-success btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                      onClick={() =>
                        ChangeOrganismStatus("Undetermined", item, panelIndex)
                      }
                    >
                      <span>{t("Fill Undetermined")}</span>
                    </button>
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Result Data"
                      permissionIdentifier="InvalidReport"
                    >
                      <button
                        id="ResultDataExpandFillInvalid"
                        className="btn btn-info btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                        onClick={() =>
                          ChangeOrganismStatus("Invalid", item, panelIndex)
                        }
                      >
                        <span>{t("Fill Invalid")}</span>
                      </button>
                    </PermissionComponent>
                    {/* <button className="btn btn-danger btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500">
                      <span  >Inconclusive</span>
                    </button> */}
                  </div>
                  <h4 className="text-warning">{item?.panelName}</h4>
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
                              <TableCell className="min-w-250px w-250px">
                                {t("Organism")}
                              </TableCell>
                              <TableCell className="min-w-125px w-125px">
                                {t("Results")}
                              </TableCell>
                              <TableCell className="min-w-150px w-150px">
                                {t("Combined Result")}
                              </TableCell>
                              {configs?.calculationOnCt === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("CT Value")}
                                </TableCell>
                              ) : null}

                              {configs?.calculationOnAmpScore === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("Amp Score")}
                                </TableCell>
                              ) : null}

                              {configs?.calculationOnCqConf === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("Cq Conf")}
                                </TableCell>
                              ) : null}
                              {configs?.calculationOnAmpStatus === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("Amp Status")}
                                </TableCell>
                              ) : null}
                              {configs?.calculationOnRoxSignal === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("Rox Signal")}
                                </TableCell>
                              ) : null}
                              {configs?.calculationOnTaiScore === true ? (
                                <TableCell className="min-w-125px w-125px">
                                  {t("TAI Score")}
                                </TableCell>
                              ) : null}

                              <TableCell className="min-w-100px">
                                <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                  <input
                                    id="ResultDataExpandWoundPanelReRun2CheckBox"
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={
                                      item?.organisms.length > 0 &&
                                      item?.organisms.length ===
                                        mainCheckboxes.organismCheckbox.length
                                    }
                                    onChange={(e) =>
                                      handleSetReRunForAll(
                                        e.target.checked,
                                        panelIndex,
                                        "organism"
                                      )
                                    }
                                  />
                                  {t("Re-Run")}
                                </label>
                              </TableCell>
                              <TableCell className="min-w-250px">
                                {t("Comments")}
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody className="scroll-start">
                            {loading ? (
                              <TableCell colSpan={8} className="padding-0">
                                <Loader />
                              </TableCell>
                            ) : (
                              item?.organisms?.map(
                                (data: any, organismIndex: any) => (
                                  <TableRow key={data.id}>
                                    <TableCell
                                      id={`WoundPanelOrganism_${
                                        organismIndex + 1
                                      }`}
                                    >
                                      {data?.organism}
                                    </TableCell>
                                    <TableCell
                                      id={`WoundPanelResults_${
                                        organismIndex + 1
                                      }`}
                                    >
                                      {data?.results}
                                    </TableCell>

                                    <TableCell
                                      id={`WoundPanelCombinedResult_${organismIndex + 1}`}
                                    >
                                      {(
                                        item?.organisms?.filter(
                                          (obj: any) =>
                                            obj.organism === data.organism
                                        ) ?? []
                                      ).length > 1
                                        ? renderedOrganisms[data.organism]
                                          ? null
                                          : data?.combinedResult
                                        : ""}
                                    </TableCell>
                                    {configs?.calculationOnCt && (
                                      <TableCell
                                        id={`WoundPanelCTValue_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <input
                                          id={`WoundPanelCTValueInput_${
                                            organismIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={data?.ctValue ?? ""}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "ctValue",
                                              e.target.value,
                                              "organism"
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            if (!isNumericKey(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    )}

                                    {configs?.calculationOnAmpScore && (
                                      <TableCell
                                        id={`WoundPanelAmpScore_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <input
                                          id={`WoundPanelAmpScoreInput_${
                                            organismIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={data?.ampScore ?? ""}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "ampScore",
                                              e.target.value,
                                              "organism"
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            if (!isNumericKey(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    )}

                                    {configs?.calculationOnCqConf && (
                                      <TableCell
                                        id={`WoundPanelCqConf_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <input
                                          id={`WoundPanelCqConfInput_${
                                            organismIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={data?.cqConf ?? ""}
                                          onChange={(e: any) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "cqConf",
                                              e.target.value,
                                              "organism"
                                            )
                                          }
                                          onKeyDown={(e: any) => {
                                            if (!isNumericKey(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    )}

                                    {configs?.calculationOnAmpStatus && (
                                      <TableCell
                                        id={`WoundPanelAmpStatus_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <Select
                                          id={`WoundPanelAmpStatusSelect_${
                                            organismIndex + 1
                                          }`}
                                          menuPortalTarget={document.body}
                                          theme={(theme) =>
                                            stylesResultData(theme)
                                          }
                                          className="bg-transparent"
                                          options={ampStatusDropDown}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "ampStatus",
                                              e?.value, // Use selectedOption.value
                                              "organism"
                                            )
                                          }
                                          value={ampStatusDropDown.filter(
                                            function (option: any) {
                                              return (
                                                option.value === data?.ampStatus
                                              );
                                            }
                                          )}
                                          closeMenuOnScroll={(e) =>
                                            closeMenuOnScroll(e)
                                          }
                                        />
                                      </TableCell>
                                    )}

                                    {configs?.calculationOnRoxSignal && (
                                      <TableCell
                                        id={`WoundPanelRoxSignal_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <input
                                          id={`WoundPanelRoxSignalInput_${
                                            organismIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={data?.roxSignal ?? ""}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "roxSignal",
                                              e.target.value,
                                              "organism"
                                            )
                                          }
                                          onKeyDown={(e) => {
                                            if (!isNumericKey(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    )}
                                    {configs?.calculationOnTaiScore && (
                                      <TableCell
                                        id={`WoundPanelTAIScore_${
                                          organismIndex + 1
                                        }`}
                                      >
                                        <input
                                          id={`WoundPanelTAIScoreInput_${
                                            organismIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={data?.taiScore ?? ""}
                                          onChange={(e: any) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "taiScore",
                                              e.target.value,
                                              "organism"
                                            )
                                          }
                                          onKeyDown={(e: any) => {
                                            if (!isNumericKey(e.key)) {
                                              e.preventDefault();
                                            }
                                          }}
                                        />
                                      </TableCell>
                                    )}

                                    <TableCell>
                                      <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                        <input
                                          id={`WoundPanelIsReRunCheckBox_${
                                            organismIndex + 1
                                          }`}
                                          className="form-check-input"
                                          type="checkbox"
                                          value={data?.isReRun}
                                          checked={data?.isReRun}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              organismIndex,
                                              "isReRun",
                                              e.target.checked,
                                              "organism"
                                            )
                                          }
                                        />
                                      </label>
                                    </TableCell>
                                    <TableCell>
                                      <input
                                        id={`WoundPaneorganism_${
                                          organismIndex + 1
                                        }`}
                                        type="text"
                                        autoComplete="off"
                                        className="form-control bg-transparent"
                                        value={data?.comments}
                                        onChange={(e) =>
                                          handleFieldChange(
                                            panelIndex,
                                            organismIndex,
                                            "comments",
                                            e.target.value,
                                            "organism"
                                            // false,
                                          )
                                        }
                                      />
                                    </TableCell>
                                  </TableRow>
                                )
                              )
                            )}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </div>
                    {/* <div className='scroll-ended'></div> */}
                  </div>
                  <div className="mt-5 mt-mb-5 mt-sm-5">
                    <h4 className="text-warning">{t("Resistance")}</h4>
                  </div>
                  <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                      <div className="table_bordered overflow-hidden">
                        <TableContainer className="shadow-none">
                          <Table
                            stickyHeader
                            aria-label="sticky table collapsible"
                            className="plate-mapping-table mb-1"
                          >
                            <TableHead className="h-40px">
                              <TableRow>
                                <TableCell className="min-w-250px w-250px">
                                  {t("Organism")}
                                </TableCell>
                                <TableCell className="min-w-125px w-125px">
                                  {t("Results")}
                                </TableCell>
                                <TableCell className="min-w-150px w-150px">
                                  {t("Combined Result")}
                                </TableCell>
                                {configs?.calculationOnCt === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("CT Value")}
                                  </TableCell>
                                ) : null}
                                {configs?.calculationOnAmpScore === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("Amp Score")}
                                  </TableCell>
                                ) : null}
                                {configs?.calculationOnCqConf === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("Cq Conf")}
                                  </TableCell>
                                ) : null}
                                {configs?.calculationOnAmpStatus === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("Amp Status")}
                                  </TableCell>
                                ) : null}
                                {configs?.calculationOnRoxSignal === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("Rox Signal")}
                                  </TableCell>
                                ) : null}
                                {configs?.calculationOnTaiScore === true ? (
                                  <TableCell className="min-w-125px w-125px">
                                    {t("TAI Score")}
                                  </TableCell>
                                ) : null}

                                <TableCell className="min-w-100px">
                                  <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                    <input
                                      id={`ResultDataExpandResistanceCheckBox`}
                                      className="form-check-input"
                                      type="checkbox"
                                      checked={
                                        item?.resistance.length > 0 &&
                                        item?.resistance.length ===
                                          mainCheckboxes.resistanceCheckbox
                                            .length
                                      }
                                      onChange={(e) =>
                                        handleSetReRunForAll(
                                          e.target.checked,
                                          panelIndex,
                                          "resistance"
                                        )
                                      }
                                    />
                                    {t("Re-Run")}
                                  </label>
                                </TableCell>
                                <TableCell className="min-w-250px">
                                  {t("Comments")}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {loading ? (
                                <TableCell colSpan={8} className="padding-0">
                                  <Loader />
                                </TableCell>
                              ) : (
                                item?.resistance?.map(
                                  (temp: any, resistanceIndex: any) => (
                                    <TableRow key={temp.id}>
                                      <TableCell
                                        id={`ResistanceOrganism_${
                                          resistanceIndex + 1
                                        }`}
                                      >
                                        {temp?.organism}
                                      </TableCell>
                                      <TableCell
                                        id={`ResistanceResults_${
                                          resistanceIndex + 1
                                        }`}
                                      >
                                        {temp?.results}
                                      </TableCell>
                                      <TableCell
                                        id={`ResistanceCombinedResult_${resistanceIndex + 1}`}
                                      >
                                        {(
                                          item?.resistance?.filter(
                                            (obj: any) =>
                                              obj.organism === temp.organism
                                          ) ?? []
                                        ).length > 1
                                          ? renderedOrganisms[temp.organism]
                                            ? null
                                            : temp?.combinedResult
                                          : ""}
                                      </TableCell>

                                      {configs?.calculationOnCt === true && (
                                        <TableCell
                                          id={`ResistanceCtValue_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <input
                                            id={`ResistanceCtValueInput_${
                                              resistanceIndex + 1
                                            }`}
                                            type="text"
                                            autoComplete="off"
                                            className="form-control bg-transparent"
                                            value={temp?.ctValue ?? ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "ctValue",
                                                e.target.value,
                                                "resistance"
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (!isNumericKey(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        </TableCell>
                                      )}

                                      {configs?.calculationOnAmpScore ===
                                        true && (
                                        <TableCell
                                          id={`ResistanceAmpScore_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <input
                                            id={`ResistanceAmpScoreInput_${
                                              resistanceIndex + 1
                                            }`}
                                            type="text"
                                            autoComplete="off"
                                            className="form-control bg-transparent"
                                            value={temp?.ampScore ?? ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "ampScore",
                                                e.target.value,
                                                "resistance"
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (!isNumericKey(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        </TableCell>
                                      )}

                                      {configs?.calculationOnCqConf ===
                                        true && (
                                        <TableCell
                                          id={`ResistanceCqConf_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <input
                                            id={`ResistanceCqConfInput_${
                                              resistanceIndex + 1
                                            }`}
                                            type="text"
                                            autoComplete="off"
                                            className="form-control bg-transparent"
                                            value={temp?.cqConf ?? ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "cqConf",
                                                e.target.value,
                                                "resistance"
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (!isNumericKey(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        </TableCell>
                                      )}
                                      {configs?.calculationOnAmpStatus ===
                                        true && (
                                        <TableCell
                                          id={`ResistanceAmpStatus_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <Select
                                            id={`ResistanceAmpStatusSelect_${
                                              resistanceIndex + 1
                                            }`}
                                            menuPortalTarget={document.body}
                                            theme={(theme) =>
                                              stylesResultData(theme)
                                            }
                                            className="bg-transparent"
                                            options={ampStatusDropDown}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "ampStatus",
                                                e?.value, // Use selectedOption.value
                                                "resistance"
                                              )
                                            }
                                            value={ampStatusDropDown.filter(
                                              function (option: any) {
                                                return (
                                                  option.value ===
                                                  temp?.ampStatus
                                                );
                                              }
                                            )}
                                            closeMenuOnScroll={(e) =>
                                              closeMenuOnScroll(e)
                                            }
                                          />
                                        </TableCell>
                                      )}
                                      {configs?.calculationOnRoxSignal ===
                                        true && (
                                        <TableCell
                                          id={`ResistanceRoxSignal_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <input
                                            id={`ResistanceRoxSignalInput_${
                                              resistanceIndex + 1
                                            }`}
                                            type="text"
                                            autoComplete="off"
                                            className="form-control bg-transparent"
                                            value={temp?.roxSignal ?? ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "roxSignal",
                                                e.target.value,
                                                "resistance"
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (!isNumericKey(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        </TableCell>
                                      )}
                                      {configs?.calculationOnTaiScore ===
                                        true && (
                                        <TableCell
                                          id={`ResistanceTAIScore_${
                                            resistanceIndex + 1
                                          }`}
                                        >
                                          <input
                                            id={`ResistanceTAIScoreInput_${
                                              resistanceIndex + 1
                                            }`}
                                            type="text"
                                            autoComplete="off"
                                            className="form-control bg-transparent"
                                            value={temp?.taiScore ?? ""}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "taiScore",
                                                e.target.value,
                                                "resistance"
                                              )
                                            }
                                            onKeyDown={(e) => {
                                              if (!isNumericKey(e.key)) {
                                                e.preventDefault();
                                              }
                                            }}
                                          />
                                        </TableCell>
                                      )}

                                      <TableCell
                                        id={`ResistanceIsReRun_${
                                          resistanceIndex + 1
                                        }`}
                                      >
                                        <label className="form-check form-check-inline form-check-solid m-0 fw-500">
                                          <input
                                            id={`ResistanceIsReRunCheckBox_${
                                              resistanceIndex + 1
                                            }`}
                                            className="form-check-input"
                                            type="checkbox"
                                            value={temp?.isReRun}
                                            checked={temp?.isReRun}
                                            onChange={(e) =>
                                              handleFieldChange(
                                                panelIndex,
                                                resistanceIndex,
                                                "isReRun",
                                                e.target.checked,
                                                "resistance"
                                              )
                                            }
                                          />
                                        </label>
                                      </TableCell>
                                      <TableCell>
                                        <input
                                          id={`ResistanceComments_${
                                            resistanceIndex + 1
                                          }`}
                                          type="text"
                                          autoComplete="off"
                                          className="form-control bg-transparent"
                                          value={temp?.comments}
                                          onChange={(e) =>
                                            handleFieldChange(
                                              panelIndex,
                                              resistanceIndex,
                                              "comments",
                                              e.target.value,
                                              "resistance"
                                            )
                                          }
                                        />
                                      </TableCell>
                                    </TableRow>
                                  )
                                )
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded mt-5"
            style={{ border: "2px solid #ffc700" }}
          >
            <div className="card border">
              <div className="card-body py-md-4 py-3 px-4">
                <label
                  htmlFor="ResultDataExpandInternalNotes"
                  className="text bold"
                >
                  {t("Internal Notes:")}
                </label>
                <textarea
                  id="ResultDataExpandInternalNotes"
                  className="form-control  h-80px mt-2"
                  name="lisNotes" // Name attribute for the text box
                  placeholder={t("Enter your Internal notes here")}
                  rows={5} // Increase the number of rows to increase the height
                  value={reportNotes.lisNotes}
                  onChange={(e) =>
                    handleFieldChangeTextArea(e.target.value, "lisNotes")
                  }
                />
                <div className="mt-3"></div>
                <label htmlFor="ResultDataExpandcriticalReport">
                  {t("Critical Report Notes:")}
                </label>
                <textarea
                  id="ResultDataExpandcriticalReport"
                  className="form-control h-80px mt-2"
                  name="criticalReport" // Name attribute for the text box
                  placeholder={t("Enter your critical report notes here")}
                  rows={5} // Increase the number of rows to increase the height
                  value={reportNotes.criticalReport}
                  onChange={(e) =>
                    handleFieldChangeTextArea(e.target.value, "criticalReport")
                  }
                />
              </div>
            </div>
          </div>
          <div className="mt-2 py-4 d-flex mb-5 gap-2">
            <PermissionComponent
              moduleName="ID LIS"
              pageName="Result Data"
              permissionIdentifier="PublishandValidate"
            >
              <LoadButton
                id={`PublishAndValidatebottom`}
                className="btn btn-success btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isPublishing}
                btnText={
                  filterData.tabId === 1
                    ? t("Publish & Validate")
                    : reportCheckboxes.isCorrected || reportCheckboxes.isAmended
                      ? t("Republish & Revalidate")
                      : t("Publish & Validate")
                }
                loadingText="Processing....."
                onClick={async () => {
                  if (
                    hasPermission === true &&
                    row?.graphImageFileBit === false
                  ) {
                    setShow(true);
                  } else {
                    await PublishAndValidate(
                      requisitionId,
                      reqTypeId,
                      facilityId,
                      row?.requisitionOrderId
                    );
                  }
                  // setDuplicate(false);
                }}
              />
            </PermissionComponent>
            <PermissionComponent
              moduleName="ID LIS"
              pageName="Result Data"
              permissionIdentifier="Preview"
            >
              <LoadButton
                id={`ResultDataPreviewBottom`}
                className="btn btn-warning btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500 text-white"
                loading={isPreviewing}
                btnText={t("Preview")}
                loadingText={t("Previewing")}
                onClick={() =>
                  IDLISReportView(
                    requisitionId,
                    reqTypeId,
                    facilityId,
                    row.requisitionOrderId
                  )
                }
              />
            </PermissionComponent>
            <PermissionComponent
              moduleName="ID LIS"
              pageName="Result Data"
              permissionIdentifier="Save"
            >
              <LoadButton
                id={`ResultDataExpandSaveBottom`}
                className="btn btn-primary btn-sm fw-bold search d-block fs-12px h-30px py-0 fw-500"
                loading={isSubmitting}
                btnText={t("Save")}
                loadingText={t("Saving")}
                onClick={() => SaveIdResultDataExpand()}
              />
            </PermissionComponent>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Publish & Validate")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Graph file is not uploaded yet, do you want to Continue ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`IDResultDataModalPublishAndValidateCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            id={`IDResultDataModalPublishAndValidateContinue`}
            type="button"
            className="btn btn-primary m-2"
            onClick={async () => {
              await PublishAndValidate(
                requisitionId,
                reqTypeId,
                facilityId,
                row?.requisitionOrderId
              );
              // setDuplicate(false);
            }}
          >
            {t("Continue")}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default memo(ResultDataExpandableRow);
