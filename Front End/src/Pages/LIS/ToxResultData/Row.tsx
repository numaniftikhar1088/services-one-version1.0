import {
  Box,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, RemoveICon } from "../../../Shared/Icons";
import { useToxResultDataContext } from "../../../Shared/ToxResultDataContext";
import { StringRecord } from "../../../Shared/Type";
import { dateFormatConversion } from "../../../Utils/Common/viewRequisitiontabs";
import ResultDataExpandableRow from "./ResultDataExpandableRow";

const Row = (props: any) => {
  const {
    selectedBox,
    setSelectedBox,
    filterData,
    data,
    rowsToExpand,
    setRowsToExpand,
  } = useToxResultDataContext();

  const { t } = useLang();

  const dispatch = useDispatch();
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [show, setShow] = useState(false);
  const [Duplicate, setDuplicate] = useState(false);
  const [viewContactInfo, setViewContactInfo] = useState<any>({});
  const queryDisplayTagNames: StringRecord = {
    primaryContactName: "Primary Contact Name",
    primaryContactPhone: "Primary Contact Phone",
    primaryContactEmail: "Primary Contact Email",
    facilityPhone: "Facility Phone",
    criticalName: "Critical Name",
    criticalPhone: "Critical Phone",
    criticalContactEmail: "Critical Contact Email",
  };
  const handleSelectedResultDataIds = (checked: boolean, item: any) => {
    const { RequisitionId, RequisitionTypeId, FacilityId, RequisitionOrderID } =
      item; // Destructure id and accessionNumber from item
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionId: [
            ...pre.requisitionId,
            {
              RequisitionId,
              reqTypeId: RequisitionTypeId,
              FacilityId,
              RequisitionOrderID,
            },
          ], // Add an object with id and accessionNumber
        };
      });
    } else {
      setSelectedBox((prev: any) => ({
        ...prev,
        requisitionId: prev.requisitionId.filter(
          (selectedItem: any) =>
            selectedItem.RequisitionId !== item.RequisitionId ||
            selectedItem.reqTypeId !== item.RequisitionTypeId ||
            selectedItem.FacilityId !== item.FacilityId ||
            selectedItem.RequisitionOrderID !== item.RequisitionOrderID
        ),
      }));
    }
  };
  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };
  const handleOpenView = () => {
    RequisitionType?.ViewContactInformation(props?.RowData?.FacilityId)
      .then((res: any) => {
        if (res?.data?.statusCode == 200) {
          setViewContactInfo(res.data.data);
        }
      })
      .catch((err: AxiosError) => {});
    setShow(true);
  };
  const TOXLISReportView = (
    reqId: any,
    requisitionOrderId: any,
    facilityid: any,
    requisitionTypeId: any
  ) => {
    console.log(props?.RowData, "ROWS");
    
    const row = {
      requisitionId: reqId,
      requisitionOrderId: requisitionOrderId,
      isPreview: true,
      facilityId: facilityid,
      reqType: requisitionTypeId,
    };

    setIsPreviewing(true);
    RequisitionType.TOXLISReportView(row)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(res?.data?.message);
          setIsPreviewing(false);
          dispatch(savePdfUrls(res?.data?.data));
          window.open("/docs-viewer", "_blank", "noreferrer");
        }
        if (res?.data.statusCode === 400) {
          toast.error(res?.data?.message);
          setIsPreviewing(false);
        }
      })
      .catch((err: any) => {
        setIsPreviewing(false);
        console.trace(err);
      });
  };
  useEffect(() => {
    setDuplicate(false);
  }, [filterData.tabId, data.total]);
  const NormalizedData = (obj: any, key: any) => {
    if (!obj || !key) return undefined;
    const normalizedKey = Object.keys(obj).find(
      (k: any) => k.toLowerCase() === key.toLowerCase()
    );
    return normalizedKey ? obj[normalizedKey] : undefined;
  };
  return (
    <>
      <Modal
        show={show}
        onHide={() => {
          setShow(false);
        }}
        backdrop="static"
        keyboard={false}
        aria-labelledby="contained-modal-title-vcenter"
        size="lg"
      >
        <Modal.Header closeButton className="m-0 py-3 px-6">
          <h4>{t("View Contacts")}</h4>
        </Modal.Header>
        <Modal.Body>
          <Table
            aria-label="sticky table collapsible"
            className="table table-cutome-expend table-sticky-header table-head-2-bg table-bg p-0 table-head-custom table-vertical-center border-0 mb-1"
          >
            <TableBody>
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
                  className="shadow-none p-0"
                >
                  <Table
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header plate-mapping-table table-bg table-head-custom table-vertical-center border-0 mb-0 "
                  >
                    <TableBody>
                      {Object.entries(viewContactInfo).map(
                        ([key, value]: [string, any]) =>
                          key === "id" ? (
                            ""
                          ) : (
                            <TableRow className="h-30px" key={key}>
                              <TableCell className="w-25">
                                <span className="fw-bold">
                                  {queryDisplayTagNames[key] || key}
                                </span>
                              </TableCell>
                              <TableCell className="w-75">
                                <span className="fw-bold">{value}</span>
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </TableBody>
          </Table>
        </Modal.Body>
        <Modal.Footer className="py-1 px-6">
          <button
            id={`ToxResultDataRowModalCancel`}
            type="button"
            className="badge badge-pill badge-danger py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={() => {
              setShow(false);
            }}
          >
            {t("Cancel")}
          </button>
        </Modal.Footer>
      </Modal>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        {filterData.tabId === 1 || filterData.tabId === 2 ? (
          <TableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
            >
              {rowsToExpand?.includes(props?.RowData?.RequisitionOrderID) ? (
                <button
                  onClick={() => {
                    if (
                      rowsToExpand?.includes(props?.RowData?.RequisitionOrderID)
                    ) {
                      setRowsToExpand(
                        rowsToExpand.filter(
                          (val) => val !== props?.RowData?.RequisitionOrderID
                        )
                      );
                    }
                  }}
                  id={`ToxResultDataExpandClose_${NormalizedData(
                    props?.RowData,
                    "requisitionorderid"
                  )}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRowsToExpand((prev) => [
                      ...prev,
                      props?.RowData?.RequisitionOrderID,
                    ]);
                  }}
                  id={`ToxResultDataExpandOpen_${NormalizedData(
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
        ) : null}
        <TableCell style={{ width: "49px" }}>
          <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
            <input
              id={`ToxResultDataCheckBox_${NormalizedData(
                props?.RowData,
                "requisitionorderid"
              )}`}
              className="form-check-input"
              type="checkbox"
              checked={selectedBox?.requisitionId?.find(
                (item: any) =>
                  item?.RequisitionId === props?.RowData?.RequisitionId
              )}
              onChange={(e) =>
                handleSelectedResultDataIds(e.target.checked, props?.RowData)
              }
            />
          </label>
        </TableCell>
        {props?.tabsInfo &&
          props?.tabsInfo.map((tabData: any, index: number) => (
            <React.Fragment key={index}>
              {tabData.isShowOnUi && !tabData.isExpandData && tabData.isShow ? (
                <>
                  {tabData?.columnKey === "view" ? (
                    <TableCell className="text-center">
                      <div className="d-flex justify-content-center">
                        <PermissionComponent
                          moduleName="TOX LIS"
                          pageName="Result Data"
                          permissionIdentifier="View"
                        >
                          <button
                            id={`ToxResultDataView_${NormalizedData(
                              props?.RowData,
                              "requisitionorderid"
                            )}`}
                            role="link"
                            className="btn btn-sm fw-bold btn-warning fs-12px py-0 fw-500 align-items-center d-flex"
                            onClick={() => {
                              const tokenData: any =
                                sessionStorage.getItem("userinfo");
                              localStorage.setItem("userinfo", tokenData);
                              openInNewTab(
                                `/OrderView/${btoa(
                                  props?.RowData?.RequisitionId
                                )}/${btoa(
                                  NormalizedData(
                                    props?.RowData,
                                    "requisitionorderid"
                                  )
                                )}`
                              );
                            }}
                          >
                            {t("View")}
                          </button>
                        </PermissionComponent>
                      </div>
                    </TableCell>
                  ) : tabData.columnKey === "ResultPreview" ? (
                    <TableCell className="text-center">
                      <button
                        id={`ToxResultDataPreview_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
                        className="btn btn-sm fw-bold fw-500 text-light"
                        style={{ background: "#5F11FB" }}
                        onClick={() =>
                          TOXLISReportView(
                            props?.RowData?.RequisitionId,
                            NormalizedData(
                              props?.RowData,
                              "requisitionorderid"
                            ),
                            NormalizedData(props.RowData, "facilityid"),
                            NormalizedData(props.RowData, "RequisitionTypeId")
                          )
                        }
                      >
                        {t("Preview")}
                      </button>
                    </TableCell>
                  ) : tabData?.columnKey === "ViewContact" ? (
                    <TableCell className="text-center">
                      <button
                        id={`ToxResultDataView_${NormalizedData(
                          props?.RowData,
                          "requisitionorderid"
                        )}`}
                        className="btn btn-sm fw-bold fw-500 text-light"
                        style={{ background: "#086530" }}
                        onClick={handleOpenView}
                      >
                        {t("View")}
                      </button>
                    </TableCell>
                  ) : tabData?.columnKey.toLowerCase() === "lisstatus" ? (
                    <TableCell
                      id={`ToxResultDataStatus_${NormalizedData(
                        props?.RowData,
                        "requisitionorderid"
                      )}`}
                      sx={{ width: "max-content", textAlign: "center" }}
                    >
                      <Status
                        cusText={props?.RowData?.[tabData?.columnKey]}
                        cusClassName={
                          props?.RowData?.[tabData?.columnKey] ===
                          t("Ready to Publish")
                            ? "badge-status-ready-to-publish"
                            : props?.RowData?.[tabData?.columnKey] ===
                              t("Processing")
                            ? "badge-status-processing"
                            : props?.RowData?.[tabData?.columnKey] ===
                              t("Pending")
                            ? "badge-status-pending"
                            : props?.RowData?.[tabData?.columnKey] ===
                              t("Final")
                            ? "badge-status-final"
                            : props?.RowData?.[tabData?.columnKey] ===
                              t("Corrected")
                            ? "badge-status-corrected"
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
                    >
                      {dateFormatConversion(props?.RowData, tabData?.columnKey)}
                    </TableCell>
                  )}
                </>
              ) : null}
            </React.Fragment>
          ))}
      </TableRow>

      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse
            in={rowsToExpand?.includes(props?.RowData?.RequisitionOrderID)}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <ResultDataExpandableRow
                      row={props?.RowData}
                      requisitionId={props?.RowData?.RequisitionId}
                      recordId={props?.RowData?.recordId}
                      reqTypeId={props?.RowData?.RequisitionTypeId}
                      facilityId={props?.RowData?.FacilityId}
                      requisitionOrderId={NormalizedData(
                        props?.RowData,
                        "requisitionorderid"
                      )}
                      PathogensList={props?.RowData?.pathogens}
                      setDuplicate={setDuplicate}
                    />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default React.memo(Row);
