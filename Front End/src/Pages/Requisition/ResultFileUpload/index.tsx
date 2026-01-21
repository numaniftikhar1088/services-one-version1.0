import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AxiosError, AxiosResponse } from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Modal, ModalBody } from "react-bootstrap";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { Loader } from "../../../Shared/Common/Loader";
import PermissionComponent from "../../../Shared/Common/Permissions/PermissionComponent";
import { LoaderIcon } from "../../../Shared/Icons";
import ArrowBottomIcon from "../../../Shared/SVG/ArrowBottomIcon";
import { StringRecord } from "../../../Shared/Type";
import useLang from "Shared/hooks/useLanguage";
import {
  StyledDropButton,
  StyledDropMenu,
} from "../../../Utils/Style/Dropdownstyle";
import { SortingTypeI, sortById } from "../../../Utils/consts";
import ResultFileUploadGrid from "./ResultFileUploadGrid";

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
    fileName: "",
    uploadedDate: "",
    status: "",
    uploadedBy: "",
    isArchived: false,
  };
  const queryDisplayTagNames: StringRecord = {
    fileName: "File Name",
    uploadedDate: "Date",
    status: "Status",
    uploadedBy: "Uploaded By",
  };

  let [searchRequest, setSearchRequest] = useState(initialSearchQuery);
  const [resultType, setResultType] = useState('');
  type InputChangeEvent = HTMLInputElement | HTMLSelectElement;
  const onInputChangeSearch = (e: React.ChangeEvent<InputChangeEvent>) => {
    setSearchRequest({ ...searchRequest, [e.target.name]: e.target.value });
  };

  function resetSearch() {
    if (value == "1") {
      searchRequest = {
        fileName: "",
        uploadedDate: "",
        status: "",
        uploadedBy: "",
        isArchived: false,
      };
      setSearchRequest({
        fileName: '',
        uploadedDate: '',
        status: '',
        uploadedBy: '',
        isArchived: false,
      });
    } else {
      searchRequest = {
        fileName: '',
        uploadedDate: '',
        status: '',
        uploadedBy: '',
        isArchived: true,
      };
      setSearchRequest({
        fileName: '',
        uploadedDate: '',
        status: '',
        uploadedBy: '',
        isArchived: true,
      });
    }
    setSorting(sortById);
    loadGridData(true, true, sortById);
  }
  const [value, setValue] = React.useState('1');
  useEffect(() => {
    loadGridData(true, true);
    setPageSize(10);
  }, [value]);
  const loadGridData = (
    loader: boolean,
    reset: boolean,
    sortingState?: any
  ) => {
    if (loader) {
      setLoading(true);
    }
    let nullObj;
    if (value === '2') {
      nullObj = {
        fileName: '',
        uploadedDate: '',
        status: '',
        uploadedBy: '',
        isArchived: true,
      };
      setSearchRequest({ ...searchRequest, isArchived: true });
    } else {
      nullObj = {
        fileName: '',
        uploadedDate: '',
        status: '',
        uploadedBy: '',
        isArchived: false,
      };
      setSearchRequest({ ...searchRequest, isArchived: false });
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.getResultFileUpload({
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
        console.trace(err, "err");
        setLoading(false);
      });
  };
  const [selectedBox, setSelectedBox] = useState<any>({
    id: [],
  });
  const handleAllSelect = (checked: boolean, ResultFileUploadList: any) => {
    let idsArr: any = [];
    ResultFileUploadList?.forEach((item: any) => {
      idsArr.push(item?.id);
    });
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: idsArr,
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [],
        };
      });
    }
  };
  const handleChangeRequisitionIds = (checked: boolean, id: number) => {
    if (checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: [...selectedBox.id, id],
        };
      });
    }
    if (!checked) {
      setSelectedBox((pre: any) => {
        return {
          ...pre,
          id: selectedBox.id.filter((item: any) => item !== id),
        };
      });
    }
  };
  const ArchiveResultFileUpload = () => {
    RequisitionType.ArchiveResultFileUpload(selectedBox.id)
      .then((res: any) => {
        if (res.status === 200) {
          setSelectedBox((prevState: any) => {
            return {
              ...prevState,
              id: [], // Clear the array by setting it to an empty array
            };
          });
          // loadData(0)
          loadGridData(true, true);
          ModalhandleClose1();
          setShow1(false);
          toast.success(t("Request Succesfully Processed"));
        }
      })
      .catch((err: AxiosError) => {
        console.log(err, "bulk request failure");
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
  const [path, setPath] = useState('');
  const ResultFileUpload = async () => {
    setIsSubmitting(true);
    const fileType = images[0].name.split('.').pop().trim();

    if (images.length > 0) {
      const formData = new FormData();

      formData.append('file', images[0]);
      formData.append('TemplateId', resultType);
      try {
        // FacilityService.UploadResultsToBlob(formData)
        //   .then((res: AxiosResponse) => {
        //
        //     setPath(res?.data?.Data)
        //     const obj = {
        //       FileName: images[0].name,
        //       FileType: fileType,
        //       FileDataType: resultType,
        //       AzureLink: res?.data?.Data,
        //     }

        if (resultType != '') {
          RequisitionType.FileUploadResultFileUpload(formData)
            .then((res: AxiosResponse) => {
              setIsSubmitting(true);
              console.log('statuscode', res?.data?.statusCode);
              if (res?.data?.statusCode == 200) {
                toast.success(t(res?.data?.message));
              } else if (res?.data?.statusCode == 400) {
                toast.error(t(res?.data?.message));
              }
              loadGridData(true, true);
              setIsSubmitting(false);
              setImages([]);
              setInvalidFileFormat(false);
              setResultType('');
            })
            .catch((err: AxiosError) => {
              console.log(err);
            });
        } else {
          toast.error(t('Please Select File Type'));
          setIsSubmitting(false);
        }
        // })
        // .catch((err: AxiosError) => {
        //
        // })
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
    RequisitionType.GetFileTypesLookup(4)
      .then((res: AxiosResponse) => {
        // Assuming the response contains an array of file types
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
    // setImages([...images, ...e.target.files])
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
    setResultType(e.target.value);
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
  const handleClick2 = (event: any, dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: event.currentTarget });
  };

  const handleClose2 = (dropdownName: string) => {
    setAnchorEl({ ...anchorEl, [dropdownName]: null });
  };
  const [show2, setShow2] = useState(false);

  const ModalhandleClose2 = () => setShow2(false);
  const handleClickOpen2 = (ids: any) => {
    setShow2(true);
    handleClose2('dropdown1');
  };

  // ========================= tabs

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
    setSearchRequest(initialSearchQuery);
    // loadGridData(true, true)
  };

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

  useEffect(() => {
    if (value == '2' && searchedTags.length === 1) {
      resetSearch();
    } else if (searchedTags.length === 0) resetSearch();
  }, [searchedTags.length]);

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
            id="IDResultFileModalArchiveCancel"
            type="button"
            className="btn btn-sm btn-secondary"
            onClick={ModalhandleClose1}
          >
            {t('Cancel')}
          </button>
          <button
            id="IDResultFileModalArchiveSave"
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
            <TabContext value={value}>
              <TabList
                onChange={handleChange}
                aria-label="lab API tabs example"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
                sx={{
                  '& .MuiTabs-scrollButtons': {
                    width: 0,
                    transition: 'width 0.7s ease',
                    '&:not(.Mui-disabled)': {
                      width: '48px',
                    },
                  },
                  minHeight: 'auto !important',
                  '& .MuiButtonBase-root': { textTransform: 'capitalize' },
                  '& .Mui-selected': {
                    background: '#fff',
                    borderStartStartRadius: '8px',
                    borderStartEndRadius: '8px',
                    zIndex: 4,
                    color: 'var(--bs-primary) !important',
                  },
                  '& .MuiTabs-indicator': { display: 'none' },
                }}
              >
                <Tab data-test-id="Active" label={t('Active')} value="1" />
                <Tab data-test-id="Archive" label={t('Archive')} value="2" />
              </TabList>
              <div className="card shadow-sm mb-3 rounded-top-0">
                <div className="card-body py-2">
                  {/* <TabPanel value={value}> */}
                  <PermissionComponent
                    moduleName="ID LIS"
                    pageName="Result File"
                    permissionIdentifier="UploadFile"
                  >
                    {value == '1' ? (
                      <div className="align-items-center d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between px-4 py-3 bg-gray-100 mb-3 rounded">
                        <div className="page-title d-flex flex-column justify-content-center flex-wrap me-3">
                          <div className="d-flex gap-2">
                            <input
                              id={`IDResultFileUploadFileInput`}
                              type="file"
                              onChange={handleFileSelect}
                              className="d-none"
                              disabled={images.length > 0 ? true : false}
                              accept=".csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                            />

                            <label
                              htmlFor="IDResultFileUploadFileInput"
                              className="dropzone pt-2 py-1 px-8 d-flex align-items-center"
                            >
                              <div className="dz-message needsclick">
                                {t('Choose File')}
                              </div>
                            </label>
                            <div>
                              <button
                                id={`IDResultFileUploadFileButton`}
                                onClick={() => ResultFileUpload()}
                                disabled={
                                  images.length > 0 ? isSubmitting : true
                                }
                                className="btn btn-icon btn-sm fw-bold btn-primary btn-icon-light"
                              >
                                {isSubmitting && (
                                  <>
                                    <LoaderIcon />
                                  </>
                                )}
                                {!isSubmitting && (
                                  <i className="bi bi-upload"></i>
                                )}
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

                        <div className="d-flex align-items-center gap-4  justify-content-start flex-wrap ">
                          <span className="fw-bold">{t('File Type:')}</span>
                          <label className="d-flex justify-content-start align-items-start flex-wrap gap-3">
                            {fileTypeList.map((fileType: any) => (
                              <div key={fileType.value}>
                                <input
                                  id={`IDResultFileFileTypeRadioButton_${fileType.value}`}
                                  className="form-check-input"
                                  type="radio"
                                  value={fileType.value}
                                  name="resultType"
                                  checked={resultType == fileType.value}
                                  onChange={handleonChange}
                                />
                                <span className="ps-2 mr-2">
                                  {fileType.label}
                                </span>
                              </div>
                            ))}
                          </label>
                        </div>
                      </div>
                    ) : null}
                  </PermissionComponent>
                  <div className="d-flex gap-4 flex-wrap mb-1">
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
                        <span className="fw-400 mr-2">{t('Records')}</span>
                        <select
                          id={`IdResultFileRecords`}
                          className="form-select w-125px h-33px rounded py-2"
                          data-kt-select2="true"
                          data-placeholder="Select option"
                          data-dropdown-parent="#kt_menu_63b2e70320b73"
                          data-allow-clear="true"
                          onChange={e => {
                            setPageSize(parseInt(e.target.value));
                          }}
                          value={pageSize}
                        >
                          <option value="5">5</option>
                          <option value="10" selected>
                            10
                          </option>
                          <option value="50">50</option>
                          <option value="100">100</option>
                        </select>
                      </div>
                      <div className="d-flex gap-2 gap-lg-3 justify-content-center justify-content-sm-start">
                        {value == '1' ? (
                          <div className="d-flex gap-2 gap-lg-3 ">
                            <div>
                              <StyledDropButton
                                id={`IdResultFileBulkActionButton`}
                                aria-controls={
                                  openDrop ? 'demo-positioned-menu1' : undefined
                                }
                                aria-haspopup="true"
                                aria-expanded={openDrop ? 'true' : undefined}
                                onClick={event =>
                                  handleClick(event, 'dropdown1')
                                }
                                className="btn btn-info btn-sm"
                              >
                                {t('Bulk Action')}
                                <span className="svg-icon svg-icon-5 m-0">
                                  <ArrowBottomIcon />
                                </span>
                              </StyledDropButton>
                              <StyledDropMenu
                                aria-labelledby="demo-positioned-button1"
                                anchorEl={anchorEl.dropdown1}
                                open={Boolean(anchorEl.dropdown1)}
                                onClose={() => handleClose('dropdown1')}
                                anchorOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                                transformOrigin={{
                                  vertical: 'top',
                                  horizontal: 'left',
                                }}
                              >
                                <PermissionComponent
                                  moduleName="ID LIS"
                                  pageName="Result File"
                                  permissionIdentifier="Archive"
                                >
                                  <MenuItem className="p-0">
                                    <a
                                      id={`IdResultFileBulkArchive`}
                                      className=" w-auto p-0 w-100px text-dark"
                                      onClick={handleClickOpen}
                                    >
                                      {t('Archive')}
                                    </a>
                                  </MenuItem>
                                </PermissionComponent>
                              </StyledDropMenu>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-lg-3">
                      <button
                        id={`IdResultFileSearch`}
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
                        id={`IdResultFileReset`}
                      >
                        <span>
                          <span>{t('Reset')}</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  <Box sx={{ height: 'auto', width: '100%' }}>
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
                        // component={Paper}
                        className="shadow-none"
                        // sx={{ maxHeight: 'calc(100vh - 100px)' }}
                      >
                        <Table
                          // stickyHeader
                          aria-label="sticky table collapsible"
                          className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                        >
                          <ResultFileUploadGrid
                            searchRequest={searchRequest}
                            searchQuery={onInputChangeSearch}
                            loading={loading}
                            ResultFileUploadList={resultFileUpload}
                            setResultFileUploadList={setResultFileUpload}
                            handleAllSelect={handleAllSelect}
                            handleChangeRequisitionIds={
                              handleChangeRequisitionIds
                            }
                            selectedBox={selectedBox}
                            ShowBlob={ShowBlob}
                            handleClickOpen2={handleClickOpen2}
                            GetLogsById={GetLogsById}
                            tabPanel={value}
                            searchRef={searchRef}
                            handleSort={handleSort}
                            sort={sort}
                            handleKeyPress={handleKeyPress}
                          />
                        </Table>
                      </TableContainer>
                    </div>
                    {/* ==========================================================================================
                          //====================================  PAGINATION START =====================================
                          //============================================================================================ */}
                    <div className="d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center mt-4">
                      {/* =============== */}
                      <p className="pagination-total-record mb-0">
                        {Math.min(pageSize * curPage, total) === 0 ? (
                          <span>
                            {t('Showing 0 to 0 of')} {total} {t('entries')}
                          </span>
                        ) : (
                          <span>
                            {t('Showing')} {pageSize * (curPage - 1) + 1}{' '}
                            {t('to')}
                            {Math.min(pageSize * curPage, total)}{' '}
                            {t('of Total')}
                            <span> {total} </span> {t('entries')}
                          </span>
                        )}
                      </p>
                      {/* =============== */}
                      <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={() => showPage(1)}
                        >
                          <i className="fa fa-angle-double-left"></i>
                        </li>
                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={prevPage}
                        >
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

                        <li
                          className="btn btn-lg p-2 h-33px"
                          onClick={nextPage}
                        >
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
                  {/* </TabPanel> */}
                </div>
              </div>
            </TabContext>
          </Box>
        </div>
      </div>
    </>
  );
}
