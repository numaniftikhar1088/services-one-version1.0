import { IconButton } from "@mui/material";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import React from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import BootstrapModal from "react-bootstrap/Modal";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, LoaderIcon, RemoveICon } from "../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
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
}
const FacilityListExpandableTable: React.FC<Props> = ({
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
}) => {
  const { t } = useLang();

  function capitalizeFirstLetter(str: any) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  const [open1, setOpen1] = React.useState(false);
  const [openalert, setOpenAlert] = React.useState(false);
  const handleCloseAlert = () => {
    setOpenAlert(false);
  };
  const handleClickOpen = () => {
    setOpenAlert(true);
  };
  return (
    <>
      <TableRow>
        <TableCell className="text-center">
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen1(!open1)}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {open1 ? (
              <button
                id={`SpecimenTypeAssigmentCloseExpand_${item.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold rounded h-10px w-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                id={`SpecimenTypeAssigmentOpenExpand_${item.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell className="text-center">
          <div className="rotatebtnn">
            <DropdownButton
              className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
              key="end"
              id={`SpecimenTypeAssigment3Dots_${item.id}`}
              drop="end"
              title={<i className="bi bi-three-dots-vertical p-0"></i>}
            >
              {item?.isactive === true ? (
                <>
                  <PermissionComponent
                    moduleName="Setup"
                    pageName="Specimen Type Assignment"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`SpecimenTypeAssigmentEdit`}
                      className="w-auto"
                      eventKey="1"
                      onClick={() => {
                        Edit(item);
                        handleClose();
                        setOpen(false);
                      }}
                    >
                      <div className="menu-item px-3">
                        <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                        {t("Edit")}
                      </div>
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Setup"
                    pageName="Specimen Type Assignment"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`SpecimenTypeAssigmentDelete`}
                      eventKey="2"
                      onClick={handleClickOpen}
                      className="w-auto"
                    >
                      <div className="menu-item px-3">
                        <i className="fa fa-trash text-danger mr-2 w-20px"></i>
                        {t("Delete")}
                      </div>
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Setup"
                    pageName="Specimen Type Assignment"
                    permissionIdentifier="Inactive"
                  >
                    <Dropdown.Item
                      id={`SpecimenTypeAssigmentInactive`}
                      className="w-auto"
                      onClick={() => {
                        statusChange(item?.id, item?.isactive);
                      }}
                      eventKey="3"
                    >
                      <div className="menu-item px-3">
                        <i className="fa fa-ban text-danger mr-2 w-20px"></i>
                        {t("InActive")}
                      </div>
                    </Dropdown.Item>
                  </PermissionComponent>
                </>
              ) : (
                <Dropdown.Item
                  id={`SpecimenTypeAssigmentActive`}
                  onClick={() => {
                    statusChange(item?.id, item?.isactive);
                  }}
                  className="w-auto"
                  eventKey="3"
                >
                  <PermissionComponent
                    moduleName="Setup"
                    pageName="Specimen Type Assignment"
                    permissionIdentifier="Active"
                  >
                    <span className="mr-2 ">
                      <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
                      {t("Active")}
                    </span>
                  </PermissionComponent>
                </Dropdown.Item>
              )}
            </DropdownButton>
          </div>
        </TableCell>
        <TableCell id={`SpecimenTypeAssigmentSpecimenType_${item.id}`}>
          {item?.specimenType}
        </TableCell>
        <TableCell id={`SpecimenTypeAssigmentRequisitionType_${item.id}`}>
          {item?.requisitionTypeName}
        </TableCell>
        <TableCell id={`SpecimenTypeAssigmentRequisitionType_${item.id}`}>
          {item?.refLabName}
        </TableCell>
        <TableCell
          id={`SpecimenTypeAssigmentStatus_${item.id}`}
          className="text-center"
        >
          {item?.isactive ? (
            <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
          ) : (
            <i className="fa fa-ban text-danger mr-2 w-20px"></i>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={7} className="padding-0">
          <Collapse in={open1} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-5 py-2">
                    <h5 className="text-primary fw-700">
                      {t("Selected Panels")}
                    </h5>
                    <div className="col-lg-12 col-md-12 col-sm-12 col-xl-12 d-flex flex-wrap gap-2">
                      {row.map((i: any) => (
                        <div
                          id={`SpecimenTypeAssigment_${i.panelId}`}
                          className="badge badge-secondary round-2 py-2 my-2 fs-7"
                        >
                          {capitalizeFirstLetter(i.panelDisplayName)}
                        </div>
                      ))}
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
          <h4>{t("Delete Menu")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`SpecimenTypeAssigmentDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`SpecimenTypeAssigmentDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => DeleteSpecimenTypeAssignmentById(item?.id)}
          >
            <span>{check ? <LoaderIcon /> : null}</span>
            <span>
              {""} {t("Delete")}
            </span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
};
export default FacilityListExpandableTable;
