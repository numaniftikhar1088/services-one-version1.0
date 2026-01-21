import { Tooltip } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import PanelReportingRulesService from "../../../../Services/InfectiousDisease/PanelReportingRulesService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import BreadCrumbs from "../../../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";

interface FileData {
  fileName: string;
  contents: string;
}
interface NavProps {
  setRefresh: React.Dispatch<React.SetStateAction<boolean>>;
  refresh: boolean;
}
export const Nav: React.FC<NavProps> = ({ setRefresh, refresh }) => {
  const { t } = useLang();
  const DownloadTemplate = () => {
    PanelReportingRulesService.DownloadTemplate()
      .then((res: any) => {
        const fileContent = res.data;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = "ID Compendium Data Template.xlsx";
        downloadLink.click();
      })
      .catch((error: AxiosError) => {
        console.error("Error downloading template:", error);
      });
  };
  const [fileContents, setFileContents] = useState<string>("");
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const arrayBuffer = reader.result as ArrayBuffer;
        const byteArray = new Uint8Array(arrayBuffer);
        const base64String = btoa(String.fromCharCode(...byteArray));
        setFileContents(base64String);

        const filedata: FileData = {
          fileName: "",
          contents: base64String,
        };

        PanelReportingRulesService.BulkCompandiumUpload(filedata)
          .then((res: AxiosResponse) => {
            if (res?.data?.httpStatusCode === 200) {
              toast.success("File Uploaded Successfully");
              setRefresh(!refresh);
            } else {
              toast.error(res?.data?.message);
            }
            event.target.value = "";
          })
          .catch(() => {
            event.target.value = "";
          });
      };

      reader.readAsArrayBuffer(file);
    }
  };

  return (
    <div className="app-toolbar py-2 py-lg-3">
      <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
        <BreadCrumbs />
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <PermissionComponent
            moduleName="ID LIS"
            pageName="Compendium Data"
            permissionIdentifier="Download"
          >
            <Tooltip title={t("Download")} arrow placement="top">
              <button
                id="IDCompendiumDataDownload"
                className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                onClick={DownloadTemplate}
              >
                <i className="bi bi-download"></i>
              </button>
            </Tooltip>
          </PermissionComponent>
          <PermissionComponent
            moduleName="ID LIS"
            pageName="Compendium Data"
            permissionIdentifier="Upload"
          >
            <Tooltip title={t("Upload")} arrow placement="top">
              <button
                id="IDCompendiumDataUpload"
                className="btn btn-icon btn-sm fw-bold btn-warning "
                onClick={() =>
                  document.getElementById("IDCompendiumDataexcel_file")?.click()
                }
              >
                <i className="bi bi-cloud-upload"></i>
              </button>
            </Tooltip>
          </PermissionComponent>
          <input
            type="file"
            id="IDCompendiumDataexcel_file"
            accept=".xlsx, .xls"
            onChange={handleFileUpload}
            style={{ display: "none" }}
          />
        </div>
      </div>
    </div>
  );
};
