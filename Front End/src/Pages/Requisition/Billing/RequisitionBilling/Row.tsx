import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  TableCell,
  TableRow,
  MenuItem,
  IconButton,
  Collapse,
  Box,
  Typography,
} from "@mui/material";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { AddIcon, LoaderIcon, RemoveICon } from "Shared/Icons";
import { savePdfUrls } from "Redux/Actions/Index";
import { dateFormatConversion } from "Utils/Common/viewRequisitiontabs";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import printBarcode from "Pages/Printing/ZebraPrint";
import DymoLabel from "Pages/Printing/DymoPrint";
import { useBillingDataContext } from "Shared/BillingContext";

interface Panels {
  value: number;
  label: string;
}

const Row = (props: any) => {
  const {
    data,
    selectedBox,
    setSelectedBox,
    NextStep,
    isSubmittingNextStepAction,
    filterData,
    loadDataAllRequisition,
    loading,
  } = useBillingDataContext();

  const { t } = useLang();
  const dispatch = useDispatch();
  const [Duplicate, setDuplicate] = useState(false);
  const [selectedItem, setSelectedItem] = useState();
  const pdfFileRefs = React.useRef<any>([]);
  const navigate = useNavigate();
  const NormalizedData = (obj: any, key: any) => {
    if (!obj || !key) return undefined;
    const normalizedKey = Object.keys(obj).find(
      (k: any) => k.toLowerCase() === key.toLowerCase()
    );
    return normalizedKey ? obj[normalizedKey] : undefined;
  };

  const handleChangeRequisitionIds = (
    checked: boolean,
    id: number,
    rid: number
  ) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionOrderId: [...(pre?.requisitionOrderId || []), id],
          requisitionId: [...(pre?.requisitionId || []), rid],
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
          requisitionId: selectedBox.requisitionId.filter(
            (item: any) => item !== rid
          ),
        };
      });
    }
  };

  const normalizeKeys = (obj: any) => {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {});
  };

  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const PrintLabel = async (option: any, printerId: number) => {
    let objToSend = {
      printerId: printerId,
      contentList: [
        {
          requisitionOrderId: NormalizedData(
            props?.RowData,
            "requisitionorderid"
          ),
          requisitionId: NormalizedData(props?.RowData, "requisitionid"),
        },
      ],
    };
    const content = await getPrinterContentData(objToSend);
    if (option?.includes("zebra") || option?.includes("Zebra")) {
      let i: any;
      for (i = 0; i < content.length; i++) {
        printBarcode(content[i]);
      }
      handleClose("dropdown4");
      return;
    }
    if (option.includes("dymo") || option.includes("Dymo")) {
      let i: any;
      for (i = 0; i < content.length; i++) {
        DymoLabel(content[i]);
      }
      handleClose("dropdown4");
      return;
    } else {
      toast.error(t("Configuration not available"));
      return;
    }
  };

  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleSave = async (pdfFileRef: any | null, event: any, item: any) => {
    const normalizedRowData = normalizeKeys(item);
    setSelectedItem(item);
    const formData = new FormData();
    if (pdfFileRef && pdfFileRef.files && pdfFileRef.files.length > 0) {
      const reader = new FileReader();
      const pdfFile = pdfFileRef.files[0];
      reader.onload = async (event: any) => {
        formData.append("file", pdfFile);
        formData.append("RequisitionId", normalizedRowData?.requisitionid);
        formData.append("NextStep", normalizedRowData?.nextstep);
        formData.append(
          "RequisitionOrderId",
          normalizedRowData?.requisitionorderid
        );
        formData.append("RecordId", normalizedRowData?.recordid);
        formData.append(
          "RequisitionType",
          normalizedRowData?.requisitiontypeid
        );
        NextStep(formData);
      };
      reader.readAsDataURL(pdfFile);
    } else {
      formData.append("RequisitionId", normalizedRowData?.requisitionid);
      formData.append("NextStep", normalizedRowData?.nextstep);
      formData.append(
        "RequisitionOrderId",
        normalizedRowData?.requisitionorderid
      );
      formData.append("RecordId", normalizedRowData?.recordid);
      formData.append("RequisitionType", normalizedRowData?.requisitiontypeid);
      NextStep(formData);
    }
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };
  const [billingPanels, setBillingPanels] = useState<Panels[]>([]);
  const panels = async () => {
    let res = await RequisitionType.GetBillingPanels(
      props?.RowData.RequisitionOrderID
    );
    setBillingPanels(res.data);
  };

  useEffect(() => {
    setDuplicate(false);
    setBillingPanels([]);
    setSelectedBox((pre: any) => {
      return {
        ...pre,
        requisitionOrderId: [],
        requisitionId: [],
      };
    });
  }, [filterData?.tabId]);

  const [dropdownAction, setDropdownAction] = useState<
    { action: string; joinedId: number[] } | undefined
  >();
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
      loadDataAllRequisition();
    } else {
      toast.error(t("Something Went Wrong..."));
    }
  }
  console.log("nknknk.........", props);
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
                  setDuplicate(!Duplicate);
                  panels();
                }}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
              >
                {Duplicate ? (
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
            {/* {filterData?.tabId === 6 ? null : ( */}
              <TableCell style={{ width: "49px" }}>
                <label className="form-check form-check-sm form-check-solid">
                  <input
                    id={`BillingRequisitionCheckBox_${NormalizedData(
                      props?.RowData,
                      "requisitionorderid"
                    )}`}
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
            {/* )} */}

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
                              <img src={`${process.env.PUBLIC_URL + "/media/menu-svg/donotbill.svg"}`} className="mr-2 w-20px" alt="" />
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
                            className="w-150px"
                          >
                            <div
                              onClick={() =>
                                handleDropdownAction(
                                  "Manually Billed",
                                  props?.RowData.RequisitionOrderID
                                )
                              }
                            >
                              <img src={`${process.env.PUBLIC_URL + "/media/menu-svg/Billed.svg"}`} className="mr-2 w-20px" alt="" />
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
                            className="w-175px"
                          >
                            <div
                              onClick={() =>
                                handleDropdownAction(
                                  "Send To Billing",
                                  props?.RowData.RequisitionOrderID
                                )
                              }
                            >
                              <img src={`${process.env.PUBLIC_URL + "/media/menu-svg/sendtoADSC.svg"}`} className="mr-2 w-20px" alt="" />
                              {props?.RowData?.BillingStatus ===
                              "Queued for Billing"
                                ? "Resend To Billing"
                                : "Send To Billing"}
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
                  {/* )} */}
                </DropdownButton>
              </div>
            </TableCell>
            {props?.tabsInfo &&
              props?.tabsInfo.map((tabData: any, index: number) => (
                <>
                  {tabData?.isShowOnUi && tabData?.isShow ? (
                    <>
                      {tabData?.columnKey?.toLowerCase() === "printlabel" ? (
                        <TableCell>
                          <div style={{ width: "max-content" }}>
                            <StyledDropButton
                              id={`BillingRequisitionPrintLabel_${NormalizedData(
                                props?.RowData,
                                "requisitionorderid"
                              )}`}
                              aria-controls={
                                openDrop ? "demo-positioned-menu4" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) =>
                                handleClick(event, "dropdown4")
                              }
                              className="btn btn-dark-brown btn-sm py-0 fw-400 fa-1x min-h-25px h-25px w-100px"
                            >
                              {t("Print Label")}
                              <span className="svg-icon svg-icon-5 m-0">
                                <ArrowBottomIcon />
                              </span>
                            </StyledDropButton>
                            <StyledDropMenu
                              aria-labelledby="demo-positioned-button4"
                              anchorEl={anchorEl.dropdown4}
                              open={Boolean(anchorEl.dropdown4)}
                              onClose={() => handleClose("dropdown4")}
                              anchorOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                              className="w-auto"
                            >
                              {data?.printersInfo?.map((option: any) => (
                                <MenuItem
                                  onClick={() =>
                                    PrintLabel(option?.label, option.value)
                                  }
                                  className="w-auto"
                                  key={option.value}
                                  value={option.value}
                                >
                                  <i className="fa fa fa-print text-warning mr-2 w-20px"></i>
                                  {option?.label}
                                </MenuItem>
                              ))}
                            </StyledDropMenu>
                          </div>
                        </TableCell>
                      ) : tabData?.columnKey.toLowerCase() === "nextstep" ? (
                        <TableCell align="left">
                          <div className="col-12 text-center">
                            {props?.RowData?.[
                              tabData?.columnKey
                            ]?.toLowerCase() === "upload result" ? (
                              <>
                                <button
                                  className="badge badge-pill badge-success py-3 px-4 border-0 fw-400 fa-1x"
                                  onClick={() =>
                                    pdfFileRefs?.current[index]?.click()
                                  }
                                  disabled={isSubmittingNextStepAction}
                                >
                                  {isSubmittingNextStepAction &&
                                  selectedItem === props?.RowData ? (
                                    <LoaderIcon />
                                  ) : (
                                    props?.RowData?.[tabData?.columnKey]
                                  )}

                                  <input
                                    type="file"
                                    accept=".pdf"
                                    onChange={(e) => {
                                      handleSave(
                                        pdfFileRefs?.current[index],
                                        e,
                                        props?.RowData
                                      );
                                    }}
                                    id="uploadfile"
                                    placeholder={
                                      props?.RowData?.[tabData?.columnKey]
                                    }
                                    className="d-none"
                                    ref={(el) =>
                                      (pdfFileRefs.current[index] = el)
                                    }
                                  />
                                </button>
                              </>
                            ) : props?.RowData?.[
                                tabData?.columnKey
                              ]?.toLowerCase() === "continue" ? (
                              <button
                                className="badge badge-pill badge-success py-3 px-4 border-0 fw-400 fa-1x"
                                onClick={() => {
                                  let data = {
                                    reqId: NormalizedData(
                                      props?.RowData,
                                      "requisitionid"
                                    ),
                                    status: NormalizedData(
                                      props?.RowData,
                                      "requisitionstatus"
                                    ),
                                    orderid: NormalizedData(
                                      props?.RowData,
                                      "requisitionorderid"
                                    ),
                                  };
                                  navigate(`/requisition`, {
                                    state: data,
                                  });
                                }}
                              >
                                {props?.RowData?.[tabData?.columnKey]}
                              </button>
                            ) : (
                              <button
                                className="badge badge-pill badge-success py-3 px-4 border-0 fw-400 fa-1x"
                                onClick={(e) =>
                                  handleSave(null, e, props?.RowData)
                                }
                              >
                                {isSubmittingNextStepAction &&
                                selectedItem === props?.RowData ? (
                                  <LoaderIcon />
                                ) : (
                                  props?.RowData?.[tabData?.columnKey]
                                )}
                              </button>
                            )}
                          </div>
                        </TableCell>
                      ) : tabData?.columnKey.toLowerCase() === "resultfile" ? (
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
                      ) : tabData?.columnKey.toLowerCase() === "flag" ? (
                        <TableCell>
                          <div className="d-flex justify-content-center">
                            {props?.RowData?.[tabData?.columnKey] ? (
                              <>
                                <button className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light">
                                  <i className="fa fa-flag cursor-pointer"></i>
                                </button>
                              </>
                            ) : null}
                          </div>
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
              <Collapse in={Duplicate} timeout="auto" unmountOnExit>
                <Box>
                  <Typography gutterBottom component="div">
                    <div className="row">
                      <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                        <div className="card  rounded border border-warning mt-3">
                          <div className="card-body py-md-4 py-3">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                              <span className="text-primary fw-bold">
                                {t("Selected Panels")}
                              </span>
                              <div className="d-flex flex-wrap mt-3 gap-2">
                                {billingPanels.map((index: any) => (
                                  <div className="bg-secondary px-2 rounded-1 fw-500 pt-1">
                                    {index.value}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Typography>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        </>
      )}
    </>
  );
};

export default React.memo(Row);
