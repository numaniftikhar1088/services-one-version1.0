import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { formValuesForPatient } from "Utils/Auth";
import { isJson } from "Utils/Common/Requisition";
import useLang from "Shared/hooks/useLanguage";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";

export interface FileData {
  tabID: number;
  contents: string;
}

function LayoutButtons({
  buttons,
  setRows,
  rows,
  setApiData,
  inputFields,
  tabID,
  loadData,
  fetchDataSequentially,
  savePatientInfo,
  previewExists,
  setShowPreviewPage,
  Inputs,
  setPreviewData,
  isSaving,
}: any) {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileAction, setFileAction] = useState<any>(null);
  const navigate = useNavigate();

  const { t } = useLang();
  const handleTopActionButtonClick = async (action: any) => {
    const {
      jsonBody,
      actionUrl,
      actionHtml,
      actionName,
      methodType,
      buttontype,
      validationColumn,
    } = action;

    const parsedValidationColumns = isJson(validationColumn)
      ? JSON.parse(validationColumn)
      : validationColumn;

    if (actionUrl && buttontype === 1) {
      let path: any = actionUrl;

      if (actionUrl.includes('/dynamic-grid')) {
        navigate(`${path}/${window.btoa(action.redirectPageId)}`, {
          replace: true,
        });
        return false;
      }
      navigate(path, {
        replace: true,
      });
    } else if (buttontype === 3) {
      const isAnyRowActive = rows.some((row: any) => row.rowStatus === true);

      if (isAnyRowActive) {
        console.log(
          "Another row is already active. Cannot add or activate another row."
        );
        return;
      }

      setApiData({
        url: actionUrl,
        body: jsonBody,
        method: methodType,
      });

      const result = inputFields.reduce((acc: any, item: any) => {
        if (item && item.name) {
          acc[item.name] = "";
        }
        return acc;
      }, {});

      const rowKeys = Object.keys(result);
      const emptyValuesObject = rowKeys.reduce((acc: any, key) => {
        acc[key] = "";
        return acc;
      }, {});

      const emptyRowExists = rows.some(
        (row: any) =>
          row.rowStatus === true && rowKeys.every((key) => row[key] === "")
      );

      if (!emptyRowExists) {
        setRows((prevRows: any) => [
          { rowStatus: true, ...emptyValuesObject },
          ...prevRows,
        ]);
      }
    } else if (buttontype === 4) {
      if (actionHtml.includes('id="excel-file"')) {
        setFileAction(action);
        const fileInput: any = document.getElementById("excel-file");
        if (fileInput) fileInput.click();
      } else {
        handleActionClick(action, undefined);
      }
    } else if (buttontype === 6) {
      await PatientServices.makeApiCallForDynamicGrid(actionUrl, methodType);
      fetchDataSequentially();
    } else if (buttontype === 2) {
      const apiCall = async (payload: any) => {
        return await PatientServices.makeApiCallForDynamicGrid(
          action.actionUrl,
          action.methodType,
          { actionName: action.actionName, ...payload }
        );
      };

      if (actionName === "Continue Button") {
        if (previewExists) {
          setShowPreviewPage({
            exists: true,
            showPreviewPage: true,
          });

          const formDataForApi = formValuesForPatient(Inputs);
          const { commonSections } = formDataForApi;
          setPreviewData(commonSections);
        } else {
          savePatientInfo(parsedValidationColumns, apiCall);
        }
      } else {
        savePatientInfo(parsedValidationColumns, apiCall);
      }
    }
  };

  useEffect(() => {
    const fileInput: any = document.getElementById("excel-file");

    const handleFileChange = (event: any) => {
      const file = event.target.files[0];
      if (file && fileAction) {
        handleFileUpload(file);
      }
    };

    if (fileInput) {
      fileInput.addEventListener("change", handleFileChange);
    }

    return () => {
      if (fileInput) {
        fileInput.removeEventListener("change", handleFileChange);
      }
    };
  }, [fileAction]);

  const handleFileRemove = () => {
    setSelectedFile(null);
    const fileInput: any = document.getElementById("excel-file");
    if (fileInput) fileInput.value = "";
  };

  function byteArrayToBase64(byteArray: Uint8Array) {
    let binaryString = "";
    for (let i = 0; i < byteArray.length; i++) {
      binaryString += String.fromCharCode(byteArray[i]);
    }

    return btoa(binaryString);
  }

  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      const base64String = byteArrayToBase64(byteArray);

      const filedata: FileData | any = {
        tabID,
        contents: base64String,
        fileName: file?.name,
      };
      await handleActionClick(fileAction, filedata);
      loadData(false);
      handleFileRemove();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleActionClick = async (
    action: any,
    payload: FileData | undefined
  ) => {
    if (action.actionUrl) {
      try {
        let path: any = (action.actionUrl as string).replace("{TabId}", tabID);
        const res = await PatientServices.makeApiCallForDynamicGrid(
          path,
          action.methodType ?? null,
          payload
        );

        if (res.data.statusCode === 0) {
          toast.info(res.data.message);
        } else if (res.data.statusCode === 400) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);
        }
        const _fileContent = res.data.data.fileContents;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${_fileContent}`;
        downloadLink.click();
      } catch (error) {
        console.error("Error downloading template:", error);
      }
    } else {
      console.error("actionUrl is undefined in action:", action);
    }
  };

  return (
    <div className="row m-0 p-0">
      <div>
        {buttons?.map((action: any) => (
          <PermissionComponent
            moduleName={action.moduleName}
            key={action.pageName}
            pageName={action.pageName}
            permissionIdentifier={action.permissionIdentifier}
          >
            <button
              style={{ 
                backgroundColor: "transparent", 
                border: "none",
                opacity: isSaving ? 0.6 : 1,
                cursor: isSaving ? "not-allowed" : "pointer"
              }}
              onClick={() => handleTopActionButtonClick(action)}
              disabled={isSaving}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: action.actionHtml,
                }}
              />
            </button>
          </PermissionComponent>
        ))}

        {selectedFile && (
          <div className="mt-2">
            <span>{t(selectedFile.name)}</span>
            <button
              type="button"
              onClick={handleFileRemove}
              style={{
                backgroundColor: "transparent",
                border: "none",
                color: "red",
                cursor: "pointer",
                marginLeft: "10px",
              }}
              aria-label="Remove file"
            >
              &times;
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LayoutButtons;
