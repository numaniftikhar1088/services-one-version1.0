import { TableCell, TableRow } from "@mui/material";
import { Dispatch, SetStateAction, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import Select from "react-select";
import { toast } from "react-toastify";
import { SearchQuery } from ".";
import RequisitionType from "../../Services/Requisition/RequisitionTypeService";
import { CrossIcon, DoneIcon } from "../../Shared/Icons";
import {
  reactSelectSMStyle,
  reactSelectStyle,
  styles,
} from "../../Utils/Common";
import LookupsFunctions from "./LookupsFunctions";
import skipSvg from "./Skip.svg";
import includeSvg from "./include.svg";
import useLang from "Shared/hooks/useLanguage";
import { validateFields } from "../LIS/Toxicology/CommonFunctions";
import { StringRecord } from "../../Shared/Type";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";

interface WorkFlowStatusIProps {
  row: any;
  rows: any;
  setRows: any;
  lookups: any;
  index: number;
  setSearchQuery: any;
  getAllWorkflowStatus: (reset?: boolean) => void;
  searchQuery: SearchQuery;
  initialSearchQuery: SearchQuery;
  setIsAddButtonDisabled: Dispatch<SetStateAction<boolean>>;
  queryDisplayTagNames: StringRecord;
}
function Row(props: WorkFlowStatusIProps) {
  const {
    row,
    rows,
    index,
    lookups,
    setRows,
    searchQuery,
    setSearchQuery,
    initialSearchQuery,
    getAllWorkflowStatus,
    setIsAddButtonDisabled,
    queryDisplayTagNames,
  } = props;

  const { t } = useLang();

  const [actionButtonLoading, setActionButtonLoading] = useState(false);
  const { ChangeWorkflowStatus, actionPerformedStaticValues } =
    LookupsFunctions();

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const saveWorkFlowStatus = async () => {
    const { labId, reqTypeId, portalTypeId, currentWorkFlowId } = row;
    const { isValid, invalidField } = validateFields({
      labName: labId,
      reqTypeName: reqTypeId,
      portalTypeName: portalTypeId,
      currentWorkFlowName: currentWorkFlowId,
    });

    if (isValid) {
      let response = await RequisitionType.saveWorkFlowStatus(
        row?.rowStatus ? row : searchQuery
      );
      if (response?.data?.httpStatusCode === 200) {
        setSearchQuery(initialSearchQuery);
        toast.success(t(response?.data?.message));
        setIsAddButtonDisabled(false);
        getAllWorkflowStatus(true);
      } else if (response?.data?.httpStatusCode == 400) {
        toast.error(response?.data?.error);
        getAllWorkflowStatus(true);
        setIsAddButtonDisabled(false);
      }
    } else {
      const errorMessage = invalidField
        ? t(`Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`)
        : t("Invalid field found");
      toast.error(t(errorMessage));
    }
  };
  const WorkflowStatusChange = async () => {
    try {
      setActionButtonLoading(true);
      await ChangeWorkflowStatus({
        workflowStatusId: row?.id,
      });
      await getAllWorkflowStatus();
    } catch (error) {
      console.error(t("An error occurred:"), error);
      // You can add additional error handling logic here, such as showing a toast notification.
    } finally {
      setActionButtonLoading(false);
    }
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell className="text-center">
        <div className="d-flex justify-content-center">
          {row.rowStatus ? (
            <>
              <div className="gap-2 d-flex">
                <button
                  id={`WorkflowStatusSave`}
                  onClick={() => saveWorkFlowStatus()}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`WorkflowStatusCancel`}
                  onClick={() => {
                    if (row.id != 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                    } else {
                      let newArray = [...rows];
                      newArray.splice(index, 1);
                      setRows(newArray);
                      setIsAddButtonDisabled(false);
                    }
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="rotatebtnn">
              <DropdownButton
                className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                key="end"
                id={`WorkflowStatus3Dots_${row.id}`}
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                <PermissionComponent
                  moduleName="Setup"
                  pageName="Workflow Status"
                  permissionIdentifier="Edit"
                >
                  <Dropdown.Item
                    id={`WorkflowStatusEdit`}
                    className="w-auto"
                    eventKey="2"
                    onClick={() => getValues(row, "Edit")}
                  >
                    <i className={"fa fa-edit text-primary mr-2"}></i>
                    {t("Edit")}
                  </Dropdown.Item>
                </PermissionComponent>
              </DropdownButton>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell id={`WorkflowStatusLabName_${row.id}`}>
        {row.rowStatus ? (
          <div className="required d-flex">
            <div className="w-100">
              <Select
                inputId={`WorkflowStatusLabName`}
                placeholder={t("Select a Lab")}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={lookups.labLookup}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                name="labId"
                onChange={(event: any) =>
                  handleChange("labId", event.value, row?.id)
                }
                value={lookups.labLookup.filter(function (option: any) {
                  return option.value === row.labId;
                })}
                isDisabled={row.id == 0 ? false : true}
              />
            </div>
          </div>
        ) : (
          <span>{row.labName}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusRequisitionType_${row.id}`}>
        {row.rowStatus ? (
          <div className="required d-flex">
            <div className="w-100">
              <Select
                inputId={`WorkflowStatusRequisitionType`}
                placeholder={t("Select Requisition Type")}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={lookups.requisitionType}
                name="reqTypeId"
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                onChange={(event: any) =>
                  handleChange("reqTypeId", event.value, row?.id)
                }
                value={lookups.requisitionType.filter(function (option: any) {
                  return option.value === row.reqTypeId;
                })}
                isDisabled={row.id == 0 ? false : true}
              />
            </div>
          </div>
        ) : (
          <span>{row.reqTypeName}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusPortelType_${row.id}`}>
        {row.rowStatus ? (
          <div className="required d-flex">
            <div className="w-100">
              <Select
                id={`WorkflowStatusPortelType`}
                placeholder={t("Portal Type")}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={lookups.portalType}
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                name="portalTypeId"
                onChange={(event: any) =>
                  handleChange("portalTypeId", event.value, row?.id)
                }
                value={lookups.portalType.filter(function (option: any) {
                  return option.value === row.portalTypeId;
                })}
                isDisabled={row.id == 0 ? false : true}
              />
            </div>
          </div>
        ) : (
          <span>{row.portalTypeName}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusSelectStatus_${row.id}`}>
        {row.rowStatus ? (
          <div className="required d-flex">
            <div className="w-100">
              <Select
                inputId={`WorkflowStatusSelectStatus`}
                placeholder={t("Select Status")}
                styles={reactSelectSMStyle}
                theme={(theme: any) => styles(theme)}
                options={lookups.workflowStatus}
                name="currentWorkFlowId"
                menuPortalTarget={document.body}
                menuPosition={"fixed"}
                onChange={(event: any) =>
                  handleChange("currentWorkFlowId", event.value, row?.id)
                }
                value={lookups.workflowStatus.filter(function (option: any) {
                  return option.value === row.currentWorkFlowId;
                })}
              />
            </div>
          </div>
        ) : (
          <span>{row?.currentWorkFlowName}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusActionPerformed_${row.id}`}>
        {row.rowStatus ? (
          <Select
            inputId={`WorkflowStatusActionPerformed`}
            placeholder={t("Action Performed")}
            styles={reactSelectSMStyle}
            theme={(theme: any) => styles(theme)}
            options={actionPerformedStaticValues}
            name="actionPerformed"
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            onChange={(event: any) =>
              handleChange("actionPerformed", event.value, row?.id)
            }
            value={actionPerformedStaticValues.filter(function (option: any) {
              return option.value === row.actionPerformed;
            })}
          />
        ) : (
          <span>{row.actionPerformed}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusNextStep_${row.id}`}>
        {row.rowStatus ? (
          <Select
            inputId={`WorkflowStatusNextStep`}
            placeholder={t("Select Next Step")}
            styles={reactSelectSMStyle}
            theme={(theme: any) => styles(theme)}
            options={lookups.workflowStatus}
            name="nextWorkFlowId"
            menuPortalTarget={document.body}
            menuPosition={"fixed"}
            onChange={(event: any) =>
              handleChange("nextWorkFlowId", event.value, row?.id)
            }
            value={lookups.workflowStatus.filter(function (option: any) {
              return option.value === row.nextWorkFlowId;
            })}
          />
        ) : (
          <span>{row.nextWorkFlowName}</span>
        )}
      </TableCell>
      <TableCell id={`WorkflowStatusStatus_${row.id}`}>
        <div className="d-flex justify-content-center">
          {!row.isActive ? (
            <img style={{ width: "35px" }} src={skipSvg} alt="skip_img" />
          ) : (
            <img style={{ width: "35px" }} src={includeSvg} alt="include_img" />
          )}
        </div>
      </TableCell>
      <TableCell
        id={`WorkflowStatusSkip_${row.id}`}
        className="d-flex justify-content-center"
      >
        {!row.isActive ? (
          <button
            id={`WorkflowStatusIncludeButton_${row.id}`}
            className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={actionButtonLoading}
            onClick={WorkflowStatusChange}
          >
            <div className="d-flex justify-content-center gap-2">
              <span>{t("Include")}</span>
              {actionButtonLoading && (
                <div
                  className="spinner-border text-success"
                  role="status"
                  style={{ width: "17px", height: "17px" }}
                />
              )}
            </div>
          </button>
        ) : (
          <button
            id={`WorkflowStatusSkipButton_${row.id}`}
            className="btn btn-danger btn-sm fw-bold mr-3 px-10 text-capitalize"
            disabled={actionButtonLoading}
            onClick={WorkflowStatusChange}
          >
            <div className="d-flex justify-content-center gap-2">
              <span>{t("Skip")}</span>
              {actionButtonLoading && (
                <div
                  className="spinner-border text-secondary"
                  role="status"
                  style={{ width: "17px", height: "17px" }}
                />
              )}
            </div>
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}

export default Row;
