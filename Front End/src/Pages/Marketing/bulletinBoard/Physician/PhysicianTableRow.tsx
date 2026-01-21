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
} from "../../../../Shared/Icons/index";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

interface Facility {
  value: number;
  label: string;
}

function PhysicianTableRow({
  item,
  onDelete,
  deleting,
  handleSave,
  fetchPhysicianTable,
  setEditedItem,
  editedItem,
  searchTerm,
  loadingLookup,
  selectedSearchTerm,
  handleFacilitySelected,
  handleFacilityBack,
  resetFormData,
  setEditSelectedFacilities,
  getBulletinFacilityLookup,
  error,
  setSearchTerm,
  setSelectedSearchTerm,
  editedSelectedFacilities,
  lookup,
}: any) {
  const { t } = useLang();


  
  
  const isMobile = useIsMobile();
  // EDITING STATE
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // EXPAND FAACILTIES ICON
  const [expandFacilities, setExpandFacilities] = useState<boolean>(false);

  /* ##############------------ <<<FACILITIES SEARCH STARTS>>>  ---------############## */

  /* ##############------------ <<<ON CHANGE STARTS>>>  ---------############## */

  // ?  HANDLE CHANGE ALL FACILITIES
  const handleFacilitiesSearch = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSearchTerm(event.target.value);
  };

  // ?  HANDLE CHANGE [---SELECTED FACILITIES---] FACILITIES
  const handleSelectedSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedSearchTerm(event.target.value);
  };

  /* ##############------------ <<<ON CHANGE END>>>  ---------############## */

  // ? ############ EDITING CASE ################
  // Filtering  [ SELECTED ] FACILITIES based on <SEARCH BASED LOOKUP>
  const filteredEditSelections = editedSelectedFacilities.filter(
    (facility: Facility) =>
      facility.label.toLowerCase().startsWith(selectedSearchTerm?.toLowerCase())
  );

  // Function to remove duplicates from an array based on 'value'
  const removeDuplicates = (arr: Facility[]): Facility[] => {
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
    (lookupItem: Facility) =>
      !editedSelectedFacilities.some(
        (selectedItem: Facility) => selectedItem.value === lookupItem.value
      )
  );

  const filteredLookupForEdit = lookupForEdit.filter((facility: Facility) =>
    facility?.label
      ?.toLowerCase()
      .startsWith(searchTerm ? searchTerm?.toLowerCase() : "")
  );

  // ONCLICK FOR EXPANDING FACILTIES
  const showExpandFacilities = () => {
    setExpandFacilities(!expandFacilities);
  };

  // HANDLE DELETE FOR DELETING RECORDS
  const handleDelete = (id: number) => onDelete(id);

  // HANDLE EDIT CLICK
  const handleEditClick = () => {
    setIsEditing(true);
    // Initialize editedItem state with item prop when starting edit
    let facilities = item.bulletinBoardDetails.map((board: any) => ({
      value: board.facilityId,
      label: board.facilityName,
    }));
    setEditSelectedFacilities(facilities);
    setEditedItem(item);
    // setExpandFacilities(!expandFacilities)
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

  //

  // const [rows, setRows] = useState<[]>(() => []);

  // for not loading lookup
  // todo : Setting the state to empty/null, So that whenever user mounts on it again
  // todo: calling lookups fn on change
  // Rendering API calls on DOM
  // Rendering API calls on DOM
  useEffect(() => {
    // Fetch facilities lookup only if the edit option is open
    if (isEditing) {
      getBulletinFacilityLookup();
      resetFormData();
    }
  }, [isEditing]); // Dependency on isEditing state variable
  // Filter out facilities with the same ID as editedItem
  console.log(item.bulletinBoardDetails, "item.bulletinBoardDetails");

  return (
    <>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }} key={item.id}>
        <TableCell>
          <div className="d-flex justify-content-center">
            {!isEditing ? (
              <IconButton
                aria-label="expand row"
                size="small"
                onClick={showExpandFacilities}
                className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              >
                {expandFacilities ? (
                  <button
                    id={`BulletinBoardPhysicianCloseExpand_${item.id}`}
                    className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
                  >
                    <RemoveICon />
                  </button>
                ) : (
                  <button
                    id={`BulletinBoardPhysicianOpenExpand_${item.id}`}
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
                    id={`BulletinBoardPhysicianLoadButton`}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <LoaderIcon />
                  </button>
                ) : (
                  <button
                    id={`BulletinBoardPhysicianSave`}
                    onClick={handleSaveClick}
                    className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  >
                    <DoneIcon />
                  </button>
                )}
                <button
                  id={`BulletinBoardPhysicianCancel`}
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedSearchTerm("");
                    setRequest(false);
                    setIsEditing(false);
                    fetchPhysicianTable();
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
                  id={`BulletinBoardPhysician3Dots_${item.id}`}
                  drop="end"
                  title={<i className="bi bi-three-dots-vertical p-0"></i>}
                >
                  <PermissionComponent
                    moduleName="Marketing"
                    pageName="Bulletin Board"
                    permissionIdentifier="Edit"
                  >
                    <Dropdown.Item
                      id={`BulletinBoardPhysicianEdit`}
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
                      id={`BulletinBoardPhysicianDelete`}
                      className="w-auto"
                      eventKey="2"
                      onClick={() => {
                        handleClickOpen(item, "Delete");
                      }}
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
          id={`BulletinBoardPhysicianTitle_${item.id}`}
          align="left"
          scope="row"
        >
          {isEditing ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BulletinBoardPhysicianTitle`}
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
          id={`BulletinBoardPhysicianDescription_${item.id}`}
          align="left"
          scope="row"
        >
          {isEditing ? (
            <div className="required d-flex">
              <div className="w-100">
                <input
                  id={`BulletinBoardPhysicianDescription`}
                  type="text"
                  name="bulletinDescription"
                  className="form-control bg-white mb-3 mb-lg-0 h-30px rounded-2 fs-8 w-100"
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
        <TableCell id={`BulletinBoardPhysicianUrgent_${item.id}`} scope="row">
          {isEditing ? (
            <label className="form-check form-check-sm form-check-solid">
              <input
                id={`BulletinBoardPhysicianUrgent`}
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

      <TableRow>
        <TableCell colSpan={5} className="padding-0">
          <Collapse
            in={expandFacilities}
            timeout="auto"
            unmountOnExit
            sx={{ "& .MuiCollapse-wrapperInner": { width: "auto" } }}
          >
            <Box sx={isMobile ? { margin: 0 } : { margin: 1 }}>
              <Typography gutterBottom component="div"></Typography>
              <div
                className="row"
                style={isMobile ? { marginLeft: 0, marginRight: 0, paddingLeft: 0, paddingRight: 0 } : {}}
              >
                <div
                  className={`col-lg-12 bg-white pb-1 table-expend-sticky`}
                  style={isMobile
                    ? { paddingLeft: 0, paddingRight: 12, marginLeft: 0, marginRight: 0 }
                    : {}
                  }
                >
                  <div
                    className="card shadow-sm rounded border border-warning mt-3"
                    style={isMobile
                      ? { marginLeft: 0, marginRight: 8, paddingLeft: 0, paddingRight: 8 }
                      : {}
                    }
                  >
                    <div className="card-header d-flex justify-content-between align-items-center bg-gray-200i min-h-35px">
                      <h6 className="my-2">{t("Assigned Facilities")}</h6>
                    </div>
                    <div className="card-body py-md-3 py-2">
                      <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                        <span className="text-primary fw-bold">
                          {t("Facility Name")}
                        </span>
                        <div className="row mt-1">
                          {item.bulletinBoardDetails.map((board: any) => (
                            <div
                              id={`BulletinBoardPhysician_${board.facilityId}`}
                              key={board.facilityId}
                              className="col-xl-3 col-lg-3 col-md-3 col-sm-6"
                            >
                              {board.facilityName}
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

          {/* For EDIT EXPANDED FACILITIES */}
          <Collapse in={isEditing} timeout="auto" unmountOnExit>
            <div
              className="card-body pr-10 "
              style={
                isMobile
                  ? { maxWidth: 350, margin: "0 auto", paddingLeft: 0, paddingRight: 0 }
                  : {}
              }
            >
              <div className={`card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px${isMobile ? " p-2" : ""}`}>
                <h6 className="text-warning mb-0">{t("Facilities")}</h6>
              </div>
              <div className={`card-body py-md-4 py-3 px-4${isMobile ? " p-2" : ""}`}>
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                  <div className="row">
                    <div className="col-lg-6 col-md-12 col-sm-12">
                      <span className="fw-bold">{t("All Facilities")}</span>
                      <input
                        id={`BulletinBoardPhysicianAllFacilitySearch`}
                        className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                        value={searchTerm}
                        onChange={handleFacilitiesSearch}
                        placeholder={t("Search ...")}
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
                          <div className="no-data">{t("No Facilities")}</div>
                        ) : (
                          <ol className={`list-group rounded-0 list-group-even-fill  ${isMobile ? "scroll2" :   "h-325px scroll"}`}>
                            {filteredLookupForEdit.map((facility: any) => (
                              <li
                                id={`BulletinBoardPhysicianAllFacility_${facility.value}`}
                                key={facility.facilityId}
                                onClick={() => handleFacilitySelected(facility)}
                                className="list-group-item px-2 py-1 border-0"
                              >
                                <div className="d-flex">{facility.label}</div>
                              </li>
                            ))}
                          </ol>
                        )}
                      </div>
                    </div>
                    <div className="mb-2 col-lg-6 col-md-12 col-sm-12">
                      <span className="fw-bold">
                        {t("Selected Facilities")}
                      </span>
                      <input
                        id={`BulletinBoardPhysicianSelectedFsclitySearch`}
                        className="form-control bg-white mb-3 mb-lg-0 h-33px rounded-2 fs-8 w-100"
                        placeholder={t("Search ...")}
                        type="text"
                        value={selectedSearchTerm}
                        onChange={handleSelectedSearch}
                      />
                      <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                        <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                          <span className="fw-bold">{t("Selected List")}</span>
                        </div>

                        <ol className={`list-group rounded-0 list-group-even-fill  ${isMobile ? "scroll2" :  " h-325px scroll"}`}>
                          {filteredEditSelections.length > 0 ? (
                            filteredEditSelections.map((facility: any) => (
                              <li
                                id={`BulletinBoardPhysicianSelectedFacility_${facility.value}`}
                                key={facility.value}
                                onClick={() => handleFacilityBack(facility)}
                                className="list-group-item px-2 py-1 border-0"
                              >
                                <div className="d-flex">{facility.label}</div>
                              </li>
                            ))
                          ) : (
                            <li className="list-group-item p-3 border-0">
                              <div className="d-flex">
                                {t("No selected facilities")}
                              </div>
                            </li>
                          )}
                        </ol>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
          <h4>{t("Delete Record")}</h4>
        </BootstrapModal.Header>
        <BootstrapModal.Body>
          {t("Are you sure you want to delete this record ?")}
        </BootstrapModal.Body>
        <BootstrapModal.Footer className="p-0">
          <button
            id={`BulletinBoardPhysicianDeleteModalCancel`}
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseAlert}
          >
            {t("Cancel")}
          </button>
          <button
            id={`BulletinBoardPhysicianDeleteModalConfirm`}
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

export default PhysicianTableRow;
