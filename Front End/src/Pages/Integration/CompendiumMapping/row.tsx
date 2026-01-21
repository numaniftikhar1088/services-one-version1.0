import { TableCell, TableRow } from "@mui/material";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import type { CSSProperties } from "react";
import { CrossIcon, DoneIcon, LoaderIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import useLang from "Shared/hooks/useLanguage";
interface CompendiumMappingRowProps {
  row: any;
  index: number;
  onSave: (row: any) => Promise<void>;
  onChange: (
    rowKey: string | number,
    name: string,
    value: string | number,
    label?: string
  ) => void;
  onCancel: (row: any) => void;
  onEdit: (row: any) => void;
  onDelete: (row: any) => void;
  validationErrors?: {
    facilityName?: string;
    emrId?: string;
  };
  savingRowId: string | number | null;
  disableActions?: boolean;
  facilityOptions: { value: number; label: string }[];
}

const inputStyles: CSSProperties = {
  border: "1px solid #D3D3D3",
  borderRadius: "16px",
  padding: "14px 16px",
  height: "38px",
  fontSize: "14px",
  color: "#3F4254",
  boxShadow: "none",
  width: "100%",
};

const fullWidthSelectStyles = {
  ...reactSelectSMStyle,
  control: (base: any) => ({
    ...(reactSelectSMStyle.control
      ? (reactSelectSMStyle.control as (base: any) => any)(base)
      : base),
    width: "100%",
    minWidth: "100%",
  }),
};

function CompendiumMappingRow({
  row,
  index,
  onSave,
  onChange,
  onCancel,
  onEdit,
  onDelete,
  validationErrors,
  savingRowId,
  disableActions = false,
  facilityOptions,
}: CompendiumMappingRowProps) {
  const { t } = useLang();
  const rowKey = row.id ?? row.tempId ?? index;
  const isSaving = savingRowId === rowKey;

  return (
    <>
      <TableRow className="h-30px" key={rowKey}>
        <TableCell>
          <div className="d-flex justify-content-center rotatebtnn">
            {row.rowStatus ? (
              <div className="d-flex gap-2">
                <button
                  id={`CompendiumSave_${rowKey}`}
                  onClick={() => onSave(row)}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  disabled={isSaving}
                >
                  {isSaving ? <LoaderIcon /> : <DoneIcon />}
                </button>
                {!isSaving && (
                  <button
                    id={`CompendiumCancel_${rowKey}`}
                    onClick={() => onCancel(row)}
                    className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <CrossIcon />
                  </button>
                )}
              </div>
            ) : (
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id={`CompendiumActions_${rowKey}`}
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
                disabled={disableActions}
              >
                <Dropdown.Item
                  id={`CompendiumEdit_${rowKey}`}
                  eventKey="edit"
                  className="menu-item p-0"
                  onClick={() => onEdit(row)}
                >
                  <span className="menu-link text-dark">
                    <i className="fa fa-edit text-warning mr-2  w-20px"></i>
                    {t("Edit")}
                  </span>
                </Dropdown.Item>
                <Dropdown.Item
                  id={`CompendiumDelete_${rowKey}`}
                  eventKey="delete"
                  className="menu-item p-0"
                  onClick={() => onDelete(row)}
                >
                  <span className="menu-link text-dark">
                    <i className="fa fa-trash text-danger mr-2  w-20px"></i>
                    {t("Delete")}
                  </span>
                </Dropdown.Item>
              </DropdownButton>
            )}
          </div>
        </TableCell>
        <TableCell sx={{ width: "50%" }}>
          <div className="d-flex justify-content-between w-100">
            <div className="w-100">
              {row.rowStatus ? (
                <div className="w-100">
                  <Select
                    inputId={`CompendiumFacilityName_${rowKey}`}
                    menuPortalTarget={document.body}
                    placeholder={t("Facility Name")}
                    theme={(theme) => styles(theme)}
                    options={facilityOptions}
                    name="facilityName"
                    className="w-100"
                    styles={fullWidthSelectStyles}
                    required
                    onChange={(event: any) =>
                      onChange(rowKey, "facilityId", event.value, event.label)
                    }
                    value={facilityOptions.find(
                      (option: any) => option.value === row.facilityId
                    )}
                  />
                  {validationErrors?.facilityName ? (
                    <div className="form__error">
                      <span>{validationErrors.facilityName}</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                row.facilityName || "-"
              )}
            </div>
          </div>
        </TableCell>
        <TableCell sx={{ width: "50%" }}>
          <div className="d-flex justify-content-between w-100">
            <div className="w-100">
              {row.rowStatus ? (
                <div className="w-100">
                  <input
                    id={`CompendiumEmrId_${rowKey}`}
                    type="text"
                    name="emrId"
                    className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
                    placeholder={t("EMR Id")}
                    value={row.emrId}
                    style={inputStyles}
                    onChange={(event) =>
                      onChange(rowKey, "emrId", event.target.value)
                    }
                  />
                  {validationErrors?.emrId ? (
                    <div className="form__error">
                      <span>{validationErrors.emrId}</span>
                    </div>
                  ) : null}
                </div>
              ) : (
                row.emrId || "-"
              )}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

export default CompendiumMappingRow;
