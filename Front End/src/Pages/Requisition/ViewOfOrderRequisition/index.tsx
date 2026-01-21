import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Masonry from "masonry-layout";
import { AxiosResponse } from "axios";
import { toast } from "react-toastify";
import localStorage from "redux-persist/es/storage";
import { Modal, Button } from "react-bootstrap";
import { t } from "i18next";
import { useSelector } from "react-redux";
import { FaHistory } from "react-icons/fa";
import { MenuItem } from "@mui/material";
import { TbReport } from "react-icons/tb";
import Splash from "../../../Shared/Common/Pages/Splash";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import SectionsCard from "./SectionsCard";
import { PortalTypeEnum } from "Utils/Common/Enums/Enums";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { ZebraMultiPrint } from "Pages/Printing/ZebraMultiPrint";
import { DymoMultiPrint } from "Pages/Printing/DymoMultiPrint";
import BrotherPrint from "Pages/Printing/BrotherPrint";
const OrderView = () => {
  const user = useSelector((state: any) => state?.Reducer);
  const navigate = useNavigate();
  const [shown, setShown] = useState(false);
  const [display, setDisplay] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);
  const [modalVisible1, setModalVisible1] = useState(false);
  const [reason, setReason] = useState("");
  const [reason1, setReason1] = useState(""); // State to capture reason input
  const masonryRef = useRef<any | null>(null);
  const [reqTypeId, setReqTypeId] = useState("");
  const [reqStatus, setReqStatus] = useState("");
  const [status, setStatus] = useState("");
  const [statusId, setStatusID] = useState("");
  const [RecordId, setRecordId] = useState("");
  const [printers, setPrinters] = useState<any>([]);
  const location = useLocation();
  const parts = location.pathname.split("/OrderView/");
  const InnerParts = parts[1].split("/");
  const req_id = atob(InnerParts[0]);
  const req_order_id = atob(InnerParts[1]);

  const getLocalStorageData = () => {
    const tokenData: any = localStorage.getItem("userinfo");
    tokenData.then((res: any) => {
      if (!res) return;
      sessionStorage.setItem("userinfo", res);
    });
    localStorage.removeItem("userinfo");
  };

  const loadData = () => {
    setLoading(true);
    const obj = {
      item1: req_id,
      item2: req_order_id,
    };
    RequisitionType.GetViewOfOrder(obj)
      .then((res: AxiosResponse) => {
        setDisplay(res.data);
        setShown(true);
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => setLoading(false));
  };

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  const PdfDownload = async () => {
    const query = {
      reqId: req_id,
      requisitionOrderId: req_order_id,
    };
    RequisitionType.ShowOrderViewPdf(query)
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          ShowBlob(res.data.data);
          toast.success(res.data.message);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const openModal2 = () => {
    setModalVisible2(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setReason("");
  };

  const closeModalForResend = () => {
    setModalVisible1(false);
  };

  const closeModalForUnValidate = () => {
    setModalVisible2(false);
    setReason1("");
  };

  const openModalForResend = () => {
    setModalVisible1(true);
  };
  const [disbale, setDisable] = useState(false);
  const handleConfirm = () => {
    setDisable(true);
    if (reason === "") {
      toast.error("Please enter the reason.");
      return;
    }
    RequisitionType.ViewRequisitionBulkStatusChange({
      RequisitionOrderIds: [req_order_id],
      statusId: 2,
      ActionReasons: reason,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          closeModal();
          loadData();
          setDisable(false);
          setReason("");
        }
      })
      .catch((err: any) => {
        console.trace(err);
        toast.error("Failed to put order on hold");
      });
  };

  const handleChangeRemoveHold = () => {
    const formData = new FormData();
    if (reqStatus === "24") {
      formData.append("RequisitionId", req_id);
      formData.append("NextStep", "Remove Hold");
      formData.append("RequisitionOrderId", req_order_id);
      formData.append("RecordId", RecordId);
      formData.append("RequisitionType", reqTypeId);

      RequisitionType.NextStepAction(formData)
        .then((res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            loadData();
          }
        })
        .catch((err: any) => {
          console.trace(err);
          toast.error("Failed to put order on hold");
        });
    }
  };

  const handleChangeUnValidate = () => {
    if (reason1 === "") {
      toast.error("Please enter the reason.");
      return;
    }
    const id = parseInt(statusId);
    const obj = {
      RequisitionOrderIds: [req_order_id],
      statusId: id === 7 || id === 26 ? id : null,
      ActionReasons: reason1,
    };

    RequisitionType.OrderViewUnvalidate(obj)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          closeModalForUnValidate();
          setReason1("");
          loadData();
        }
      })
      .catch((err: any) => {
        console.trace(err);
        toast.error("Failed to put order on UN-Validate");
      });
  };

  const handleConfirmResendOrder = () => {
    RequisitionType.ResendOrder(req_order_id)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          closeModalForResend();
        }
      })
      .catch((err: any) => {
        console.trace(err);
        toast.error("Failed to put order to resend");
      });
  };

  useEffect(() => {
    getLocalStorageData();
  }, []);

  useEffect(() => {
    masonryRef.current = new Masonry(".ViewGrid", {
      itemSelector: ".ViewGrid-item",
      columnWidth: ".ViewGrid-sizer",
      percentPosition: true,
    });
  }, []);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (masonryRef?.current) {
      masonryRef?.current?.layout();
    }
  }, [shown]);

  const selectedTenat = useSelector(
    (state: any) => state.Reducer.selectedTenantInfo
  );

  const isAdminUser =
    PortalTypeEnum.Admin === selectedTenat.infomationOfLoggedUser.portalType;
  const [anchorEl, setAnchorEl] = useState({
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
  const getPrintersInfo = async () => {
    await RequisitionType.GetPrintersInfo().then((res: any) => {
      setPrinters(res?.data?.data);
    });
  };

  useEffect(() => {
    getPrintersInfo();
  }, []);
  const getPrinterContentData = async (payload: any) => {
    try {
      const printerContent = await RequisitionType.getPrinterContent(payload);
      return printerContent?.data?.data;
    } catch (error) {
      console.error(error);
    }
  };
  const PrintLabel = async (
    label: any,
    printerId: any,
    orderId: any,
    requisitionId: any
  ) => {
    const obj = {
      printerId: printerId,
      contentList: [
        {
          requisitionOrderId: orderId,
          requisitionId: requisitionId,
        },
      ],
    };
    const content = await getPrinterContentData(obj);
    if (label?.includes("zebra") || label?.includes("Zebra")) {
      ZebraMultiPrint(content);
    }
    if (label?.includes("dymo") || label?.includes("Dymo")) {
      DymoMultiPrint(content);
    }
    if (label?.includes("brother") || label?.includes("Brother")) {
      BrotherPrint(content);
    } else {
      toast.error(t("Configuration not available"));
      return;
    }
  };
  return (
    <>
      {loading ? (
        <Splash />
      ) : (
        <div className="d-flex flex-column flex-column-fluid">
          <div
            id="kt_app_content"
            className="app-content flex-column-fluid app-toolbar py-3 py-lg-6"
          >
            <div className="app-container container-fluid">
              <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
                <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                  <ul className="breadcrumb breadcrumb-separatorless  fs-7 my-0 pt-1">
                    <li className="breadcrumb-item text-muted">
                      <a href="" className="text-muted text-hover-primary">
                        {t("Home")}
                      </a>
                    </li>
                    <li className="breadcrumb-item">
                      <span className="bullet bg-gray-400 w-5px h-2px"></span>
                    </li>
                    <li className="breadcrumb-item text-muted">
                      {t("Requisition")}
                    </li>
                    <li className="breadcrumb-item">
                      <span className="bullet bg-gray-400 w-5px h-2px"></span>
                    </li>
                    <li className="breadcrumb-item text-muted">
                      {t("Order View Requisition")}
                    </li>
                  </ul>
                </div>
                <div className="d-flex align-items-center flex-wrap  gap-2 gap-lg-3">
                  {isAdminUser ? (
                    <div
                      onClick={() => {
                        navigate(
                          `/requisition-tracking/${window.btoa(req_order_id)}`
                        );
                      }}
                    >
                      <button className="btn btn-linkedin btn-sm">
                        <FaHistory
                          style={{ fontSize: "18px", marginRight: "5px" }}
                        />
                        {t("Requisition History")}
                      </button>
                    </div>
                  ) : null}
                  <div className="btn btn-primary btn-sm" onClick={PdfDownload}>
                    <i className="fa fa-print" style={{ fontSize: "18px" }}></i>
                    {t("Print Record")}
                  </div>
                  {(status === "Validated" || status === "Complete") && (
                    <div
                      className="btn btn-secondary btn-sm"
                      onClick={openModal2}
                    >
                      <i
                        className="fa fa-times-circle"
                        style={{ fontSize: "18px" }}
                      ></i>
                      {t("Un-Validate")}
                    </div>
                  )}
                  <div
                    onClick={() => {
                      const data = {
                        reqId: req_id,
                        orderid: req_order_id,
                      };
                      navigate(`/requisition`, {
                        state: data,
                      });
                    }}
                  >
                    <button className="btn btn-success btn-sm">
                      <i style={{ fontSize: "18px" }} className="fas">
                        &#xf044;
                      </i>
                      {t(" Edit Requisition")}
                    </button>
                  </div>
                  <div>
                    <StyledDropButton
                      id="demo-positioned-button4"
                      aria-controls={
                        openDrop ? "demo-positioned-menu4" : undefined
                      }
                      aria-haspopup="true"
                      aria-expanded={openDrop ? "true" : undefined}
                      onClick={(event) => handleClick(event, "dropdown4")}
                      size="medium"
                      variant="contained"
                      className="rounded btn btn-sm"
                      sx={{
                        bgcolor: "brown",
                        color: "white", // Ensure text/icon stays white
                        "&:hover": {
                          bgcolor: "brown",
                        },
                        "&:focus": {
                          bgcolor: "brown",
                          color: "white",
                        },
                        "&:active": {
                          bgcolor: "brown",
                          color: "white",
                        },
                      }}
                    >
                      <TbReport color="white" size={20} /> Print Label
                      <span className="svg-icon svg-icon-5 m-0">
                        <ArrowBottomIcon />
                      </span>
                    </StyledDropButton>
                    <StyledDropMenu
                      id="demo-positioned-menu4"
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
                      {Array.isArray(printers) &&
                        printers?.map((option: any) => (
                          <MenuItem
                            onClick={() => {
                              PrintLabel(
                                option?.label,
                                option?.value,
                                req_order_id,
                                req_id
                              );
                              handleClose("dropdown4");
                            }}
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
                  {isAdminUser ? (
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => {
                        if (reqStatus === "24") {
                          handleChangeRemoveHold();
                        } else {
                          openModal();
                        }
                      }}
                    >
                      {reqStatus === "24" ? (
                        <i
                          style={{ fontSize: "18px" }}
                          className="fa fa-remove"
                        ></i>
                      ) : (
                        <i style={{ fontSize: "18px" }} className="fa">
                          &#xf04c;
                        </i>
                      )}
                      {t(reqStatus === "24" ? "Remove Hold" : "On Hold")}
                    </button>
                  ) : null}
                  {user?.selectedTenantInfo.tenantId === 238 && (
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={openModalForResend}
                    >
                      <i
                        style={{ fontSize: "16px" }}
                        className="fa fa-repeat"
                      ></i>
                      {t("Re Send Order")}
                    </button>
                  )}
                </div>
              </div>
              <div className="d-flex justify-content-between align-items-center mt-3"></div>
              <div className="col-lg-12 col-md-12 col-sm-12 col-sm-12 py-5 pt-3">
                <div className="ViewGrid row">
                  {Array.isArray(display) &&
                    display?.map((sectionData: any) => (
                      <SectionsCard
                        key={sectionData.id}
                        sectionData={sectionData}
                        setReqStatus={setReqStatus}
                        setReqTypeId={setReqTypeId}
                        setRecordId={setRecordId}
                        RequisitionId={req_id}
                        RequisitionOrderId={req_order_id}
                        RecordId={RecordId}
                        RequisitionType={reqTypeId}
                        loadData={loadData}
                        setStatus={setStatus}
                        setStatusID={setStatusID}
                      />
                    ))}
                  <div className="col-12 col-sm-6 pb-4 ViewGrid-item ViewGrid-sizer"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal */}
          <Modal
            show={modalVisible}
            onHide={closeModal}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>On Hold</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="fw-500 required">Reason</label>
              <textarea
                className="form-control bg-transparent h-60px"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              ></textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Cancel
              </Button>
              <Button
                variant="warning"
                onClick={handleConfirm}
                disabled={disbale}
              >
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={modalVisible2}
            onHide={closeModalForUnValidate}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>UnValidate Record</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label className="fw-500 required">Reason</label>
              <textarea
                className="form-control bg-transparent h-60px"
                value={reason1}
                onChange={(e) => setReason1(e.target.value)}
              ></textarea>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModalForUnValidate}>
                Cancel
              </Button>
              <Button variant="warning" onClick={handleChangeUnValidate}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
          <Modal
            show={modalVisible1}
            onHide={closeModalForResend}
            backdrop="static"
            keyboard={false}
          >
            <Modal.Header closeButton>
              <Modal.Title>Re Send Order</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <span className="fw-400">
                Are you sure you want to resend order ?
              </span>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={closeModalForResend}>
                Cancel
              </Button>
              <Button variant="warning" onClick={handleConfirmResendOrder}>
                Confirm
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
};

export default OrderView;
