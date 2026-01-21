import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import Select from 'react-select';
import { toast } from 'react-toastify';
import useLang from 'Shared/hooks/useLanguage';
import {
  TrainingAidsCategory,
  TrainingAidsDelete,
  TrainingAidsGetAll,
  TrainingAidsSaveData,
  getFacilitiesLookup,
} from '../../../Services/Marketing/TrainingAids';
import { Loader } from '../../../Shared/Common/Loader';
import NoRecord from '../../../Shared/Common/NoRecord';
import PermissionComponent from '../../../Shared/Common/Permissions/PermissionComponent';
import usePagination from '../../../Shared/hooks/usePagination';
import { ArrowDown, ArrowUp } from '../../../Shared/Icons';
import { StringRecord } from '../../../Shared/Type';
import { reactSelectSMStyle, styles } from '../../../Utils/Common';
import { SortingTypeI, sortById } from '../../../Utils/consts';
import DocumentUploadTable from './DocumentuploadTable';
import FacilityRow from './FacilityRow';

interface Lookups {
  value: number;
  label: string;
}

const TrainingAidsTab = () => {
  const { t } = useLang();

  const [loading, setLoading] = useState(true);
  const [fileName, setfileName] = useState<any>([]);
  const [path, setPath] = useState<any>('');
  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };
  const [tabsData, setTabsData] = React.useState(true);
  const initialPostData = {
    id: 0,
    fileName: '',
    filetype: '',
    categoryId: 0,
    trainingAidsDescription: '',
  };
  const [postData, setpostData] = useState<any>(initialPostData);
  const [reset, setReset] = useState(false);

  /*#####################-----Category lookup function start-----####################*/

  const [categoryLookup, setCategoryLookup] = useState<Lookups[]>([]);
  const categotyGet = async () => {
    let res = await TrainingAidsCategory();
    setCategoryLookup(res.data);
  };

  useEffect(() => {
    categotyGet();
  }, []);

  const handleChangeCategory = (e: any) => {
    setpostData((prevData: any) => ({
      ...prevData,
      categoryId: +e.value,
    }));
  };

  const [triggerSearchData, setTriggerSearchData] = useState(false);
  /*######################-----Category lookup function End-----####################*/

  /*#####################-----Facility lookup and function start-----###################*/
  const [facilityLookup, setFacilityLookup] = useState<Lookups[]>([]);
  const [selectedFacilities, setSelectedFacilities] = useState<Lookups[]>([]);
  const [allFacilitiesSearchTerm, setAllFacilitiesSearchTerm] = useState('');
  const [selectedFacilitiesSearchTerm, setSelectedFacilitiesSearchTerm] =
    useState('');

  const fetchFacilities = async () => {
    const facilities = await getFacilitiesLookup();
    setFacilityLookup(facilities.data);
  };

  const handleFacilityClick = (facility: Lookups) => {
    setSelectedFacilities(prevSelectedFacilities => {
      if (
        prevSelectedFacilities.some(
          selected => selected.value === facility.value
        )
      ) {
        return prevSelectedFacilities;
      } else {
        return [...prevSelectedFacilities, facility];
      }
    });

    setFacilityLookup(prevFacilityLookup =>
      prevFacilityLookup.filter(f => f.value !== facility.value)
    );
  };

  const removeSelectedFacilities = (facility: Lookups) => {
    setSelectedFacilities(prevSelectedFacilities =>
      prevSelectedFacilities.filter(f => f.value !== facility.value)
    );
    setFacilityLookup(prevFacilityLookup => [...prevFacilityLookup, facility]);
  };

  const moveAllToSelectedFacilities = () => {
    // Move all facilities from facilityLookup to selectedFacilities
    setSelectedFacilities(prevSelectedFacilities => [
      ...prevSelectedFacilities,
      ...facilityLookup, // Adding all facilities to selected
    ]);
    setFacilityLookup([]); // Empty out the facilityLookup
  };

  const moveAllToFacilityLookup = () => {
    // Move all facilities from selectedFacilities back to facilityLookup
    setFacilityLookup(prevFacilityLookup => [
      ...prevFacilityLookup,
      ...selectedFacilities, // Adding all selected facilities back to lookup
    ]);
    setSelectedFacilities([]); // Empty out the selectedFacilities
  };

  /*#####################-----Facility lookup and function End-----###################*/
  /*##############################-----Post Api start-----#################*/

  const ApidataPost = async () => {
    const data = {
      id: postData.id,
      fileName: fileName?.[0]?.name ?? postData.fileName,
      filePath: path,
      categoryId: postData.categoryId,
      userType: 'Facility',
      isAllUser: true,
      trainingAidsDescription: postData.trainingAidsDescription,
      trainingAidsDetails: selectedFacilities.map((row: any) => ({
        id: 0,
        trainingAidsId: 0,
        facilityId: row.value,
        salesRepId: '',
      })),
    };
    let resp = await TrainingAidsSaveData(data);
  };

  const handlesave = async () => {
    if (
      (fileName.length === 0 && postData.fileName.length === 0) ||
      path.length === 0
    ) {
      toast.error(t('Please upload a file'));
      return;
    }
    if (postData.categoryId === 0) {
      toast.error(t('Please select a Category'));
      return;
    }
    if (selectedFacilities.length === 0) {
      toast.error(t('Please select at least one facility'));
      return;
    }
    await ApidataPost();
    setTabsData(true);
    showData();
    setpostData(initialPostData);
    setfileName([]);
    setSelectedFacilities([]);
    setPath('');
  };
  const handleCancel = () => {
    setTabsData(true);
    setpostData(initialPostData);
    setSelectedFacilities([]);
    setfileName([]);
    setPath('');
  };
  /*##############################-----Post Api End-----#################*/
  /*##############################-----PAGINATION Start-----#################*/
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

  /*##############################-----PAGINATION End-----#################*/

  /*#########################----SORT STARTS------########################## */
  const [sort, setSorting] = useState<SortingTypeI>(sortById);

  const searchRef = useRef<any>(null);

  /////////////
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

    showData();
  };
  /*#########################----SORT ENDS------########################## */

  /*#########################----Search Function Start------########################## */

  const handleInputChange = (e: any, selectName?: string) => {
    if (selectName === 'trainingAidsCategory') {
      const filteredCategories = categoryLookup.find(
        category => category.value === e.value
      );

      setSearchCriteria({
        ...searchCriteria,
        categoryName: filteredCategories?.label as string,
        categoryId: filteredCategories?.value as number,
      });
    } else {
      setSearchCriteria({
        ...searchCriteria,
        [e.target.name]: e.target.value,
      });
    }
  };

  /*#########################----Search Function End------########################## */

  /*#################-----Formate Date & Time-----###################*/

  const formatDateTime = (dateString: any) => {
    if (!dateString) return { date: '', time: '' };
    const date = new Date(dateString);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(date);
    const formattedTime = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date);
    return { date: formattedDate, time: formattedTime };
  };
  /*#################-----Formate Date & Time End-----###################*/

  /*##############################-----Start Get Api-----#################*/

  const [apiGetData, setApiGetData] = useState([]);
  const showData = async () => {
    let obj = {
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: {
        id: 0,
        fileName: (searchCriteria.fileName || '').trim(),
        filePath: '',
        categoryName: (searchCriteria.categoryName || '').trim(),
        categoryId: searchCriteria.categoryId || 0,
        userType: 'Facility',
        isAllUser: true,
        trainingAidsDescription: (
          searchCriteria.trainingAidsDescription || ''
        ).trim(),
        uploadBy: (searchCriteria.uploadBy || '').trim(),
        uploadDate: searchCriteria.uploadDate || null,
        trainingAidsDetails: [
          {
            id: 0,
            trainingAidsId: 0,
            facilityId: 0,
            facilityName: '',
            salesRepId: '',
            salesRepName: '',
          },
        ],
      },
      sortColumn: sort.clickedIconData || 'Id',
      sortDirection: sort.sortingOrder || 'Desc',
    };
    let res = await TrainingAidsGetAll(obj);

    const formattedData = res?.data?.data?.map((item: any) => {
      const { date, time } = formatDateTime(item.uploadDate);
      return {
        ...item,
        uploadDate: date,
        uploadTime: time,
      };
    });

    setApiGetData(formattedData);
    setTotal(res?.data?.total);
    setLoading(false);
  };

  useEffect(() => {
    showData();
  }, []);
  useEffect(() => {
    showData();
  }, [pageSize, curPage, triggerSearchData]);

  /*##############################-----Get Api End-----#################*/

  /*##############################-----Edit Request Start-----#################*/

  const handleEdit = (row: any) => {
    setpostData(() => ({
      ...row,
      id: row.id,
      fileName: row.fileName,
    }));
    setPath(row.filePath);
    const formattedFacilities = row.trainingAidsDetails.map((item: any) => ({
      value: item.facilityId,
      label: item.facilityName,
    }));

    setSelectedFacilities(formattedFacilities);

    setFacilityLookup(prevFacilityLookup =>
      prevFacilityLookup.filter(
        facility =>
          !formattedFacilities.some(
            (selectedFacility: any) => selectedFacility.value === facility.value
          )
      )
    );

    setFacilityLookup(prevFacilityLookup =>
      prevFacilityLookup.filter(
        facility => facility.value !== formattedFacilities.value
      )
    );
    fetchFacilities();
  };

  const filteredSelectedFacilities = selectedFacilities.filter(facility =>
    facility?.label
      ?.toLowerCase()
      .includes(selectedFacilitiesSearchTerm.toLowerCase())
  );
  /*##############################-----Edit Request End-----#################*/

  /*##############################-----Delete Api Start-----##############################*/
  const handleDelete = async (id: number) => {
    try {
      await TrainingAidsDelete(id);
      showData();
    } catch (error) {
      console.error(t('Error deleting record:'), error);
    }
  };
  /*##############################-----Delete Api End-----##############################*/

  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria);
    setReset(!reset);
    setTabsData(true);
    setpostData(initialPostData);
    setCurPage(1);
    setPageSize(50);
    setSorting(sortById);
  };

  useEffect(() => {
    showData();
  }, [reset]);

  const UploadFile = () => {
    fetchFacilities();
    setTabsData(false);
    setpostData(initialPostData);
  };

  const clearFileName = () => {
    setpostData(() => ({
      ...postData,
      fileName: '',
    }));
  };

  /*##############################-----Search Function And Show Tags-----##############################*/
  const initialSearchCriteria = {
    fileName: '',
    trainingAidsDescription: '',
    uploadDate: '',
    uploadTime: '',
    uploadBy: '',
    categoryName: '',
    categoryId: 0,
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  const queryDisplayTagNames: StringRecord = {
    fileName: 'File Name',
    trainingAidsDescription: 'Training Aids Description',
    uploadDate: 'Upload Date',
    uploadBy: 'Upload By',
    categoryName: 'Category name',
  };
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const handleTagRemoval = (clickedTag: string) => {
    setSearchCriteria((prevSearchRequest: any) => {
      return {
        ...prevSearchRequest,
        [clickedTag]: (initialSearchCriteria as any)[clickedTag],
      };
    });

    if (clickedTag === 'categoryId' || clickedTag === 'categoryName') {
      setpostData((prevData: any) => ({ ...prevData, categoryId: null }));
    }
  };

  useEffect(() => {
    const uniqueKeys = new Set<string>();
    for (const [key, value] of Object.entries(searchCriteria)) {
      if (value) {
        uniqueKeys.add(key);
      }
    }
    setSearchedTags(Array.from(uniqueKeys));
  }, [searchCriteria]);

  useEffect(() => {
    if (searchedTags.length === 0) handleReset();
  }, [searchedTags.length]);

  useEffect(() => {
    if (postData.fileName.length === 0) {
      setPath('');
    }
  }, [postData.fileName]);
  /*##############################-----Search function End-----##############################*/

  const handleSearch = () => {
    setCurPage(1);
    setTriggerSearchData(prev => !prev);
  };
  console.log(triggerSearchData, 'TriggerSearchData');

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };
  return (
    <>
      {tabsData ? (
        <>
          <div className="d-flex gap-4 flex-wrap mb-2">
            {searchedTags.map(tag =>
              tag === 'status' || tag === 'categoryId' ? (
                ''
              ) : (
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
          <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
            <div className="d-flex align-items-center responsive-flexed-actions gap-2">
              <div className="d-flex align-items-center">
                <span className="fw-400 mr-3">{t('Records')}</span>
                <select
                  id={`TrainingDocumentTrainingAidRecords`}
                  className="form-select w-100px h-33px rounded py-2"
                  data-allow-clear="true"
                  data-dropdown-parent="#kt_menu_63b2e70320b73"
                  data-kt-select2="true"
                  data-placeholder="Select option"
                  value={pageSize}
                  onChange={e => setPageSize(parseInt(e.target.value))}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div className="d-flex align-items-center gap-2">
                <PermissionComponent
                  moduleName="Marketing"
                  pageName="Training Documents"
                  permissionIdentifier="UploadFile"
                >
                  <button
                    id={`TrainingDocumentTrainingAidAddNew`}
                    className="btn btn-primary btn-sm btn-primary--icon "
                    onClick={UploadFile}
                  >
                    <span
                      style={{
                        fontSize: '11px',
                      }}
                    >
                      {t('Upload File')}
                    </span>
                  </button>
                </PermissionComponent>
              </div>
            </div>

            <div className="d-flex align-items-center gap-2">
              <button
                id={`TrainingDocumentTrainingAidSearch`}
                aria-controls="Search"
                className="btn btn-linkedin btn-sm fw-500"
                onClick={handleSearch}
              >
                {t('Search')}
              </button>
              <button
                className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
                id={`TrainingDocumentTrainingAidReset`}
                type="button"
                onClick={handleReset}
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
                    aria-label="sticky table collapsible"
                    className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
                  >
                    <TableHead>
                      <TableRow className="h-40px">
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            id={`TrainingDocumentTrainingAidSearchFileName`}
                            type="text"
                            name="fileName"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder={t('Search ...')}
                            value={searchCriteria.fileName}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>

                        <TableCell></TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            id={`TrainingDocumentTrainingAidSearchDescription`}
                            type="text"
                            name="trainingAidsDescription"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder={t('Search ...')}
                            value={searchCriteria.trainingAidsDescription}
                            onChange={handleInputChange}
                            onKeyDown={handleKeyPress}
                          />
                        </TableCell>
                        <TableCell>
                          <Select
                            inputId={`TrainingDocumentTrainingAidSearchCategory`}
                            onKeyDown={handleKeyPress}
                            menuPortalTarget={document.body}
                            theme={(theme: any) => styles(theme)}
                            options={categoryLookup}
                            name="trainingAidsCategory"
                            onChange={e => {
                              handleChangeCategory(e);
                              handleInputChange(e, 'trainingAidsCategory');
                            }}
                            value={categoryLookup.filter(function (
                              option: any
                            ) {
                              return option.value === postData.categoryId;
                            })}
                            styles={reactSelectSMStyle}
                          />
                        </TableCell>
                        <TableCell>
                          <input
                            id={`TrainingDocumentTrainingAidSearchUploadedDate`}
                            onKeyDown={handleKeyPress}
                            type="date"
                            name="uploadDate"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            value={searchCriteria.uploadDate}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell>
                          <input
                            id={`TrainingDocumentTrainingAidSearchUnloadedBy`}
                            onKeyDown={handleKeyPress}
                            type="text"
                            name="uploadBy"
                            className="form-control bg-white mb-lg-0 min-w-150px w-100 rounded-2 fs-8 h-30px"
                            placeholder={t('Search ...')}
                            value={searchCriteria.uploadBy}
                            onChange={handleInputChange}
                          />
                        </TableCell>
                      </TableRow>

                      <TableRow className="h-30px">
                        <TableCell></TableCell>
                        <TableCell>{t('Actions')}</TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('fileName')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('File Name')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'fileName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'fileName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell
                          sx={{
                            width: 'max-content',
                          }}
                        >
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            id=""
                          >
                            <div
                              style={{
                                width: 'max-content',
                              }}
                            >
                              {t('Download File')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0"></div>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="d-flex justify-content-between align-items-center min-w-80px">
                            <div>{t('View File')}</div>
                          </div>
                        </TableCell>
                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() =>
                              handleSort('trainingAidsDescription')
                            }
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Description')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData ===
                                    'trainingAidsDescription'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData ===
                                    'trainingAidsDescription'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('categoryName')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Category')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'categoryName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'categoryName'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('uploadDate')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Uploaded Date')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'uploadDate'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'uploadDate'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between"
                            // onClick={() => handleSort("uploadTime")}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Upload Time')}
                            </div>
                          </div>
                        </TableCell>

                        <TableCell sx={{ width: 'max-content' }}>
                          <div
                            className="d-flex justify-content-between cursor-pointer"
                            onClick={() => handleSort('uploadBy')}
                            ref={searchRef}
                          >
                            <div style={{ width: 'max-content' }}>
                              {t('Uploaded By')}
                            </div>

                            <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                              <ArrowUp
                                CustomeClass={`${
                                  sort.sortingOrder === 'desc' &&
                                  sort.clickedIconData === 'uploadBy'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                              <ArrowDown
                                CustomeClass={`${
                                  sort.sortingOrder === 'asc' &&
                                  sort.clickedIconData === 'uploadBy'
                                    ? 'text-success fs-7'
                                    : 'text-gray-700 fs-7'
                                } p-0 m-0`}
                              />
                            </div>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {loading ? (
                        <TableCell colSpan={10}>
                          <Loader />
                        </TableCell>
                      ) : apiGetData.length === 0 ? (
                        <NoRecord colSpan={10} />
                      ) : (
                        apiGetData.map((row: any) => (
                          <FacilityRow
                            row={row}
                            key={row.id}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            setTabsData={setTabsData}
                          />
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </div>

          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
          <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-sm-between align-items-center mt-4 mb-3">
            <p className="pagination-total-record mb-0">
              <span>
                {t('Showing')} {pageSize * (curPage - 1) + 1} {t('to')}{' '}
                {Math.min(pageSize * curPage, total)} {t('of Total')}
                <span> {total} </span> {t('entries')}
              </span>
            </p>
            <ul className="d-flex align-items-center justify-content-end custome-pagination p-0 mb-0">
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
          {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  PAGINATION END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
        </>
      ) : (
        <>
          <DocumentUploadTable
            path={path}
            setPath={setPath}
            tabsData={tabsData}
            postData={postData}
            fileName={fileName}
            handlesave={handlesave}
            apiGetData={apiGetData}
            setpostData={setpostData}
            setfileName={setfileName}
            handleCancel={handleCancel}
            clearFileName={clearFileName}
            categoryLookup={categoryLookup}
            facilityLookup={facilityLookup}
            setCategoryLookup={setCategoryLookup}
            setFacilityLookup={setFacilityLookup}
            selectedFacilities={selectedFacilities}
            handleFacilityClick={handleFacilityClick}
            handleChangeCategory={handleChangeCategory}
            allFacilitiesSearchTerm={allFacilitiesSearchTerm}
            removeSelectedFacilities={removeSelectedFacilities}
            moveAllToFacilityLookup={moveAllToFacilityLookup}
            filteredSelectedFacilities={filteredSelectedFacilities}
            setAllFacilitiesSearchTerm={setAllFacilitiesSearchTerm}
            moveAllToSelectedFacilities={moveAllToSelectedFacilities}
            selectedFacilitiesSearchTerm={selectedFacilitiesSearchTerm}
            setSelectedFacilitiesSearchTerm={setSelectedFacilitiesSearchTerm}
          />
        </>
      )}
    </>
  );
};

export default TrainingAidsTab;
