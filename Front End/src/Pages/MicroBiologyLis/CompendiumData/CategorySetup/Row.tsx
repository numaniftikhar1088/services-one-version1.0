import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { CannedAndRejectionSave } from "../../../../Services/BloodLisSetting/BloodLisSetting";
import useLang from "../../../../Shared/hooks/useLanguage";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  RemoveICon,
} from "../../../../Shared/Icons";
import CategoryTestList from "./CategoryTest";
import { MicroBioPanelSetupSaveData } from "Services/MicroBiologyCompendium/MicrobiologyCompendium";

function CategorySetupRow({
  row,
  index,
  onDelete,
  rows,
  setRows,
  setIsAddButtonDisabled,
  GetAllCategorySetupData,
}: any) {
  const { t } = useLang();
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
  const [disableSaveBbutton, setDisableSaveBbutton] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const [isExpand, setIsExpand] = useState<boolean>(false);

  const handleClickOpen = (item: any, status: string) => {
    handleClose("dropdown2");
    setOpenAlert(true);
  };

  const showExpand = () => {
    setIsExpand(!isExpand);
  };

  const getValues = (r: any) => {
    const updatedRows = rows.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setRows(updatedRows);
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

  const handlesave = async () => {
    if (row.panelName.length === 0 && row.panelName.length === 0) {
      toast.error(t("Please Enter Category Name."));
      return;
    }
    if (row.orderCode.length === 0) {
      toast.error("Please Enter Order Code.");
      return;
    }
    if (row.displayNameLIS.length === 0) {
      toast.error("Please Enter Display Name In LIS.");
      return;
    }
    setDisableSaveBbutton(true);
    let resp = await MicroBioPanelSetupSaveData(row);
    if (resp?.data?.httpStatusCode === 200) {
      setDisableSaveBbutton(false);
      GetAllCategorySetupData();
      setIsAddButtonDisabled(false);
      handleClose("dropdown2");
      toast.success(resp?.data?.message);
    } else {
      toast.error(resp?.data?.message || "Something went wrong.");
    }
  };
  
  return (
    <>
      <TableRow className="h-30px">
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={showExpand}
            className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px"
          >
            {isExpand ? (
              <button
                id={`BloodCompendiumDataCategorySetupExpandClose_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                <RemoveICon />
              </button>
            ) : (
              <button
                id={`BloodCompendiumDataCategorySetupExpandOpen_${row.id}`}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              >
                <AddIcon />
              </button>
            )}
          </IconButton>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row?.rowStatus ? (
              <div className="gap-2 d-flex">
                <button
                  disabled={disableSaveBbutton}
                  id={`MicrobiologuCompendiumSave`}
                  onClick={() => {
                    handlesave();
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <DoneIcon />
                </button>
                <button
                  id={`MicrobiologuCompendiumCancel`}
                  onClick={() => {
                    GetAllCategorySetupData();
                    handleClose("dropdown2");
                    if (row?.id != 0) {
                      const updatedRows = rows.map((r: any) => {
                        if (r.id === row?.id) {
                          return { ...r, rowStatus: false };
                        }
                        return r;
                      });
                      setRows(updatedRows);
                    } else {
                      let newArray = [...rows];
                      newArray.splice(index, 1);
                      setRows(newArray);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                >
                  <CrossIcon />
                </button>
              </div>
            ) : (
              <div className="rotatebtnn">
                <DropdownButton
                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                  key="end"
                  id={`MicrobiologuCompendium3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`MicrobiologuCompendiumEdit`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => {
                        getValues(row);
                      }}
                    >
                      <i className={"fa fa-edit text-primary mr-2"}></i>
                      {t("Edit")}
                    </Dropdown.Item>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="Microbiology LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`MicrobiologuCompendiumDelete`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => handleClickOpen(row, row.id)}
                    >
                      <i className={"fa fa-trash text-danger mr-2 w-20px"}></i>
                      {t("Delete")}
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`MicrobiologuCompendiumDisplayName_${row.id}`}
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologuCompendiumpanelName`}
                type="text"
                placeholder={t("Display Name")}
                name="panelName"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.panelName}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.panelName
          )}
        </TableCell>
        <TableCell
          id={`MicrobiologuCompendiumDisplayText_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologuCompendiumorderCode`}
                type="text"
                placeholder={t("Display Text")}
                name="orderCode"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.orderCode}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.orderCode
          )}
        </TableCell>
        <TableCell
          id={`MicrobiologuCompendiumDisplayText_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row?.rowStatus ? (
            <div className="required d-flex">
              <input
                id={`MicrobiologuCompendiumdisplayNameLIS`}
                type="text"
                placeholder={t("Display Text")}
                name="displayNameLIS"
                className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
                value={row?.displayNameLIS}
                onChange={(e) =>
                  handleChange(e.target.name, e.target.value, row?.id)
                }
              />
            </div>
          ) : (
            row?.displayNameLIS
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={9} className="padding-0">
          <Collapse in={isExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 px-md-10 px-4 pb-6">
                      <CategoryTestList
                        row={row}
                        isExpand={isExpand}
                        setIsExpand={setIsExpand}
                        GetAllCategorySetupData={GetAllCategorySetupData}
                      />
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
            id={`MicrobiologuCompendiumModalCancel_${row.id}`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`MicrobiologuCompendiumModalDelete_${row.id}`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(row?.id)}
          >
            {t("Delete")}
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default CategorySetupRow;
