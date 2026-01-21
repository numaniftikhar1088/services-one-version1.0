import { TableCell, TableRow, Select, MenuItem, FormControl } from "@mui/material";
import React, { useMemo, useState } from "react";
import { toast } from "react-toastify";
import JsonEditorModal from "./JsonEditorModal";
import type { Credential } from "./types";
import useLang from "Shared/hooks/useLanguage";

interface CredentialRowProps {
  row: Credential;
  setApiGetData: (
    data: Credential[] | ((prev: Credential[]) => Credential[])
  ) => void;
  onSave: (row: Credential) => Promise<void>;
}

function CredentialRow({ row, setApiGetData, onSave }: CredentialRowProps) {
  const { t } = useLang();
  const [jsonEditorOpen, setJsonEditorOpen] = useState(false);
  const [saving, setSaving] = useState<boolean>(false);

  // Track the last saved state
  const [lastSavedState, setLastSavedState] = useState({
    configValue: row.configValue ?? "",
    defaultValue: row.defaultValue ?? "",
    direction: row.direction ?? "InBound",
  });

  const inputStyles: React.CSSProperties = {
    border: "1px solid #D3D3D3",
    borderRadius: "16px",
    padding: "14px 16px",
    height: "38px",
    fontSize: "14px",
    color: "#3F4254",
    boxShadow: "none",
  };

  const handleChange = (name: string, value: string, id: number) => {
    setApiGetData((curr: Credential[]) =>
      curr.map((x: Credential) =>
        x.integrationConfigurationAssignmentID === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  // Check if configValue is valid (not empty or whitespace-only)
  const isValidConfigValue = useMemo(() => {
    return (row.configValue?.trim() || "").length > 0;
  }, [row.configValue]);

  // Calculate if there are unsaved changes (comparing trimmed values)
  const hasChanges = useMemo(() => {
    const currentConfigValue = (row.configValue ?? "").trim();
    const currentDefaultValue = (row.defaultValue ?? "").trim();
    const currentDirection = row.direction ?? "InBound";
    const savedConfigValue = (lastSavedState.configValue ?? "").trim();
    const savedDefaultValue = (lastSavedState.defaultValue ?? "").trim();
    const savedDirection = lastSavedState.direction ?? "InBound";

    return (
      currentConfigValue !== savedConfigValue ||
      currentDefaultValue !== savedDefaultValue ||
      currentDirection !== savedDirection
    );
  }, [row.configValue, row.defaultValue, row.direction, lastSavedState]);

  const handleSave = async () => {
    const trimmedValue = row.configValue?.trim() || "";

    setSaving(true);
    try {
      await onSave({ ...row, configValue: trimmedValue });

      // Update state with trimmed value
      setApiGetData((curr: Credential[]) =>
        curr.map((x: Credential) =>
          x.integrationConfigurationAssignmentID ===
          row.integrationConfigurationAssignmentID
            ? { ...x, configValue: trimmedValue }
            : x
        )
      );

      setLastSavedState({
        configValue: trimmedValue,
        defaultValue: row.defaultValue ?? "",
        direction: row.direction ?? "InBound",
      });

      toast.success(t("Saved successfully"));
    } catch (error: any) {
      toast.error(error?.message || t("Error saving data"));
    } finally {
      setSaving(false);
    }
  };

  const handleJsonSave = (updatedJsonString: string) => {
    const trimmedJson = updatedJsonString?.trim() || "";
    if (!trimmedJson) {
      toast.error(t("Configuration Value cannot be empty"));
      return;
    }

    handleChange(
      "configValue",
      trimmedJson,
      row.integrationConfigurationAssignmentID
    );
    setJsonEditorOpen(false);
  };

  const isSFTP = row.configTemplateName === "SFTP";

  return (
    <>
      <TableRow
        className="h-30px"
        key={row.integrationConfigurationAssignmentID}
      >
        <TableCell>
          <button
            disabled={saving || !hasChanges || !isValidConfigValue}
            id={`CredentialSave_${row.integrationConfigurationAssignmentID}`}
            className={`btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px ${
              saving || !hasChanges || !isValidConfigValue ? "disabled" : ""
            }`}
            onClick={handleSave}
            title={t("Save")}
          >
            <i className="bi bi-check2" />
          </button>
        </TableCell>
        <TableCell sx={{ width: "max-content" }}>
          <div className="d-flex justify-content-between">
            <div style={{ width: "max-content" }}>{row.configKey || "-"}</div>
          </div>
        </TableCell>
        <TableCell
          sx={{
            width: "max-content",
            "& .form-control": {
              height: "38px",
              padding: "12px 16px",
              borderRadius: "16px",
              border: "1px solid #DDE1ED",
            },
          }}
        >
          {isSFTP ? (
            <div
              className="d-flex align-items-center gap-2 cursor-pointer text-primary"
              onClick={() => setJsonEditorOpen(true)}
              style={{ minWidth: "200px" }}
            >
              <i className="bi bi-pencil-square"></i>
              <span className="text-truncate" style={{ maxWidth: "150px" }}>
                {t("Click to edit JSON")}
              </span>
            </div>
          ) : (
            <>
              <input
                id={`configValue_${row.integrationConfigurationAssignmentID}`}
                type="text"
                placeholder={t("Configuration Value")}
                name="configValue"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                style={{
                  ...inputStyles,
                  border:
                    !isValidConfigValue && hasChanges
                      ? "1px solid #dc3545"
                      : inputStyles.border,
                }}
                value={row.configValue || ""}
                onBlur={(e) => {
                  const trimmed = e.target.value.trim();
                  if (trimmed !== e.target.value) {
                    handleChange(
                      "configValue",
                      trimmed,
                      row.integrationConfigurationAssignmentID
                    );
                  }
                }}
                onChange={(e) =>
                  handleChange(
                    e.target.name,
                    e.target.value,
                    row.integrationConfigurationAssignmentID
                  )
                }
                required
              />
              {!isValidConfigValue && hasChanges && (
                <div
                  className="form__error"
                  style={{
                    fontSize: "12px",
                    color: "#dc3545",
                    marginTop: "4px",
                  }}
                >
                  {t("Configuration Value cannot be empty")}
                </div>
              )}
            </>
          )}
        </TableCell>
        <TableCell
          sx={{
            width: "max-content",
            "& .form-control": {
              height: "38px",
              padding: "10px 16px",
              borderRadius: "16px",
              border: "1px solid #DDE1ED",
            },
          }}
        >
          <input
            id={`defaultValue_${row.integrationConfigurationAssignmentID}`}
            type="text"
            placeholder={t("Default Value")}
            name="defaultValue"
            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
            style={inputStyles}
            value={row.defaultValue || ""}
            onChange={(e) =>
              handleChange(
                e.target.name,
                e.target.value,
                row.integrationConfigurationAssignmentID
              )
            }
          />
        </TableCell>
        <TableCell
          sx={{
            width: "max-content",
            "& .MuiSelect-root": {
              height: "38px",
              padding: "10px 16px",
              borderRadius: "16px",
              border: "1px solid #DDE1ED",
              fontSize: "14px",
              color: "#3F4254",
            },
          }}
        >
          <FormControl fullWidth size="small">
            <Select
              id={`direction_${row.integrationConfigurationAssignmentID}`}
              value={row.direction || "InBound"}
              onChange={(e) =>
                handleChange(
                  "direction",
                  e.target.value,
                  row.integrationConfigurationAssignmentID
                )
              }
              sx={{
                height: "38px",
                borderRadius: "16px",
                border: "1px solid #DDE1ED",
                backgroundColor: "#fff",
                "& .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "1px solid #DDE1ED",
                },
              }}
            >
              <MenuItem value="InBound">{t("InBound")}</MenuItem>
              <MenuItem value="OutBound">{t("OutBound")}</MenuItem>
            </Select>
          </FormControl>
        </TableCell>
      </TableRow>

      {isSFTP && (
        <JsonEditorModal
          open={jsonEditorOpen}
          onClose={() => setJsonEditorOpen(false)}
          jsonString={row.configValue || "[]"}
          onSave={handleJsonSave}
        />
      )}
    </>
  );
}

export default CredentialRow;
