import {
  Box,
  Collapse,
  MenuItem,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import useLang from "Shared/hooks/useLanguage";
import { toast } from "react-toastify";
import {
  StyledDropButtonThreeDots,
  StyledDropMenuMoreAction,
} from "Utils/Style/Dropdownstyle";
import { useEffect, useState } from "react";
import { SalesGroupArchive } from "Services/SalesGroup/SalesGroup";
import { Loader } from "Shared/Common/Loader";
import PermissionComponent from "Shared/Common/Permissions/PermissionComponent";
import { is } from "cheerio/dist/commonjs/api/traversing";
import { isLabeledStatement } from "typescript";
import { SalesGroupAgainst } from "Services/SalesGroup/SalesGroup";
import { SalesRepEditApi } from "Services/SalesGroup/SalesGroup";
import { SalesRepsaveAgainst } from "Services/SalesGroup/SalesGroup";

interface sales {
  id: number;
  firstName: string;
  name: string;
  name2: string;
}

function SalesGroupRow({
  row,
  index,
  apiGetData,
  setSalesReplookup,
  showApiData,
  setApiGetData,
  handleRepClick,
  salesReplookup,
  setIsBtnDisabled,
  selectedSalesRep,
  removeSelectedRep,
  allRepsSearchTerm,
  handleChangeSwitch,
  moveAllTosalesLookup,
  setAllRepsSearchTerm,
  setSelectedSalesRep,
  expandedRowId,
  setExpandedRowId,
  filteredSelectedReps,
  selectedRepsSearchTerm,
  moveAllToSelectedFacilities,
  setSelectedSalesRepsSearchTerm,
  fetchSalesRep,
  setIsLoading,
  isLoading,
  isEditingDisable,
  setIsEditingDisable,
}: any) {
  const { t } = useLang();
  const openExpand = expandedRowId === row.id;
  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const [isArhived, setIsArchieved] = useState<boolean>(false);
  const [force, forceUpdate] = useState({});
  // Add state at the top of your component
  // const [isEditingDisable, setIsEditingDisable] = useState(false);

  const [loadingCheckBox, setLoadingCheckBox] = useState<boolean>(false);
  const handleClick = (event: any, dropdownName: any) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const getValues = (r: any) => {
    const updatedRows = apiGetData?.map((row: any) => {
      if (row.id === r.id) {
        return { ...row, rowStatus: true };
      }
      return row;
    });
    setApiGetData(updatedRows);
  };
  const handleChange = (name: string, value: string, id: number) => {
    setApiGetData((curr: any) =>
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
    setLoadingCheckBox(true);
    try {
      if (!row.name || !row.name.trim()) {
        toast.error(t("Group name cannot be empty."));
        setLoadingCheckBox(false);
        return;
      }
      const payload = {
        id: row.id ? row.id : 0,
        name: row.name,
        isActive: row.isActive,
        // salesRepIds: selectedSalesRep.map((rep: sales) => rep.id),
      };
      const res = await SalesRepEditApi(payload);
      if (res?.data?.statusCode === 200) {
        showApiData();
        setIsBtnDisabled(false);
        handleClose("dropdown2");
        toast.success(res?.data?.responseMessage);
        setLoadingCheckBox(false);
        await showApiData();

        forceUpdate({});
      } else {
        toast.error(res?.data?.responseMessage || "Something went wrong.");
        setLoadingCheckBox(false);
      }
    } catch (error) {
      console.error("Error Creating group", error);
      toast.error("An unexpected error occurred.");
      setLoadingCheckBox(false);
    }
  };

  const handlesaveInside = async () => {
    setLoadingCheckBox(true);
    try {
      if (!row.name || !row.name.trim()) {
        toast.error(t("Group name cannot be empty."));
        setLoadingCheckBox(false);
        return;
      }
      const payload = {
        id: row.id ? row.id : 0,
        // name: row.name,
        // isActive: row.isActive,
        salesRepIds: selectedSalesRep.map((rep: sales) => rep.id),
      };
      const res = await SalesRepsaveAgainst(payload);
      if (res?.data?.statusCode === 200) {
        // showApiData();
        await SalesGroupAgainst(row.id);
        setIsBtnDisabled(false);
        handleClose("dropdown2");
        toast.success(res?.data?.responseMessage);
        setLoadingCheckBox(false);

        // await showApiData();
        // forceUpdate({});
      } else {
        toast.error(res?.data?.responseMessage || "Something went wrong.");
        setLoadingCheckBox(false);
      }
    } catch (error) {
      console.error("Error Creating group", error);
      toast.error("An unexpected error occurred.");
      setLoadingCheckBox(false);
    }
  };

  const markAsArchive = async () => {
    console.log("Calling marked as archive", row);
    try {
      console.log("fkjlafsdalksdjf", row);
      if (!row.name || !row.name.trim()) {
        toast.error(t("Group name cannot be empty."));
        return;
      }
      if (!row.id) {
        return toast.info("No Row Selected");
      }

      const payload = {
        id: row.id,
        isArchived: true,
      };

      const res = await SalesGroupArchive(payload);
      console.log("RESP SAD SAD ASDA ==>", res.data.responseMessage);

      if (res?.data?.statusCode === 200) {
        showApiData();
        setIsBtnDisabled(false);
        handleClose("dropdown2");
        toast.success(res?.data?.responseMessage);
      } else {
        toast.error(res?.data?.responseMessage || "Something went wrong.");
      }
    } catch (error) {
      console.error("Error Creating group", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleRowClick = (row: any, index: number) => {
    setIsEditingDisable(false);

    handleClose("dropdown2");
    if (row.id !== 0) {
      const updatedRows = apiGetData?.map((r: any) => {
        if (r.id === row.id) {
          return { ...r, rowStatus: false };
        }
        return r;
      });
      setApiGetData(updatedRows);
    } else {
      let newArray = [...apiGetData];
      newArray.splice(index, 1);
      setApiGetData(newArray);
      setIsBtnDisabled(false);
    }
    showApiData();
  };

  const ShowSalesExpand = async () => {
    if (openExpand) {
      setExpandedRowId(null);
      setSelectedSalesRep([]);
    } else {
      setExpandedRowId(row.id);
      try {
        setIsLoading(true);
        const res: any = await SalesGroupAgainst(row.id);
        const data = res?.data?.data;

        if (data) {
          // LEFT SIDE LIST → name
          const notGrouped = Array.isArray(data.saleRepNotGroupList)
            ? data.saleRepNotGroupList.map((r: any) => ({
                id: r.id,
                value: r.id,
                name: r.name, // <- left box
              }))
            : [];

          // RIGHT SIDE LIST → name2
          const againstGroup = Array.isArray(data.saleRepAgainstGroupList)
            ? data.saleRepAgainstGroupList.map((r: any) => ({
                id: r.id,
                value: r.id,
                name: r.name, // <- right box
              }))
            : [];

          setSalesReplookup(notGrouped); // All list
          setSelectedSalesRep(againstGroup); // Selected list
        }
      } catch (error) {
        console.error("Error fetching SalesGroupAgainst:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const removeDuplicates = (arr: sales[]): sales[] => {
    const uniqueValues = new Set<number>();
    return arr.filter((item) => {
      if (uniqueValues.has(item.id)) {
        return false;
      } else {
        uniqueValues.add(item.id);
        return true;
      }
    });
  };

  const uniqueLookup = removeDuplicates(salesReplookup);

  const lookupForEdit = uniqueLookup.filter(
    (lookupItem: sales) =>
      !selectedSalesRep.some(
        (selectedItem: sales) => selectedItem.id === lookupItem.id
      )
  );
  const filteredAllReps = lookupForEdit.filter((sales) =>
    sales?.name?.toLowerCase().includes(allRepsSearchTerm.toLowerCase())
  );

  useEffect(() => {
    if (row?.salesReps?.length && openExpand) {
      setSelectedSalesRep(row.salesReps);
    }
  }, [row, openExpand]);
  console.log(selectedSalesRep, "selectedSalesRep");

  useEffect(() => {
    // fetchSalesRep is no longer used for expand; SalesGroupAgainst is called on expand
  }, [openExpand]);

  return (
    <>
      <TableRow className="h-30px" key={row.id}>
        <TableCell>
          {openExpand ? (
            <button
              id={`TrainingDocumentTrainingAidcloseExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-table-expend-row rounded h-20px w-20px min-h-20px"
              onClick={ShowSalesExpand}
            >
              <i className="bi bi-dash-lg" />
            </button>
          ) : (
            <button
              id={`TrainingDocumentTrainingAidOpenExpand_${row.id}`}
              className="btn btn-icon btn-icon-light btn-sm fw-bold btn-primary rounded h-20px w-20px min-h-20px"
              onClick={ShowSalesExpand}
              disabled={isEditingDisable} // Add this
              style={
                isEditingDisable ? { opacity: 0.5, cursor: "not-allowed" } : {}
              } // Optional: visual feedback
            >
              <i className="bi bi-plus-lg" />
            </button>
          )}
        </TableCell>
        <TableCell>
          {row.rowStatus ? (
            <div className="d-flex justify-content-center">
              <div className="gap-2 d-flex">
                <button
                  disabled={loadingCheckBox}
                  id={`BloodLisStorageTypeSave`}
                  className="btn btn-icon btn-sm fw-bold btn-table-save btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => {
                    handlesave();
                    setIsEditingDisable(false); // Re-enable the button
                  }}
                >
                  <i className="bi bi-check2" />
                </button>
                <button
                  id={`BloodLisStorageTypeCancel`}
                  className="btn btn-icon btn-sm fw-bold btn-table-cancel btn-icon-light h-32px w-32px fas-icon-20px"
                  onClick={() => handleRowClick(row, index)}
                >
                  <i className="bi bi-x" />
                </button>
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center">
              <StyledDropButtonThreeDots
                id={`BloodLisStorageType3Dots_${row.id}`}
                aria-haspopup="true"
                onClick={(event: any) => handleClick(event, "dropdown2")}
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
                {/* <PermissionComponent
                     moduleName="Manage Sales Rep"
                      pageName="Sales Group"
                      permissionIdentifier="Edit"
                    > */}
                <MenuItem className="w-auto  text-dark">
                  <Link
                    id={`SalesRepGroupEdit ${row.id}`}
                    to={""}
                    className="text-dark w-100 h-100 p-0"
                    onClick={() => {
                      getValues(row);
                      setIsEditingDisable(true);
                    }}
                  >
                    <i className="fa fa-edit text-primary mr-2 w-20px" />
                    {t("Edit")}
                  </Link>
                </MenuItem>
                {/* </PermissionComponent> */}
                {/* <PermissionComponent
              moduleName="Manage Sales Rep"
              pageName="Sales Group"
              permissionIdentifier="Archive"
            > */}

                <MenuItem className="w-auto text-dark">
                  <Link
                    id={`SalesRepGroupArchive ${row.id}`}
                    to={""}
                    className="text-dark w-100 h-100 p-0"
                    onClick={() => {
                      // setIsArchieved(true);
                      markAsArchive();
                    }}
                  >
                    <i
                      className="bi bi-archive-fill text-success mr-2"
                      aria-hidden="true"
                    ></i>
                    {t("Archived")}
                  </Link>
                </MenuItem>
                {/* </PermissionComponent> */}
              </StyledDropMenuMoreAction>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`BloodLisStorageTypeTitle_${row.id}`}
          sx={{ width: "max-content" }}
        >
          {row.rowStatus ? (
            <input
              id={`name`}
              type="text"
              placeholder="Group Name"
              name="name"
              className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded h-30px"
              value={row.name}
              onChange={(e) =>
                handleChange(e.target.name, e.target.value, row.id)
              }
            />
          ) : (
            <div className="d-flex justify-content-between cursor-pointer">
              <div
                style={{
                  width: "max-content",
                }}
              >
                {row.name}
              </div>
            </div>
          )}
        </TableCell>
        <TableCell
          id={`RowActive/Inactive_${row.id}`}
          className="text-center"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          {row.rowStatus ? (
            <>
              <div className="form-check form-switch">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  name="status"
                  id="flexSwitchCheckDefault"
                  onChange={(event: any) => handleChangeSwitch(event, row.id)}
                  checked={row.isActive ? true : false}
                />
                <label className="form-check-label"></label>
              </div>
            </>
          ) : (
            <>
              {row?.isActive ? (
                <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
              ) : (
                <i className="fa fa-ban text-danger mr-2 w-20px"></i>
              )}
            </>
          )}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={8} className="padding-0">
          <Collapse in={openExpand} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component="div">
                <div className="row">
                  <div className="col-lg-12 bg-white px-lg-14 pb-6 table-expend-sticky">
                    <div className="card shadow-sm rounded border border-warning mt-3">
                      <div className="d-flex  align-items-center gap-2 gap-lg-3 mb-4">
                        <button
                          id={`TrainingDocumentTrainingAidCancel`}
                          className="btn btn-secondary bg-warning btn-sm btn-secondary--icon"
                          onClick={() => setExpandedRowId(null)}
                        >
                          {t("Cancel")}
                        </button>
                        <button
                          id={`TrainingDocumentTrainingAidSave`}
                          disabled={loadingCheckBox}
                          className="btn btn-primary btn-sm btn-primary--icon px-7"
                          onClick={handlesaveInside}
                        >
                          <span>
                            <span>{t("Save")}</span>
                          </span>
                        </button>
                      </div>
                      <div className="py-0">
                        <div className="card shadow-sm rounded border border-warning">
                          <div className="card-header px-4 d-flex justify-content-between align-items-center rounded bg-light-warning min-h-40px">
                            <h6 className="text-warning mb-0">
                              {t("Sale Rep")}
                            </h6>
                          </div>
                          <div className="card-body py-md-4 py-3 px-4">
                            <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
                              <div className="row">
                                <div className="d-flex align-items-center flex-wrap justify-content-around">
                                  <div className="col-lg-5 col-md-5 col-sm-12">
                                    <span className="fw-bold">
                                      {t("All Reps")}
                                    </span>
                                    <input
                                      id={`TrainingDocumentSaleRepAllSaleRepSearch`}
                                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                                      value={allRepsSearchTerm}
                                      onChange={(e) =>
                                        setAllRepsSearchTerm(e.target.value)
                                      }
                                      placeholder={t("Search...")}
                                      type="text"
                                    />
                                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                                        <span className="fw-bold">
                                          {t("All List")}
                                        </span>
                                      </div>

                                      <ol className="list-group rounded-0 list-group-even-fill  scroll2">
                                        {isLoading ? (
                                          <Loader />
                                        ) : (
                                          <>
                                            {filteredAllReps.map(
                                              (rep: any, items: any) => (
                                                <li
                                                  id={`TrainingDocumentSaleRepAllSaleRep_${rep.value}`}
                                                  key={items.id}
                                                  onClick={() =>
                                                    handleRepClick(rep)
                                                  }
                                                  className="list-group-item py-1 px-2 border-0 cursor-pointer"
                                                >
                                                  <div className="d-flex">
                                                    <span>{rep.name}</span>
                                                  </div>
                                                </li>
                                              )
                                            )}
                                          </>
                                        )}
                                      </ol>
                                    </div>
                                  </div>
                                  <div className="align-items-center d-flex flex-md-column mt-2 justify-content-center gap-2 px-3">
                                    <span
                                      id={`TrainingDocumentSaleRepSelectAll`}
                                      className="align-content-center bg-warning d-flex justify-content-center p-3 rounded-1"
                                      onClick={moveAllToSelectedFacilities}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <i
                                        style={{
                                          fontSize: "20px",
                                          color: "white",
                                        }}
                                        className="fa"
                                      >
                                        &#xf101;
                                      </i>
                                    </span>
                                    <span
                                      id={`TrainingDocumentSaleRepDeselectAll`}
                                      className="align-content-center bg-info d-flex justify-content-center p-3 rounded-1"
                                      onClick={moveAllTosalesLookup}
                                      style={{ cursor: "pointer" }}
                                    >
                                      <i
                                        style={{
                                          fontSize: "20px",
                                          color: "white",
                                        }}
                                        className="fa"
                                      >
                                        &#xf100;
                                      </i>
                                    </span>
                                  </div>
                                  <div className="col-lg-6 col-md-5 col-sm-12">
                                    <span className="fw-bold required">
                                      {t("Selected Reps")}
                                    </span>
                                    <input
                                      id={`TrainingDocumentSaleRepSelectedSaleRepSearch`}
                                      className="form-control bg-white mb-3 mb-lg-0 rounded-2 fs-8 h-30px"
                                      value={selectedRepsSearchTerm}
                                      onChange={(e) =>
                                        setSelectedSalesRepsSearchTerm(
                                          e.target.value
                                        )
                                      }
                                      placeholder={t("Search...")}
                                      type="text"
                                    />
                                    <div className="mt-2 border-1 border-light-dark border rounded overflow-hidden">
                                      <div className="px-4 h-30px d-flex align-items-center rounded bg-secondary">
                                        <span className="fw-bold">
                                          {t("Selected List")}
                                        </span>
                                      </div>

                                      <ol className="list-group rounded-0 list-group-even-fill  scroll2">
                                        {isLoading ? (
                                          <Loader />
                                        ) : (
                                          <>
                                            {filteredSelectedReps.map(
                                              (rep: any, item: any) => (
                                                <li
                                                  id={`TrainingDocumentSaleRepSelectedSaleRep_${rep.value}`}
                                                  onClick={() =>
                                                    removeSelectedRep(rep)
                                                  }
                                                  key={rep.id}
                                                  className="list-group-item py-1 px-2 border-0 cursor-pointer"
                                                >
                                                  {rep.name}
                                                </li>
                                              )
                                            )}
                                          </>
                                        )}
                                      </ol>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
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
    </>
  );
}

export default SalesGroupRow;
