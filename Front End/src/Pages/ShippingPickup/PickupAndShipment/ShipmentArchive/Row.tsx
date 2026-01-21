import {
  TableCell,
  TableRow
} from "@mui/material";
import moment from "moment";
import React from "react";
import { toast } from "react-toastify";
import InsuranceService from "../../../../Services/InsuranceService/InsuranceService";
import { useCourierContext } from "../../../../Shared/CourierContext";
import useLang from "Shared/hooks/useLanguage";

function Row(props: { row: any }) {

  const { t } = useLang()

  const { row } = props;
  const { loadDataShipment } = useCourierContext();
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
          loadDataShipment(false, false);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  const handleCancel = () => {
    InsuranceService.CancelRecordShipment(row.id)
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
          loadDataShipment(false, false);
        }
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };
  return (
    <>
      <TableRow className="h-30px">
        <TableCell sx={{ width: "max-content" }}>
          <span>{row?.senderName}</span>
        </TableCell>

        <TableCell sx={{ width: "max-content" }}>{row?.recipentName}</TableCell>

        <TableCell>{row?.recipentAddress}</TableCell>
        <TableCell sx={{ width: "max-content" }}>{row?.recipentCity}</TableCell>
        <TableCell sx={{ width: "max-content" }}>
          {row?.recipentStateName}
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          {row?.recipentZipCode}
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          {moment(row?.shipmentDate).format("MM-DD-YYYY")}
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          {row?.trackingNumber}
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>{row?.remarks}</TableCell>
      </TableRow>
    </>
  );
}

export default Row;
