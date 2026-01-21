import DoneIcon from "@mui/icons-material/Done";
import { IconButton } from "@mui/material";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectStyle, styles } from "Utils/Common";
import { StyledDropButtonThreeDots } from "Utils/Style/Dropdownstyle";

const Row = (props: {
  handleChange: any;
  index: any;
  rowData: any;
  UndoDigitalCheckIn: any;
  formatDate: any;
  onKey: any;
  inputsRef: any;
  setRows: any;
  rows: any;
}) => {
  const {
    handleChange,
    index,
    rowData,
    UndoDigitalCheckIn,
    formatDate,
    onKey,
    inputsRef,
    setRows,
    rows,
  } = props;

  const initialAddRejection = {
    subject: "",
    description: "",
  };
  const { t } = useLang();

  const [dateOfCollection, setDateOfCollection] = useState(
    moment(rowData?.dateOfCollection).format("YYYY-MM-DD")
  );

  useEffect(() => {
    setDateOfCollection(moment(rowData?.dateOfCollection).format("YYYY-MM-DD"));
  }, [rowData?.dateOfCollection]);

  const [show, setShow] = useState(false);
  const [showDisclaimer, setShowDisclaimer] = useState(false);
  const [reason, setReason] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [inputFields, setInputFields] = useState<boolean>(false);

  const [rejectionDisclaimerReason, getRejectionDisclaimerReasonLookup] =
    useState<any>([]);
  const [disclaimerReason, setDisclaimerReason] = useState<any>([]);
  const [selectedReason, setSelectedReason] = useState<any>(null);
  const open = Boolean(anchorEl);
  const [addRejection, setAddRejection] = useState<{
    subject: string;
    description: string;
  }>(initialAddRejection);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleClickOpen = (type: string) => {
    if (!rowData.id) return toast.error(t("Please enter a record first."));
    if (!rowData.requisitionOrderID)
      return toast.error(t("This record was not found in our system."));
    if (type === "reject") {
      setShow(true);
      getRejectionReasonLookup();
    } else {
      setShowDisclaimer(true);
      getDisclaimerReasonLookup();
    }
  };

  const getRejectionReasonLookup = async () => {
    await RequisitionType.GetRejectionReasonLookup().then((res: any) => {
      getRejectionDisclaimerReasonLookup(res?.data);
    });
  };

  const getDisclaimerReasonLookup = async () => {
    await RequisitionType.GetDisclaimerReasonLookup().then((res: any) => {
      getRejectionDisclaimerReasonLookup(res?.data);
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setAddRejection((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddReasonClick = () => {
    setInputFields(true); // Show the input fields on button click
  };

  const handleAddReasonClickClose = () => {
    setInputFields(false);
    setAddRejection(initialAddRejection); // Show the input fields on button click
  };

  const addRejectionReason = async () => {
    let obj = {
      text: addRejection?.subject,
      subject: addRejection?.subject,
      description: addRejection?.description,
      requisitionAssignment: [],
    };
    if (addRejection?.subject != "" && addRejection?.description != "") {
      await RequisitionType.AddRejectionReason(obj).then((res: any) => {
        if (res.status === 200) {
          toast.success(t(res?.data?.message));
          handleAddReasonClickClose();
          getRejectionReasonLookup();
        }
      });
    } else {
      toast.error(t("Please fill all the required fields."));
    }
  };

  const addDisclaimerReason = async () => {
    let obj = {
      text: addRejection?.subject,
      subject: addRejection?.subject,
      description: addRejection?.description,
      requisitionAssignment: [],
    };
    if (addRejection?.subject != "" && addRejection?.description != "") {
      await RequisitionType.AddNewDisclaimer(obj).then((res: any) => {
        if (res.status === 200) {
          toast.success(t(res?.data?.message));
          handleAddReasonClickClose();
          getDisclaimerReasonLookup();
        }
      });
    } else {
      toast.error(t("Please fill all the required fields."));
    }
  };

  const RejectDigitalCheckIn = async (id: any) => {
    if (!selectedReason) {
      return toast.error(
        t("A rejection reason is required. Please select one to proceed.")
      );
    }

    const obj = {
      statusId: 4,
      requisitionOrderIds: [rowData.requisitionOrderID],
      actionReasons: selectedReason,
      rejectComment: reason,
    };

    try {
      const res: AxiosResponse = await RequisitionType.RejectDigitalCheckIn(
        obj
      );
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t("Record Successfully Processed"));
        setSelectedReason(null);
        setShow(false);
        setRows((prevRows: any) =>
          prevRows.filter((row: any) => row.id !== id)
        );
      } else {
        toast.error(t("Error ..."));
        setSelectedReason(null);
      }
    } catch (error) {
      toast.error(t("An error occurred while processing the request."));
    }
  };

  const DisclaimerDigitalCheckIn = async (id: any) => {
    if (!selectedReason) {
      return toast.error(
        t("A disclaimer reason is required. Please select one to proceed.")
      );
    }

    const obj = {
      requisitionOrderId: rowData.requisitionOrderID,
      disclaimerId: selectedReason,
      disclaimerComment: reason,
    };

    try {
      const res: AxiosResponse = await RequisitionType.DisclaimerDigitalCheckIn(
        obj
      );
      if (res?.data?.statusCode === 200) {
        toast.success(t(res?.data?.message));
        setSelectedReason(null);
        setShowDisclaimer(false);
        setRows((prevRows: any) =>
          prevRows.filter((row: any) => row.id !== id)
        );
      } else {
        toast.error(t(res?.data?.message));
        setSelectedReason(null);
      }
    } catch (error) {
      toast.error(t("An error occurred while processing the request."));
    }
  };

  const handleChangeForActionReason = (message: any) => {
    setReason(message);
  };

  const handleChangeRejectionReasonDropdown = (event: any) => {
    setSelectedReason(event.value);
  };

  const ModalhandleClose = () => {
    setShow(false);
    setShowDisclaimer(false);
    setSelectedReason(null);
    setReason("");
    getRejectionDisclaimerReasonLookup([]);
    handleAddReasonClickClose();
  };

  const updateDateOfCollection = async () => {
    if (!dateOfCollection) {
      toast.error("Please select date of collection.");
      return;
    }

    const formData = new FormData();

    formData.append("DateOfCollection", dateOfCollection);
    formData.append("TimeOfCollection", rowData?.timeOfCollection);
    formData.append("RequisitionOrderId", rowData?.requisitionOrderID);
    formData.append("RequisitionId", rowData?.requisitionID);
    formData.append("NextStep", "null");

    try {
      const response =
        await RequisitionType.updateRequisitionCollectionDateAndTime(formData);
      if (response.data.httpStatusCode === 200) {
        toast.success("Record updated successfully");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDateOfCollection = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedRows = rows.map((row: any) => {
      if (row.id === rowData.id) {
        setDateOfCollection(event.target.value);

        return { ...row, dateOfCollection: event.target.value };
      }
      return row;
    });
    setRows(updatedRows);
  };

  return (
    <>
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
              inputId="RejectModalReason"
              options={rejectionDisclaimerReason}
              placeholder={"Select Reason"}
              theme={(theme) => styles(theme)}
              isSearchable={true}
              onChange={(e) => handleChangeRejectionReasonDropdown(e)}
              styles={reactSelectStyle}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              id="RejectModalAddAnotherReason"
              className="btn btn-warning btn-sm mb-2"
              onClick={handleAddReasonClick}
            >
              {t("Add Another Reason")}
            </button>
          </div>
          {inputFields && (
            <>
              <div>
                <div className="mb-3">
                  <label className="form-label required">{t("Subject")}</label>
                  <input
                    id="RejectModalSubject"
                    type="text"
                    name="subject"
                    className="form-control bg-transparent"
                    placeholder={t("Subject")}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">
                    {t("Description")}
                  </label>
                  <input
                    id="RejectModalDescription"
                    type="text"
                    name="description"
                    className="form-control bg-transparent"
                    placeholder={t("Description")}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  id="rejectModalCancel1st"
                  className="btn btn-info btn-sm mb-2"
                  onClick={handleAddReasonClickClose}
                >
                  {t("Cancel")}
                </button>
                <button
                  id="RejectModalSave1St"
                  className="btn btn-primary btn-sm mb-2"
                  onClick={addRejectionReason}
                >
                  {t("Save")}
                </button>
              </div>
            </>
          )}
          <>
            <div className="mb-2">
              <span className="fw-500">{t("Following Order is selected")}</span>
            </div>
            <br />
            <div>
              <>
                <span key={index}>{rowData?.orderNumber}</span>
                <span> | </span>
                <span key={index}>
                  {moment(rowData?.dateScanned).format("MM/DD/YYYY")}
                </span>
                <span> | </span>
                <span key={index}>{rowData?.requisitionType}</span>
              </>
            </div>
            <br />
            <div>
              {selectedReason && (
                <div className="mt-5">
                  <span className="fw-bold">{t("Reason")} : </span>
                  <span className="text-danger">{selectedReason}</span>
                </div>
              )}
            </div>
            <div className="mt-5">
              <label className="form-label">{t("Rejection Comment")}</label>
              <textarea
                id="RejectModalRejectionComments"
                name="rejectComment"
                className="form-control bg-transparent mb-3 mb-lg-0 h-50px"
                placeholder={t("Rejection Comments")}
                required
                onChange={(event: any) =>
                  handleChangeForActionReason(event?.target?.value)
                }
              />
            </div>
          </>
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id="RejectModalCancel"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            id="RejectModalCancel"
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              RejectDigitalCheckIn(rowData.id);
            }}
          >
            {t("Reject")}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showDisclaimer}
        onHide={ModalhandleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Rejection / Disclaimer Details")}</h4>
        </Modal.Header>
        <Modal.Body>
          <div className="fv-row mb-4">
            <label htmlFor="status" className="mb-2 required form-label">
              {t("Rejection / Disclaimer Details")}
            </label>
            <Select
              inputId="BulkCheckIn2ndTabModalDisclaimerDetails"
              options={rejectionDisclaimerReason}
              placeholder={t("Select Reason")}
              theme={(theme) => styles(theme)}
              isSearchable={true}
              onChange={(e) => handleChangeRejectionReasonDropdown(e)}
              styles={reactSelectStyle}
            />
          </div>
          <div className="d-flex justify-content-end gap-2">
            <button
              id="RejectModalAddAnotherReason"
              className="btn btn-warning btn-sm mb-2"
              onClick={handleAddReasonClick}
            >
              {t("Add Another Reason")}
            </button>
          </div>
          {inputFields && (
            <>
              <div>
                <div className="mb-3">
                  <label className="form-label required">{t("Subject")}</label>
                  <input
                    id="RejectModalSubject"
                    type="text"
                    name="subject"
                    className="form-control bg-transparent"
                    placeholder={t("Subject")}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label required">
                    {t("Description")}
                  </label>
                  <input
                    id="RejectModalDescription"
                    type="text"
                    name="description"
                    className="form-control bg-transparent"
                    placeholder={t("Description")}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="d-flex justify-content-end gap-2">
                <button
                  id="rejectModalCancel1st"
                  className="btn btn-info btn-sm mb-2"
                  onClick={handleAddReasonClickClose}
                >
                  {t("Cancel")}
                </button>
                <button
                  id="RejectModalSave1St"
                  className="btn btn-primary btn-sm mb-2"
                  onClick={addDisclaimerReason}
                >
                  {t("Save")}
                </button>
              </div>
            </>
          )}
          <div className="mt-5">
            <label className="form-label">{t("Disclaimer Comment")}</label>
            <textarea
              id="BulkCheckIn2ndTabModalRejectionComments"
              name="rejectComment"
              className="form-control bg-transparent mb-3 mb-lg-0 h-50px"
              placeholder={t("Rejection Comments")}
              required
              onChange={(event: any) =>
                handleChangeForActionReason(event?.target?.value)
              }
            />
          </div>
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id="DisclaimerModalCancel"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            id="DisclaimerModalSave"
            type="button"
            className="btn btn-primary m-2"
            onClick={() => {
              DisclaimerDigitalCheckIn(rowData.id);
            }}
          >
            {t("Save")}
          </button>
        </Modal.Footer>
      </Modal>
      <TableRow>
        <TableCell className="text-center fw-bold">{index + 1}</TableCell>
        <TableCell>
          <input
            type="text"
            className={
              rowData.id !== undefined
                ? "form-control bg-secondary h-30px"
                : "form-control bg-transparent h-30px"
            }
            id={`AccessionNumber_${rowData.id || index + 1}`}
            ref={(el) => {
              if (el) inputsRef.current[index] = el;
            }}
            name="number"
            value={rowData.number}
            disabled={rowData.id !== undefined}
            onChange={(event: any) => handleChange(event.target.value, index)}
            onKeyDown={(e) => onKey(e, index, rowData.number)}
          />
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center rotatebtnn">
            <StyledDropButtonThreeDots
              id={`BulkCheckInDigitalCheckIn3Dots_${index + 1}`}
              aria-controls={open ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={open ? "true" : undefined}
              onClick={handleOpenMenu}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleCloseMenu}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
            >
              <MenuItem>
                <a
                  id={`BulkCheckInDigitalCheckInReject`}
                  className=" p-0 text-dark"
                  onClick={() => {
                    handleClickOpen("reject");
                    handleCloseMenu();
                  }}
                >
                  <i
                    style={{ fontSize: "20px" }}
                    className="fa text-danger me-4"
                  >
                    &#xf00d;
                  </i>
                  <span>{t("Reject")}</span>
                </a>
              </MenuItem>
              <MenuItem>
                <a
                  id={`BulkCheckInDigitalCheckInDisclaimer}`}
                  className="p-0  text-dark"
                  onClick={() => {
                    handleClickOpen("disclaimer");
                    handleCloseMenu();
                  }}
                >
                  <i
                    style={{ fontSize: "16px" }}
                    className="fas text-warning me-4"
                  >
                    &#xf071;
                  </i>
                  <span>{t("Disclaimer")}</span>
                </a>
              </MenuItem>
              {rowData?.status?.toLowerCase() === "processing" && (
                <MenuItem>
                  <a
                    id={`BulkCheckInDigitalCheckInUndoCheckIn`}
                    className="p-0 w-100px text-dark"
                    onClick={() => {
                      UndoDigitalCheckIn(rowData.id);
                      handleCloseMenu();
                    }}
                  >
                    <i
                      style={{ fontSize: "20px" }}
                      className="fa text-primary me-2"
                    >
                      &#xf0e2;
                    </i>
                    <span>{t("Undo Check In")}</span>
                  </a>
                </MenuItem>
              )}
            </Menu>
          </div>
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInaccessionNumber_${index + 1}`}>
          {rowData.accessionNumber}
        </TableCell>
        <TableCell
          id={`BulkCheckInDigitalCheckInStatus_${index + 1}`}
          className="text-center"
        >
          {rowData.status === "Not Found" ? (
            <span className="badge badge-pill px-4 py-2 rounded-4 fw-400 fa-1x badge-danger">
              {rowData.status}
            </span>
          ) : (
            <span className="badge badge-pill px-4 py-2 rounded-4 fw-400 fa-1x badge-primary">
              {rowData.status}
            </span>
          )}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInspecimenType_${index + 1}`}>
          {rowData.specimenType}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInfacilityName_${index + 1}`}>
          {rowData.facilityName}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckIn1stName_${index + 1}`}>
          {rowData.firstName}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInLastName_${index + 1}`}>
          {rowData.lastName}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInDateOfBirth_${index + 1}`}>
          {formatDate(rowData.dateOfBirth)}
        </TableCell>
        <TableCell
          id={`BulkCheckInDigitalCheckInDateOfCollection_${index + 1}`}
        >
          {rowData?.requisitionOrderID && (
            <div className="d-flex justify-content-center align-items-center gap-2">
              <input
                className="form-control h-30px rounded-2 w-100"
                type="date"
                value={dateOfCollection}
                onChange={handleDateOfCollection}
                max={new Date().toISOString().split("T")[0]}
              />
              <IconButton
                onClick={updateDateOfCollection}
                style={{ border: "1px solid grey" }}
                aria-label="delete"
              >
                <DoneIcon color="success" />
              </IconButton>
            </div>
          )}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInDateScanned_${index + 1}`}>
          {formatDate(rowData.dateScanned)}
        </TableCell>
        <TableCell id={`BulkCheckInDigitalCheckInUser_${index + 1}`}>
          {rowData.user}
        </TableCell>
      </TableRow>
    </>
  );
};

export default Row;
