import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { AxiosResponse } from "axios";
import { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import useIsMobile from "Shared/hooks/useIsMobile";
import {
  getAllPanelSetup,
  getPanelTypeLookup,
} from "../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium";
import FacilityService from "../../../../Services/FacilityService/FacilityService";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import usePagination from "../../../../Shared/hooks/usePagination";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import CustomPagination from "../../../../Shared/JsxPagination";
import { StringRecord } from "../../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { PortalTypeEnum } from "../../../../Utils/Common/Enums/Enums";
import { sortById, SortingTypeI } from "../../../Compendium/TestType";
import useLang from "./../../../../Shared/hooks/useLanguage";
import {
  GroupDetails,
  InitialSearchQuery,
  PanelTypes,
  ReferenceLab,
  RowInterface,
  TBL_HEADERS,
} from "./Headers";
import Row from "./Row";

const Index = () => {
  const [rows, setRows] = useState<RowInterface[]>([]);

  const isMobile = useIsMobile();
  const isAdmin = useSelector(
    (state: any) =>
      state?.Reducer?.selectedTenantInfo?.infomationOfLoggedUser?.adminType ===
      PortalTypeEnum.Admin
  );
  const [groupLookup, setGroupLookup] = useState<GroupDetails[]>([]);
  const [referenceLab, setReferenceLab] = useState<ReferenceLab[]>([]);
  const [panelTypes, setPanelTypes] = useState<PanelTypes[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] =
    useState<boolean>(false);
  const [sort, setSort] = useState<SortingTypeI>({
    sortingOrder: null,
    clickedIconData: "",
  });
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  //---------UTILITY FNS-----------

  const { t } = useLang();
  const {
    curPage,
    pageSize,
    total,
    totalPages,
    pageNumbers,
    nextPage,
    prevPage,
    showPage,
    setPageSize,
    setTotal,
    setCurPage,
  } = usePagination();

  const handleSort = useCallback((columnName: string) => {
    setSort((prevSort) => ({
      sortingOrder:
        prevSort.clickedIconData === columnName &&
        prevSort.sortingOrder === "asc"
          ? "desc"
          : "asc",
      clickedIconData: columnName,
    }));
  }, []);

  //------------ Fns -------

  const initialSearchQuery: InitialSearchQuery = {
    panelName: "",
    groupId: 0,
    groupName: "",
    sortOrder: 0,
  };

  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const queryDisplayTagNames: StringRecord = {
    panelName: "Panel Name",
    groupName: "Group Name",
    sortOrder: "Sort Order",
  };

  const getPanelData = async (
    reset: boolean = false,
    loading: boolean = true
  ) => {
    try {
      setIsLoading(loading);
      setIsAddButtonDisabled(true);
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchRequest).map(([key, value]) => [
          key,
          typeof value === "string" ? value.trim() : value,
        ])
      );
      const initialQueryModel = {
        pageNumber: curPage,
        pageSize: pageSize,
        sortDirection: sort?.sortingOrder,
        sortColumn: sort?.clickedIconData,
        queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      };
      const res = await getAllPanelSetup(initialQueryModel);
      console.log("ewaaaaaaaaaaaaaaaaaaaaaa==>", curPage);

      console.log("ewaaaaaaaaaaaaaaaaaaaaaa==>", initialQueryModel, res);

      if (res?.data?.result) {
        setRows(res.data.result);
        setTotal(res?.data?.totalRecord);
      }
    } catch (error) {
      console.error(
        "An error occurred while fetching Blood Tests setup:",
        error
      );
    } finally {
      setIsLoading(false);
      setIsAddButtonDisabled(false);
    }
  };
  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData((prev) => !prev);
  };

  // PANEL TYPE LOOKUP EXPAND LOOKUP
  const panelTypeLookup = async () => {
    try {
      const res = await getPanelTypeLookup();
      setPanelTypes(res?.data);
    } catch (error) {
      console.error("Error fetching panel types:", error);
    }
  };

  // GROUP DROPDOWN LOOKUP
  const fetchGroupLookup = async () => {
    try {
      const res: AxiosResponse = await FacilityService.groupLookup(2);
      setGroupLookup(res?.data);
    } catch (err: any) {
      console.trace(err);
    }
  };

  // LABS LOOKUP
  const fetchReferenceLab = async () => {
    try {
      const res: AxiosResponse = await FacilityService.referenceLabLookup();
      const referenceArray: ReferenceLab[] =
        res?.data?.data?.map((val: any) => ({
          value: val?.labId,
          label: val?.labDisplayName,
        })) || [];
      setReferenceLab(referenceArray);
    } catch (err: any) {
      console.error("Error fetching reference labs:", err.message);
    }
  };

  // PAGINATION CHANGE
  useEffect(() => {
    getPanelData(false, true);
  }, [sort, curPage, pageSize]);

  useEffect(() => {
    console.log("calling uswedsr");

    getPanelData(false, true);
  }, [triggerSearchData]);

  useEffect(() => {
    panelTypeLookup();
    fetchGroupLookup();
    fetchReferenceLab();
  }, []);

  const handleChange = (name: string, value: string, id: number) => {
    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              [name]:
                name === "sortOrder"
                  ? value === ""
                    ? null
                    : parseInt(value, 10)
                  : value,
            }
          : x
      )
    );
  };

  const handleChangeGroup = (id: number, selectedOption: any) => {
    const groupId = selectedOption?.value || null;
    const groupName = selectedOption?.label || "";

    setRows((curr: any) =>
      curr.map((x: any) =>
        x.id === id
          ? {
              ...x,
              groupName: groupName,
              groupId: groupId,
            }
          : x
      )
    );
  };

  function handleReset() {
    setSearchRequest(initialSearchQuery);
    setSort({ sortingOrder: null, clickedIconData: "" });
    getPanelData(true, true);
    setPageSize(50);
    setIsAddButtonDisabled(false);
  }

  // Handling searchedTags
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((searchRequest) => {
      return {
        ...searchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  // type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: any) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  const onInputSearchGroup = (e: any) => {
    setSearchRequest({
      ...searchRequest,
      groupName: e.label,
      groupId: e.value,
    });
  };
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag) =>
          tag === "groupId" ? null : (
            <div
              className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
              onClick={() => handleTagRemoval(tag)}
            >
              <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
              <i className="bi bi-x"></i>
            </div>
          )
        )}
      </div>

      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="mr-3 font-weight-bold">{t("Records")}</span>
            <select
              id={`BloodCompendiumDataCategorySetupRecords`}
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder={t("Select option")}
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
          <div className="d-flex gap-2 justify-content-center justify-content-sm-start">
            <div>
              <button
                id={`BloodCompendiumDataCategorySetupAddNew`}
                className="btn btn-primary btn-sm text-capitalize fw-400"
                disabled={isAddButtonDisabled}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setRows((prevRows: any) => [
                      {
                        rowStatus: true,
                        ...initialSearchQuery,
                        sortOrder: null,
                      },
                      ...prevRows,
                    ]);
                    setIsAddButtonDisabled(true);
                  }
                }}
              >
                <i className="bi bi-plus-lg"></i>
                {t("Add New")}
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 ">
          <button
            id={`BloodCompendiumDataCategorySetupSearch`}
            onClick={() => handleSearch()}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            {t("Search")}
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`BloodCompendiumDataCategorySetupReset`}
          >
            <span>
              <span>{t("Reset")}</span>
            </span>
          </button>
        </div>
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
                      // overflowX: "hidden",
                    }
              }
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead sx={{ zIndex: `99 !important` }}>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        id={`BloodCompendiumDataCategorySetupCategoryNameSearch`}
                        type="text"
                        name="panelName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t("Search ...")}
                        value={searchRequest.panelName}
                        onChange={onInputChangeSearch}
                        onKeyDown={(e) => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`BloodCompendiumDataCategorySetupGroupSearch`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={groupLookup}
                        name="groupName"
                        styles={reactSelectSMStyle}
                        placeholder={t("Group")}
                        value={groupLookup.filter(
                          (s: any) => s.value === searchRequest.groupId
                        )}
                        onChange={(e: any) => onInputSearchGroup(e)}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    {isAdmin && (
                      <TableCell>
                        <input
                          id={`BloodCompendiumDataCategorySetupSortOrderSearch`}
                          type="number"
                          name="sortOrder"
                          className="form-control bg-white min-w-100px w-100 rounded-2 fs-8 h-30px"
                          placeholder={t("Search ...")}
                          value={searchRequest.sortOrder || ""}
                          onChange={onInputChangeSearch}
                          onKeyDown={(e) => handleKeyPress(e)}
                          min="1"
                        />
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell className="w-10px"></TableCell>
                    {TBL_HEADERS.map(({ name, variable }) => (
                      <TableCell
                        key={variable || name}
                        className={`${
                          name === "Actions" ? "w-50px" : ""
                        } min-w-50px`}
                      >
                        <div
                          onClick={() => handleSort(variable)}
                          className={`d-flex justify-content-between cursor-pointer`}
                        >
                          <div style={{ width: "max-content" }}>{t(name)}</div>

                          {variable !== "" ? (
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === "desc" &&
                                  sort.clickedIconData === variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === "asc" &&
                                  sort.clickedIconData === variable
                                    ? "text-success fs-7"
                                    : "text-gray-700 fs-7"
                                }  p-0 m-0`}
                              />
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    ))}
                    {isAdmin && (
                      <TableCell className="min-w-50px">
                        <div
                          onClick={() => handleSort("sortOrder")}
                          className="d-flex justify-content-between cursor-pointer"
                        >
                          <div style={{ width: "max-content" }}>
                            {t("Sequence")}
                          </div>
                          <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                            <ArrowUp
                              CustomeClass={`${
                                sort.sortingOrder === "desc" &&
                                sort.clickedIconData === "sortOrder"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0 "`}
                            />
                            <ArrowDown
                              CustomeClass={`${
                                sort.sortingOrder === "asc" &&
                                sort.clickedIconData === "sortOrder"
                                  ? "text-success fs-7"
                                  : "text-gray-700 fs-7"
                              }  p-0 m-0`}
                            />
                          </div>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isLoading ? (
                    <TableCell colSpan={isAdmin ? 10 : 9} className="padding-0">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows?.map((item: RowInterface, index: number) => (
                      <Row
                        item={item}
                        initialSearchQuery={initialSearchQuery}
                        key={item.id}
                        index={index}
                        panelTypes={panelTypes}
                        referenceLab={referenceLab}
                        setRows={setRows}
                        rows={rows}
                        handleChange={handleChange}
                        groupLookup={groupLookup}
                        getPanelData={getPanelData}
                        setIsAddButtonDisabled={setIsAddButtonDisabled}
                        setSearchRequest={setSearchRequest}
                        handleChangeGroup={handleChangeGroup}
                        isAdmin={isAdmin}
                      />
                    ))
                  ) : (
                    <NoRecord />
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
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
        </Box>
      </div>
    </>
  );
};

export default Index;
