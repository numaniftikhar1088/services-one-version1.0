import { TableCell, TableRow } from "@mui/material";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import type { CSSProperties } from "react";
import useLang from "Shared/hooks/useLanguage";
import { CrossIcon, DoneIcon, LoaderIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";

interface InsuranceRowProps {
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
    insuranceType?: string;
    insuranceName?: string;
    mappedInsurance?: string;
  };
  savingRowId: string | number | null;
  disableActions?: boolean;
  insuranceTypeOptions: { value: number; label: string }[];
  insuranceNameOptions: { value: number; label: string }[];
  isLoadingInsuranceNames?: boolean;
}

const textInputStyles: CSSProperties = {
  border: "1px solid #D3D3D3",
  borderRadius: "16px",
  padding: "14px 16px",
  height: "38px",
  fontSize: "14px",
  color: "#3F4254",
  boxShadow: "none",
  width: "100%",
};

const selectStyles = {
  ...reactSelectSMStyle,
  control: (base: any) => ({
    ...(reactSelectSMStyle.control
      ? (reactSelectSMStyle.control as (base: any) => any)(base)
      : base),
    width: "100%",
    minWidth: "100%",
  }),
};

const InsuranceRow = ({
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
  insuranceTypeOptions,
  insuranceNameOptions,
  isLoadingInsuranceNames = false,
}: InsuranceRowProps) => {
  const { t } = useLang();
  const rowKey = row.id ?? row.tempId ?? index;
  const isSaving = savingRowId === rowKey;
  return (
    <TableRow className="h-30px" key={rowKey}>
      <TableCell>
        <div className="d-flex justify-content-center rotatebtnn">
          {row.rowStatus ? (
            <div className="d-flex gap-2">
              <button
                id={`InsuranceSave_${rowKey}`}
                onClick={() => onSave(row)}
                className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                disabled={isSaving}
              >
                {isSaving ? <LoaderIcon /> : <DoneIcon />}
              </button>
              {!isSaving && (
                <button
                  id={`InsuranceCancel_${rowKey}`}
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
              id={`InsuranceActions_${rowKey}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
              disabled={disableActions}
            >
              <Dropdown.Item
                id={`InsuranceEdit_${rowKey}`}
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
                id={`InsuranceDelete_${rowKey}`}
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
      <TableCell sx={{ width: "33%" }}>
        {row.rowStatus ? (
          <div className="w-100">
            <Select
              inputId={`InsuranceType_${rowKey}`}
              menuPortalTarget={document.body}
              placeholder={t("Insurance Type")}
              theme={(theme) => styles(theme)}
              options={insuranceTypeOptions}
              name="insuranceType"
              className="w-100"
              styles={selectStyles}
              required
              onChange={(option: any) =>
                onChange(
                  rowKey,
                  "insuranceTypeId",
                  option?.value,
                  option?.label
                )
              }
              value={insuranceTypeOptions.find(
                (option) => option.label === row.insuranceType
              )}
            />
            {validationErrors?.insuranceType ? (
              <div className="form__error">
                <span>{validationErrors.insuranceType}</span>
              </div>
            ) : null}
          </div>
        ) : (
          row.insuranceType || "-"
        )}
      </TableCell>
      <TableCell sx={{ width: "33%" }}>
        {row.rowStatus ? (
          <div className="w-100">
            <Select
              inputId={`InsuranceName_${rowKey}`}
              menuPortalTarget={document.body}
              placeholder={t("Insurance Name")}
              theme={(theme) => styles(theme)}
              options={insuranceNameOptions}
              name="insuranceName"
              className="w-100"
              styles={selectStyles}
              required
              isLoading={isLoadingInsuranceNames}
              onChange={(option: any) =>
                onChange(rowKey, "insuranceId", option?.value, option?.label)
              }
              value={insuranceNameOptions.find(
                (option) => option.value === row.insuranceId
              )}
            />
            {validationErrors?.insuranceName ? (
              <div className="form__error">
                <span>{validationErrors.insuranceName}</span>
              </div>
            ) : null}
          </div>
        ) : (
          row.name || "-"
        )}
      </TableCell>
      <TableCell sx={{ width: "34%" }}>
        {row.rowStatus ? (
          <div className="w-100">
            <input
              id={`InsuranceMapped_${rowKey}`}
              type="text"
              name="mappedInsurance"
              className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
              placeholder={t("Mapped Insurance")}
              value={row.mappedInsurance}
              style={textInputStyles}
              onChange={(event) =>
                onChange(rowKey, "mappedInsurance", event.target.value)
              }
            />
            {validationErrors?.mappedInsurance ? (
              <div className="form__error">
                <span>{validationErrors.mappedInsurance}</span>
              </div>
            ) : null}
          </div>
        ) : (
          row.mappedInsurance || "-"
        )}
      </TableCell>
    </TableRow>
  );
};

export default InsuranceRow;
