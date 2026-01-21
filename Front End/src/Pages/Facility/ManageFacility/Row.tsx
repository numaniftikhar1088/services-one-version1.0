import { Box, Collapse, TableCell, TableRow, Typography } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { AxiosError, AxiosResponse } from "axios";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ViewAssignedUsers from "../ViewAssignedUsers";
import ViewReferenceLab from "../ViewReferenceLab";
import AssignedSalesRep from "./AssignedSalesRep";
import { useManageFacility } from "./FacilityListContext/useManageFacility";
import PharmDPreference from "./PharmDPreference";
import FacilityService from "Services/FacilityService/FacilityService";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import useLang from "Shared/hooks/useLanguage";
import { AddIcon, RemoveICon } from "Shared/Icons";
import { Encrypt } from "Utils/Auth";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";

const Row = (props: any) => {
  const { t } = useLang();

  const {
    selectedBox,
    setSelectedBox,
    loading,
    tabIdToSend,
    status,
    setStatus,
    loadGridData,
  } = useManageFacility();

  const pageLinks = useSelector((reducers: any) => reducers.Reducer?.links);
  const navigate = useNavigate();

  const [collapseOpen, setCollapseOpen] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleChangeRequisitionIds = (checked: boolean, RowData: any) => {
    if (checked) {
      setSelectedBox((prev: number[] = []) => [...prev, RowData.FacilityId]);
    } else {
      setSelectedBox((prev: number[] = []) =>
        prev.filter((item) => item !== RowData.FacilityId)
      );
    }
    setStatus(RowData.FacilityStatus);
  };

  // *********** Dropdown Function START ***********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  // *********** Dropdown Function End ***********

  const getPageId = () => {
    if (pageLinks && Array.isArray(pageLinks) && pageLinks.length > 0) {
      // First, check for an exact match

      let pageIdFromUrl = pageLinks.find((link: any) => {
        if (link.linkUrl && link.linkUrl === "/dynamic-facility") {
          return link;
        }
      })?.id;

      // If no exact match, check for a partial match
      if (!pageIdFromUrl) {
        pageIdFromUrl = pageLinks.find((link: any) => {
          if (link.linkUrl && link.linkUrl === "/dynamic-facility") {
            return link;
          }
        })?.id;
      }

      return pageIdFromUrl;
    }
  };

  const handleNavigate = (item: any) => {
    navigate(`/dynamic-facility?id=${item?.FacilityId}&pageId=${getPageId()}`);
  };

  const handleClickOpen = (item: any, status: string) => {
    setOpenAlert(true);
    setStatus(status);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const onFacilityStatusChange = (item: any, status: string) => {
    const obj = {
      facilityId: item?.FacilityId,
      status: status,
    };
    FacilityService.updateFacilityStatus(obj)
      .then((res: AxiosResponse) => {
        if (res.data.status === 200) {
          loadGridData();
          toast.success(t(res.data.title));
          handleCloseAlert();
        }
      })
      .catch((err: AxiosError) => console.error(err));
  };

  return (
    <>
      {loading ? null : (
        <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
          <TableCell className="w-30px">
            <span onClick={() => setCollapseOpen(!collapseOpen)}>
              {collapseOpen ? (
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
          <TableCell style={{ width: "49px" }}>
            <label className="form-check form-check-sm form-check-solid">
              <input
                className="form-check-input"
                type="checkbox"
                checked={selectedBox?.includes(props?.RowData?.FacilityId)}
                onChange={(e) =>
                  handleChangeRequisitionIds(e.target.checked, props?.RowData)
                }
              />
            </label>
          </TableCell>
          <TableCell className="text-center w-30px">
            <StyledDropButtonThreeDots
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
              aria-labelledby={t("demo-positioned-button")}
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
              {tabIdToSend === 0 ? (
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifier="GoToPortal"
                >
                  <MenuItem
                    id="ManageFacilityGoToPortal"
                    onClick={() => {
                      handleClose();
                      const queryString = Object.keys(props?.RowData)
                        .map(
                          (key) =>
                            key + "=" + encodeURIComponent(props?.RowData[key])
                        )
                        .join("&");

                      const encryptedQueryString = Encrypt(queryString);
                      window.open(
                        "/MyFavorites?" + encryptedQueryString,
                        "_blank"
                      );
                    }}
                    className="w-125px"
                  >
                    <i className="fa fa-user text-info mr-2 w-20px"></i>
                    {t("Go To Portal")}
                  </MenuItem>
                </PermissionComponent>
              ) : null}
              {tabIdToSend === 1 ? (
                <>
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="Manage Facility"
                    permissionIdentifier="Edit"
                  >
                    <MenuItem onClick={handleClose} className=" w-125px p-0">
                      <Link
                        id="ManageFacilityEdit"
                        className="text-dark w-100 h-100"
                        to={`/editfacility/${btoa(props?.RowData?.FacilityId)}`}
                      >
                        <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                        {t("Edit")}
                      </Link>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="Manage Facility"
                    permissionIdentifier="EditDynamicFacility"
                  >
                    <MenuItem onClick={handleClose} className=" w-125px p-0">
                      <a
                        id="ManageFacilityEdit2"
                        className="text-dark w-100 h-100"
                        onClick={() => handleNavigate(props?.RowData)}
                      >
                        <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                        {t("Edit")}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Facility"
                    pageName="Manage Facility"
                    permissionIdentifier="View"
                  >
                    <MenuItem onClick={handleClose} className=" w-125px p-0">
                      <Link
                        id="ManageFacilityView"
                        className="text-dark w-100 h-100"
                        to={`/facility-view/${btoa(
                          props?.RowData?.FacilityId
                        )}`}
                      >
                        <i className="fa fa-eye text-success mr-2 w-20px"></i>
                        {t("View")}
                      </Link>
                    </MenuItem>
                  </PermissionComponent>
                  {tabIdToSend === 1 ? (
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="Suspend"
                    >
                      <MenuItem onClick={handleClose} className=" w-125px p-0">
                        <a
                          id="ManageFacilittyRowSuspend"
                          onClick={() => {
                            handleClose();
                            handleClickOpen(props?.RowData, "Suspend");
                          }}
                          className=" w-125px text-dark"
                        >
                          <i className="fa fa-pause text-danger mr-2 w-20px"></i>
                          {t("Suspend")}
                        </a>
                      </MenuItem>
                    </PermissionComponent>
                  ) : null}
                  {tabIdToSend === 1 ? (
                    <>
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Inactive"
                      >
                        <MenuItem
                          onClick={handleClose}
                          className=" w-125px p-0"
                        >
                          <a
                            id="ManageFacilityRowInActive"
                            onClick={() => {
                              handleClose();

                              handleClickOpen(props?.RowData, "InActive");
                            }}
                            className=" w-125px text-dark"
                          >
                            <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                            {t("Inactivate")}
                          </a>
                        </MenuItem>
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Archived"
                      >
                        <MenuItem
                          onClick={handleClose}
                          className=" w-125px p-0"
                        >
                          <a
                            id="ManageFacilityRowArchive"
                            onClick={() => {
                              handleClose();

                              handleClickOpen(props?.RowData, "Archived");
                            }}
                            className=" w-125px text-dark"
                          >
                            <i className="fa fa-archive mr-2 text-success"></i>
                            {t("Archive")}
                          </a>
                        </MenuItem>
                      </PermissionComponent>
                    </>
                  ) : null}
                </>
              ) : (
                <>
                  {tabIdToSend === 2 ||
                  tabIdToSend === 3 ||
                  tabIdToSend === 4 ? (
                    <>
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="View"
                      >
                        <MenuItem
                          id="ManageFacilityRowView"
                          onClick={handleClose}
                          className=" w-125px p-0"
                        >
                          <Link
                            className="text-dark w-100 h-100"
                            to={`/facility-view/${btoa(
                              props?.RowData?.FacilityId
                            )}`}
                          >
                            <i className="fa fa-eye text-success mr-2 w-20px"></i>
                            {t("View")}
                          </Link>
                        </MenuItem>
                      </PermissionComponent>
                      <PermissionComponent
                        moduleName="Facility"
                        pageName="Manage Facility"
                        permissionIdentifier="Active"
                      >
                        <MenuItem
                          onClick={handleClose}
                          className=" w-125px p-0"
                        >
                          <a
                            id="ManageFacilityActive2"
                            onClick={() => {
                              handleClose();
                              handleClickOpen(props?.RowData, "Active");
                            }}
                            className=" w-125px text-dark"
                          >
                            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                            {t("Active")}
                          </a>
                        </MenuItem>
                      </PermissionComponent>
                    </>
                  ) : (
                    <PermissionComponent
                      moduleName="Facility"
                      pageName="Manage Facility"
                      permissionIdentifier="View"
                    >
                      <MenuItem
                        id="ManageFacilityView3"
                        onClick={handleClose}
                        className="p-0"
                      >
                        <Link
                          className="text-dark w-100 h-100"
                          to={`/facility-view/${btoa(
                            props?.RowData?.FacilityId
                          )}`}
                        >
                          <i className="fa fa-eye text-success mr-2 w-20px"></i>
                          {t("View")}
                        </Link>
                      </MenuItem>
                    </PermissionComponent>
                  )}
                </>
              )}
            </StyledDropMenuMoreAction>
          </TableCell>
          {props?.tabsInfo &&
            props?.tabsInfo.map((tabData: any) =>
              tabData?.isShowOnUi && tabData?.isShow ? (
                <TableCell
                  sx={{ width: "max-content", whiteSpace: "nowrap" }}
                  key={tabData.id}
                >
                  {props?.RowData[tabData?.columnKey]}
                </TableCell>
              ) : null
            )}
        </TableRow>
      )}
      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse in={collapseOpen} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <ViewReferenceLab id={props?.RowData?.FacilityId} />
                      <ViewAssignedUsers id={props?.RowData?.FacilityId} />
                      <AssignedSalesRep id={props?.RowData?.FacilityId} />
                      <PharmDPreference id={props?.RowData?.FacilityId} />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <BootstrapModal
        show={openAlert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Status")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to change status ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("No")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => onFacilityStatusChange(props?.RowData, status)}
          >
            <span>{t("Yes")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};

export default React.memo(Row);
