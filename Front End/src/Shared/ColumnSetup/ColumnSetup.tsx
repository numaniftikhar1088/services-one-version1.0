import { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import MiscellaneousService from "../../Services/MiscellaneousManagement/MiscellaneousService";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../Common/Loader";
import useLang from "./../hooks/useLanguage";
import DraggableColumns from "./DraggableColumns";

interface ColumnSetupI {
  value?: number | null;
  show: boolean;
  closeSetupModal: () => void;
  loadData?: any;
  setColoumns?: (columns: any[]) => void;
  columnsToUse?: any[];
  isSingeUi?: boolean;
  tableId?: number;
  dynamicGridLoad?: any;
}

function ColumnSetup(props: ColumnSetupI) {
  const { t } = useLang();
  const {
    show,
    closeSetupModal,
    loadData,
    columnsToUse,
    value,
    isSingeUi,
    tableId,
    dynamicGridLoad,
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
    isSingeUi
      ? await MiscellaneousService.saveSingleUiColumn({
          columns,
          tabId: value,
          tableId,
        })
      : await RequisitionType.SaveColumns({ columns, tabId: value });
    setSavingColumn(false);
    closeSetupModal();
    if (loadData) {
      await loadData("columnSetup");
      dynamicGridLoad && dynamicGridLoad();
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
      <Modal.Body className="py-4">
        <>
          <span style={{ fontSize: "11px" }} className="text-muted">
            {t(
              "Note: Rearrange the columns by moving them up or down to change their order."
            )}
          </span>
          <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 mt-2">
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
        </>
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
