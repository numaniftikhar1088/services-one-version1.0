import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";
import BootstrapModal from "react-bootstrap/Modal";

import { Loader } from "../../../../Shared/Common/Loader";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import {
  AddIcon,
  CrossIcon,
  DoneIcon,
  LoaderIcon,
  RemoveICon,
} from "../../../../Shared/Icons";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

interface Sales {
  value: number;
  label: string;
}

function SalesTableRow({
  item,
  onDelete,
  deleting,
  handleSave,
  fetchSalesTable,
  setEditedItem,
  editedItem,
  searchTerm,
  loading,
  filteredLookup,
  selectedSearchTerm, // Ensure this is being passed
  handleSalesSelected,
  handleSalesBack,
  resetFormData,
  setEditSelectedSales,
  filteredEditSelectedSales,
  getBulletinSalesLookup,
  error,
  setError,
  loadingLookup,
  setLoadingLookup,
  setSearchTerm,
  setSelectedSearchTerm,
  editedSelectedSales,
  lookup,
}: any) {
  const { t } = useLang();
  const isMobile = useIsMobile();

  // EDITING STATE
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // EXPAND FAACILTIES ICON
  const [expandSaleReps, setExpandSaleReps] = useState<boolean>(false);

  /* ##############------------ <<<SALES SEARCH STARTS>>>  ---------############## */

  /* ##############------------ <<<ON CHANGE STARTS>>>  ---------############## */

  // ?  HANDLE CHANGE ALL Sales
  const handleSalesSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // ?  HANDLE CHANGE [---SELECTED SALES---] SALES
  const handleSelectedSalesSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSelectedSearchTerm(event.target.value);
  };

  /* ##############------------ <<<ON CHANGE END>>>  ---------############## */

  // ? ############ EDITING CASE ################
  // Filtering  [ SELECTED ] SALES based on <SEARCH BASED LOOKUP>
  const filteredEditSelections = editedSelectedSales.filter((sale: Sales) =>
    sale.label.toLowerCase().startsWith(selectedSearchTerm?.toLowerCase())
  );

  // Function to remove duplicates from an array based on 'value'
  const removeDuplicates = (arr: Sales[]): Sales[] => {
    const uniqueValues = new Set<number>();
    return arr.filter((item) => {
      if (uniqueValues.has(item.value)) {
        return false;
      } else {
        uniqueValues.add(item.value);
        return true;
      }
    });
  };
  // Remove duplicates from the lookup array
  const uniqueLookup = removeDuplicates(lookup);

  const lookupForEdit = uniqueLookup.filter(
    (lookupItem: Sales) =>
      !editedSelectedSales.some(
        (selectedItem: Sales) => selectedItem.value === lookupItem.value
      )
  );

  const filteredLookupForEdit = lookupForEdit.filter((saleItem: Sales) =>
    saleItem?.label
      ?.toLowerCase()
      .startsWith(searchTerm ? searchTerm?.toLowerCase() : "")
  );

  // ONCLICK FOR EXPANDING FACILTIES
  const showExpandedSaleReps = () => {
    setExpandSaleReps(!expandSaleReps);
  };

  // HANDLE DELETE FOR DELETING RECORDS
  const handleDelete = (id: number) => onDelete(id);

  // HANDLE EDIT CLICK
  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize editedItem state with item prop when starting edit
    let Sales = item.bulletinBoardDetails.map((board: any) => ({
      value: board.salesRepId,
      label: board.salesRepName,
    }));
    setEditSelectedSales(Sales);
    setEditedItem(item);
    // setExpandSaleReps(!expandSaleReps)
  };

  // Wrapper function to match expected type
  const handleSaveWrapper = async (): Promise<void> => {
    const success = await handleSave(editedItem);
    if (success) {
      setIsEditing(false);
    }
  };

  // HANDLE SAVE CLICK ON EDIT [ SAVE ] ICON
  const handleSaveClick = () => {
    handleSaveWrapper();
  };

  // HANDLE CHANGE ON [ EDIT ] INPUTS CLICK ON EDIT ICON
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, type, checked, value } = e.target;
    const newValue = type === "checkbox" ? checked : value;

    // Update the editedItem state with the new value for the corresponding field
    setEditedItem((prevState: any) => ({
      ...prevState,
      [name]: newValue,
    }));
  };

  const [openalert, setOpenAlert] = useState(false);
  const handleCloseAlert = () => setOpenAlert(false);
  const handleClickOpen = (item: any, status: string) => {
    setOpenAlert(true);
  };

  // idk copied from LIS
  const [request, setRequest] = useState(false);

  // const [rows, setRows] = useState<[]>(() => []);

  // for not loading lookup
  // todo : Setting the state to empty/null, So that whenever user mounts on it again
  // todo: calling lookups fn on change
  // Rendering API calls on DOM
  // Rendering API calls on DOM
  useEffect(() => {
    // Fetch Sales lookup only if the edit option is open
    if (isEditing) {
      getBulletinSalesLookup();
      resetFormData();
    }
  }, [isEditing]); // Dependency on isEditing state variable
  // Filter out Sales with the same ID as ed

  /* MODEL End */









  return (
    <>
      <TableRow key={item.id} sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {!isEditing ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={showExpandedSaleReps}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                {expandSaleReps ? (
                  <button
                    id={`BulletinBoardSalesCloseExpand_${item.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`BulletinBoardSalesOpenExpand_${item.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
                  >
                    <AddIcon />
                  </button>
                )}
              </IconButton>
            ) : null}
          </div>
        </TableCell>
        <TableCell className="text-center">
          <div className="d-flex justify-content-center">
            {isEditing ? (
              <div className="gap-2 d-flex">
                {request ? (
                  <button
                    id={`BulletinBoardSalesLoadButton`}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <LoaderIcon />
                  </button>
                ) : (
                  <button
                    id={`BulletinBoardSalesSave`}
                    onClick={handleSaveClick}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                )}
                <button
                  id={`BulletinBoardSalesCancel`}
                  onClick={() => {
                    setRequest(false);
                    setIsEditing(false);
                    fetchSalesTable();
                    setSearchTerm("");
                    setSelectedSearchTerm("");
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
                  id={`BulletinBoardSales3Dots_${item.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Marketing"
                    pageName="Bulletin Board"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`BulletinBoardSalesEdit`}
                      eventKey="1"
                      onClick={handleEditClick}
                      className="w-auto"
                    >
                      <span className="menu-item px-3">
                        <i
                          className="fa fa-edit"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                        {t("Edit")}
                      </span>
                    </Dropdown.Item>
                  </PermissionComponent>

                  <PermissionComponent
                    moduleName="Marketing"
                    pageName="Bulletin Board"
                    permissionIdentifier="Delete"
                  >
                    <Dropdown.Item
                      id={`BulletinBoardSalesDelete`}
                      eventKey="2"
                      onClick={() => {
                        handleClickOpen(item, "Delete");
                      }}
                      className="w-auto"
                    >
                      <span className="menu-item px-3">
                        <i
                          className="fa fa-trash text-danger mr-2 w-20px"
                          style={{ fontSize: "16px", color: "green" }}
                        ></i>
                        {t("Delete")}
                      </span>
                    </Dropdown.Item>
                  </PermissionComponent>
                </DropdownButton>
              </div>
            )}
          </div>
        </TableCell>
        <TableCell
          id={`BulletinBoardSalesTitle_${item.id}`}
          align="left"
          scope="row"
        >
          {isEditing ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BulletinBoardSalesTitle`}
                  type="text"
                  name="bulletinTitle"
                  className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                  placeholder="Title"
                  value={editedItem?.bulletinTitle}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <span>{item?.bulletinTitle}</span>
          )}
        </TableCell>
        <TableCell
          id={`BulletinBoardSalesDescription_${item.id}`}
          align="left"
          scope="row"
        >
          {isEditing ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BulletinBoardSalesDescription`}
                  type="text"
                  name="bulletinDescription"
                  className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                  placeholder="Description"
                  value={editedItem?.bulletinDescription}
                  onChange={handleChange}
                />
              </div>
            </div>
          ) : (
            <span>{item.bulletinDescription}</span>
          )}
        </TableCell>
        <TableCell id={`BulletinBoardSalesUrgent_${item.id}`} scope="row">
          {isEditing ? (
            <label className="form-check form-check-sm form-check-solid">
              <input
                id={`BulletinBoardSalesUrgent`}
                name="isUrgent"
                className="form-check-input"
                type="checkbox"
                value={editedItem?.isUrgent}
                checked={editedItem?.isUrgent || false}
                onChange={handleChange}
              />
            </label>
          ) : (
            <span>
              {item?.isUrgent ? (
                <span>{t("Yes")}</span>
              ) : (
                <span>{t("No")}</span>
              )}
            </span>
          )}
        </TableCell>
      </TableRow>

      {/* expand */}
      <TableRow>
        <TableCell colSpan={5} className="padding-0">
          <Collapse
            in={expandSaleReps}
            timeout="auto"
            unmountOnExit
            sx={{ "& .MuiCollapse-wrapperInner": { width: "auto" } }}
          >
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div"></Typography>
              <div className="row">
                <div className="col-lg-12 bg-white px-lg-14 pb-1 table-expend-sticky">
                  <div className="card shadow-sm rounded border border-warning mt-3">
                    <div className="card-header d-flex justify-content-between align-items-center bg-gray-200i min-h-35px">
                      <h6 className="my-2">{t("Assigned Sales Rep")}</h6>
                    </div>
                    <div className="card-body py-md-3 py-2">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <span className="text-primary fw-bold">
                          {t("Sales Rep Name")}
                        </span>
                        <div className="row mt-1">
                          {item.bulletinBoardDetails.map((board: any) => (
                            <div
                              id={`BulletinBoardSales_${item.saleRepId}`}
                              key={board.salesRepId}
                              className="col-xl-3 col-lg-3 col-md-3 col-sm-6"
                            >
                              {board.salesRepName}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Box>
          </Collapse>

          {/* For EDIT EXPANDED Sales */}
          <Collapse in={isEditing} timeout="auto" unmountOnExit>
            {/* <div className="card shadow-sm rounded border border-warning"> */}
            <div className="card-body py-md-4 py-3">
              <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
                <h6 className="text-warning mb-0">{t("Sales")}</h6>
              </div>
              <div className="card-body py-md-4 py-3 px-4">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <span className="fw-bold">{t("All Sales Rep")}</span>
                      <input
                        id={`BulletinBoardSalesAllSaleRepSearch`}
                        className="form-control bg-transparent mb-5 mb-sm-0"
                        value={searchTerm}
                        onChange={handleSalesSearch}
                        placeholder={t("Search...")}
                        type="text"
                      />

                      <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                        <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                          <span className="fw-bold">{t("All List")}</span>
                        </div>
                        {loadingLookup ? (
                          <Loader />
                        ) : error ? (
                          <div className="error">{error}</div>
                        ) : !filteredLookupForEdit.length ? (
                          <div className="no-data">{t("No Sales Rep")}</div>
                        ) : (
                          <ol className={`list-group rounded-0 list-group-even-fill ${isMobile?"scroll2" :"h-325px scroll"}`}>
                            {filteredLookupForEdit.map((saleItem: any) => (
                              <li
                                id={`BulletinBoardSalesAllSaleRep_${saleItem.label}`}
                                key={saleItem.salesRepId}
                                onClick={() => handleSalesSelected(saleItem)}
                                className="list-group-item px-2 py-1 border-0"
                              >
                                <div className="d-flex">{saleItem.label}</div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                    <div className="mb-2 col-lg-6 col-md-12 col-sm-12 mt-6">
                      <span className="fw-bold">{t("Selected SalesRep")}</span>
                      <input
                        id={`BulletinBoardSalesSelectedSaleRepSearch`}
                        className="form-control bg-transparent mb-5 mb-sm-0"
                        placeholder={t("Search...")}
                        type="text"
                        value={selectedSearchTerm}
                        onChange={handleSelectedSalesSearch}
                      />
                      <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                        <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                          <span className="fw-bold">{t("Selected List")}</span>
                        </div>

                        <ul className={`list-group rounded-0 list-group-even-fill ${isMobile? "scroll2" :"h-325px scroll"}`}>
                          {filteredEditSelections.length > 0 ? (
                            filteredEditSelections.map((saleItem: any) => (
                              <li
                                id={`BulletinBoardSalesSelectedSaleRep${saleItem.value}`}
                                key={saleItem.value}
                                onClick={() => handleSalesBack(saleItem)}
                                className="list-group-item px-2 py-1 border-0"
                              >
                                <div className="d-flex">{saleItem.label}</div>
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item p-3 border-0">
                              <div className="d-flex">
                                {t("No selected Sales Rep")}
                              </div>
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </Collapse>
        </TableCell>
      </TableRow>

      {/* MODEL START*/}
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
            id={`BulletinBoardSalesDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BulletinBoardSalesDeleteModalConfirm`}
            type="button"
            className="btn btn-danger m-2"
            onClick={() => handleDelete(item.id)}
            disabled={deleting}
          >
            <span>{deleting ? <LoaderIcon /> : null}</span>
            <span>{t(deleting ? " Deleting..." : "Delete")}</span>
          </button>
        </BootstrapModal.Footer>
      </BootstrapModal>
    </>
  );
}

export default SalesTableRow;
