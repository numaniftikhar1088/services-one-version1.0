import { MenuItem } from "@mui/material";
import { saveAs } from "file-saver";
import { ActionConfig } from "Pages/DynamicGrid/bulkExportActions";
import React from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import PatientServices from "Services/PatientServices/PatientServices";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { useLoader } from "Shared/Loader/LoaderContext";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";

function BulkExportActions({ bulkActions, bulkIds, setBulkIds, tabId }: any) {
  const { t } = useLang();

  const { showLoader, hideLoader } = useLoader();
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
          tabId,
          tableId: 0,
          selectedRow: bulkIds,
        };

        const response = await PatientServices.makeApiCallForDynamicGrid(
          action.actionUrl,
          action.methodType ?? null,
          payload
        );

        if (response?.data?.httpStatusCode === 200) {
          toast.success(response?.data?.message);
          base64ToExcel(
            response?.data.data.fileContents,
            response?.data.data.fileDownloadName
          );
        } else {
          toast.error(response?.data?.message);
        }

        setBulkIds([]);
      }
    } catch (error: any) {
      console.error("Error in handleActionClick:", error);
    } finally {
      hideLoader();
    }
  };

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
            {bulkActions?.map((action: any) => (
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
                      __html: action.actionHtml,
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

const base64ToExcel = (base64: string, filename: string) => {
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
