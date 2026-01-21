import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { Modal, ModalBody } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';

import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { Loader } from '../../../Shared/Common/Loader';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import { LoaderIcon } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { reactSelectSMStyle, styles } from '../../../Utils/Common';
import { SortingTypeI, sortById } from '../../../Utils/consts';
import ToxResultFileUploadGrid from './ToxResultFileUploadGrid';
import useLang from 'Shared/hooks/useLanguage';

export default function CollapsibleTable(props: any) {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortById);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
  const [resultFileUpload, setResultFileUpload] = useState([]);
  useEffect(() => {
    GetFileTypesLookup();
    loadGridData(true, true);
  }, []);
  const initialSearchQuery = {
    fileName: '',
    status: '',
    uploadedBy: '',
    isArchived: false,
    specimenTypeId: 0,
    specimenType: '',
    instrument: '',
    uploadedDate: '',
  };
  const queryDisplayTagNames: StringRecord = {
    fileName: 'File Name',
    status: 'Status',
    uploadedBy: 'Uploaded By',
    specimenTypeId: 'Specimen Type',
    instrument: 'Instrument',
    uploadedDate: 'Uploaded Date',
  };
  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [resultType, setResultType] = useState('');
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };
  const [specimentype, setSpecimenType] = useState<any>([]);
  const [specimenVal, setSpecimanValue] = useState('');
  function resetSearch() {
    setSearchRequest(initialSearchQuery);
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }
  const formatDate = (dateString: string) => {
    if (dateString) {
      const [year, month, day] = dateString.split('-');
      return `${month}-${day}-${year}`;
    } else {
      return dateString;
    }
  };
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    let nullObj = {
      fileName: '',
      uploadedDate: '',
      status: '',
      uploadedBy: '',
      isArchived: false,
      specimenTypeId: 0,
      specimenType: '',
      instrument: '',
    };

    const searchObjtobesend = {
      fileName: searchRequest.fileName,
      status: searchRequest.status,
      uploadedBy: searchRequest.uploadedBy,
      isArchived: false,
      specimenTypeId: searchRequest.specimenTypeId,
      specimenType: searchRequest.specimenType,
      instrument: searchRequest.instrument,
      uploadedDate: formatDate(searchRequest.uploadedDate),
    };
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchObjtobesend).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.getToxResultFileUpload({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullObj : trimmedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        setTotal(res?.data?.total);
        setResultFileUpload(res?.data?.data);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };
  const [selectedBox, setSelectedBox] = useState<any>({
    id: [],
  });
  const ArchiveResultFileUpload = () => {
    RequisitionType.ArchiveResultFileUpload(selectedBox.id)
      .then((res: any) => {
        if (res.status === 200) {
          setSelectedBox((prevState: any) => {
            return {
              ...prevState,
              id: [],
            };
          });
          loadGridData(true, true);
          ModalhandleClose1();
          setShow1(false);
          toast.success(t('Request Succesfully Processed'));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err, 'bulk request failure');
      });
  };
  const [logList, setLogList] = useState([]);
  const GetLogsById = (id: number) => {
    RequisitionType.GetLogsById(id)
      .then((res: AxiosResponse) => {
        setLogList(res?.data?.data);
        setLoading(false);
        setShow2(true);
        handleClose2('dropdown1');
      })
      .catch((err: any) => {
        console.trace(err, 'err');
        setLoading(false);
      });
  };

  const ResultFileUpload = async () => {
    if (images.length > 0) {
      const formData = new FormData();
      formData.append('file', images[0]);
      formData.append('TemplateId', resultType);
      formData.append('SpecimenTypeId', specimenVal);
      try {
        if (resultType !== '') {
          if (!specimenVal) {
            toast.error(t('Select specimen type'));
            return;
          } else {
            setIsSubmitting(true);
            RequisitionType.ToxFileUpload(formData)
              .then((res: AxiosResponse) => {
                setIsSubmitting(true);
                if (res?.data?.statusCode === 200) {
                  toast.success(t(res?.data?.message));
                } else if (res?.data?.statusCode === 400) {
                  toast.error(t(res?.data?.message));
                }
                loadGridData(true, true);
                setIsSubmitting(false);
                setImages([]);
                setInvalidFileFormat(false);
                setSpecimanValue('');
              })
              .catch((err: AxiosError) => {
                console.log(err);
              });
          }
        } else {
          toast.error(t('Please Select File Type'));
          setIsSubmitting(false);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const ShowBlob = (Url: string) => {
    RequisitionType.ShowBlob(Url).then((res: any) => {
      window.open(res?.data?.Data.replace('}', ''), '_blank');
    });
  };
  const [fileTypeList, setFileTypeList] = useState([]);
  const GetFileTypesLookup = () => {
    RequisitionType.GetFileTypesLookup(3)
      .then((res: AxiosResponse) => {
        setFileTypeList(res.data || []);
      })
      .catch((err: AxiosError) => {
        console.error(err);
      });
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

  const handleClick = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };
  const handleClose = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  const [images, setImages] = useState<any>([]);
  const [invalidFileFormat, setInvalidFileFormat] = useState(false);
  const allowedExtensions = ['csv', 'xls', 'xlsx'];
  const handleFileSelect = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();

      if (!allowedExtensions.includes(fileExtension)) {
        setInvalidFileFormat(true);
        setImages([...images, ...e.target.files]);
      } else {
        setInvalidFileFormat(false);
        setImages([...images, ...e.target.files]);
      }
      e.target.value = '';
    }
  };
  const handleImageDeselect = (image: any) => {
    const _images = [...images];
    const index = _images.map(_ => _.name).indexOf(image.name);
    if (index > -1) {
      _images.splice(index, 1);
    }
    setImages([..._images]);
    setInvalidFileFormat(false);
  };
  const handleonChange = (e: any) => {
    setResultType(e);
  };
  const [show1, setShow1] = useState(false);
  const ModalhandleClose1 = () => setShow1(false);
  const handleClickOpen = (ids: any) => {
    if (selectedBox.id.length === 0) {
      toast.error(t('Please select atleast one record'));
    } else {
      setShow1(true);
      handleClose('dropdown1');
    }
  };
  const handleClose2 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  const [show2, setShow2] = useState(false);
  const ModalhandleClose2 = () => setShow2(false);
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
  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData(prev => !prev);
    }
  };
  useEffect(() => {
    loadGridData(true, false);
  }, [sort]);
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

  // useEffect(() => {
  //   resetSearch();
  // }, [searchedTags.length]);

  const GetSpecimenType = () => {
    RequisitionType.GetSpecimentypeforFileUploadTox().then((res: any) => {
      let SpecimenTypeArray: any = [];
      res?.data?.data.map(({ specimenTypeId, specimenType }: any) => {
        let SpecimenTypeDetails: any = {
          value: specimenTypeId,
          label: specimenType,
        };
        SpecimenTypeArray.push(SpecimenTypeDetails);
      });
      setSpecimenType(SpecimenTypeArray);
    });
  };
  useEffect(() => {
    GetSpecimenType();
  }, []);

  const onSpecimenSelect = (e: any) => {
    setSpecimanValue(e.value);
  };

  return (
    <>
      <Modal
        show={show1}
        onHide={ModalhandleClose1}
        backdrop="static"
        keyboard={false}
        className="d-flex align-item-center"
      >
        <Modal.Header closeButton className="py-4 bg-light-primary">
          <Modal.Title className="h5">{t('Archive Record')}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {t('Are you sure you want to archive this record ?')}
        </Modal.Body>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t('Cancel')}
          </button>
          <button
            type="button"
            className="btn btn-sm btn-danger"
            onClick={() => ArchiveResultFileUpload()}
          >
            {t('Archive')}
          </button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={show2}
        onHide={ModalhandleClose2}
        backdrop="static"
        keyboard={false}
        className="modal-xl"
        tabindex="-2"
      >
        <Modal.Title>
          <div className="card card-header bg-light-secondary">
            <h5 className="m-0">{t('Log File Detail')}</h5>
          </div>
        </Modal.Title>
        <ModalBody>
          <div
            className="col-xl-12 col-lg-12 col-md-12 col-sm-12 rounded"
            style={{ border: '2px solid #7239ea' }}
          >
            <div className="card mb-4 border">
              <div className="card-header bg-light-info d-flex justify-content-between align-items-center">
                <h5 className="m-0 text-info">{t('Log Detail')}</h5>
              </div>
              <div className="card-body py-md-4 py-3">
                <div className="table_bordered overflow-hidden">
                  <TableContainer
                    sx={{
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
                    className="shadow-none"
                  >
                    <Table
                      stickyHeader
                      aria-label="sticky table collapsible"
                      className="table table-cutome-expend table-bordered table-head-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                    >
                      <TableHead className="h-40px">
                        <TableRow>
                          <TableCell className="min-w-150px w-150px">
                            {t('Row Number')}
                          </TableCell>
                          <TableCell className="min-w-150px w-150px">
                            {t('Record Id')}
                          </TableCell>
                          <TableCell className="min-w-150px w-150px">
                            {t('Accession')}
                          </TableCell>
                          <TableCell className="min-w-150px w-150px">
                            {t('Patient Name')}
                          </TableCell>
                          <TableCell className="min-w-200px w-200px">
                            {t('Error Message')}
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {loading ? (
                          <TableCell colSpan={8} className="padding-0">
                            <Loader />
                          </TableCell>
                        ) : (
                          logList?.map((row: any) => (
                            <TableRow>
                              <TableCell>{row?.rowNumber}</TableCell>
                              <TableCell>{row?.recordId}</TableCell>
                              <TableCell>{row?.accession}</TableCell>
                              <TableCell>{row?.patientName}</TableCell>
                              <TableCell>{row?.errorMessage}</TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <Modal.Footer className="py-2">
          <button
            type="button"
            className="btn btn-sm btn-secondary btn-danger"
            onClick={ModalhandleClose2}
          >
            {t('Close')}
          </button>
        </Modal.Footer>
      </Modal>
      <div className="app-container container-fluid">
        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12">
          <Box sx={{ width: '100%', typography: 'body1' }}>
            <div className="card shadow-sm mb-3 rounded-top-0">
              <div className="card-body py-2">
                <PermissionComponent
                  moduleName="TOX LIS"
                  pageName="Result File"
                  permissionIdentifier="UploadFile"
                >
                  <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between px-4 py-3 bg-gray-100 mb-2 rounded">
                    <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                      <div className="d-flex align-items-center gap-4 justify-content-start flex-wrap mb-5">
                        <span className="fw-bold">{t('File Type:')}</span>
                        <label className="d-flex justify-content-start align-items-start flex-wrap gap-3">
                          {fileTypeList.map((fileType: any) => (
                            <div key={fileType.value}>
                              <input
                                className="form-check-input"
                                type="radio"
                                value={resultType}
                                name="TemplateId"
                                onChange={(e: any) =>
                                  handleonChange(fileType.value)
                                }
                              />
                              <span className="ps-2 mr-2">
                                {fileType.label}
                              </span>
                            </div>
                          ))}
                        </label>
                      </div>
                      <div className="d-flex gap-2">
                        <input
                          type="file"
                          onChange={handleFileSelect}
                          id="upload-file"
                          className="d-none"
                          disabled={images.length > 0 ? true : false}
                          accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        />

                        <label
                          htmlFor="upload-file"
                          className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
                        >
                          <div className="dz-message needsclick">
                            {t('Choose File')}
                          </div>
                        </label>
                        <div>
                          <button
                            onClick={() => ResultFileUpload()}
                            disabled={images.length > 0 ? isSubmitting : true}
                            className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                          >
                            {isSubmitting && (
                              <>
                                <LoaderIcon />
                              </>
                            )}
                            {!isSubmitting && <i className="bi bi-upload"></i>}
                          </button>
                        </div>
                      </div>
                      {images.length > 0 ? (
                        <>
                          {images?.map((filesData: any) => (
                            <>
                              <div className="col-lg-12 col-sm-12 col-md-12">
                                <div className="border bg-light-secondary rounded p-2 my-3">
                                  <div className="d-flex justify-content-between">
                                    <>
                                      <div className="text-dark-65">
                                        <span>{filesData?.name} & </span>
                                        <br />
                                      </div>
                                      <div>
                                        <span
                                          style={{
                                            fontSize: '13px',
                                            cursor: 'pointer',
                                          }}
                                          onClick={() =>
                                            handleImageDeselect(filesData)
                                          }
                                        >
                                          &#x2716;
                                        </span>
                                      </div>
                                    </>
                                  </div>
                                </div>
                              </div>
                            </>
                          ))}
                        </>
                      ) : null}
                      <span className="text-muted">
                        {t(
                          'Note! Please choose only csv,xls or xlsx format file...'
                        )}
                      </span>
                      {invalidFileFormat && (
                        <div className="text-dark-65 form__error">
                          <span>
                            {t(
                              'Invalid file format. Please choose a CSV, XLS, or XLSX file.'
                            )}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="col-12 col-sm-8 col-md-6 col-xl-5 col-xxl-5">
                      <div className="d-flex gap-2 align-items-center justify-content-start justify-content-lg-end mb-2">
                        <label className="required mb-2 fw-bold">
                          {t('Specimen Type')}
                        </label>
                        <Select
                          menuPortalTarget={document.body}
                          styles={reactSelectSMStyle}
                          theme={(theme: any) => styles(theme)}
                          options={specimentype}
                          name="specimenTypeId"
                          placeholder={t('Select Specimen Type')}
                          value={specimentype.filter(function (option: any) {
                            return option.value === specimenVal;
                          })}
                          onChange={(e: any) => onSpecimenSelect(e)}
                          isSearchable={true}
                          required={true}
                          className="z-index-3"
                        />
                        <span style={{ color: 'red' }}></span>
                      </div>
                    </div>
                  </div>
                </PermissionComponent>
                <div className="d-flex gap-4 flex-wrap mb-2">
                  {searchedTags.map(tag =>
                    tag === 'isArchived' || tag === 'specimenType' ? null : (
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
                  <div className="d-flex responsive-flexed-actions-reverse align-items-center">
                    <div className="d-flex align-items-center justify-content-center justify-content-sm-start">
                      <span className="fw-400 mr-3">{t('Records')}</span>
                      <select
                        id={`ToxResultFileRecords`}
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
                        <option value="10" selected>
                          10
                        </option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                      </select>
                    </div>
                    <div className="border-0 d-flex justify-content-center justify-content-sm-start">
                      {/* <div className="d-flex gap-2 gap-lg-3 ">
                        <div>
                          <StyledDropButton
                            id="demo-positioned-button1"
                            aria-controls={
                              openDrop ? "demo-positioned-menu1" : undefined
                            }
                            aria-haspopup="true"
                            aria-expanded={openDrop ? "true" : undefined}
                            onClick={(event) => handleClick(event, "dropdown1")}
                            className="btn btn-info btn-sm"
                          >
                            Bulk Action
                            <span className="svg-icon svg-icon-5 m-0">
                              <ArrowBottomIcon />
                            </span>
                          </StyledDropButton>
                          <StyledDropMenu
                            id="demo-positioned-menu1"
                            aria-labelledby="demo-positioned-button1"
                            anchorEl={anchorEl.dropdown1}
                            open={Boolean(anchorEl.dropdown1)}
                            onClose={() => handleClose("dropdown1")}
                            anchorOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                            transformOrigin={{
                              vertical: "top",
                              horizontal: "left",
                            }}
                          >
                            <PermissionComponent
                              pageName="Result File"
                              permissionIdentifier="Archive50"
                            >
                              <MenuItem
                                className=" w-200px"
                                onClick={handleClickOpen}
                              >
                                Archive
                              </MenuItem>
                            </PermissionComponent>
                          </StyledDropMenu>
                        </div>
                      </div> */}
                    </div>
                  </div>
                  <div className="d-flex align-items-center gap-2 gap-lg-3">
                    <button
                      id={`ToxResultFileSearch`}
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
                      id={`ToxResultFileReset`}
                    >
                      <span>
                        <span>{t('Reset')}</span>
                      </span>
                    </button>
                  </div>
                </div>
                <Box sx={{ height: 'auto', width: '100%' }}>
                  <div className="table_bordered">
                    <TableContainer
                      // component={Paper}
                      className="shadow-none"
                    >
                      <Table
                        // stickyHeader
                        aria-label="sticky table collapsible"
                        className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                      >
                        <ToxResultFileUploadGrid
                          searchRequest={searchRequest}
                          searchQuery={onInputChangeSearch}
                          loading={loading}
                          ResultFileUploadList={resultFileUpload}
                          setResultFileUploadList={setResultFileUpload}
                          ShowBlob={ShowBlob}
                          GetLogsById={GetLogsById}
                          searchRef={searchRef}
                          handleSort={handleSort}
                          sort={sort}
                          handleKeyPress={handleKeyPress}
                          specimenTypeLookup={specimentype}
                          setSearchRequest={setSearchRequest}
                        />
                      </Table>
                    </TableContainer>
                  </div>
                  {/* ==========================================================================================
                          //====================================  PAGINATION START =====================================
                          //============================================================================================ */}
                  <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                    {/* =============== */}
                    <p className="pagination-total-record p-0">
                      {Math.min(pageSize * curPage, total) === 0 ? (
                        <span>
                          {t('Showing 0 to 0 of')} {total} {t('entries')}
                        </span>
                      ) : (
                        <span>
                          {t('Showing')} {pageSize * (curPage - 1) + 1}{' '}
                          {t('to')}
                          {Math.min(pageSize * curPage, total)} {t('of Total')}
                          <span> {total} </span> {t('entries')}
                        </span>
                      )}
                    </p>
                    {/* =============== */}
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
                  </div>
                  {/* ==========================================================================================
                          //====================================  PAGINATION END =====================================
                          //============================================================================================ */}
                </Box>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </>
  );
}
