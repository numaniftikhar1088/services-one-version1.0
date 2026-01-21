import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import React, { memo } from "react";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { Modal } from "react-bootstrap";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Select from "react-select";
import { toast } from "react-toastify";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../../../Shared/Icons";
import PermissionComponent from "../../../../../Shared/Common/Permissions/PermissionComponent";
import { reactSelectSMStyle, styles } from "../../../../../Utils/Common";
import AOEsExpand from "./AOEsExpand";
import { IRows } from ".";
import useLang from "Shared/hooks/useLanguage";
import {
  AOEsDeleteById,
  SaveOrUpdateAOEs,
} from "Services/InfectiousDisease/AOEForIDService";
import { validateFields } from "Pages/LIS/Toxicology/CommonFunctions";

const Row = (props: {
  rows: any;
  row: IRows;
  request: any;
  setRows: any;
  index: number;
  setRequest: any;
  dropDownValues: any;
  AssayLookup: any;
  PanelLookUp: any;
  loadGridData: any;
  setDropDownValues: any;
  queryDisplayTagNames: any;
  setIsAddButtonDisabled: any;
}) => {
  const {
    row,
    rows,
    index,
    setRows,
    request,
    setRequest,
    AssayLookup,
    PanelLookUp,
    loadGridData,
    dropDownValues,
    setDropDownValues,
    queryDisplayTagNames,
    setIsAddButtonDisabled,
  } = props;

  const { t } = useLang();

  const [open, setOpen] = React.useState(false);
  const [show, setShow] = React.useState(false);

  const ModalhandleClose = () => setShow(false);

  const getValues = (r: any, action: string) => {
    if (action === "Edit") {
      PanelLookUp(row?.performingLabId);
      AssayLookup(row?.performingLabId, row?.panelId);
      const updatedRows = rows.map((row: any) => {
        if (row.id === r.id) {
          return { ...row, rowStatus: true };
        }
        return row;
      });

      setRows(updatedRows);
    }
  };

  const handleChange = (name: string, value: any, id: number) => {
    if (name === "performingLabId") {
      PanelLookUp(value);
    }
    if (name === "panelId") {
      AssayLookup(row?.performingLabId, value);
    }

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

  const handleSubmit = async () => {
    const { isValid, invalidField } = validateFields({
      performingLabId: row.performingLabId,
      panelId: row.panelId,
      assayId: row.assayId,
    });

    if (isValid) {
      const submittedResults = {
        id: row.id,
        performingLabId: row.performingLabId,
        panelId: row.panelId,
        assayId: row.assayId,
        reqTypeId: 4,
      };
      try {
        const response = await SaveOrUpdateAOEs(submittedResults);

        if (response?.data?.httpStatusCode === 200) {
          toast.success(response?.data?.message);
          loadGridData(true, false);
          setDropDownValues((prev: any) => ({
            ...prev,
            PanelList: [],
            AssayList: [],
          }));
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(t("Something went wrong while saving data."));
        console.error("Error:", error);
      }
    } else {
      const errorMessage = invalidField
        ? `Please Fill ${queryDisplayTagNames[invalidField] ?? ""} field`
        : "Invalid field found";
      toast.error(errorMessage);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      const response = await AOEsDeleteById(id);
      if (response?.data?.httpStatusCode === 200) {
        toast.success(response?.data?.message);
        loadGridData(true, false);
      } else {
        toast.error(response?.data?.message);
      }
    } catch (error) {
      toast.error(t("Something went wrong while deleting data."));
      console.error("Error:", error);
    }
  };

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {!row.rowStatus ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={() => setOpen(!open)}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                {open ? (
                  <button
                    id={`IDCompendiumDataPanelMapingCloseExpand_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`IDCompendiumDataPanelMapingShowExpand_${row.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </IconButton>
            ) : null}
          </div>
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            {row.rowStatus ? (
              <>
                <div className="gap-2 d-flex">
                  {request ? (
                    <button
                      id="PanelMapingLoadButton"
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <LoaderIcon />
                    </button>
                  ) : (
                    <button
                      id="PanelMapingSaveRow"
                      onClick={() => handleSubmit()}
                      className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                    >
                      <DoneIcon />
                    </button>
                  )}
                  <button
                    id="PanelMapingCloseRow"
                    onClick={() => {
                      if (row.id !== 0) {
                        const updatedRows = rows.map((r: any) => {
                          if (r.id === row.id) {
                            return { ...r, rowStatus: false };
                          }
                          return r;
                        });
                        setRows(updatedRows);
                        loadGridData(true, false);
                      } else {
                        const newArray = [...rows];
                        newArray.splice(index, 1);
                        setRows(newArray);
                        setIsAddButtonDisabled(false);
                      }
                      setDropDownValues((prev: any) => ({
                        ...prev,
                        PanelList: [],
                        AssayList: [],
                      }));
                      setRequest(false);
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
                  id={`IDCompendiumDataPanelMaping3Dots_${row.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <>
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Edit"
                    >
                      <Dropdown.Item
                        id={`IDCompendiumDataPanelMapingEdit`}
                        className="w-auto"
                        eventKey="2"
                        onClick={() => getValues(row, "Edit")}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-edit mr-2 text-primary"
                            style={{ fontSize: "16px" }}
                          ></i>
                          {t("Edit")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                    <PermissionComponent
                      moduleName="ID LIS"
                      pageName="Compendium Data"
                      permissionIdentifier="Delete"
                    >
                      <Dropdown.Item
                        id={`IDCompendiumDataPanelMapingEdit`}
                        className="w-auto"
                        eventKey="3"
                        // onClick={() => getValues(row, "Edit")}
                        onClick={() => setShow(true)}
                      >
                        <span className="menu-item px-3">
                          <i
                            className="fa fa-trash text-danger mr-2"
                            style={{ fontSize: "16px" }}
                          ></i>
                          {t("Delete")}
                        </span>
                      </Dropdown.Item>
                    </PermissionComponent>
                  </>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingPerformingLab_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingPerformingLab`}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.PerformingLabList}
                  onChange={(event: any) =>
                    handleChange("performingLabId", event.value, row?.id)
                  }
                  value={dropDownValues?.PerformingLabList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.performingLabId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.performingLabName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingPanelName_${row.id}`}
          scope="row"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingPerformingLab`}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.PanelList}
                  onChange={(event: any) =>
                    handleChange("panelId", event.value, row?.id)
                  }
                  value={dropDownValues?.PanelList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.panelId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.panelName}</span>
          )}
        </TableCell>
        <TableCell
          id={`IDCompendiumDataPanelMapingAssayDataList_${row.id}`}
          align="left"
        >
          {row.rowStatus ? (
            <div className="required d-flex">
              <div className="w-100">
                <Select
                  inputId={`IDCompendiumDataPanelMapingPerformingLab`}
                  menuPortalTarget={document.body}
                  placeholder={t("Select...")}
                  styles={reactSelectSMStyle}
                  theme={(theme) => styles(theme)}
                  options={dropDownValues?.AssayList}
                  onChange={(event: any) =>
                    handleChange("assayId", event.value, row?.id)
                  }
                  value={dropDownValues?.AssayList.filter(function (
                    option: any
                  ) {
                    return option.value === row?.assayId;
                  })}
                />
              </div>
            </div>
          ) : (
            <span>{row?.assayName}</span>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={16} className="padding-0">
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className=" table-expend-sticky">
                  <div className="row">
                    <div className="col-lg-12 bg-white px-lg-14 pb-6">
                      <AOEsExpand key={row.id} row={row} setOpen={setOpen} />
                    </div>
                  </div>
                </div>
              </Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
      <Modal
        show={show}
        onHide={ModalhandleClose}
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
            type="button"
            className="btn btn-secondary"
            onClick={ModalhandleClose}
          >
            {t("Cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger m-2"
            onClick={() => {
              ModalhandleClose();
              handleDelete(row.id);
            }}
          >
            {t("Delete")}
          </button>
        </Modal.Footer>
      </Modal>
    </React.Fragment>
  );
};

export default memo(Row);
