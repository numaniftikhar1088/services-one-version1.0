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
import { useState } from "react";
import { SalesGroupArchive } from "Services/SalesGroup/SalesGroup";
import { SalesGroupAgainst } from "Services/SalesGroup/SalesGroup";

interface sales {
  value: number;
  label: string;
}
function ArchivedRow({
  row,
  index,
  apiGetData,
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
  filteredSelectedReps,
  selectedRepsSearchTerm,
  moveAllToSelectedFacilities,
  setSelectedSalesRepsSearchTerm,
}: any) {
  const { t } = useLang();
  const [openExpand, setOpenExpand] = useState(false);
  const [loadingReps, setLoadingReps] = useState(false);
  const [salesRepsAgainstGroup, setSalesRepsAgainstGroup] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState({
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

  const restoreArchive = async () => {
    try {
      if (!row.name || !row.name.trim()) {
        toast.error(t("Group name cannot be empty."));
        return;
      }
      if (!row.id) {
        return toast.info("No Row Selected");
      }

      const payload = {
        id: row.id,
        isArchived: false,
      };

      const res = await SalesGroupArchive(payload);

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

  // const ShowSalesExpand = () => {
  //   setOpenExpand(!openExpand);
  // };

  const ShowSalesExpand = async () => {
    const nextState = !openExpand;
    setOpenExpand(nextState);

    if (nextState) {
      try {
        setLoadingReps(true);

        const res = await SalesGroupAgainst(row.id);
        // 👆 adjust payload if API expects object instead of id

        if (res?.data?.statusCode === 200) {
          setSalesRepsAgainstGroup(
            res?.data?.data?.saleRepAgainstGroupList || []
          );
        } else {
          toast.error("Failed to load sales reps");
        }
      } catch (error) {
        console.error(error);
        toast.error("Something went wrong while fetching sales reps");
      } finally {
        setLoadingReps(false);
      }
    }
  };

  const removeDuplicates = (arr: sales[]): sales[] => {
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
  const uniqueLookup = removeDuplicates(salesReplookup);

  const lookupForEdit = uniqueLookup.filter(
    (lookupItem: sales) =>
      !selectedSalesRep.some(
        (selectedItem: sales) => selectedItem.value === lookupItem.value
      )
  );
  const filteredAllReps = lookupForEdit.filter((sales) =>
    sales.label.toLowerCase().includes(allRepsSearchTerm.toLowerCase())
  );
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
            >
              <i className="bi bi-plus-lg" />
            </button>
          )}
        </TableCell>
        <TableCell>
          <div className="d-flex justify-content-center">
            <StyledDropButtonThreeDots
              id={`ManageSaleGroup3Dots_${row.id}`}
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
              <MenuItem className=" p-0 text-dark">
                <Link
                  id={`StorageTypeEdit`}
                  to={""}
                  className="text-dark w-100 h-100 p-0"
                  onClick={() => {
                    restoreArchive();
                  }}
                >
                  <i className="fa fa-refresh text-primary mr-2 w-20px" />
                  {t("Restore")}
                </Link>
              </MenuItem>
            </StyledDropMenuMoreAction>
          </div>
        </TableCell>
        <TableCell
          id={`ManageSaleGroupTitle_${row.id}`}
          sx={{ width: "max-content" }}
        >
          <div className="d-flex justify-content-between cursor-pointer">
            <div
              style={{
                width: "max-content",
              }}
            >
              {row.name}
            </div>
          </div>
        </TableCell>
        <TableCell
          id={`RowActive/Inactive_${row.id}`}
          className="text-center"
          sx={{ width: "max-content", whiteSpace: "nowrap" }}
        >
          <>
            {row?.status ? (
              <i className="fa fa-circle-check text-success mr-2 w-20px"></i>
            ) : (
              <i className="fa fa-ban text-danger mr-2 w-20px"></i>
            )}
          </>
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
                      <div className="card-body py-md-4 py-3">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 ">
                          <span className="text-primary fw-bold">
                            {t("Sales Reps")}
                          </span>

                          <div className="row mt-3">
                            {loadingReps ? (
                              <div className="col-12">{t("Loading...")}</div>
                            ) : salesRepsAgainstGroup.length > 0 ? (
                              <div className="col-12 d-flex flex-wrap gap-2">
                                {salesRepsAgainstGroup.map((data: any) => (
                                  <div
                                    key={data.id}
                                    id={`TrainingDocumentTrainingAidFacilityName_${data.id}`}
                                    className="badge badge-secondary round-2 py-2 my-2 fs-7"
                                  >
                                    {data.name}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="col-12">
                                {t("No Sales Reps assigned to this group.")}
                              </div>
                            )}
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

export default ArchivedRow;
