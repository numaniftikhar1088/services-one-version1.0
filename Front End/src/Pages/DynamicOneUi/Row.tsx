import { Box, Collapse, TableCell, TableRow } from "@mui/material";
import { ChangeEvent, useRef, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "../../Shared/Icons";
import PatientReqOrder from "../Patient/PatientReqOrder";
import useLang from "./../../Shared/hooks/useLanguage";
import AddNewInputs from "./AddNewInputs";
import { isJson } from "Utils/Common/Requisition";
import { useLoader } from "Shared/Loader/LoaderContext";
import RequisitionType from "Services/Requisition/RequisitionTypeService";
import { savePdfUrls } from "Redux/Actions/Index";
import { JsonHandling } from "Pages/DynamicGrid/Row";

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
  tableId,
  tabIdToSend,
  columnDataActions,
}: any) {
  const { t } = useLang();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionConfigurationRef = useRef(null);
  const allowedExtensionsRef = useRef(null);

  const dispatch = useDispatch();
  const { showLoader, hideLoader } = useLoader();

  const handleActionClick = async (action: any, data: any) => {
    if (action.buttontype === 3) {
      const isAnyRowActive = rows.some((row: any) => row.rowStatus === true);

      if (isAnyRowActive) return;

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
        tableId: tableId,
        actionName: action.actionName,
        ids: [data.Id],
      };
      const response = await PatientServices.makeApiCallForDynamicGrid(
        action.actionUrl,
        action.methodType ?? null,
        payload
      );
      if (response.data.statusCode === 200) {
        toast.success(response.data.responseMessage);
        loadData(false);
      }
      hideLoader();
    }

    if (action.buttontype === 7) {
      const path = action.actionUrl;
      const _path = path
        .replace("{{pageId}}", window.btoa(action.redirectPageId))
        .replace("{{id}}", `?id=${Math.abs(item.Id)}`);

      navigate(_path);
    }
  };

  const openFileSelection = (
    event: ChangeEvent<HTMLInputElement>,
    item: any
  ) => {
    const file = event.target.files?.[0];

    if (file) {
      handleFileUpload(
        file,
        item,
        tabIdToSend,
        actionConfigurationRef.current,
        allowedExtensionsRef.current
      );
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

    const fileNameToReplace = action.actionUrl.split("uri=")[1];
    const withoutSpaces = fileNameToReplace.replace("{", "").replace("}", "");

    if (downloadButton) {
      const url = action.actionUrl.replace(
        fileNameToReplace,
        item[withoutSpaces]
      );

      RequisitionType.ShowBlob(url).then((res: any) => {
        window.open(res?.data?.Data.replace("}", ""), "_blank");
      });
    }
  };

  const handleFileUpload = async (
    file: File,
    item: any,
    tabIdToSend: string,
    actionConfiguration: any,
    fileExtensions: string | null
  ) => {
    if (!file) return;

    // Validate file type
    if (fileExtensions) {
      const allowedExtensionsArray = fileExtensions.split(",");
      const fileExtension = file.name.split(".").pop()?.toLowerCase();

      if (
        !fileExtension ||
        !allowedExtensionsArray.includes(`.${fileExtension}`)
      ) {
        toast.error(`Invalid file type. Allowed types: ${fileExtensions}`);
        return; // Stop execution if the file type is invalid
      }
    }

    const {
      URL: pathTemplate,
      APIMethod: method,
      Column: column,
    } = actionConfiguration;

    // Generate the dynamic URL
    const path = pathTemplate.replace(
      "{Id}/{TabId}/{Column}",
      `${item.Id}/${tabIdToSend}/${column}`
    );

    // Prepare FormData
    const formData = new FormData();
    formData.append("Id", item.Id);
    formData.append("ColumnName", column);
    formData.append("TabId", tabIdToSend);
    formData.append("file", file);

    try {
      showLoader();
      // Make the API call
      const response = await PatientServices.APICALL(path, method, formData);

      // Update the rows with the server response
      const dataToReplaceWith = response?.data?.data?.[0];

      if (!dataToReplaceWith && response?.data?.statusCode === 200) {
        toast.success(response.data.responseMessage);
        loadData();
        return;
      }

      if (!dataToReplaceWith) return;

      const indexToReplace = rows.findIndex(
        (row: any) => row.Id === dataToReplaceWith.Id
      );

      if (indexToReplace !== -1) {
        const updatedRows = [...rows];
        updatedRows.splice(indexToReplace, 1, dataToReplaceWith);
        setRows(updatedRows);
      }
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("File upload failed. Please try again.");
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

      actionConfigurationRef.current = actionConfiguration;

      // Store allowedExtensions in the ref
      if (actionConfiguration?.JSONRequest?.FileType) {
        allowedExtensionsRef.current =
          actionConfiguration.JSONRequest.FileType.join(",");
      } else {
        allowedExtensionsRef.current = null;
      }

      if (
        Boolean(item.IsTakeSignature) &&
        item.SignaturePreviewButtontype === 9 &&
        actionConfiguration
      ) {
        toast.error(
          "Please provide the Director's signature before validating the order."
        );
        return;
      }

      if (actionConfiguration) {
        if (item.ButtonType === "8") {
          (fileInputRef.current as any).click(); // Trigger file selection
          return false;
        }

        let path = actionConfiguration.URL;
        const method = actionConfiguration.APIMethod;

        path = path
          .replace(/{Id}/g, item.Id ?? "{Id}")
          .replace(/{TabId}/g, tabIdToSend ?? "{TabId}")
          .replace(/{Column}/g, actionConfiguration.Column ?? "{Column}");
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

    // if (item.SignaturePreviewConfiguration) {
    //   let actionConfigurationArray = JSON.parse(
    //     item.SignaturePreviewConfiguration
    //   );
    //   let actionConfiguration = actionConfigurationArray.find(
    //     (action: any) => column?.columnKey === action.Column
    //   );

    //   if (actionConfiguration && item.SignaturePreviewButtontype == 9) {
    //     setOpenModal(true);
    //     handleSignaturePreview(column);
    //   }
    // }
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
    delayedCall(tableId);
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
          value !== null &&
          value !== undefined &&
          (typeof value === "string" ? value.trim() !== "" : true)
      );

      if (!hasValidData) {
        toast.error(t("Please fill in at least one field."));
        return;
      }

      const payloadToSend = {
        id: item.Id === "" ? 0 : item.Id,
        TableId: tableId,
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

  const containsHTMLUsingDOMParser = (str: string): boolean => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(str, "text/html");

    // Check if any nodes are present in the body
    return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
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
        ) : !columnActions?.length ? null : (
          <TableCell className="text-center">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id="dropdown-button-drop-end"
              drop="end"
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
        {columnsHeader?.map((column: any, columnHeaderIndex: number) => {
          if (column?.isShowOnUi && !column?.isExpandData && column.isShow) {
            if (item.rowStatus && !inputFields[columnHeaderIndex].show) {
              return (
                <AddNewInputs
                  key={columnHeaderIndex + column?.columnKey}
                  item={item}
                  column={column}
                  inputFields={inputFields}
                  handleInputsChange={handleChange}
                  columnHeaderIndex={columnHeaderIndex}
                />
              );
            } else {
              let keyData = item[column?.columnKey];

              const field = inputFields?.[columnHeaderIndex];

              if (field?.jsonOptionData && field?.inputType === "dropdown") {
                try {
                  const parsedData = JSON.parse(field.jsonOptionData);

                  const match = parsedData.find(
                    (item: any) => item.value === keyData
                  );
                  keyData = match?.label || "";
                } catch (error) {
                  console.error("Failed to parse jsonOptionData:", error);
                  keyData = "";
                }
              }

              if (field?.inputType === "switch") {
                try {
                  return (
                    <TableCell>
                      <div className="form__group form__group--checkbox d-flex">
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={
                              item?.[column?.columnKey] === 1 ? true : false
                            }
                            disabled
                          />
                        </div>
                      </div>
                    </TableCell>
                  );
                } catch (error) {
                  console.error("Failed to parse jsonOptionData:", error);
                  keyData = "";
                }
              }

              let isItBlobFile;

              if (typeof keyData === "string") {
                isItBlobFile = keyData?.includes(
                  "https://truemedpo.blob.core.windows.net"
                );
              }

              // if (item.ActionConfiguration) {
              // let actionConfigurationArray = JSON.parse(
              //   item.ActionConfiguration
              // );
              // const actionConfiguration = actionConfigurationArray.find(
              //   (action: any) => column?.columnKey === action.Column
              // );
              // const allowedExtensions =
              //   actionConfiguration?.JSONRequest?.FileType?.join(",") || "";
              // }

              return (
                <TableCell key={columnHeaderIndex + column?.columnKey}>
                  {containsHTMLUsingDOMParser(item[column?.columnKey]) ? (
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={(event) => openFileSelection(event, item)}
                      />

                      <span
                        dangerouslySetInnerHTML={{ __html: keyData }}
                        onClick={() => {
                          handleActionConfiguration(item, column);
                        }}
                      />
                    </div>
                  ) : keyData === "" && columnDataActions?.length ? (
                    columnDataActions.map((data: any, index: number) => {
                      if (data.columnName === column?.columnKey) {
                        return (
                          <span
                            key={column?.columnKey + index}
                            dangerouslySetInnerHTML={{
                              __html: data.actionHtml,
                            }}
                            onClick={() => handleFileScenario(data)}
                          />
                        );
                      }
                      return null; // Ensure every map has a fallback return
                    })
                  ) : isItBlobFile ? (
                    <Link
                      className="d-flex justify-content-center align-items-center"
                      to={`/docs-viewer`}
                      target="_blank"
                    >
                      <i
                        className="bi bi-file-earmark-pdf text-danger fa-2x cursor-pointer"
                        onClick={() => {
                          dispatch(savePdfUrls(keyData));
                        }}
                      ></i>
                    </Link>
                  ) : isJson(keyData) ? (
                    <JsonHandling value={keyData} />
                  ) : (
                    keyData
                  )}
                </TableCell>
              );
            }
          }
          return null; // Ensure map() always returns something
        })}
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
