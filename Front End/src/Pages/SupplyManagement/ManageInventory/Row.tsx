import {
  Box,
  Collapse,
  IconButton,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { AxiosResponse } from "axios";
import React, { useState } from "react";
import { Modal } from "react-bootstrap";
import InsuranceService from "../../../Services/InsuranceService/InsuranceService";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { AddIcon, RemoveICon } from "../../../Shared/Icons";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "../../../Utils/Style/Dropdownstyle";
import ExpandableRow from "./ExpandableRow";
import useLang from "Shared/hooks/useLanguage";

function Row(props: {
  row: any;
  rows: any;
  setRows: any;
  index: number;
  handleDelete: Function;
  handleChangeSelectedIds: Function;
  selectedBox: any;
  setModalShow: Function;
  setTestingSupplies: Function;
  setValue: any;
}) {
  const { t } = useLang();

  const {
    row,
    handleDelete,
    handleChangeSelectedIds,
    selectedBox,
    rows,
    setModalShow,
    setTestingSupplies,
    setValue,
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openDrop = Boolean(anchorEl);
  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const [open, setOpen] = useState(false);
  const [val, setVal] = useState<any>(null);
  const [facilityBalance, setFacilityBalance] = useState<any>(null);
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleClickOpen = (userid: any) => {
    setShow1(true);
    setVal(userid);
  };
  const GetFacilityBalanceById = async () => {
    setLoading(true);
    await InsuranceService.GetFacilityBalanceById(row?.id).then(
      (res: AxiosResponse) => {
        setFacilityBalance(res?.data?.data?.inventoryItemFacilityBalanceData);
        setLoading(false);
      }
    );
  };
  const getValues = (r: any) => {
    handleClose();
    setModalShow(true);
    const row = rows.find((row: any) => row.id === r.id);
    for (const [key, value] of Object.entries(row)) {
      setValue(key, value);
    }
    setTestingSupplies(row);
  };
  return (
    <>
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
          {t("Are you sure you want to delete this record ?")}
        </Modal.Body>
        <Modal.Footer className="p-0">
          <button
            id={`ManageInventoryModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t("Cancel")}
          </button>
          <button
            id={`ManageInventoryModalDelete`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              handleDelete(val);
              ModalhandleClose1();
            }}
          >
            {t("Delete")}
          </button>
        </Modal.Footer>
      </Modal>
      <TableRow className="h-30px">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => {
              setOpen(!open);
            }}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {open ? (
              <button
                id={`ManageInventoryCloseExpand_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                id={`ManageInventoryOpenExpand_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                onClick={GetFacilityBalanceById}
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
            <input
              id={`ManageInventoryOpenExpandCheckBox_${row.id}`}
              className="form-check-input"
              type="checkbox"
              checked={selectedBox?.ids?.includes(row?.id)}
              onChange={(e) =>
                handleChangeSelectedIds(e.target.checked, row.id)
              }
            />
          </label>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`ManageInventory3Dots_${row.id}`}
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
              <PermissionComponent
                moduleName="Supply Management"
                pageName="Manage Inventory"
                permissionIdentifier="Edit"
              >
                <MenuItem className="p-0">
                  <a
                    id={`ManageInventoryEdit`}
                    onClick={() => getValues(row)}
                    className="w-auto p-0 text-dark"
                  >
                    <i className="fa fa-edit text-warning mr-2 w-20px"></i>
                    {t("Edit")}
                  </a>
                </MenuItem>
              </PermissionComponent>
              <PermissionComponent
                moduleName="Supply Management"
                pageName="Manage Inventory"
                permissionIdentifier="Delete"
              >
                <MenuItem className="p-0">
                  <a
                    id={`ManageInventoryDelete`}
                    onClick={() => {
                      handleClose();
                      handleClickOpen(row.id);
                    }}
                    className="w-auto p-0 text-dark"
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
          id={`ManageInventoryItemName_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.itemName}
        </TableCell>

        <TableCell
          id={`ManageInventoryItemDescription_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.itemDescription}
        </TableCell>
        <TableCell
          id={`ManageInventoryItemBarCode_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.itemBarCode}
        </TableCell>
        <TableCell
          id={`ManageInventoryItemType_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.itemType}
        </TableCell>

        <TableCell
          id={`ManageInventoryQuantityPerItem_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.quantityPerItemSet}
        </TableCell>
        <TableCell
          id={`ManageInventoryQuantity_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.quantity}
        </TableCell>
        <TableCell
          id={`ManageInventoryLowQuantityAlert_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.lowQuantityAlert}
        </TableCell>
        <TableCell
          id={`ManageInventoryRequisitionName_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.requisitionTypeName}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={13} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white">
                    <ExpandableRow
                      facilityBalance={facilityBalance}
                      loading={loading}
                    />
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Row;
