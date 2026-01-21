import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { AxiosResponse } from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import useIsMobile from 'Shared/hooks/useIsMobile';
import useLang from 'Shared/hooks/useLanguage';
import {
  getAllTestSetup,
  getTestMethodDataLookup
} from '../../../../Services/Compendium/BloodLisCompendium/BloodLisCompendium';
import RequisitionType from '../../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../../Shared/Common/Loader';
import NoRecord from '../../../../Shared/Common/NoRecord';
import usePagination from '../../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import CustomPagination from '../../../../Shared/JsxPagination';
import { InputChangeEvent } from '../../../../Shared/Type';
import { reactSelectSMStyle, styles } from '../../../../Utils/Common';
import { SortingTypeI } from '../../../../Utils/consts';
import Row from './Row';
import { TBL_HEADERS } from './tableheaders';

type SearchQueryType = {
  testName: string;
  testType: string;
  labId: number;
  testMethod: string;
  testCode: string;
  tmitCode: string;
  instrumentName: string;
  orderCode: string;
};

const initialSearchQuery: SearchQueryType = {
  testName: '',
  testType: '',
  labId: 0,
  testMethod: '',
  testCode: '',
  tmitCode: '',
  instrumentName: '',
  orderCode: '',
};

const queryDisplayTagNames: Record<string, string> = {
  testName: 'Test Name',
  testType: 'Test Type',
  labId: 'Performing Lab',
  testMethod: 'Test Method',
  testCode: 'Test Code',
  tmitCode: 'Tmit Code',
  instrumentName: 'Instrument Name',
  orderCode: 'Order Code',
};

const sortById = {
  clickedIconData: 'testId',
  sortingOrder: 'desc',
};

export type LookupOption = {
  label: string;
  value: string;
};

const Index = () => {
  const { t } = useLang();

  const isMobile = useIsMobile();

  const [rows, setRows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialRender, setinitialRender] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [initialRender2, setinitialRender2] = useState(false);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);
  const [resultMethodNameLookups, setResultMethodNameLookups] = useState<
    LookupOption[]
  >([]);
  const [searchQuery, setSearchQuery] =
    useState<SearchQueryType>(initialSearchQuery);
  const [labRef, setLabRef] = useState<any>([]);
  const searchRef = useRef<any>(null);

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
    setCurPage,
    setTotal,
  } = usePagination();

  const getAllTestsSetup = async (
    reset: boolean = false,
    loading: boolean = true
  ) => {
    try {
      setLoading(loading);
      setIsAddButtonDisabled(true);
      const trimmedSearchRequest = Object.fromEntries(
        Object.entries(searchQuery).map(([key, value]) => [
          key,
          typeof value === 'string' ? value.trim() : value,
        ])
      );
      const queryModel = {
        pageSize: pageSize,
        pageNumber: curPage,
        sortDirection: sort?.sortingOrder,
        sortColumn: sort?.clickedIconData,
        queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      };

      const response = await getAllTestSetup(queryModel);
      if (response?.data?.result) {
        setRows(response.data.result);
        setTotal(response?.data?.totalRecord);
      }
    } catch (error) {
      console.error(
        t('An error occurred while fetching Blood Tests setup:'),
        error
      );
    } finally {
      setLoading(false);
      setIsAddButtonDisabled(false);
    }
  };

  //LookUps
  const TestTypesLookup = [
    { label: t('Individual'), value: 'Individual' },
    { label: t('Panel'), value: 'Panel' },
  ];

  const ResultMethodLookup = [
    { label: t('Manual'), value: 'Manual' },
    { label: t('Interface'), value: 'Interface' },
    { label: t('Calculation'), value: 'Calculation' },
    { label: t('External Integration'), value: 'External Integration' },
  ];

  const getInstrumentSearchLookup = async () => {
    await getTestMethodDataLookup()
      .then((res: AxiosResponse) => {
        const updatedData: LookupOption[] = [
          ...(res?.data ?? []),
          { label: 'Manual', value: 'Manual' },
        ];
        setResultMethodNameLookups(updatedData);
      })
      .catch((err: string) => {
        console.error(err);
      });
  };

  const ReferenceLabLookup = () => {
    RequisitionType.GetReferenceLabLookup()
      .then((res: AxiosResponse) => {
        setLabRef(res?.data);
      })
      .catch((err: string) => {
        console.error(err);
      });
  };

  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData(prev => !prev);
  };

  const handleReset = () => {
    setSearchQuery(initialSearchQuery);
    setIsAddButtonDisabled(false);
    getAllTestsSetup(true);
    setSorting(sortById);
  };

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const fetchData = useCallback(async () => {
    try {
      await Promise.all([getAllTestsSetup(), ReferenceLabLookup()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

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

  const handleTagRemoval = (clickedTag: string) => {
    setSearchQuery(searchRequest => {
      return {
        ...searchRequest,
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
    if (searchedTags.length === 0 && initialRender) {
      handleReset();
    } else {
      setinitialRender(true);
    }
  }, [searchedTags.length]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (initialRender2) {
      getAllTestsSetup();
    } else {
      setinitialRender2(true);
    }
  }, [sort, pageSize, curPage, triggerSearchData]);

  useEffect(() => {
    getInstrumentSearchLookup();
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag => (
          <div
            className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
            onClick={() => handleTagRemoval(tag)}
            key={tag + Math.random()}
          >
            <span className="fw-bold">{t(queryDisplayTagNames[tag])}</span>
            <i className="bi bi-x"></i>
          </div>
        ))}
      </div>
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions mt-2">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="mr-3 font-weight-bold">{t('Records')}</span>
            <select
              id={`BloodCompendiumDataTestSetupRecords`}
              className="form-select w-125px h-33px rounded py-2"
              data-kt-select2="true"
              data-placeholder={t('Select option')}
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
          <div className="d-flex gap-2 justify-content-center justify-content-sm-start">
            <div>
              <button
                id={`BloodCompendiumDataTestSetupAddNew`}
                disabled={isAddButtonDisabled}
                onClick={() => {
                  if (!isAddButtonDisabled) {
                    setRows((prevRows: any) => [
                      {
                        rowStatus: true,
                        ...initialSearchQuery,
                        testConfigId: 0,
                        testId: 0,
                        instrumentMasterId: '',
                      },
                      ...prevRows,
                    ]);
                    setIsAddButtonDisabled(true);
                  }
                }}
                className="btn btn-primary btn-sm text-capitalize fw-400"
              >
                <i className="bi bi-plus-lg"></i>
                {t('Add New')}
              </button>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 ">
          <button
            id={`BloodCompendiumDataTestSetupSearch`}
            onClick={() => handleSearch()}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            {t('Search')}
          </button>
          <button
            onClick={handleReset}
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`BloodCompendiumDataTestSetupReset`}
          >
            <span>
              <span>{t('Reset')}</span>
            </span>
          </button>
        </div>
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile ?  {} :
                
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
              component={Paper}
              className="shadow-none MuiTable-root"
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
                        id={`BloodCompendiumDataTestSetupSearchTestName`}
                        type="text"
                        name="testName"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.testName}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`BloodCompendiumDataTestSetupSearchTestType`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={TestTypesLookup}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            testType: event.value,
                          });
                        }}
                        value={TestTypesLookup.filter(function (option: any) {
                          return option.value === searchQuery?.testType;
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`BloodCompendiumDataTestSetupSearchPerformingLab`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={labRef}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            labId: event.value,
                          });
                        }}
                        value={labRef.filter(function (option: any) {
                          return option.value === searchQuery?.labId;
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`BloodCompendiumDataTestSetupSearchTestMethodName`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={resultMethodNameLookups}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            testMethod: event.label,
                          });
                        }}
                        value={resultMethodNameLookups.filter(function (
                          option: any
                        ) {
                          return option.label === searchQuery?.testMethod;
                        })}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodCompendiumDataTestSetupSearchTestCode`}
                        type="text"
                        name="testCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.testCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodCompendiumDataTestSetupSearchOrderCode`}
                        type="text"
                        name="orderCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.orderCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodCompendiumDataTestSetupSearchTMItCode`}
                        type="text"
                        name="tmitCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.tmitCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell className="w-10px"></TableCell>
                    {TBL_HEADERS.map(({ name, variable }) => (
                      <TableCell
                        className={`${
                          name === 'Actions' ? 'w-50px' : ''
                        } min-w-50px`}
                        key={name + Math.random()}
                      >
                        <div
                          onClick={() => handleSort(variable)}
                          className={`d-flex justify-content-between cursor-pointer`}
                          ref={searchRef}
                        >
                          <div style={{ width: 'max-content' }}>{t(name)}</div>

                          {variable !== '' ? (
                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === variable
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === variable
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={9} className="padding-0">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows?.map((item: any, index: number) => {
                      return (
                        <Row
                          row={item}
                          rows={rows}
                          index={index}
                          setRows={setRows}
                          key={item.testId}
                          lookups={{
                            labRef,
                            ResultMethodLookup,
                            TestTypesLookup,
                            resultMethodNameLookups,
                          }}
                          setSearchQuery={setSearchQuery}
                          getAllTestsSetup={getAllTestsSetup}
                          initialSearchQuery={initialSearchQuery}
                          queryDisplayTagNames={queryDisplayTagNames}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                        />
                      );
                    })
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
