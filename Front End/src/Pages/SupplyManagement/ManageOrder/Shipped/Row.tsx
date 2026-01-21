import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";

function Row(props: {
  row: any;
  handleChangeSelectedIds: Function;
  selectedBox: any;
}) {
  const { row, handleChangeSelectedIds, selectedBox } = props;

  const navigate = useNavigate();

  const { t } = useLang();

  return (
    <TableRow className="h-30px">
      <TableCell>
        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
          <input
            id={`ManageOrderShipedCheckBox_${row.id}`}
            className="form-check-input"
            type="checkbox"
            checked={selectedBox?.ids?.includes(row?.id)}
            onChange={(e) => handleChangeSelectedIds(e.target.checked, row.id)}
          />
        </label>
      </TableCell>
      <TableCell
        id={`ManageOrderShipedStatus_${row.id}`}
        sx={{ width: "max-content", textAlign: "center" }}
      >
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === t("Shipped")
              ? "badge-status-shipped"
              : "badge-status-default"
          }
        />
      </TableCell>
      <TableCell
        id={`ManageOrderShipedFacilityName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.facilityName}
      </TableCell>
      <TableCell id={`ManageOrderShipedCreatedBy_${row.id}`}>
        {row?.createdBy}
      </TableCell>
      <TableCell
        id={`ManageOrderShipedRepersentativeName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.representativeName}
      </TableCell>
      <TableCell
        id={`ManageOrderShipedDateOfRequest_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dateofRequest).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ManageOrderShipedTrackingNumber_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.trackingNumber}
      </TableCell>
      <TableCell
        id={`ManageOrderShipedTrackingNumber_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.synergyOrderId}

      </TableCell>
      <TableCell
        id={`ManageOrderShipedTrackingNumber_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.synergyOrderSeqId}
      </TableCell>
      <TableCell
        id={`ManageOrderShipedViewOrder_${row.id}`}
        align="center"
        sx={{ width: "max-content" }}
      >
        <button
          id={`ManageOrderShipedViewOrder_${row.id}`}
          className="badge badge-pill badge-warning py-3 px-4 border-0 fw-400 fa-1x text-light"
          onClick={() =>
            navigate("/supply-order-view", { state: { id: row.id } })
          }
        >
          <span>
            <span>{t("View Order")}</span>
          </span>
        </button>
      </TableCell>
    </TableRow>
  );
}

export default Row;
