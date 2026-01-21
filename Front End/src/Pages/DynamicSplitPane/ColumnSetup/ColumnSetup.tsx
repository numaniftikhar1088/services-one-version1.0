import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import MiscellaneousService from "Services/MiscellaneousManagement/MiscellaneousService";
import { Loader } from "Shared/Common/Loader";
import useLang from './../../../Shared/hooks/useLanguage';
import DraggableColumns from "./DraggableColumns";

interface ColumnSetupI {
  value?: number;
  show: boolean;
  closeSetupModal: () => void;
  loadData?: (reset: boolean) => void;
  setColoumns?: (columns: any[]) => void;
  columnsToUse?: any[];
  tableId?: number;
  paneNumber: number;
}

function ColumnSetup(props: ColumnSetupI) {
  const {t} = useLang()
  const {
    show,
    closeSetupModal,
    loadData,
    columnsToUse,
    value,
    tableId,
    paneNumber,
  } = props;
  const [savingColumn, setSavingColumn] = useState(false);
  const [columns, setColumns] = useState<any[]>([]);
  const [disabledSave, setDisabledSave] = useState(false);

  useEffect(() => {
    const copiedColumns = columnsToUse
      ? JSON.parse(JSON.stringify(columnsToUse))
      : [];
    setColumns(copiedColumns);
  }, [show, columnsToUse]);

  useEffect(() => {
    let anyColumnTrue = columns.some(
      (column) => column.isShowOnUi && !column.isExpandData && column.isShow
    );
    setDisabledSave(!anyColumnTrue);
  }, [columns]);

  const handleSaveColumns = async () => {
    setSavingColumn(true);
    await MiscellaneousService.saveColumnsSplitPane({
      columns,
      tabId: value,
      tableId,
      paneNo: paneNumber,
    });
    setSavingColumn(false);
    closeSetupModal();
    if (loadData) {
      loadData(false);
    }
  };

  return (
    <Modal
      show={show}
      onHide={closeSetupModal}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton className="py-4">
        <Modal.Title className="h5">{t("Show Hide Columns")}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <div className="row">
            {!columns.length ? (
              <Loader />
            ) : (
              <DraggableColumns
                columns={columns}
                setColumns={setColumns}
                setDisabledSave={setDisabledSave}
              />
            )}
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="py-2">
        <button
          type="button"
          className="btn btn-sm btn-secondary"
          onClick={() => {
            setDisabledSave(false);
            setColumns([]);
            closeSetupModal();
          }}
        >
          {t("Cancel")}
        </button>
        <button
          type="button"
          className="btn btn-sm btn-primary"
          disabled={disabledSave}
          onClick={handleSaveColumns}
        >
          {savingColumn ? t("Saving...") : t("Save")}
        </button>
      </Modal.Footer>
    </Modal>
  );
}

export default ColumnSetup;
