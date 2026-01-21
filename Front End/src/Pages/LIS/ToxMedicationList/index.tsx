import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Select from 'react-select';
import { toast } from 'react-toastify';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../Shared/Common/Loader';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { useDataContext } from '../../../Shared/DataContext';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { reactSelectSMStyle, styles } from '../../../Utils/Common';
import BreadCrumbs from '../../../Utils/Common/Breadcrumb';
import { SortingTypeI } from '../../../Utils/consts';
import Row from './Row';
import useLang from 'Shared/hooks/useLanguage';
import useIsMobile from 'Shared/hooks/useIsMobile';
export default function CollapsibleTable() {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const { DropDowns, SpecimenTypeLookup, ConfirmationTestTypeLookup } =
    useDataContext();
  const [testCode, setTestCode] = useState({
    ScreeningLookup: [],
    ConfirmationLookup: [],
  });
  const sortById = {
    clickedIconData: 'Id',
    sortingOrder: 'desc',
  };
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);
  const [request, setRequest] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(true);
  const [referenceLab, setReferenceLab] = useState<any>([]);
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
  const [panelLookupData, setPanelLookupData] = useState<any>([]);

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
    SpecimenTypeLookup();
    ConfirmationTestTypeLookup();
  }, []);
  useEffect(() => {
    loadGridData(true, true);
  }, []);
  const convertArray = (array: any) => {
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
        newState[key] = convertArray(state[key]);
      } else {
        newState[key] = state[key];
      }
    }
    return newState;
  };
  const [panelCode, setPanelCode] = useState<any>([]);

  const PanelCodeLookup = (id: any) => {
    RequisitionType.PanelCodeLookup(id ? id : 0)
      .then((res: AxiosResponse) => {
        const mappedData = res?.data?.result?.map((item: any) => ({
          value: item?.PanelId,
          label: item?.PanelCode,
        }));
        if (!id) {
          setPanelLookupData(mappedData);
        }
        setPanelCode(mappedData);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
  };
  const TestLookup = () => {
    const obj = {
      performingLabId: condition?.performingLab,
      specimenTypeId: condition?.specimenTypeId,
    };
    RequisitionType.TestLookup(obj)
      .then((res: AxiosResponse) => {
        const newTestCode: any = {};
        res.data.result.forEach((item: any) => {
          if (item.PanelType === 'Confirmation') {
            newTestCode.ConfirmationLookup =
              newTestCode.ConfirmationLookup || [];
            newTestCode.ConfirmationLookup.push(item);
          } else if (item.PanelType === 'Screening') {
            newTestCode.ScreeningLookup = newTestCode.ScreeningLookup || [];
            newTestCode.ScreeningLookup.push(item);
          }
        });
        setTestCode((prev: any) => ({
          ...prev,
          ...newTestCode,
        }));
      })
      .catch((err: any) => {
        console.error(err);
      });
  };
  const handleChange = (
    nameValue: string,
    nameLabel: string,
    value: any,
    id: number,
    event: any
  ) => {
    if (nameValue === 'analyteId') {
      PanelCodeLookup(value);
    }
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
              ...x,
              [nameValue]: value,
              [nameLabel]: event.label,
            }
          : x
      )
    );
  };
  const handleChangeTxt = (event: any, id: any) => {
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
              ...x,
              [event.target.name]: event.target.value,
            }
          : x
      )
    );
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  let intialSearchQuery = {
    analyteId: 0,
    metabolite: '',
    medication: '',
    specimenTypeId: 0,
    drugClass: '',
    panelId: 0,
    labId: 0,
  };
  const queryDisplayTagNames: StringRecord = {
    analyteId: 'Analyte',
    metabolite: 'Metabolite',
    medication: 'Medication',
    specimenTypeId: 'Specimen Type',
    drugClass: 'Drug Class',
    panelId: 'Panel Code',
    labId: 'Lab Name',
  };

  let [searchRequest, setSearchRequest] = useState(intialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    setSearchRequest({
      analyteId: 0,
      metabolite: '',
      medication: '',
      specimenTypeId: 0,
      drugClass: '',
      panelId: 0,
      labId: 0,
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
      analyteId: 0,
      metabolite: '',
      medication: '',
      drugClass: '',
      panelId: 0,
      specimenTypeId: 0,
      labId: 0,
    };

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.GetAllToxMedicationList({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.totalRecord);
        setRows(res?.data?.result);
        setIsAddButtonDisabled(false);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Save a Row-------------------///////////////////
  const handleSubmit = (row: any) => {
    if (
      selectedMedications.length &&
      row?.specimenTypeId &&
      row?.analyteId && 
      row?.labId
    ) {
      setRequest(true);
      const queryModel = {
        id: row?.id,
        labId: row.labId,
        analyteId: row?.analyteId,
        analyteName: row?.analyteName,
        specimenTypeId: row?.specimenTypeId,
        specimenTypeName: row?.specimenTypeName,
        medicationList: selectedMedications?.map((item: any) => ({
          medicationCode: item?.MedicationCode || item?.medicationCode,
          medicationName: item?.MedicationName || item?.medicationName,
          medicationId: item?.id,
        })),
        metaboliteId: row?.metaboliteList?.length
          ? row?.metaboliteList[0]?.metaboliteId
          : row?.metaboliteId,
        metabolite: row?.metaboliteList?.length
          ? row?.metaboliteList[0]?.metaboliteName
          : row?.metabolite,
        panelCodeList: row.panelCodeList,
        drugClass: row?.drugClass,
      };
      RequisitionType.SaveMedicationList(queryModel)
        .then((res: AxiosResponse) => {
          if (res?.data.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            loadGridData(true, false);
            setRequest(false);
            setIsAddButtonDisabled(false);
            setSelectedMedications([]);
            setSelectedMetabolite([]);
          } else {
            toast.error(res?.data?.message);
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
      toast.error('Fill the required fields');
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
  const ReferenceLabLookup = () => {
    RequisitionType.ToxicologyReferenceLab()
      .then((res: AxiosResponse) => {
        setReferenceLab(res?.data);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
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
    setSearchedTags(Array?.from(uniqueKeys));
  }, [searchRequest]);
  useEffect(() => {
    if (searchedTags?.length === 0) resetSearch();
  }, [searchedTags?.length]);
  useEffect(() => {
    if (condition?.performingLab !== 0 && condition?.specimenTypeId !== 0) {
      TestLookup();
    }
  }, [condition?.performingLab, condition?.specimenTypeId]);

  useEffect(() => {
    if (id !== 0) {
      TestLookup();
    }
  }, [id !== 0]);
  useEffect(() => {
    PanelCodeLookup(0);
    ReferenceLabLookup();
  }, []);
  function parseJSONToArray(jsonString: any) {
    try {
      const jsonArray = JSON.parse(jsonString);
      return jsonArray;
    } catch (error) {
      console.error('Error parsing JSON:', error);
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
              <div className="card-body py-md-4 py-3">
                <div className="d-flex gap-4 flex-wrap">
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
                <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center gap-2 px-4 mb-2 responsive-flexed-actions">
                  <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
                    <div className="d-flex align-items-center">
                      <span className="fw-400 mr-2">{t('Records')}</span>
                      <select
                        id={`ToxMedicationRecords`}
                        className="form-select w-100px h-33px rounded py-2"
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
                    <div className="d-flex align-items-center">
                      <PermissionComponent
                        moduleName="TOX LIS"
                        pageName="Medication"
                        permissionIdentifier="Add"
                      >
                        <button
                          id={`ToxMedicationAddNew`}
                          onClick={() => {
                            if (!isAddButtonDisabled) {
                              setRows((prevRows: any) => [
                                {
                                  id: 0,
                                  analyteID: 0,
                                  analyteName: '',
                                  medicationList: [],
                                  metaboliteId: 0,
                                  metabolite: '',
                                  rowStatus: true,
                                  medication: '',
                                  drugClass: '',
                                  panelId: 0,
                                  panelCode: '',
                                  panelCodeList: [],
                                  labId: 0,
                                  labName: '',
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
                        id={`ToxMedicationSearach`}
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
                        id={`ToxMedicationReset`}
                      >
                        <span>
                          <span>{t('Reset')}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
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
                              <Select
                                inputId={`ToxMedicationSpecimenType`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={referenceLab}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    labId: event.value,
                                  });
                                }}
                                value={referenceLab.filter(function (
                                  option: any
                                ) {
                                  return option.value === searchRequest?.labId;
                                })}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                inputId={`ToxMedicationSpecimenType`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={DropDowns?.SpecimenTypeLookup}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    specimenTypeId: event.value,
                                  });
                                }}
                                value={DropDowns?.SpecimenTypeLookup.filter(
                                  function (option: any) {
                                    return (
                                      option.value ===
                                      searchRequest?.specimenTypeId
                                    );
                                  }
                                )}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                inputId={`ToxMedicationAssociatedAnalytes`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={DropDowns?.ConfiramtionTestType}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    analyteId: event.value,
                                  });
                                }}
                                value={DropDowns?.ConfiramtionTestType.filter(
                                  function (option: any) {
                                    return (
                                      option.value === searchRequest?.analyteId
                                    );
                                  }
                                )}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              {' '}
                              <input
                                id={`ToxMedicationMetabolote`}
                                type="text"
                                name="metabolite"
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t('Search ...')}
                                value={searchRequest.metabolite}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id={`ToxMedicationMedications`}
                                type="text"
                                name="medication"
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t('Search ...')}
                                value={searchRequest.medication}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <Select
                                inputId={`ToxMedicationPanelCode`}
                                menuPortalTarget={document.body}
                                theme={theme => styles(theme)}
                                options={panelLookupData}
                                styles={reactSelectSMStyle}
                                onChange={(event: any) => {
                                  setSearchRequest({
                                    ...searchRequest,
                                    panelId: event.value,
                                  });
                                }}
                                value={panelLookupData.filter(function (
                                  option: any
                                ) {
                                  return (
                                    option.value === searchRequest?.panelId
                                  );
                                })}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              {' '}
                              <input
                                id={`ToxMedicationDrugClass`}
                                type="text"
                                name="drugClass"
                                className="form-control bg-white rounded-2 fs-8 h-30px"
                                placeholder={t('Search ...')}
                                value={searchRequest.drugClass}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                          </TableRow>

                          <TableRow className="h-30px">
                            <TableCell className="min-w-50px w-50px">
                              {t('Actions')}
                            </TableCell>
                            <TableCell
                              sx={{ width: 'max-content' }}
                              className="min-w-150px w-150px"
                            >
                              <div
                                onClick={() => handleSort('labId')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Lab Name')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'labId'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'labId'
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
                                onClick={() => handleSort('SpecimenTypeName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Specimen Type')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData ===
                                        'SpecimenTypeName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData ===
                                        'SpecimenTypeName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{ width: '150px' }}
                              className="min-w-150px w-150px"
                            >
                              <div
                                onClick={() => handleSort('AnalyteName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Associated Analytes')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'AnalyteName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'AnalyteName'
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
                                //onClick={() => handleSort("metaboliteName")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                // ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Metabolite')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  {/* <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData === "metaboliteName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "metaboliteName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  /> */}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{ width: 'max-content' }}
                              className="min-w-250px w-250px"
                            >
                              <div
                                //onClick={() => handleSort("SpecimenTypeName")}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                // ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Medications')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  {/* <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === "desc" &&
                                      sort.clickedIconData ===
                                        "SpecimenTypeName"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === "asc" &&
                                      sort.clickedIconData === "Medications"
                                        ? "text-success fs-7"
                                        : "text-gray-700 fs-7"
                                    }  p-0 m-0`}
                                  /> */}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              sx={{ width: 'max-content' }}
                              className="min-w-150px w-150px"
                            >
                              <div
                                onClick={() => handleSort('SpecimenTypeName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Panel Code')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData ===
                                        'SpecimenTypeName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData ===
                                        'SpecimenTypeName'
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
                                onClick={() => handleSort('SpecimenTypeName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {' '}
                                  {t('Drug Class')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'drugClass'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'drugClass'
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
                          ) : (
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
                                  convertState={convertState}
                                  testCode={convertState(testCode)}
                                  setId={setId}
                                  setTestCode={setTestCode}
                                  parseJSONToArray={parseJSONToArray}
                                  setSelectedMedications={
                                    setSelectedMedications
                                  }
                                  selectedMedications={selectedMedications}
                                  selectedMetabolite={selectedMetabolite}
                                  setSelectedMetabolite={setSelectedMetabolite}
                                  panelCode={panelCode}
                                  PanelCodeLookup={PanelCodeLookup}
                                  handleChangeTxt={handleChangeTxt}
                                  referenceLab={referenceLab}
                                />
                              );
                            })
                          )}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </div>
                </Box>
                <div className="d-flex flex-wrap gap-4 align-items-center justify-content-sm-between justify-content-center mt-4">
                  <p className="pagination-total-record m-0">
                    {Math.min(pageSize * curPage, total) === 0 ? (
                      <span>Showing 0 to 0 of {total} entries</span>
                    ) : (
                      <span>
                        Showing {pageSize * (curPage - 1) + 1} to{' '}
                        {Math.min(pageSize * curPage, total)} of Total{' '}
                        <span> {total} </span> entries{' '}
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
                </div>{' '}
              </div>
            </div>
          </div>{' '}
        </div>{' '}
      </div>
    </>
  );
}
