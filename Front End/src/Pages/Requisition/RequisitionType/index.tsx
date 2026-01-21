import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import RequisitionType from '../../../Services/Requisition/RequisitionTypeService';
import { RouteSlice } from '../../../Utils/Compendium/RouteSlicer';
import { NavigatorsArray } from '../../../Utils/Requisition/Input/NavigatorsDetail';
import RequisitionTypeGrid from './RequisitionType';
import useLang from 'Shared/hooks/useLanguage';
export interface IFormValues {
  typeName: string;
  type: string;
  isActive: string | boolean;
  requisitionColor: string;
  isSelected: boolean | any;
  requisitionId: number | any;

  [key: string]: string | boolean;
}
const RequisitionTypeComp = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
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
  const [requisitionList, setRequisitionList] = useState<any>([]);
  const [requisitionColorList, setRequisitionColorList] = useState<any>({
    value: '',
    color: '',
    label: '',
  });
  const [isRequest, setIsRequest] = useState(false);
  const [requisitionTypeData, setRequisitionTypeData] = useState([]);
  const [values, setValues] = useState<any>({
    id: 0,
    name: '',
    type: '',
    isActive: null,
    requisitionColor: '',
    isSelected: null,
    requisitionId: 0,
    isRequisitionPanelDefault: true,
    isPatientSignatureRequired: null,
    isPhysicianSignatureRequired: null,
  });
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>({
    id: 0,
    name: '',
    type: '',
    isActive: null,
    requisitionColor: '',
    requisitionId: 0,
  });
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    loadData(false);
  }, [pageSize, curPage, triggerSearchData]);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  useEffect(() => {
    getRequisitionDropdownItems();
    getRequisitionColorDropdownItems(values);
  }, []);
  const SearchQuery = {
    name: searchRequest.name,
    type: searchRequest.type,
    isActive:
      searchRequest.isActive === 'true'
        ? true
        : searchRequest.isActive === 'false'
          ? false
          : null,

    requisitionColor: searchRequest.reqColorId,
  };
  const loadData = (reset: boolean) => {
    setLoading(true);
    const nullDataObj = {
      name: '',
      type: '',
      isActive: null,
      requisitionColor: '',
    };
    if (reset) {
      setSearchRequest({
        id: 0,
        name: '',
        type: '',
        isActive: '',
        requisitionColor: '',
        reqColorId: '',
        haxacode: '',
        requisitionId: 0,
      });
      setRequisitionColorList([]);
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(SearchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    RequisitionType.getAllRequisitionType({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullDataObj : trimmedSearchRequest,
      sortColumn: reset ? initialSorting?.sortColumn : sort?.sortColumn,
      sortDirection: reset
        ? initialSorting?.sortDirection
        : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setRequisitionTypeData(res?.data?.data?.data);
        setTotal(res?.data?.data?.total);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  const initialSorting = {
    sortColumn: 'id',
    sortDirection: 'desc',
  };
  const [sort, setSorting] = useState<any>(initialSorting);
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

  const statusChange = async (id: number, isActive: boolean) => {
    const objToSend = {
      isActive: isActive,
      id: id,
    };
    await RequisitionType.changeRequisitionStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.status === 200) {
          toast.success(t(res?.data?.message));
          loadData(true);
        }
      })
      .catch((err: string) => {
        setLoading(false);
      });
  };
  const getRequisitionDropdownItems = () => {
    RequisitionType.requisitionLookUp().then((res: AxiosResponse) => {
      setRequisitionList(res?.data);
    });
  };

  const getRequisitionColorDropdownItems = (val: any) => {
    let Id = val?.reqTypeId;
    const query = {
      id: Id,
    };
    RequisitionType.requisitionColorLookup(query).then((res: AxiosResponse) => {
      setRequisitionColorList(res?.data);
    });
  };
  const [errors, setErrors] = useState({
    nameError: '',
    typeError: '',
  });
  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};
    setIsRequest(false);
    if (!values.name) {
      newErrors.nameError = t('Please Write a Requisition Name');
      formIsValid = false;
    }
    if (!values.type) {
      newErrors.typeError = t('Please Write a Requisition Type');
      formIsValid = false;
    }

    setErrors(newErrors);
    return formIsValid;
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    setIsRequest(true);
    e.preventDefault();
    const objToSend = {
      ...values,
      id: values?.id ? values?.id : 0,
      type: values?.type,
      typeName: values?.name ? values?.name : '',
      isActive: values.isActive ? values?.isActive : false,
      requisitionColor: requisitionColorList?.color
        ? requisitionColorList?.color
        : '',
      isSelected: values.isSelected,
      requisitionId: values.requisitionId,
      isRequisitionPanelDefaultChecked: values.isRequisitionPanelDefault,
    };

    if (validateForm()) {
      if (!editGridHeader) {
        setIsRequest(true);
        RequisitionType.saveRequisitionType(objToSend)
          .then((res: AxiosResponse) => {
            if (res?.data?.data?.status === 200) {
              toast.success(t(res?.data?.data?.message));
              setOpenModal(false);
              setIsRequest(false);
              loadData(true);
              setValues({
                id: 0,
                name: '',
                isActive: true,
                type: '',
              });
              setRequisitionColorList([]);
              setEditGridHeader(false);
            } else if (res?.data?.data?.status === 400) {
              toast.info(t('Record Already Exists'));
              setIsRequest(false);
            }
          })
          .catch((err: string) => {
            setEditGridHeader(false);
          });
      }
      if (editGridHeader) {
        setIsRequest(true);
        RequisitionType.updateRequisitionType(objToSend)
          .then((res: AxiosResponse) => {
            if (res?.data?.data?.status === 200) {
              toast.success(t(res?.data?.data?.message));
              setIsRequest(false);
              setOpenModal(false);
              loadData(true);
              setValues({
                id: 0,
                name: '',
                isActive: true,
                type: '',
              });
              setRequisitionColorList([]);

              setEditGridHeader(false);
            }
          })
          .catch((err: string) => {
            setEditGridHeader(false);
          });
      }
    }
  };
  return (
    <>
      <RequisitionTypeGrid
        rows={
          requisitionTypeData?.length > 0
            ? requisitionTypeData?.map((val: any, index: number) => ({
                id: val?.id,
                name: val?.name,
                type: val?.type,
                isActive: val?.isActive,
                requisitionColor: val?.requisitionColor,
                color: '',
                value: '',
                label: '',
                isSelected: val?.isActive,
                requisitionId: val?.requisitionId,
                isPatientSignatureRequired: val.isPatientSignatureRequired,
                isPhysicianSignatureRequired: val.isPhysicianSignatureRequired,
              }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        values={values}
        setValues={setValues}
        setRequisitionList={setRequisitionList}
        requisitionList={requisitionList}
        requisitionColorList={requisitionColorList}
        statusChange={statusChange}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
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
        openModal={openModal}
        editGridHeader={editGridHeader}
        handleSubmit={handleSubmit}
        setRequisitionColorList={setRequisitionColorList}
        errors={errors}
        setErrors={setErrors}
        isRequest={isRequest}
        handleSort={handleSort}
        searchRef={searchRef}
        sort={sort}
        initialSorting={initialSorting}
        setSorting={setSorting}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
      />
    </>
  );
};

export default RequisitionTypeComp;
