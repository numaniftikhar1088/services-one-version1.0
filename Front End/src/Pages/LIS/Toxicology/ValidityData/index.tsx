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
export interface IRows {
  id: number;
  panelId: number;
  PerformingLabId: number;
  performingLabName: string;
  Analyte: string;
  panelCode: string;
  assayName: string;
  organism: string;
  TestCode: string;
  groupName: string;
  antibioticClass: string;
  assayNameId: number;
  reportingRuleId: number;
  groupNameId: number;
  reportingRuleName: string;
  resistance: boolean;
  numberOfDetected: number | null;
  numberOfRepeated: number | null;
  createDate: string;
  rowStatus: boolean | undefined;
}
export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const {
    DropDowns,
    // curPage,
    // setCurPage,
    // total,
    // pageSize,
    // setPageSize,
    searchRef,
    // isAddButtonDisabled,
    // setIsAddButtonDisabled,
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

  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [validityData, setValidityData] = useState<any[]>([]);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const handleKeyPress = (event: any) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };
  const FindPanelTypeID = (PanelName: string) => {
    const panelType = DropDowns?.PanelTypeLookup?.find(
      (option: any) => option.label === PanelName
    );
    return panelType?.value || null;
  };

  const initialSearchQuery = {
    ID: 0,
    Analyte: '',
    DrugClass: '',
    Cutoff: '',
    Linearity: 0,
    Unit: '',
    SpecimenTypeId: 0,
    TestCode: '',
    PerformingLabId: 0,
    TestTypeId: FindPanelTypeID('Validity Testing'),
    TestTypeName: 'Validity Testing',
  };

  const queryDisplayTagNames: Record<string, string> = {
    ID: 'ID',
    Analyte: 'Drug Class',
    Cutoff: 'Reference Range Low (Cutoff)',
    Linearity: 'Reference Range High (Linearity)',
    Unit: 'Unit',
    SpecimenTypeId: 'Specimen Type',
    TestCode: 'Test Code',
    PerformingLabId: 'Performing Lab',
    TestTypeId: 'Test Type',
  };

  const [searchQuery, setSearchQuery] = useState<any>(initialSearchQuery);

  useEffect(() => {
    if (isInitialRender) {
      LoadValidityData(false);
    } else {
      setIsInitialRender(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (isInitialRender2) {
      LoadValidityData(false);
    } else {
      setIsInitialRender2(true);
    }
  }, []);

  useEffect(() => {
    LoadValidityData(false);
  }, [sort]);

  const handleChange = (name: string, value: any, id: number) => {
    setValidityData((curr: any) =>
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

  const LoadValidityData = async (reset: boolean) => {
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
          setValidityData(res?.data.result);
        }
      })
      .catch((err: any) => {
        console.trace(err, 'err');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleTagRemoval = (clickedTag: string) => {
    setSearchQuery((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchQuery as any)[clickedTag],
      };
    });
  };

  const resetSearch = () => {
    setSearchQuery(initialSearchQuery);
    LoadValidityData(true);
    setSorting(sortById);
  };

  useEffect(() => {
    LoadValidityData(false);
  }, [sort]);

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
              id={`compendiumDataValidityData`}
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
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <PermissionComponent
              moduleName="TOX LIS"
              pageName="Compendium Data"
              permissionIdentifier="AddNew"
            >
              <button
                id={`compendiumDataValidityDataAddNew`}
                onClick={e => {
                  e.preventDefault();
                  if (!isAddButtonDisabled) {
                    setValidityData((prevRows: any) => [
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
                {t('Add New')}
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex flex-wrap gap-3 justify-content-center justify-content-sm-between align-items-center">
          <div className="d-flex align-items-center gap-2 gap-lg-3">
            <button
              id={`compendiumDataValidityDataSearch`}
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
              id={`compendiumDataValidityDataReset`}
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
                    <TableCell>
                      <input
                        id={`compendiumDataValidityDataSearchAnalyte`}
                        type="text"
                        name="Analyte"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Analyte}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataValidityDataSearchCutoff`}
                        name="Cutoff"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Cutoff}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataValidityDataSearchLinearity`}
                        type="number"
                        name="Linearity"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Linearity || ''}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataValidityDataSearchUnit`}
                        type="text"
                        name="Unit"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.Unit}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataValidityDataSearchSpecimenType`}
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
                        onKeyDown={e => handleKeyPress(e)}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`compendiumDataValidityDataSearchTestCode`}
                        type="text"
                        name="TestCode"
                        className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                        placeholder={t('Search ...')}
                        value={searchQuery.TestCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId={`compendiumDataValidityDataSearchPerformingLab`}
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
                        onKeyDown={e => handleKeyPress(e)}
                        styles={reactSelectSMStyle}
                      />
                    </TableCell>
                    {/* <TableCell>
                      
                      <Select
                  menuPortalTarget={document.body}

                        theme={(theme) => styles(theme)}
                        options={DropDowns?.GroupLookup}
                        onChange={(event: any) => {
                          setSearchQuery({
                            ...searchQuery,
                            groupName: event.label,
                          });
                        }}
                        value={DropDowns?.GroupLookup.filter(function (
                          option: any
                        ) {
                          return option.label === searchQuery?.groupName;
                        })}
                        onKeyDown={(e) => {
                          handleKeyPress(e, "Validity Testing");
                        }}
                      />
                    </TableCell> */}
                  </TableRow>

                  <TableRow>
                    <TableCell className="min-w-50px">{t('Actions')}</TableCell>
                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="w-200px min-w-200px"
                    >
                      <div
                        onClick={() => handleSort('Analyte')}
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
                      className="w-100px min-w-100px"
                    >
                      <div
                        onClick={() => handleSort('Cutoff')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Reference Range Low')}
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
                      className="w-100px min-w-100px"
                    >
                      <div
                        onClick={() => handleSort('Linearity')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Reference Range High')}
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
                      className="w-100px min-w-100px"
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
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('SpecimenTypeId')}
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
                              sort.clickedIconData === 'SpecimenTypeId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'SpecimenTypeId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell
                      sx={{ width: 'max-content' }}
                      className="w-100px min-w-100px"
                    >
                      <div
                        onClick={() => handleSort('TestCode')}
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
                              sort.clickedIconData === 'TestCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'TestCode'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('PerformingLabId')}
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
                              sort.clickedIconData === 'PerformingLabId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'PerformingLabId'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    {/* <TableCell sx={{ width: "max-content" }}>
                      <div
                        onClick={() => handleSort("groupName")}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: "max-content" }}>Group Name</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === "desc" &&
                              sort.clickedIconData === "groupName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === "asc" &&
                              sort.clickedIconData === "groupName"
                                ? "text-success fs-7"
                                : "text-gray-700 fs-7"
                            }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loading ? (
                    <TableCell colSpan={13}>
                      <Loader />
                    </TableCell>
                  ) : validityData.length ? (
                    validityData.map((item: any, index: any) => {
                      return (
                        <Row
                          row={item}
                          index={index}
                          rows={validityData}
                          setRows={setValidityData}
                          dropDownValues={DropDowns}
                          handleChange={handleChange}
                          loadGridData={LoadValidityData}
                          request={request1}
                          setRequest={setRequest1}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                          queryDisplayTagNames={queryDisplayTagNames}
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
              {t('Showing 0 to 0 of')} {total} {t('entries')}
            </span>
          ) : (
            <span>
              {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}
              {Math.min(pageSize * curPage, total)} {t('of Total')}
              <span> {total} </span> {t('entries')}
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
