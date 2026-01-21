import { TableCell, TableRow } from "@mui/material";
import { AxiosResponse } from "axios";
import { Dispatch, SetStateAction, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import Select from "react-select";
import { toast } from "react-toastify";
import MiscellaneousService from "../../Services/MiscellaneousManagement/MiscellaneousService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { CrossIcon, DoneIcon } from "../../Shared/Icons";
import { reactSelectStyle, styles } from "../../Utils/Common";
import LookupsFunctions from "./LookupsFunctions";
import { SearchQuery } from ".";
import useLang from "Shared/hooks/useLanguage";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";

interface WorkFlowStatusIProps {
  row: any;
  rows: any;
  setRows: any;
  lookups: any;
  index: number;
  setSearchQuery: any;
  getAllNotification: (reset?: boolean) => void;
  searchQuery: SearchQuery;
  initialSearchQuery: SearchQuery;
  setIsAddButtonDisabled: Dispatch<SetStateAction<boolean>>;
  queryDisplayTagNames: any;
}

function Row(props: WorkFlowStatusIProps) {
  const {
    row,
    rows,
    index,
    lookups,
    setRows,
    setSearchQuery,
    getAllNotification,
    initialSearchQuery,
    queryDisplayTagNames,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();
  const {
    userLookup,
    setUserLookup,
    getUserLookup,
    roleTypeLookUp,
    userRoleTypeLookUp,
  } = LookupsFunctions();

  const [selectedUserType, setSelectedUserType] = useState<number>(0);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      userRoleTypeLookUp(parseInt(r.notificationTypeId));
      setSelectedUserType(parseInt(row.userRoleType));
      getUserLookup(row.userRoleType);
      const values = r.notificationUsers.map((option: any) => option.userId);
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return {
            ...row,
            notificationUserIds: values,
            rowStatus: true,
          };
        }
        return row;
      });
      setRows(updatedRows);
    }
  };

  const handleChange = (name: string, value: string, id: number) => {
    if (name === "notificationTypeId") {
      setSelectedUserType(0);
      userRoleTypeLookUp(parseInt(value));
      setUserLookup([]);
    }
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: value === "<p><br></p>" ? "" : value,
              ...(name === "notificationTypeId"
                ? {
                    notificationType:
                      (lookups.notificationTypeLookup as any)?.find(
                        (item: any) => item.value === value
                      )?.label ?? "",
                  }
                : {}),
            }
          : x
      )
    );
  };

  const handleChangeMultiSelect = (
    name: string,
    selectedOptions: any,
    id: number
  ) => {
    const values = selectedOptions.map((option: any) => option.value);
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]: values,
              notificationUserIds: values, // Store the selectedOptions for proper rendering
            }
          : x
      )
    );
  };

  const saveNotification = async () => {
    const { isValid, invalidField } = validateFields({
      notificationType: row.notificationTypeId,
      notificationMessage: row.notificationMessage,
    });
    try {
      if (isValid) {
        const response = await MiscellaneousService.SaveNotification({
          ...row,
          userRoleType: selectedUserType.toString(),
        });
        if (response?.data?.statusCode === 200) {
          setSearchQuery(initialSearchQuery);
          toast.success(t(response?.data?.message));
          getAllNotification(true);
        } else if (response?.data?.statusCode === 400) {
          toast.error(t(response?.data?.message));
        }
      } else {
        const errorMessage = invalidField
          ? t(`Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`)
          : t("Invalid field found");
        toast.error(t(errorMessage));
      }
    } catch (error) {
      console.error("Error saving notification:", error);
    } finally {
      setIsAddButtonDisabled(false);
    }
  };

  const handleChangeUserType = (selectedUserType: number) => {
    setSelectedUserType(selectedUserType);
    getUserLookup(selectedUserType);
  };

  const statusChange = async (id: string, status: boolean) => {
    const objToSend = {
      id: id,
      isActive: status ? false : true,
    };
    await MiscellaneousService.StatusChangedNotification(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          getAllNotification(true);
        } else {
          toast.error(t("something went wrong please try again later"));
        }
      })
      .catch((err: string) => {
        console.error("Error changing status:", err);
        toast.error(t("something went wrong please try again later"));
      });
  };

  return (
    <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
      <TableCell className="text-center">
        <div className="d-flex justify-content-center">
          {row.rowStatus ? (
            <>
              <div className="gap-2 d-flex">
                <button
                  id={`AdminManageNotificationSave`}
                  onClick={() => saveNotification()}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`AdminManageNotificationCancel`}
                  onClick={() => {
                    if (row.id !== 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === row.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                      getAllNotification();
                    } else {
                      const newArray = [...rows];
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
                id={`AdminManageNotification_${row.id}`}
                drop="end"
                title={<i className="bi bi-three-dots-vertical p-0"></i>}
              >
                <PermissionComponent
                  moduleName="Admin"
                  pageName="Manage Notification"
                  permissionIdentifier="Edit"
                >
                  <Dropdown.Item
                    id={`AdminManageNotificationEdit${row.id}`}
                    eventKey="0"
                    onClick={() => getValues(row, "Edit")}
                  >
                    <i className={"fa fa-edit text-primary mr-2"}></i>
                    {t("Edit")}
                  </Dropdown.Item>
                </PermissionComponent>
                {row?.isActive ? (
                  <PermissionComponent
                    moduleName="Admin"
                    pageName="Manage Notification"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`AdminManageNotificationInActive`}
                      eventKey="1"
                      onClick={() => statusChange(row.id, row.isActive)}
                    >
                      <i className={"fa fa-ban text-danger mr-2"}></i>
                      {t("Inactive")}
                    </Dropdown.Item>
                  </PermissionComponent>
                ) : (
                  <PermissionComponent
                    moduleName="Admin"
                    pageName="Manage Notification"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`AdminManageNotificationActive`}
                      eventKey="2"
                      onClick={() => statusChange(row.id, row.isActive)}
                    >
                      <i className={"fa fa-circle-check text-success mr-2"}></i>
                      {t("Active")}
                    </Dropdown.Item>
                  </PermissionComponent>
                )}
              </DropdownButton>
            </div>
          )}
        </div>
      </TableCell>
      <TableCell
        id={`AdminManageNotificationType_${row.id}`}
        className="w-100px"
      >
        {row.rowStatus ? (
          <Select
            inputId={`AdminManageNotificationType`}
            menuPortalTarget={document.body}
            placeholder={t("Select a Notification Type")}
            styles={reactSelectStyle}
            theme={(theme: any) => styles(theme)}
            options={lookups.notificationTypeLookup}
            name="notificationTypeId"
            onChange={(event: any) =>
              handleChange("notificationTypeId", event.value, row?.id)
            }
            value={lookups.notificationTypeLookup.filter(
              (option: any) => option.value === row.notificationTypeId
            )}
            isDisabled={row.id > 0 ? true : false}
          />
        ) : (
          <span>{row.notificationType}</span>
        )}
      </TableCell>
      <TableCell
        id={`AdminManageNotificationNotificatiobSubject_${row.id}`}
        className="w-300px"
      >
        {row.rowStatus ? (
          <div className="w-100">
            <input
              id={`AdminManageNotificationSunject`}
              type="text"
              name="notificationSubject"
              className="form-control bg-white mb-lg-0"
              placeholder={t("Notification Message")}
              value={row?.notificationSubject}
              onChange={(event: any) =>
                handleChange("notificationSubject", event.target.value, row?.id)
              }
            />
          </div>
        ) : (
          <span>{row.notificationSubject}</span>
        )}
      </TableCell>
      <TableCell
        id={`AdminManageNotificationMessage_${row.id}`}
        className="w-400px"
      >
        {row.rowStatus ? (
          <div className="w-100">
            <ReactQuill
              id={`AdminManageNotificationMessage`}
              theme="snow"
              value={row?.notificationMessage}
              readOnly={false}
              onChange={(event: any) =>
                handleChange("notificationMessage", event, row?.id)
              }
            />
          </div>
        ) : (
          <span>{row.notificationMessage}</span>
        )}
      </TableCell>
      <TableCell
        id={`AdminManageNotificationUser_${row.id}`}
        className="w-600px"
      >
        {row.rowStatus ? (
          <div className="d-flex w-100 gap-2">
            <Select
              inputId={`AdminManageNotificationUSer`}
              menuPortalTarget={document.body}
              styles={reactSelectStyle}
              theme={(theme: any) => styles(theme)}
              options={roleTypeLookUp}
              name="userType"
              className="w-50"
              placeholder={t("Select User Type")}
              value={roleTypeLookUp?.filter(
                (option: any) => option.value === selectedUserType
              )}
              onChange={(event: any) => handleChangeUserType(event.value)}
            />
            <Select
              inputId={`AdminManageNotificationUser`}
              menuPortalTarget={document.body}
              styles={reactSelectStyle}
              theme={(theme: any) => styles(theme)}
              isMulti
              options={userLookup}
              className="w-100"
              name="notificationUserIds"
              placeholder={t("Select multi-users")}
              value={userLookup?.filter((user: any) =>
                row.notificationUserIds?.includes(user.value)
              )}
              onChange={(event: any) =>
                handleChangeMultiSelect("notificationUserIds", event, row?.id)
              }
            />
          </div>
        ) : (
          <span>
            {row?.notificationUsers
              ?.map((item: any) => item?.userName)
              .join(", ")}
          </span>
        )}
      </TableCell>
      <TableCell className="text-center">
        {row.rowStatus ? (
          <div className="form-check form-switch py-1">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              name="isActive"
              id={`ManageSwitchButton_${row.id}`}
              onChange={(event: any) =>
                handleChange("isActive", event.target.checked, row?.id)
              }
              checked={row.isActive}
            />
            <label className="form-check-label"></label>
          </div>
        ) : row?.isActive ? (
          <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
        ) : (
          <i className="fa fa-ban text-danger mr-2 w-20px"></i>
        )}
      </TableCell>
    </TableRow>
  );
}

export default Row;
