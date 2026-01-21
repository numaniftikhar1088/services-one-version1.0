import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import MenuItem from "@mui/material/MenuItem";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, LoaderIcon, RemoveICon } from "../../Shared/Icons";
import { Encrypt } from "../../Utils/Auth";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../Utils/Style/Dropdownstyle";
import { useNavigate } from "react-router-dom";
import ViewAssignedUsers from "./ViewAssignedUsers";
import ViewReferenceLab from "./ViewReferenceLab";

interface Props {
  facilityUserList: any;
  selectedBox: any;
  handleChangeFacilityIds: any;
  tabKey: any;
  onFacilityStatusChange: any;
  item: any;
  check: any;
  open: any;
  setOpen: any;
}
const FacilityListExpandableTable: React.FC<Props> = ({
  facilityUserList,
  selectedBox,
  handleChangeFacilityIds,
  tabKey,
  onFacilityStatusChange,
  item,
  check,
  open,
  setOpen,
}) => {
  const { t } = useLang();
  const [Duplicate, setDuplicate] = useState<any>(false);
  const [value, setValue] = useState<any>({
    item: [],
    status: "",
  });

  let id = item.facilityId;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const pageLinks = useSelector((reducers: any) => reducers.Reducer?.links);
  const { pathname } = useLocation();

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
  const [openalert, setOpenAlert] = React.useState(false);

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleClickOpen = (item: any, status: string) => {
    setOpenAlert(true);
    setValue(() => {
      return {
        item: item,
        status: status,
      };
    });
  };

  const isQaLink = window.location.origin === "https://demolab.perfectlims.com";

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
    navigate(`/dynamic-facility?id=${item?.facilityId}&pageId=${getPageId()}`);
    console.log(item, "e.target");
  };

  return (
    <>
      <TableRow>
        <>
          <TableCell className="w-30px" id={`ExpandRow_${item.facilityId}`}>
            <span onClick={() => setDuplicate(!Duplicate)}>
              {Duplicate || open ? (
                <button
                  id={`ManageFacilityHide_${item.facilityId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                >
                  <RemoveICon />
                </button>
              ) : (
                <button
                  id={`ManageFacilityShow_${item.facilityId}`}
                  className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                >
                  <AddIcon />
                </button>
              )}
            </span>
          </TableCell>
          <TableCell className="w-30px" id={`CheckBox_${item.facilityId}`}>
            <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
              <input
                id={`ManageFacilityCheckbox_${item.facilityId}`}
                className="form-check-input"
                type="checkbox"
                onChange={(e) =>
                  handleChangeFacilityIds(e.target.checked, item.facilityId)
                }
                checked={selectedBox.facilityIds.includes(item.facilityId)}
              />
            </label>
          </TableCell>

          <TableCell
            className="text-center w-30px"
            id={`ThreeDots_${item.facilityId}`}
          >
            <StyledDropButtonThreeDots
              id={`ManageFacility3Dots_${item.facilityId}`}
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
              {/* <a href="/MyFavourite" target="blank"> */}
              {tabKey === 0 ? (
                <PermissionComponent
                  moduleName="Facility"
                  pageName="Manage Facility"
                  permissionIdentifier="GoToPortal"
                >
                  <MenuItem
                    id="ManageFacilityGoToPortal"
                    onClick={() => {
                      //
                      handleClose();
                      //dispatch(dispatch(setFacility(item)));
                      let queryString = Object.keys(item)
                        .map((key) => key + "=" + encodeURIComponent(item[key]))
                        .join("&");

                      let encryptedQueryString = Encrypt(queryString);
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
              {/* </a> */}
              {tabKey === 0 ? (
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
                        to={`/editfacility/${btoa(item?.facilityId)}`}
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
                        onClick={() => handleNavigate(item)}
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
                        to={`/facility-view/${btoa(item?.facilityId)}`}
                      >
                        <i className="fa fa-eye text-success mr-2 w-20px"></i>
                        {t("View")}
                      </Link>
                    </MenuItem>
                  </PermissionComponent>
                  {tabKey === 0 || tabKey === 1 ? (
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
                            handleClickOpen(item, "Suspend");
                          }}
                          className=" w-125px text-dark"
                        >
                          <i className="fa fa-pause text-danger mr-2 w-20px"></i>
                          {t("Suspend")}
                        </a>
                      </MenuItem>
                    </PermissionComponent>
                  ) : null}
                  {tabKey === 0 ? (
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

                              handleClickOpen(item, "InActive");
                            }}
                            className=" w-125px text-dark"
                          >
                            <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                            {t("Inactivate")}
                          </a>
                        </MenuItem>
                      </PermissionComponent>
                      {/* <MenuItem
                        onClick={() => {
                          handleClose()
                          onFacilityStatusChange(item, 'Rejected')
                        }}
                        className=" w-200px"
                      >
                        <i className="fa fa-close mr-3 text-danger"></i>
                        Rejected
                      </MenuItem> */}
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

                              handleClickOpen(item, "Archived");
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
                  {tabKey == 1 || tabKey == 2 ? (
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
                            to={`/facility-view/${btoa(item?.facilityId)}`}
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
                              handleClickOpen(item, "Active");
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
                        className=" w-125px p-0"
                      >
                        <Link
                          className="text-dark w-100 h-100"
                          to={`/facility-view/${btoa(item?.facilityId)}`}
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
          <TableCell className="w-30px" id={`FacilityId_${item.facilityId}`}>
            {item?.facilityId}
          </TableCell>
          <TableCell className="w-30px" id={`FacilityNmae_${item.facilityId}`}>
            {item?.facilityName}
          </TableCell>
          <TableCell className="w-30px" id={`Adress1_${item.facilityId}`}>
            {item?.address1}
          </TableCell>
          <TableCell
            className="w-30px"
            id={`ContactFirstName_${item.facilityId}`}
          >
            {item?.contactFirstName}
          </TableCell>
          <TableCell className="w-30px" id={`PhoneNumber_${item.facilityId}`}>
            {item?.contactPhone}
          </TableCell>
          <TableCell className="w-30px" id={`Email_${item.facilityId}`}>
            {item?.facilityEmail}
          </TableCell>
        </>
      </TableRow>

      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse in={open ? open : Duplicate} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <ViewReferenceLab id={id} />
                      <ViewAssignedUsers id={id} />
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
          <h4>{t("Status Change")}</h4>
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
            onClick={() => onFacilityStatusChange(value.item, value.status)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>{" "}
            <span>
              {""} {t("Yes")}
            </span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};
export default FacilityListExpandableTable;
