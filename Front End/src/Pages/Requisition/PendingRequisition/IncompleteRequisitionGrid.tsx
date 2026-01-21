import { Box, Paper } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import { saveAs } from "file-saver"; // Import file-saver for downloading the file
import moment from "moment";
import React, { useEffect, useState } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import SearchDatePicker from "Shared/Common/DatePicker/SearchDatePicker";
import Status from "Shared/Common/Status";
import useIsMobile from "Shared/hooks/useIsMobile";
import useLang from "Shared/hooks/useLanguage";
import * as XLSX from "xlsx";
import { ViewRequisitionGridData } from "../../../Interface/Requisition";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import NoRecord from "../../../Shared/Common/NoRecord";
import Splash from "../../../Shared/Common/Pages/Splash";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent, {
  AnyPermission,
} from "../../../Shared/Common/Permissions/PermissionComponent";
import { ArrowDown, ArrowUp } from "../../../Shared/Icons";
import CustomPagination from "../../../Shared/JsxPagination";
import ArrowBottomIcon from "../../../Shared/SVG/ArrowBottomIcon";
import { StringRecord } from "../../../Shared/Type";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../Utils/Style/Dropdownstyle";
import { TBL_HEADERS } from "./tableHeaders";

interface IncompleteRequisition {
  requisitionList: ViewRequisitionGridData[];
  loading: boolean;
  searchRequest: any;
  setSearchRequest: any;
  searchQuery: any;
  resetSearch: any;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  totalPages: any;
  pageNumbers: any;
  nextPage: any;
  showPage: any;
  prevPage: any;
  Delete: any;
  sort: any;
  searchRef: any;
  handleSort: any;
  initialSearchQuery: any;
  setCurPage: any;
  setTriggerSearchData: any;
  // updatedSearchRequestfordateofbirth: any;
}
const IncompleteRequisitionGrid: React.FC<IncompleteRequisition> = ({
  requisitionList,
  loading,
  searchRequest,
  setSearchRequest,
  searchQuery,
  resetSearch,
  curPage,
  pageSize,
  setPageSize,
  total,
  totalPages,
  pageNumbers,
  nextPage,
  showPage,
  prevPage,
  Delete,
  searchRef,
  handleSort,
  sort,
  setCurPage,
  initialSearchQuery,
  setTriggerSearchData,
  // updatedSearchRequestfordateofbirth,
}) => {
  const { t } = useLang();

  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const [value, setValue] = useState<any>(null);
  const [show1, setShow1] = useState(false);
  const [selectedBox, setSelectedBox] = useState<any>({
    RequisitionOrderId: [],
  });
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const ModalhandleClose1 = () => setShow1(false);

  const queryDisplayTagNames: StringRecord = {
    Order: "Order #",
    Status: "Status",
    MissingInfo: "Missing Info",
    FirstName: "First Name",
    LastName: "Last Name",
    DateOfBirth: "Date of Birth",
    RequisitionTypeId: "Requisition Type",
    RequisitionType: "Requisition Type",
    PhysicianName: "Physician Name",
    ClientName: "Facility Name",
    DateOfCollection: "Date of Collection",
    TimeOfCollection: "Time of Collection",
    AddedBy: "Added By",
    AccessionNo: "Accession No",
  };

  const handleAllSelect = (checked: boolean, requisitionList: any) => {
    const idsArr: any = [];
    requisitionList.forEach((item: any) => {
      idsArr.push(item?.RequisitionOrderId);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          RequisitionOrderId: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          RequisitionOrderId: [],
        };
      });
    }
  };

  const handleChangeRequisitionIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          RequisitionOrderId: [...selectedBox.RequisitionOrderId, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          RequisitionOrderId: selectedBox.RequisitionOrderId.filter(
            (item: any) => item !== id
          ),
        };
      });
    }
  };

  const base64ToExcel = (base64: string, filename: string) => {
    const decodedBase64 = atob(base64);
    const workbook = XLSX.read(decodedBase64, { type: "binary" });
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const excelBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(excelBlob, `${filename}.xlsx`);
  };

  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };

  const Export_To_Excel_Selected_Record = () => {
    if (selectedBox.RequisitionOrderId.length !== 0) {
      RequisitionType.Export_To_Excel(selectedBox.RequisitionOrderId).then(
        (res: AxiosResponse) => {
          if (res.data.httpStatusCode === 200) {
            handleClose("dropdown1");
            toast.success(t(res.data.message));
            base64ToExcel(res.data.data.fileContents, "Pending Requisition");
          }
          setSelectedBox({
            RequisitionOrderId: [],
          });
        }
      );
    } else {
      toast.error(t("Please select atleast one recored"));
    }
  };

  const Export_To_Excel_All_Records = () => {
    RequisitionType.Export_To_Excel([]).then((res: AxiosResponse) => {
      if (res.data.httpStatusCode === 200) {
        handleClose("dropdown1");
        toast.success(t(res.data.message));
        base64ToExcel(res.data.data.fileContents, "Pending Requisition");
      }
    });
  };

  const handleClickOpen = (userid: any) => {
    setShow1(true);
    setValue(userid);
  };
  
  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  // Handling searchedTags
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchRequest)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchRequest]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div>
        <div className="card-body py-2">
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map((tag) =>
              tag === "isArchived" ? null : (
                <div
                  className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                  onClick={() => handleTagRemoval(tag)}
                  key={tag}
                >
                  <span className="fw-bold">
                    {t(queryDisplayTagNames[tag])}
                  </span>
                  <i className="bi bi-x"></i>
                </div>
              )
            )}
          </div>
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
            <div className="d-flex gap-2 responsive-flexed-actions">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t("Records")}</span>
                <select
                  id="PendingRequisitionIncompleteRequisitionRecord"
                  className="form-select w-125px h-33px rounded py-2"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-allow-clear="true"
                  onChange={(e) => {
                    setPageSize(parseInt(e.target.value));
                  }}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50" selected>
                    50
                  </option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="border-0 d-flex justify-content-center justify-content-sm-start">
                <div className="d-flex gap-2 gap-lg-3 ">
                  <div>
                    <AnyPermission
                      moduleName="Requisition"
                      pageName="Pending requisition"
                      permissionIdentifiers={[
                        "ExportAllRecords",
                        "ExportSelectedRecords",
                      ]}
                    >
                      <StyledDropButton
                        id="demo-positioned-button2"
                        aria-controls={
                          openDrop ? "demo-positioned-menu2" : undefined
                        }
                        aria-haspopup="true"
                        aria-expanded={openDrop ? "true" : undefined}
                        onClick={(event) => handleClick(event, "dropdown2")}
                        className="btn btn-excle btn-sm"
                      >
                        <i
                          style={{
                            color: "white",
                            fontSize: "20px",
                            paddingLeft: "2px",
                          }}
                          className="fa"
                        >
                          &#xf1c3;
                        </i>
                        <span className="svg-icon svg-icon-5 m-0">
                          <ArrowBottomIcon />
                        </span>
                      </StyledDropButton>
                      <StyledDropMenu
                        id="demo-positioned-menu2"
                        aria-labelledby="demo-positioned-button2"
                        anchorEl={anchorEl.dropdown2}
                        open={Boolean(anchorEl.dropdown2)}
                        onClose={() => handleClose("dropdown2")}
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
                          moduleName="Requisition"
                          pageName="Pending requisition"
                          permissionIdentifier="ExportAllRecords"
                        >
                          <MenuItem
                            onClick={() => {
                              handleClose("dropdown2");
                              Export_To_Excel_All_Records();
                            }}
                          >
                            <i className="fa text-excle mr-2  w-20px">
                              &#xf1c3;
                            </i>
                            {t("Export All Records")}
                          </MenuItem>
                        </PermissionComponent>
                        <PermissionComponent
                          moduleName="Requisition"
                          pageName="Pending requisition"
                          permissionIdentifier="ExportSelectedRecords"
                        >
                          <MenuItem
                            onClick={() => {
                              handleClose("dropdown2");
                              Export_To_Excel_Selected_Record();
                            }}
                          >
                            <i className="fa text-success mr-2 w-20px">
                              &#xf15b;
                            </i>
                            {t("Export Selected Records")}
                          </MenuItem>
                        </PermissionComponent>
                      </StyledDropMenu>
                    </AnyPermission>
                  </div>
                </div>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2 gap-lg-3">
              <button
                id="PendingRequisitionIncompleteRequisitionSearchButton"
                onClick={() => {
                  setCurPage(1);
                  setTriggerSearchData((prev: any) => !prev);
                }}
                className="btn btn-linkedin btn-sm fw-500"
                aria-controls="Search"
              >
                {t("Search")}
              </button>
              <button
                onClick={resetSearch}
                type="button"
                className="btn btn-secondary btn-sm fw-500"
                id="PendingRequisitionIncompleteRequisitionResetButton"
              >
                <span>
                  <span>{t("Reset")}</span>
                </span>
              </button>
            </div>
          </div>
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
                id="PendingRequisitionIncompleteRequisitionCancelDelete"
                type="button"
                className="btn btn-secondary"
                onClick={ModalhandleClose1}
              >
                {t("Cancel")}
              </button>
              <button
                id="PendingRequisitionIncompleteRequisitionConfirmDelete"
                type="button"
                className="btn btn-danger m-2"
                onClick={() => {
                  Delete(value);
                  ModalhandleClose1();
                }}
              >
                {t("Delete")}
              </button>
            </Modal.Footer>
          </Modal>
          <Box sx={{ height: "auto", width: "100%" }}>
            <div className="table_bordered overflow-hidden">
              <TableContainer
                sx={
                  isMobile
                    ? {}
                    : {
                        maxHeight: "calc(100vh - 100px)",
                        "&::-webkit-scrollbar": {
                          width: 7,
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "#fff",
                        },
                        "&:hover": {
                          "&::-webkit-scrollbar-thumb": {
                            backgroundColor: "var(--kt-gray-400)",
                            borderRadius: 2,
                          },
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "var(--kt-gray-400)",
                          borderRadius: 2,
                        },
                      }
                }
                component={Paper}
                className="shadow-none"
              >
                <Table
                  aria-label="sticky table collapsible"
                  className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                >
                  <TableHead>
                    <TableRow className="h-40px">
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchAccessionNUmber"
                          type="text"
                          name="AccessionNo"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.AccessionNo}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchOrderNumber"
                          type="text"
                          name="Order"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.Order}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchMissingInfo"
                          type="text"
                          name="MissingInfo"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0 w-350px"
                          placeholder={t("Search ...")}
                          value={searchRequest.MissingInfo}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearch1stName"
                          type="text"
                          name="FirstName"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.FirstName}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchLastName"
                          type="text"
                          name="LastName"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.LastName}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <SearchDatePicker
                          name="DateOfBirth"
                          value={searchRequest.DateOfBirth}
                          onChange={searchQuery}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchReqType"
                          type="text"
                          name="RequisitionType"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.RequisitionType}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchPhysicanName"
                          type="text"
                          name="PhysicianName"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.PhysicianName}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchFacilityName"
                          type="text"
                          name="ClientName"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.ClientName}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <SearchDatePicker
                          name="DateOfCollection"
                          value={searchRequest.DateOfCollection}
                          onChange={searchQuery}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchTimeOfCollection"
                          type="time"
                          name="TimeOfCollection"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          value={searchRequest.TimeOfCollection}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                      <TableCell>
                        <input
                          id="PendingRequisitionIncompleteRequisitionSearchAddedBy"
                          type="text"
                          name="AddedBy"
                          className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                          placeholder={t("Search ...")}
                          value={searchRequest.AddedBy}
                          onChange={searchQuery}
                          onKeyDown={(e) => handleKeyPress(e)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow className="h-30px">
                      <TableCell style={{ width: "49px" }}>
                        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                          <input
                            id="PendingRequisitionIncompleteRequisitionCheckAll"
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) =>
                              handleAllSelect(e.target.checked, requisitionList)
                            }
                          />
                        </label>
                      </TableCell>
                      <TableCell className="min-w-50px w-50px">
                        {t("Actions")}
                      </TableCell>
                      {TBL_HEADERS.map((header) => (
                        <TableCell className="min-w-50px" key={header.variable}>
                          <div
                            onClick={() => handleSort(header.variable)}
                            className="d-flex justify-content-between cursor-pointer"
                            ref={searchRef}
                          >
                            <div style={{ width: "max-content" }}>
                              {t(header.name)}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === header.variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {loading ? (
                      <TableCell colSpan={9} className="py-20">
                        {isMobile ? <Loader /> : <Splash />}
                      </TableCell>
                    ) : requisitionList.length ? (
                      requisitionList?.map((item: any) => (
                        <TableRow
                          sx={{ "& > *": { borderBottom: "unset" } }}
                          key={item.RequisitionOrderId}
                        >
                          <TableCell>
                            <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                              <input
                                id={`PendingRequisitionIncompleteRequisitionCheckBox_${item.RequisitionOrderId}`}
                                className="form-check-input"
                                type="checkbox"
                                checked={selectedBox?.RequisitionOrderId?.includes(
                                  item?.RequisitionOrderId
                                )}
                                onChange={(e) =>
                                  handleChangeRequisitionIds(
                                    e.target.checked,
                                    item.RequisitionOrderId
                                  )
                                }
                              />
                            </label>
                          </TableCell>
                          <TableCell>
                            <div className="d-flex justify-content-center">
                              <div className="rotatebtnn">
                                <DropdownButton
                                  id={`PendingRequisitionIncompleteRequisition3Dots_${item.RequisitionOrderId}`}
                                  className="p-0 del-before btn btn-light-info btn-active-info btn-sm btn-action table-action-btn"
                                  key="end"
                                  drop="end"
                                  title={
                                    <i className="bi bi-three-dots-vertical p-0"></i>
                                  }
                                >
                                  <>
                                    <PermissionComponent
                                      moduleName="Requisition"
                                      pageName="Pending requisition"
                                      permissionIdentifier="View"
                                    >
                                      <Dropdown.Item
                                        id="PendingRequisitionIncompleteRequisitionView"
                                        eventKey="2"
                                      >
                                        <span
                                          className="menu-item px-3"
                                          onClick={() =>
                                            window.open(
                                              `/OrderView/${btoa(
                                                item?.RequisitionId
                                              )}/${btoa(
                                                item?.RequisitionOrderId
                                              )}`,
                                              "_blank"
                                            )
                                          }
                                        >
                                          <i className="fa fa-eye text-success mr-2 w-20px"></i>
                                          {t("View")}
                                        </span>
                                      </Dropdown.Item>
                                    </PermissionComponent>
                                    <PermissionComponent
                                      moduleName="Requisition"
                                      pageName="Pending requisition"
                                      permissionIdentifier="Delete"
                                    >
                                      <Dropdown.Item
                                        id="PendingRequisitionIncompleteRequisitionDelete"
                                        eventKey="2"
                                        onClick={() =>
                                          handleClickOpen(
                                            item?.RequisitionOrderId
                                          )
                                        }
                                      >
                                        <div className="menu-item px-3">
                                          <i className="fa fa-trash text-danger mr-2 w-20px"></i>
                                          {t("Delete")}
                                        </div>
                                      </Dropdown.Item>
                                    </PermissionComponent>
                                  </>
                                </DropdownButton>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionAccessionNo_${item.RequisitionOrderId}`}
                          >
                            {item?.AccessionNo}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionOrder_${item.RequisitionOrderId}`}
                          >
                            {item?.RecordId}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionStatus_${item.RequisitionOrderId}`}
                            sx={{ width: "max-content", textAlign: "center" }}
                          >
                            <Status
                              cusText={item?.Status}
                              cusClassName={
                                item?.Status === t("Missing Info")
                                  ? "badge-status-missing-info"
                                  : item?.Status === t("On Hold")
                                    ? "badge-status-hold"
                                    : "badge-status-default"
                              }
                            />
                          </TableCell>
                          <TableCell
                            align="left"
                            id={`PendingRequisitionIncompleteRequisitionContinue_${item.RequisitionOrderId}`}
                          >
                            <div
                              onClick={() => {
                                const data = {
                                  reqId: item?.RequisitionId,
                                  Check: true,
                                  orderid: item?.RequisitionOrderId,
                                  status: item?.Status,
                                };
                                navigate(`/requisition`, {
                                  state: data,
                                });
                              }}
                              className="col-12 text-center"
                              style={{ width: "130px" }}
                            >
                              <span className="btn btn-info btn-sm rounded">
                                {t("Continue")}
                              </span>
                            </div>
                          </TableCell>

                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionMissingInfo_${item.RequisitionOrderId}`}
                          >
                            {item?.MissingInfo}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionFirstName_${item.RequisitionOrderId}`}
                          >
                            {item?.FirstName}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionLastName_${item.RequisitionOrderId}`}
                          >
                            {item?.LastName}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionDateOfBirth_${item.RequisitionOrderId}`}
                          >
                            {item?.DateOfBirth}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionRequisitionType_${item.RequisitionOrderId}`}
                          >
                            {item?.RequisitionType}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionPhysicianName_${item.RequisitionOrderId}`}
                          >
                            {item?.PhysicianName}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionClientName_${item.RequisitionOrderId}`}
                          >
                            {item?.ClientName}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionDateOfCollection_${item.RequisitionOrderId}`}
                          >
                            {item?.DateOfCollection}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionTimeOfCollection_${item.RequisitionOrderId}`}
                          >
                            {item?.TimeOfCollection &&
                              moment(
                                item?.TimeOfCollection,
                                "HH:mm:ss.SSSSSSS"
                              ).format("HH:mm:ss")}
                          </TableCell>
                          <TableCell
                            id={`PendingRequisitionIncompleteRequisitionAddedBy_${item.RequisitionOrderId}`}
                          >
                            {item?.AddedBy}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <NoRecord colSpan={15} />
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
            {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
            <CustomPagination
              curPage={curPage}
              nextPage={nextPage}
              pageNumbers={pageNumbers}
              pageSize={pageSize}
              prevPage={prevPage}
              showPage={showPage}
              total={total}
              totalPages={totalPages}
            />
            {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
          </Box>
        </div>
      </div>
    </>
  );
};
export default IncompleteRequisitionGrid;
