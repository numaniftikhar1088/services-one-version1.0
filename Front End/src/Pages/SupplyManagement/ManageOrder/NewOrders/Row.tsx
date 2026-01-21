import { TableCell, TableRow } from "@mui/material";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import Status from "Shared/Common/Status";

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
            id={`ManageOrderNewOrderCheckBox_${row.id}`}
            className="form-check-input"
            type="checkbox"
            checked={selectedBox?.ids?.includes(row?.id)}
            onChange={(e) => handleChangeSelectedIds(e.target.checked, row.id)}
          />
        </label>
      </TableCell>
      <TableCell
        id={`ManageOrderNewOrderStatus_${row.id}`}
        sx={{ width: "max-content", textAlign: "center" }}
      >
        <Status
          cusText={row?.status}
          cusClassName={
            row?.status === t("Viewed")
              ? "badge-status-viewed"
              : row?.status === t("New Order")
              ? "badge-status-new-order"
              : row?.status === t("Needs Approval")
              ? "badge-status-needs-approval"
              : "badge-status-default"
          }
        />
      </TableCell>

      <TableCell
        id={`ManageOrderNewOrderFacilityName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.facilityName}
      </TableCell>

      <TableCell id={`ManageOrderNewOrderCreatedBy_${row.id}`}>
        {row?.createdBy}
      </TableCell>
      <TableCell
        id={`ManageOrderNewOrderRepresentativeName_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {row?.representativeName}
      </TableCell>
      <TableCell
        id={`ManageOrderNewOrderDateOfRequest_${row.id}`}
        sx={{ width: "max-content" }}
      >
        {moment(row?.dateofRequest).format("MM-DD-YYYY")}
      </TableCell>
      <TableCell
        id={`ManageOrderNewOrderViewOrder_${row.id}`}
        align="center"
        sx={{ width: "max-content" }}
      >
        <PermissionComponent
          moduleName="Supply Management"
          pageName="Manage Order"
          permissionIdentifier="ViewOrder"
        >
          <button
            id={`ManageOrderNewOrderVireOrder_${row.id}`}
            className="badge badge-pill badge-warning py-3 px-4 border-0 fw-400 fa-1x text-light"
            onClick={() =>
              navigate("/supply-order-view", { state: { id: row.id } })
            }
          >
            <span>
              <span>{t("View Order")}</span>
            </span>
          </button>
        </PermissionComponent>
      </TableCell>
    </TableRow>
  );
}

export default Row;
