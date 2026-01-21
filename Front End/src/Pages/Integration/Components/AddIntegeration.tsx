import React, { useState } from "react";
import Select, { SingleValue } from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import { reactSelectSMStyle, styles } from "Utils/Common";

type Props = {
  integrationHeaders?: any[]; // Array of header objects from API
  isLoading?: boolean;
  onAddItem: (messageHeadersInfoId: number, selectedItemName: string, length: number) => boolean;
  onCancel: () => void;
};

const customComponents = {
  IndicatorSeparator: () => null, // This hides the separator
};

export const AddIntegeration = ({
  integrationHeaders = [],
  isLoading = false,
  onAddItem,
  onCancel,
}: Props) => {
  const { t } = useLang();
  const [selectedHeaderId, setSelectedHeaderId] = useState<number | null>(null);
  const [length, setLength] = useState<string>("1");

  // Create dropdown options from integration headers (from API)
  const getAvailableOptions = () => {
    if (integrationHeaders && integrationHeaders.length > 0) {
      // API response structure: { messageHeadersInfoId: number, headerDisplayName: string }
      return integrationHeaders
        .filter((header: any) => header.headerDisplayName) // Remove any null/undefined values
        .map((header: any) => ({
          value: header.messageHeadersInfoId,
          label: header.headerDisplayName,
        }));
    }

    // Return empty array if no headers from API
    return [];
  };
  
  const availableOptions = getAvailableOptions();

  const handleSave = () => {
    if (!selectedHeaderId) {
      toast.error(t("Please select an integration name"));
      return;
    }

    const lengthNum = parseInt(length);

    // Validate length: must be between 1 and 40
    if (isNaN(lengthNum) || lengthNum < 1 || lengthNum > 40) {
      toast.error(t("Length must be a number between 1 and 40"));
      return;
    }

    // Find the selected header to get its name
    const selectedHeader = integrationHeaders.find(
      (header: any) => header.messageHeadersInfoId === selectedHeaderId
    );
    const selectedItemName = selectedHeader?.headerDisplayName || "";

    const success = onAddItem(selectedHeaderId, selectedItemName, lengthNum);

    if (success) {
      // Reset form
      setSelectedHeaderId(null);
      setLength("1");
      onCancel();
    }
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: number; label: string }>
  ) => {
    setSelectedHeaderId(selectedOption?.value || null);
  };

  return (
    <div>
      {/* Form Fields Row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          gap: "16px",
          flexWrap: "wrap",
        }}
      >
        {/* Integration Name Field */}
        <div style={{ flex: "1", minWidth: "300px" }}>
          <label
            style={{
              display: "block",
              color: "#1a1a1a",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {t("Integration Name")} <span style={{ color: "#dc3545" }}>*</span>
          </label>
          <Select
            inputId="integrationName"
            theme={(theme) => styles(theme)}
            options={availableOptions}
            name="integrationName"
            components={customComponents}
            styles={{
              ...reactSelectSMStyle,
              control: (provided) => ({
                ...provided,
                minHeight: "40px",
                border: "1px solid #e5e5e5",
                borderRadius: "6px",
                "&:hover": {
                  border: "1px solid #e5e5e5",
                },
              }),
            }}
            menuPortalTarget={document.body}
            placeholder={isLoading ? t("Loading...") : "--- Select ---"}
            onChange={handleSelectChange}
            value={
              availableOptions.find(
                (option) => option.value === selectedHeaderId
              ) || null
            }
            isSearchable={true}
            isLoading={isLoading}
            className="z-index-3 w-100"
          />
        </div>

        {/* Length Field */}
        <div style={{ width: "120px" }}>
          <label
            style={{
              display: "block",
              color: "#1a1a1a",
              marginBottom: "8px",
              fontSize: "14px",
              fontWeight: "500",
            }}
          >
            {t("Length")}
          </label>
          <input
            type="number"
            name="length"
            placeholder="1-40"
            value={length}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty string for typing, or numbers in valid range
              if (
                value === "" ||
                (!isNaN(Number(value)) &&
                  Number(value) >= 1 &&
                  Number(value) <= 40)
              ) {
                setLength(value);
              }
            }}
            style={{
              width: "100%",
              height: "40px",
              padding: "8px 12px",
              border: "1px solid #e5e5e5",
              borderRadius: "6px",
              fontSize: "14px",
              outline: "none",
              backgroundColor: "white",
            }}
            min="1"
            max="40"
          />
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            aria-controls="SearchCollapse"
          >
            <span>
              <span>{t("Cancel")}</span>
            </span>
          </button>
          <button
            className="btn btn-primary btn-primary--icon px-7"
            onClick={handleSave}
          >
            <span>{t("Save")}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
