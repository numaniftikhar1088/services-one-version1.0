import { Box, Button, Modal } from "@mui/material";
import * as React from "react";
import { FaSave } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import SignatureCanvas from "react-signature-canvas";
import { toast } from "react-toastify";
import PatientServices from "Services/PatientServices/PatientServices";
import useLang from "Shared/hooks/useLanguage";
import { useLoader } from "Shared/Loader/LoaderContext";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  backgroundColor: "white",
  boxShadow: 24,
  borderRadius: "10px",
  overflow: "hidden",
};

const bodyStyle = {
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

interface SignatureModalProps {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  actionForModal: any;
  item: any;
  loadData: any;
  signature: string;
  setSignature: React.Dispatch<React.SetStateAction<string>>;
}

function SignatureModal({
  openModal,
  setOpenModal,
  actionForModal,
  item,
  loadData,
  signature,
  setSignature,
}: SignatureModalProps) {
  const { t } = useLang();
  const { showLoader, hideLoader } = useLoader();

  const [signCanvas, setSignCanvas] = React.useState<SignatureCanvas | null>(
    null
  );

  const handleClose = () => {
    setOpenModal(false);
    signCanvas?.clear();
    setSignature("");
  };

  const setCanvasRef = React.useCallback((node: SignatureCanvas | null) => {
    if (node !== null) {
      setSignCanvas(node);
    }
  }, []);

  const clear = () => {
    signCanvas?.clear();
  };

  const saveSignature = async () => {
    if (signCanvas) {
      showLoader();
      const signatureData = signCanvas.toDataURL("image/png");

      const payload = {
        id: item.Id,
        base64String: signatureData,
        signatureType: "base64String",
      };
      const response = await PatientServices.makeApiCallForDynamicGrid(
        actionForModal.actionUrl,
        actionForModal.methodType ?? null,
        payload
      );
      if (response.data.statusCode === 200) {
        toast.success(t(response.data.responseMessage));
        handleClose();
        loadData(false);
      }
      hideLoader();
    }
  };

  React.useEffect(() => {
    if (signature && signCanvas) {
      signCanvas.fromDataURL(signature);
    }
  }, [signature, signCanvas]);

  return (
    <Modal open={openModal} onClose={handleClose} keepMounted>
      <Box sx={modalStyle}>
        <div className="card">
          {/* Header */}
          <div className="card-header" id="kt_engage_demos_header">
            <h3 className="card-title fw-bold text-gray-700">
              Sign and Approve
            </h3>
          </div>
          {/* Body */}
          <Box sx={bodyStyle}>
            <SignatureCanvas
              maxWidth={2}
              penColor="black"
              ref={setCanvasRef}
              canvasProps={{
                width: 460,
                height: 200,
                style: {
                  backgroundColor: "#F3F6F9",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                },
              }}
            />
            {!item?.IsTakeSignature ? null : (
              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  width: "100%",
                  justifyContent: "end",
                  alignItems: "end",
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  sx={{ textTransform: "capitalize" }}
                  onClick={clear}
                  startIcon={<MdDelete color="white" />}
                >
                  Clear
                </Button>
                <Button
                  variant="contained"
                  color="success"
                  sx={{ textTransform: "capitalize" }}
                  onClick={saveSignature}
                  startIcon={<FaSave size={18} color="white" />}
                >
                  Approve
                </Button>
              </Box>
            )}
          </Box>
        </div>
      </Box>
    </Modal>
  );
}

export default SignatureModal;
