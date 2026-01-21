import React, { useState, useEffect } from "react";
import { Modal, Box } from "@mui/material";
import useLang from "Shared/hooks/useLanguage";

interface JsonEditorModalProps {
  open: boolean;
  onClose: () => void;
  jsonString: string;
  onSave: (updatedJsonString: string) => void;
}

const JsonEditorModal: React.FC<JsonEditorModalProps> = ({
  open,
  onClose,
  jsonString,
  onSave,
}) => {
  const { t } = useLang();
  const [jsonData, setJsonData] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (open && jsonString) {
      try {
        const parsed = JSON.parse(jsonString);
        setJsonData(parsed);
        setError("");
      } catch (e) {
        setError("Invalid JSON format");
        setJsonData(null);
      }
    }
  }, [open, jsonString]);

  const updateValue = (path: string[], value: any) => {
    if (!jsonData) return;
    
    const newData = JSON.parse(JSON.stringify(jsonData));
    
    // Handle root level updates
    if (path.length === 1) {
      const key = path[0];
      if (Array.isArray(newData)) {
        newData[parseInt(key)] = value;
      } else {
        newData[key] = value;
      }
      setJsonData(newData);
      return;
    }

    let current: any = newData;

    // Navigate to the parent of the target
    for (let i = 0; i < path.length - 1; i++) {
      const key = path[i];
      if (Array.isArray(current)) {
        const index = parseInt(key);
        if (isNaN(index) || index < 0 || index >= current.length) {
          console.error("Invalid array index:", key);
          return;
        }
        current = current[index];
      } else if (current && typeof current === 'object' && current !== null) {
        if (!(key in current)) {
          console.error("Invalid object key:", key);
          return;
        }
        current = current[key];
      } else {
        console.error("Invalid path, cannot navigate:", path, "at index", i);
        return; // Invalid path
      }
    }

    // Update the value
    const lastKey = path[path.length - 1];
    if (Array.isArray(current)) {
      const index = parseInt(lastKey);
      if (!isNaN(index) && index >= 0 && index < current.length) {
        current[index] = value;
        setJsonData(newData);
      }
    } else if (current && typeof current === 'object' && current !== null) {
      current[lastKey] = value;
      setJsonData(newData);
    } else {
      console.error("Cannot update value at path:", path);
    }
  };

  // Helper function to get value from current state by path
  const getValueByPath = (data: any, path: string[]): any => {
    let current = data;
    for (const key of path) {
      if (Array.isArray(current)) {
        current = current[parseInt(key)];
      } else if (current && typeof current === 'object' && current !== null) {
        current = current[key];
      } else {
        return undefined;
      }
    }
    return current;
  };

  const renderValueEditor = (
    key: string | number,
    path: string[],
    parentIsArray: boolean = false
  ): React.ReactNode => {
    if (!jsonData) return null;
    
    const fullPath = [...path, String(key)];
    const value = getValueByPath(jsonData, fullPath);
    const uniqueKey = `${path.join('.')}_${key}`;
    
    if (value === null || value === undefined) {
      return (
        <div key={uniqueKey} className="mb-3 p-2 border rounded">
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="fw-bold text-muted" style={{ minWidth: "150px" }}>
              {parentIsArray ? `[${key}]` : key}:
            </span>
            <input
              type="text"
              className="form-control"
              value={value === null ? "null" : value === undefined ? "" : String(value)}
              onChange={(e) => {
                const newValue = e.target.value === "null" ? null : e.target.value;
                const fullPath = [...path, String(key)];
                updateValue(fullPath, newValue);
              }}
            />
          </div>
        </div>
      );
    }

    if (typeof value === "object" && !Array.isArray(value) && value !== null) {
      const currentPath = parentIsArray 
        ? [...path, String(key)]
        : [...path, String(key)];
      
      return (
        <div key={uniqueKey} className="mb-3 p-3 border rounded bg-light">
          <div className="fw-bold text-primary mb-2">
            {parentIsArray ? `[${key}]` : key}:
          </div>
          <div className="ms-3">
            {Object.keys(value).map((k) =>
              renderValueEditor(k, [...currentPath], false)
            )}
          </div>
        </div>
      );
    }

    if (Array.isArray(value)) {
      const currentPath = parentIsArray 
        ? [...path, String(key)]
        : [...path, String(key)];
      
      return (
        <div key={uniqueKey} className="mb-3 p-3 border rounded bg-light">
          <div className="fw-bold text-primary mb-2">
            {parentIsArray ? `[${key}]` : key}:
          </div>
          <div className="ms-3">
            {value.map((item: any, index: number) =>
              renderValueEditor(index, [...currentPath], true)
            )}
          </div>
        </div>
      );
    }

    // Primitive value (string, number, boolean)
    return (
      <div key={uniqueKey} className="mb-2 p-2 border rounded">
        <div className="d-flex align-items-center gap-2">
          <span className="fw-bold text-muted" style={{ minWidth: "150px" }}>
            {parentIsArray ? `[${key}]` : key}:
          </span>
          {typeof value === "boolean" ? (
            <div className="form-check form-switch">
              <input
                className="form-check-input"
                type="checkbox"
                checked={value === true}
                onChange={(e) => {
                  const fullPath = [...path, String(key)];
                  updateValue(fullPath, e.target.checked);
                }}
              />
            </div>
          ) : (
            <input
              type={typeof value === "number" ? "number" : "text"}
              className="form-control"
              value={value === null || value === undefined ? "" : value}
              onChange={(e) => {
                let newValue: any = e.target.value;
                if (typeof value === "number") {
                  newValue = e.target.value === "" ? 0 : parseFloat(e.target.value);
                  if (isNaN(newValue)) newValue = 0;
                }
                const fullPath = [...path, String(key)];
                updateValue(fullPath, newValue);
              }}
            />
          )}
        </div>
      </div>
    );
  };

  const handleSave = () => {
    try {
      const jsonString = JSON.stringify(jsonData, null, 2);
      onSave(jsonString);
      onClose();
    } catch (e) {
      setError("Error serializing JSON");
    }
  };

  const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "800px",
    maxHeight: "90vh",
    overflow: "auto",
    bgcolor: "background.paper",
    boxShadow: 24,
    borderRadius: 2,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <div className="card shadow-none rounded-0">
          <div className="card-header">
            <h3 className="card-title fw-bold text-gray-700">
              {t("Edit Configuration Value")}
            </h3>
            <div className="card-toolbar">
              <button
                type="button"
                onClick={onClose}
                className="btn btn-sm btn-icon btn-active-color-primary"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          </div>
          <div className="card-body">
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            {jsonData && (
              <div className="p-3" style={{ maxHeight: "60vh", overflow: "auto" }}>
                {Array.isArray(jsonData) ? (
                  jsonData.map((item, index) =>
                    renderValueEditor(index, [], true)
                  )
                ) : (
                  Object.keys(jsonData).map((key) =>
                    renderValueEditor(key, [], false)
                  )
                )}
              </div>
            )}
          </div>
          <div className="card-footer">
            <button
              type="button"
              className="btn btn-secondary me-2"
              onClick={onClose}
            >
              {t("Cancel")}
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={!!error || !jsonData}
            >
              {t("Save")}
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default JsonEditorModal;

