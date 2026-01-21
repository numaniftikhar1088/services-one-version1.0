import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import Status from "Shared/Common/Status";

function Row(props: { row: any }) {
  const { row } = props;

  return (
    <TableRow className="h-30px">
      <TableCell
        id={`ReadyToShipShipedLabName_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.labName}
      </TableCell>

      <TableCell
        id={`ReadyToShipShipedRequisitionType_${row?.requisitionOrderId}`}
      >
        {row?.requsitionType}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedOrderNumber_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.orderNumber}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedDateOfCollection_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dateofCollection).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedTimeOfCollection_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.timeofCollection}
      </TableCell>
      <TableCell id={`ReadyToShipShipedFirstName_${row?.requisitionOrderId}`}>
        {row?.firstName}
      </TableCell>
      <TableCell id={`ReadyToShipShipedLastName_${row?.requisitionOrderId}`}>
        {row?.lastName}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedDOB_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dob).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedStatus_${row?.requisitionOrderId}`}
        sx={{ width: "max-content", textAlign: "center" }}
      >
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === "In Transit"
              ? "badge-status-in-transit"
              : "badge-status-default"
          }
        />
      </TableCell>
      <TableCell id={`ReadyToShipShipedCourierName_${row?.requisitionOrderId}`}>
        {row?.courierName}
      </TableCell>
      <TableCell
        id={`ReadyToShipShipedTrackingNumber_${row?.requisitionOrderId}`}
      >
        {row?.trackingNumber}
      </TableCell>
    </TableRow>
  );
}

export default Row;
