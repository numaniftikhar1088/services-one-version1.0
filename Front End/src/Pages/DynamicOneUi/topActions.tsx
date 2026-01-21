import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { useLoader } from "Shared/Loader/LoaderContext";

interface FileData {
  tabID: number;
  contents: string;
}

function TopButtonActions({
  buttons,
  setRows,
  rows,
  setApiData,
  inputFields,
  tabID,
  tableId,
  loadData,
}: any) {
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileAction, setFileAction] = useState<any>(null);
  const { showLoader, hideLoader } = useLoader();

  const { t } = useLang();

  const handleTopActionButtonClick = (action: any) => {
    if (action.buttontype === 3) {
      const isAnyRowActive = rows.some((row: any) => row.rowStatus === true);

      if (isAnyRowActive) return;

      setApiData({
        url: action.actionUrl,
        body: action.jsonBody,
        method: action.methodType,
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
    } else if (action.buttontype === 4) {
      if (action.actionHtml.includes('id="excel-file"')) {
        setFileAction(action);
        const fileInput: any = document.getElementById("excel-file");
        if (fileInput) fileInput.click();
      } else {
        const payload = {
          tabID,
          tableID: tableId,
        };
        handleActionClick(action, payload);
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
        tableID: tableId,
        contents: base64String,
        fileName: file?.name,
      };
      await handleActionClick(fileAction, filedata);
      handleFileRemove();
    };
    reader.readAsArrayBuffer(file);
  };

  const handleActionClick = async (
    action: any,
    payload: FileData | undefined | any
  ) => {
    if (action.actionUrl) {
      try {
        showLoader();
        const path: any = (action.actionUrl as string).replace(
          "{TabId}",
          tabID
        );
        const res = await PatientServices.makeApiCallForDynamicGrid(
          path,
          action.methodType ?? null,
          payload
        );

        if (res.data.statusCode === 404) {
          toast.info(t(res.data.message || res.data.responseMessage));
        } else if (res.data.statusCode === 200) {
          toast.success(t(res.data.message || res.data.responseMessage));
        } else if (res.data.statusCode === 400) {
          toast.error(t(res.data.message || res.data.responseMessage));
        } else {
          toast.error(t(res.data.message || res.data.responseMessage));
        }

        loadData(false);

        const _fileContent = res.data.data.fileContents;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${_fileContent}`;
        downloadLink.click();
      } catch (error) {
        console.error("Error downloading template:", error);
      } finally {
        hideLoader();
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
            pageName={action.pageName}
            permissionIdentifier={action.permissionIdentifier}
            key={
              action.permissionIdentifier || action.moduleName + action.pageName
            }
          >
            <button
              style={{ backgroundColor: "transparent", border: "none" }}
              onClick={() => handleTopActionButtonClick(action)}
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
            <span>{selectedFile.name}</span>
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

export default TopButtonActions;
