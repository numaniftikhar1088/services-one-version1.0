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
import Status from "Shared/Common/Status";

function Row(props: { row: any }) {
  const { t } = useLang();

  const { row } = props;
  const { loadDataShipmentTracking, courierName } = useCourierContext();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleArchived = () => {
    InsuranceService.ArchivedRecordShipment(row.id)
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadDataShipmentTracking(false, false);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  return (
    <TableRow className="h-30px">
      <TableCell>
        <div className="d-flex justify-content-center">
          <StyledDropButtonThreeDots
            id="demo-positioned-button"
            aria-controls={openDrop ? "demo-positioned-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={openDrop ? "true" : undefined}
            onClick={handleClick}
            className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
          >
            <i className="bi bi-three-dots-vertical p-0 icon"></i>
          </StyledDropButtonThreeDots>
          <StyledDropMenuMoreAction
            id="demo-positioned-menu"
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
              pageName={`${courierName === "UPS"
                ? "UPS Pickup and Shipment"
                : "FedEx Pickup and Shipment"
                }`}
              permissionIdentifier={`${courierName === "UPS" ? "Archived" : "Archived"
                }`}
            >
              <MenuItem
                className=" w-auto"
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
              </MenuItem>
            </PermissionComponent>
            <PermissionComponent
              moduleName="Shipping and Pickup"
              pageName={`${courierName === "UPS"
                ? "UPS Pickup and Shipment"
                : "FedEx Pickup and Shipment"
                }`}
              permissionIdentifier={`${courierName === "UPS"
                ? "Checkforstatusupdate"
                : "Checkforstatusupdate"
                }`}
            >
              <MenuItem
                className=" w-auto"
                onClick={() => {
                  handleClose();
                  handleArchived();
                }}
              >
                <i
                  className="fa fa-flag text-warning mr-2"
                  aria-hidden="true"
                ></i>
                {t("Check for Status Update")}
              </MenuItem>
            </PermissionComponent>
          </StyledDropMenuMoreAction>
        </div>
      </TableCell>
      <TableCell sx={{ width: "max-content" }}>
        <span>{row?.facilityName}</span>
      </TableCell>

      <TableCell sx={{ width: "max-content" }}>{row?.trackingNumber}</TableCell>

      <TableCell>{moment(row?.dateofScan).format("MM-DD-YYYY")}</TableCell>
      <TableCell sx={{ width: "max-content", textAlign: 'center' }}>
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === "In Transit"
              ? "badge-status-in-transit"
              : row?.status === "Canceled"
                ? "badge-status-canceled"
                : "badge-status-default"
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default Row;
