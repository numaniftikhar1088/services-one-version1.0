import { Tooltip } from "@mui/material";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PanelReportingRulesService from "../../../Services/InfectiousDisease/PanelReportingRulesService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import useLang from "Shared/hooks/useLanguage";
interface FileData {
  fileName: string;
  contents: string;
}

export const Nav = ({ tabIndex, LoadPanelMappingData }: any) => {
  const { t } = useLang();

  const [fileContents, setFileContents] = useState<string>("");
  const [openalert, setOpenAlert] = React.useState(false);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const [message, ErrorMessage] = useState("");

  console.log(tabIndex, "tabIndex");

  const DownloadTemplate = () => {
    PanelReportingRulesService.ToxCompendiumDownloadTemplate()
      .then((res: any) => {
        const fileContent = res?.data?.data?.fileContents;
        const downloadLink = document.createElement("a");
        downloadLink.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${fileContent}`;
        downloadLink.download = "Tox Compendium Data Template.xlsx";
        downloadLink.click();
      })
      .catch((error: AxiosError) => {
        console.error("Error downloading template:", error);
      });
  };
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
        PanelReportingRulesService.ToxCompendiumTemplateUpload(filedata).then(
          (res: AxiosResponse) => {
            console.log(res, "tox upload");
            if (res?.data?.httpStatusCode === 200) {
              toast.success(t(res.data.message));
              LoadPanelMappingData(true);
              event.target.value = "";
            }
            if (res?.data?.httpStatusCode === 404) {
              ErrorMessage(t(res.data.message));
              setOpenAlert(true);
              event.target.value = "";
            }
          }
        );
      };
      reader.readAsArrayBuffer(file);
    }
  };
  function PrintStringByColonNewline({ inputString }: any) {
    if (!inputString) return null;
    const splitStrings = inputString.split("\n");

    const sections = splitStrings.map((section: any, index: any) => {
      if (index === 0) {
        return (
          <React.Fragment key={index}>
            <span style={{ fontWeight: "bold" }}>{section}</span>
            <br /> <br />
          </React.Fragment>
        );
      } else if (index !== splitStrings.length - 1) {
        return (
          <div
            key={index}
            style={{
              border: "2px solid #FF0000",
              padding: "5px",
              marginBottom: "10px",
            }}
          >
            <ul>
              <li>{section}</li>
            </ul>
          </div>
        );
      } else {
        return null;
      }
    });

    return <div>{sections}</div>;
  }

  return (
    <>
      <div className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
          {tabIndex !== 0 ? null : (
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Compendium Data"
                permissionIdentifier="Download"
              >
                <Tooltip title={t("Download")} arrow placement="top">
                  <button
                    id={`compendiumDataDownload`}
                    className="btn btn-icon btn-sm fw-bold btn-upload btn-icon-light"
                    onClick={DownloadTemplate}
                  >
                    <i className="bi bi-download"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>

              <PermissionComponent
                moduleName="TOX LIS"
                pageName="Compendium Data"
                permissionIdentifier="Upload"
              >
                <Tooltip title={t("Upload")} arrow placement="top">
                  <button
                    id={`compendiumDataUpload`}
                    className="btn btn-icon btn-sm fw-bold btn-warning "
                    onClick={() =>
                      document
                        .getElementById(
                          "compendiumDataPanelMapingRecordsExcel_File"
                        )
                        ?.click()
                    }
                  >
                    <i className="bi bi-cloud-upload"></i>
                  </button>
                </Tooltip>
              </PermissionComponent>
              <input
                id={`compendiumDataPanelMapingRecordsExcel_File`}
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                style={{ display: "none" }}
              />
            </div>
          )}
        </div>
      </div>
      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
        className="modal-lg"
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Upload Error List")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          <PrintStringByColonNewline inputString={message} />
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`compendiumDataModalUploadClose`}
            type="button"
            className="btn btn-sm btn-danger py-2"
            onClick={handleCloseAlert}
          >
            {t("Close")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};
