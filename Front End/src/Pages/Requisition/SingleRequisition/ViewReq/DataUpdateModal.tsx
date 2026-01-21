import { Box, Button, Modal, Stack } from "@mui/material";
import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useReqDataContext } from "./RequisitionContext/useReqContext";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import useLang from "Shared/hooks/useLanguage";

interface DataUpdateModalProps {
  open: boolean;
  onClose: () => void;
  modalData?: any;
  LoadDigitalCheckIn?: (index: number) => void;
  missingDateIndex?: number;
  callFrom?: string;
}

const modalStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const DataUpdateModal: React.FC<DataUpdateModalProps> = ({
  open,
  onClose,
  modalData,
  LoadDigitalCheckIn,
  missingDateIndex,
  callFrom,
}) => {
  const { t } = useLang();
  const { nextStep } = useReqDataContext();
  const [saving, setSaving] = useState(false);
  const [dateOfCollection, setDateOfCollection] = useState("");
  const [timeOfCollection, setTimeOfCollection] = useState("");
  const [accessionNumber, setAccessionNumber] = useState("");

  useEffect(() => {
    if (modalData) {
      setDateOfCollection(modalData.DateofCollection || "");
      setTimeOfCollection(modalData.TimeofCollection || "");
      setAccessionNumber(modalData.AccessionNumber || "");
    }

    return () => {
      setDateOfCollection("");
      setTimeOfCollection("");
      setAccessionNumber("");
    };
  }, [modalData]);

  const normalizeKeys = (obj: any) => {
    return Object.keys(obj).reduce((acc: any, key: any) => {
      acc[key.toLowerCase()] = obj[key];
      return acc;
    }, {});
  };

  const handleSave = async () => {
    const missingFields = [];

    if (!dateOfCollection) missingFields.push("Date");
    if (!accessionNumber.trim()) missingFields.push("Accession No.");

    if (missingFields.length > 0) {
      toast.error(t(`Missing required fields.`));
      return;
    }

    setSaving(true);

    const formData = new FormData();
    formData.append("DateOfCollection", dateOfCollection);
    formData.append("TimeOfCollection", timeOfCollection);
    formData.append("NextStep", modalData?.NextStep);
    formData.append("RequisitionId", modalData?.RequisitionId);
    formData.append("RequisitionOrderId", modalData?.RequisitionOrderId);
    formData.append("RequisitionType", modalData?.RequisitionType);
    if (!modalData?.AccessionNumber)
      formData.append("AccessionNo", accessionNumber);

    try {
      await RequisitionType.updateRequisitionCollectionDateAndTime(formData);

      if (callFrom !== "digitalcheckin") {
        performNextStep(modalData);
      } else if (missingDateIndex !== undefined) {
        LoadDigitalCheckIn?.(missingDateIndex);
      }

      onClose();
    } catch (error: unknown) {
      setSaving(false);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data?.error);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  const performNextStep = (item: any) => {
    const formData = new FormData();
    const normalizedRowData = normalizeKeys(item);

    try {
      formData.append("RequisitionId", normalizedRowData?.requisitionid);
      formData.append("NextStep", normalizedRowData?.nextstep);
      formData.append(
        "RequisitionOrderId",
        normalizedRowData?.requisitionorderid
      );
      formData.append("RecordId", normalizedRowData?.recordid);
      formData.append("RequisitionType", normalizedRowData?.requisitiontypeid);
      nextStep(formData);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAccession = (value: string) => {
    setAccessionNumber(value);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="data-update-modal-title"
    >
      <Box sx={modalStyle}>
        {/* Show Date Of Collection inputs */}
        {callFrom === "digitalcheckin"
          ? modalData?.missingFields?.includes("Date Of Collection") && (
              <Box width={"100%"} display={"flex"} gap={1} sx={{ mb: 3 }}>
                <div className="w-100">
                  <span className="required">{t("Date Of Collection")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="date"
                    value={dateOfCollection}
                    onChange={(e) => setDateOfCollection(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="w-100">
                  <span>{t("Time Of Collection")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="time"
                    value={timeOfCollection}
                    onChange={(e) => setTimeOfCollection(e.target.value)}
                  />
                </div>
              </Box>
            )
          : !modalData?.DateofCollection && (
              <Box width={"100%"} display={"flex"} gap={1} sx={{ mb: 3 }}>
                <div className="w-100">
                  <span className="required">{t("Date Of Collection")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="date"
                    value={dateOfCollection}
                    onChange={(e) => setDateOfCollection(e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div className="w-100">
                  <span>{t("Time Of Collection")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="time"
                    value={timeOfCollection}
                    onChange={(e) => setTimeOfCollection(e.target.value)}
                  />
                </div>
              </Box>
            )}

        {/* Show Accession Number input */}
        {callFrom === "digitalcheckin"
          ? !modalData?.AccessionNumber &&
            modalData?.missingFields?.includes("Accession Number") && (
              <Box width={"100%"} display={"flex"} gap={1} sx={{ mb: 3 }}>
                <div className="w-100">
                  <span className="required">{t("Accession No.")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="text"
                    value={accessionNumber}
                    onChange={(e) => handleAccession(e.target.value)}
                  />
                </div>
              </Box>
            )
          : !modalData?.AccessionNumber && (
              <Box width={"100%"} display={"flex"} gap={1} sx={{ mb: 3 }}>
                <div className="w-100">
                  <span className="required">{t("Accession No.")}</span>
                  <input
                    className="form-control bg-white h-30px rounded-2 fs-8 w-100"
                    type="text"
                    value={accessionNumber}
                    onChange={(e) => handleAccession(e.target.value)}
                  />
                </div>
              </Box>
            )}

        <Stack
          direction="row"
          spacing={1}
          justifyContent="flex-end"
          sx={{ mt: 4 }}
        >
          <Button
            variant="contained"
            className="bg-secondary"
            sx={{ color: "black" }}
            onClick={onClose}
          >
            {t("Cancel")}
          </Button>
          <Button
            variant="contained"
            className="bg-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {!saving ? t("Save") : t("Saving")}
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
};

export default DataUpdateModal;
