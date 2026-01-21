import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import { useBloodResultDataContext } from "Pages/Blood/BloodResultData/BloodResultDataContext";
import DymoLabel from "Pages/Printing/DymoPrint";
import printBarcode from "Pages/Printing/ZebraPrint";
import "react-quill/dist/quill.snow.css";
import {
  BloodLISReportView,
  SaveInternalNotes,
} from "Services/BloodLisResultData";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { isJson } from "Utils/Common/Requisition";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, RemoveICon } from "../../../Shared/Icons";
import { dateFormatConversion } from "../../../Utils/Common/viewRequisitiontabs";
import ResultDataExpandableRow from "./ResultDataExpandableRow";
import BrotherPrint from "Pages/Printing/BrotherPrint";

const Row = (props: any) => {
  const { t } = useLang();

  const {
    selectedBox,
    setSelectedBox,
    filterData,
    data,
    loadGridData,
    rowsToExpand,
    setRowsToExpand,
  } = useBloodResultDataContext();

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const [internalNotes, setInternalNotes] = useState("");
  const [reportCheckboxes, setReportCheckboxes] = useState({
    isCorrectedReport: false,
    isAmendedReport: false,
  });
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const ModalhandleClose = () => {
    setShow(false);
    setInternalNotes("");
  };

  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };

  const TestReport = async (RequisitionOrderId: number) => {
    const row = {
      requisitionOrderId: RequisitionOrderId,
      isPreview: false,
      isCorrectedReport: reportCheckboxes.isCorrectedReport,
      isAmendedReport: reportCheckboxes.isAmendedReport,
    };

    const statuses = [
      "final",
      "amended",
      "corrected",
      "prelim report",
      "ready to report",
    ];

    const statusFound = statuses.includes(
      props.RowData.LisStatus.toLowerCase().trim()
    );
    if (!statusFound) {
      toast.error("Report is not available for this status");
      return;
    }

    try {
      const res: AxiosResponse = await BloodLISReportView(row);
      if (res?.data.statusCode === 200) {
        toast.success(res?.data?.message);
        loadGridData(false);
      } else if (res?.data.statusCode === 400) {
        toast.error(res?.data?.message);
      }
    } catch (err: any) {
      console.trace(err);
    }
  };

  const PrintLabel = async (option: any, printerId: number) => {
    const objToSend = {
      printerId: printerId,
      contentList: [
        {
          requisitionOrderId: props?.RowData?.RequisitionOrderId,
          requisitionId: props?.RowData?.RequisitionId,
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
      toast.error("Configuration not available");
      return;
    }
  };

  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const handleSelectedResultDataIds = (checked: boolean, item: any) => {
    const { RequisitionId, FacilityId, RequisitionOrderId, Id } = item; // Destructure id and accessionNumber from item
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          requisitionId: [
            ...pre.requisitionId,
            {
              requisitionId: RequisitionId,
              facilityId: FacilityId,
              requisitionOrderId: RequisitionOrderId,
              id: Id,
            },
          ], // Add an object with id and accessionNumber
        };
      });
    } else {
      setSelectedBox((prev: any) => ({
        ...prev,
        requisitionId: prev.requisitionId.filter(
          (selectedItem: any) =>
            selectedItem.requisitionId !== RequisitionId ||
            selectedItem.facilityId !== FacilityId ||
            selectedItem.requisitionOrderId !== RequisitionOrderId ||
            selectedItem.id !== Id
        ),
      }));
    }
  };

  const openInNewTab = (url: any) => {
    window.open(url, "_blank", "noreferrer");
  };

  const SaveLabComments = async () => {
    const obj = {
      item1: props.RowData.Id,
      item2: internalNotes,
    };

    SaveInternalNotes(obj)
      .then((res: AxiosResponse) => {
        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(false);
          setShow(false);
        } else {
          toast.error(t(res?.data?.message));
          setShow(false);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  return (
    <>
      <Modal show={show} onHide={ModalhandleClose} keyboard={false} size="lg">
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t("Internal Notes")}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="w-100">
            <div
            // style={{
            //   border: "1px solid #ced4da",
            //   borderRadius: "4px",
            //   overflow: "hidden",
            //   padding: "10px",
            // }}
            >
              {/* <ReactQuill
                id={`AdminManageNotificationMessage`}
                theme="snow"
                value={internalNotes || ""}
                readOnly={false}
                placeholder="Type notes..."
                onChange={(event: any) => setInternalNotes(event)}
                style={{ width: "100%" }}
              /> */}
              <input
                id={`BloodResultDataLabCommentPendingTestList`}
                name="labComments"
                className="form-control h-30px"
                value={internalNotes || ""}
                placeholder="Type notes..."
                onChange={(event: any) => setInternalNotes(event.target.value)}
              />
            </div>
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
            onClick={() => SaveLabComments()}
          >
            {t("Save")}
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
              {rowsToExpand?.includes(props?.RowData?.RequisitionOrderId) ? (
                <button
                  onClick={() => {
                    if (
                      rowsToExpand?.includes(props?.RowData?.RequisitionOrderId)
                    ) {
                      setRowsToExpand(
                        rowsToExpand.filter(
                          (val) => val !== props?.RowData?.RequisitionOrderId
                        )
                      );
                    }
                  }}
                  id={`ResultDataHide_${props?.RowData.RequisitionOrderId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  onClick={() => {
                    setRowsToExpand((prev) => [
                      ...prev,
                      props?.RowData?.RequisitionOrderId,
                    ]);
                  }}
                  id={`ResultDataShow_${props?.RowData.RequisitionOrderId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          </TableCell>
        ) : null}
        <TableCell
          id={`BloodResultDataCheckBox_${props?.RowData?.RequisitionOrderId}`}
          style={{ width: "49px" }}
        >
          <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
            <input
              id={`BloodResultDataCheckBox_${props?.RowData?.RequisitionOrderId}`}
              className="form-check-input"
              type="checkbox"
              checked={
                filterData.tabId === 4
                  ? selectedBox?.requisitionId?.find(
                      (item: any) => item?.id === props?.RowData?.Id
                    )
                  : selectedBox?.requisitionId?.find(
                      (item: any) =>
                        item?.requisitionOrderId ===
                        props?.RowData?.RequisitionOrderId
                    )
              }
              onChange={(e) =>
                handleSelectedResultDataIds(e.target.checked, props?.RowData)
              }
            />
          </label>
        </TableCell>
        {props?.tabsInfo &&
          props?.tabsInfo.map((tabData: any) => {
            const columnData = isJson(props?.RowData?.ColumnDataJson)
              ? JSON.parse(props?.RowData?.ColumnDataJson)
              : null;

            const columnKey = tabData?.columnKey;
            const rowId = `${columnKey}_${props?.RowData?.RequisitionOrderId}`;
            const columnArray = columnData?.[columnKey];

            // Show only the first item but map the full array in Tooltip on hover
            if (Array.isArray(columnArray) && columnArray.length > 0) {
              const firstItem =
                columnArray[0]?.TestName ||
                columnArray[0]?.InstrumentName ||
                "";

              return (
                <TableCell key={rowId} id={rowId}>
                  <HtmlTooltip
                    title={
                      <div>
                        {columnArray.map((item: any, idx: number) => (
                          <div key={idx}>
                            <span
                              style={{ fontSize: "17px", fontWeight: "bold" }}
                            >
                              {`${idx + 1}.`}
                            </span>
                            <span style={{ fontSize: "14px" }}>
                              {item?.TestName || item?.InstrumentName}
                            </span>
                          </div>
                        ))}
                      </div>
                    }
                    arrow
                  >
                    <span>{firstItem}</span>
                  </HtmlTooltip>
                </TableCell>
              );
            }

            return tabData.isShowOnUi &&
              !tabData.isExpandData &&
              tabData.isShow ? (
              <>
                {tabData?.columnKey?.toLowerCase() === "view" ? (
                  <TableCell
                    id={`BloodResultDataViewCell_${props?.RowData?.RequisitionOrderId}`}
                    className="text-center"
                  >
                    <div className="d-flex justify-content-center">
                      <PermissionComponent
                        moduleName="Blood LIS"
                        pageName="Result Data"
                        permissionIdentifier="View"
                      >
                        <button
                          id={`BloodResultDataViewButton_${props?.RowData?.RequisitionOrderId}`}
                          role="link"
                          className="btn btn-sm fw-bold btn-warning fs-12px py-0 fw-500 align-items-center d-flex"
                          onClick={() => {
                            const tokenData: any =
                              sessionStorage.getItem("userinfo");
                            localStorage.setItem("userinfo", tokenData);
                            openInNewTab(
                              `/OrderView/${btoa(
                                props?.RowData?.RequisitionId
                              )}/${btoa(props.RowData?.RequisitionOrderId)}`
                            );
                          }}
                        >
                          {t("View")}
                        </button>
                      </PermissionComponent>
                    </div>
                  </TableCell>
                ) : tabData?.columnKey?.toLowerCase() === "report" ? (
                  <TableCell
                    id={`BloodResultDataReportCell_${props?.RowData?.RequisitionOrderId}`}
                    className="text-center"
                  >
                    <div className="d-flex justify-content-center">
                      <PermissionComponent
                        moduleName="Blood LIS"
                        pageName="Result Data"
                        permissionIdentifier="Report"
                      >
                        <button
                          id={`BloodResultDataReportButton_${props?.RowData?.RequisitionOrderId}`}
                          className="btn btn-sm fw-bold btn-excle fs-12px py-0 fw-500 align-items-center d-flex text-white"
                          onClick={() =>
                            TestReport(props?.RowData?.RequisitionOrderId)
                          }
                          disabled={
                            props?.RowData?.RequisitionStatus === "On Hold" ||
                            (props?.RowData.IsShowReportButton === false &&
                              filterData.tabId === 1)
                          }
                        >
                          {t("Report")}
                        </button>
                      </PermissionComponent>
                    </div>
                  </TableCell>
                ) : tabData?.columnKey?.toLowerCase() === "printlabel" ? (
                  <TableCell>
                    <div style={{ width: "max-content" }}>
                      <StyledDropButton
                        id={`BloodResultDataPrintLabelButton_${props?.RowData?.RequisitionOrderId}`}
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
                        id={`BloodResultDataPrintLabelMenu_${props?.RowData?.RequisitionOrderId}`}
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
                ) : props?.RowData?.[tabData?.columnKey]?.includes(
                    "https://truemedpo.blob.core.windows.net"
                  ) ||
                  props?.RowData?.[tabData?.columnKey]?.includes(
                    "https://digitalrequsitions.blob.core.windows.net"
                  ) ? (
                  <TableCell
                    id={`BloodResultDataDocsViewer_${props?.RowData?.RequisitionOrderId}`}
                  >
                    <div className="d-flex justify-content-center">
                      <Link to={`/docs-viewer`} target="_blank">
                        <i
                          className="bi bi-file-earmark-pdf text-danger fa-2x cursor-pointer"
                          onClick={() => {
                            dispatch(
                              savePdfUrls(props?.RowData?.[tabData?.columnKey])
                            );
                          }}
                        ></i>
                      </Link>
                    </div>
                  </TableCell>
                ) : tabData?.columnKey.toLowerCase() === "requisitionstatus" ? (
                  <TableCell
                    id={`BloodResultDataStatus1_${props?.RowData?.RequisitionOrderId}`}
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
                                    : props?.RowData?.[tabData?.columnKey] ===
                                        t("Save For Signature")
                                      ? "badge-status-waiting-for-Signature"
                                      : props?.RowData?.[tabData?.columnKey] ===
                                          t("On Hold")
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
                ) : tabData?.columnKey.toLowerCase() === "lisstatus" ? (
                  <TableCell
                    id={`BloodResultDataStatus2_${props?.RowData?.RequisitionOrderId}`}
                    sx={{ width: "max-content", textAlign: "center" }}
                  >
                    <Status
                      cusText={props?.RowData?.[tabData?.columnKey]}
                      cusClassName={
                        props?.RowData?.[tabData?.columnKey] ===
                        t("Ready to Report")
                          ? "badge-status-result-available"
                          : props?.RowData?.[tabData?.columnKey] ===
                              t("Amended")
                            ? "badge-status-complete"
                            : props?.RowData?.[tabData?.columnKey] ===
                                t("Ready to Validate")
                              ? "badge-status-validated"
                              : props?.RowData?.[tabData?.columnKey] ===
                                  t("Final")
                                ? "badge-status-hold"
                                : props?.RowData?.[tabData?.columnKey] ===
                                    t("Corrected")
                                  ? "badge-status-in-transit"
                                  : props?.RowData?.[tabData?.columnKey] ===
                                      t("Pending")
                                    ? "badge-status-pending"
                                    : props?.RowData?.[tabData?.columnKey] ===
                                        t("Ready to Publish")
                                      ? "badge-status-shipped"
                                      : "badge-status-default"
                      }
                    />
                  </TableCell>
                ) : tabData?.columnKey.toLowerCase() === "labcomment" ? (
                  <TableCell
                    id={`BloodResultDataDocsViewer_${props?.RowData?.RequisitionOrderId}`}
                  >
                    <div className="d-flex justify-content-center">
                      <i
                        className="fa-regular fa-file-lines cursor-pointer text-white"
                        style={{
                          fontSize: "18px",
                          backgroundColor: "#0796e0",
                          borderRadius: "5px",
                          padding: "5px 7px",
                        }}
                        onClick={() => {
                          setShow(true);
                          setInternalNotes(props?.RowData?.LabComment || "");
                        }}
                      ></i>
                    </div>
                  </TableCell>
                ) : (
                  <TableCell
                    id={`${tabData?.columnKey}_${props?.RowData?.RequisitionOrderId}`}
                  >
                    {dateFormatConversion(props?.RowData, tabData?.columnKey)}
                  </TableCell>
                )}
              </>
            ) : null;
          })}
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse
            in={rowsToExpand?.includes(props?.RowData?.RequisitionOrderId)}
            timeout="auto"
            unmountOnExit
          >
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <ResultDataExpandableRow
                      requisitionOrderId={props?.RowData?.RequisitionOrderId}
                      row={props?.RowData}
                      setReportCheckboxes={setReportCheckboxes}
                      reportCheckboxes={reportCheckboxes}
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

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#f5f5f9",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));
