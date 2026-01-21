import { Box, Collapse, MenuItem, TableCell, TableRow } from "@mui/material";
import moment from "moment";
import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import PatientServices from "../../Services/PatientServices/PatientServices";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, RemoveICon } from "../../Shared/Icons";
import { setValueIntoSessionStorage } from "../../Utils/Common/CommonMethods";
import PatientReqOrder from "./PatientReqOrder";
import useLang from "Shared/hooks/useLanguage";

function Row({
  item,
  columnsHeader,
  columnActions,
  expandableColumnsHeader,
  loadData,
  setRecordToDelete,
  setShow1,
  bulkActions,
}: any) {
  const navigate = useNavigate();
  const { t } = useLang();
  const [open, setOpen] = useState(false);

  const handleActionClick = async (action: any, patient: any) => {
    if (action.actionUrl && action.buttontype === 1) {
      let path: any = action.actionUrl.split("{{")[0];
      if (path === "/patient/") {
        setValueIntoSessionStorage("pageId", 19);
      }

      console.log(path, "path");
      // Handle Patient History navigation - opens in new tab
      if (path.includes("patient-insurance-history")) {
        window.open(`${path}/${btoa(patient.PatientId)}`, '_blank');
        return;
      }
      navigate(`${path}${btoa(patient.PatientId)}`);
      if (path === "/requisition") {
        navigate(path, {
          state: { patientId: patient.PatientId, requisitionId: patient.RequisitionId },
        });
      }
    } else if (action.actionUrl && action.buttontype === 2) {
      if (action.isTakeReason) {
        setShow1(true);
        setRecordToDelete(() => ({
          action,
          patientId: patient.PatientId,
        }));
      } else {
        await PatientServices.makeApiCall(
          action.actionUrl,
          patient.PatientId,
          action.methodType ?? null
        );
        loadData(true);
      }
    }
  };

  const isExpandable = () =>
    columnsHeader?.some((column: any) => column.isExpandData);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  console.log(columnActions, "item");

  const View = t("View");
  const Edit = t("Edit");
  const Delete = t("Delete");
  const CreateRequisition = t("Create Requisition");
  const PatientHistory = t("Patient History");

  return (
    <>
      <TableRow>
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
        {!columnActions?.length ? null : (
          <TableCell className="text-center">
            <StyledDropButtonThreeDots
              id={`PatientDemoGraphic3Dots_${item.PatientId}`}
              aria-controls={openDrop ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop ? "true" : undefined}
              onClick={handleClick}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
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
              {columnActions.map((action: any, index: number) => (
                <PermissionComponent
                  moduleName="Patient"
                  pageName={action.pageName}
                  permissionIdentifier={action.permissionIdentifier}
                >
                  <MenuItem className="p-0">
                    <a
                      id={`PatientDemoGraphic_${action.actionName}`}
                      className="w-auto p-0 text-dark"
                      onClick={(event: any) => {
                        event.preventDefault();
                        handleClose();
                        handleActionClick(action, item);
                      }}
                    >
                      <div
                        dangerouslySetInnerHTML={{
                          __html: action.actionHtml
                            .replace("View", View)
                            .replace("Edit", Edit)
                            .replace("Delete", Delete)
                            .replace("Create Requisition", CreateRequisition)
                            .replace("Patient History", PatientHistory),
                        }}
                      />
                    </a>
                  </MenuItem>
                </PermissionComponent>
              ))}
            </StyledDropMenuMoreAction>
          </TableCell>
        )}
        {columnsHeader?.map((column: any) =>
          column?.isShowOnUi && !column?.isExpandData && column.isShow ? (
            <TableCell
              id={`PatientDemoGraphic_${column?.columnKey}${item?.PatientId}`}
            >
              {column?.columnKey === "dateOfBirth"
                ? moment(item[column?.columnKey]).format("MM-DD-YYYY")
                : item[column?.columnKey]
                  ? item[column?.columnKey]
                  : null}
            </TableCell>
          ) : null
        )}
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
