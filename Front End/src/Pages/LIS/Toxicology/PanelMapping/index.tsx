import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import * as React from "react";
import { useEffect, useState } from "react";
import Select from "react-select";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import PermissionComponent, { AnyPermission } from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useDataContext } from "../../../../Shared/DataContext";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import ArrowBottomIcon from "../../../../Shared/SVG/ArrowBottomIcon";
import { InputChangeEvent } from "../../../../Shared/Type";
import usePagination from "../../../../Shared/hooks/usePagination";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../../Utils/Style/Dropdownstyle";
import { sortById } from "../../../../Utils/consts";
import Row from "./Row";
import useLang from "Shared/hooks/useLanguage";
import useIsMobile from "Shared/hooks/useIsMobile";

// export default function CollapsibleTable() {

export const PanelMappingTable = (props: {
  LoadPanelMappingData: any;
  setTotal: any;
  setToxPanelMappingData: any;
  toxPanelMappingData: any;
  setLoading: any;
  loading: any;
  setSearchQuery: any;
  searchQuery: any;
  curPage: any;
  pageSize: any;
  setSorting: any;
  sort: any;
  total: any;
  initialSearchQuery: any;
  totalPages: any;
  pageNumbers: any;
  nextPage: any;
  prevPage: any;
  showPage: any;
  setPageSize: any;
  setCurPage: any;
}) => {
  const {
    LoadPanelMappingData,
    setToxPanelMappingData,
    toxPanelMappingData,
    setLoading,
    loading,
    setSearchQuery,
    searchQuery,
    curPage,
    pageSize,
    setSorting,
    sort,
    total,
    initialSearchQuery,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setCurPage,
  } = props;

  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const {
    DropDowns,
    searchRef,
    isAddButtonDisabled,
    setIsAddButtonDisabled,
    request1,
    setRequest1,
    ApiCallsForToxicology,
    downloadAll,
    downloadSelected,
    selectedBox1,
    handleChangePanelMappinfId,
    handleAllSelect,
  } = useDataContext();

  useEffect(() => {
    ApiCallsForToxicology();
  }, []);

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  const queryDisplayTagNames: Record<string, string> = {
    PerformingLabId: "Performing Lab",
    PanelTypeId: "Panel Type",
    PanelName: "Panel Name",
    PanelCode: "Panel Code",
    SpecimenTypeID: "Specimen Type",
    TestName: "Test Name",
    DrugClass: "Drug Class",
    TestCode: "Test Code",
    GroupName: "Group Name",
    Unit: "Unit",
    Cutoff: "Cutoff",
    Linearity: "Linearity",
  };

  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [isInitialRender3, setIsInitialRender3] = useState(false);
  const [isEditing, setIsEditing] = useState({
    isEditing: false,
    rowIndex: 0,
  });

  useEffect(() => {
    if (isInitialRender2) {
      LoadPanelMappingData(false);
    } else {
      setIsInitialRender2(true);
    }
  }, []);

  useEffect(() => {
    if (isInitialRender) {
      LoadPanelMappingData(false);
    } else {
      setIsInitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = useState({
    dropdown1: null,
    dropdown2: null,
  });
  const openDrop = Boolean(anchorEl.dropdown1) || Boolean(anchorEl.dropdown2);

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  useEffect(() => {
    if (isInitialRender3) {
      LoadPanelMappingData(false);
    } else {
      setIsInitialRender3(true);
    }
  }, [sort]);

  const resetSearch = () => {
    setSearchQuery(initialSearchQuery);
    LoadPanelMappingData(true);
    setSorting(sortById);
  };

  useEffect(() => {
    LoadPanelMappingData(true);
  }, []);

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  const [groupValues, setGroupValues] = useState<any>([]);
  const [groupTestNames, setGroupTestNames] = useState<any>([]);
  const [groupTest, setGroupTest] = useState<any>({});

  const handleChange = (name: string, value: any, id: number) => {
    if (name === "TestId") {
      let obj = groupTestNames.find((item: any) => item.TestId === value);
      setGroupTest(obj);
    }

    setToxPanelMappingData((curr: any) =>
      curr.map((x: any) =>
        x.Id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };

  const getTestLookUpData = async (rowIndex: number) => {
    if (
      toxPanelMappingData[rowIndex]?.rowStatus &&
      toxPanelMappingData[rowIndex]?.PerformingLabId &&
      toxPanelMappingData[rowIndex]?.SpecimenTypeID &&
      toxPanelMappingData[rowIndex]?.PanelTypeId
    ) {
      const payload = {
        performingLabId: toxPanelMappingData[rowIndex].PerformingLabId,
        specimenTypeId: toxPanelMappingData[rowIndex].SpecimenTypeID,
        testTypeId: toxPanelMappingData[rowIndex].PanelTypeId,
      };
      const res = await RequisitionType.TestLookup(payload);
      if (res) {
        setGroupTestNames(res?.data?.result);
        setGroupTest(
          res?.data?.result.find(
            (item: any) => item.TestId === toxPanelMappingData[rowIndex].TestId
          )
        );
        setGroupValues(
          res?.data?.result.map((item: any) => {
            return {
              label: item.TestName,
              value: item.TestId,
            };
          })
        );
      }
    }
  };

  useEffect(() => {
    getTestLookUpData(isEditing.rowIndex);
  }, [
    toxPanelMappingData[isEditing.rowIndex]?.PerformingLabId,
    toxPanelMappingData[isEditing.rowIndex]?.PanelTypeId,
    toxPanelMappingData[isEditing.rowIndex]?.SpecimenTypeID,
    isEditing,
  ]);

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchQuery((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchQuery)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchQuery]);

  useEffect(() => {
    if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag: any) => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-2">{t("Records")}</span>
            <select
              id={`compendiumDataPanelMapingRecords`}
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
          <div className="d-flex gap-lg-3 gap-2">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Compendium Data"
              permissionIdentifier="AddNew"
            >
              <button
                id={`compendiumDataPanelMapingAddNew`}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setToxPanelMappingData((prevRows: any) => [
                      { rowStatus: true, ...initialSearchQuery },
                      ...prevRows,
                    ]);
                    setIsAddButtonDisabled(true);
                  }
                }}
                color="success"
                className="btn btn-primary btn-sm text-capitalize fw-400"
              >
                <i className="bi bi-plus-lg"></i>
                {t("Add New")}
              </button>
            </PermissionComponent>

            <div>
              <AnyPermission
                moduleName="TOX LIS"
                pageName="Compendium Data"
                permissionIdentifiers={[
                  "ExportAllRecords",
                  "ExportSelectedRecords",
                ]}
              >
                <StyledDropButton
                  id={`compendiumDataPanelMapingBulkAction`}
                  aria-controls={openDrop ? "demo-positioned-menu2" : undefined}
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
                    moduleName="TOX LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportAllRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        className="p-0 text-dark w-200px"
                        id={`compendiumDataPanelMapingExportAll`}
                        onClick={() => {
                          handleClose("dropdown2");
                          downloadAll();
                        }}
                      >
                        {t("Export All Records")}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                  <PermissionComponent
                    moduleName="TOX LIS"
                    pageName="Compendium Data"
                    permissionIdentifier="ExportSelectedRecords"
                  >
                    <MenuItem className="p-0">
                      <a
                        className="p-0 text-dark w-200px"
                        id={`compendiumDataPanelMapingExportSelected`}
                        onClick={() => {
                          handleClose("dropdown2");
                          downloadSelected();
                        }}
                      >
                        {t("Export Selected Records")}
                      </a>
                    </MenuItem>
                  </PermissionComponent>
                </StyledDropMenu>
              </AnyPermission>
            </div>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`compendiumDataPanelMapingSearch`}
              onClick={() => {
                setCurPage(1);
                setTriggerSearchData((prev) => !prev);
              }}
              className="btn btn-info btn-sm fw-500"
              aria-controls="Search"
            >
              {t("Search")}
            </button>
            <button
              onClick={resetSearch}
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id={`compendiumDataPanelMapingReset`}
            >
              <span>
                <span>{t("Reset")}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: "auto", width: "100%" }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                isMobile?
                {overflowY: 'hidden'}
                :
                
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
              // component={Paper}
              className="shadow-none"
            // sx={{ maxHeight: 'calc(100vh - 100px)' }}
            >
              <Table
                // stickyHeader
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      {" "}
                      <Select
                        inputId={`compendiumDataPanelMapingPerformingLabSearch`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.ReferenceLabLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            PerformingLabId: event?.value,
                          });
                        }}
                        value={DropDowns?.ReferenceLabLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchQuery?.PerformingLabId;
                        })}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <Select
                        inputId={`compendiumDataPanelMapingPanelTypeSearch`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.PanelTypeLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            PanelTypeId: event?.value,
                          });
                        }}
                        value={DropDowns?.PanelTypeLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchQuery?.PanelTypeId;
                        })}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataPanelMapingPanelNameSearch`}
                        type="text"
                        name="PanelName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.PanelName}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataPanelMapingPanelCodeSearch`}
                        type="text"
                        name="PanelCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.PanelCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataPanelMapingSpecimenTypeSearch`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.SpecimenTypeLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            SpecimenTypeID: event.value,
                          });
                        }}
                        value={DropDowns?.SpecimenTypeLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchQuery?.SpecimenTypeID;
                        })}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataPanelMapingTestNameSearch`}
                        type="text"
                        name="TestName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.TestName}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {" "}
                      <input
                        id={`compendiumDataPanelMapingTestCodeSearch`}
                        type="text"
                        name="TestCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchQuery.TestCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                      />{" "}
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataPanelMapingGroupSearch`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.GroupLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            GroupName: event.label,
                          });
                        }}
                        value={DropDowns?.GroupLookup.filter(function (
                          option: any
                        ) {
                          return option.label === searchQuery?.GroupName;
                        })}
                        onKeyDown={(e) => {
                          handleKeyPress(e);
                        }}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-25px min-w-25px">
                      <div className="d-flex justify-content-center">
                        <label className="form-check form-check-sm form-check-solid d-flex justify-content-center">
                          <input
                            id={`compendiumDataPanelMapingCheckAll`}
                            className="form-check-input"
                            type="checkbox"
                            onChange={(e) =>
                              handleAllSelect(
                                e.target.checked,
                                toxPanelMappingData
                              )
                            }
                          />
                        </label>
                      </div>
                    </TableCell>
                    <TableCell className="min-w-50px">{t("Actions")}</TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("PerformingLabId")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {" "}
                          {t("Performing Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "PerformingLabId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "PerformingLabId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("PanelTypeId")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Panel Type")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "PanelTypeId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "PanelTypeId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort("PanelName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Panel Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "PanelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "PanelName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort("PanelCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Panel Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "PanelCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "PanelCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort("SpecimenTypeID")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {" "}
                          {t("Specimen Type")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "SpecimenTypeID"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "SpecimenTypeID"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort("TestName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Test Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "TestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "TestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("TestCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Test Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "TestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "TestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort("GroupName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>{t("Group")}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "GroupName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "GroupName"
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
                    <TableCell colSpan={13}>
                      <Loader />
                    </TableCell>
                  ) : toxPanelMappingData.length ? (
                    toxPanelMappingData.map((item: any, index: any) => {
                      return (
                        <Row
                          groupValues={groupValues}
                          setIsEditing={setIsEditing}
                          isEditing={isEditing}
                          row={item}
                          index={index}
                          groupTest={groupTest}
                          rows={toxPanelMappingData}
                          setRows={setToxPanelMappingData}
                          dropDownValues={DropDowns}
                          handleChange={handleChange}
                          loadGridData={LoadPanelMappingData}
                          request={request1}
                          setRequest={setRequest1}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                          handleChangePanelMappinfId={
                            handleChangePanelMappinfId
                          }
                          selectedBox={selectedBox1}
                          queryDisplayTagNames={queryDisplayTagNames}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={10} />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ==========================================================================================
                    //====================================  PAGINATION START =====================================
                    //============================================================================================ */}
      <div className="d-flex flex-wrap gap-4 align-items-center justify-content-sm-between justify-content-center mt-4">
        <p className="pagination-total-record mb-0">
          {Math.min(pageSize * curPage, total) === 0 ? (
            <span>
              {t("Showing 0 to 0 of")} {total} {t("entries")}
            </span>
          ) : (
            <span>
              {t("Showing")} {pageSize * (curPage - 1) + 1} {t("to")}{" "}
              {Math.min(pageSize * curPage, total)} {t("of Total")}{" "}
              <span> {total} </span> {t("entries")}{" "}
            </span>
          )}
        </p>
        <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
          <li className="btn btn-lg p-2 h-33px" onClick={() => showPage(1)}>
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
    </>
  );
};
