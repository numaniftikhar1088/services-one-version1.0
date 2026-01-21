import { MenuItem } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useLang from "./../../../Shared/hooks/useLanguage";
import PatientServices from "Services/PatientServices/PatientServices";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import ArrowBottomIcon from "Shared/SVG/ArrowBottomIcon";
import { StyledDropButton, StyledDropMenu } from "Utils/Style/Dropdownstyle";
import { useLoader } from "Shared/Loader/LoaderContext";

function BulkActions({
  bulkActions,
  bulkIds,
  loadData,
  setBulkIds,
  setRows,
  setIsBulkEdit,
  inputFields,
  rows,
  setInputFields,
  setApiData,
}: any) {
  const { showLoader, hideLoader } = useLoader();
  const { t } = useLang();
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
  });

  const openDrop = Boolean(anchorEl.dropdown1);
  const navigate = useNavigate();

  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleCloseDropDown = (dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const handleActionClick = async (action: any, data: any) => {
    if (action.actionUrl && action.buttontype === 1) {
      const path: any = action.actionUrl.split("/")[0];
      navigate(`${path}/${btoa(data.Id)}`, { replace: true });
    } else if (action.actionUrl && action.buttontype === 2) {
      if (action.actionName === "Bulk Edit") {
        setIsBulkEdit(true);
        setApiData({
          url: action.actionUrl,
          body: action.jsonBody,
          method: action.methodType,
        });
        // const isAnyRowActive = rows.some((row: any) => row.rowStatus === true);

        // if (isAnyRowActive) {
        //   console.log(
        //     "Another row is already active. Cannot add or activate another row."
        //   );
        //   return;
        // }

        setInputFields(
          inputFields.map((field: any) => ({
            ...field,
            show: !field?.isIndividualEditable,
          }))
        );
        const updatedRows = rows.map((row: any) => {
          if (bulkIds.includes(row.Id)) {
            return { ...row, rowStatus: true };
          }
          return row;
        });
        // setApiData({
        //   url: action.actionUrl,
        //   body: action.jsonBody,
        //   method: action.methodType,
        // });

        setRows(updatedRows);
        return;
      } else {
        showLoader();
        const payload = {
          TableId: 0,
          actionName: action.actionName,
          ids: bulkIds,
        };
        const response = await PatientServices.makeApiCallForDynamicGrid(
          action.actionUrl,
          action.methodType ?? null,
          payload
        );
        if (response.data.statusCode === 404) {
          toast.error(response.data.message);
        } else if (response.data.statusCode === 200) {
          loadData(false);
        }
        setBulkIds([]);
        hideLoader();
      }
    }
  };

  return (
    <div>
      <StyledDropButton
        id="demo-positioned-button1"
        aria-controls={openDrop ? "demo-positioned-menu1" : undefined}
        aria-haspopup="true"
        aria-expanded={openDrop ? "true" : undefined}
        onClick={(event) => handleClick(event, "dropdown1")}
        className="btn btn-info btn-sm"
      >
        {t("bulk action")}
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
          <div className="col-12 col-sm-6 px-0 w-125px">
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
                    handleActionClick(action, "");
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

export default BulkActions;
