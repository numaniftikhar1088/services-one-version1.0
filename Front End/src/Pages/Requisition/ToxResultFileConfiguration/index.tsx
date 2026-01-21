import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import FacilityService from '../../../Services/FacilityService/FacilityService';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../Shared/Common/Loader';
import NoRecord from '../../../Shared/Common/NoRecord';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { SortingTypeI } from '../../../Utils/consts';
import Row from './Row';
import useLang from 'Shared/hooks/useLanguage';
export interface IRows {
  labId: number;
  templateName: string;
  rowStatus: boolean | undefined;
  templateId: number;
}

const initialSortingType = {
  clickedIconData: 'labId',
  sortingOrder: 'desc',
};

export default function TestingSetting() {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(initialSortingType);
  //============================================================================================
  //====================================  PAGINATION STATES=====================================
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
  //====================================  PAGINATION STATES END=======================================
  //============================================================================================
  const [request, setRequest] = useState(false);
  const [check, setCheck] = useState(false);
  const [buttonClicked, setButtonClicked] = useState<any>(false);
  const [dropDownValues, setDropDownValues] = useState({
    referenceLab: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any>(() => []);
  const [validation, setValidation] = useState({
    TemplateName: '',
    Lab: '',
  });
  useEffect(() => {
    loadData();

    loadGridData(true, true);
  }, []);
  const [switchValue, setSwitchValue] = useState(true);

  const handleChangeSwitch = (e: any, templateId: any) => {
    setSwitchValue(e.target.checked);
    setCheck(true);
  };
  const [errors, setErrors] = useState(false);

  const Validation = (row: any) => {
    let formIsValid = true;
    if (!row.templateName) {
      setValidation((pre: any) => {
        return {
          ...pre,
          TemplateName: 'Fill the required template Name',
        };
      });
      formIsValid = false;
    }
    if (!row.labId) {
      setValidation((pre: any) => {
        return {
          ...pre,
          Lab: 'Select required Lab',
        };
      });
      formIsValid = false;
    }
    return formIsValid;
  };
  const handleChange = (name: string, value: string, templateId: number) => {
    setErrors(false);
    setCheck(true);
    if (name === 'templateName') {
      setValidation((pre: any) => {
        return {
          ...pre,
          TemplateName: '',
        };
      });
    }
    if (name === 'labId') {
      setValidation((pre: any) => {
        return {
          ...pre,
          Lab: '',
        };
      });
    }

    setRows((curr: any) =>
      curr.map((x: any) =>
        x.templateId === templateId
          ? {
              ...x,
              [name]: value,
            }
          : x
      )
    );
  };

  const initialSearchQuery = {
    labId: 0,
    templateName: '',
    LabName: '',
  };
  const queryDisplayTagNames: StringRecord = {
    labId: 'Lab',
    templateName: 'Template Name',
    LabName: 'Lab Name',
  };

  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    searchRequest = {
      labId: 0,
      templateName: '',
      LabName: '',
    };
    setSearchRequest({
      labId: 0,
      templateName: '',
      LabName: '',
    });
    setSorting(initialSortingType);
    loadGridData(true, true, initialSortingType);
  }
  ////////////-----------------Section For Searching-------------------///////////////////
  const searchQuery = {
    labId: searchRequest.labId,
    ReqTypeId: 3,
    templateName: searchRequest.templateName,
  };
  ////////////-----------------Get Lookup Reference Labs Data-------------------///////////////////
  const loadData = () => {
    RequisitionType.ToxicologyReferenceLab()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            referenceLab: res.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };

  ////////////-----------------Get All Data-------------------///////////////////
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    const nullobj = {
      labId: 0,
      ReqTypeId: 3,
      templateName: '',
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    const obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullobj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    };
    FacilityService.GetTemplateSetting({ ...obj })
      .then((res: AxiosResponse) => {
        setRows(res?.data?.data);
        setLoading(false);
        setTotal(res?.data?.total);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
      });
  };
  const handleSubmit = async (row: any) => {
    if (Validation(row)) {
      if (row.templateId === 0 || row.templateId >= 0) {
        setErrors(false);
      } else {
        setErrors(true);
      }
      const queryModel = {
        templateId: row.templateId,
        labId: row.labId,
        templateName: row.templateName,
        isActive: row.isActive,
        ReqTypeId: 3,
      };
      try {
        setRequest(true);
        const res = await FacilityService.AddTemplateSetting(queryModel);
        setErrors(false);

        if (res?.data.statusCode === 200) {
          toast.success(t(res?.data?.message));
          loadGridData(true, false);
          setRequest(false);
          setValidation((pre: any) => {
            return {
              ...pre,
              TemplateName: '',
              Lab: '',
            };
          });
        }
      } catch (err) {
        console.trace(err);
        setRequest(false);
      }
      setRequest(false);
      setCheck(false);
    }
  };

  const handleAddTemplate = () => {
    if (!buttonClicked) {
      setButtonClicked(true);
      setRows((prevRows: any) => [
        {
          labId: 0,
          templateName: '',
          rowStatus: true,
          templateId: 0,
          isActive: true,
          labName: '',
        },
        ...prevRows,
      ]);
    }
  };

  ////////////-----------------Sorting-------------------///////////////////
  const searchRef = useRef<any>(null);

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

  ////////////-----------------Sorting-------------------///////////////////
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
      <div className="app-content flex-column-fluid p-0">
        <div className="card-body py-2">
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map(tag =>
              tag === 'isArchived' ? null : (
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
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
            <div className="d-flex gap-2 responsive-flexed-actions">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t('Records')}</span>
                <select
                  id={`ToxResultPreConfigurationRecord`}
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
                <button
                  id={`ToxResultPreConfigurationAddNew`}
                  onClick={handleAddTemplate}
                  className="btn btn-primary btn-sm fw-bold mr-3 text-capitalize"
                  disabled={buttonClicked}
                >
                  <i style={{ fontSize: '16px' }} className="fa">
                    &#xf067;
                  </i>
                  {t('Add New Template')}
                </button>
              </div>
            </div>
            <div className="d-flex align-items-center gap-2">
              <button
                id={`ToxResultPreConfigurationSearch`}
                onClick={() => {
                  setCurPage(1);
                  setTriggerSearchData(prev => !prev);
                }}
                className="btn btn-linkedin btn-sm fw-500 py-2 rounded-3"
                aria-controls="Search"
              >
                {t('Search')}
              </button>
              <button
                id={`ToxResultPreConfigurationReset`}
                onClick={resetSearch}
                type="button"
                className="btn btn-secondary btn-sm btn-secondary--icon fw-bold py-2 rounded-3"
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
                  // sx={{
                  //   maxHeight: 800,
                  //   "&::-webkit-scrollbar": {
                  //     width: 7,
                  //   },
                  //   "&::-webkit-scrollbar-track": {
                  //     backgroundColor: "#fff",
                  //   },
                  //   "&:hover": {
                  //     "&::-webkit-scrollbar-thumb": {
                  //       backgroundColor: "var(--kt-gray-400)",
                  //       borderRadius: 2,
                  //     },
                  //   },
                  //   "&::-webkit-scrollbar-thumb": {
                  //     backgroundColor: "var(--kt-gray-400)",
                  //     borderRadius: 2,
                  //   },
                  // }}
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
                        <TableCell className="min-w-50px"></TableCell>
                        <TableCell>
                          <input
                            id={`ToxResultPreConfigurationSearchTemplateName`}
                            type="text"
                            name="templateName"
                            className="form-control bg-white rounded-2 fs-8 h-30px"
                            placeholder={t('Search...')}
                            value={searchRequest.templateName}
                            onChange={onInputChangeSearch}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <select
                            id={`ToxResultPreConfigurationSearchLab`}
                            name="labId"
                            className="form-select bg-white rounded-2 fs-8 h-30px py-2"
                            value={searchRequest.labId}
                            onChange={onInputChangeSearch}
                            //onKeyDown={handleKeyPress}
                          >
                            <option value="">Select an option</option>
                            {dropDownValues.referenceLab.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                      <TableRow className="h-30px">
                        <TableCell className="w-20px min-w-20px"></TableCell>
                        <TableCell className="w-50px min-w-50px text-center">
                          {t('Actions')}
                        </TableCell>
                        <TableCell
                          className="min-w-300px w-300px"
                          sx={{ width: 'max-content' }}
                        >
                          <div
                            onClick={() => handleSort('templateName')}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Template Name')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'templateName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'templateName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="min-w-300px w-300px"
                          sx={{ width: 'max-content' }}
                        >
                          <div
                            onClick={() => handleSort('labName')}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Lab')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'labName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0 "`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'labName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                }  p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell
                          className="min-w-100px w-100px"
                          sx={{ width: 'max-content' }}
                        >
                          <div
                            onClick={() => handleSort('labName')}
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Inactive/Active')}
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={9} className="padding-0">
                          <Loader />
                        </TableCell>
                      ) : !rows.length ? (
                        <NoRecord message={'No data found for this table'} />
                      ) : (
                        rows.map((item: any, index: any) => {
                          return (
                            <Row
                              row={item}
                              index={index}
                              rows={rows}
                              setRows={setRows}
                              dropDownValues={dropDownValues}
                              handleChange={handleChange}
                              handleSubmit={handleSubmit}
                              setErrors={setErrors}
                              errors={errors}
                              request={request}
                              setRequest={setRequest}
                              check={check}
                              setCheck={setCheck}
                              loadGridData={loadGridData}
                              setButtonClicked={setButtonClicked}
                              validation={validation}
                              setValidation={setValidation}
                            />
                          );
                        })
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
          <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
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
                    //====================================  PAGINATION End =====================================
                    //============================================================================================ */}
        </div>
      </div>
    </>
  );
}
