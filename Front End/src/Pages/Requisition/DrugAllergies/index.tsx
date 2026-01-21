import { styled, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Requisition from '../../../Services/Requisition/RequisitionTypeService';
import { NavigatorsArray } from '../../../Utils/Compendium/NavigatorsDetail';
import { RouteSlice } from '../../../Utils/Compendium/RouteSlicer';
import DrugAllergyGrid from './DrugAllergy';
import useLang from 'Shared/hooks/useLanguage';
import { AutocompleteStyle } from 'Utils/MuiStyles/AutocompleteStyles';
import { inputs } from 'Utils/Compendium/Inputs';
import GridNavbar from './GridNavbar';
import NewDrugAllergy from './NewDrugAllergy';
import AddDrugAllergy from './NewDrugAllergy/AddDrugAllergy';
import {
  DrugAllergyDelete,
  DrugAllergyGetAll,
  DrugAllergySaveData,
  UniqueDescription,
} from 'Services/DrugAllergy/DrugAllergy';
import BreadCrumbs from 'Utils/Common/Breadcrumb';
import SearchDrugAllergy from './NewDrugAllergy/SearchDrugAllergy';
import { sortById, SortingTypeI } from 'Utils/consts';

const TabSelected = styled(Tab)(AutocompleteStyle());
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const DrugAllergy = () => {
  const { t } = useLang();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    setAddTab2(false);
    setTab2Search(false);
    setOpen(false);
    setOpenModal(false);
    handleReset();
    resetSearch();
  };
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [requisition1, setRequisition1] = useState<any>({
    label: '',
    value: 0,
  });
  const [reference1, setReference1] = useState<any>({
    label: '',
    value: 0,
  });
  const resetSearch = () => {
    setRequisition1((preVal: any) => {
      return {
        ...preVal,
        label: '',
        value: 0,
      };
    });
    setReference1((preVal: any) => {
      return {
        ...preVal,
        value: 0,
        label: '',
      };
    });
    setSorting(initialsorting);
    loadData(true);
  };
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
    loadData(true);
  }, []);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================
  const [drugAllergy, setDrugAllergy] = useState<any>([]);
  const [des, setDes] = useState<any>([]);
  const [values, setValues] = useState<any>({
    id: 0,
    code: '',
    drugDescription: '',
    refLabId: 0,
    referenceLab: '',
    reqTypeId: 0,
    requisition: '',
    facilityId: 0,
    facility: '',
    panelId: 0,
    panel: '',
    status: true,
  });
  const [errors, setErrors] = useState({
    DrugDescriptionErrors: '',
    RequisitionError: '',
    ReferenceError: '',
    FacilityError: '',
  });
  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};
    if (!values.drugDescription) {
      newErrors.DrugDescriptionErrors = 'Please Select Drug Allergy';
      formIsValid = false;
    }
    // if (!values.referenceLab) {
    //   newErrors.ReferenceError = "Please Select Reference Lab";
    //   formIsValid = false;
    // }
    // if (!values.facility) {
    //   newErrors.FacilityError = "Please Select Facility";
    //   formIsValid = false;
    // }
    if (!values.requisition) {
      newErrors.RequisitionError = 'Please Select Requisition';
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [request, setRequest] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>({
    id: 0,
    code: '',
    drugDescription: '',
    refLabId: 0,
    referenceLab: '',
    reqTypeId: 0,
    requisition: '',
    facilityId: 0,
    facility: '',
    panelId: 0,
    panel: '',
    status: null,
  });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    setCurPage(1);
    loadData(false);
  }, [pageSize]);
  useEffect(() => {
    loadData(false);
  }, [curPage, triggerSearchData]);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  const loadData = (reset: boolean) => {
    setLoading(true);
    const nullDataObj = {
      code: '',
      drugDescription: '',
      refLabId: 0,
      referenceLab: '',
      labType: 0,
      reqTypeId: 0,
      requisition: '',
      facilityId: 0,
      facility: '',
      panelId: 0,
      panel: '',
      status: null,
    };
    if (reset) {
      setSearchRequest({
        code: '',
        drugDescription: '',
        refLabId: 0,
        referenceLab: '',
        labType: 0,
        reqTypeId: 0,
        requisition: '',
        facilityId: 0,
        facility: '',
        panelId: 0,
        panel: '',
        status: null,
      });
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    Requisition.GetAllDrugAllergies({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullDataObj : trimmedSearchRequest,
      sortColumn: reset ? initialsorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialsorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setDrugAllergy(res?.data?.data);
        setTotal(res?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  const initialsorting = {
    sortColumn: 'id',
    sortDirection: 'desc',
  };
  const [sort, setSorting] = useState<any>({
    sortingOrder: '',
    clickedIconData: '',
  });
  const searchRef = useRef<any>(null);

  const handleSort = async (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === 'asc'
        ? (searchRef.current.id = 'desc')
        : (searchRef.current.id = 'asc')
      : (searchRef.current.id = 'asc');
    sort.sortColumn = columnName;
    sort.sortDirection = searchRef.current.id;
    setSorting((preVal: any) => {
      return {
        ...preVal,
        sortingOrder: searchRef?.current?.id,
        clickedIconData: columnName,
      };
    });
    await loadData(false);
  };

  ////////////-----------------Sorting-------------------///////////////////
  const handleChangePanel = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    let result: any;
    if (value.includes('++')) {
      result = value.split('++');

      setValues((preVal: any) => {
        return {
          ...preVal,
          panelId: result[0],
          panel: result[1],
        };
      });
    }
  };
  const handleChangefacility = (e: any) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        facilityId: e?.value,
        facility: e?.label,
      };
    });
  };
  const handleChangecode = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        drugDescription: e.target.value,
      };
    });
    Requisition.GetCodeDescription(e.target.value)
      .then((res: AxiosResponse) => {
        setDes(res.data[0]);
        res.data[0].forEach((item: any) => {
          setValues((preVal: any) => {
            return {
              ...preVal,
              code: item.code,
            };
          });
        });
      })
      .catch((err: AxiosError) => {});
    setErrors((preVal: any) => {
      return {
        ...preVal,
        DrugDescriptionErrors: '',
      };
    });
  };

  const handleOnChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues((preVal: any) => {
      return {
        ...preVal,
        status: e.target.checked,
      };
    });
  };
  const statusChange = async (id: 0, status: boolean) => {
    const objToSend = {
      id: id,
      status: status ? false : true,
    };

    await Requisition.StatusDrugAllergy(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };
  const DeleteDrugAllergy = async (id: number) => {
    const objToSend = {
      id: id,
    };
    await Requisition.DeleteDrugAllergy(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const objToSend = {
        id: values.id,
        code: values.code,
        drugName: values.drugDescription,
        refLabId: values.refLabId,
        reqTypeId: values.reqTypeId,
        facilityId: values.facilityId,
        panelId: values.panelId,
        status: values.status,
      };
      setRequest(true);
      Requisition.SaveDrugAllergy(objToSend)
        .then((res: AxiosResponse) => {
          if (res?.data?.statusCode === 200) {
            setOpenModal(false);
            setRequest(false);
            toast.success(t(res?.data?.message));
            loadData(true);
            setValues({
              code: '',
              drugDescription: '',
              referenceLab: '',
              labType: 0,
              requisition: '',
              facility: '',
              panel: '',
            });
          }
        })
        .catch((err: string) => {});
    }
  };
  const [open, setOpen] = useState<any>(false);
  const [requisition, setRequisition] = useState<any>({
    values: 0,
    label: '',
  });
  const [reference, setReference] = useState<any>({
    values: 0,
    label: '',
  });
  const checkcollapse1 = () => {
    setOpenModal(true);
    setOpen(false);
  };

  const checkcollapse = () => {
    setOpen(true);
    setOpenModal(false);
  };

  //==========================================================================================
  //=================================  Tab 2 functions start =================================
  //==========================================================================================
  const [addTab2, setAddTab2] = useState(false);
  const [tab2Search, setTab2Search] = useState(false);
  const [reset1, setReset1] = useState(false);
  const [triggerSearchData1, setTriggerSearchData1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const initialPostData = {
    id: 0,
    description: '',
    Status: true,
  };
  const [postData, setpostData] = useState<any>(initialPostData);

  const initialSearchCriteria = {
    id: 0,
    description: '',
    Code: '',
  };
  const [searchCriteria, setSearchCriteria] = useState(initialSearchCriteria);

  ////////////-----------------Tab2 Get API Start-------------------///////////////////
  const [apiGetData, setApiGetData] = useState([]);
  const showData = async () => {
    setLoading2(true); // Start loading before the API call
    let obj = {
      pageNumber: curPage1,
      pageSize: pageSize1,
      queryModel: {
        dacode: (searchCriteria.Code || '').trim(),
        description: (searchCriteria.description || '').trim(),
        isActive: null,
      },
      sortColumn: sort1.clickedIconData || 'id',
      sortDirection: sort1.sortingOrder || 'Desc',
    };
    try {
      let res = await DrugAllergyGetAll(obj);
      if (res && res.data) {
        setApiGetData(res?.data?.data);
        setTotal1(res.data.total);
      } else {
        console.error(t('No data received'), res);
      }
    } catch (error) {
      console.error(t('API call failed'), error);
    } finally {
      setLoading2(false);
    }
  };
  useEffect(() => {
    showData();
  }, []);

  /*##############################-----PAGINATION Start-----#################*/
  const [curPage1, setCurPage1] = useState(1);
  const [pageSize1, setPageSize1] = useState(50);
  const [total1, setTotal1] = useState<number>(0);
  const [totalPages1, setTotalPages1] = useState(0);
  const [pageNumbers1, setPageNumbers1] = useState<number[]>([]);
  const nextPage1 = () => {
    if (curPage1 < Math.ceil(total1 / pageSize1)) {
      setCurPage1(curPage1 + 1);
    }
  };

  const showPage1 = (i: number) => {
    setCurPage1(i);
  };

  const prevPage1 = () => {
    if (curPage1 > 1) {
      setCurPage1(curPage1 - 1);
    }
  };

  useEffect(() => {
    setTotalPages1(Math.ceil(total1 / pageSize1));
    const pgNumbers1 = [];
    for (let i = curPage1 - 2; i <= curPage1 + 2; i++) {
      if (i > 0 && i <= totalPages1) {
        pgNumbers1.push(i);
      }
    }
    setPageNumbers1(pgNumbers1);
  }, [total1, curPage1, pageSize1, totalPages1]);
  /*##############################-----PAGINATION End-----#################*/
  /*#########################----SORT STARTS------########################## */
  const [sort1, setSorting1] = useState<SortingTypeI>(sortById);

  const searchRef1 = useRef<any>(null);
  /////////////
  const handleSort1 = (columnName1: any) => {
    searchRef1.current.id = searchRef1.current.id
      ? searchRef1.current.id === 'asc'
        ? (searchRef1.current.id = 'desc')
        : (searchRef1.current.id = 'asc')
      : (searchRef1.current.id = 'asc');

    setSorting1({
      sortingOrder: searchRef1?.current?.id,
      clickedIconData: columnName1,
    });

    showData();
  };
  /*#########################----SORT ENDS------########################## */
  /*##############################-----Post Api start-----#################*/
  const ApidataPost = async () => {
    const data = {
      id: postData.id,
      description: postData.description,
      isActive: postData.Status,
    };
    let resp = await DrugAllergySaveData(data);

    if (resp.data.httpStatusCode === 200) {
      toast.success(t(resp.data.message));
    } else {
      toast.error(t('Something Went Wrong...'));
    }
  };

  const handlesave = async () => {
    if (postData.description.length === 0) {
      toast.error(t(t('Please Enter Description.')));
      return;
    }
    await ApidataPost();
    setpostData(initialPostData);
    setAddTab2(false);
    showData();
  };

  const handleCancel = () => {
    setAddTab2(false);
    setpostData(initialPostData);
  };

  const handleSearch = () => {
    setCurPage1(1);
    setTriggerSearchData1(prev => !prev);
  };

  const handleKeyPress1 = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleReset = () => {
    setSearchCriteria(initialSearchCriteria);
    setCurPage1(1);
    setReset1(!reset1);
    setpostData(initialPostData);
    showData();
    setCurPage1(1);
    setPageSize1(50);
    setSorting(sortById);
  };
  /*##############################-----Delete Api Start-----##############################*/
  const handleDelete = async (id: number) => {
    try {
      await DrugAllergyDelete(id);
      showData();
    } catch (error) {
      console.error(t('Error deleting record:'), error);
    }
  };
  /*##############################-----Delete Api End-----##############################*/

  const handleEdit = (row: any) => {
    setpostData(() => ({
      ...row,
      id: row.id,
    }));
    setAddTab2(true);
  };

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div id="kt_app_toolbar" className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
          </div>
        </div>
      </div>
      <GridNavbar
        NavigatorsArray={NavigatorsArray}
        AddBtnText="Add Drug Allergies"
        setOpenModal={setOpenModal}
        Inputs={inputs}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
        statusDropDownName="specimenStatus"
        values={values}
        handleOnChange={handleOnChangeStatus}
        // handleChangeRequisition={handleChangeRequisition}
        handleChangePanel={handleChangePanel}
        handleChangeFacility={handleChangefacility}
        handleChangecode={handleChangecode}
        openModal={openModal}
        setEditGridHeader={setEditGridHeader}
        setCurPage={setCurPage}
        handleSubmit={handleSubmit}
        setValues={setValues}
        errors={errors}
        setErrors={setErrors}
        reference={reference}
        setReference={setReference}
        requisition={requisition}
        setRequisition={setRequisition}
        setRequest={setRequest}
        request={request}
        open={open}
        setOpen={setOpen}
        setSorting={setSorting}
        setReference1={setReference1}
        requisition1={requisition1}
        setRequisition1={setRequisition1}
        initialsorting={initialsorting}
        reference1={reference1}
        resetSearch={resetSearch}
        setTriggerSearchData={setTriggerSearchData}
      />

      <AddDrugAllergy
        setAddTab2={setAddTab2}
        addTab2={addTab2}
        postData={postData}
        setpostData={setpostData}
        handlesave={handlesave}
        handleCancel={handleCancel}
      />

      <SearchDrugAllergy
        setSearchCriteria={setSearchCriteria}
        searchCriteria={searchCriteria}
        tab2Search={tab2Search}
        handleSearch={handleSearch}
        setTab2Search={setTab2Search}
        handleKeyPress1={handleKeyPress1}
        handleReset={handleReset}
      />
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-content flex-column-fluid">
          <div className="app-container container-fluid">
            <Tabs
              value={value}
              onChange={handleChange}
              TabIndicatorProps={{ style: { background: 'transparent' } }}
              className="min-h-auto"
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
              }}
            >
              <TabSelected
                label={t('Assigned Drug Allergy')}
                {...a11yProps(0)}
                className="fw-bold text-capitalize"
                id={`AssignedDrugAllergy`}
              />
              <TabSelected
                label={t('New Drug Allergy')}
                {...a11yProps(1)}
                className="fw-bold text-capitalize"
                id={`NewDrugAllergy`}
              />
            </Tabs>
            <div className="card rounded-top-0 shadow-none tab-content-card">
              <div className="card-body py-2">
                <TabPanel value={value} index={0}>
                  <DrugAllergyGrid
                    rows={
                      drugAllergy?.length > 0
                        ? drugAllergy?.map((val: any, index: any) => ({
                            id: val.id,
                            code: val.code,
                            drugDescription: val.drugDescription,
                            refLabId: val.refLabId,
                            referenceLab: val.referenceLab,
                            labType: val.labType,
                            reqTypeId: val.reqTypeId,
                            requisition: val.requisition,
                            facilityId: val.facilityId,
                            facility: val.facility,
                            panelId: val.panelId,
                            panel: val.panel,
                            status: val.status,
                          }))
                        : []
                    }
                    NavigatorsArray={updatedNavigatorsArray}
                    open={open}
                    checkcollapse1={checkcollapse1}
                    checkcollapse={checkcollapse}
                    setOpenModal={setOpenModal}
                    setReference={setReference}
                    setOpen={setOpen}
                    setRequisition={setRequisition}
                    setEditGridHeader={setEditGridHeader}
                    setCurPage={setCurPage}
                    values={values}
                    setValues={setValues}
                    statusChange={statusChange}
                    searchRequest={searchRequest}
                    setSearchRequest={setSearchRequest}
                    loadData={loadData}
                    DeleteDrugAllergy={DeleteDrugAllergy}
                    loading={loading}
                    curPage={curPage}
                    pageSize={pageSize}
                    setPageSize={setPageSize}
                    total={total}
                    totalPages={totalPages}
                    pageNumbers={pageNumbers}
                    nextPage={nextPage}
                    showPage={showPage}
                    prevPage={prevPage}
                    handleOnChange={handleOnChangeStatus}
                    // handleChangeRequisition={handleChangeRequisition}
                    handleChangePanel={handleChangePanel}
                    handleChangeFacility={handleChangefacility}
                    handleChangecode={handleChangecode}
                    modalheader={
                      editGridHeader
                        ? 'Edit Drug Allergies'
                        : 'Add Drug Allergies'
                    }
                    openModal={openModal}
                    handleSubmit={handleSubmit}
                    errors={errors}
                    setErrors={setErrors}
                    setRequest={setRequest}
                    request={request}
                    sort={sort}
                    handleSort={handleSort}
                    searchRef={searchRef}
                    setSorting={setSorting}
                    initialsorting={initialsorting}
                    setTriggerSearchData={setTriggerSearchData}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <NewDrugAllergy
                    setAddTab2={setAddTab2}
                    apiGetData={apiGetData}
                    addTab2={addTab2}
                    handleDelete={handleDelete}
                    setLoading2={setLoading2}
                    loading2={loading2}
                    showData={showData}
                    curPage1={curPage1}
                    nextPage1={nextPage1}
                    pageNumbers1={pageNumbers1}
                    tab2Search={tab2Search}
                    pageSize1={pageSize1}
                    prevPage1={prevPage1}
                    showPage1={showPage1}
                    total1={total1}
                    setPageSize1={setPageSize1}
                    totalPages1={totalPages1}
                    searchRef1={searchRef1}
                    handleSort1={handleSort1}
                    sort1={sort1}
                    reset1={reset1}
                    triggerSearchData1={triggerSearchData1}
                    handleEdit={handleEdit}
                    setTab2Search={setTab2Search}
                  />
                </TabPanel>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DrugAllergy;
function setReference(arg0: (preVal: any) => any) {
  throw new Error('Function not implemented.');
}
