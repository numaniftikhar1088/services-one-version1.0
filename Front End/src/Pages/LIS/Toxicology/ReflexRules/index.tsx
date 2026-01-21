import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import Select from "react-select";
import { toast } from "react-toastify";
import useLang from "Shared/hooks/useLanguage";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useDataContext } from "../../../../Shared/DataContext";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import { StringRecord } from "../../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { SortingTypeI, sortById } from "../../../../Utils/consts";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";

export interface IRows {
  Id: number;
  PerformingLabId: number;
  SpecimenTypeId: number;
  ScreenTestName: string;
  ScreenTestCode: string;
  ScreenTestId: number;
  ScreenDrugClass: string;
  ScreenDrugClassId: number;
  ConfirmationTestName: string;
  ConfirmationTestCode: string;
  ConfirmationDrugClassId: number;
  ConfirmationDrugClass: string;
  rowStatus: boolean | undefined;
}

export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const { DropDowns } = useDataContext();
  const [testCode, setTestCode] = useState({
    ScreeningLookup: [],
    ConfirmationLookup: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<IRows[]>(() => []);
  const [request, setRequest] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [confirmationTestLookup, setConfirmationTestLookup] = useState([]);
  const [screeningConfirmationTestLookup, setScreeningConfirmationTestLookup] =
    useState([]);
  const [isEditing, setIsEditing] = useState({
    isEditing: false,
    rowIndex: 0,
  });
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumbers, setPageNumbers] = useState<number[]>([]);

  const nextPage = () => {
    if (curPage < Math.ceil(total / pageSize)) {
      setCurPage(curPage + 1);
    }
  };

  const showPage = (i: number) => {
    setCurPage(i);
  };

  const prevPage = () => {
    if (curPage > 1) {
      setCurPage(curPage - 1);
    }
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / pageSize));
    const pgNumbers = [];
    for (let i = curPage - 2; i <= curPage + 2; i++) {
      if (i > 0 && i <= totalPages) {
        pgNumbers.push(i);
      }
    }
    setPageNumbers(pgNumbers);
  }, [total, curPage, pageSize, totalPages]);

  useEffect(() => {
    loadGridData(true, false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  useEffect(() => {
    loadGridData(true, true);
  }, []);

  const convertArray = (array: any) => {
    // Check if this is already mapped data (has value and label properties)
    if (
      array.length > 0 &&
      array[0].hasOwnProperty("value") &&
      array[0].hasOwnProperty("label")
    ) {
      return array; // Return as-is if already mapped
    }

    // Check if this is DrugClassLookup data (has ID and DrugClass)
    if (
      array.length > 0 &&
      array[0].hasOwnProperty("ID") &&
      array[0].hasOwnProperty("DrugClass")
    ) {
      return array.map((item: any) => ({
        value: item.ID,
        label: item.DrugClass,
      }));
    }

    // Default mapping for TestLookup data
    return array.map((item: any) => ({
      value: item.TestId,
      label: item.TestName,
      code: item.TestCode,
    }));
  };

  const convertState = (state: any) => {
    const newState: any = {};
    for (const key in state) {
      if (Array.isArray(state[key])) {
        console.log(state, key, "state[key]");

        newState[key] = convertArray(state[key]);
      } else {
        newState[key] = state[key];
      }
    }
    return newState;
  };

  const handleChange = async (
    name: string,
    value: any,
    id: number,
    event: any
  ) => {
    setRows((curr) =>
      curr.map((x) =>
        x.Id === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );

    if (name === "ConfirmationTestId") {
      const selectedTest: any = confirmationTestLookup.find(
        (option: any) => option.value === event.value
      );
      setRows((curr) =>
        curr.map((x) =>
          x.Id === id
            ? {
                ...x,
                ConfirmationTestCode: selectedTest?.code || "",
                ConfirmationTestName: event.label,
              }
            : x
        )
      );
    }

    if (name === "ScreenTestName") {
      console.log(event, "selectedTest");

      setRows((curr) =>
        curr.map((x) =>
          x.Id === id
            ? {
                ...x,
                ScreenTestCode: event?.code || "",
                ScreenTestName: event.label,
              }
            : x
        )
      );
    }

    if (name === "ScreenTestId") {
      setRows((curr) =>
        curr.map((x) =>
          x.Id === id
            ? {
                ...x,
                ScreenTestCode: event.code,
                ScreenDrugClass: event.label,
                ScreenDrugClassId: event.value,
              }
            : x
        )
      );

      await RequisitionType.getConfirmationTestOnConfirmationDrugClass(
        value
      ).then((value: any) => {
        setScreeningConfirmationTestLookup(
          value?.data?.result?.map((item: any) => ({
            value: item.id,
            label: item.testDisplayName,
            code: item.testCode,
          }))
        );
      });
    }

    if (name === "ConfirmationDrugClass") {
      setRows((curr) =>
        curr.map((x) =>
          x.Id === id
            ? {
                ...x,
                ConfirmationDrugClassId: value,
                ConfirmationDrugClass: event.label,
              }
            : x
        )
      );

      await RequisitionType.getConfirmationTestOnConfirmationDrugClass(
        value
      ).then((value: any) => {
        setConfirmationTestLookup(
          value?.data?.result?.map((item: any) => ({
            value: item.id,
            label: item.testDisplayName,
            code: item.testCode,
          }))
        );
      });
    }
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  let intialSearchQuery = {
    performingLabId: 0,
    specimenTypeId: 0,
    screenTestName: "",
    screenTestCode: "",
    confirmationTestName: "",
    confirmationTestCode: "",
    confirmationDrugClass: "",
    screenDrugClass: "",
  };
  const queryDisplayTagNames: StringRecord = {
    performingLabId: "Performing Lab",
    specimenTypeId: "Specimen Type",
    screenTestName: "Screen Analyte Name",
    screenTestCode: "Screen Analyte Code",
    confirmationTestName: "Confirmation Analyte Name",
    confirmationTestCode: "Confirmation Analyte Code",
    confirmationDrugClass: "Confirmation Drug Analyte",
    screenDrugClass: "Screen Drug Class",
  };

  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest({
      performingLabId: 0,
      specimenTypeId: 0,
      screenTestName: "",
      screenTestCode: "",
      confirmationTestName: "",
      confirmationTestCode: "",
      confirmationDrugClass: "",
      screenDrugClass: "",
    });
    loadGridData(true, true, sortById);
    setSorting(sortById);
  }
  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    setIsAddButtonDisabled(false);
    const nullObj = {
      performingLabId: 0,
      specimenTypeId: 0,
      screenTestName: "",
      screenTestCode: "",
      confirmationTestName: "",
      confirmationTestCode: "",
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    RequisitionType.ToxCompendiumReflexRule({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);
        setRows(res?.data?.result);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, "err");
        setLoading(false);
      });
  };

  console.log(rows[0], "iaosdjoia");

  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: any) => {
    if (
      row?.PerformingLabId &&
      row?.SpecimenTypeId &&
      row?.ScreenDrugClass &&
      row?.ScreenTestId &&
      row?.ScreenTestName &&
      row?.ScreenTestCode &&
      row?.ConfirmationTestId &&
      row?.ConfirmationTestName &&
      row?.ConfirmationTestCode &&
      row?.ConfirmationDrugClassId && 
      row?.ConfirmationDrugClass
    ) {
      setRequest(true);
      RequisitionType.SaveToxRefelexRules(row)
        .then((res: AxiosResponse) => {
          if (res?.data.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            setRequest(false);
            loadGridData(true, false);
            setRequest(false);
            setIsAddButtonDisabled(false);
          } else {
            toast.error(res?.data?.message);
            setRequest(false);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error("Fill the required fields");
    }
  };
  // *********** All Dropdown Function END ***********
  const searchRef = useRef<any>(null);
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

  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      setCurPage(1);
      setTriggerSearchData((prev) => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (intialSearchQuery as any)[clickedTag],
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

  const getConfirmationDrugClassLookup = async (payload: any) => {
    if (
      rows[isEditing.rowIndex]?.rowStatus &&
      rows[isEditing.rowIndex]?.PerformingLabId &&
      rows[isEditing.rowIndex]?.SpecimenTypeId
    ) {
      let response =
        await RequisitionType.getConfirmationDrugClassLookup(payload);

      console.log(
        response?.data?.result,
        "Confirmation DrugClassLookup raw data"
      );

      setTestCode((prev: any) => ({
        ...prev,
        ConfirmationLookup: response?.data?.result,
      }));
    }
  };

  const getConfirmationDrugClassForScreening = async (payload: any) => {
    if (
      rows[isEditing.rowIndex]?.rowStatus &&
      rows[isEditing.rowIndex]?.PerformingLabId &&
      rows[isEditing.rowIndex]?.SpecimenTypeId
    ) {
      let response =
        await RequisitionType.getConfirmationDrugClassLookup(payload);

      setTestCode((prev: any) => ({
        ...prev,
        ScreeningLookup: response?.data?.result,
      }));
    }
  };

  useEffect(() => {
    if (
      rows[isEditing.rowIndex]?.PerformingLabId &&
      rows[isEditing.rowIndex]?.SpecimenTypeId
    ) {
      let payload = {
        performingLabId: rows[isEditing.rowIndex]?.PerformingLabId,
        specimenTypeId: rows[isEditing.rowIndex]?.SpecimenTypeId,
        testTypeId: 2,
      };
      getConfirmationDrugClassLookup(payload);
      getConfirmationDrugClassForScreening({ ...payload, testTypeId: 3 });
    }
  }, [
    rows[isEditing.rowIndex]?.PerformingLabId,
    rows[isEditing.rowIndex]?.SpecimenTypeId,
    isEditing,
  ]);

  const getConfirmationTestName = async (value: number) => {
    await RequisitionType.getConfirmationTestOnConfirmationDrugClass(
      value ?? 0
    ).then((value: any) => {
      setConfirmationTestLookup(
        value?.data?.result?.map((item: any) => ({
          value: item.id,
          label: item.testDisplayName,
          code: item.testCode,
        }))
      );
    });
  };

  const getConfirmationTestNameForScreening = async (value: number) => {
    await RequisitionType.getConfirmationTestOnConfirmationDrugClass(
      value ?? 0
    ).then((value: any) => {
      setScreeningConfirmationTestLookup(
        value?.data?.result?.map((item: any) => ({
          value: item.id,
          label: item.testDisplayName,
          code: item.testCode,
        }))
      );
    });
  };

  useEffect(() => {
    getConfirmationTestName(rows[isEditing.rowIndex]?.ConfirmationDrugClassId);
    getConfirmationTestNameForScreening(
      rows[isEditing.rowIndex]?.ScreenDrugClassId
    );
  }, [isEditing]);

  useEffect(() => {
    return () => setIsAddButtonDisabled(false);
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag) => (
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
            <span className="fw-400 mr-3">{t("Records")}</span>
            <select
              id={`compendiumDataReflexRulesRecord`}
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
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Compendium Data"
              permissionIdentifier="AddNew"
            >
              <button
                id={`compendiumDataReflexRulesAddNew`}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setRows((prevRows: any) => [
                      {
                        Id: 0,
                        PerformingLabId: 0,
                        SpecimenTypeId: 0,
                        ScreenTestName: "",
                        ScreenTestCode: "",
                        ConfirmationTestName: "",
                        ConfirmationTestCode: "",
                        ConfirmationDrugClass: "",
                        rowStatus: true,
                        ScreenTestId: 0,
                      },
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
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`compendiumDataReflexRulesSearch`}
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
              id={`compendiumDataReflexRulesReset`}
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
                
                isMobile ?{overflowY: 'hidden'}:
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
                    <TableCell>
                      <Select
                        inputId={`compendiumDataReflexRulesSearchPerformingLabId`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.ReferenceLabLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            performingLabId: event.value,
                          });
                        }}
                        value={DropDowns?.ReferenceLabLookup.filter(function (
                          option: any
                        ) {
                          return (
                            option.value === searchRequest?.performingLabId
                          );
                        })}
                        onKeyDown={handleKeyPress}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataReflexRulesSearchSpecimenType`}
                        menuPortalTarget={document.body}
                        theme={(theme) => styles(theme)}
                        options={DropDowns?.SpecimenTypeLookup}
                        placeholder={"Select..."}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            specimenTypeId: event.value,
                          });
                        }}
                        value={DropDowns?.SpecimenTypeLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchRequest?.specimenTypeId;
                        })}
                        onKeyDown={handleKeyPress}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchScreenTestName`}
                        type="text"
                        name="screenDrugClass"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.screenDrugClass}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchScreenTestCode`}
                        type="text"
                        name="screenTestName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.screenTestName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchConfirmationDrugClass`}
                        type="text"
                        name="screenTestCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.screenTestCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchConfirmationDrugClass`}
                        type="text"
                        name="confirmationDrugClass"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.confirmationDrugClass}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchConfirmatioTestName`}
                        type="text"
                        name="confirmationTestName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.confirmationTestName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataReflexRulesSearchConfirmationTestCode`}
                        type="text"
                        name="confirmationTestCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t("Search ...")}
                        value={searchRequest.confirmationTestCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell className="min-w-50px w-50px">Actions</TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("performingLabId")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Performing Lab")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "performingLabId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "performingLabId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("specimenType")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Specimen Type")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "specimenType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "specimenType"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("screenTestName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {" "}
                          {t("Screen Drug Class")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "screenTestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "screenTestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("screenTestCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Screen Analyte Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "screenTestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "screenTestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("screenTestCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Screen Analyte Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "screenTestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "screenTestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("confirmationDrugClass")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Confirmation Drug Analyte")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "confirmationDrugClass"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "confirmationDrugClass"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("confirmationTestName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Confirmation Analyte Name")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "confirmationTestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "confirmationTestName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: "max-content" }}
                      className="min-w-250px w-250px"
                    >
                      <div
                        onClick={() => handleSort("confirmationTestCode")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>
                          {t("Confirmation Analyte Code")}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "confirmationTestCode"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "confirmationTestCode"
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
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          key={item.Id}
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          dropDownValues={DropDowns}
                          handleChange={handleChange}
                          handleSubmit={handleSubmit}
                          loadGridData={loadGridData}
                          request={request}
                          setRequest={setRequest}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                          testCode={convertState(testCode)}
                          confirmationTestLookup={confirmationTestLookup}
                          setIsEditing={setIsEditing}
                          screeningConfirmationTestLookup={
                            screeningConfirmationTestLookup
                          }
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={8} />
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

          {pageNumbers.map((page) => (
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
}
