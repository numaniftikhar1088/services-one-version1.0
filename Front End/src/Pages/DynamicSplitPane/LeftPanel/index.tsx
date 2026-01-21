import { Paper, styled } from "@mui/material";
import Box from "@mui/material/Box";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import PatientServices from "Services/PatientServices/PatientServices";
import { Loader } from "Shared/Common/Loader";
import NoRecord from "Shared/Common/NoRecord";
import { AutocompleteStyle } from "Utils/MuiStyles/AutocompleteStyles";
import { useEffect, useRef, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ColumnSetup from "../ColumnSetup/ColumnSetup";
import useLang from "./../../../Shared/hooks/useLanguage";
import Row from "./Row";

const LeftPanel = ({
  paneNumber,
  bulkIds,
  value,
  tabIdToSend,
  setBulkIds,
  bulkActions,
  columnDataActions,
  columnActions,
  rows,
  setRows,
  dynamicGridSplitPane,
  getTabsForSplitPane,
  loading,
}: any) => {
  const { t } = useLang();

  const [apiData, setApiData] = useState<any>({});
  const [inputFields, setInputFields] = useState([]);
  const [show1, setShow1] = useState(false);
  const [showSetupModal, showModalSetup] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);

  const searchRef = useRef<any>(null);

  const [expandableColumnsHeader, setExpandableColumnsHeader] = useState<any>(
    []
  );

  let columnsHeader =
    paneNumber?.viewReqTabsWithHeadersResponse?.[value]?.tabHeaders;

  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  const DeletebyId = async (item: any) => {
    try {
      const response = await PatientServices?.deletebyid(item);
      toast.success(response.data.message);
    } catch (error) {
      console.error(error);
    }
  };

  const closeSetupModal = () => {
    showModalSetup(false);
  };

  useEffect(() => {
    if (columnsHeader?.length) {
      setExpandableColumnsHeader(
        columnsHeader
          .map((item: any) => {
            if (item.isShowOnUi && item.isExpandData) {
              return item;
            } else return null;
          })
          .filter((item: any) => item !== null)
      );
    }
  }, [columnsHeader]);

  const [isInitialRender, setIsInitialRender] = useState(false);

  useEffect(() => {
    if (isInitialRender) {
      dynamicGridSplitPane();
    } else {
      setIsInitialRender(true);
    }
  }, [value]);

  /**
   * The `handleSelectAll` function allows you to select all rows for bulk actions.
   *
   * description:
   * This function collects the IDs of all rows and updates the `bulkIds` state variable
   */
  const handleSelectAll = (checked: boolean) => {
    if (!checked) {
      setBulkIds([]);
    } else {
      setBulkIds(rows.map((row: any) => row.Id));
    }
  };

  return (
    <div className="d-flex flex-column flex-column-fluid">
      <ColumnSetup
        value={tabIdToSend}
        show={showSetupModal}
        paneNumber={paneNumber?.paneNo}
        columnsToUse={columnsHeader}
        closeSetupModal={closeSetupModal}
        loadData={getTabsForSplitPane}
      />
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-end align-items-center">
          <div className="d-flex flex-wrap align-items-center gap-2 gap-lg-3">
            <button
              className="btn btn-icon btn-sm fw-bold btn-setting btn-icon-light"
              onClick={() => showModalSetup(true)}
            >
              <i className="fa fa-gear"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="kt_app_content" className="app-content flex-column-fluid">
        <div id="kt_app_content_container" style={{ paddingRight: 30 }}>
          <div className="mb-5 hover-scroll-x">
            <div className="tab-pane" id="activetab" role="tabpanel">
              <div className="card tab-content-card">
                <div className="card-toolbar">
                  <div className="p-0 del-before"></div>
                </div>
                <div className="card-body py-md-4 py-3">
                  <Box sx={{ height: "auto", width: "100%" }}>
                    <div className="table_bordered overflow-hidden">
                      <TableContainer
                        sx={{
                          maxHeight: "calc(100vh - 100px)",
                          "&::-webkit-scrollbar": {
                            width: 7,
                          },
                          "&::-webkit-scrollbar-track": {
                            backgroundColor: "#fff",
                          },
                          "&:hover": {
                            "&::-webkit-scrollbar-thumb": {
                              backgroundColor: "var(--kt-gray-400)",
                              borderRadius: 2,
                            },
                          },
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "var(--kt-gray-400)",
                            borderRadius: 2,
                          },
                        }}
                        component={Paper}
                        className="shadow-none"
                      >
                        <Table
                          aria-label="sticky table collapsible"
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                        >
                          <>
                            {!columnsHeader?.length ? null : (
                              <TableHead className="h-40px">
                                <TableRow className="h-30px">
                                  {bulkActions?.length ? (
                                    <TableCell>
                                      <label className="form-check form-check-sm form-check-solid">
                                        <input
                                          type="checkbox"
                                          className="form-check-input"
                                          checked={
                                            bulkIds.length === rows.length
                                              ? true
                                              : false
                                          }
                                          onChange={(e) =>
                                            handleSelectAll(e.target.checked)
                                          }
                                        />
                                      </label>
                                    </TableCell>
                                  ) : null}
                                  {isExpandable() ? (
                                    <TableCell></TableCell>
                                  ) : null}
                                  {!columnActions?.length ? null : (
                                    <TableCell>{t("Actions")}</TableCell>
                                  )}
                                  {columnsHeader?.map((column: any) => {
                                    return (
                                      column.isShowOnUi &&
                                      !column.isExpandData &&
                                      column.isShow && (
                                        <TableCell
                                          sx={{ width: "max-content" }}
                                        >
                                          <div
                                            className={`d-flex justify-content-between`}
                                            ref={searchRef}
                                          >
                                            <span style={{ minWidth: "100px" }}>
                                              {column.columnLabel}
                                            </span>
                                          </div>
                                        </TableCell>
                                      )
                                    );
                                  })}
                                </TableRow>
                              </TableHead>
                            )}
                            <TableBody>
                              {loading ? (
                                <TableCell colSpan={9}>
                                  <Loader />
                                </TableCell>
                              ) : !rows.length ? (
                                <NoRecord />
                              ) : (
                                rows?.map((item: any) => (
                                  <Row
                                    rows={rows}
                                    item={item}
                                    setRows={setRows}
                                    bulkIds={bulkIds}
                                    apiData={apiData}
                                    loadData={""}
                                    setApiData={setApiData}
                                    setBulkIds={setBulkIds}
                                    tabIdToSend={tabIdToSend}
                                    columnsHeader={columnsHeader}
                                    columnActions={columnActions}
                                    inputFields={inputFields}
                                    setInputFields={setInputFields}
                                    expandableColumnsHeader={
                                      expandableColumnsHeader
                                    }
                                    columnDataActions={columnDataActions}
                                    bulkActionLength={bulkActions?.length}
                                  />
                                ))
                              )}
                            </TableBody>
                          </>
                        </Table>
                      </TableContainer>
                      <Modal
                        show={show1}
                        onHide={ModalhandleClose1}
                        backdrop="static"
                        keyboard={false}
                      >
                        <Modal.Header
                          closeButton
                          className="bg-light-primary m-0 p-5"
                        >
                          <h4>{t("Delete Record")}</h4>
                        </Modal.Header>
                        <Modal.Body>
                          {t("Are you sure you want to delete this record ?")}
                        </Modal.Body>
                        <Modal.Footer className="p-0">
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={ModalhandleClose1}
                          >
                            {t("Cancel")}
                          </button>
                          <button
                            type="button"
                            className="btn btn-danger m-2"
                            onClick={() => {
                              ModalhandleClose1();
                              DeletebyId(value);
                            }}
                          >
                            {t("Delete")}
                          </button>
                        </Modal.Footer>
                      </Modal>
                    </div>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeftPanel;

export const TabSelected = styled(Tab)(AutocompleteStyle());

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}
