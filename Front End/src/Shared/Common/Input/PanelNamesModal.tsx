import { Modal, Button } from "react-bootstrap";

const PanelNamesModal = ({ panelNames, showModal, handleClose }: any) => {
  return (
    <Modal
      show={showModal}
      onHide={handleClose}
      backdrop={false}
      keyboard={false}
    >
      <Modal.Header
        closeButton
        className="bg-light-danger m-0 modal-header p-3"
      >
        <h5 style={{ color: "red" }}>Invalid Panel Selected</h5>
      </Modal.Header>
      <Modal.Body>
        {Array.isArray(panelNames) && (
          <span>Following are the valid combination</span>
        )}
        {Array.isArray(panelNames) && panelNames.length > 0 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              marginTop: "10px",
            }}
          >
            {panelNames.map((panelGroup: any[], groupIndex: number) => (
              <div key={groupIndex}>
                {/* Map through each array and display its contents */}
                <div className="d-flex flex-wrap gap-5">
                  {panelGroup.map((i: any) => (
                    <span key={i?.PanelName} className="badge badge-secondary">
                      {i?.PanelName}
                    </span>
                  ))}
                </div>

                {/* Add a horizontal line except for the last group */}
                {groupIndex < panelNames.length - 1 && (
                  <hr style={{ margin: "10px 0", borderColor: "#ccc" }} />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: "#ff0000", fontWeight: "bold" }}>
            No combination found
          </div>
        )}
      </Modal.Body>
      <Modal.Footer className="modal-footer p-2 m-0">
        <button onClick={handleClose} className="btn btn-danger btn-sm m-2">
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default PanelNamesModal;
