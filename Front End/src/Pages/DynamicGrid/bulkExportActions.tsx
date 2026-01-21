import { MenuItem } from "@mui/material";
import { saveAs } from "file-saver";
import React from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import ArrowBottomIcon from "../../Shared/SVG/ArrowBottomIcon";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../Utils/Style/Dropdownstyle";
import { useDynamicGrid } from "./Context/useDynamicGrid";
import { useLoader } from "Shared/Loader/LoaderContext";
import useLang from "Shared/hooks/useLanguage";

export interface ActionConfig {
  actionName: string;
  actionUrl: string;
  actionHtml: string;
  buttontype: number;
  pageName: string;
  moduleName: string;
  permissionIdentifier: string;
  methodType: "GET" | "POST" | "PUT" | "DELETE" | string;
  jsonBody: string;
  isTakeReason: boolean;
  columnName: string;
  redirectPageId: number | null;
  validationColumn: string | null;
}

function BulkExportActions({ filters }: { filters: any }) {
  const { t } = useLang();
  const { showLoader, hideLoader } = useLoader();

  const { setBulkIds, bulkExportActions, bulkIds, tabIdToSend } =
    useDynamicGrid();

  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
  });

  const openDrop = Boolean(anchorEl.dropdown1);

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleActionClick = async (action: ActionConfig) => {
    try {
      if (action.actionUrl && action.buttontype === 2) {
        if (
          action.actionName === "Export Selected Records" &&
          bulkIds.length === 0
        ) {
          toast.error(t("Select at-least one record."));
          return;
        }

        showLoader();

        const payload = {
          tabId: tabIdToSend,
          tableId: 0,
          selectedRow:
            action.actionName === "Export All Records" ? [] : bulkIds,
        };

        const response = await PatientServices.makeApiCallForDynamicGrid(
          action.actionUrl,
          action.methodType ?? null,
          { ...payload, filters }
        );

        if (response?.data?.statusCode === 200) {
          toast.success(t(response?.data?.message));
          base64ToExcel(
            response?.data.data.fileContents,
            response?.data.data.fileDownloadName
          );
        } else {
          toast.error(t(response?.data?.message));
        }

        setBulkIds([]);
      }
    } catch (error) {
      console.error("Error in handleActionClick:", error);
    } finally {
      hideLoader();
    }
  };

  const exportAllRecords = t("Export Selected Records");
  const exportAllrecord = t("Export All Records");

  return (
    <div>
      <StyledDropButton
        id="demo-positioned-button2"
        aria-controls={openDrop ? "demo-positioned-menu2" : undefined}
        aria-haspopup="true"
        aria-expanded={openDrop ? "true" : undefined}
        onClick={(event) => handleClick(event, "dropdown1")}
        className="btn btn-excle btn-sm"
      >
        <i
          style={{
            color: "white",
            fontSize: "20px",
            paddingLeft: "2px",
          }}
          className="fa"
        >
          &#xf1c3;
        </i>
        <span className="svg-icon svg-icon-5 m-0">
          <ArrowBottomIcon />
        </span>
      </StyledDropButton>
      <StyledDropMenu
        id="demo-positioned-menu1"
        aria-labelledby="demo-positioned-button1"
        anchorEl={anchorEl.dropdown1}
        open={Boolean(anchorEl.dropdown1)}
        onClose={() => handleCloseDropDown("dropdown1")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
      >
        <div className="row m-0 p-0">
          <div className="px-0">
            {bulkExportActions?.map((action: any) => (
              <PermissionComponent
                moduleName={action.moduleName}
                pageName={action.pageName}
                permissionIdentifier={action.permissionIdentifier}
                key={
                  action.permissionIdentifier ||
                  action.moduleName + action.pageName
                }
              >
                <MenuItem
                  className="w-auto"
                  onClick={() => {
                    handleActionClick(action);
                    handleCloseDropDown("dropdown1");
                  }}
                >
                  <div
                    dangerouslySetInnerHTML={{
                      __html: action.actionHtml
                        .replace("Export Selected Records", exportAllRecords)
                        .replace("Export All Records", exportAllrecord),
                    }}
                  />
                </MenuItem>
              </PermissionComponent>
            ))}
          </div>
        </div>
      </StyledDropMenu>
    </div>
  );
}

export default BulkExportActions;

export const base64ToExcel = (base64: string, filename: string) => {
  const decodedBase64 = window.atob(base64);
  const workbook = XLSX.read(decodedBase64, { type: "binary" });
  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });
  const excelBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  saveAs(excelBlob, `${filename}.xlsx`);
};
