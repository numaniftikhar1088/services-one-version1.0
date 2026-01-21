import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import React, { useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp, LoaderIcon } from "../../../../Shared/Icons";
import useLang from "../../../../Shared/hooks/useLanguage";
import UserManagementService from "Services/UserManagement/UserManagementService";
import { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";

export interface ITableObj {
  id: string;
  firstName: string;
  lastName: string;
  adminEmail: string;
  adminType: string;
  userGroup: string;
}
const UserManagmentGrid = (props: {
  rows: ITableObj[];
  setRows: any;
  dropDownValues: any;
  searchRequest: any;
  searchQuery: any;
  EditUser: any;
  handleChange: any;
  handleDelete: Function;
  handleArchived: Function;
  loading: boolean;
  TokenForReset: Function;
  handleSort: any;
  searchRef: any;
  sort: any;
  handleKeyPress: Function;
}) => {
  const {
    rows,
    searchRequest,
    searchQuery,
    EditUser,
    handleChange,
    handleDelete,
    handleArchived,
    loading,
    TokenForReset,
    handleSort,
    searchRef,
    sort,
    handleKeyPress,
  } = props;

  const { t } = useLang();

  // ********** Dropdown START **********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ********** Dropdown EDN **********

  // ********** Delete row model **********
  const [check, setCheck] = useState(false);
  const [openalert, setOpenAlert] = React.useState(false);
  const [openalertArchive, setOpenAlertArchive] = React.useState(false);
  const [value, setValue] = useState<any>({
    userid: 0,
  });
  const handleClickOpen = (userId: any) => {
    setOpenAlert(true);
    setValue(() => {
      return {
        userid: userId,
      };
    });
  };

  const handleClickOpenArchived = (userId: any) => {
    setOpenAlertArchive(true);
    setValue(() => {
      return {
        userid: userId,
      };
    });
  };
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseAlertArchive = () => {
    setOpenAlertArchive(false);
  };

  return (
    <>
      <TableHead>
        <TableRow className="h-40px">
          <TableCell></TableCell>
          <TableCell>
            <input
              id={`AdminUserListSearch!stName`}
              type="text"
              name="firstName"
              className="form-control bg-white h-30px rounded"
              placeholder={t("Search ...")}
              value={searchRequest.firstName}
              onChange={searchQuery}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </TableCell>
          <TableCell>
            <input
              id={`AdminUserListSearchLastName`}
              type="text"
              name="lastName"
              className="form-control bg-white h-30px rounded"
              placeholder={t("Search ...")}
              onChange={searchQuery}
              value={searchRequest.lastName}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </TableCell>
          <TableCell>
            <input
              id={`AdminUserListSearchAdminEmail`}
              type="text"
              name="adminEmail"
              className="form-control bg-white h-30px rounded"
              placeholder={t("Search ...")}
              value={searchRequest.adminEmail}
              onChange={searchQuery}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </TableCell>
          <TableCell>
            <input
              id={`AdminUserListSearchAdminType`}
              type="text"
              name="adminType"
              className="form-control bg-white h-30px rounded"
              placeholder={t("Search ...")}
              value={searchRequest.adminType}
              onChange={searchQuery}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </TableCell>
          <TableCell>
            <input
              id={`AdminUserListSearchUserGroup`}
              type="text"
              name="userGroup"
              className="form-control bg-white h-30px rounded"
              placeholder={t("Search ...")}
              value={searchRequest.userGroup}
              onChange={searchQuery}
              onKeyDown={(e) => handleKeyPress(e)}
            />
          </TableCell>
        </TableRow>
        <TableRow className="h-30px">
          <TableCell>{t("Actions")}</TableCell>
          <TableCell className="min-w-200px" sx={{ width: "max-content" }}>
            <div
              onClick={() => handleSort("firstName")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("First Name")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "firstName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "firstName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell className="min-w-200px" sx={{ width: "max-content" }}>
            <div
              onClick={() => handleSort("lastName")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Last Name")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "lastName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "lastName"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell className="min-w-200px" sx={{ width: "max-content" }}>
            <div
              onClick={() => handleSort("adminEmail")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Admin Email")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "adminEmail"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "adminEmail"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell className="min-w-200px" sx={{ width: "max-content" }}>
            <div
              onClick={() => handleSort("adminType")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("Admin Type")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "adminType"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "adminType"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
          <TableCell className="min-w-200px" sx={{ width: "max-content" }}>
            <div
              onClick={() => handleSort("userGroup")}
              className="d-flex justify-content-between cursor-pointer"
              id=""
              ref={searchRef}
            >
              <div style={{ width: "max-content" }}>{t("User Group")}</div>

              <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                <ArrowUp
                  CustomeClass={`${
                    sort.sortingOrder === "desc" &&
                    sort.clickedIconData === "userGroup"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0 "`}
                />
                <ArrowDown
                  CustomeClass={`${
                    sort.sortingOrder === "asc" &&
                    sort.clickedIconData === "userGroup"
                      ? "text-success fs-7"
                      : "text-gray-700 fs-7"
                  }  p-0 m-0`}
                />
              </div>
            </div>
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {loading ? (
          <TableCell colSpan={6} className="">
            <Loader />
          </TableCell>
        ) : rows.length ? (
          rows?.map((row: any) => (
            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
              <TableCell>
                <div className="d-flex justify-content-center rotatebtnn">
                  <DropdownButton
                    className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                    key="end"
                    id={`AdminUserList3Dots_${row.id}`}
                    drop="end"
                    title={<i className="bi bi-three-dots-vertical p-0"></i>}
                  >
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User List"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`AdminUserListEdit`}
                        eventKey="1"
                        className="menu-item p-0"
                        onClick={() => EditUser(row?.id)}
                        href="#root"
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-edit text-warning mr-2  w-20px"></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User List"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id={`AdminUserListDelete`}
                        eventKey="2"
                        className="menu-item p-0"
                        onClick={() => handleClickOpen(row?.id)}
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-trash text-danger mr-2  w-20px"></i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User List"
                      permissionIdentifier="Archived"
                    >
                      <Dropdown.Item
                        id={`AdminUserListArchived`}
                        eventKey="2"
                        className="menu-item p-0"
                        onClick={() => handleClickOpenArchived(row?.id)}
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-trash text-success mr-2  w-20px"></i>
                          {t("Archived")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="Admin"
                      pageName="User List"
                      permissionIdentifier="Reset"
                    >
                      <Dropdown.Item
                        id={`AdminUserListResetPassword`}
                        eventKey="3"
                        className="menu-item p-0"
                        onClick={() => TokenForReset(row)}
                      >
                        <span className="menu-link text-dark">
                          <i className="fa fa-key text-info mr-2  w-20px"></i>
                          {t("Reset Password")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </DropdownButton>
                </div>
              </TableCell>

              <TableCell
                id={`AdminUserListFirstName_${row.id}`}
                component="th"
                scope="row"
              >
                {row.rowStatus ? (
                  <input
                    type="text"
                    name="firstName"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("Full Name")}
                    value={row?.firstName}
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  />
                ) : (
                  <span
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  >
                    {row?.firstName}
                  </span>
                )}
              </TableCell>
              <TableCell
                id={`AdminUserListLastName_${row.id}`}
                component="th"
                scope="row"
              >
                {row.rowStatus ? (
                  <input
                    type="text"
                    name="lastName"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("Last Name")}
                    value={row?.lastName}
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  />
                ) : (
                  <span
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  >
                    {row?.lastName}
                  </span>
                )}
              </TableCell>
              <TableCell
                id={`AdminUserListEmail_${row.id}`}
                component="th"
                scope="row"
              >
                {row.rowStatus ? (
                  <input
                    type="text"
                    name="adminEmail"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("Admin Email")}
                    value={row?.adminEmail}
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  />
                ) : (
                  <span
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  >
                    {row?.adminEmail}
                  </span>
                )}
              </TableCell>
              <TableCell
                id={`AdminUserListAdminType_${row.id}`}
                component="th"
                scope="row"
              >
                {row.rowStatus ? (
                  <input
                    type="text"
                    name="adminType"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("Admin Type")}
                    value={row?.userType}
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  />
                ) : (
                  <span
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  >
                    {row?.adminType}
                  </span>
                )}
              </TableCell>
              <TableCell
                id={`AdminUserListUserGroup_${row.id}`}
                component="th"
                scope="row"
              >
                {row.rowStatus ? (
                  <input
                    type="text"
                    name="userGroup"
                    className="form-control bg-transparent mb-3 mb-lg-0"
                    placeholder={t("User Group")}
                    value={row?.userGroup}
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  />
                ) : (
                  <span
                    onChange={(event: any) =>
                      handleChange(
                        event.target.name,
                        event.target.value,
                        row?.id
                      )
                    }
                  >
                    {row?.userGroup}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))
        ) : (
          <NoRecord colSpan={6} />
        )}
      </TableBody>

      <Modal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Admin User")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this User?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AdminUserListDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AdminUserListDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              handleDelete(value.userid);
              handleCloseAlert();
            }}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span>{t("Delete")}</span>
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={openalertArchive}
        onHide={handleCloseAlertArchive}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Archive Admin User")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to archive this User?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`AdminUserListArchivesModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlertArchive}
          >
            {t("Cancel")}
          </button>
          <button
            id={`AdminUserListArchivedModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              handleArchived(value.userid);
              handleCloseAlertArchive();
            }}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span>{t("Archive")}</span>
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagmentGrid;
