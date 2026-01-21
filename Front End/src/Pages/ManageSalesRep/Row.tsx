import { IconButton, MenuItem } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import Status from "Shared/Common/Status";
import useLang from "Shared/hooks/useLanguage";
import { isValidEmail } from "Utils/Common/CommonMethods";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import FacilityService from "../../Services/FacilityService/FacilityService";
import ManageSalesRepServices from "../../Services/ManageSalesRep/ManageSalesRepServices";
import UserManagementService from "../../Services/UserManagement/UserManagementService";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, LoaderIcon, RemoveICon } from "../../Shared/Icons";

interface Props {
  Edit: any;
  item: any;
  handleClose: any;
  DeleteSpecimenTypeAssignmentById: any;
  statusChange: any;
  panels: any;
  sports2: any;
  row: any;
  setSports2: any;
  setPanels: any;
  loadData: any;
  setSelectedPanels: any;
  selectedPanels: any;
  check: any;
  setOpen: any;
  val: any;
}
const FacilityListExpandableTable: React.FC<any> = ({
  item,
  Edit,
  handleClose,
  DeleteSpecimenTypeAssignmentById,
  statusChange,
  panels,
  sports2,
  setSports2,
  setPanels,
  loadData,
  setSelectedPanels,
  selectedPanels,
  row,
  check,
  setOpen,
  val,
}) => {
  const { t } = useLang();

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const [open1, setOpen1] = React.useState(false);
  const [openalert, setOpenAlert] = React.useState(false);
  const [openalertDelete, setOpenAlertDelete] = React.useState(false);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const handleCloseAlertDelete = () => {
    setOpenAlertDelete(false);
  };

  const handleClickOpen = () => {
    setOpenAlert(true);
  };

  const handleClickOpenDelete = () => {
    setOpenAlertDelete(true);
  };

  const [userList, setUserList] = useState<any>([]);
  const getSelectedFacilityData = async () => {
    await FacilityService.ViewAssignedFacilities(item?.id).then(
      (res: AxiosResponse) => {
        setUserList(res?.data?.data);
      }
    );
  };

  const ArchivedUser = async (id: any) => {
    await UserManagementService?.archiveRecordUser(id).then(
      (res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.message);
          handleCloseAlert();
          loadData();
        } else {
          toast.error(res.data.message);
        }
      }
    );
  };

  const DeleteUser = async (id: any) => {
    await UserManagementService?.deleteRecordUser(id).then(
      (res: AxiosResponse) => {
        if (res.data.statusCode === 200) {
          toast.success(res.data.message);
          handleCloseAlert();
          loadData();
        } else {
          toast.error(res.data.message);
        }
      }
    );
  };

  const TokenForReset = (row: any) => {
    const validEmail = isValidEmail(row.salesRepEmail);

    if (!validEmail) {
      toast.error("User should be Email type to send reset email.");
      return;
    }

    UserManagementService?.TokenForResetPassword(encodeURIComponent(row?.id))
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success("Email Sent Successfully");
        } else if (res?.data?.statusCode === 400) {
          toast.error(res?.data?.message);
        }
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };

  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseThreeDot = () => {
    setAnchorEl(null);
  };

  const toggleStatus = async (userId: string) => {
    try {
      const res = await ManageSalesRepServices.toggleStatus(userId);

      if (res.data.statusCode === 200) {
        toast.success(res.data.responseMessage);
        loadData(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <TableRow>
        {val === 1 ? null : (
          <TableCell className="text-center">
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen1(!open1)}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
            >
              {open1 ? (
                <button
                  id={`ManageSaleRepCloseExpand_${item.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold rounded h-10px w-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`ManageSaleRepExpandOpen_${item.id}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  onClick={getSelectedFacilityData}
                >
                  <AddIcon />
                </button>
              )}
            </IconButton>
          </TableCell>
        )}
        {val === 1 ? null : (
          <TableCell className="text-center">
            <StyledDropButtonThreeDots
              id={`ManageSaleRep1stTab3Dots_${item.id}`}
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
              onClose={handleCloseThreeDot}
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
                moduleName="Manage Sales Rep"
                pageName="Sales Rep User"
                permissionIdentifier="GoToPortal"
              >
                <MenuItem className="p-0">
                  <a
                    id="ManageSaleRepGoToPortal"
                    className="w-150px p-0 text-dark"
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-user text-info mr-2 w-20px"></i>
                      {t("Go to Portal")}
                    </div>
                  </a>
                </MenuItem>
              </PermissionComponent>
              {/* <PermissionComponent
                moduleName="Facility"
                pageName="View All Users"
                permissionIdentifier="AssignFacility"
              > */}
              <MenuItem onClick={handleClose} className="p-0">
                <Link
                  id="ManageSaleRepAssignFacility"
                  className="text-dark w-150 h-100"
                  to={`/assign-facility/sales-rep-user/${window.btoa(
                    item?.id
                  )}`}
                >
                  <div className="menu-item px-3">
                    <i className="bi bi-card-checklist text-warning mr-2 w-20px"></i>
                    {t("Assign Facility")}
                  </div>
                </Link>
              </MenuItem>
              {/* </PermissionComponent> */}
              <PermissionComponent
                moduleName="Manage Sales Rep"
                pageName="Sales Rep User"
                permissionIdentifier="Edit"
              >
                <MenuItem className="p-0">
                  <a
                    id="ManageSaleRepEdit"
                    className="w-150px p-0 text-dark"
                    onClick={() => {
                      Edit(item);
                      handleCloseThreeDot();
                      setOpen(false);
                    }}
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-edit text-primary mr-2 w-20px"></i>
                      {t("Edit")}
                    </div>
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Manage Sales Rep"
                pageName="Sales Rep User"
                permissionIdentifier="Delete"
              >
                <MenuItem className="p-0">
                  <a
                    id="ManageSaleRepDelete"
                    className="w-150px p-0 text-dark"
                    onClick={() => {
                      handleClickOpenDelete();
                      handleCloseThreeDot();
                    }}
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-trash mr-2 text-danger"></i>
                      {t("Delete")}
                    </div>
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Manage Sales Rep"
                pageName="Sales Rep User"
                permissionIdentifier="Archived"
              >
                <MenuItem className="p-0">
                  <a
                    id="ManageSaleRepArchive"
                    className="w-15px p-0 text-dark"
                    onClick={() => {
                      handleClickOpen();
                      handleCloseThreeDot();
                    }}
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-trash mr-2 text-success"></i>
                      {t("Archive")}
                    </div>
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Manage Sales Rep"
                pageName="Sales Rep User"
                permissionIdentifier="Reset"
              >
                <MenuItem className="p-0">
                  <a
                    id="ManageSaleRepResetPassword"
                    className="w-150px p-0 text-dark"
                    onClick={() => {
                      TokenForReset(item);
                      handleCloseThreeDot();
                    }}
                  >
                    <div className="menu-item px-3">
                      <i className="fa fa-key text-warning mr-2 w-20px"></i>
                      {t("Reset Password")}
                    </div>
                  </a>
                </MenuItem>
              </PermissionComponent>
              <span className="menu-item">
                {item.status ? (
                  <PermissionComponent
                    moduleName="Manage Sales Rep"
                    pageName="Sales Rep User"
                    permissionIdentifier="Inactive"
                  >
                    <MenuItem className="p-0">
                      <a
                        id="ManageSaleRepActive"
                        className="w-150px p-0 text-dark "
                        onClick={() => {
                          toggleStatus(item.id);
                          handleCloseThreeDot();
                        }}
                      >
                        <div className="menu-item px-3">
                          <i
                            className="fa-solid fa-ban text-danger mr-2 w-20px"
                            style={{ fontSize: "16px", color: "green" }}
                          />
                          {t("Inactive")}
                        </div>
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                ) : (
                  <PermissionComponent
                    moduleName="Manage Sales Rep"
                    pageName="Sales Rep User"
                    permissionIdentifier="Active"
                  >
                    <MenuItem className="p-0">
                      <a
                        id="ManageSaleRepActive"
                        className="w-150px p-0 text-dark"
                        onClick={() => {
                          toggleStatus(item.id);
                          handleCloseThreeDot();
                        }}
                      >
                        <div className="menu-item px-3">
                          <i
                            className="fa fa-circle-check text-success mr-2 w-20px"
                            style={{ fontSize: "16px", color: "green" }}
                          />
                          {t("Active")}
                        </div>
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                )}
              </span>
            </StyledDropMenuMoreAction>
          </TableCell>
        )}
        <TableCell id={`ManageSaleRepFirstName_${item.id}`}>
          {item?.firstName}
        </TableCell>
        <TableCell id={`ManageSaleRepLastName_${item.id}`}>
          {item?.lastName}
        </TableCell>
        <TableCell id={`ManageSaleRepEmail_${item.id}`}>
          {item.salesRepEmail}
        </TableCell>
        <TableCell id={`ManageSaleRepPhoneNumber_${item.id}`}>
          {item.salesRepPhone}
        </TableCell>
        <TableCell id={`ManageSaleRepPhoneNumber_${item.id}`}>
          {item.salesGroupName}
        </TableCell>
        <TableCell
          id={`ManageSaleRepStatus_${item.id}`}
          className="text-center"
        >
          <Status
            cusText={t(item.status ? "Active" : "Inactive")}
            cusClassName={
              item.status ? "bg-primary" : "badge-status-processing"
            }
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={12} className="padding-0">
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <div className="card shadow-sm rounded border border-warning mt-3">
                      <div className="card-header d-flex justify-content-between align-items-center bg-light-secondary min-h-35px">
                        <h6 className="mb-0">{t("Assigned Facilities")}</h6>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                          <span className="text-primary fw-bold">
                            {t("Facility Name")}
                          </span>
                          <div className="row mt-3">
                            {userList?.map((i: any) => (
                              <div
                                id={`ManageSaleRepExpandFacility_${i.facilityId}`}
                                className="col-xl-3 col-lg-3 col-md-3 col-sm-6 my-1"
                              >
                                {capitalizeFirstLetter(i.facilityName)}
                                {"-"}
                                {i?.address}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>

      <BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Archive Menu")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to archive this user?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`ManageSaleRepModalArchiveCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ManageSaleRepModalArchiveConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => ArchivedUser(item?.id)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span>{t("Archive")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
      <BootstrapModal
        show={openalertDelete}
        onHide={handleCloseAlertDelete}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Menu")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`ManageSaleRepMOdalDeleteCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlertDelete}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ManageSaleRepModalDeleteConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              DeleteUser(item?.id);
              handleCloseAlertDelete();
            }}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span>{t("Delete")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};
export default FacilityListExpandableTable;
