import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { savePdfUrls } from "Redux/Actions/Index";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon, RemoveICon } from "Shared/Icons";
import { dateFormatConversion } from "Utils/Common/viewRequisitiontabs";
import { useBillingContext } from "./useReqContext";

export const NormalizedData = (obj: any, key: any) => {
  if (!obj || !key) return undefined;
  const normalizedKey = Object.keys(obj).find(
    (k: any) => k.toLowerCase() === key.toLowerCase()
  );
  return normalizedKey ? obj[normalizedKey] : undefined;
};

interface Panels {
  value: number;
  label: string;
}

const Row = (props: any) => {
  const { selectedBox, setSelectedBox, filterData, loading, loadGridData } =
    useBillingContext();

  const { t } = useLang();
  const dispatch = useDispatch();

  const [openPanel, setOpenPanel] = useState(false);
  const [billingPanels, setBillingPanels] = useState<Panels[]>([]);

  const handleChangeRequisitionIds = (
    checked: boolean,
    id: number,
    rid: number
  ) => {
    setSelectedBox((prev: any) => {
      const updateIds = (ids: any[], value: number) =>
        checked ? [...ids, value] : ids.filter((item) => item !== value);

      return {
        ...prev,
        requisitionOrderId: updateIds(prev?.requisitionOrderId || [], id),
        requisitionId: updateIds(prev?.requisitionId || [], rid),
      };
    });
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };

  const panels = async () => {
    let res = await RequisitionType.GetBillingPanels(
      props?.RowData.RequisitionOrderID
    );
    setBillingPanels(res.data);
  };

  async function handleDropdownAction(
    action: string,
    requisitionOrderIDs: any[]
  ) {
    const DropDownAct = {
      billingStatus: action,
      requisitionOrderIds: [requisitionOrderIDs],
    };
    let resp = await RequisitionType.ChangeBillingStatus(DropDownAct);
    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
      loadGridData();
    } else {
      toast.error(t("Something Went Wrong..."));
    }
  }

  return (
    <>
      {loading ? null : (
        <>
          <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
            <TableCell
              id={`RequisitionExpand_${NormalizedData(
                props?.RowData,
                "requisitionorderid"
              )}`}
            >
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => {
                  setOpenPanel(!openPanel);
                }}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
              >
                {openPanel ? (
                  <button
                    id={`RequisitionHide_${NormalizedData(
                      props?.RowData,
                      "requisitionorderid"
                    )}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    onClick={panels}
                    id={`RequisitionShow_${NormalizedData(
                      props?.RowData,
                      "requisitionorderid"
                    )}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </IconButton>
            </TableCell>
            <TableCell
              id={`RequisitionCheckBox_${NormalizedData(
                props?.RowData,
                "requisitionorderid"
              )}`}
              style={{ width: "49px" }}
            >
              <label className="form-check form-check-sm form-check-solid">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={selectedBox?.requisitionOrderId?.includes(
                    NormalizedData(props?.RowData, "requisitionorderid")
                  )}
                  onChange={(e) =>
                    handleChangeRequisitionIds(
                      e.target.checked,
                      NormalizedData(props?.RowData, "requisitionorderid"),
                      NormalizedData(props?.RowData, "requisitionid")
                    )
                  }
                />
              </label>
            </TableCell>
            <TableCell className="min-w-50px w-50px">
              <div className="d-flex justify-content-center rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`BillingRequisition3Dots_${NormalizedData(
                    props?.RowData,
                    "requisitionorderid"
                  )}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="Billing"
                      permissionIdentifier="View"
                    >
                      <Dropdown.Item id="BillingRequisitionView" eventKey="6">
                        <button
                          role="link"
                          className="px-0 border-0 bg-transparent"
                          onClick={() => {
                            let tokenData: any =
                              sessionStorage.getItem("userinfo");
                            localStorage.setItem("userinfo", tokenData);
                            openInNewTab(
                              `/OrderView/${btoa(
                                NormalizedData(props?.RowData, "requisitionid")
                              )}/${btoa(
                                NormalizedData(
                                  props?.RowData,
                                  "requisitionorderid"
                                )
                              )}`
                            );
                          }}
                        >
                          <i className="fa fa-eye text-warning mr-2 w-20px"></i>
                          {t("View")}
                        </button>
                      </Dropdown.Item>
                    </PermissionComponent>
                    {filterData.tabId === 2 ? (
                      <>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="Billing"
                          permissionIdentifier="DoNotBill"
                        >
                          <Dropdown.Item
                            id="BillingRequisitionDoNotBill"
                            eventKey="1"
                          >
                            <div
                              onClick={() =>
                                handleDropdownAction(
                                  "Do Not Bill",
                                  props?.RowData.RequisitionOrderID
                                )
                              }
                            >
                              <i className="bi bi-ban text-danger mr-2 w-20px"></i>
                              {t("Do Not Bill")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="Billing"
                          permissionIdentifier="ManuallyBilled"
                        >
                          <Dropdown.Item
                            id="BillingRequisitionManuallyBilled"
                            eventKey="2"
                          >
                            <div
                              onClick={() =>
                                handleDropdownAction(
                                  "Manually Billed",
                                  props?.RowData.RequisitionOrderID
                                )
                              }
                            >
                              <i className="bi bi-receipt-cutoff text-primary mr-2 w-20px"></i>
                              {t("Manually Billed")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="Billing"
                          permissionIdentifier="SendtoBilling"
                        >
                          <Dropdown.Item
                            id="BillingRequisitionSendToBilling"
                            eventKey="3"
                          >
                            <div
                              onClick={() =>
                                handleDropdownAction(
                                  "Send To Billing",
                                  props?.RowData.RequisitionOrderID
                                )
                              }
                            >
                              <i className="bi bi-send-fill text-success mr-2 w-20px"></i>
                              {props?.RowData?.BillingStatus ===
                              "Queued for Billing"
                                ? t("Resend To Billing")
                                : t("Send To Billing")}
                            </div>
                          </Dropdown.Item>
                        </PermissionComponent>
                      </>
                    ) : null}
                    {filterData.tabId === 5 ? (
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="Billing"
                        permissionIdentifier="Restore"
                      >
                        <Dropdown.Item
                          id="BillingRequisitionRestore"
                          eventKey="4"
                          onClick={() =>
                            handleDropdownAction(
                              "Restore",
                              props?.RowData.RequisitionOrderID
                            )
                          }
                        >
                          <div>
                            <i className="fa fa-refresh text-success mr-2 w-20px"></i>
                            {t("Restore")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                    ) : null}
                    {filterData.tabId === 3 ? (
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="Billing"
                        permissionIdentifier="Complete"
                      >
                        <Dropdown.Item
                          id="BillingRequisitionComplete"
                          eventKey="5"
                        >
                          <div
                            onClick={() =>
                              handleDropdownAction(
                                "Billing Collected",
                                props?.RowData.RequisitionOrderID
                              )
                            }
                          >
                            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                            {t("Complete")}
                          </div>
                        </Dropdown.Item>
                      </PermissionComponent>
                    ) : null}
                  </>
                </DropdownButton>
              </div>
            </TableCell>
            {props?.tabsInfo &&
              props?.tabsInfo.map((tabData: any, index: number) => (
                <>
                  {tabData?.isShowOnUi && tabData?.isShow ? (
                    <>
                      {tabData?.columnKey.toLowerCase() === "resultfile" ? (
                        <TableCell
                          id={`RequisitionPDFFile_${NormalizedData(
                            props?.RowData,
                            "requisitionorderid"
                          )}`}
                        >
                          <div className="d-flex justify-content-center">
                            {props.RowData?.[tabData?.columnKey] ? (
                              <Link to={`/docs-viewer`} target="_blank">
                                <i
                                  className="bi bi-file-earmark-pdf text-danger fa-2x cursor-pointer"
                                  onClick={() => {
                                    dispatch(
                                      savePdfUrls(
                                        props?.RowData?.[tabData?.columnKey]
                                      )
                                    );
                                  }}
                                ></i>
                              </Link>
                            ) : null}
                          </div>
                        </TableCell>
                      ) : tabData?.columnKey.toLowerCase() === "status" ? (
                        <TableCell
                          id={`RequisitionStatus_${NormalizedData(
                            props?.RowData,
                            "requisitionorderid"
                          )}`}
                          sx={{ width: "max-content", textAlign: "center" }}
                        >
                          <Status
                            cusText={props?.RowData?.[tabData?.columnKey]}
                            cusClassName={
                              props?.RowData?.[tabData?.columnKey] ===
                              t("Specimen Collected")
                                ? "badge-status-specimen-collected"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Processing")
                                ? "badge-status-processing"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Complete")
                                ? "badge-status-complete"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Deleted")
                                ? "badge-status-deleted"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Validated")
                                ? "badge-status-validated"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Save For Signature")
                                ? "badge-status-save-for-signature"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("On Hold")
                                ? "badge-status-hold"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Missing Info")
                                ? "badge-status-missing-info"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("In Transit")
                                ? "badge-status-in-transit"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Canceled")
                                ? "badge-status-canceled"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Approved")
                                ? "badge-status-approved"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Pending")
                                ? "badge-status-pending"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Rejected")
                                ? "badge-status-rejected"
                                : props?.RowData?.[tabData?.columnKey] ===
                                  t("Shipped")
                                ? "badge-status-shipped"
                                : "badge-status-default"
                            }
                          />
                        </TableCell>
                      ) : (
                        <TableCell
                          id={`${tabData?.columnKey}_${NormalizedData(
                            props?.RowData,
                            "requisitionorderid"
                          )}`}
                          sx={{ width: "max-content", whiteSpace: "nowrap" }}
                        >
                          {dateFormatConversion(
                            props?.RowData,
                            tabData?.columnKey
                          )}
                        </TableCell>
                      )}
                    </>
                  ) : null}
                </>
              ))}
          </TableRow>
          <TableRow>
            <TableCell
              colSpan={props?.tabsInfo?.length + 3}
              className="padding-0"
            >
              <Collapse in={openPanel} timeout="auto" unmountOnExit>
                <div className="row mt-3">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                      <span className="text-primary fw-bold">
                        {t("Selected Panels")}
                      </span>
                      <div className="d-flex flex-wrap mt-3 gap-2">
                        {billingPanels.map((index: any) => (
                          <div
                            className="px-2 py-1"
                            style={{
                              width: "fit-content",
                              backgroundColor: "#d1d7db",
                              borderRadius: "5px",
                            }}
                          >
                            {index.value}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};

export default React.memo(Row);
