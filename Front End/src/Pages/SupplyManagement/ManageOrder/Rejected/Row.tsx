import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";

function Row(props: {
  row: any;
  handleChangeSelectedIds: Function;
  selectedBox: any;
}) {
  const { row, handleChangeSelectedIds, selectedBox } = props;
  const { t } = useLang();
  return (
    <TableRow className="h-30px">
      <TableCell>
        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
          <input
            id={`ManageOrderRejectedCheckBox_${row.id}`}
            className="form-check-input"
            type="checkbox"
            checked={selectedBox?.ids?.includes(row?.id)}
            onChange={(e) => handleChangeSelectedIds(e.target.checked, row.id)}
          />
        </label>
      </TableCell>
      <TableCell
        id={`ManageOrderRejectedStatus_${row.id}`}
        sx={{ width: "max-content", textAlign: "center" }}
      >
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === t("Rejected")
              ? "badge-status-rejected"
              : "badge-status-default"
          }
        />
      </TableCell>

      <TableCell
        id={`ManageOrderRejectedFacilityName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.facilityName}
      </TableCell>

      <TableCell id={`ManageOrderRejectedCreatedBy_${row.id}`}>
        {row?.createdBy}
      </TableCell>
      <TableCell
        id={`ManageOrderRejectedRepersentativeName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.representativeName}
      </TableCell>
      <TableCell
        id={`ManageOrderRejectedRejectedReason_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.rejectedReason}
      </TableCell>
      <TableCell
        id={`ManageOrderRejectedDateOfRequest_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dateofRequest).format("MM-DD-YYYY")}
      </TableCell>
    </TableRow>
  );
}

export default Row;
