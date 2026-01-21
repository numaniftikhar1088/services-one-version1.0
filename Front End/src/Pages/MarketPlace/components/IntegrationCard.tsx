import { Button, Card, Tooltip, Typography } from "@mui/material";
import { useState } from "react";
import { Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getIntegrationDetailById,
  labIntegrationRequest,
} from "Services/MarketPlace";
import { Loader } from "Shared/Common/Loader";
import useLang from "Shared/hooks/useLanguage";

interface IntegrationCardProps {
  card: any;
}

export function IntegrationCard({ card }: IntegrationCardProps) {
  const { t } = useLang();
  const navigate = useNavigate();

  const [openAlert, setOpenAlert] = useState(false);
  const [dataById, setDataById] = useState<any>([]);
  const [dataByIdLoader, setDataByIdLoader] = useState(false);
  const labId = useSelector(
    (reducers: any) => reducers.Reducer.selectedTenantInfo.tenantId
  );

  const handleClickOpen = (card:any) => {
    const {integrationId:id,integrationType}=card
    if(integrationType === "HL7"){
      console.log("cardss",card,"id",id)
      navigate(`/add-integration/${id}`);
      return
    }
    setDataByIdLoader(true);
    setOpenAlert(true);
    getIntegrationDetailById(id)
      .then((res: any) => {
        setDataById(res?.data?.data);
        setDataByIdLoader(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      })
      .finally(() => {
        setDataByIdLoader(false);
      });
  };

  const handleStartIntegration = () => {
    labIntegrationRequest({
      id: 0,
      labId: labId,
      integrationId: dataById.integrationId,
      description: dataById.description,
      status: "pending",
    })
      .then((res: any) => {
        toast.success(res.data.message);
        setOpenAlert(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
      });
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  return (
    <>
      <Modal
        show={openAlert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Integrate")}</h4>
        </Modal.Header>
        <Modal.Body>
          {dataByIdLoader ? <Loader /> : dataById.description}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-danger"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary m-2"
            disabled={dataByIdLoader}
            onClick={() => {
              handleStartIntegration();
              handleCloseAlert();
            }}
          >
            <span>{t("Request Integration")}</span>
          </button>
        </Modal.Footer>
      </Modal>
      <Card className="card shadow-none rounded-3">
        <div
          className="card-body p-6 d-flex flex-column align-items-start justify-content-between"
          style={{ height: "260px" }}
        >
          <div>
            {card.integrationLogo ? (
              <img
                className="mb-3"
                src={card.integrationLogo}
                alt="Integration Logo"
                style={{
                  width: "50%",
                  height: "85px",
                  objectFit: "contain",
                }}
              />
            ) : (
              <div
                className="mb-3 bg-light d-flex align-items-center justify-content-center"
                style={{
                  width: "85px",
                  height: "85px",
                  border: "1px solid #ddd",
                }}
              >
                <i className="fa fa-image text-muted"></i>
              </div>
            )}
            <Typography
              gutterBottom
              variant="h6"
              component="div"
              className="text-black fw-500"
              sx={{ fontFamily: "Poppins, sans-serif", lineHeight: "1.25" }}
            >
              {card.integrationName}
            </Typography>
            <Tooltip
              title={card.description}
              slotProps={{
                tooltip: {
                  sx: {
                    fontSize: "0.8rem",
                    fontFamily: "Poppins, sans-serif",
                  },
                },
              }}
              // sx={{ fontFamily: "Poppins, sans-serif" }}
            >
              <Typography
                gutterBottom
                className="text-wrap-marketPlace-card"
                variant="body2"
                component="div"
                sx={{
                  color: "#6c757d",
                  fontFamily: "Poppins, sans-serif", // optional: adjust based on line height
                  cursor: "default", // shows pointer if you want, or leave it as default
                }}
              >
                {card.description}
              </Typography>
            </Tooltip>
          </div>
          <div className="">
            <Button
              className="btn btn-primary btn-sm mt-auto text-lo text-capitalize"
              sx={{ fontFamily: "Poppins, sans-serif" }}
              onClick={() => handleClickOpen(card)}
            >
              Request Integration
            </Button>
          </div>
        </div>
      </Card>
    </>
  );
}
