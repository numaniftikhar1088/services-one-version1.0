import React, { useState } from "react";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { ReactState } from "../../Type";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};
interface ModalProps {
  modalheader?: string;
  openModal: boolean;
  setOpenModal: ReactState;
  children: React.ReactNode | React.ReactNode[];
  previewData?: any;
}
const PreviewRequsition: React.FC<ModalProps> = ({
  modalheader,
  children,
  openModal,
  setOpenModal,
  previewData,
}) => {
  const [savingRequisition, setSavingRequisition] = useState(false);
  const submitRequisition = () => {
    setSavingRequisition(true);
    RequisitionType.saveRequsitionFormData(previewData)
      .then((res: any) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(res?.data?.message);
        }
      })
      .catch((err: any) => {
        console.trace(err);
      })
      .finally(() => {
        setSavingRequisition(false);
      });
  };

  return <></>;
};

export default PreviewRequsition;
