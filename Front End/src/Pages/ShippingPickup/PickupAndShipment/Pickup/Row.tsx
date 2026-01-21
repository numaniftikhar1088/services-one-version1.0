import { MenuItem, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useCourierContext } from "../../../../Shared/CourierContext";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../../Utils/Style/Dropdownstyle";
import useLang from "Shared/hooks/useLanguage";

function Row(props: { row: any }) {
  const { t } = useLang();

  const { row } = props;
  const { loadData, courierName, handleOpenCancelModal, openCancelModal } =
    useCourierContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleArchived = () => {
    InsuranceService.ArchivedRecordPickup(row.id)
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadData(false, false);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  // const isDisabled = openCancelModal;
  return (
    <>
      <TableRow className="h-30px">
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`ShipingAndPickupPickup3Dots_${row.id}`}
              aria-controls={openDrop ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop ? "true" : undefined}
              onClick={handleClick}
              // disabled={openCancelModal ? true : false}
              className={`btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4`}
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
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
                moduleName="Shipping and Pickup"
                pageName={`${
                  courierName === "UPS"
                    ? "UPS Pickup and Shipment"
                    : "FedEx Pickup and Shipment"
                }`}
                permissionIdentifier={`${
                  courierName === "UPS" ? "Archived" : "Archived"
                }`}
              >
                <MenuItem className="p-0">
                  <a
                    id={`ShipingAndPickupPickupArchived`}
                    className=" w-auto p-0 text-dark"
                    onClick={() => {
                      handleClose();
                      handleArchived();
                    }}
                  >
                    <i
                      className="bi bi-archive-fill text-success mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Archived")}
                  </a>
                </MenuItem>
              </PermissionComponent>

              <PermissionComponent
                moduleName="Shipping and Pickup"
                permissionIdentifier="Cancel"
                pageName={`${
                  courierName === "FedEx"
                    ? "FedEx Pickup and Shipment"
                    : "UPS Pickup and Shipment"
                }`}
              >
                <MenuItem className="p-0">
                  <a
                    id={`ShipingAndPickupPickupArchived`}
                    className=" w-auto p-0 text-dark"
                    onClick={() => {
                      handleClose();
                      handleOpenCancelModal(row);
                      // Scroll window to top
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                  >
                    <i
                      className="bi bi-x-lg text-danger mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Cancel Order")}
                  </a>
                </MenuItem>
              </PermissionComponent>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupContectName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <span>{row?.contactName}</span>
        </TableCell>

        <TableCell
          id={`ShipingAndPickupPickupCompanyName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.companyName}
        </TableCell>

        <TableCell id={`ShipingAndPickupPickupAddress_${row.id}`}>
          {row?.address}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupCity_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.city}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupStateName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.stateName}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupZipCode_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.zipCode}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupPickupDate_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {moment(row?.pickupDate).format("MM-DD-YYYY")}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupPickupTime_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {moment(row?.startPickupTime).format("HH:mm:ss")}-
          {moment(row?.endPickupTime).format("HH:mm:ss")}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupTrackingNumber_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.trackingNumber}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupDispatchConfirmation_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.dispatchConfirmationNo}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupLocation_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.location}
        </TableCell>
        {courierName === "UPS" ? (
          <TableCell
            id={`ShipingAndPickupPickupPackageWeight_${row.id}`}
            sx={{ width: "max-content" }}
          >
            {row?.packageWeight}
          </TableCell>
        ) : null}
        <TableCell
          id={`ShipingAndPickupPickupRemarks_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.remarks}
        </TableCell>
        <TableCell
          id={`ShipingAndPickupPickupLogIdentifier_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.logIdentifier}
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
