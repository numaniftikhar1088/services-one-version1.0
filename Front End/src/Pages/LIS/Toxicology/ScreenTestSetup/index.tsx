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
import PanelMappingService from "Services/InfectiousDisease/PanelMappingService";
import useLang from "Shared/hooks/useLanguage";
import RequisitionType from "../../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../../Shared/Common/Loader";
import NoRecord from "../../../../Shared/Common/NoRecord";
import PermissionComponent from "../../../../Shared/Common/Permissions/PermissionComponent";
import { useDataContext } from "../../../../Shared/DataContext";
import { ArrowDown, ArrowUp } from "../../../../Shared/Icons";
import { StringRecord } from "../../../../Shared/Type";
import { reactSelectSMStyle, styles } from "../../../../Utils/Common";
import { SortingTypeI } from "../../../../Utils/consts";
import Row from "./Row";
import useIsMobile from "Shared/hooks/useIsMobile";

export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const sortById = {
    clickedIconData: 'DrugClassId',
    sortingOrder: 'desc',
  };
  const { DropDowns } = useDataContext();
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [performingLabs, setPerformingLabs] = useState([]);
  const searchRef = useRef<any>(null);
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
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);
  const [request, setRequest] = useState(false);
  useEffect(() => {
    loadGridData(true, true);
  }, []);

  const handleChange = (name: string, value: any, id: number) => {
    setRows(curr =>
      curr.map(x =>
        x.DrugClassId === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  console.log(rows, "ROWS");

  const intialSearchQuery = {
    drugClassName: "",
    drugClassCode: "",
    specimenTypeId: 0,
    performingLabId: 0,
  };

  const queryDisplayTagNames: StringRecord = {
    drugClassName: "Drug Class",
    drugClassCode: "Test Code",
    specimenTypeId: "Specimen Type",
    performingLabId: "Performing Lab",
  };

  const [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest({
      drugClassName: '',
      drugClassCode: '',
      specimenTypeId: 0,
      performingLabId: 0,
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
      drugClassName: '',
      drugClassCode: '',
      specimenTypeId: 0,
      performingLab: 0,
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.GetAllToxScreenTestSetup({
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
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Get All Data-------------------//////////////////

  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: any) => {
    if (
      row?.DrugClassName &&
      row?.DrugClassCode &&
      row?.SpecimenTypeID &&
      row?.PerformingLabID
    ) {
      setRequest(true);
      const queryModel = {
        drugClassId: row?.DrugClassId,
        drugClassName: row?.DrugClassName,
        drugClassCode: row?.DrugClassCode,
        specimenTypeId: row?.SpecimenTypeID,
        performingLabId: row?.PerformingLabID,
      };
      RequisitionType.SaveToxScreenTestSet(queryModel)
        .then((res: AxiosResponse) => {
          console.log(res, 'Response save ts');
          if (res?.data.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            setRequest(false);
            loadGridData(true, false);
            setIsAddButtonDisabled(false);
          } else {
            toast.error(t(res?.data?.message));
            setRequest(false);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        });
    } else {
      toast.error(t('Fill the required fields'));
    }
  };
  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(prevSearchRequest => {
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

  const getPerformingLabs = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        setPerformingLabs(res?.data || []);
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  useEffect(() => {
    getPerformingLabs();
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag => (
          <div
            key={tag}
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
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`compendiumDataScreenTestRecords`}
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder="Select option"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-allow-clear="true"
              onChange={e => {
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
          <div className="d-flex gap-lg-3 gap-2 justify-content-center">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Compendium Data"
              permissionIdentifier="AddNew"
            >
              <button
                id={`compendiumDataScreenTestAddNew`}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setRows((prevRows: any) => [
                      {
                        DrugClassCode: '',
                        DrugClassId: 0,
                        DrugClassName: '',
                        SpecimenType: '',
                        SpecimenTypeID: 0,
                        PerformingLabID: 0,
                        rowStatus: true,
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
                {t('Add New')}
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`compendiumDataScreenTestSearch`}
              onClick={() => {
                setCurPage(1);
                setTriggerSearchData(prev => !prev);
              }}
              className="btn btn-info btn-sm fw-500"
              aria-controls="Search"
            >
              {t('Search')}
            </button>
            <button
              onClick={resetSearch}
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id={`compendiumDataScreenTestReset`}
            >
              <span>
                <span>{t('Reset')}</span>
              </span>
            </button>
          </div>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile ?{overflowY: 'hidden'}:
                {
                maxHeight: 'calc(100vh - 100px)',
                '&::-webkit-scrollbar': {
                  width: 7,
                },
                '&::-webkit-scrollbar-track': {
                  backgroundColor: '#fff',
                },
                '&:hover': {
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: 'var(--kt-gray-400)',
                    borderRadius: 2,
                  },
                },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: 'var(--kt-gray-400)',
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
                      {' '}
                      <input
                        id={`compendiumDataScreenTestSearchDrugClassName`}
                        type="text"
                        name="drugClassName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchRequest.drugClassName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      {' '}
                      <input
                        id={`compendiumDataScreenTestSearchDrugClassCode`}
                        type="text"
                        name="drugClassCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchRequest.drugClassCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataScreenTestSearchSpecimenType`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={DropDowns?.SpecimenTypeLookup}
                        placeholder={'Select...'}
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
                      <Select
                        menuPortalTarget={document.body}
                        options={performingLabs}
                        styles={reactSelectSMStyle}
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        name="PerformingLabID"
                        value={performingLabs.filter(function (option: any) {
                          return (
                            option.value === searchRequest?.performingLabId
                          );
                        })}
                        onChange={(event: any) => {
                          setSearchRequest({
                            ...searchRequest,
                            performingLabId: event.value,
                          });
                        }}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="w-25px min-w-25px"></TableCell>

                    <TableCell className="min-w-10px w-10px">
                      {t('Actions')}
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('drugClassName')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Drug Class')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'drugClassName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'drugClassName'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('drugClassCode')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Test Code')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'drugClassCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'drugClassCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('specimenTypeId')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        {t('Specimen Type')}
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'specimenTypeId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'specimenTypeId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("specimenTypeId")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        {t("Performing Lab")}
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "specimenTypeId"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "specimenTypeId"
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
                          key={item.DrugClassId}
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
                          performingLabs={performingLabs}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
                  ) : (
                    <NoRecord colSpan={6} />
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
              {t('Showing 0 to 0 of')} {total} {t('entries')}
            </span>
          ) : (
            <span>
              {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
              {Math.min(pageSize * curPage, total)} {t('of Total')}{' '}
              <span> {total} </span> {t('entries')}{' '}
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

          {pageNumbers.map(page => (
            <li
              key={page}
              className={`px-2 ${
                page === curPage
                  ? 'font-weight-bold bg-primary text-white h-33px'
                  : ''
              }`}
              style={{ cursor: 'pointer' }}
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
