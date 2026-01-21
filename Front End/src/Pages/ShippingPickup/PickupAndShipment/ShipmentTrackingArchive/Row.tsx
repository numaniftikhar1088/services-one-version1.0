import {
  TableCell,
  TableRow
} from "@mui/material";
import moment from "moment";
import Status from "Shared/Common/Status";

function Row(props: { row: any }) {
  const { row } = props;
  return (
    <TableRow className="h-30px">
      <TableCell sx={{ width: "max-content" }}>
        <span>{row?.facilityName}</span>
      </TableCell>

      <TableCell sx={{ width: "max-content" }}>
        {row?.trackingNumber}
      </TableCell>

      <TableCell>{moment(row?.dateofScan).format("MM-DD-YYYY")}</TableCell>
      <TableCell sx={{ width: "max-content", textAlign: 'center' }}>
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === "In Transit" ? "badge-status-in-transit" :
              row?.status === "Canceled" ? "badge-status-canceled" :
                "badge-status-default"
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default Row;
