import {
  Box,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useState } from "react";
import { Dropdown, DropdownButton, Modal } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import DynamicAddNewInputs from "./AddNewInputs";
import ExpandInfo from "./ExpandInfo";
import { useWorkLogDataContext } from "./WorkLogContext/useWorkLogContext";
import { closeMenuOnScroll } from "Pages/Blood/BloodCompendium/Test/Shared";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import {
  deleteRecord,
  savePhlebotomistsyAssignment,
  saveRejectedReason,
  saveUdateWorkLog,
} from "Services/Requisition/WorkLog";
import NoRecord from "Shared/Common/NoRecord";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "Shared/Icons";
import { reactSelectStyle, styles } from "Utils/Common";

interface SpecimenType {
  specimenTypeId: number;
  specimenTypeName: string;
}

interface Test {
  requisitionTestID: number;
  testId: number;
  testName: string;
  specimenType: string;
  rejectReasonId: number | null;
}

interface DataRecollect {
  specimenTypes: SpecimenType[];
  tests: Test[];
}

interface Option {
  value: number;
  label: string;
}

export const NormalizedData = (obj: any, key: any) => {
  if (!obj || !key) return undefined;
  const normalizedKey = Object.keys(obj).find(
    (k: any) => k.toLowerCase() === key.toLowerCase()
  );
  return normalizedKey ? obj[normalizedKey] : undefined;
};

const Row = (props: any) => {
  const {
    data,
    setData,
    selectedBox,
    setSelectedBox,
    loadGridData,
    loading,
    value,
    inputFields,
    setInputFields,
    tabIdToSend,
  } = useWorkLogDataContext();

  const initialRecollectValues = {
    requisitionOrderId: props.RowData.RequisitionOrderId,
    requisitionId: props.RowData.RequisitionID,
    specimenTypeIds: [] as number[],
    cancellationReason: "",
    cancellationComment: "",
    cancellationDate: "",
    tests: [
      {
        requisitionTestID: 0,
        testId: 0,
        testName: "",
        specimenType: "",
        rejectReasonId: 0,
      },
    ],
  };

  const initialReDrawValues = {
    requisitionOrderId: props.RowData.RequisitionOrderId,
    reDrawReason: "",
    reDrawComment: "",
    reDrawDate: "",
  };

  const { t } = useLang();

  const [open, setOpen] = useState(false);
  const [show, setShow] = useState(false);
  const [reason, setReason] = useState("");
  const [openalert, setOpenAlert] = useState(false);
  const [openReDraw, setOpenReDraw] = useState(false);
  const [recollectValues, setRecollectValues] = useState(
    initialRecollectValues
  );
  const [openRecollect, setOpenRecollect] = useState(false);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState<any>([]);
  // const [anchorEl2, setAnchorEl2] = useState<null | HTMLElement>(null);
  const [reDrawValues, setReDrawValues] = useState(initialReDrawValues);
  const [cancellationReasonLookup, setCancellationReasonLookup] = useState<
    Option[]
  >([]);
  const [rejectedReasonLookup, setRejectedReasonLookup] = useState<Option[]>(
    []
  );
  const [dataRecollect, setDataRecollect] = useState<DataRecollect | undefined>(
    undefined
  );

  const handleClickOpenDeleteModal = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseReCollect = () => {
    setOpenRecollect(false);
    setRecollectValues(initialRecollectValues);
    setDataRecollect(undefined);
  };

  const handleCloseReDrawModal = () => {
    setOpenReDraw(false);
    setReDrawValues(initialReDrawValues);
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };

  const handleChangeSelectedIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: [...selectedBox.requisitionOrderId, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: selectedBox.requisitionOrderId.filter(
            (item: any) => item !== id
          ),
        };
      });
    }
  };

  const getReCollectData = async (specimenTypeIds: number[] = []) => {
    const response = await RequisitionType.GetReCollectData({
      reqOrderId: NormalizedData(props?.RowData, "requisitionorderid"),
      specimenTypeIds: specimenTypeIds,
    });
    if (response?.data?.statusCode < 300) {
      setDataRecollect(response?.data?.data);
      setRecollectValues((prev: any) => ({
        ...prev,
        tests: response?.data?.data?.tests,
      }));
    }
  };
  console.log("dataRecollect", recollectValues);

  const getCancellationReasonsLookup = async () => {
    const response = await RequisitionType.getCancellationReasonsLookup();
    setCancellationReasonLookup(response?.data);
  };

  const getRejectReasonTypesLookup = async () => {
    const response = await RequisitionType.getPartialRejectionLookup();
    setRejectedReasonLookup(response?.data);
  };

  const handleClickOpen = () => {
    if (parseInt(props?.RowData.StatusId) === 2) {
      toast.error(t("Please assign Phlebotomist before Re-Collecting."));
      return;
    }
    setOpenRecollect(true);
    getReCollectData();
    getRejectReasonTypesLookup();
  };

  const handleClickOpenReDrwaModal = () => {
    if (parseInt(props?.RowData.StatusId) === 2) {
      toast.error(t("Please assign Phlebotomist before Re-Drawing."));
      return;
    }
    setOpenReDraw(true);
    getCancellationReasonsLookup();
  };

  const handleChangeChecked = (value: number, checked: boolean) => {
    setRecollectValues((prev: any) => {
      const updatedSpecimenTypeIds = checked
        ? [...prev.specimenTypeIds, value]
        : prev.specimenTypeIds.filter((id: number) => id !== value);

      getReCollectData(updatedSpecimenTypeIds);

      return { ...prev, specimenTypeIds: updatedSpecimenTypeIds };
    });
  };

  const handleChange = (name: string, value: any) => {
    if (name === "cancellationReasonAll") {
      setRecollectValues((prev: any) => ({
        ...prev,
        tests: prev?.tests?.map((test: any) => ({
          ...test,
          rejectReasonId: value,
        })),
      }));
    } else {
      setRecollectValues((prev: any) => {
        return { ...prev, [name]: value };
      });
    }
  };

  const handleChangeSelect = (name: string, value: any, testId: number) => {
    setRecollectValues((prev: any) => ({
      ...prev,
      tests: prev.tests.map((test: any) =>
        test.testId === testId
          ? {
            ...test,
            rejectReasonId: value,
          }
          : test
      ),
    }));
  };

  const handleInputsChange = (name: string, value: string, Id: any) => {
    setData((curr: any) => ({
      ...curr,
      gridData: curr.gridData.map((x: any) =>
        x.RequisitionOrderId === Id ||
          x.PhlAssignmentId === Id ||
          x.RejectionReasonID === Id
          ? {
            ...x,
            [name]: value,
          }
          : x
      ),
    }));
  };

  const handleChangeReDraw = (name: string, value: any) => {
    setReDrawValues((prev: any) => {
      return { ...prev, [name]: value };
    });
  };

  const saveReDraw = async () => {

    if (reDrawValues.reDrawDate === "") {
      toast.error(t("Please enter a valid re-draw date."));
      return;
    };

    const { isValid } = validateFields(reDrawValues);
    try {
      if (isValid) {
        const response = await RequisitionType.saveReDraw(reDrawValues);
        if (response?.data?.httpStatusCode === 200) {
          toast.success(t(response.data?.message));
          handleCloseReDrawModal();
          setReDrawValues(initialReDrawValues);
          loadGridData(true, false);
        } else {
          toast.error(t(response.data?.message));
        }
      } else {
        toast.error(t(`Please fill all the required fields.`));
      }
    } catch (error) {
      console.error("Error saving Re-Draw:", error);
    }
  };

  const saveReCollect = async () => {
    if (recollectValues.specimenTypeIds.length === 0) {
      toast.error(t("Please select at least one collected specimen."));
      return;
    }
    if (recollectValues.tests.length === 0) {
      toast.error(t("There is not test to recollect."));
      return;
    }

    if (recollectValues.cancellationDate === "") {
      toast.error(t("Please enter a valid recollect date."));
      return;
    }
    
    const rejectedReasonForAll = recollectValues.tests.filter(
      (rejected) => rejected.rejectReasonId === null
    );
    if (rejectedReasonForAll.length > 0) {
      toast.error(t("Please select a rejection reason for all tests."));
      return;
    }
    const payLoad = {
      requisitionId: recollectValues.requisitionId,
      requisitionOrderId: recollectValues.requisitionOrderId,
      cancellationReason: recollectValues.cancellationReason,
      cancellationComment: recollectValues.cancellationComment,
      reCollectDate: recollectValues.cancellationDate,
      specimen: dataRecollect?.specimenTypes.map((specimenType: any) => ({
        specimenId: specimenType.specimenTypeId,
        specimenName: specimenType.specimenTypeName,
        isCollected: recollectValues.specimenTypeIds.includes(
          specimenType.specimenTypeId
        ),
      })),
      test: recollectValues.tests.map((test: any) => ({
        testId: test.testId,
        rejectReasonId: test.rejectReasonId,
      })),
    };

    try {
      const response = await RequisitionType.saveReCollect(payLoad);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response.data?.message));
        handleCloseReCollect();
        loadGridData(true, false);
      } else {
        toast.error(t(response.data?.message));
      }
    } catch (error) {
      console.error("Error saving Re-Draw:", error);
    }
  };

  const savePhlebotomyAssignment = async () => {
    const obj = {
      facilityId: props.RowData.FacilityID,
      PhlebotomistId: props.RowData.PhlebotomistId,
    };

    try {
      const response = await savePhlebotomistsyAssignment(obj);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(response.data?.message);
      } else {
        toast.error(t(response.data?.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveRejectedReasons = async () => {
    const obj = {
      id: +props.RowData.RejectionReasonID,
      rejectType: props.RowData.RejectType,
      rejectReason: props.RowData.CancellationReason,
    };

    try {
      const response = await saveRejectedReason(obj);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response.data?.message));
      } else {
        toast.error(t(response.data?.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteRecords = async (tabId: any, id: number) => {
    try {
      const response = await deleteRecord(tabId, id);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response.data?.message));
        loadGridData(true, false);
      } else {
        toast.error(t(response.data?.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updateReadyForCollection = async () => {
    const obj = {
      requisitonOrderID: props.RowData.RequisitionOrderId,
      billingMileage: props.RowData.BillingMileage,
      nonBillingMileage: props.RowData.NonBillingMileage,
      recollectDate: props.RowData.RecollectDate,
      daysInQueue: props.RowData.DaysInQueue,
      drawLocation: props.RowData.DrawLocation,
      numberofAttempts: props.RowData.NumberofAttempts,
    };

    try {
      const response = await saveUdateWorkLog(obj);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(t(response.data?.message));
      } else {
        toast.error(t(response.data?.message));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const saveAPICalls = async () => {
    if (value === 0) {
      await updateReadyForCollection();
    } else if (value === 2) {
      await savePhlebotomyAssignment();
    } else if (value === 4) {
      await saveRejectedReasons();
    }
    setData((prev: any) => ({
      ...prev,
      gridData: [
        ...prev.gridData.map((item: any) => ({ ...item, rowStatus: false })), // Keep existing gridData
      ],
    }));
    handleCancel();
  };

  const handleCancel = () => {
    loadGridData(true, false);
  };

  const handleIndividualEdit = (id: any) => {
    setInputFields(
      inputFields.map((field: any) => ({
        ...field,
        show: field?.isIndividualEditable,
      }))
    );
    const updatedRows = data?.gridData.map((row: any) => {
      if (
        row.RequisitionOrderId === id ||
        row.PhlAssignmentId === id ||
        row.RejectionReasonID === id
      ) {
        return { ...row, rowStatus: true };
      }
      return row;
    });

    setData((prevVal: any) => ({
      ...prevVal,
      gridData: updatedRows,
    }));
    return;
  };

  const handleClickOpenCancel = () => {
    setShow(true);
    getRejectionReasonLookup();
  };

  const getRejectionReasonLookup = async () => {
    await RequisitionType.GetCancellationReasonLookup().then((res: any) => {
      setRejectionReason(res?.data);
    });
  };

  const handleChangeRejectionReasonDropdown = (event: any) => {
    setSelectedReason(event.label);
  };

  const ModalhandleClose = () => {
    setShow(false);
    setSelectedReason(null);
    setReason("");
  };

  const RejectDigitalCheckIn = async () => {
    if (!selectedReason) {
      return toast.error(
        t("A rejection reason is required. Please select one to proceed.")
      );
    }

    const obj = {
      statusId: 4,
      requisitionOrderIds: [props.RowData.RequisitionOrderId],
      actionReasons: selectedReason,
      rejectComment: reason,
    };

    try {
      const res: AxiosResponse =
        await RequisitionType.RejectDigitalCheckIn(obj);
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res.data?.message));
        setSelectedReason(null);
        setShow(false);
        loadGridData(true, false);
      } else {
        toast.error(t(res.data?.message));
        setSelectedReason(null);
      }
    } catch (error) {
      console.error("Error in RejectDigitalCheckIn:", error);
    }
  };

  const handleChangeForActionReason = (message: any) => {
    setReason(message);
  };

  return (
    <>
      {loading ? null : (
        <>
          <TableRow
            sx={{ "& > *": { borderBottom: "unset" } }}
            className="h-25px"
          >
            {value === 0 || value === 1 ? (
              <TableCell className="w-20px min-w-20px">
                <span onClick={() => setOpen(!open)}>
                  {open ? (
                    <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                      <RemoveICon />
                    </button>
                  ) : (
                    <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                      <AddIcon />
                    </button>
                  )}
                </span>
              </TableCell>
            ) : null}
            {value === 4 || value === 2 || value === 3 ? null : (
              <TableCell style={{ width: "49px" }}>
                <label className="form-check form-check-sm form-check-solid">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    checked={selectedBox?.requisitionOrderId?.includes(
                      NormalizedData(props?.RowData, "requisitionorderid")
                    )}
                    onChange={(e) =>
                      handleChangeSelectedIds(
                        e.target.checked,
                        NormalizedData(props?.RowData, "requisitionorderid")
                      )
                    }
                  />
                </label>
              </TableCell>
            )}
            {value === 3 ? null : !props.RowData.rowStatus ? (
              <TableCell className="min-w-50px w-50px">
                <div className="d-flex justify-content-center rotatebtnn">
                  <DropdownButton
                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                    key="end"
                    id="dropdown-button-drop-end"
                    drop="end"
                    title={<i className="bi bi-three-dots-vertical p-0"></i>}
                  >
                    {value === 0 ? (
                      <>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="View"
                        >
                          <Dropdown.Item
                            eventKey="0"
                            onClick={() => {
                              const tokenData: any =
                                sessionStorage.getItem("userinfo");
                              localStorage.setItem("userinfo", tokenData);
                              openInNewTab(
                                `/OrderView/${btoa(
                                  NormalizedData(
                                    props?.RowData,
                                    "requisitionid"
                                  )
                                )}/${btoa(
                                  NormalizedData(
                                    props?.RowData,
                                    "requisitionorderid"
                                  )
                                )}`
                              );
                            }}
                          >
                            <button
                              role="link"
                              className="px-0 border-0 bg-transparent "
                            >
                              <i className="fa fa-eye text-success mr-2 w-20px"></i>
                              {t("View")}
                            </button>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="Edit"
                        >
                          <Dropdown.Item
                            eventKey="1"
                            onClick={() =>
                              handleIndividualEdit(
                                props?.RowData.RequisitionOrderId
                              )
                            }
                          >
                            <div>
                              <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                              {t("Edit")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="Edit"
                        >
                          <Dropdown.Item
                            eventKey="2"
                            onClick={() => handleClickOpen()}
                          >
                            <div>
                              <i
                                className="fa fa-briefcase mr-2 w-20px"
                                style={{ color: "#2596be" }}
                              ></i>
                              {t("Re-Collect")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="Edit"
                        >
                          <Dropdown.Item
                            eventKey="3"
                            onClick={() => handleClickOpenReDrwaModal()}
                          >
                            <div>
                              <i className="fa fa-pen text-primary mr-2 w-20px"></i>
                              {t("Re-Draw")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="Edit"
                        >
                          <Dropdown.Item
                            eventKey="4"
                            onClick={() => {
                              handleClickOpenCancel();
                            }}
                          >
                            <div>
                              <i className="fa fa-times text-danger mr-2 w-20px"></i>
                              {t("Cancel")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                      </>
                    ) : value === 2 ? (
                      <>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="View"
                        >
                          <Dropdown.Item
                            eventKey="0"
                            onClick={() =>
                              handleIndividualEdit(
                                props?.RowData.PhlAssignmentId
                              )
                            }
                          >
                            <div>
                              <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                              {t("Edit")}
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="1"
                            onClick={handleClickOpenDeleteModal}
                          >
                            <div>
                              <i className="fa  fa-trash text-danger mr-2 w-20px"></i>
                              {t("Delete")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                      </>
                    ) : value === 1 ? (
                      <>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="View"
                        >
                          <Dropdown.Item eventKey="0">
                            <button
                              role="link"
                              className="px-0 border-0 bg-transparent"
                              onClick={() => {
                                const tokenData: any =
                                  sessionStorage.getItem("userinfo");
                                localStorage.setItem("userinfo", tokenData);
                                openInNewTab(
                                  `/OrderView/${btoa(
                                    NormalizedData(
                                      props?.RowData,
                                      "requisitionid"
                                    )
                                  )}/${btoa(
                                    NormalizedData(
                                      props?.RowData,
                                      "requisitionorderid"
                                    )
                                  )}`
                                );
                              }}
                            >
                              <i className="fa fa-eye text-success mr-2 w-20px"></i>
                              {t("View")}
                            </button>
                          </Dropdown.Item>
                        </PermissionComponent>
                      </>
                    ) : value === 4 ? (
                      <>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="View Requisition"
                          permissionIdentifier="View"
                        >
                          <Dropdown.Item
                            eventKey="0"
                            onClick={() =>
                              handleIndividualEdit(
                                props?.RowData.RejectionReasonID
                              )
                            }
                          >
                            <div>
                              <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                              {t("Edit")}
                            </div>
                          </Dropdown.Item>
                          <Dropdown.Item
                            eventKey="1"
                            onClick={handleClickOpenDeleteModal}
                          >
                            <div>
                              <i className="fa  fa-trash text-danger mr-2 w-20px"></i>
                              {t("Delete")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                      </>
                    ) : null}
                  </DropdownButton>
                </div>
              </TableCell>
            ) : (
              <div className="gap-2 d-flex">
                <button
                  onClick={() => saveAPICalls()}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-30px w-30px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  onClick={() => handleCancel()}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-30px w-30px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            )}

            {props?.tabsInfo?.map((tabData: any, columnHeaderIndex: number) => {
              if (
                !tabData?.isShowOnUi ||
                tabData?.isExpandData ||
                !tabData?.isShow
              )
                return null;

              if (
                props.RowData.rowStatus &&
                inputFields[columnHeaderIndex].show
              ) {
                return (
                  <DynamicAddNewInputs
                    key={tabData.id}
                    item={props.RowData}
                    column={tabData}
                    columnHeaderIndex={columnHeaderIndex}
                    handleInputsChange={handleInputsChange}
                    inputFields={inputFields}
                  />
                );
              }

              const columnValue = props?.RowData?.[tabData?.columnKey];

              if (tabData?.columnKey.toLowerCase() === "status") {
                const statusClasses: Record<string, string> = {
                  "Specimen Collected": "badge-status-specimen-collected",
                  Processing: "badge-status-processing",
                  "Result Available": "badge-status-result-available",
                  Completed: "badge-status-complete",
                  Deleted: "badge-status-deleted",
                  Validated: "badge-status-validated",
                  "Save For Signature": "badge-status-waiting-for-Signature",
                  "On Hold": "badge-status-hold",
                  "Missing Info": "badge-status-missing-info",
                  "In Transit": "badge-status-in-transit",
                  Canceled: "badge-status-canceled",
                  Approved: "badge-status-approved",
                  Pending: "badge-status-pending",
                  Rejected: "badge-status-rejected",
                  Shipped: "badge-status-shipped",
                };

                return (
                  <TableCell
                    key={columnHeaderIndex}
                    sx={{ width: "max-content", textAlign: "center" }}
                  >
                    <Status
                      cusText={columnValue}
                      cusClassName={
                        statusClasses[columnValue] || "badge-status-default"
                      }
                    />
                  </TableCell>
                );
              }
              let keyData = props?.RowData?.[tabData?.columnKey];

              const field = inputFields?.[columnHeaderIndex];
              if (
                field?.jsonOptionData &&
                field?.inputType.toLowerCase() === "dropdown"
              ) {
                try {
                  // debugger;
                  const parsedData = JSON.parse(field.jsonOptionData);

                  const match = parsedData.find(
                    (item: any) => item.value === keyData
                  );
                  keyData = match?.label || "";
                } catch (error) {
                  console.error("Failed to parse jsonOptionData:", error);
                  keyData = "";
                }
              }

              if (tabData?.filterColumnsType.toLowerCase() === "datepicker") {
                keyData = keyData ? moment(keyData).format("MM/DD/YYYY") : null;
              }

              if (tabData?.columnKey.toLowerCase() === "flag") {
                return columnValue ? (
                  <TableCell key={columnHeaderIndex}>
                    <div className="d-flex justify-content-center">
                      <button className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light">
                        <i className="fa fa-flag cursor-pointer"></i>
                      </button>
                    </div>
                  </TableCell>
                ) : null;
              }

              return (
                <TableCell
                  key={columnHeaderIndex}
                  sx={{ width: "max-content", whiteSpace: "nowrap" }}
                >
                  {keyData}
                </TableCell>
              );
            })}
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={props?.tabsInfo.length + 3}
              className="padding-0"
            >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Typography gutterBottom component="div">
                    <div className="row">
                      <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                        <ExpandInfo
                          reqOrderId={props.RowData.RequisitionOrderId}
                          key={props.RowData?.RequisitionOrderId}
                        />
                      </div>
                    </div>
                  </Typography>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
          <Modal
            show={openalert}
            onHide={handleCloseAlert}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-light-primary m-0 p-5">
              <h4>{t("Delete")}</h4>
            </Modal.Header>
            <Modal.Body>
              {t("Are you sure you want to delete this record?")}
            </Modal.Body>
            <Modal.Footer className="p-0">
              <button
                id={`DeleteModalCancel`}
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseAlert}
              >
                {t("Cancel")}
              </button>
              <button
                id={`DeleteModalConfirm`}
                type="button"
                className="btn btn-danger m-2"
                onClick={() => {
                  deleteRecords(
                    tabIdToSend,
                    value === 2
                      ? props?.RowData.PhlAssignmentId
                      : props?.RowData.RejectionReasonID
                  );
                  handleCloseAlert();
                }}
              >
                <span>{t("Delete")}</span>
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={openRecollect}
            onHide={handleCloseReCollect}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <Modal.Header closeButton className="m-0 p-5">
              <h4>{t("Re-Collect Sample")}</h4>
            </Modal.Header>
            <Modal.Body>
              <div style={{ backgroundColor: "#FAFAD2" }} className="rounded">
                <p className="px-4 py-2 fw-bold">
                  {t(
                    "Note: Please select the specimen(s) you have collected and leave the specimen(s) you have NOT collected blank."
                  )}
                </p>
              </div>
              <p className="fw-bold">{t("Specimen Type")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                {/* <label className="d-flex justify-content-start align-items-start flex-wrap gap-3"> */}
                {dataRecollect?.specimenTypes.map((specimenType: any) => (
                  <div key={specimenType.specimenTypeId}>
                    <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={specimenType.specimenTypeId}
                        checked={recollectValues.specimenTypeIds.includes(
                          specimenType.specimenTypeId
                        )}
                        name="specimenTypeId"
                        onChange={(e: any) =>
                          handleChangeChecked(+e.target.value, e.target.checked)
                        }
                      />
                      <span className="ps-2 mr-2">
                        {specimenType.specimenTypeName}
                      </span>
                    </label>
                  </div>
                ))}
                {/* </label> */}
              </div>
              <p className="fw-bold">{t("Cancellation Reason For All")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <Select
                  menuPortalTarget={document.body}
                  theme={(theme: any) => styles(theme)}
                  options={rejectedReasonLookup}
                  styles={reactSelectStyle}
                  name="cancellationReasonAll"
                  placeholder={t("--- Select ---")}
                  onChange={(event: any) =>
                    handleChange("cancellationReasonAll", event.value)
                  }
                  isSearchable={true}
                  className="w-100"
                />
              </div>
              <p className="fw-bold">{t("Add Comments")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <input
                  type="text"
                  className="form-control bg-transparent"
                  name="cancellationComment"
                  value={recollectValues.cancellationComment}
                  onChange={(event: any) =>
                    handleChange("cancellationComment", event.target.value)
                  }
                />
              </div>
              <p className="fw-bold">{t("Select Date")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <input
                  type="date"
                  className="form-control bg-transparent"
                  name="cancellationDate"
                  value={recollectValues.cancellationDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(event: any) =>
                    handleChange("cancellationDate", event.target.value)
                  }
                />
              </div>
              <div className="align-items-center card-header d-flex justify-content-center justify-content-sm-between gap-1 mt-5 pb-5">
                <Box sx={{ height: "auto", width: "100%" }}>
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={{
                        maxHeight: "calc(100vh - 100px)",
                        "&::-webkit-scrollbar": {
                          width: 7,
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "#fff",
                        },
                        "&:hover": {
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "var(--kt-gray-400)",
                            borderRadius: 2,
                          },
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      }}
                      className="shadow-none"
                    >
                      <Table
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header plate-mapping-table table-bg table-head-custom table-vertical-center border-0 mb-0 "
                      >
                        <TableHead style={{ zIndex: 10000 }}>
                          <TableRow className="h-40px">
                            <TableCell className="w-50">
                              {t("Test Name")}
                            </TableCell>
                            <TableCell>{t("Specimen Type")}</TableCell>
                            <TableCell>{t("Rejected Reason")}</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dataRecollect?.tests?.length ? (
                            recollectValues?.tests?.map((item: any) => (
                              <TableRow
                                className="h-40px"
                                key={item?.requisitionTestID}
                              >
                                <TableCell>{item?.testName}</TableCell>
                                <TableCell>{item?.specimenTypeName}</TableCell>
                                <TableCell>
                                  <Select
                                    menuPortalTarget={document.body}
                                    theme={(theme: any) => styles(theme)}
                                    options={rejectedReasonLookup}
                                    styles={reactSelectStyle}
                                    name="rejectReasonId"
                                    placeholder="--- Select ---"
                                    onChange={(event: any) =>
                                      handleChangeSelect(
                                        "rejectReasonId",
                                        event.value,
                                        item?.testId
                                      )
                                    }
                                    value={rejectedReasonLookup.filter(
                                      (rejected: any) =>
                                        rejected.value === item.rejectReasonId
                                    )}
                                    closeMenuOnScroll={(e) =>
                                      closeMenuOnScroll(e)
                                    }
                                    isSearchable={true}
                                    className="w-100"
                                  />
                                </TableCell>
                              </TableRow>
                            ))
                          ) : (
                            <NoRecord />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
              </div>
            </Modal.Body>
            <Modal.Footer className="p-0">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCloseReCollect}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => {
                  saveReCollect();
                }}
              >
                {t("Save")}
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={openReDraw}
            onHide={handleCloseReDrawModal}
            backdrop="static"
            keyboard={false}
            size="lg"
          >
            <Modal.Header closeButton className="m-0 p-5">
              <h4>{t("Re-Draw Sample")}</h4>
            </Modal.Header>
            <Modal.Body>
              <p className="fw-bold required">{t("Re-Draw Reason For All")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <Select
                  menuPortalTarget={document.body}
                  theme={(theme: any) => styles(theme)}
                  options={cancellationReasonLookup}
                  styles={reactSelectStyle}
                  name="reDrawReason"
                  placeholder="--- Select ---"
                  onChange={(event: any) =>
                    handleChangeReDraw("reDrawReason", event.label)
                  }
                  // value={genderOptions.filter(
                  //   (gender: any) => gender.value == section.gender
                  // )}
                  isSearchable={true}
                  className="w-100"
                />
              </div>
              <p className="fw-bold required">{t("Add Comments")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <input
                  type="text"
                  className="form-control bg-transparent"
                  name="reDrawComment"
                  placeholder="..."
                  // value={section.comments}
                  onChange={(event: any) =>
                    handleChangeReDraw("reDrawComment", event.target.value)
                  }
                />
              </div>
              <p className="fw-bold required">{t("Select Date")}</p>
              <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                <input
                  type="date"
                  className="form-control bg-transparent"
                  name="reDrawDate"
                  min={new Date(Date.now() + 24 * 60 * 60 * 1000)
                    .toISOString()
                    .split("T")[0]}
                  max={
                    new Date(Date.now() + 4 * 24 * 60 * 60 * 1000)
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(event: any) =>
                    handleChangeReDraw("reDrawDate", event.target.value)
                  }
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="p-0">
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleCloseReDrawModal}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-primary m-2"
                onClick={() => {
                  saveReDraw();
                }}
              >
                {t("Save")}
              </button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={show}
            onHide={ModalhandleClose}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton className="bg-light-primary m-0 p-5">
              <h4>{t("Reason")}</h4>
            </Modal.Header>
            <Modal.Body>
              <div className="fv-row mb-4">
                <label htmlFor="status" className="mb-2 required form-label">
                  {t("Select Reason")}
                </label>
                <Select
                  options={rejectionReason}
                  placeholder={"Select Reason"}
                  theme={(theme) => styles(theme)}
                  isSearchable={true}
                  onChange={(e) => handleChangeRejectionReasonDropdown(e)}
                  styles={reactSelectStyle}
                />
              </div>
              <div className="mt-5">
                <label className="form-label">{t("Rejection Comment")}</label>
                <textarea
                  name="rejectComment"
                  className="form-control bg-transparent mb-3 mb-lg-0 h-50px"
                  placeholder="Rejection Comments"
                  required
                  onChange={(event: any) =>
                    handleChangeForActionReason(event?.target?.value)
                  }
                />
              </div>
            </Modal.Body>
            <Modal.Footer className="p-0">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={ModalhandleClose}
              >
                {t("Cancel")}
              </button>
              <button
                type="button"
                className="btn btn-danger m-2"
                onClick={() => {
                  RejectDigitalCheckIn();
                }}
              >
                {t("Reject")}
              </button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </>
  );
};

export default React.memo(Row);
