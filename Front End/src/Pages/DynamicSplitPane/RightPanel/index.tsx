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

export interface TabConfiguration {
  tabName: string;
  tabID: number;
}

const RightPanel = ({
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
  setRows2,
  dynamicGridSplitPane,
  getTabsForSplitPane,
  loading,
  setSearchValue,
  inputFields,
  setInputFields,
  bottomButtonsPane1,
  setIsBulkEdit,
  isBulkEdit,
}: any) => {
  const { t } = useLang();

  const searchRef = useRef<any>(null);

  const [apiData, setApiData] = useState<any>({});
  const [show1, setShow1] = useState(false);
  const [showSetupModal, showModalSetup] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);

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

  const delayedCall = async () => {
    dynamicGridSplitPane();
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

  /**
   * `handleBulkUpdate` is asynchronous function used to handle bulk Edit
   *
   */
  function removeNullObjects(arr: any) {
    return arr.filter((obj: any) => {
      const hasNonNullField = Object.keys(obj).some(
        (key) => key !== "Id" && obj[key] !== null
      );
      return hasNonNullField;
    });
  }

  const handleBulkUpdate = async (actionUrl: string, actionMethod: string) => {
    const nameToFieldMap = inputFields.reduce((map: any, item: any) => {
      if (item && item.fieldName !== undefined && !item.show) {
        map[item.name] = item.fieldName;
      }
      return map;
    }, {});

    let editableContentList: any[] = [];
    inputFields.map((field: any) => {
      console.log(field, "ajsdaskd");
      if (field?.isIndividualEditable) {
        editableContentList.push(field);
      }
    });

    let updatedRows = rows
      .map((item: any, index: number) => {
        const updatedData = Object.keys(item).reduce(
          (result: any, key: any) => {
            const fieldName = nameToFieldMap[key];

            if (fieldName) {
              result[fieldName] = item[key];
            }
            return result;
          },
          {}
        );

        if (item.rowStatus) {
          updatedData.rowStatus = item.rowStatus;
        }

        // appending Id in object
        if (Object.keys(updatedData).length > 0) {
          updatedData.Id = item.Id;
        }

        return updatedData;
      })
      .filter((item: any) => item.rowStatus === true)
      .filter((obj: any) => {
        const hasNonNullField = Object.keys(obj).some(
          (key) =>
            key !== "Id" &&
            obj[key] !== null &&
            editableContentList?.find((content) => content.fieldName === key)
        );
        return hasNonNullField;
      })
      .map((item: any) => {
        delete item.rowStatus;
        return item;
      });

    const nullsValues = removeNullObjects(updatedRows);

    const payload = {
      tableId: 0,
      tabId: tabIdToSend,
      jsonFields: JSON.stringify(nullsValues),
    };

    await PatientServices.makeApiCallForDynamicGrid(
      actionUrl,
      actionMethod ?? null,
      payload
    );

    dynamicGridSplitPane();
    setIsBulkEdit(false);
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
        <div
          id="kt_app_content_container"
          className="app-container container-fluid"
        >
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
                                rows?.map((item: any, itemIndex: number) => (
                                  <Row
                                    rows={rows}
                                    item={item}
                                    setRows={setRows}
                                    bulkIds={bulkIds}
                                    apiData={apiData}
                                    loadData={""}
                                    itemIndex={itemIndex}
                                    isBulkEdit={isBulkEdit}
                                    setApiData={setApiData}
                                    setBulkIds={setBulkIds}
                                    tabIdToSend={tabIdToSend}
                                    columnsHeader={columnsHeader}
                                    columnActions={columnActions}
                                    inputFields={inputFields}
                                    delayedCall={delayedCall}
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
                  <div className="d-flex gap-3 mt-4">
                    {bottomButtonsPane1?.map(
                      ({
                        actionHtml,
                        actionUrl,
                        methodType,
                        actionName,
                      }: any) => {
                        let isDisabled = false;

                        if (actionName === "Next Button") {
                          isDisabled =
                            rows?.[rows.length - 1]?.NextRecordNumber == 0 ||
                            rows?.[rows.length - 1]?.NextRecordNumber == null ||
                            rows?.[rows.length - 1]?.NextRecordNumber == "";
                        } else if (actionName === "Previous Button") {
                          isDisabled =
                            rows?.[0]?.PreviousRecordNumber == 0 ||
                            rows?.[0]?.PreviousRecordNumber == null ||
                            rows?.[0]?.PreviousRecordNumber == "";
                        }

                        return (
                          <span
                            style={{
                              opacity: isDisabled ? "0.5" : "1",
                            }}
                            dangerouslySetInnerHTML={{ __html: actionHtml }}
                            onClick={
                              isDisabled
                                ? undefined
                                : actionName === "Bulk Edit"
                                ? () => handleBulkUpdate(actionUrl, methodType)
                                : async () => {
                                    try {
                                      const recordNumber =
                                        actionName === "Next Button"
                                          ? rows[rows.length - 1]
                                              .NextRecordNumber
                                          : actionName === "Previous Button"
                                          ? rows[0].PreviousRecordNumber
                                          : rows[rows.length - 1]
                                              .NextRecordNumber;
                                      setSearchValue((prevValue: any) => ({
                                        ...prevValue,
                                        recordNumber: recordNumber,
                                      }));
                                      const response =
                                        await PatientServices.makeApiCallForDynamicGrid(
                                          actionUrl,
                                          methodType ?? null,
                                          {
                                            recordNumber,
                                            filters: [],
                                          }
                                        );

                                      setRows2(
                                        response.data.pane1.map((row: any) => ({
                                          ...row,
                                          rowStatus: row.IsOpenEditable
                                            ? true
                                            : row.rowStatus,
                                        }))
                                      );

                                      setRows(
                                        response.data.pane2.map((row: any) => ({
                                          ...row,
                                          rowStatus: row.IsOpenEditable
                                            ? true
                                            : row.rowStatus,
                                        }))
                                      );
                                    } catch (error) {
                                      console.error(error);
                                    }
                                  }
                            }
                          />
                        );
                      }
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;

export const TabSelected = styled(Tab)(AutocompleteStyle());

export function a11yProps(index: string, sortorder: string) {
  return {
    id: index,
    sortorder,
    "aria-controls": `simple-tabpanel-${index}-${sortorder}`,
  };
}
