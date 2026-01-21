import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import React from "react";
import { ReactState } from "../Type";
import useLang from './../hooks/useLanguage';

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

interface ModalProps {
  modalheader: string;
  openModal: boolean;
  setOpenModal: ReactState;
  children?: React.ReactNode | React.ReactNode[];
}

const ViewRequisitionPopup: React.FC<ModalProps> = ({
  modalheader,
  children,
  openModal,
  setOpenModal,
}) => {
  const { t } = useLang()
  return (
    <Collapse in={openModal}>
      <Box>
        <div className="card">
          {/* ************************** Demo Body *********************** */}
          <div className="card-header px-0" id="kt_engage_demos_header">
            <h3 className="card-title fw-bold">
              {t(modalheader)}
            </h3>
          </div>
          <div className="card-body px-0 pb-2 pt-4">{children}</div>
        </div>
      </Box>
    </Collapse>
  );
};

export default ViewRequisitionPopup;
