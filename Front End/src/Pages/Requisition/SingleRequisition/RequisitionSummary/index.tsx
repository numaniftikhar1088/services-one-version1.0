import LinkIcon from "@mui/icons-material/Link";
import { MenuItem } from "@mui/material";
import { AxiosResponse } from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { connect, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { getValueFromSessionStorage } from "Utils/Common/CommonMethods";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import { ZebraMultiPrint } from "Pages/Printing/ZebraMultiPrint";
import { DymoMultiPrint } from "Pages/Printing/DymoMultiPrint";
import BrotherPrint from "Pages/Printing/BrotherPrint";

const RequisitionSummary = () => {
  const location = useLocation();
  const [printers, setPrinters] = useState<any>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [reason, setReason] = useState<string>("");
  const [disbale, setDisable] = useState(false);
  const [status, setStatus] = useState<any>(false);
  const apiResponse = location?.state;
  const isExternalLogin =
    getValueFromSessionStorage("externalLogin") === "true";

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };

  console.log(apiResponse, "apiResponse?.data");

  const PdfDownload = async () => {
    apiResponse?.data?.requisitionOrderIDs.forEach((i: any) => {
      const obj = {
        reqId: apiResponse?.data?.requisitionID,
        requisitionOrderId: i,
      };
      RequisitionType.ShowOrderViewPdf(obj)
        .then((res: AxiosResponse) => {
          if (res.status === 200) {
            ShowBlob(res.data.data);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    });
  };
  const ValidatedDate = moment(apiResponse?.data?.patientDateOfBirth)?.format(
    "MM/DD/YYYY"
  );
  const navigate = useNavigate();
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
    orderId: number,
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
    }
  };
  function findFirstConditionMet(
    array: any[],
    condition1: any,
    condition2: any
  ) {
    for (const item of array) {
      if (condition1(item)) {
        return item;
      }
      if (condition2(item)) {
        return item;
      }
    }
    return null;
  }

  const pageLinks = useSelector((reducers: any) => reducers.Reducer?.links);
  const condition1 = (item: any) => item.linkUrl === "/incomplete-requisition";
  const condition2 = (item: any) => item.linkUrl === "/Pending-requisition";

  const hasPermission = findFirstConditionMet(
    pageLinks,
    condition1,
    condition2
  );

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

  const handleConfirm = () => {
    setDisable(true);
    RequisitionType.ViewRequisitionBulkStatusChange({
      RequisitionOrderIds: apiResponse?.data?.requisitionOrderIDs,
      statusId: 2,
      ActionReasons: reason,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          setDisable(false);
          closeModal();
          setReason("");
          setStatus(true);
        }
      })
      .catch((err: any) => {
        console.trace(err);
        toast.error("Failed to put order on hold");
      });
  };
  const closeModal = () => {
    setModalVisible(false);
    setReason("");
  };

  const openModal = () => {
    setModalVisible(true);
  };

  const handleOrderView = () => {
    for (let i = 0; i < apiResponse?.data?.requisitionOrderIDs.length; i++) {
      window.open(
        `/OrderView/${btoa(
          apiResponse?.data?.requisitionID.length
            ? apiResponse?.data?.requisitionID[i]
            : apiResponse?.data?.requisitionID
        )}/${btoa(apiResponse?.data?.requisitionOrderIDs[i])}`,
        "_blank"
      );
    }
  };
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-3 py-lg-6">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
              <ul className="breadcrumb breadcrumb-separatorless fs-7 my-0 pt-1">
                <li className="breadcrumb-item text-muted">
                  <a href="" className="text-muted text-hover-primary">
                    Home
                  </a>
                </li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted">Requisition</li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted">New Requisition</li>
                <li className="breadcrumb-item">
                  <span className="bullet bg-gray-400 w-5px h-2px"></span>
                </li>
                <li className="breadcrumb-item text-muted">
                  Requisition Summary
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="card">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-flex">
                  <h3>
                    {apiResponse?.message ||
                      "This Requisition has been successfully submitted"}
                  </h3>
                </div>
              </div>
              <div className="card-body py-md-4 py-3 row">
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div className="col-lg-12 col-12 mb-4">
                    <label className="required mb-2 fw-500">First Name</label>
                    <input
                      placeholder="First Name"
                      type="text"
                      name="firstName"
                      className="form-control bg-secondary"
                      value={apiResponse?.data?.firstName}
                      disabled
                    />
                  </div>
                  <div className="col-lg-12 col-12 mb-4">
                    <label className="required mb-2 fw-500">Last Name</label>
                    <input
                      placeholder="Last Name"
                      type="text"
                      name="lastName"
                      className="form-control bg-secondary"
                      value={apiResponse?.data?.lastName}
                      disabled
                    />
                  </div>
                  <div className="col-lg-12 col-12 mb-4">
                    <label className="required mb-2 fw-500">
                      Patient Date of Birth
                    </label>
                    <input
                      placeholder="Date Of Birth"
                      type="text"
                      name="patientDateOfBirth"
                      className="form-control bg-secondary"
                      value={ValidatedDate}
                      disabled
                    />
                  </div>
                  <div className="col-lg-12 col-12 mb-4">
                    <label className="required mb-2 fw-500">Order no</label>
                    <input
                      placeholder="Order Number"
                      type="text"
                      name="orderNo"
                      className="form-control bg-secondary"
                      value={apiResponse?.data?.orderNo}
                      disabled
                    />
                  </div>
                </div>
                <div className="col-xl-3 col-lg-3 col-md-6 col-sm-12 mb-3">
                  <div>
                    <label className="required mb-2 fw-500">Accession no</label>
                  </div>
                  {apiResponse?.data?.accessionNos &&
                    apiResponse?.data?.accessionNos.map((i: any) => (
                      <div key={i?.accessionNo} className="d-flex gap-2 mb-2">
                        <div>
                          <input
                            placeholder={i?.accessionNo}
                            type="text"
                            className="form-control bg-secondary"
                            value={i?.accessionNo}
                            disabled
                          />
                        </div>
                        {isExternalLogin ? null : (
                          <div>
                            <StyledDropButton
                              id="demo-positioned-button4"
                              aria-controls={
                                openDrop ? "demo-positioned-menu4" : undefined
                              }
                              aria-haspopup="true"
                              aria-expanded={openDrop ? "true" : undefined}
                              onClick={(event) =>
                                handleClick(event, "dropdown4")
                              }
                              size="medium"
                              variant="contained"
                              className="rounded"
                              sx={{
                                bgcolor: "brown",
                                "&:hover": {
                                  bgcolor: "brown",
                                },
                              }}
                            >
                              Print Label
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
                                    onClick={() =>
                                      PrintLabel(
                                        option?.label,
                                        option?.value,
                                        i?.requisitionOrderId,
                                        i?.requisitionId
                                      )
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
                        )}
                      </div>
                    ))}
                </div>
                {isExternalLogin ? null : (
                  <>
                    <hr />
                    <div className="d-flex justify-content-start gap-lg-3 gap-2 align-items-center mt-7">
                      <>
                        {!apiResponse?.workflowId && hasPermission && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => navigate(hasPermission.linkUrl)}
                          >
                            View Pending Requisition
                          </button>
                        )}
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={PdfDownload}
                        >
                          Print this Requisition
                        </button>
                        {!apiResponse?.workflowId && (
                          <Link
                            className="btn btn-info btn-sm"
                            to="/requisition"
                          >
                            Create New Requisition
                          </Link>
                        )}
                        {!apiResponse?.workflowId && (
                          <Link
                            className="btn btn-success btn-sm"
                            to="/view-requisition"
                          >
                            View All Requisition
                          </Link>
                        )}
                        {!apiResponse?.workflowId && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => openModal()}
                            disabled={status}
                          >
                            <i style={{ fontSize: "18px" }} className="fa">
                              &#xf04c;
                            </i>
                            {status ? "Requisition is on Hold" : "On Hold"}
                          </button>
                        )}
                        {!apiResponse?.workflowId && (
                          <button
                            className="btn btn-light-primary btn-sm"
                            onClick={() => handleOrderView()}
                          >
                            <i className="fa fa-eye text-success mr-2 w-20px"></i>
                            {"View Order"}
                          </button>
                        )}
                        {apiResponse?.data?.mapCollectionURL ? (
                          <button
                            className="btn btn-linkedin btn-sm"
                            rel="noopener noreferrer"
                            onClick={() => {
                              window.open(
                                apiResponse?.data?.mapCollectionURL,
                                "_blank"
                              );
                            }}
                          >
                            <LinkIcon /> Map Url
                          </button>
                        ) : null}
                      </>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
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
          <Button variant="warning" onClick={handleConfirm} disabled={disbale}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      ;
    </>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}

export default connect(mapStateToProps)(RequisitionSummary);
