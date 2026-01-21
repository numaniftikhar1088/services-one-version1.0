import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Select from "react-select";
import useLang from 'Shared/hooks/useLanguage';
import CustomPagination from 'Shared/JsxPagination';
import { reactSelectSMStyle, styles } from 'Utils/Common';
import SpecimenTypeAssigmentService from '../../../../../Services/Compendium/SpecimenTypeAssigmentService';
import ControlReportingRuleService from '../../../../../Services/InfectiousDisease/ControlReportingRulesService';
import { Loader } from '../../../../../Shared/Common/Loader';
import NoRecord from '../../../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../../../Shared/Common/Permissions/PermissionComponent';
import usePagination from '../../../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../../../Shared/Icons';
import { StringRecord } from '../../../../../Shared/Type';
import { sortingObject } from '../../../../../Utils/consts';
import Row, { ControlReportingRulesRow } from './Row';
import useIsMobile from 'Shared/hooks/useIsMobile';

type InputChangeEvent = HTMLInputElement | HTMLSelectElement;

const defaultSearchQuery = {
  qcControlName: '',
  qcControlType: '',
  fail: '',
  pass: '',
  undeterminedResult: '',
  cqConf: 0,
  ampStatus: '',
  ampScore: 0,
  controlCode: '',
}

export const ampStatusDropdown = [
  {
    label: "Amp",
    value: "Amp",
  },
  {
    label: "No Amp",
    value: "No Amp",
  },
];

const queryDisplayTagNames: StringRecord = {
  qcControlName: 'Control Name',
  qcControlType: 'Control Type',
  fail: 'Fail',
  pass: 'Pass',
  ampStatus: 'Amp Status',
  cqConf: 'CqConf',
  undeterminedResult: 'Undetermined Result',
  controlCode: 'Control Code',
};

export default function ControlReportingRules() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
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

  useEffect(() => {
    if (initialRender2) {
      loadGridData(true, false);
    } else {
      setinitialRender2(true);
    }
  }, [curPage, pageSize, triggerSearchData]);

  const searchRef = useRef<any>(null);

  const [loading, setLoading] = useState(false);
  const [panels, setPanels] = useState<any[]>([]);
  const [initialRender, setinitialRender] = useState(false);
  const [initialRender2, setinitialRender2] = useState(false);
  const [searchRequest, setSearchRequest] = useState(defaultSearchQuery);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [rows, setRows] = useState<ControlReportingRulesRow[]>(() => []);
  const [sort, setSorting] = useState<any>({
    sortingOrder: '',
    clickedIconData: '',
  });

  let initialCompendiumReportingRule = {
    qcControlName: '',
    qcControlType: '',
    fail: '',
    pass: '',
    ampStatus: '',
    cqConf: 0,
    ampScore: 0,
    undeterminedResult: '',
    controlCode: '',
  };

  const [compendiumReportingRules, setCompendiumReportingRules] = useState(
    initialCompendiumReportingRule
  );

  const handleChange = (name: string, value: string, id: number) => {
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
            ...x,
            [name]: value,
          }
          : x
      )
    );
  };

  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    setSearchRequest(defaultSearchQuery);
    setSorting(sortingObject);
    loadGridData(true, true, sortingObject);
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
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    ControlReportingRuleService.getControlReportingRules({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? defaultSearchQuery : trimmedSearchRequest,
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
    if (initialRender) {
      loadGridData(true, false);
    } else {
      setinitialRender(true);
    }
  }, [sort]);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };

  const getPanelsData = async () => {
    try {
      const res = await SpecimenTypeAssigmentService.PanelSetupLookup(4);
      setPanels(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPanelsData();
  }, []);

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest(prevSearchRequest => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (defaultSearchQuery as any)[clickedTag],
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
      <div className="d-flex gap-4 flex-wrap mb-1">
        {searchedTags.map(tag => (
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
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`IDCompendiumDataControlReportingRuleRecords`}
              className="form-select w-sm-125px w-90px h-33px rounded py-2"
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
          <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
            <div className="mt-0">
              <PermissionComponent
                moduleName="ID LIS"
                pageName="Compendium Data"
                permissionIdentifier="AddNew"
              >
                <Button
                  id={`IDCompendiumDataControlReportingRuleAddRow`}
                  onClick={() => {
                    if (!isAddButtonDisabled) {
                      setRows((prevRows: any) => [
                        {
                          ...defaultSearchQuery,
                          rowStatus: true,
                        },
                        ...prevRows,
                      ]);
                      setIsAddButtonDisabled(true);
                    }
                  }}
                  variant="contained"
                  color="success"
                  className="btn btn-primary btn-sm text-capitalize fw-400"
                  disabled={loading}
                  sx={{
                    '&.Mui-disabled': {
                      opacity: '0.65',
                      backgroundColor: '#69A54B',
                      color: 'white',
                    },
                  }}
                >
                  <i className="bi bi-plus-lg"></i>
                  {t('Add New')}
                </Button>
              </PermissionComponent>
            </div>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2 gap-lg-3">
          <button
            id={`IDCompendiumDataControlReportingRuleSearch`}
            onClick={() => {
              setCurPage(1);
              setTriggerSearchData(prev => !prev);
            }}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
          >
            {t('Search')}
          </button>
          <button
            onClick={resetSearch}
            type="button"
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`IDCompendiumDataControlReportingRuleReset`}
          >
            <span>
              <span>{t('Reset')}</span>
            </span>
          </button>
        </div>
      </div>
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                isMobile ? {}:
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
                    <TableCell></TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleQcControlName`}
                        type="text"
                        name="qcControlName"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.qcControlName}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleControlCode`}
                        type="text"
                        name="controlCode"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.controlCode}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleQcControlType`}
                        type="text"
                        name="qcControlType"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.qcControlType}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleFail`}
                        type="text"
                        name="fail"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.fail}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRulePass`}
                        type="text"
                        name="pass"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.pass}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleCqConf`}
                        type="number"
                        name="cqConf"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.cqConf || ""}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        inputId="IDCompendiumDataPanelMapingPerformingLab"
                        menuPortalTarget={document.body}
                        className="my-1"
                        theme={(theme) => styles(theme)}
                        placeholder={t("Select...")}
                        options={ampStatusDropdown}
                        styles={reactSelectSMStyle}
                        onChange={(event: any) => {
                          setSearchRequest((prevValue: any) => ({
                            ...prevValue,
                            ampStatus: event?.value,
                          }));
                        }}
                        value={ampStatusDropdown.filter(function (option: any) {
                          return (
                            option.value === searchRequest?.ampStatus
                          );
                        })}
                      />
                    </TableCell>
                     <TableCell>
                      <input
                        id={`IDCompendiumDataControlReportingRuleAmpScore`}
                        name="ampScore"
                        className="form-control bg-white  min-w-100px w-100 rounded-2 fs-8 h-30px"
                        placeholder={t('Search ...')}
                        value={searchRequest.ampScore || ""}
                        onChange={onInputChangeSearch}
                        onKeyDown={handleKeyPress}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                  <TableRow className="h-30px">
                    <TableCell className="w-20px min-w-20px" />
                    <TableCell className="min-w-50px">{t('Actions')}</TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('qcControlName')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Control Name')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'qcControlName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'qcControlName'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('controlCode')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Control Code')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'controlCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'controlCode'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('qcControlType')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Control Type')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'qcControlType'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'qcControlType'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('fail')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Fail')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'fail'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'fail'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('pass')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Pass')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'pass'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'pass'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('cqConf')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('CqConf')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'cqConf'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'cqConf'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('ampStatus')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Amp Status')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'ampStatus'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'ampStatus'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('ampScore')}
                        className="d-flex justify-content-between cursor-pointer"
                        id=""
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>{t('Amp Score')}</div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'ampScore'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'ampScore'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div
                        onClick={() => handleSort('undeterminedResult')}
                        className="d-flex justify-content-between cursor-pointer"
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Undetermined / NA')}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'undeterminedResult'
                              ? 'text-success fs-7'
                              : 'text-gray-700 fs-7'
                              }  p-0 m-0 "`}
                          />
                          <ArrowDown
                            CustomeClass={`${sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'undeterminedResult'
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
                    <TableCell colSpan={8} className="">
                      <Loader />
                    </TableCell>
                  ) : rows.length ? (
                    rows.map((item: any, index) => {
                      return (
                        <Row
                          key={item.id}
                          row={item}
                          index={index}
                          rows={rows}
                          setRows={setRows}
                          loadGridData={loadGridData}
                          setIsAddButtonDisabled={setIsAddButtonDisabled}
                          panels={panels}
                          setCompendiumReportingRules={
                            setCompendiumReportingRules
                          }
                          compendiumReportingRules={compendiumReportingRules}
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
      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
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
}
