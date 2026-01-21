import { Box, Collapse, IconButton, MenuItem, TableCell, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../../Utils/Style/Dropdownstyle";
import BootstrapModal from "react-bootstrap/Modal";
import {
  RequisitionReportSave,
  RequisitionReportShare,
} from "../../../../Services/Requisition/RequisitionReports/RequisitionReport";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import Select, { ActionMeta, MultiValue } from "react-select";
import useLang from "./../../../../Shared/hooks/useLanguage";
import { toast } from "react-toastify";
import { AddIcon, RemoveICon } from "Shared/Icons";
import { RxCross2 } from "react-icons/rx";

type OptionType = { value: number; label: string };

function ScheduledRow({ row, index, onDelete, userLookup, showData, setApiGetData, apiGetData }: any) {
  const { t } = useLang();
  const [expandUser, setExpandUser] = useState(false);
  const ShowUserList = () => setExpandUser(!expandUser);

  const frequencylookup: OptionType[] = [
    { value: 1, label: t("Daily") },
    { value: 2, label: t("Weekly") },
    { value: 3, label: t("Monthly") },
  ];

// Check if any row is currently in edit mode
const isAnyRowInEditMode = apiGetData.some((r: any) => r.rowStatus === true); 

// State to manage multiple dropdown anchors by name (for opening/closing dropdown menus)
const [anchorEl, setAnchorEl] = useState({
  dropdown1: null,
  dropdown2: null,
  dropdown3: null,
  dropdown4: null,
});

// Opens a dropdown menu by setting its anchor element (used for dropdown positioning)
const handleClick = (event: any, dropdownName: any) => {
  setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
};

// Closes a dropdown menu by clearing its anchor element
const handleClose = (dropdownName: string) => {
  setAnchorEl({ ...anchorEl, [dropdownName]: null });
};

// Deletes a scheduled report by calling parent handler with the given ID
const handleDelete = (id: number) => {
  onDelete(id);
};

// State to control visibility of alert modal
const [openalert, setOpenAlert] = useState(false);

// Closes alert modal
const handleCloseAlert = () => setOpenAlert(false);

// Opens alert modal and closes dropdown2 menu
const handleClickOpen = (item: any, status: string) => {
  handleClose("dropdown2");
  setOpenAlert(true);
};

// State to control visibility of share modal
const [openShare, setOpenShare] = useState(false);

// Closes share modal
const handleCloseShare = () => setOpenShare(false);

// Opens share modal, closes dropdown2, and pre-selects users based on current row's userNames
const handleShareOpen = (item: any, status: string) => {
  handleClose("dropdown2");
  const selectedUsers = userLookup.filter((user: OptionType) =>
    row.userNames?.includes(user.value)
  );
  setMultiSelect(selectedUsers); 
  setOpenShare(true);            
};

// Handles changes to the datetime-local input field for a specific row
const handleDateTimeChange = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
  const value = e.target.value;
  setApiGetData((curr: any) =>
    curr.map((x: any) =>
      x.id === id
        ? {
            ...x,
            scheduledDate: value,
          }
        : x
    )
  );
};

// State for managing selected users in multi-select dropdown (used in share modal)
const [multiSelect, setMultiSelect] = useState<OptionType[]>([]);

// Updates multiSelect state when users are selected or deselected in share modal
const handleSelectUser = (
  newValue: MultiValue<OptionType>,
  actionMeta: ActionMeta<OptionType>
) => {
  setMultiSelect(newValue as OptionType[]);
};

// Enables editing mode for a specific row by setting its rowStatus to true and others to false
const getValues = (r: any) => {
  const updatedRows = apiGetData.map((row: any) => ({
    ...row,
    rowStatus: row.id === r.id, 
  }));
  setApiGetData(updatedRows);
};

// Handles changes for input/select fields in a row by updating that field's value
const handleChange = (name: string, value: string | number, id: number) => {
  setApiGetData((curr: any) =>
    curr.map((x: any) =>
      x.id === id
        ? {
            ...x,
            [name]: value,
          }
        : x
    )
  );
};

// Saves the edited or new scheduled report to backend and refreshes data on success
const handlesave = async () => {
  try {
    if (!row.frequency || !row.frequency.trim()) {
      toast.error(t("Frequency cannot be empty."));
      return;
    }

    const payload = {
      id: row.id || 0,
      reportName: row.reportName,
      frequency: row.frequency,
      scheduledDate: row.scheduledDate,
      userNames: row.userNames,
    };

    const res = await RequisitionReportSave(payload);

    if (res?.data?.statusCode === 200) {
      showData();             
      handleClose("dropdown2");
      toast.success(res?.data?.message);
      setExpandUser(false);
    } else {
      toast.error(res?.data?.message || "Something went wrong.");
    }
  } catch (error) {
    console.error("Error in handlesave:", error);
    toast.error("An unexpected error occurred.");
  }
};

// Cancels editing on a row or removes it if it is a new unsaved row (id === 0)
const handleCancel = (row: any, index: number) => {
  handleClose("dropdown2");
  setExpandUser(false);
  if (row.id !== 0) {
    // Exit edit mode for the row
    const updatedRows = apiGetData.map((r: any) => {
      if (r.id === row.id) {
        return { ...r, rowStatus: false };
      }
      return r;
    });
    setApiGetData(updatedRows);
  } else {
    // Remove unsaved new row
    let newArray = [...apiGetData];
    newArray.splice(index, 1);
    setApiGetData(newArray);
  }
  showData(); 
};

// Shares the scheduled report with selected users by sending their IDs to backend
const ScheduledShare = async () => {
  const obj = {
    reportID: row.id,
    userIds: multiSelect.map((option) => option.value),
  };
  let resp = await RequisitionReportShare(obj);
  setOpenShare(false);
  showData();          
};

// Synchronize multiSelect state whenever row.userNames or userLookup changes
useEffect(() => {
  if (row.userNames && userLookup && userLookup.length > 0) {
    const selectedUsers = userLookup.filter((user: OptionType) =>
      row.userNames.includes(user.value)
    );
    setMultiSelect(selectedUsers);
  } else {
    setMultiSelect([]);
  }
}, [row.userNames, userLookup]);


  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          {expandUser ? (
            <button
            id={`ScheduleReportHideExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              onClick={ShowUserList}
            >
              <i className="bi bi-dash-lg" />
            </button>
          ) : (
            <button
            id={`ScheduleReportShowExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              onClick={ShowUserList}
            >
              <i className="bi bi-plus-lg" />
            </button>
          )}
        </TableCell>

        {/* Action Buttons */}
        <TableCell>
          {row.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="gap-2 d-flex">
                <button
                id={`ScheduleReportSave_${row.id}`}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={handlesave}
                >
                  <i className="bi bi-check2" />
                </button>
                <button
                  id={`ScheduleReportCancel_${row.id}`}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => handleCancel(row, index)}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <StyledDropButtonThreeDots
                id={`TubeType3Dots_${row.id}`}
                aria-haspopup="true"
                onClick={(event: any) => handleClick(event, "dropdown2")}
                className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
              >
                <i className="bi bi-three-dots-vertical p-0 icon"></i>
              </StyledDropButtonThreeDots>
              <StyledDropMenuMoreAction
                anchorEl={anchorEl.dropdown2}
                open={Boolean(anchorEl.dropdown2)}
                onClose={() => handleClose("dropdown2")}
                anchorOrigin={{ vertical: "top", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
              >
                <MenuItem className="w-100px p-0">
                  <a
                    onClick={() => handleClickOpen(row, row.id)}
                    className="w-100px text-dark"
                    id={`ScheduleReportDelete_${row.id}`}
                  >
                    <i className="fa fa-trash text-danger mr-2" aria-hidden="true"></i>
                    {t("Delete")}
                  </a>
                </MenuItem>
                <MenuItem disabled={isAnyRowInEditMode && !row.rowStatus}>
                  <button
                  id={`ScheduleReportEdit_${row.id}`}
                    className="text-start text-dark w-100 bg-transparent border-0"
                    onClick={() => getValues(row)}
                    disabled={isAnyRowInEditMode && !row.rowStatus} // ✅ Disable if another row is editing
                  >
                    <i className="fa fa-edit text-primary mr-2" />
                    {t("Edit")}
                  </button>
                </MenuItem>
              </StyledDropMenuMoreAction>
            </div>
          )}
        </TableCell>

        {/* Report Name */}
        <TableCell>
          {row.rowStatus ? (
            <input
            id={`ScheduleReportReportName`}
              type="text"
              name="reportName"
              className="form-control"
              value={row.reportName}
              onChange={(e) => handleChange(e.target.name, e.target.value, row.id)}
              disabled
            />
          ) : (
            <div id={`ScheduleReportReportName_${row.id}`}>{row.reportName}</div>
          )}
        </TableCell>

        {/* Frequency */}
        <TableCell>
          {row.rowStatus ? (
            <Select
              inputId="RequisitionReportFrequency"
              menuPortalTarget={document.body}
              theme={(theme: any) => styles(theme)}
              styles={reactSelectSMStyle}
              options={frequencylookup}
              name="frequency"
              value={frequencylookup.find((option) => option.label === row.frequency)}
              onChange={(selectedOption: OptionType | null) =>
                handleChange("frequency", selectedOption?.label || "", row.id)
              }
            />
          ) : (
            <div id={`ScheduleReportFrequency_${row.id}`}>{row.frequency}</div>
          )}
        </TableCell>

        {/* Scheduled Date */}
        <TableCell>
          {row.rowStatus ? (
            <input
              id={`ScheduleReportScheduleDate`}
              type="datetime-local"
              name="scheduledDate"
              className="form-control bg-transparent"
              value={row.scheduledDate ? row.scheduledDate.substring(0, 16) : ""}
              onChange={(e) => handleDateTimeChange(e, row.id)}
              min={new Date().toISOString().slice(0, 16)} // current date and time in proper format
            />

          ) : (
            <div id={`ScheduleReportScheduleDate_${row.id}`}>{row.scheduledDate}</div>
          )}
        </TableCell>

        {/* Share */}
        <TableCell>
          {!row.rowStatus && (
            <button
              id={`ShareButton_${row.id}`}
              className="btn btn-icon btn-sm fw-bold btn-info btn-icon-light"
              onClick={() => handleShareOpen(row, row.id)}
              disabled={isAnyRowInEditMode}
            >
              <i className="bi bi-share-fill"></i>
            </button>
          )}
        </TableCell>
      </TableRow>
      {/* Expanded User List */}
      <TableRow>
        <TableCell colSpan={12} className="padding-0">
          <Collapse in={expandUser} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <div className="row">
                <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                  <div className="card shadow-sm rounded border border-warning mt-3">
                    <div className="card-header d-flex justify-content-between align-items-center bg-light-secondary min-h-35px">
                      <h6 className="mb-0">{t("User List")}</h6>
                    </div>
                    <div className="card-body py-md-4 py-3">
                      <div className="row mt-3">
                        {multiSelect.map((data: OptionType, index: number) => (
                          <div
                            key={index}
                            className="col-xl-2 col-lg-2 col-md-2 col-sm-4 d-flex align-items-center"
                          >
                            {data.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      {/* Delete Modal */}
      <BootstrapModal show={openalert} onHide={handleCloseAlert} backdrop="static" keyboard={false}>
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>{t("Are you sure you want to delete this record ?")}</BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button type="button" className="btn btn-secondary" onClick={handleCloseAlert}>
            {t("Cancel")}
          </button>
          <button type="button" className="btn btn-danger m-2" onClick={() => handleDelete(row.id)}>
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>

      {/* Share Modal */}
      <BootstrapModal show={openShare} onHide={handleCloseShare} backdrop="static" keyboard={false}>
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5 py-2">
          <h4>{t("Share With Users")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body className="py-2">
          <label>{t("Users")}</label>
          <Select<OptionType, true>
           theme={(theme) => styles(theme)}
           isMulti
           menuPortalTarget={document.body}
           options={userLookup}
           styles={reactSelectSMStyle}
           name="UserShareList"
           onChange={handleSelectUser}
           value={multiSelect} // ✅ Should show selected values
         />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button type="button" className="btn btn-secondary" onClick={handleCloseShare}>
            {t("Cancel")}
          </button>
          <button type="button" className="btn btn-danger" onClick={ScheduledShare}>
            {t("Share")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}
export default ScheduledRow;
