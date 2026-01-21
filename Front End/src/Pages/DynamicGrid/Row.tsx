import { Box, Collapse, MenuItem, TableCell, TableRow } from "@mui/material";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { savePdfUrls } from "../../Redux/Actions/Index";
import PatientServices from "../../Services/PatientServices/PatientServices";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, CrossIcon, DoneIcon, RemoveICon } from "../../Shared/Icons";
import useLang from "./../../Shared/hooks/useLanguage";
import { AddNewInputs } from "./AddNewInputs";
import CollapseTable from "./Collapse";
import { useDynamicGrid } from "./Context/useDynamicGrid";
import SignatureModal from "./SignatureModal";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import { isJson } from "Utils/Common/Requisition";
import { TruncatedCell } from "Shared/TruncatedCell";
import { useLoader } from "Shared/Loader/LoaderContext";

interface RowProps {
  item: any;
  loadData: (reset: boolean) => void;
  rows: any;
}

function Row({ item, loadData, rows }: RowProps) {
  const {
    setBulkIds,
    setRows,
    columnDataActions,
    bulkIds,
    isBulkEdit,
    columnActions,
    setInputFields,
    inputFields,
    bulkExportActions,
    bulkActions,
    setApiData,
    tabIdToSend,
    apiData,
    expandableColumnsHeader,
    isExpandable,
    columnsHeader,
  } = useDynamicGrid();

  const { t } = useLang();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [openModal, setOpenModal] = useState(false);
  const [actionForModal, setActionForModal] = useState(null);
  const [signature, setSignature] = useState("");
  const [open, setOpen] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const actionConfigurationRef = useRef(null);
  const allowedExtensionsRef = useRef(null);

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
      const path = action.actionUrl.replace("{{Id}}", btoa(data.Id));
      navigate(path, { replace: true });
    } else if (action.actionUrl && action.buttontype === 2) {
      showLoader();
      const payload = {
        TableId: 0,
        actionName: action.actionName,
        ids: [data.Id],
      };
      const response = await PatientServices.makeApiCallForDynamicGrid(
        action.actionUrl,
        action.methodType ?? null,
        payload
      );
      if (response.data.statusCode === 200) {
        toast.success(t(response.data.responseMessage));
        loadData(false);
      }
      hideLoader();
    }

    if (action.buttontype === 7) {
      const path = action.actionUrl;
      const _path = path
        .replace("{{pageId}}", window.btoa(action.redirectPageId))
        .replace("{{id}}", `?id=${Math.abs(item.Id)}`);
      console.log(_path, "_path");

      navigate(_path);
    }

    if (action.buttontype === 9) {
      setActionForModal(action);
      setOpenModal(true);
      handleClose();
    }
  };

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
    loadData(false);
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const openDrop = Boolean(anchorEl);

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
        (value: any) => {
          if (value === null || value === undefined) {
            return false;
          }
          // Handle numbers (including 0, which is a valid value)
          if (typeof value === "number") {
            return !isNaN(value);
          }
          // Handle strings
          if (typeof value === "string") {
            return value.trim() !== "";
          }
          // Handle booleans (both true and false are valid)
          if (typeof value === "boolean") {
            return true;
          }
          // For other types (objects, arrays, etc.), consider them valid if they exist
          return true;
        }
      );

      if (!hasValidData) {
        toast.error(t("Please fill in at least one field."));
        return;
      }

      const payloadToSend = {
        id: item.Id === "" ? 0 : item.Id,
        TableId: 0,
        tabId: tabIdToSend,
        jsonFields: JSON.stringify(updatedData),
      };

      const response = await PatientServices.makeApiCallForDynamicGrid(
        apiData.url,
        apiData.method ?? null,
        payloadToSend
      );
      toast.success(t(response.data.responseMessage));
      loadData(false);
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
          t(
            "Please provide the Director's signature before validating the order."
          )
        );
        return;
      }

      if (actionConfiguration) {
        showLoader();

        if (item.ButtonType === "8") {
          (fileInputRef.current as any).click(); // Trigger file selection
          return false;
        }

        let path = actionConfiguration.URL;
        const method = actionConfiguration.APIMethod;

        path = path.replace(
          "{Id}/{TabId}/{Column}",
          `${item.Id}/${tabIdToSend}/${actionConfiguration.Column}`
        );
        const response = await PatientServices.APICALL(path, method);
        const dataToReplaceWith = response?.data?.data?.[0];

        hideLoader();

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

    if (item.SignaturePreviewConfiguration) {
      const actionConfigurationArray = JSON.parse(
        item.SignaturePreviewConfiguration
      );
      const actionConfiguration = actionConfigurationArray.find(
        (action: any) => column?.columnKey === action.Column
      );

      if (actionConfiguration && item.SignaturePreviewButtontype === 9) {
        setOpenModal(true);
        handleSignaturePreview(column);
      }
    }
  };

  const handleSignaturePreview = async (column: any) => {
    const actionConfigurationArray = JSON.parse(
      item.SignaturePreviewConfiguration
    );
    const actionConfiguration = actionConfigurationArray.find(
      (action: any) => column?.columnKey === action.Column
    );

    console.log(actionConfiguration, item, "actionConfiguration");

    if (actionConfiguration) {
      showLoader();
      let path = actionConfiguration.URL;
      const method = actionConfiguration.APIMethod;

      path = path.replace("{Id}", `${item.Id}`);
      const response = await PatientServices.APICALL(path, method);
      setSignature(response?.data?.data);
      hideLoader();
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
        toast.error(t(`Invalid file type. Allowed types: ${fileExtensions}`));
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
      console.error(t("File upload failed:"), error);
      toast.error(t("File upload failed. Please try again."));
    } finally {
      hideLoader();
    }
  };

  const openFileSelection = (
    event: React.ChangeEvent<HTMLInputElement>,
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
      <TableRow style={{ background: item?.IsNotEditable ? "#ececec" : "" }}>
        {bulkActions?.length || bulkExportActions?.length ? (
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
        ) : null}
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
            {item?.IsNotEditable ? null : (
              <div className="d-flex justify-content-center">
                <StyledDropButtonThreeDots
                  id="demo-positioned-button"
                  aria-controls={openDrop ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={openDrop ? "true" : undefined}
                  onClick={handleClick}
                  className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
                >
                  <i className="bi bi-three-dots-vertical p-0 icon"></i>
                </StyledDropButtonThreeDots>
                <StyledDropMenuMoreAction
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorEl}
                  open={openDrop}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                >
                  {columnActions?.map((action: any) => {
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

                    if (action.buttontype === 9 && !item.IsTakeSignature) {
                      return null;
                    }

                    return eventStatusText === actionText ? null : (
                      <PermissionComponent
                        moduleName={action.moduleName}
                        pageName={action.pageName}
                        permissionIdentifier={action.permissionIdentifier}
                      >
                        <MenuItem
                          onClick={(event: React.MouseEvent<HTMLElement>) => {
                            event.preventDefault();
                            handleActionClick(action, item);
                          }}
                          className="w-auto"
                          sx={{ padding: 0, margin: 0 }}
                        >
                          <div
                            dangerouslySetInnerHTML={{
                              __html: action.actionHtml,
                            }}
                          />
                        </MenuItem>
                      </PermissionComponent>
                    );
                  })}
                </StyledDropMenuMoreAction>
              </div>
            )}
          </TableCell>
        )}
        {columnsHeader?.map((column: any, columnHeaderIndex: number) => {
          if (column?.isShowOnUi && !column?.isExpandData && column.isShow) {
            if (item.rowStatus && !inputFields[columnHeaderIndex].show) {
              return (
                <AddNewInputs
                  key={column?.columnKey + columnHeaderIndex}
                  item={item}
                  column={column}
                  columnHeaderIndex={columnHeaderIndex}
                />
              );
            } else {
              const keyData = item[column?.columnKey];
              // let actionConfiguration: any = null;
              const isItBlobFile =
                keyData && typeof keyData === "string"
                  ? keyData.includes("https://truemedpo.blob.core.windows.net")
                  : false;

              // if (item.ActionConfiguration) {
              // let actionConfigurationArray = JSON.parse(
              //   item.ActionConfiguration
              // );
              // actionConfiguration = actionConfigurationArray.find(
              //   (action: any) => column?.columnKey === action.Column
              // );
              // const allowedExtensions =
              //   actionConfiguration?.JSONRequest?.FileType?.join(",") || "";
              // }

              return (
                <TableCell key={column?.columnKey + columnHeaderIndex}>
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
                  ) : keyData === "" && columnDataActions.length ? (
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
                      return null; // Ensure every map has a fallback return
                    })
                  ) : isJson(keyData) ? (
                    <JsonHandling value={keyData} />
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
                  ) : (
                    <TruncatedCell text={keyData} />
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
              <CollapseTable
                patientId={item.PatientId}
                expandableColumnsHeader={expandableColumnsHeader}
              />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <SignatureModal
        item={item}
        loadData={loadData}
        signature={signature}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setSignature={setSignature}
        actionForModal={actionForModal}
      />
    </>
  );
}

export default Row;

const containsHTMLUsingDOMParser = (str: string): boolean => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(str, "text/html");

  return Array.from(doc.body.childNodes).some((node) => node.nodeType === 1);
};

export const JsonHandling: React.FC<{ value: string }> = ({ value }) => {
  if (!value) return <></>;

  try {
    const parsedJsonValue = JSON.parse(value);

    if (Array.isArray(parsedJsonValue)) {
      // Handle JSON that is an array at the root level
      return (
        <ul>
          {parsedJsonValue.map((item, index) => (
            <li key={index}>{JSON.stringify(item)}</li>
          ))}
        </ul>
      );
    } else if (
      typeof parsedJsonValue === "object" &&
      parsedJsonValue !== null
    ) {
      // Handle JSON objects at the root level
      return <pre>{JSON.stringify(parsedJsonValue, null, 2)}</pre>;
    }

    return <div>Invalid JSON structure</div>;
  } catch (error) {
    return <div>Invalid JSON: {JSON.stringify(error)}</div>;
  }
};
