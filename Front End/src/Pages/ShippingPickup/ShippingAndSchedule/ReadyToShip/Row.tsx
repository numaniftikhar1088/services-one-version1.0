import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import Status from "Shared/Common/Status";

function Row(props: {
  row: any;
  handleChangeSelectedIds: Function;
  selectedBox: any;
}) {
  const { row, handleChangeSelectedIds, selectedBox } = props;

  return (
    <TableRow className="h-30px">
      <TableCell>
        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
          <input
            id={`ReadyToShipCheckBox_${row?.requisitionOrderId}`}
            className="form-check-input"
            type="checkbox"
            checked={selectedBox?.requisitionOrderId?.includes(
              row?.requisitionOrderId
            )}
            onChange={(e) =>
              handleChangeSelectedIds(
                e.target.checked,
                row.requisitionId,
                row.requisitionOrderId
              )
            }
          />
        </label>
      </TableCell>
      <TableCell
        id={`ReadyToShipLabName_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.labName}
      </TableCell>
      <TableCell
        id={`ReadyToShipFacilityName_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.facilityName}
      </TableCell>
      <TableCell id={`ReadyToShipRequisitionType_${row?.requisitionOrderId}`}>
        {row?.requsitionType}
      </TableCell>
      <TableCell
        id={`ReadyToShipOrderNumber_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.orderNumber}
      </TableCell>
      <TableCell
        id={`ReadyToShipDateOfCollection_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dateofCollection).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ReadyToShipTimeOfCollection_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {row?.timeofCollection}
      </TableCell>
      <TableCell id={`ReadyToShipFirstName_${row?.requisitionOrderId}`}>
        {row?.firstName}
      </TableCell>
      <TableCell id={`ReadyToShipLastName_${row?.requisitionOrderId}`}>
        {row?.lastName}
      </TableCell>
      <TableCell
        id={`ReadyToShipDOB_${row?.requisitionOrderId}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dob).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ReadyToShipStatus_${row?.requisitionOrderId}`}
        sx={{ width: "max-content", textAlign: "center" }}
      >
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === "Specimen Collected"
              ? "badge-status-specimen-collected"
              : "badge-status-default"
          }
        />
      </TableCell>
    </TableRow>
  );
}

export default Row;
