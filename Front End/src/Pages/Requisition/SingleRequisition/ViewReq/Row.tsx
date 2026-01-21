import { MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import { HiOutlineDocumentDuplicate } from "react-icons/hi";
import { MdHistory } from "react-icons/md";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AxiosResponse } from "axios";
import { savePdfUrls } from "../../../../Redux/Actions/Index";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "../../../../Shared/Icons";
import ArrowBottomIcon from "../../../../Shared/SVG/ArrowBottomIcon";
import { dateFormatConversion } from "../../../../Utils/Common/viewRequisitiontabs";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../../Utils/Style/Dropdownstyle";
import DymoLabel from "../../../Printing/DymoPrint";
import printBarcode from "../../../Printing/ZebraPrint";
import BrotherPrint from "../../../Printing/BrotherPrint";
import DataUpdateModal from "./DataUpdateModal";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import useLang from "Shared/hooks/useLanguage";
import Status from "Shared/Common/Status";
import RequisitionType from "Services/Requisition/RequisitionTypeService";

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
    selectedBox,
    setSelectedBox,
    nextStep,
    isSubmittingNextStepAction,
    filterData,
    restoreRequisition,
    loading,
  } = useReqDataContext();

  const { t } = useLang();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedItem, setSelectedItem] = useState();
  const pdfFileRefs = React.useRef<any>([]);

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

  const DuplicateRecord = async (
    requisitionId: any,
    requisitionOrderId: any
  ) => {
    const objToSend = {
      requisitionId: requisitionId,
      requisitionorderid: requisitionOrderId,
    };

    try {
      const res = await RequisitionType.DuplicateRecord(objToSend);
      if (res?.data?.statusCode === 200) {
        toast.success(res?.data?.message);

        const data = {
          reqId: res?.data?.requisitionId,
          orderid: res?.data?.requisitionOrderId,
        };

        navigate(`/requisition`, {
          state: data,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };
  const PrintLabel = async (option: any, printerId: number) => {
    const objToSend = {
      printerId: printerId,
      contentList: [
        {
          requisitionOrderId: NormalizedData(
            props?.RowData,
            "requisitionorderid"
          ),
          requisitionId: NormalizedData(props?.RowData, "requisitionid"),
          //accessionNumber: NormalizedData(props?.RowData, "accessionnumber"),
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
    }
    if (option.includes("brother") || option.includes("Brother")) {
      BrotherPrint(content);
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

  const handleSave = async (pdfFileRef: any | null, _: any, item: any) => {
    // debugger;
    if (
      ((item?.NextStep?.toLowerCase() === "checkin" ||
        item?.NextStep?.toLowerCase() === "begin" ||
        item?.NextStep?.toLowerCase() === "collect" ||
        item?.NextStep?.toLowerCase() === "collected") &&
        !item?.DateofCollection) ||
      ((item?.NextStep?.toLowerCase() === "checkin" ||
        item?.NextStep?.toLowerCase() === "begin" ||
        item?.NextStep?.toLowerCase() === "collect" ||
        item?.NextStep?.toLowerCase() === "collected") &&
        !item?.AccessionNumber)
    ) {
      setModalData(item);
      setOpenModal(true);
    } else {
      const normalizedRowData = normalizeKeys(item);
      setSelectedItem(item);
      const formData = new FormData();
      if (pdfFileRef && pdfFileRef.files && pdfFileRef.files.length > 0) {
        const pdfFile = pdfFileRef.files?.[0];

        if (!pdfFile || pdfFile.type !== "application/pdf") {
          toast.error("Please upload a file in PDF format.");

          // Clear file input so the same file triggers onChange again
          if (pdfFileRef && pdfFileRef.value) {
            pdfFileRef.value = "";
          }

          return;
        }

        const reader = new FileReader();

        reader.onload = async () => {
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

          nextStep(formData);
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
        formData.append(
          "RequisitionType",
          normalizedRowData?.requisitiontypeid
        );
        nextStep(formData);
      }
    }
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };

  const [modalData, setModalData] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const closeModal = () => {
    setOpenModal(false);
  };

  // Single delete handler
  const handleSingleDelete = (
    requisitionOrderId: number,
    requisitionId: number
  ) => {
    // Call the direct delete function from parent
    if (props.onSingleDelete) {
      props.onSingleDelete(requisitionOrderId, requisitionId);
    }
  };

  const handleSinglePrint = (requisitionOrderId: number) => {
    RequisitionType.PrintSelectedRecords([requisitionOrderId]).then(
      (res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          ShowBlob(res?.data?.data);
        } else {
          toast.error(t(res?.data?.message));
        }
      }
    );
  };

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  return (
    <>
      <DataUpdateModal
        open={openModal}
        onClose={closeModal}
        modalData={modalData}
      />
      {loading ? null : (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
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
          <TableCell
            id={`Requisition3Dots_${NormalizedData(
              props?.RowData,
              "requisitionorderid"
            )}`}
            className="min-w-50px w-50px"
          >
            <div className="d-flex justify-content-center rotatebtnn">
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id="ViewRequisition3Dots"
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                {filterData.tabId === 0 ||
                filterData.tabId === 1 ||
                filterData.tabId === 2 ||
                filterData.tabId === 3 ? (
                  <>
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="View Requisition"
                      permissionIdentifier="View"
                    >
                      <Dropdown.Item
                        id="RequisitionView"
                        eventKey="2"
                        onClick={() => {
                          const tokenData: any =
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
                        id="RequisitionEdit"
                        eventKey="1"
                        onClick={() => {
                          const data = {
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
                            recordid: NormalizedData(
                              props?.RowData,
                              "recordid"
                            ),
                          };
                          navigate(`/requisition`, {
                            state: data,
                          });
                        }}
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
                      permissionIdentifier="Duplicate"
                    >
                      <Dropdown.Item
                        id="RequisitionDuplicate"
                        eventKey="2"
                        onClick={() => {
                          DuplicateRecord(
                            NormalizedData(props?.RowData, "requisitionid"),
                            NormalizedData(props?.RowData, "requisitionorderid")
                          );
                        }}
                      >
                        <button
                          role="link"
                          className="px-0 border-0 bg-transparent "
                        >
                          <HiOutlineDocumentDuplicate
                            color="gray"
                            size="20"
                            className="mr-2"
                          />
                          Duplicate
                        </button>
                      </Dropdown.Item>
                    </PermissionComponent>
                    {props?.portalType === PortalTypeEnum.Admin ? (
                      <PermissionComponent
                        moduleName="Requisition"
                        pageName="View Requisition"
                        permissionIdentifier="history"
                      >
                        <Dropdown.Item
                          id="requisition-history"
                          eventKey="2"
                          onClick={() => {
                            const url = `/requisition-tracking/${window.btoa(
                              NormalizedData(
                                props?.RowData,
                                "requisitionorderid"
                              )
                            )}`;
                            openInNewTab(url);
                          }}
                        >
                          <button
                            role="link"
                            className="px-0 border-0 bg-transparent "
                          >
                            <MdHistory size={20} className="mr-2" />
                            Requisition History
                          </button>
                        </Dropdown.Item>
                      </PermissionComponent>
                    ) : null}
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="View Requisition"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id="RequisitionDelete"
                        eventKey="3"
                        onClick={() => {
                          handleSingleDelete(
                            NormalizedData(
                              props?.RowData,
                              "requisitionorderid"
                            ),
                            NormalizedData(props?.RowData, "requisitionid")
                          );
                        }}
                      >
                        <button
                          role="link"
                          className="px-0 border-0 bg-transparent "
                        >
                          <i className="fa fa-trash text-danger mr-2 w-20px"></i>
                          {t("Delete")}
                        </button>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="View Requisition"
                      permissionIdentifier="PrintRecord"
                    >
                      <Dropdown.Item
                        id="RequisitionPrint"
                        eventKey="4"
                        onClick={() => {
                          handleSinglePrint(
                            NormalizedData(props?.RowData, "requisitionorderid")
                          );
                        }}
                      >
                        <button
                          role="link"
                          className="px-0 border-0 bg-transparent "
                        >
                          <i className="fa fa-print text-info mr-2 w-20px"></i>
                          {t("Print")}
                        </button>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                ) : (
                  <>
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="View Requisition"
                      permissionIdentifier="View"
                    >
                      <Dropdown.Item eventKey="2">
                        <button
                          id="ViewRequisitionView2"
                          role="link"
                          className="px-0 border-0 bg-transparent"
                          onClick={() => {
                            const tokenData: any =
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
                          <i className="fa fa-eye text-success mr-2 w-20px"></i>
                          {t("View")}
                        </button>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Requisition"
                      pageName="View Requisition"
                      permissionIdentifier="Restore"
                    >
                      <Dropdown.Item id="ViewRequisitionRestore" eventKey="2">
                        <div
                          onClick={() =>
                            restoreRequisition(
                              NormalizedData(
                                props?.RowData,
                                "requisitionorderid"
                              )
                            )
                          }
                        >
                          <i className="fa fa-refresh text-success mr-2 w-20px"></i>
                          {t("Restore")}
                        </div>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                )}
              </DropdownButton>
            </div>
          </TableCell>
          {props?.tabsInfo &&
            props?.tabsInfo.map((tabData: any, index: number) => (
              <>
                {tabData?.isShowOnUi && tabData?.isShow ? (
                  <>
                    {tabData?.columnKey?.toLowerCase() === "printlabel" ? (
                      <TableCell
                        id={`RequisitionPrintLabel_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
                      >
                        <div style={{ width: "max-content" }}>
                          <StyledDropButton
                            id="PrintLabelButton"
                            aria-controls={
                              openDrop ? "demo-positioned-menu4" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openDrop ? "true" : undefined}
                            onClick={(event) => handleClick(event, "dropdown4")}
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
                                value={t(option.value)}
                              >
                                <i className="fa fa fa-print text-warning mr-2 w-20px"></i>
                                {option?.label}
                              </MenuItem>
                            ))}
                          </StyledDropMenu>
                        </div>
                      </TableCell>
                    ) : tabData?.columnKey.toLowerCase() === "nextstep" ? (
                      <TableCell
                        align="left"
                        id={`RequisitionUploadResult_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
                      >
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
                                const data = {
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
                        id={`RequisitionResultFile_${NormalizedData(
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
                    ) : tabData?.columnKey.toLowerCase() ===
                      "requisitionstatus" ? (
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
                                    t("Result Available")
                                  ? "badge-status-result-available"
                                  : props?.RowData?.[tabData?.columnKey] ===
                                      t("Complete")
                                    ? "badge-status-complete"
                                    : props?.RowData?.[tabData?.columnKey] ===
                                        t("Deleted")
                                      ? "badge-status-deleted"
                                      : props?.RowData?.[tabData?.columnKey] ===
                                          t("Validated")
                                        ? "badge-status-validated"
                                        : props?.RowData?.[
                                              tabData?.columnKey
                                            ] === t("Save For Signature")
                                          ? "badge-status-waiting-for-Signature"
                                          : props?.RowData?.[
                                                tabData?.columnKey
                                              ] === t("On Hold")
                                            ? "badge-status-hold"
                                            : props?.RowData?.[
                                                  tabData?.columnKey
                                                ] === t("Missing Info")
                                              ? "badge-status-missing-info"
                                              : props?.RowData?.[
                                                    tabData?.columnKey
                                                  ] === t("In Transit")
                                                ? "badge-status-in-transit"
                                                : props?.RowData?.[
                                                      tabData?.columnKey
                                                    ] === t("Canceled")
                                                  ? "badge-status-canceled"
                                                  : props?.RowData?.[
                                                        tabData?.columnKey
                                                      ] === t("Approved")
                                                    ? "badge-status-approved"
                                                    : props?.RowData?.[
                                                          tabData?.columnKey
                                                        ] === t("Pending")
                                                      ? "badge-status-pending"
                                                      : props?.RowData?.[
                                                            tabData?.columnKey
                                                          ] === t("Rejected")
                                                        ? "badge-status-rejected"
                                                        : props?.RowData?.[
                                                              tabData?.columnKey
                                                            ] === t("Shipped")
                                                          ? "badge-status-shipped"
                                                          : "badge-status-default"
                          }
                        />
                      </TableCell>
                    ) : tabData?.columnKey.toLowerCase() === "flag" ? (
                      <TableCell
                        id={`RequisitionFlag_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
                      >
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
                        sx={{ width: "max-content", whiteSpace: "nowrap" }}
                        id={`${tabData?.columnKey}_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
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
      )}
    </>
  );
};

export default React.memo(Row);
