import {
  Box,
  Collapse,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import BootstrapModal from "react-bootstrap/Modal";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import { savePdfUrls } from "../../../Redux/Actions/Index";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../Utils/Style/Dropdownstyle";

function SalesRepRow({ row, onEdit, setTabsData2, onDelete }: any) {
  const { t } = useLang();
  const [salesRep, setSalesRep] = useState(false);
  const ShowSalesRep = () => {
    if (salesRep == false) {
      setSalesRep(true);
    } else {
      setSalesRep(false);
    }
  };
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  const handleDelete = (id: number) => {
    onDelete(id);
  };
  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (row: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };

  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace("}", ""), "_blank");
    });
  };
  const dispatch = useDispatch();
  console.log(row);

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          {salesRep ? (
            <button
              id={`TrainingDocumentSaleRepCloseExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              onClick={ShowSalesRep}
            >
              <i className="bi bi-dash-lg" />
            </button>
          ) : (
            <button
              id={`TrainingDocumentSaleRepOpenExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              onClick={ShowSalesRep}
            >
              <i className="bi bi-plus-lg" />
            </button>
          )}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`TrainingDocumentSaleRep3Dots_${row.id}`}
              aria-haspopup="true"
              onClick={(event) => handleClick(event, "dropdown2")}
              className="btn btn-light-info btn-sm btn-icon moreactions min-w-auto rounded-4"
            >
              <i className="bi bi-three-dots-vertical p-0 icon"></i>
            </StyledDropButtonThreeDots>
            <StyledDropMenuMoreAction
              aria-labelledby="demo-positioned-button"
              anchorEl={anchorEl.dropdown2}
              open={Boolean(anchorEl.dropdown2)}
              onClose={() => handleClose("dropdown2")}
              anchorOrigin={{ vertical: "top", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
            >
              <PermissionComponent
                moduleName="Marketing"
                pageName="Training Documents"
                permissionIdentifier="Edit"
              >
                <MenuItem
                  className=" w-100px p-0 text-dark"
                  onClick={() => setTabsData2(false)}
                >
                  <Link
                    id={`TrainingDocumentSaleRepEdit`}
                    className="text-dark w-100 h-100"
                    to={``}
                    onClick={() => onEdit(row)}
                  >
                    <i className="fa fa-edit text-primary mr-2 w-20px" />
                    {t("Edit")}
                  </Link>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Marketing"
                pageName="Training Documents"
                permissionIdentifier="Delete"
              >
                <MenuItem className="p-0">
                  <a
                    id={`TrainingDocumentSaleRepDelete`}
                    onClick={() => handleClickOpen(row, row.id)}
                    className=" w-100px p-0 text-dark"
                  >
                    <i
                      className="fa fa-trash text-danger mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Delete")}
                  </a>
                </MenuItem>
              </PermissionComponent>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepFileName_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">{row.fileName}</div>
        </TableCell>
        <TableCell id={`TrainingDocumentSaleRepDownload_${row.id}`}>
          <div className="d-flex justify-content-center">
            <button
              id={`TrainingDocumentSaleRepDownloadButton_${row.id}`}
              className="btn btn-icon btn-sm fw-bold btn-success btn-icon-light h-30px w-30px"
              disabled={row.filePath == null ? true : false}
              onClick={() => ShowBlob(row.filePath)}
            >
              <i className="fa fa-download"></i>
            </button>
          </div>
        </TableCell>
        <TableCell id={`TrainingDocumentSaleRepView_${row.id}`}>
          <Link to={`/docs-viewer`} target="_blank">
            <div className="d-flex justify-content-center">
              <button
                id={`TrainingDocumentSaleRepViewButton_${row.id}`}
                className="btn btn-icon btn-sm fw-bold btn-warning btn-icon-light h-30px w-30px"
                onClick={() => {
                  dispatch(savePdfUrls(row.filePath));
                }}
              >
                <i className="fa fa-eye cursor-pointer"></i>
              </button>
            </div>
          </Link>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepDescription_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            {row.trainingAidsDescription}
          </div>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepCategory_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.categoryName}</div>
          </div>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepUploadDate_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.uploadDate}</div>
          </div>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepUploadTime_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.uploadTime}</div>
          </div>
        </TableCell>
        <TableCell
          id={`TrainingDocumentSaleRepUploadBy_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between  ">
            <div style={{ width: "max-content" }}>{row.uploadBy}</div>
          </div>
        </TableCell>
      </TableRow>

      <TableRow>
        <TableCell colSpan={12} className="padding-0">
          <Collapse in={salesRep} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <div className="card shadow-sm rounded border border-warning mt-3">
                      <div className="card-header d-flex justify-content-between align-items-center bg-light-secondary min-h-35px">
                        <h6 className="mb-0">{t("All Sales Rep")}</h6>
                      </div>
                      <div className="card-body py-md-4 py-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                          <span className="text-primary fw-bold">
                            {t("Sales Rep")}
                          </span>
                          {/* <span className="text-primary fw-bold">
                            {t("Facility Name")}
                          </span> */}
                          <div className="row mt-3">
                            {row.trainingAidsDetails.map((data: any) => (
                              <div
                                id={`TrainingDocumentSaleRep_${data.id}`}
                                className="col-xl-3 col-lg-3 col-md-3 col-sm-6 "
                              >
                                {data?.salesRepName}
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
        BootstrapModal
        show={openalert}
        onHide={handleCloseAlert}
        backdrop="static"
        keyboard={false}
      >
        <BootstrapModal.Header closeButton className="bg-light-primary m-0 p-5">
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`TrainingDocumentSaleRepDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`TrainingDocumentSaleRepDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}
export default SalesRepRow;
