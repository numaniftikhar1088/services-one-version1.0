import {
  Box,
  Paper,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { sortById, SortingTypeI } from 'Pages/Compendium/TestType';
import React, { useEffect, useRef, useState } from 'react';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import {
  ChangeSpecimenType,
  GetSpecimenType,
  SaveSpecimenType,
} from 'Services/BloodLisSetting/BloodLisSetting';
import { Loader } from 'Shared/Common/Loader';
import NoRecord from 'Shared/Common/NoRecord';
import PermissionComponent from 'Shared/Common/Permissions/PermissionComponent';
import usePagination from 'Shared/hooks/usePagination';
import CustomPagination from 'Shared/JsxPagination';
import { StringRecord } from 'Shared/Type';
import { ArrowDown, ArrowUp } from '../../../../Shared/Icons';
import useLang from './../../../../Shared/hooks/useLanguage';
import AddSpecimenType from './AddSpecimenType';
import SpecimenRow from './SpecimenRow';
import useIsMobile from 'Shared/hooks/useIsMobile';

const SpecimenType = () => {
  const { t } = useLang();
  const isMobile = useIsMobile();
  const [loading, setLoading] = useState(true);
  const [searchedTags, setSearchedTags] = useState<string[]>([]);
  const initialPostData = {
    id: 0,
    SpecimenType: '',
    prefix: '',
    suffix: '',
    isActive: true,
  };
  const [postData, setPostData] = useState<any>(initialPostData);
  const [triggerSearchData, setTriggerSearchData] = useState<boolean>(false);

  const [apiGetData, setApiGetData] = useState<any[]>([]);
  // const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const [addSpecimen, setaddSpecimen] = useState(false);
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

    showAPIDAta();
  };
  /*#########################----SORT ENDS------########################## */

  /*##############################-----Post Api start-----#################*/

  const ApidataPost = async () => {
    const data = {
      id: 0,
      specimenType: postData.SpecimenType,
      specimenPrefix: postData.prefix,
      specimenSuffix: postData.suffix,
      isActive: postData.isActive,
    };
    let resp = await SaveSpecimenType(data);
    console.log(resp, 'checkdata');
  };

  /*##############################-----Post Api End-----###################*/

  /*##############################-----PAGINATION Start-----#################*/
  const {
    total,
    curPage,
    showPage,
    nextPage,
    prevPage,
    setTotal,
    pageSize,
    totalPages,
    pageNumbers,
    setPageSize,
    setCurPage,
  } = usePagination();

  /*##############################-----PAGINATION End-----#################*/
  const [reset, setReset] = useState(false);

  /*#########################----Search Function Start------########################## */

  const initialSearchCriteria = {
    SpecimenType: '',
    prefix: '',
    suffix: '',
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);
  /*#########################----Search Function End------########################## */

  /*##############################-----Get Api Start-----#################*/
  let obj = {
    pageNumber: curPage,
    pageSize: pageSize,
    queryModel: {
      specimenType: (searchCriteria.SpecimenType || '').trim(),
      specimenPrefix: (searchCriteria.prefix || '').trim(),
      specimenSuffix: (searchCriteria.suffix || '').trim(),
    },
    sortColumn: sort.clickedIconData || 'Id',
    sortDirection: sort.sortingOrder || 'Desc',
  };
  const showAPIDAta = async () => {
    let resp = await GetSpecimenType(obj);
    console.log(resp, 'response');
    setApiGetData(resp?.data?.data);
    setTotal(resp?.data?.total);
    setLoading(false);
  };

  useEffect(() => {
    showAPIDAta();
  }, [curPage, pageSize, triggerSearchData]);

  /*##############################-----Delete Api Start-----##############################*/
  const handleSpecimenChabge = async (id: number) => {
    try {
      await ChangeSpecimenType(id);
      showAPIDAta();
    } catch (error) {
      console.error('Error Changing record:', error);
    }
  };
  /*##############################-----Delete Api End-----##############################*/

  const handlesave = async () => {
    if (postData.prefix.length > 0 && postData.suffix.length > 0) {
      toast.error(t('You Can Either Select Prefix Or Sufix.'));
      return;
    }
    if (postData.SpecimenType.length === 0) {
      toast.error(t('Please Enter Specimen Type.'));
      return;
    }
    if (postData.prefix.length === 0 && postData.suffix.length === 0) {
      toast.error(t('Please Enter prefix / Suffix.'));
      return;
    }
    await ApidataPost();
    showAPIDAta();
    setaddSpecimen(false);
    setPostData(initialPostData);
  };

  const handleCancel = () => {
    showAPIDAta();
    setaddSpecimen(false);
    setPostData(initialPostData);
  };

  const handleReset = async () => {
    setSearchCriteria(initialSearchCriteria);
    setReset(!reset);
  };
  useEffect(() => {
    showAPIDAta();
  }, [reset]);

  const queryDisplayTagNames: StringRecord = {
    SpecimenType: 'Specimen Type',
    prefix: 'Specimen Prefix',
    suffix: 'Specimen Suffix',
  };

  const handleTagRemoval = (clickedTag: string) => {
    setSearchCriteria(searchRequest => {
      return {
        ...searchRequest,
        [clickedTag]: (initialSearchCriteria as any)[clickedTag],
      };
    });
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

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      setCurPage(1);
      setTriggerSearchData((prev: any) => !prev);
    }
  };
  /*##############################-----Add Specimen Functions-----##############################*/

  /*##############################-----Add Status Function-----##############################*/
  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPostData({
      ...postData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };
  /*##############################-----Add Specimen Type Select-----##############################*/

  const handleChangeCategory = (e: any) => {
    setPostData((prevData: any) => ({
      ...prevData,
      SpecimenType: e ? e.label : '',
    }));
  };

  return (
    <>
      <div className="d-flex gap-4 flex-wrap mb-2">
        {searchedTags.map(tag =>
          tag === 'groupId' ? null : (
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
      <div className="d-flex flex-wrap justify-content-center justify-content-sm-between align-items-center responsive-flexed-actions mb-2 gap-2">
        <div className="d-flex align-items-center responsive-flexed-actions gap-2">
          <div className="d-flex align-items-center">
            <span className="fw-400 mr-3">{t('Records')}</span>
            <select
              id={`BloodLisSettingSpecimenTypeRecords`}
              className="form-select w-100px h-33px rounded"
              data-allow-clear="true"
              data-dropdown-parent="#kt_menu_63b2e70320b73"
              data-kt-select2="true"
              data-placeholder={t('Select option')}
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
              moduleName="Blood LIS"
              pageName="LIS Setting"
              permissionIdentifier="AddSpecimenType"
            >
              <button
                id={`BloodLisSettingSpecimenTypeAddNew`}
                className="btn btn-primary btn-sm btn-primary--icon px-7"
                onClick={() => {
                  setaddSpecimen(true);
                }}
              >
                <i className="fa" style={{ fontSize: 11 }}>
                  
                </i>
                <span style={{ fontSize: 11 }}>
                  {t('Add New Specimen Type')}
                </span>
              </button>
            </PermissionComponent>
          </div>
        </div>
        <div className="d-flex align-items-center gap-2">
          <button
            id={`BloodLisSettingSpecimenTypeSearch`}
            className="btn btn-linkedin btn-sm fw-500"
            aria-controls="Search"
            onClick={() => {
              setCurPage(1);
              setTriggerSearchData((prev: any) => !prev);
            }}
          >
            {t('Search')}
          </button>
          <button
            className="btn btn-secondary btn-sm btn-secondary--icon fw-500"
            id={`BloodLisSettingSpecimenTypeReset`}
            type="button"
            onClick={handleReset}
          >
            <span>{t('Reset')}</span>
          </button>
        </div>
      </div>

      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table START ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}

      <div className="card">
        <Box sx={{ height: 'auto', width: '100%' }}>
          <div className="table_bordered overflow-hidden">
            <TableContainer
              sx={
                
                  isMobile ?  {} :
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
              component={Paper}
              className="shadow-none"
            >
              <Table
                aria-label="sticky table collapsible"
                className="table table-cutome-expend table-bordered table-sticky-header table-head-2-bg table-bg table-head-custom table-vertical-center border-0 mb-0"
              >
                <TableHead>
                  <TableRow className="h-40px">
                    <TableCell className="w-50px"></TableCell>
                    <TableCell>
                      <input
                        id={`BloodLisSettingSpecimenTypeSearch`}
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t('Search ....')}
                        value={searchCriteria.SpecimenType}
                        onChange={e =>
                          setSearchCriteria({
                            ...searchCriteria,
                            SpecimenType: e.target.value,
                          })
                        }
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodLisSettingSpecimenTypePrefixSearch`}
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t('Search ....')}
                        value={searchCriteria.prefix}
                        onChange={e =>
                          setSearchCriteria({
                            ...searchCriteria,
                            prefix: e.target.value,
                          })
                        }
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        id={`BloodLisSettingSpecimenTypeSuffix`}
                        type="text"
                        name="CategoryTitle"
                        className="form-control bg-white rounded-2 fs-8 h-30px"
                        placeholder={t('Search ....')}
                        value={searchCriteria.suffix}
                        onChange={e =>
                          setSearchCriteria({
                            ...searchCriteria,
                            suffix: e.target.value,
                          })
                        }
                        onKeyDown={e => handleKeyPress(e)}
                      />
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>

                  <TableRow className="h-30px">
                    <TableCell>{t('Actions')}</TableCell>
                    <TableCell>
                      <div
                        className="d-flex justify-content-between cursor-pointer"
                        onClick={() => handleSort('SpecimenType')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Specimen Type')}
                        </div>

                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'SpecimenType'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'SpecimenType'
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
                        onClick={() => handleSort('specimenPrefix')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Specimen Prefix')}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'specimenPrefix'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'specimenPrefix'
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
                        onClick={() => handleSort('specimenSuffix')}
                        ref={searchRef}
                      >
                        <div style={{ width: 'max-content' }}>
                          {t('Specimen Suffix')}
                        </div>
                        <div className="d-flex justify-content-center align-items-center mx-4 mr-0">
                          <ArrowUp
                            CustomeClass={`${
                              sort.sortingOrder === 'desc' &&
                              sort.clickedIconData === 'specimenSuffix'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                          <ArrowDown
                            CustomeClass={`${
                              sort.sortingOrder === 'asc' &&
                              sort.clickedIconData === 'specimenSuffix'
                                ? 'text-success fs-7'
                                : 'text-gray-700 fs-7'
                            } p-0 m-0`}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell sx={{ width: 'max-content' }}>
                      <div className="d-flex justify-content-between cursor-pointer">
                        <div style={{ width: 'max-content' }}>
                          {t('Status')}
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {addSpecimen ? (
                    <AddSpecimenType
                      postData={postData}
                      handlesave={handlesave}
                      setPostData={setPostData}
                      handleCancel={handleCancel}
                      handleCheckChange={handleCheckChange}
                      handleChangeCategory={handleChangeCategory}
                    />
                  ) : null}
                  {loading ? (
                    <TableCell colSpan={4}>
                      <Loader />
                    </TableCell>
                  ) : apiGetData.length === 0 ? (
                    <NoRecord colSpan={4} />
                  ) : (
                    apiGetData.map((row: any, index: number) => (
                      <SpecimenRow
                        row={row}
                        key={row.id}
                        index={index}
                        showAPIDAta={showAPIDAta}
                        apiGetData={apiGetData}
                        handleSpecimenChabge={handleSpecimenChabge}
                      />
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Box>
      </div>
      {/* ~~~~~~~~~~~~~~~~~~~~~~~~~~~~  Table END ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ */}
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
    </>
  );
};

export default SpecimenType;
