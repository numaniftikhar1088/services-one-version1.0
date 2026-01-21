import { TableCell, TableRow } from "@mui/material";
import { DropdownButton } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import type { CSSProperties } from "react";
import { CrossIcon, DoneIcon, LoaderIcon } from "Shared/Icons";
import { reactSelectSMStyle, styles } from "Utils/Common";
import useLang from "Shared/hooks/useLanguage";

interface CompendiumRowProps {
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
    panelName?: string;
    externalPanelName?: string;
    externalPanelCode?: string;
    testName?: string;
    externalTestName?: string;
    externalTestCode?: string;
  };
  savingRowId: string | number | null;
  disableActions?: boolean;
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

function CompendiumRow({
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
}: CompendiumRowProps) {
  const { t } = useLang();
  const rowKey = row.id ?? row.tempId ?? index;
  const isSaving = savingRowId === rowKey;

  // Panel Name dropdown options (empty for now - no API)
  const panelNameOptions: { value: number; label: string }[] = [];

  // Test Name dropdown options (empty for now - no API)
  const testNameOptions: { value: number; label: string }[] = [];

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
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <Select
                  inputId={`CompendiumPanelName_${rowKey}`}
                  menuPortalTarget={document.body}
                  placeholder={t("Panel Name")}
                  theme={(theme) => styles(theme)}
                  options={panelNameOptions}
                  name="panelName"
                  className="w-100"
                  styles={fullWidthSelectStyles}
                  required
                  onChange={(event: any) =>
                    onChange(rowKey, "panelNameId", event?.value ?? null, event?.label)
                  }
                  value={panelNameOptions.find(
                    (option: any) => option.value === row.panelNameId
                  )}
                />
                {validationErrors?.panelName ? (
                  <div className="form__error">
                    <span>{validationErrors.panelName}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.panelName || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <input
                  id={`CompendiumExternalPanelName_${rowKey}`}
                  type="text"
                  name="externalPanelName"
                  className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
                  placeholder={t("External Panel Name")}
                  value={row.externalPanelName || ""}
                  style={inputStyles}
                  onChange={(event) =>
                    onChange(rowKey, "externalPanelName", event.target.value)
                  }
                />
                {validationErrors?.externalPanelName ? (
                  <div className="form__error">
                    <span>{validationErrors.externalPanelName}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.externalPanelName || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <input
                  id={`CompendiumExternalPanelCode_${rowKey}`}
                  type="text"
                  name="externalPanelCode"
                  className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
                  placeholder={t("External Panel Code")}
                  value={row.externalPanelCode || ""}
                  style={inputStyles}
                  onChange={(event) =>
                    onChange(rowKey, "externalPanelCode", event.target.value)
                  }
                />
                {validationErrors?.externalPanelCode ? (
                  <div className="form__error">
                    <span>{validationErrors.externalPanelCode}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.externalPanelCode || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <Select
                  inputId={`CompendiumTestName_${rowKey}`}
                  menuPortalTarget={document.body}
                  placeholder={t("Test Name")}
                  theme={(theme) => styles(theme)}
                  options={testNameOptions}
                  name="testName"
                  className="w-100"
                  styles={fullWidthSelectStyles}
                  required
                  onChange={(event: any) =>
                    onChange(rowKey, "testNameId", event?.value ?? null, event?.label)
                  }
                  value={testNameOptions.find(
                    (option: any) => option.value === row.testNameId
                  )}
                />
                {validationErrors?.testName ? (
                  <div className="form__error">
                    <span>{validationErrors.testName}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.testName || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <input
                  id={`CompendiumExternalTestName_${rowKey}`}
                  type="text"
                  name="externalTestName"
                  className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
                  placeholder={t("External Test Name")}
                  value={row.externalTestName || ""}
                  style={inputStyles}
                  onChange={(event) =>
                    onChange(rowKey, "externalTestName", event.target.value)
                  }
                />
                {validationErrors?.externalTestName ? (
                  <div className="form__error">
                    <span>{validationErrors.externalTestName}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.externalTestName || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {row.rowStatus ? (
              <div className="w-100">
                <input
                  id={`CompendiumExternalTestCode_${rowKey}`}
                  type="text"
                  name="externalTestCode"
                  className="form-control bg-white mb-1 h-30px rounded-2 fs-8 w-100"
                  placeholder={t("External Test Code")}
                  value={row.externalTestCode || ""}
                  style={inputStyles}
                  onChange={(event) =>
                    onChange(rowKey, "externalTestCode", event.target.value)
                  }
                />
                {validationErrors?.externalTestCode ? (
                  <div className="form__error">
                    <span>{validationErrors.externalTestCode}</span>
                  </div>
                ) : null}
              </div>
            ) : (
              row.externalTestCode || "-"
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="w-100">
            {/* Requisition Type is always read-only, auto-populated from Panel Name */}
            <div className="text-muted" style={{ padding: "8px 0" }}>
              {row.requisitionType || "-"}
            </div>
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

export default CompendiumRow;

