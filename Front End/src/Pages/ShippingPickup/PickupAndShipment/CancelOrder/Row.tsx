import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import { useCourierContext } from "Shared/CourierContext";

function Row(props: { row: any }) {
  const { row } = props;

  const { courierName } = useCourierContext();

  return (
    <TableRow className="h-30px">
      <TableCell
        id={`ShipingAndPickupPickupArchiveContectName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        <span>{row?.contactName}</span>
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveCompanyName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.companyName}
      </TableCell>
      <TableCell id={`ShipingAndPickupPickupArchiveAddress_${row.id}`}>
        {row?.address}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveCity_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.city}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveState_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.stateName}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveZipCode_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.zipCode}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchivePickupDate_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.pickupDate).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchivePickupTime_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.startPickupTime).format("HH:MM:SS")}-
        {moment(row?.endPickupTime).format("HH:MM:SS")}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveTrackingNumber_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.trackingNumber}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveDispatchConfirmation_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.dispatchConfirmationNo}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchiveLocation_${row.id}`}
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
        id={`ShipingAndPickupPickupArchiveRemarks_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.remarks}
      </TableCell>
      <TableCell
        id={`ShipingAndPickupPickupArchivelogIdentifier_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.logIdentifier}
      </TableCell>

      <TableCell
        id={`ShipingAndPickupPickupArchivelogIdentifier_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.cancelReason}
      </TableCell>
    </TableRow>
  );
}

export default Row;
