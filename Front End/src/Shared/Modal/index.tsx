import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import React from "react";
import ReactDOM from "react-dom";
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
  handleSubmit: any;
  children: React.ReactNode | React.ReactNode[];
  setEditGridHeader: any;
  setValues: any;
}
const Popup: React.FC<ModalProps> = ({
  modalheader,
  children,
  openModal,
  setValues,
  setOpenModal,
  setEditGridHeader,
  handleSubmit,
}) => {
  const { t } = useLang()
  return ReactDOM.createPortal(
    <>
      <div className="card-header border-0 pt-6 d-flex justify-content-end">
        <div className="card-toolbar">
          <div className="p-0 del-before">
            <Modal
              open={openModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box sx={style}>
                <div className="card shadow-none rounded-0 w-400px w-sm-475px w-md-800px rounded-3">
                  {/* ************************** Demo Body *********************** */}
                  <div className="card-header" id="kt_engage_demos_header">
                    <h3 className="card-title fw-bold text-gray-700">
                      {t(modalheader)}
                    </h3>
                    <div className="card-toolbar">
                      <button
                        type="button"
                        onClick={() => {
                          setOpenModal(false);
                        }}
                        className="btn btn-sm btn-icon btn-active-color-primary h-40px w-40px me-n6"
                      >
                        {/*begin::Svg Icon | path: icons/duotune/arrows/arr061.svg*/}
                        <span className="svg-icon svg-icon-2">
                          <svg
                            width={24}
                            height={24}
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <rect
                              opacity="0.5"
                              x={6}
                              y="17.3137"
                              width={16}
                              height={2}
                              rx={1}
                              transform="rotate(-45 6 17.3137)"
                              fill="currentColor"
                            />
                            <rect
                              x="7.41422"
                              y={6}
                              width={16}
                              height={2}
                              rx={1}
                              transform="rotate(45 7.41422 6)"
                              fill="currentColor"
                            />
                          </svg>
                        </span>
                        {/*end::Svg Icon*/}
                      </button>
                    </div>
                  </div>
                  <div className="card-body px-3 px-md-8">{children}</div>
                  <div className="card-footer mt-15 py-4 px-9">
                    <button
                      type="button"
                      className="btn btn-secondary btn btn-primary"
                      onClick={() => {
                        setOpenModal(false);
                        setValues((preVal: any) => {
                          return {
                            ...preVal,
                          };
                        });
                        setEditGridHeader(false);
                        // window.location.reload();
                      }}
                    >
                      {t("Cancel")}
                    </button>
                    {
                      <>
                        <button
                          onClick={handleSubmit}
                          type="button"
                          className="btn btn-primary m-2"
                        >
                          {t("Save")}
                        </button>
                      </>
                    }
                  </div>
                </div>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </>,
    document.getElementById("root-portal") as HTMLElement
  );
};

export default Popup;
