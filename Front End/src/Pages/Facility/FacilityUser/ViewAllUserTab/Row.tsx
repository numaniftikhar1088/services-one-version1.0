import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { SignatureRequest } from "Services/UserManagement/UserManagementService";
import useLang from "Shared/hooks/useLanguage";
import { AxiosResponse } from "axios";
import React, { memo, useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import { connect, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  setAdminUserId,
  setRefreshToken,
  setUserInfo,
} from "../../../../Redux/Actions/Index";
import FacilityService from "../../../../Services/FacilityService/FacilityService";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, RemoveICon } from "../../../../Shared/Icons";
import useAuth from "../../../../Shared/hooks/useAuth";
import { Decrypt, Encrypt } from "../../../../Utils/Auth";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../../Utils/Style/Dropdownstyle";
import ViewAssignedFacilites from "./ViewAssignedFacilites";

export interface ITableObj {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  adminType: string;
  adminTypeId: number;
  npiNumber: string;
  username: string;
  rowStatus: boolean | undefined;
  userGroup: string;
  isActive: boolean;
}
export interface AdditionalInfo {
  npi: string;
}

const Row = (props: {
  row: ITableObj;
  rows: any;
  setRows: any;
  index: number;
  dropDownValues: any;
  handleDelete: Function;
  handleArchive: Function;
  handleChange: Function;
  TokenForReset: Function;
  User?: any;
  open: any;
  setOpen: any;
  SuspendRecord: any;
  isFacilityUser: boolean;
}) => {
  const { t } = useLang();

  const {
    row,
    handleChange,
    handleDelete,
    TokenForReset,
    open,
    SuspendRecord,
    isFacilityUser,
    handleArchive,
  } = props;

  const [show1, setShow1] = useState(false);
  const [value, setValue] = useState<any>(null);
  const [UserList, setUserList] = useState<any>([]);
  const [Duplicate, setDuplicate] = useState<any>(false);
  const [showArchived, setShowArchived] = useState(false);
  const [suspendValue, setSuspendValue] = useState<any>(null);
  const [showsuspendmodal, setShowSuspendModal] = useState(false);

  const ModalhandleClose1 = () => setShow1(false);
  const ModalhandleCloseArchived = () => setShowArchived(false);
  const ModalhandleCloseSuspend = () => setShowSuspendModal(false);
  // *********** Dropdown Function START ***********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const expandableBtnRef = useRef<any>();
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const { LoginRoute }: any = useAuth();
  const GoToPortal = async () => {
    const encriptAdminId = sessionStorage.getItem("userinfo");
    const adminId = Decrypt(encriptAdminId);
    const admin = JSON.parse(adminId);
    const { userId } = admin;
    await FacilityService.GoToPortal(row?.id).then((res: AxiosResponse) => {
      dispatch(setAdminUserId(userId));
      const data = res.data;
      const encryptData: any = Encrypt(JSON.stringify(res.data));
      sessionStorage.setItem("userinfo", encryptData);
      dispatch(setRefreshToken(data.refreshToken));
      dispatch(setUserInfo(encryptData));
      LoginRoute(data);
    });
  };
  // *********** Dropdown Function End ***********

  const getSelectedFacilityData = async (event: any) => {
    await FacilityService.ViewAssignedFacilities(row?.id).then(
      (res: AxiosResponse) => {
        setUserList(res?.data?.data);
        if (event.target.className == "bi bi-plus-lg") return;
      }
    );
  };

  const handleClickOpen = (userid: any) => {
    setShow1(true);
    setValue(userid);
  };

  const handleClickOpenArchive = (userid: any) => {
    setShowArchived(true);
    setValue(userid);
  };

  const handleClickOpenSuspend = (userid: any) => {
    setShowSuspendModal(true);
    setSuspendValue(userid);
  };

  const SendEmailForAddSignature = async (id: string, eventType: string) => {
    SignatureRequest(id, eventType).then((res: AxiosResponse) => {
      if (res.data.status === 200) {
        toast.success(t(res.data.message));
      } else {
        toast.error(t(res.data.message));
      }
    });
  };

  console.log(row, "juyguhbjuigyg");

  return (
    <React.Fragment>
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to delete this record?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id="FacilityUserViewAllUserModalCancel"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            id="FacilityUserViewAllUserModalSave"
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              handleDelete(value);
              ModalhandleClose1();
            }}
          >
            {t("Delete")}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showArchived}
        onHide={ModalhandleCloseArchived}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Archive Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {t("Are you sure you want to archive this record?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id="FacilityUserModalCancel"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleCloseArchived}
          >
            {t("Cancel")}
          </button>
          <button
            id="FacilityUserModalSave"
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              handleArchive(value);
              ModalhandleCloseArchived();
            }}
          >
            {t("Archive")}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showsuspendmodal}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{row.isActive ? t("Suspend Record") : t("Restore Record")}</h4>
        </Modal.Header>
        <Modal.Body>
          {row.isActive
            ? t("Are you sure you want to Suspend this record ?")
            : t("Are you sure you want to Restore this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id="FacilityUserViewAllUserModalRestoreCancel"
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleCloseSuspend}
          >
            {t("Cancel")}
          </button>
          <button
            id="FacilityUserViewAllUserModalRestore"
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              SuspendRecord(suspendValue);
              ModalhandleCloseSuspend();
            }}
          >
            {row.isActive ? t("Suspend") : t("Restore")}
          </button>
        </Modal.Footer>
      </Modal>
      <TableRow id={row.id} sx={{ "& > *": { borderBottom: "unset" } }}>
        {!isFacilityUser && (
          <TableCell id={`Row_Status_${row.id}`}>
            {!row.rowStatus ? (
              <IconButton
                disabled={
                  props?.User.loggedInInfo?.adminType.toLowerCase() ===
                  "facility"
                }
                aria-label="expand row"
                size="small"
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <span onClick={() => setDuplicate(!Duplicate)}>
                  {Duplicate || open ? (
                    <button
                      id={`FacilityUserHide_${row.id}`}
                      className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                    >
                      <RemoveICon />
                    </button>
                  ) : (
                    <button
                      id={`FacilityUserShow_${row.id}`}
                      className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                      onClick={(event: any) => {
                        getSelectedFacilityData(event);
                      }}
                    >
                      <AddIcon />
                    </button>
                  )}
                </span>
              </IconButton>
            ) : null}
          </TableCell>
        )}
        <TableCell id={`Row_ThreeDots_${row.id}`}>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`FacilityUser1stTab3Dots_${row.id}`}
              aria-controls={openDrop ? "demo-positioned-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={openDrop ? "true" : undefined}
              onClick={handleClick}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
              id="demo-positioned-menu"
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
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="GoToPortal"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <a
                    id="FacilityUserViewAllUserGoToPortal"
                    onClick={(event: any) => {
                      expandableBtnRef.current.id = "icon";
                      handleClose();
                      GoToPortal();
                    }}
                    // className="w-125px"
                    ref={expandableBtnRef}
                  >
                    <i className="fa fa-user text-info mr-2 w-20px"></i>
                    {t("Go To Portal")}
                  </a>
                </MenuItem>
              </PermissionComponent>
              {/* </a> */}
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="Edit"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <Link
                    id="FacilityUserViewAllUserEdit"
                    className="text-dark w-100 h-100"
                    to={`/facility-user?id=${btoa(row.id)}`}
                  >
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    {t("Edit")}
                  </Link>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="AssignFacility"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <Link
                    id="FacilityUserViewAllUserAsignFacility"
                    className="text-dark w-150 h-100"
                    to={`/assign-facility/${btoa(row.id)}`}
                  >
                    <i className="bi bi-card-checklist text-warning mr-2 w-20px"></i>
                    {t("Assign Facility")}
                  </Link>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="Delete"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <a
                    id="FacilityUserViewAllUserArchive"
                    onClick={() => {
                      handleClose();
                      handleClickOpen(row.id);
                    }}
                  // className=" w-125px"
                  >
                    <i
                      className="fa fa-trash text-danger mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Delete")}
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="Archived"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <a
                    id="FacilityUserArchive"
                    onClick={() => {
                      handleClose();
                      handleClickOpenArchive(row.id);
                    }}
                  // className=" w-125px"
                  >
                    <i
                      className="fa fa-trash text-success mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Archive")}
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="Suspend"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <a
                    id="FacilityUserViewAllUserStatus"
                    onClick={() => {
                      handleClose();
                      handleClickOpenSuspend(row.id);
                    }}
                  // className=" w-125px"
                  >
                    {row?.isActive ? (
                      <i
                        className="fa fa-pause text-warning mr-2"
                        aria-hidden="true"
                      ></i>
                    ) : (
                      <i className="fa fa-undo text-warning mr-2"></i>
                    )}
                    {row?.isActive ? t("Suspend") : "Restore"}
                  </a>
                </MenuItem>
              </PermissionComponent>

              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="View"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <Link
                    id="FacilityUserViewAllUserView"
                    className="text-dark w-100 h-100"
                    to={`/facility-user-view-by-id/${btoa(row.id)}`}
                  >
                    <i className="fa fa-eye text-success mr-2 w-20px"></i>
                    {t("View")}
                  </Link>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="Reset"
              >
                <MenuItem onClick={handleClose} className="p-0">
                  <a
                    id="FacilityUserViewAllUserResetPassword"
                    onClick={() => {
                      handleClose();
                      TokenForReset(row);
                    }}
                  // className=" w-125px"
                  >
                    <i className="fa fa-key text-info mr-2"></i>
                    {t("Reset Password")}
                  </a>
                </MenuItem>
              </PermissionComponent>
              {row.adminTypeId === 72 ? (
                <>
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="View All Users"
                    permissionIdentifier="SignatureRequestEmail"
                  >
                    <MenuItem onClick={handleClose} className="p-0">
                      <a
                        id="FacilityUserViewAllUserSignatureRequestEmail"
                        onClick={() => {
                          handleClose();
                          SendEmailForAddSignature(row.id, "Email");
                        }}
                      >
                        <i className="fa-solid fa-signature text-success mr-2"></i>
                        {t("Send Signature Request via Email")}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="View All Users"
                    permissionIdentifier="SignatureRequestSMS"
                  >
                    <MenuItem onClick={handleClose} className="p-0">
                      <a
                        id="FacilityUserViewAllUserSignatureRequestSMS"
                        onClick={() => {
                          handleClose();
                          SendEmailForAddSignature(row.id, "SMS");
                        }}
                      >
                        <i className="fa-solid fa-signature text-success mr-2"></i>
                        {t("Send Signature Request via SMS")}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                </>
              ) : null}
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell id={`Row_firstName_${row.id}`} component="th" scope="row">
          {row.rowStatus ? (
            <input
              id="FirstName"
              type="text"
              name="firstName"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("Full Name")}
              value={row?.firstName}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.firstName}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowlastName_${row.id}`}>
          {row.rowStatus ? (
            <input
              id="LastName"
              type="text"
              name="lastName"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("Last Name")}
              value={row?.lastName}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.lastName}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowEmail_${row.id}`}>
          {row.rowStatus ? (
            <input
              id="Email"
              type="text"
              name="email"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("Email/Username")}
              value={row?.email ? row.email : row.username}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.email ? row.email : row.username}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowAdminType_${row.id}`}>
          {row.rowStatus ? (
            <input
              id="AdminType"
              type="text"
              name="adminType"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("User Type")}
              value={row?.adminType}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.adminType}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowNPINumber_${row.id}`}>
          {row.rowStatus ? (
            <input
              id="NpiNumber"
              type="text"
              name="npiNumber"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("NPI NO #")}
              value={row?.npiNumber}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.npiNumber}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowUserGroup_${row.id}`}>
          {row.rowStatus ? (
            <input
              id="UserGroup"
              type="text"
              name="userGroup"
              className="form-control bg-transparent mb-3 mb-lg-0"
              placeholder={t("User Group")}
              value={row?.userGroup}
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            />
          ) : (
            <span
              onChange={(event: any) =>
                handleChange(event.target.name, event.target.value, row?.id)
              }
            >
              {row?.userGroup}
            </span>
          )}
        </TableCell>
        <TableCell component="th" scope="row" id={`RowIsActive_${row.id}`}>
          <span
            onChange={(event: any) =>
              handleChange(event.target.name, event.target.value, row?.id)
            }
          >
            {row?.isActive ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
          </span>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} className="padding-0">
          <Collapse in={open ? open : Duplicate} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <ViewAssignedFacilites id={row?.id} UserList={UserList} />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

function mapStateToProps(state: any) {
  return { User: state.Reducer };
}
export default connect(mapStateToProps)(memo(Row));
// export default memo(Row);
