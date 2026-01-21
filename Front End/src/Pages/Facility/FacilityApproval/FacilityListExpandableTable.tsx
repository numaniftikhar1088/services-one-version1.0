import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import moment from "moment";
import React from "react";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../Utils/Style/Dropdownstyle";

interface Props {
  facilityUserList: any;
  selectedBox: any;
  tabKey: any;
  onFacilityStatusChange: any;
  item: any;
  changeStatus: any;
}

export function extractDatePattern(dateTimeString: any) {
  const parts = dateTimeString.split("T");
  if (parts.length === 2) {
    const datePart = parts[0];
    const timePart = parts[1].substring(0, 8);

    const dateParts = datePart.split("-");
    if (dateParts.length === 3) {
      const year = dateParts[0];
      const month = dateParts[1];
      const day = dateParts[2];

      return `${month}/${day}/${year} ${timePart}`;
    }
  }
  return dateTimeString;
}

export function ConvertUTCTimeToLocal(dateTimeString: any) {
  var time = moment(dateTimeString).utc();
  var localtime = time.local().format("MM/DD/yyyy hh:mm:ss A");
  return localtime;
}

export function ConvertUTCDate(dateTimeString: any) {
  var time = moment(dateTimeString);
  var formatedDate = time.format("MM/dd/yyyy");
  return formatedDate;
}

const FacilityListExpandableTable: React.FC<Props> = ({
  facilityUserList,
  selectedBox,
  tabKey,
  onFacilityStatusChange,
  item,
  changeStatus,
}) => {
  const { t } = useLang();
  const [open, setOpen] = React.useState(false);
  let id = item.facilityId;

  // *********** Dropdown Function START ***********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // *********** Dropdown Function End ***********

  const [value, setValue] = React.useState<any>(null);
  const [status, setStatus] = React.useState<any>("");
  const ModalhandleClose1 = () => {
    setShow1(false);
    setValue(null);
    setStatus("");
  };
  const [show1, setShow1] = React.useState(false);
  const handleClickOpen = (userid: any, status: any) => {
    setShow1(true);
    setValue(userid);
    setStatus(status);
  };
  console.log(item, "itemitem");

  return (
    <>
      <Modal
        id="FacilityRequestModal"
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          id="FacilityRequestModalHeader"
          closeButton
          className="bg-light-primary m-0 p-5"
        >
          {status === "isapproved" ? (
            <h4>{t("Approval")}</h4>
          ) : (
            <h4>{t("Rejected")}</h4>
          )}
        </Modal.Header>

        {status === "isapproved" ? (
          <Modal.Body id="FacilityRequestModalBodyApprove">
            {t("Are you sure you want to approve this facility ?")}
          </Modal.Body>
        ) : (
          <Modal.Body id="FacilityRequestModalBodyReject">
            {t("Are you sure you want to reject this facility ?")}
          </Modal.Body>
        )}
        <Modal.Footer id="FacilityRequestModalFooter" className="p-0">
          <button
            id="FacilityRequestModalNo"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("No")}
          </button>
          <button
            id="FacilityRequestModalYes"
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              changeStatus(value, status);
              ModalhandleClose1();
            }}
          >
            {t("Yes")}
          </button>
        </Modal.Footer>
      </Modal>

      <TableRow id={`facilityListRow_${item.facilityId}`}>
        <>
          {tabKey === 0 ? (
            <TableCell
              id={`facilityListActionsCell_${item.facilityId}`}
              className="text-center"
            >
              <StyledDropButtonThreeDots
                id={`FacilityRequest3Dots_${item.facilityId}`}
                aria-controls={
                  openDrop
                    ? `demo-positioned-menu_${item.facilityId}`
                    : undefined
                }
                aria-haspopup="true"
                aria-expanded={openDrop ? "true" : undefined}
                onClick={handleClick}
                className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
              >
                <i
                  id={`FacilityRequest3DotsIcon_${item.facilityId}`}
                  className="bi bi-three-dots-vertical p-0 icon"
                ></i>
              </StyledDropButtonThreeDots>

              <StyledDropMenuMoreAction
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={openDrop}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Facility Request"
                  permissionIdentifier="View"
                >
                  <MenuItem
                    id={`FacilityRequestViewMenuItem_${item.facilityId}`}
                    onClick={handleClose}
                    className=" p-0"
                  >
                    <Link
                      id={`FacilityRequestView_${item.facilityId}`}
                      className="text-dark w-100 h-100"
                      to={`/facility-view-approval/${btoa(item?.facilityId)}`}
                    >
                      <i className="fa fa-eye text-success mr-2 w-20px"></i>
                      {t("View")}
                    </Link>
                  </MenuItem>
                </PermissionComponent>
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Facility Request"
                  permissionIdentifier="Approve"
                >
                  <MenuItem className=" p-0">
                    <a
                      id={`FacilityRequestApproveMenuItem_${item.facilityId}`}
                      onClick={() => {
                        handleClose();
                        handleClickOpen(item.facilityId, "isapproved");
                      }}
                      className=" w-100px text-dark"
                    >
                      <i
                        className="fa fa-check text-success mr-2  w-20px"
                        aria-hidden="true"
                      ></i>
                      {t("Approve")}
                    </a>
                  </MenuItem>
                </PermissionComponent>
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Facility Request"
                  permissionIdentifier="Rejected"
                >
                  <MenuItem className=" p-0" >
                  <a
                    id={`FacilityRequestRejectedMenuItem_${item.facilityId}`}
                    onClick={() => {
                      handleClose();
                      handleClickOpen(item.facilityId, "rejected");
                    }}
                    className=" w-100px text-dark"
                  >
                    <i className="fa-solid fa-ban text-danger mr-2  w-20px"></i>
                    {t("Rejected")}
                    </a>
                  </MenuItem>
                </PermissionComponent>
              </StyledDropMenuMoreAction>
            </TableCell>
          ) : null}

          <TableCell
            id={`facilityNameCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.facilityName}
          </TableCell>
          <TableCell
            id={`phoneCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.phone}
          </TableCell>
          <TableCell
            id={`primaryContactNameCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.primaryContactName}
          </TableCell>
          <TableCell
            id={`primaryContactEmailCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.primaryContactEmail}
          </TableCell>
          <TableCell
            id={`address1Cell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.address1}
          </TableCell>
          <TableCell
            id={`address2Cell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.address2}
          </TableCell>
          <TableCell
            id={`cityCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.city}
          </TableCell>
          <TableCell
            id={`zipCodeCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.zipCode}
          </TableCell>
          <TableCell
            id={`submittedByCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.submittedBy}
          </TableCell>
          <TableCell
            id={`submittedDateCell_${item.facilityId}`}
            sx={{ width: "max-content", whiteSpace: "nowrap" }}
          >
            {item?.submittedDate}
          </TableCell>
        </>
      </TableRow>
    </>
  );
};

export default FacilityListExpandableTable;
