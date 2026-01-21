import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import UserManagementService from '../../../Services/UserManagement/UserManagementService';
import { Loader } from '../../../Shared/Common/Loader';
import NoRecord from '../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { useDataContext } from '../../../Shared/DataContext';
import useLang from 'Shared/hooks/useLanguage';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { reactSelectSMStyle, styles } from '../../../Utils/Common';
import BreadCrumbs from '../../../Utils/Common/Breadcrumb';
import { SortingTypeI } from '../../../Utils/consts';
import Row from './Row';
import useIsMobile from 'Shared/hooks/useIsMobile';

export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile()
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const { DropDowns, ConfirmationTestTypeLookup } = useDataContext();
  const [testCode, setTestCode] = useState({
    ScreeningLookup: [],
    ConfirmationLookup: [],
  });
  const sortById = {
    clickedIconData: 'medicationAssignmentId',
    sortingOrder: 'desc',
  };
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);
  const [request, setRequest] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [apiCallBlock, setApiCallBlocks] = useState(false);
  const [condition, setCondition] = useState({
    performingLab: 0,
    specimenTypeId: 0,
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
  const [id, setId] = useState<any>(0);
  const [selectedMedications, setSelectedMedications] = useState<any>([]);
  const [selectedMetabolite, setSelectedMetabolite] = useState<any>([]);
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
    ConfirmationTestTypeLookup();
    getFacilityLookup();
    getRequisitionType();
    getLabLookup();
  }, [apiCallBlock]);
  useEffect(() => {
    loadGridData(true, true);
  }, []);
  const [facility, setFacility] = useState<any>([]);
  const [requisition, setRequisition] = useState<any>([]);
  const [lab, setLab] = useState<any>([]);
  const getFacilityLookup = async () => {
    let response: any;
    try {
      response = await UserManagementService.GetFacilitiesLookup();
      setFacility(response.data);
    } catch (error) {
      return error;
    }
  };
  const getRequisitionType = async () => {
    let response: any;
    try {
      response = await UserManagementService.GetRequisitionTypeLookup();
      const mappedData = response.data.data.map((item: any) => ({
        value: item.reqTypeId,
        label: item.requisitionTypeName,
      }));
      setRequisition(mappedData);
    } catch (error) {
      return error;
    }
  };
  const getLabLookup = async () => {
    let response: any;
    try {
      response = await UserManagementService.getLablookup();
      setLab(response?.data);
    } catch (error) {
      return error;
    }
  };
  const handleChange = (
    nameValue: string,
    nameLabel: string,
    value: any,
    id: number,
    event: any
  ) => {
    setRows(curr =>
      curr.map(x =>
        x.medicationAssignmentId === id
          ? {
              ...x,
              [nameValue]: value,
              [nameLabel]: event.label,
            }
          : x
      )
    );
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  let intialSearchQuery = {
    medicationAssignmentId: 0,
    medicationListId: 0,
    medicationCode: '',
    medicationName: '',
    facilityId: 0,
    facilityName: '',
    labId: 0,
    lab: '',
    reqTypeId: 0,
    reqType: '',
  };
  const queryDisplayTagNames: StringRecord = {
    medicationAssignmentId: 'Medication Assigned',
    medicationListId: 'Medication Assigned',
    medicationCode: 'Medication Name',
    medicationName: 'Medication Name',
    facilityId: 'Facility Name',
    facilityName: 'Facility Name',
    labId: 'Lab',
    lab: 'Lab',
    reqTypeId: 'Requisition Type',
    reqType: 'Requisition Type',
  };

  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest({
      medicationAssignmentId: 0,
      medicationListId: 0,
      medicationCode: '',
      medicationName: '',
      facilityId: 0,
      facilityName: '',
      labId: 0,
      lab: '',
      reqTypeId: 0,
      reqType: '',
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
      medicationAssignmentId: 0,
      medicationListId: 0,
      medicationCode: '',
      medicationName: '',
      facilityId: 0,
      facilityName: '',
      labId: 0,
      lab: '',
      reqTypeId: 0,
      reqType: '',
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.GetAllToxMedicationAssignment({
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
        setApiCallBlocks(true);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };

  ////////////Delete Row//////////////////////
  const DeleteRow = async (id: any) => {
    await RequisitionType.DeleteMedicationAssignmentById(id)
      .then((res: AxiosResponse) => {
        loadGridData(true, false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
      });
  };
  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = async (row: any) => {
    if (row.medicationListId && row.labId && row.reqTypeId) {
      setRequest(true);
      const queryModel = {
        medicationAssignmentId: row.medicationAssignmentId,
        medicationListId: row.medicationListId,
        facilityId: row.facilityId,
        labId: row.labId,
        reqTypeId: row.reqTypeId,
        medicationCode: row.medicationCode,
      };
      await RequisitionType.SaveMedicationAssignment(queryModel)
        .then((res: AxiosResponse) => {
          if (res?.data.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            loadGridData(true, false);
            setRequest(false);
            setIsAddButtonDisabled(false);
            setSelectedMedications([]);
            setSelectedMetabolite([]);
          } else {
            toast.error(t(res?.data?.message));
            setRequest(false);
          }
        })
        .catch((err: any) => {
          console.trace(err);
        })
        .finally(() => {
          setRequest(false);
          setIsAddButtonDisabled(false);
        });
    } else {
      toast.error(t('Fill the required fields'));
    }
  };
  // *********** All Dropdown Function END ***********
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
  function parseJSONToArray(jsonString: any) {
    try {
      const jsonArray = JSON.parse(jsonString);
      return jsonArray;
    } catch (error) {
      console.error(t('Error parsing JSON:'), error);
      return [];
    }
  }
  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid py-5">
            <div className="mb-5">
              <BreadCrumbs />
            </div>
            <div className="card shadow-sm mb-3 rounded">
              <div className="card-body py-2">
                <div className="d-flex gap-4 flex-wrap mb-2">
                  {searchedTags.map(tag => (
                    <div
                      className="d-flex align-items-center cursor-pointer gap-1 p-2 rounded bg-light"
                      onClick={() => handleTagRemoval(tag)}
                    >
                      <span className="fw-bold">
                        {t(queryDisplayTagNames[tag])}
                      </span>
                      <i className="bi bi-x"></i>
                    </div>
                  ))}
                </div>
                <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mb-2 col-12 responsive-flexed-actions">
                  <div className="d-flex gap-2 responsive-flexed-actions">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-3">{t('Records')}</span>
                      <select
                        id={`MedicationAssignmentRecords`}
                        className="form-select w-125px rounded fs-8"
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
                    <div className="d-flex align-items-center justify-content-center gap-2">
                      <PermissionComponent
                        moduleName="Setup"
                        pageName="Medication Assignment"
                        permissionIdentifier="Add"
                      >
                        <button
                          id={`MedicationAssignmentAddNew`}
                          onClick={() => {
                            if (!isAddButtonDisabled) {
                              setRows((prevRows: any) => [
                                {
                                  medicationAssignmentId: 0,
                                  medicationListId: 0,
                                  medicationCode: '',
                                  medicationName: '',
                                  facilityId: 0,
                                  facilityName: '',
                                  labId: 0,
                                  lab: '',
                                  reqTypeId: 0,
                                  reqType: '',
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
                    <div className="d-flex align-items-center gap-2">
                      <button
                        id={`MedicationAssignmentSearch`}
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
                        id={`MedicationAssignmentReset`}
                      >
                        <span>
                          <span>{t('Reset')}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
                <Box
                  sx={{
                    height: 'auto',
                    width: '100%',

                    paddingTop: '0',
                  }}
                >
                  <div className="table_bordered overflow-hidden">
                    <TableContainer
                      sx={
                        
                        isMobile ?{

                          overflowY: 'hidden',
                        }:
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
                                id={`MedicationAssignmentSearchMedicationName`}
                                type="text"
                                name="medicationName"
                                className="form-control bg-white h-30px rounded fs-8"
                                placeholder={t('Search...')}
                                value={searchRequest.medicationName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                inputId={`MedicationAssignmentSearchFacility`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={facility}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    facilityId: event.value,
                                  });
                                }}
                                value={facility.filter(function (option: any) {
                                  return (
                                    option.value === searchRequest?.facilityId
                                  );
                                })}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                inputId={`MedicationAssignmentSearchRequisition`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={requisition}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    reqTypeId: event.value,
                                  });
                                }}
                                value={requisition.filter(function (
                                  option: any
                                ) {
                                  return (
                                    option.value === searchRequest?.reqTypeId
                                  );
                                })}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                id={`MedicationAssignmentSearchLab`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={lab}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    labId: event.value,
                                  });
                                }}
                                value={lab.filter(function (option: any) {
                                  return option.value === searchRequest?.labId;
                                })}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow>
                            <TableCell className="min-w-30px w-30px">
                              {t('Actions')}
                            </TableCell>
                            <TableCell sx={{ width: 'max-content' }}>
                              <div
                                onClick={() => handleSort('medicationName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Medications')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'medicationName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'medicationName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell sx={{ width: 'max-content' }}>
                              <div
                                onClick={() => handleSort('facilityName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Facility')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'facilityName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'facilityName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell sx={{ width: 'max-content' }}>
                              <div
                                onClick={() => handleSort('reqType')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Requisition')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'reqType'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'reqType'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell sx={{ width: 'max-content' }}>
                              <div
                                onClick={() => handleSort('lab')}
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
                                      sort.clickedIconData === 'lab'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'lab'
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
                            <TableCell colSpan={5}>
                              <Loader />
                            </TableCell>
                          ) : rows.length ? (
                            rows.map((item: any, index) => {
                              return (
                                <Row
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
                                  setIsAddButtonDisabled={
                                    setIsAddButtonDisabled
                                  }
                                  setCondition={setCondition}
                                  setId={setId}
                                  setTestCode={setTestCode}
                                  parseJSONToArray={parseJSONToArray}
                                  setSelectedMedications={
                                    setSelectedMedications
                                  }
                                  selectedMedications={selectedMedications}
                                  selectedMetabolite={selectedMetabolite}
                                  setSelectedMetabolite={setSelectedMetabolite}
                                  facility={facility}
                                  setFacility={setFacility}
                                  requisition={requisition}
                                  setRequisition={setRequisition}
                                  lab={lab}
                                  setLab={setLab}
                                  DeleteRow={DeleteRow}
                                />
                              );
                            })
                          ) : (
                            <NoRecord colSpan={5} />
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
                <div className="d-flex flex-wrap gap-2 align-items-center mt-4 justify-content-sm-between justify-content-center">
                  <p className="pagination-total-record mb-0">
                    {Math.min(pageSize * curPage, total) === 0 ? (
                      <span>Showing 0 to 0 of {total} entries</span>
                    ) : (
                      <span>
                        Showing {pageSize * (curPage - 1) + 1} to
                        {Math.min(pageSize * curPage, total)} of Total
                        <span> {total} </span> entries
                      </span>
                    )}
                  </p>
                  <ul className="d-flex align-items-center justify-content-end custome-pagination mb-0 p-0">
                    <li
                      className="btn btn-lg p-2 h-33px"
                      onClick={() => showPage(1)}
                    >
                      <i className="fa fa-angle-double-left"></i>
                    </li>
                    <li className="btn btn-lg p-2  h-33px" onClick={prevPage}>
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

                    <li className="btn btn-lg p-2  h-33px" onClick={nextPage}>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
