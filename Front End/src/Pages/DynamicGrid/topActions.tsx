import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { useDynamicGrid } from "./Context/useDynamicGrid";
import { useLoader } from "Shared/Loader/LoaderContext";
import useLang from "Shared/hooks/useLanguage";

export interface FileData {
  tabID: number;
  contents: string;
}

export function TopButtonActions({
  rows,
  loadData,
  loadTabsForDynamicGrid,
}: any) {
  const { showLoader, hideLoader } = useLoader();

  const { setRows, setApiData, tabIdToSend, inputFields, topButtonActions } =
    useDynamicGrid();

  const { t } = useLang();
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [fileAction, setFileAction] = useState<any>(null);
  const navigate = useNavigate();

  const handleTopActionButtonClick = async (action: any) => {
    if (action.actionUrl && action.buttontype === 1) {
      const path: any = action.actionUrl;
      navigate(`${path}/${window.btoa(action.redirectPageId)}`, {
        replace: true,
      });
    } else if (action.buttontype === 3) {
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
        handleActionClick(action, undefined);
      }
    } else if (action.buttontype === 6) {
      showLoader();
      const response = await PatientServices.makeApiCallForDynamicGrid(
        action.actionUrl,
        action.methodType
      );

      if (response?.data?.statusCode === 200) {
        toast.success(
          t(response?.data?.message || response?.data?.responseMessage)
        );
      } else {
        toast.error(
          t(response?.data?.message || response?.data?.responseMessage)
        );
      }

      hideLoader();
      await loadTabsForDynamicGrid();
      loadData(false);
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

  const handleFileUpload = (file: any) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      const byteArray = new Uint8Array(arrayBuffer);
      const base64String = byteArrayToBase64(byteArray);

      const filedata: FileData | any = {
        tabID: tabIdToSend,
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
        const path: any = (action.actionUrl as string).replace(
          "{TabId}",
          tabIdToSend
        );
        const res = await PatientServices.makeApiCallForDynamicGrid(
          path,
          action.methodType ?? null,
          payload
        );

        if (res.data.statusCode === 0) {
          toast.info(t(res.data.message || res.data.responseMessage));
        } else if (res.data.statusCode === 200) {
          toast.success(res.data.message);
        } else if (res.data.statusCode === 400) {
          toast.error(t(res.data.message || res.data.responseMessage));
        } else {
          toast.error(t(res.data.message || res.data.responseMessage));
        }
        const _fileContent = res.data.data.fileContents;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${_fileContent}`;
        downloadLink.click();
      } catch (error) {
        console.error(t("Error downloading template:"), error);
      }
    } else {
      console.error(t("actionUrl is undefined in action:"), action);
    }
  };

  return (
    <div className="row m-0 p-0">
      <div>
        {topButtonActions?.map((action: any) => (
          <PermissionComponent
            moduleName={action.moduleName}
            key={action.pageName}
            pageName={action.pageName}
            permissionIdentifier={action.permissionIdentifier}
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

export function byteArrayToBase64(byteArray: Uint8Array) {
  let binaryString = "";
  for (let i = 0; i < byteArray.length; i++) {
    binaryString += String.fromCharCode(byteArray[i]);
  }

  return btoa(binaryString);
}
