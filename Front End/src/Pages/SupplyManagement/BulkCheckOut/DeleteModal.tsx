import Modal from "react-bootstrap/Modal";
import useLang from "Shared/hooks/useLanguage";

interface DeleteModalI {
  openalert: boolean;
  handleCloseAlert: any;
  deleteIndex: number | null;
  handleRemoveRow: (index: number) => void;
}

function DeleteModal({
  openalert,
  deleteIndex,
  handleRemoveRow,
  handleCloseAlert,
}: DeleteModalI) {
  const { t } = useLang();

  return (
    <Modal
      show={openalert}
      onHide={handleCloseAlert}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="bg-light-primary m-0 p-5">
        <h4>{t("Delete Item")}</h4>
      </Modal.Header>
      <Modal.Body>
        {t("Are you sure you want to delete this Item ?")}
      </Modal.Body>
      <Modal.Footer className="p-0">
        <button
          id={`BulkCheckOutInvertoryModalCancel`}
          type="button"
          className="btn btn-secondary"
          onClick={handleCloseAlert}
        >
          {t("Cancel")}
        </button>
        <button
          id={`BulkCheckOutInvertoryDelete`}
          type="button"
          className="btn btn-danger m-2"
          onClick={() => {
            handleCloseAlert();
            handleRemoveRow(deleteIndex ?? 0);
          }}
        >
          {t("Delete")}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteModal;
