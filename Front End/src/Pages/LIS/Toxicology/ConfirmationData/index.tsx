import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import Select from 'react-select';
import RequisitionType from '../../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../../Shared/Common/Loader';
import NoRecord from '../../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../../Shared/Common/Permissions/PermissionComponent';
import { useDataContext } from '../../../../Shared/DataContext';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import { InputChangeEvent } from '../../../../Shared/Type';
import usePagination from '../../../../Shared/hooks/usePagination';
import { reactSelectSMStyle, styles } from '../../../../Utils/Common';
import { SortingTypeI, sortById } from '../../../../Utils/consts';
import Row from './Row';
import useLang from 'Shared/hooks/useLanguage';
import useIsMobile from 'Shared/hooks/useIsMobile';

export interface SearchTypeI {
  ID: number;
  // DrugClass: string;
  Analyte: string;
  Cutoff: string;
  Linearity?: number;
  Unit: string;
  SpecimenTypeId: number;
  TestCode: string;
  PerformingLabId: number;
  TestTypeId: number;
}

export default function CollapsibleTable() {
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
  } = useDataContext();

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

  const FindPanelTypeID = (PanelName: string) => {
    const panelType = DropDowns?.PanelTypeLookup?.find(
      (option: any) => option.label === PanelName
    );
    return panelType?.value || null;
  };

  const initialSearchQuery = {
    ID: 0,
    // DrugClass: '',
    Analyte: '',
    Cutoff: '',
    Linearity: 0,
    Unit: '',
    SpecimenTypeId: 0,
    TestCode: '',
    PerformingLabId: 0,
    TestTypeId: FindPanelTypeID('Confirmation'),
    TestTypeName: 'Confirmation',
    DetectionWindow: '',
    ShadowBox: '',
    StabilityDay: '',
  };

  const queryDisplayTagNames: Record<string, string> = {
    ID: 'ID',
    // DrugClass: 'Drug Class',
    Analyte: 'Analyte',
    Cutoff: 'Cutoff',
    Linearity: 'Linearity',
    Unit: 'Unit',
    SpecimenTypeId: 'Specimen Type',
    TestCode: 'Test Code',
    PerformingLabId: 'Performing Lab',
    TestTypeId: 'Test Type',
    DetectionWindow: 'Detection Window',
    ShadowBox: 'Shadow Box',
    StabilityDay: 'Stability Days',
  };

  interface confirmationDataTypeI extends SearchTypeI {
    DetectionWindow?: string;
  }

  const [searchQuery, setSearchQuery] = useState<any>(initialSearchQuery);
  const [confirmationData, setConfirmationData] = useState<any[]>([]);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    if (e.target.name === 'Linearity') {
      setSearchQuery({ ...searchQuery, [e.target.name]: +e.target.value });
    } else {
      setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
    }
  };

  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  useEffect(() => {
    if (isInitialRender) {
      LoadConfirmationTab(false);
    } else {
      setIsInitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const handleChange = (name: string, value: any, id: number) => {
    setConfirmationData((curr: any) =>
      curr.map((x: any) =>
        x.ID === id
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const LoadConfirmationTab = async (reset: boolean) => {
    setLoading(true);
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    await RequisitionType.toxCompendiumOtherThanPanelMapping({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? initialSearchQuery : trimmedSearchRequest,
      sortColumn: sort?.clickedIconData,
      sortDirection: sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        if (res.status === 200) {
          setTotal(res?.data?.totalRecord);
          setConfirmationData(res?.data.result);
        }
      })
      .catch((err: any) => {
        console.trace(err, 'err');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const resetSearch = () => {
    setSearchQuery(initialSearchQuery);
    LoadConfirmationTab(true);
    setSorting(sortById);
  };

  useEffect(() => {
    LoadConfirmationTab(false);
  }, [sort]);

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
    return () => setIsAddButtonDisabled(false);
  }, []);

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map((tag: any) =>
          tag === 'TestTypeId' || tag === 'TestTypeName' ? null : (
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
      <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
        <div className="d-flex gap-2 responsive-flexed-actions">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`compendiumDataConfirmationData`}
              className="form-select w-125px  h-33px rounded py-2"
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
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Compendium Data"
              permissionIdentifier="AddNew"
            >
              <button
                id={`compendiumDataConfirmationDataAddNew`}
                onClick={e => {
                  e.preventDefault();
                  if (!isAddButtonDisabled) {
                    setConfirmationData((prevRows: any) => [
                      { rowStatus: true, ...initialSearchQuery },
                      ...prevRows,
                    ]);
                    setIsAddButtonDisabled(true);
                  }
                }}
                color="success"
                className="btn btn-primary btn-sm btn-primary--icon px-7"
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
              id={`compendiumDataConfirmationDataSearch`}
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
              onClick={() => resetSearch()}
              type="button"
              className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
              id={`compendiumDataConfirmationDataReset`}
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
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell></TableCell>
                    {/* <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataDrugClassSearch`}
                        type="text"
                        name="DrugClass"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.DrugClass}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell> */}
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataAnalyteSearch`}
                        type="text"
                        name="Analyte"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Analyte}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataCutOffSearch`}
                        name="Cutoff"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Cutoff}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataLinearitySearch`}
                        type="number"
                        name="Linearity"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Linearity || ''}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataUnitSearch`}
                        type="text"
                        name="Unit"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Unit}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataConfirmationDataSpecimenTypeSearch`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={DropDowns?.SpecimenTypeLookup}
                        placeholder={'Select...'}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            SpecimenTypeId: event.value,
                          });
                        }}
                        value={DropDowns?.SpecimenTypeLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchQuery?.SpecimenTypeId;
                        })}
                        onKeyDown={handleKeyPress}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataTestCodeSearch`}
                        type="text"
                        name="TestCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.TestCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataConfirmationDataPerformingLabSearch`}
                        menuPortalTarget={document.body}
                        theme={theme => styles(theme)}
                        options={DropDowns?.ReferenceLabLookup}
                        placeholder={'Select...'}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            PerformingLabId: event.value,
                          });
                        }}
                        value={DropDowns?.ReferenceLabLookup.filter(function (
                          option: any
                        ) {
                          return option.value === searchQuery?.PerformingLabId;
                        })}
                        onKeyDown={handleKeyPress}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataDetectionWindowSearch`}
                        type="text"
                        name="DetectionWindow"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.DetectionWindow}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataShadowBoxSearch`}
                        type="text"
                        name="ShadowBox"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery?.ShadowBox || ''}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataConfirmationDataStabilityDaySearch`}
                        type="text"
                        name="StabilityDay"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery?.StabilityDay || ''}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="min-w-50px">{t('Actions')}</TableCell>
                    {/* <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => {
                          handleSort('DrugClass');
                        }}
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
                              sort.clickedIconData === 'DrugClass'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'DrugClass'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell> */}
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort('Analyte')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Analyte')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'Analyte'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'Analyte'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('Cutoff')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Cutoff')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'Cutoff'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'Cutoff'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort('Linearity')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Linearity')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'Linearity'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'Linearity'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort('Unit')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Unit')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'Unit'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'Unit'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-200px w-200px"
                    >
                      <div
                        onClick={() => handleSort('specimenTypeID')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Specimen Type')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'specimenTypeID'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'specimenTypeID'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('testCode')}
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
                              sort.clickedIconData === 'testCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'testCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('performingLabId')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Performing Lab')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'performingLabId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'performingLabId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('detectionWindow')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Detection Window')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'detectionWindow'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'detectionWindow'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('detectionWindow')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Shadow Box')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'shadowBox'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'shadowBox'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="min-w-150px w-150px"
                    >
                      <div
                        onClick={() => handleSort('detectionWindow')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Stability Days')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'stabilityDays'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'stabilityDays'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
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
                  ) : confirmationData.length ? (
                    confirmationData.map((item: any, index: any) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={confirmationData}
                          setRows={setConfirmationData}
                          dropDownValues={DropDowns}
                          handleChange={handleChange}
                          loadGridData={LoadConfirmationTab}
                          request={request1}
                          setRequest={setRequest1}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
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
      <div className="d-flex flex-wrap gap-4 align-items-center justify-content-between mt-4">
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
