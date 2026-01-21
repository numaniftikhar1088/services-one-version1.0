import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { toast } from 'react-toastify';
import PanelMappingService from '../../../Services/InfectiousDisease/PanelMappingService';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../Shared/Common/Loader';
import NoRecord from '../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { SortingTypeI, sortById } from '../../../Utils/consts';
import Row, { ITableObj } from './Row';
import useLang from 'Shared/hooks/useLanguage';

const blue = {
  200: '#A5D8FF',
  400: '#3399FF',
};
const grey = {
  50: '#f6f8fa',
  100: '#eaeef2',
  200: '#d0d7de',
  300: '#afb8c1',
  400: '#8c959f',
  500: '#6e7781',
  600: '#57606a',
  700: '#424a53',
  800: '#32383f',
  900: '#24292f',
};
interface IReferenceLab {
  referenceLabId: number;
  referenceLabName: string;
}

export interface IRows {
  id: number;
  testName: string;
  testDisplayName: string;
  testCode: string;
  referenceLabId: number;
  referenceLabName: string;
  createDate: string;
  rowStatus: boolean | undefined;
  rowAdd: boolean | undefined;
}
export default function CollapsibleTable() {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
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
  const [request, setRequest] = useState(false);
  const [check, setCheck] = useState(false);
  const [dropDownValues, setDropDownValues] = useState({
    LabList: [],
  });
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState<any[]>(() => []);

  useEffect(() => {
    loadGridData(true, true);
  }, []);

  const [errors, setErrors] = useState(false);
  useEffect(() => {
    loadData4();
    loadGridData(true, true);
  }, []);

  const handleChange = (name: string, value: any, id: number) => {
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

  const handleIsDefault = (event: any, id: any) => {
    setRows(curr =>
      curr.map(x =>
        x.id === id
          ? {
              ...x,
              isDefault: event.target.checked,
            }
          : x
      )
    );
  };
  ////////////-----------------Section For Searching-------------------///////////////////

  let initialSearchQuery = {
    printerName: '',
    labelContent: '',
    modelNumber: '',
    labelSize: '',
    labelName: '',
    labName: '',
  };
  const queryDisplayTagNames: StringRecord = {
    printerName: 'Printer Name',
    labelContent: 'Label Content',
    modelNumber: 'Model Number',
    labelSize: 'Label Size',
    labelName: 'Label Name',
    labName: 'Lab Name',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  function resetSearch() {
    searchRequest = {
      printerName: '',
      labelContent: '',
      modelNumber: '',
      labelSize: '',
      labelName: '',
      labName: '',
    };
    setSearchRequest({
      printerName: '',
      labelContent: '',
      modelNumber: '',
      labelSize: '',
      labelName: '',
      labName: '',
    });
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }

  ////////////-----------------Section For Searching-------------------///////////////////

  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

  const loadData4 = () => {
    PanelMappingService.PerformingLabLookup()
      .then((res: AxiosResponse) => {
        setDropDownValues((preVal: any) => {
          return {
            ...preVal,
            LabList: res?.data,
          };
        });
      })
      .catch((err: any) => {
        console.trace(err);
      });
  };
  ////////////-----------------Get Look Reference Labs Data-------------------///////////////////

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
      printerName: '',
      labelContent: '',
      modelNumber: '',
      labelSize: '',
      labelName: '',
      labName: '',
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    RequisitionType.getPrinterSetup({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);

        setRows(res?.data?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  ////////////-----------------Get All Data-------------------//////////////////

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

  ////////////-----------------Save a Row-------------------///////////////////
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const handleSubmit = (row: ITableObj) => {
    setIsButtonDisabled(true);
    setRequest(true); // Set request in progress
    if (
      row?.printerName !== '' &&
      row?.printerName !== null &&
      row?.labelContent !== '' &&
      row?.labelContent !== null &&
      row?.modelNumber !== '' &&
      row?.modelNumber !== null &&
      row?.labelSize !== '' &&
      row?.labelSize !== null &&
      row?.labelName !== '' &&
      row?.labelName !== null
      // row?.labId !== 0
    ) {
      const queryModel = {
        id: row.id,
        printerName: row.printerName,
        modelNumber: row.modelNumber,
        labelSize: row.labelSize,
        labelName: row.labelName,
        // labId: row.labId,
        isDefault: row.isDefault,
        labelContent: row.labelContent,
      };
      RequisitionType.savePrinterSetup(queryModel)
        .then((res: AxiosResponse) => {
          if (res?.data.httpStatusCode === 200) {
            toast.success(t(res?.data?.message));
            setIsButtonDisabled(false); // Re-enable the button
            loadGridData(true, false);
          }
          if (res?.data.httpStatusCode === 409) {
            setIsButtonDisabled(false);
            toast.info(t('Only One Printer can be Default'));
            return;
          }
        })
        .catch((err: any) => {
          console.trace(err);
        })
        .finally(() => {
          setRequest(false); // Request is no longer in progress
          setIsButtonDisabled(false);
        });
    } else {
      toast.error(t('Please Enter The Required Fields'));
      setIsButtonDisabled(false); // Re-enable the button
      setRequest(false); // Request is no longer in progress
    }
  };
  // *********** All Dropdown Function Show Hide ***********
  const [anchorEl, setAnchorEl] = React.useState({
    dropdown1: null,
    dropdown2: null,
    dropdown3: null,
    dropdown4: null,
  });
  const openDrop =
    Boolean(anchorEl.dropdown1) ||
    Boolean(anchorEl.dropdown2) ||
    Boolean(anchorEl.dropdown3) ||
    Boolean(anchorEl.dropdown4);

  const handleClose1 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  // *********** All Dropdown Function END ***********
  ////////////-----------------Delete a Row-------------------///////////////////
  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace('}', ''), '_blank');
    });
  };
  const deletePrinterSetup = () => {
    RequisitionType?.deletePrinterSetup(valueId)
      .then((res: any) => {
        if (res?.data?.httpStatusCode == 200) {
          loadGridData(true, false);
          toast.success(t('Request Successfully Processed'));
          ModalhandleClose1();
          handleClose1('dropdown3');
        }
      })
      .catch((err: AxiosError) => {});
  };
  ////////////-----------------Delete a Row-------------------///////////////////
  const [valueId, setValueId] = useState<any>(null);

  const handleClickOpen = (id: any) => {
    setShow1(true);
    setValueId(id);
  };
  const ModalhandleClose1 = () => setShow1(false);
  const [show1, setShow1] = useState(false);
  const [isAddButtonDisabled, setIsAddButtonDisabled] = useState(false);
  const [addClickExpandable, setAddClickExpandable] = useState(false);
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      loadGridData(true, false);
    }
  };

  // Handling searchedTags
  const [searchedTags, setSearchedTags] = useState<string[]>([]);

  const handleTagRemoval = (clickedTag: string) => {
    setSearchRequest((prevSearchRequest: any) => {
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
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton className="py-4">
          <Modal.Title className="h5">{t('Delete Record')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('Are you sure you want to delete this record ?')}
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            id={`PrinterSetupDeleteModalCancel`}
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t('Cancel')}
          </button>
          <button
            id={`PrinterSetupDeleteModalConfirm`}
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => deletePrinterSetup()}
          >
            {t('Delete')}
          </button>
        </Modal.Footer>
      </Modal>

      <div className="app-content flex-column-fluid">
        <div className="app-container container-fluid">
          <div className="card">
            <div className="card-body py-2">
              <div className="d-flex gap-4 flex-wrap">
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
              <div className="mb-2 gap-2 d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions">
                <div className="d-flex align-items-center gap-2 responsive-flexed-actions">
                  <div className="d-flex align-items-center">
                    <span className="fw-400 mr-2">{t('Records')}</span>
                    <select
                      id={`PrinterSetupRecords`}
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
                  <div className="d-flex justify-content-center justify-content-sm-start">
                    <PermissionComponent
                      moduleName="Setup"
                      pageName="Printer Setup"
                      permissionIdentifier="AddNewPrinter"
                    >
                      <button
                        id={`PrinterSetupAddNew`}
                        onClick={() => {
                          if (!isAddButtonDisabled) {
                            setRows((prevRows: any) => [
                              {
                                id: 0,
                                printerName: '',
                                modelNumber: '',
                                labelSize: '',
                                labelName: '',
                                labelContent: '',
                                labId: 0,
                                labName: '',
                                rowStatus: true,
                                isDefault: false,
                              },
                              ...prevRows,
                            ]);
                            setIsAddButtonDisabled(true);
                          }
                        }}
                        className="btn btn-primary btn-sm fw-bold mr-3 px-10 text-capitalize"
                      >
                        {t('Add New Printer')}
                      </button>
                    </PermissionComponent>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <button
                    id={`PrinterSetupSearch`}
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
                    id={`PrinterSetupReset`}
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
                      sx={{
                        maxHeight: 800,
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
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-1"
                      >
                        <TableHead>
                          <TableRow className="h-40px">
                            <TableCell></TableCell>
                            <TableCell></TableCell>
                            <TableCell>
                              <input
                                id={`PrinterSetupSearchPrinterName`}
                                type="text"
                                name="printerName"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t('Search ...')}
                                value={searchRequest.printerName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id={`PrinterSetupSearchModalNunmber`}
                                type="text"
                                name="modelNumber"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t('Search ...')}
                                value={searchRequest.modelNumber}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id={`PrinterSetupSearchLabelSize`}
                                type="text"
                                name="labelSize"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t('Search ...')}
                                value={searchRequest.labelSize}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell>
                              <input
                                id={`PrinterSetupSearchLabelName`}
                                type="text"
                                name="labelName"
                                className="form-control bg-white h-30px rounded-2 fs-8 mb-lg-0"
                                placeholder={t('Search ...')}
                                value={searchRequest.labelName}
                                onChange={onInputChangeSearch}
                                onKeyDown={handleKeyPress}
                              />
                            </TableCell>
                            <TableCell></TableCell>
                          </TableRow>

                          <TableRow className="h-30px">
                            <TableCell className="min-w-30px w-30px"></TableCell>
                            <TableCell className="min-w-50px">
                              {t('Actions')}
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('printerName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Printer Name')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'printerName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'printerName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('modelNumber')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Model Number')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'modelNumber'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'modelNumber'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('labelSize')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Label Size')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'labelSize'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'labelSize'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('labelName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Label Name')}
                                </div>

                                <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                                  <ArrowUp
                                    CustomeClass={`${
                                      sort.sortingOrder === 'desc' &&
                                      sort.clickedIconData === 'labelName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0 "`}
                                  />
                                  <ArrowDown
                                    CustomeClass={`${
                                      sort.sortingOrder === 'asc' &&
                                      sort.clickedIconData === 'labelName'
                                        ? 'text-success fs-7'
                                        : 'text-gray-700 fs-7'
                                    }  p-0 m-0`}
                                  />
                                </div>
                              </div>
                            </TableCell>
                            <TableCell
                              className="min-w-150px"
                              sx={{ width: 'max-content' }}
                            >
                              <div
                                onClick={() => handleSort('labelName')}
                                className="d-flex justify-content-between cursor-pointer"
                                id=""
                                ref={searchRef}
                              >
                                <div style={{ width: 'max-content' }}>
                                  {t('Default Printer')}
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
                          ) : rows.length ? (
                            rows?.map((item: any, index) => {
                              return (
                                <Row
                                  row={item}
                                  index={index}
                                  rows={rows}
                                  setRows={setRows}
                                  dropDownValues={dropDownValues}
                                  handleChange={handleChange}
                                  handleSubmit={handleSubmit}
                                  loadGridData={loadGridData}
                                  setErrors={setErrors}
                                  errors={errors}
                                  request={request}
                                  setRequest={setRequest}
                                  check={check}
                                  setCheck={setCheck}
                                  setShow1={setShow1}
                                  handleClickOpen={handleClickOpen}
                                  setIsAddButtonDisabled={
                                    setIsAddButtonDisabled
                                  }
                                  isButtonDisabled={isButtonDisabled}
                                  handleIsDefault={handleIsDefault}
                                  ShowBlob={ShowBlob}
                                />
                              );
                            })
                          ) : (
                            <NoRecord colSpan={7} />
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
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4">
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
                  <li className="btn btn-lg p-2" onClick={() => showPage(1)}>
                    <i className="fa fa-angle-double-left"></i>
                  </li>
                  <li className="btn btn-lg p-2" onClick={prevPage}>
                    <i className="fa fa-angle-left"></i>
                  </li>

                  {pageNumbers.map(page => (
                    <li
                      key={page}
                      className={`px-2 ${
                        page === curPage
                          ? 'font-weight-bold bg-primary text-white'
                          : ''
                      }`}
                      style={{ cursor: 'pointer' }}
                      onClick={() => showPage(page)}
                    >
                      {page}
                    </li>
                  ))}

                  <li className="btn btn-lg p-2" onClick={nextPage}>
                    <i className="fa fa-angle-right"></i>
                  </li>
                  <li
                    className="btn btn-lg p-2"
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
      {/* ==========================================================================================
                    //====================================  PAGINATION END =====================================
                    //============================================================================================ */}
    </>
  );
}
