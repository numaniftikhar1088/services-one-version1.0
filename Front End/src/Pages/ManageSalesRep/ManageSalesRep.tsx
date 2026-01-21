import React, { useState } from "react";
import Box from "@mui/material/Box";
import GridNavbar from "./GridNavbar";
import { LinksArray } from "../../Shared/Compendium/GridNavbar";
import { ReactState } from "../../Shared/Type";
import { inputs } from "../../Utils/Compendium/Inputs";
import { Loader } from "../../Shared/Common/Loader";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import { styled, TableContainer } from "@mui/material";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { ArrowUp, ArrowDown } from "../../Shared/Icons";
import Row from "./Row";
import BreadCrumbs from "../../Utils/Common/Breadcrumb";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import { AutocompleteStyle } from "../../Utils/MuiStyles/AutocompleteStyles";
import PermissionComponent from "../../Shared/Common/Permissions/PermissionComponent";
import ArchiveTab from "./ArchiveTab";
import useLang from "Shared/hooks/useLanguage";
import NoRecord from "../../Shared/Common/NoRecord";
import useIsMobile from "Shared/hooks/useIsMobile";


const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}
function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
interface Props {
  rows: {
    id: any;
    name: any;
    description: any;
    isActive: any;
  }[];
  NavigatorsArray: LinksArray[];
  setOpenModal: ReactState;
  values: any;
  setValues: any;
  statusChange: Function;
  setEditGridHeader: any;
  searchRequest: any;
  setSearchRequest: any;
  DeleteSpecimenTypeAssignmentById: any;
  loading: boolean;
  curPage: any;
  pageSize: any;
  setPageSize: any;
  total: any;
  totalPages: any;
  pageNumbers: any;
  nextPage: any;
  showPage: any;
  prevPage: any;
  Edit: any;
  handleOpen: any;
  handleOnChange: any;
  errors: any;
  setErrors: any;
  editGridHeader: any;
  PanelSetupList: any;
  setPanelSetupList: any;
  openModal: any;
  modalheader: any;
  handleSubmit: any;
  setRequest: any;
  request: any;
  panels: any;
  setPanels: any;
  sports2: any;
  setSports2: any;
  loadData: any;
  selectedPanels: any;
  setSelectedPanels: any;
  check: any;
  sort: any;
  handleSort: any;
  searchRef: any;
  facilities: any;
  GetDataAgainstRoles: any;
  checkboxes: any;
  setCheckboxes: any;
  roletype: any;
  val: any;
  setVal: any;
  setStatus: any;
  status: any;
  archivesalesrepList: any;
  setArchiveSalesRepList: any;
  resetSeachQuery: any;
  valFacility: any;
  setValFacility: any;
  queryDisplayTagNames: any;
  searchedTags: any;
  handleTagRemoval: any;
  setCurPage: any;
  setTriggerSearchData: any;
}
const ManageSalesRepGrid: React.FC<Props> = ({
  rows,
  NavigatorsArray,
  setOpenModal,
  setValues,
  statusChange,
  setEditGridHeader,
  searchRequest,
  setSearchRequest,
  DeleteSpecimenTypeAssignmentById,
  loading,
  curPage,
  pageSize,
  setPageSize,
  total,
  totalPages,
  pageNumbers,
  nextPage,
  showPage,
  prevPage,
  Edit,
  handleOpen,
  handleOnChange,
  values,
  errors,
  setErrors,
  editGridHeader,
  PanelSetupList,
  setPanelSetupList,
  openModal,
  modalheader,
  handleSubmit,
  setRequest,
  request,
  panels,
  setPanels,
  sports2,
  setSports2,
  loadData,
  selectedPanels,
  setSelectedPanels,
  check,
  sort,
  handleSort,
  searchRef,
  facilities,
  GetDataAgainstRoles,
  checkboxes,
  setCheckboxes,
  roletype,
  val,
  setVal,
  setStatus,
  status,
  archivesalesrepList,
  setArchiveSalesRepList,
  resetSeachQuery,
  valFacility,
  setValFacility,
  queryDisplayTagNames,
  searchedTags,
  handleTagRemoval,
  setCurPage,
  setTriggerSearchData,
}) => {
  const { t } = useLang();
  const isMobile = useIsMobile();

  // ********** DROPDOWN START *********
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClose = () => {
    setAnchorEl(null);
  };
  // ******** DROPDOWN END ***********
  const [open, setOpen] = useState<any>(false);
  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setVal(newValue);

    loadData(true);
  };
  const InputSearchRequest = (key: string, value: any) => {
    setSearchRequest((prevState: any) => ({
      ...prevState,
      [key]: value,
    }));
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };

  return (
    <>
      <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
        <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
          <BreadCrumbs />
        </div>
      </div>
      <GridNavbar
        NavigatorsArray={NavigatorsArray}
        AddBtnText={t("Add New Sales Rep")}
        setOpenModal={setOpenModal}
        openModal={openModal}
        Inputs={inputs}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        statusDropDownName="specimenStatus"
        handleOpen={handleOpen}
        handleOnChange={handleOnChange}
        values={values}
        errors={errors}
        setErrors={setErrors}
        editGridHeader={editGridHeader}
        PanelSetupList={PanelSetupList}
        setPanelSetupList={setPanelSetupList}
        setValues={setValues}
        modalheader={modalheader}
        setEditGridHeader={setEditGridHeader}
        handleSubmit={handleSubmit}
        setRequest={setRequest}
        request={request}
        panels={panels}
        setPanels={setPanels}
        sports2={sports2}
        setSports2={setSports2}
        loadData={loadData}
        selectedPanels={selectedPanels}
        setSelectedPanels={setSelectedPanels}
        setOpen={setOpen}
        open={open}
        facilities={facilities}
        GetDataAgainstRoles={GetDataAgainstRoles}
        checkboxes={checkboxes}
        setCheckboxes={setCheckboxes}
        roletype={roletype}
        valFacility={valFacility}
        setValFacility={setValFacility}
      />

      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <Tabs
            value={val}
            onChange={handleChange}
            TabIndicatorProps={{ style: { background: "transparent" } }}
            className="min-h-auto"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              "& .MuiTabs-scrollButtons": {
                width: 0,
                transition: "width 0.7s ease",
                "&:not(.Mui-disabled)": {
                  width: "48px",
                },
              },
            }}
          >
            <TabSelected
              label={t("Manage Sales Rep")}
              {...a11yProps(0)}
              className="fw-bold text-capitalize"
              id={`ManageSaleRep`}
            />
            <TabSelected
              label={t("Archived")}
              {...a11yProps(1)}
              className="fw-bold text-capitalize"
              id={`Archived`}
            />
          </Tabs>
          <div className="card">
            <TabPanel value={val} index={0}>
              <div className="card-body py-2">
                <div className="d-flex gap-4 flex-wrap mb-3">
                  {searchedTags.map((tag: any) =>
                    tag === "isArchived" || tag === "specimenType" ? null : (
                      <div
                        className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                        onClick={() => handleTagRemoval(tag)}
                      >
                        <span className="fw-bold">
                          {t(queryDisplayTagNames[tag])}
                        </span>
                        <i className="bi bi-x"></i>
                      </div>
                    )
                  )}
                </div>
                <div className="responsive-flexed-actions gap-2 mb-2 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center">
                  <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-3">{t("Records")}</span>
                      <select
                        id="ManageSaleRepRecord"
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
                    <PermissionComponent
                      moduleName="Manage Sales Rep"
                      pageName="Sales Rep User"
                      permissionIdentifier="Add"
                    >
                      <button
                        id="ManageSaleRepAddButton"
                        className={`btn btn-sm btn-primary px-7 ${
                          openModal ? "d-none" : "d-block"
                        }`}
                        onClick={() => {
                          setOpenModal(!openModal);
                          if (open) {
                            setOpen(!open);
                          }
                        }}
                        aria-controls="ModalCollapse"
                        aria-expanded={openModal}
                      >
                        <i style={{ fontSize: "15px" }} className="fa">
                          &#xf067;
                        </i>
                        <span className="">{t("Add New Sales Rep")}</span>
                      </button>
                    </PermissionComponent>
                  </div>

                  <div
                    className="d-flex align-items-center gap-2 gap-lg-3"
                    onClick={() => {
                      setCurPage(1);
                      setTriggerSearchData((prev: any) => !prev);
                    }}
                  >
                    <button
                      id="ManageSaleRepSearch"
                      className="btn btn-linkedin btn-sm fw-500"
                      aria-controls="Search"
                      onClick={() => loadData(false)}
                    >
                      {t("Search")}
                    </button>
                    <button
                      id="ManageSaleRepReset"
                      type="button"
                      className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                      onClick={resetSeachQuery}
                    >
                      <span>
                        <span>{t("Reset")}</span>
                      </span>
                    </button>
                  </div>
                </div>
                <Box
                  sx={{
                    height: "auto",
                    width: "100%",
                    paddingTop: "0",
                  }}
                >
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={
                        
                       isMobile ?  {} :

                        {
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
                      }}
                      className="shadow-none"
                    >
                      <Table
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      >
                        <TableHead>
                          <TableRow className="h-40px">
                            <TableCell style={{ width: "49px" }}></TableCell>
                            <TableCell style={{ width: "49px" }}></TableCell>
                            <TableCell>
                              <input
                                id="ManageSaleRep1stNameSearch"
                                type="text"
                                name="firstName"
                                value={searchRequest.firstName}
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t("Search ...")}
                                onChange={(e: any) =>
                                  InputSearchRequest(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="ManageSaleReplastNameSearch"
                                type="text"
                                name="lastName"
                                value={searchRequest.lastName}
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t("Search ...")}
                                onChange={(e: any) =>
                                  InputSearchRequest(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="ManageSaleRepEmailSearch"
                                type="text"
                                name="salesRepEmail"
                                value={searchRequest.salesRepEmail}
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t("Search ...")}
                                onChange={(e: any) =>
                                  InputSearchRequest(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="salesRepPhoneSearch"
                                type="text"
                                name="salesRepPhone"
                                value={searchRequest.salesRepPhone}
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t("Search ...")}
                                onChange={(e: any) =>
                                  InputSearchRequest(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id="salesRepSalesGroupSearch"
                                type="text"
                                name="salesGroupName"
                                value={searchRequest.salesGroupName}
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t("Search ...")}
                                onChange={(e: any) =>
                                  InputSearchRequest(
                                    e.target.name,
                                    e.target.value
                                  )
                                }
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell style={{ width: "49px" }}></TableCell>
                            <TableCell style={{ width: "49px" }}>
                              {t("Actions")}
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("firstName")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("First Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "firstName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "firstName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("lastName")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Last Name")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "lastName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "lastName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("salesRepEmail")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Email")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "salesRepEmail"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "salesRepEmail"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("salesRepPhone")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Phone")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "salesRepPhone"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "salesRepPhone"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                             <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("salesGroupName")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Sales Group")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "salesGroupName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "salesGroupName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: "max-content" }}
                            >
                              <div
                                onClick={() => handleSort("status")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: "max-content" }}>
                                  {t("Status")}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "status"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "status"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {loading ? (
                            <TableCell colSpan={8} className="">
                              <Loader />
                            </TableCell>
                          ) : rows.length ? (
                            rows?.map((item: any) => (
                              <>
                                <Row
                                  item={item}
                                  Edit={Edit}
                                  handleClose={handleClose}
                                  DeleteSpecimenTypeAssignmentById={
                                    DeleteSpecimenTypeAssignmentById
                                  }
                                  statusChange={statusChange}
                                  panels={panels}
                                  sports2={sports2}
                                  row={item.panels}
                                  setSports2={setSports2}
                                  setPanels={setPanels}
                                  loadData={loadData}
                                  selectedPanels={selectedPanels}
                                  setSelectedPanels={setSelectedPanels}
                                  check={check}
                                  setOpen={setOpen}
                                />
                              </>
                            ))
                          ) : (
                            <NoRecord colSpan={8} />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                  {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
                  <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
                    {/* =============== */}
                    <p className="pagination-total-record mb-0">
                      {Math.min(pageSize * curPage, total) === 0 ? (
                        <span>
                          {t("Showing 0 to 0 of ")}
                          {total} {t("entries")}
                        </span>
                      ) : (
                        <span>
                          {t("Showing")} {pageSize * (curPage - 1) + 1}{" "}
                          {t("to")} {Math.min(pageSize * curPage, total)}{" "}
                          {t("of Total")}
                          <span> {total} </span> {t("entries")}
                        </span>
                      )}
                    </p>
                    {/* =============== */}
                    <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                      <li
                        className="btn btn-lg p-2 h-33px"
                        onClick={() => showPage(1)}
                      >
                        <i className="fa fa-angle-double-left"></i>
                      </li>
                      <li className="btn btn-lg p-2 h-33px" onClick={prevPage}>
                        <i className="fa fa-angle-left"></i>
                      </li>

                      {pageNumbers.map((page: any) => (
                        <li
                          key={page}
                          className={`px-2 ${
                            page === curPage
                              ? "font-weight-bold bg-primary text-white h-33px"
                              : ""
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => showPage(page)}
                        >
                          {page}
                        </li>
                      ))}

                      <li className="btn btn-lg p-2 h-33px" onClick={nextPage}>
                        <i className="fa fa-angle-right"></i>
                      </li>
                      <li
                        className="btn btn-lg p-2 h-33px"
                        onClick={() => {
                          if (totalPages === 0) {
                            showPage(curPage);
                          } else {
                            showPage(totalPages);
                          }
                        }}
                      >
                        <i className="fa fa-angle-double-right"></i>
                      </li>
                    </ul>
                  </div>
                  {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
                </Box>
              </div>
            </TabPanel>
            <TabPanel value={val} index={1}>
              <ArchiveTab />
            </TabPanel>
          </div>
        </div>
      </div>
    </>
  );
};

export default ManageSalesRepGrid;
