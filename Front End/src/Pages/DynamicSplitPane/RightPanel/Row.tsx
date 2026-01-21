import { Box, Collapse, TableCell, TableRow } from "@mui/material";
import { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "./../../../Shared/hooks/useLanguage";
import AddNewInputs from "./AddNewInputs";
import PatientReqOrder from "Pages/Patient/PatientReqOrder";
import { savePdfUrls } from "Redux/Actions/Index";
import PatientServices from "Services/PatientServices/PatientServices";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "Shared/Icons";
import { TruncatedCell } from "Shared/TruncatedCell";
import { useLoader } from "Shared/Loader/LoaderContext";

function Row({
  item,
  columnsHeader,
  columnActions,
  expandableColumnsHeader,
  loadData,
  bulkActionLength,
  setBulkIds,
  bulkIds,
  inputFields,
  setRows,
  rows,
  setApiData,
  apiData,
  delayedCall,
  setInputFields,
  tabIdToSend,
  columnDataActions,
  isBulkEdit,
}: any) {
  const { showLoader, hideLoader } = useLoader();
  const { t } = useLang();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  const handleActionClick = async (action: any, data: any) => {
    if (action.buttontype === 3) {
      const isAnyRowActive = rows.some((row: any) => row.rowStatus === true);

      if (isAnyRowActive) {
        console.log(
          "Another row is already active. Cannot add or activate another row."
        );
        return;
      }

      setInputFields(
        inputFields.map((field: any) => ({
          ...field,
          show: field?.isIndividualEditable,
        }))
      );
      const updatedRows = rows.map((row: any) => {
        if (row.Id === item.Id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setApiData({
        url: action.actionUrl,
        body: action.jsonBody,
        method: action.methodType,
      });

      setRows(updatedRows);
      return;
    }

    if (action.buttontype === 5) {
      setInputFields(
        inputFields.map((field: any) => ({
          ...field,
          show: !field?.isIndividualEditable,
        }))
      );
      const updatedRows = rows.map((row: any) => {
        if (row.Id === item.Id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setApiData({
        url: action.actionUrl,
        body: action.jsonBody,
        method: action.methodType,
      });

      setRows(updatedRows);
      return;
    }

    if (action.actionUrl && action.buttontype === 1) {
      const path: any = action.actionUrl.split("/")[0];
      navigate(`${path}/${btoa(data.Id)}`, { replace: true });
    } else if (action.actionUrl && action.buttontype === 2) {
      showLoader();
      const payload = {
        TableId: 0,
        actionName: action.actionName,
        ids: [data.Id],
      };
      await PatientServices.makeApiCallForDynamicGrid(
        action.actionUrl,
        action.methodType ?? null,
        payload
      );
      hideLoader();
      loadData(false);
    }
  };

  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  const handleIdsSelections = (id: number) => {
    setBulkIds((prevIds: number[]) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((existingId) => existingId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  const handleRowRemove = () => {
    delayedCall();
  };

  const handleChange = (name: string, value: string, Id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.Id === Id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const makeAPICALL = async (item: any) => {
    try {
      showLoader();
      const nameToFieldMap = inputFields.reduce((map: any, item: any) => {
        if (item && item.fieldName !== undefined && !item.show) {
          map[item.name] = item.fieldName;
        }
        return map;
      }, {});

      const updatedData = Object.keys(item).reduce((result: any, key: any) => {
        const fieldName = nameToFieldMap[key];
        if (fieldName) {
          result[fieldName] = item[key];
        }
        return result;
      }, {});

      delete updatedData.rowStatus;

      const hasValidData = Object.values(updatedData).some(
        (value: any) =>
          value !== null && value !== undefined && value.trim() !== ""
      );

      if (!hasValidData) {
        toast.error(t("Please fill in at least one field."));
        return;
      }

      console.log(updatedData, "updatedData");

      const payloadToSend = {
        id: item.Id === "" ? 0 : item.Id,
        tableId: 0,
        tabId: tabIdToSend,
        jsonFields: JSON.stringify(updatedData),
      };

      const response = await PatientServices.makeApiCallForDynamicGrid(
        apiData.url,
        apiData.method ?? null,
        payloadToSend
      );
      toast.success(response.data.responseMessage);
      delayedCall();
    } catch (error) {
      console.error(error);
    } finally {
      hideLoader();
    }
  };

  const handleActionConfiguration = async (item: any, column: any) => {
    if (item.ActionConfiguration) {
      const actionConfigurationArray = JSON.parse(item.ActionConfiguration);

      const actionConfiguration = actionConfigurationArray.find(
        (action: any) => column?.columnKey === action.Column
      );

      if (actionConfiguration) {
        let path = actionConfiguration.URL;
        const method = actionConfiguration.APIMethod;

        path = path.replace(
          "{Id}/{TabId}/{Column}",
          `${item.Id}/${tabIdToSend}/${actionConfiguration.Column}`
        );
        const response = await PatientServices.APICALL(path, method);
        const dataToReplaceWith = response?.data?.data?.[0];

        const indexToReplace = rows.findIndex(
          (item: any) => item.Id === dataToReplaceWith?.Id
        );

        if (indexToReplace !== -1) {
          const updatedBooksSplice = [...rows];
          updatedBooksSplice.splice(indexToReplace, 1, dataToReplaceWith);
          setRows(updatedBooksSplice);
        }
      }
    }
  };

  const handleFileScenario = (action: any) => {
    if (action.buttontype === 4) {
      handleFileDownload(action);
    } else {
      handleFileView(action);
    }
  };

  const handleFileView = async (action: any) => {
    const url = action.actionUrl.replace("{FileUrl}", item.FileUrl);

    window.open("/docs-viewer", "_blank");
    dispatch(savePdfUrls(url));
  };

  const handleFileDownload = async (action: any) => {
    const downloadButton = document.getElementsByClassName("fa-download");

    if (downloadButton) {
      const url = action.actionUrl.replace("{FileUrl}", item.FileUrl);

      RequisitionType.ShowBlob(url).then((res: any) => {
        window.open(res?.data?.Data.replace("}", ""), "_blank");
      });
    } else {
      console.log("The button does not have the download icon.");
    }
  };

  return (
    <>
      <TableRow>
        {bulkActionLength > 0 && (
          <TableCell>
            <label className="form-check form-check-sm form-check-solid">
              <input
                type="checkbox"
                className="form-check-input"
                checked={bulkIds.includes(item.Id)}
                onChange={() => handleIdsSelections(item.Id)}
              />
            </label>
          </TableCell>
        )}
        {isExpandable() ? (
          <TableCell className="w-20px min-w-20px">
            <span onClick={() => setOpen(!open)}>
              {open ? (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px">
                  <RemoveICon />
                </button>
              ) : (
                <button className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px">
                  <AddIcon />
                </button>
              )}
            </span>
          </TableCell>
        ) : null}
        {item.rowStatus ? (
          isBulkEdit ? (
            <TableCell></TableCell>
          ) : item.IsOpenEditable ? (
            <TableCell></TableCell>
          ) : (
            <div className="gap-2 d-flex">
              <button
                onClick={() => makeAPICALL(item)}
                className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
              >
                <DoneIcon />
              </button>
              <button
                onClick={() => handleRowRemove()}
                className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
              >
                <CrossIcon />
              </button>
            </div>
          )
        ) : !columnActions?.length ? null : (
          <TableCell className="text-center">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id="dropdown-button-drop-end"
              drop="end"
              disabled={isBulkEdit}
              style={{ cursor: isBulkEdit ? "not-allowed" : "pointer" }}
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              {columnActions?.map((action: any, index: number) => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(
                  item.EventStatus,
                  "text/html"
                );
                const doc2 = parser.parseFromString(
                  action.actionHtml,
                  "text/html"
                );
                const eventStatusText = doc.body.textContent || "";
                const actionText = doc2.body.textContent || "";
                return eventStatusText === actionText ? null : (
                  <PermissionComponent
                    moduleName={action.moduleName}
                    pageName={action.pageName}
                    permissionIdentifier={action.permissionIdentifier}
                  >
                    <Dropdown.Item
                      eventKey={index}
                      onClick={() => handleActionClick(action, item)}
                      className="w-auto"
                    >
                      <div
                        dangerouslySetInnerHTML={{ __html: action.actionHtml }}
                      />
                    </Dropdown.Item>
                  </PermissionComponent>
                );
              })}
            </DropdownButton>
          </TableCell>
        )}
        {columnsHeader?.map((column: any, columnHeaderIndex: number) =>
          column?.isShowOnUi && !column?.isExpandData && column.isShow ? (
            item.rowStatus &&
            !inputFields[columnHeaderIndex]?.show &&
            column.filterColumnsType ? (
              <AddNewInputs
                item={item}
                column={column}
                columnHeaderIndex={columnHeaderIndex}
                inputFields={inputFields}
                handleInputsChange={handleChange}
              />
            ) : (
              <TableCell>
                {containsHTMLUsingDOMParser(item[column?.columnKey]) ? (
                  <span
                    dangerouslySetInnerHTML={{
                      __html: item[column?.columnKey],
                    }}
                    onClick={() => handleActionConfiguration(item, column)}
                  />
                ) : item[column?.columnKey] === "" &&
                  columnDataActions?.length ? (
                  columnDataActions.map((data: any, index: number) => {
                    if (data.columnName === column?.columnKey) {
                      return (
                        <span
                          key={data.columnName + index}
                          dangerouslySetInnerHTML={{
                            __html: data.actionHtml,
                          }}
                          onClick={() => handleFileScenario(data)}
                        />
                      );
                    }
                  })
                ) : (
                  <TruncatedCell text={item[column?.columnKey]} />
                )}
              </TableCell>
            )
          ) : null
        )}
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <PatientReqOrder
                patientId={item.PatientId}
                expandableColumnsHeader={expandableColumnsHeader}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;

const containsHTMLUsingDOMParser = (str: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};
