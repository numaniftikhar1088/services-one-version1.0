import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import GroupSetupService from '../../../Services/Compendium/GroupSetup';
import { NavigatorsArray } from '../../../Utils/Compendium/NavigatorsDetail';
import { RouteSlice } from '../../../Utils/Compendium/RouteSlicer';
import GroupSetupGrid from './GroupSetup';
import useLang from './../../../Shared/hooks/useLanguage';

//============================================================================================
const GroupSetup = () => {
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
  const [groupsetup, setGroupSetup] = useState<any>([]);
  const [values, setValues] = useState<any>({
    name: '',
    description: '',
    isActive: true,
    reqTypeName: '',
    reqTypeId: 0,
  });
  const [isRequest, setIsRequest] = useState(false);
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [searchRequest, setSearchRequest] = useState<any>({
    name: '',
    description: '',
    isActive: null,
    reqTypeName: '',
    reqTypeId: 0,
  });
  const SearchQuery = {
    name: searchRequest.name,
    description: searchRequest.description,
    isActive:
      searchRequest.isActive === 'true'
        ? true
        : searchRequest.isActive === 'false'
          ? false
          : null,
    reqTypeName: searchRequest.reqTypeName,
    reqTypeId: searchRequest.reqTypeId,
  };
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  useEffect(() => {
    loadData(false);
  }, [pageSize, curPage, triggerSearchData]);
  const { pathname } = useLocation();
  const updatedNavigatorsArray = RouteSlice(pathname, NavigatorsArray);
  const loadData = (reset: boolean) => {
    setLoading(true);
    const nullDataObj = {
      name: '',
      description: '',
      isActive: null,
      reqTypeName: '',
    };
    if (reset) {
      setSearchRequest({
        name: '',
        description: '',
        isActive: '',
        reqTypeName: '',
      });
    }
    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(SearchQuery).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );
    GroupSetupService.getAllGroupSetup({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullDataObj : trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setGroupSetup(res?.data?.result);
        setTotal(res?.data?.totalRecord);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  // const [filterData, setFilterData] = useState<any>({
  //   sortColumn: "id",
  //   sortDirection: "desc",
  // });
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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    let result: any;
    if (value.includes(',')) {
      result = value.split(',');

      setValues((preVal: any) => {
        return {
          ...preVal,
          reqTypeId: result[0],
          reqTypeName: result[1],
        };
      });
    }
  };

  const statusChange = async (id: 0, isActive: boolean) => {
    const objToSend = {
      id: id,
      isActive: isActive ? false : true,
    };
    await GroupSetupService.changeGroupStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.status));
          setOpenModal(false);
          loadData(true);
        } else if (res?.data?.httpStatusCode === 400) {
          toast.info(t(res?.data?.status));
          setOpenModal(false);
        }
      })
      .catch((err: string) => {});
  };

  const DeleteGroup = async (id: number) => {
    const objToSend = {
      id: id,
    };
    await GroupSetupService.deleteGroup(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.status === 200) {
          toast.success(t(res?.data?.title));
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };

  const [errors, setErrors] = useState({
    GroupNameError: '',
    DisplayNameError: '',
  });
  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};
    setIsRequest(false);
    if (!values.name) {
      newErrors.GroupNameError = t('Please Write Group Name');
      formIsValid = false;
    }
    if (!values.description) {
      newErrors.DisplayNameError = t('Please Write Display Name');
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };
  const handleSubmitCreate = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      setIsRequest(true);
      if (!editGridHeader) {
        const objToSend = {
          id: 0,
          name: values.name,
          description: values.description,
          isActive: values.isActive,
          reqTypeId: values?.reqTypeId,
        };

        GroupSetupService.CreateGroups(objToSend)
          .then((res: AxiosResponse) => {
            if (res?.data?.status === 200) {
              toast.success(t(res?.data?.data?.message));
              setOpenModal(false);
              setIsRequest(false);
              loadData(true);
              setValues({
                name: '',
                isActive: true,
                description: '',
                reqTypeId: 0,
                reqTypeName: '',
              });
            } else if (
              res?.data?.status === 400 &&
              res?.data?.title === 'One or more validation errors.'
            ) {
              setIsRequest(false);
              toast.info(t('Record Already Exists'));
            }
          })
          .catch((err: string) => {});
      }
      if (editGridHeader) {
        e.preventDefault();
        const objToSend = {
          id: values?.id,
          isActive: values?.isActive,
          name: values?.name,
          description: values?.description,
          reqTypeId: values?.reqTypeId,
        };
        GroupSetupService.UpdateGroups(objToSend)
          .then((res: AxiosResponse) => {
            if (res?.data?.status === 200) {
              toast.success(t(res?.data?.data?.message));
              setOpenModal(false);
              loadData(true);
              setIsRequest(false);
              setValues({
                name: '',
                isActive: true,
                description: '',
                reqTypeName: '',
                reqTypeId: 0,
              });
              setEditGridHeader(false);
            }
          })
          .catch((err: string) => {});
      }
    }
  };
  const [open, setOpen] = useState(false);
  return (
    <>
      <GroupSetupGrid
        rows={
          groupsetup?.length > 0
            ? groupsetup?.map((val: any, index: any) => ({
                id: val?.id,
                name: val?.name,
                description: val?.description,
                isActive: val?.isActive,
                reqTypeName: val?.reqTypeName,
                reqTypeId: val?.reqTypeId,
              }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        openModal={openModal}
        setOpenModal={setOpenModal}
        setEditGridHeader={setEditGridHeader}
        values={values}
        setValues={setValues}
        statusChange={statusChange}
        searchRequest={searchRequest}
        setSearchRequest={setSearchRequest}
        loadData={loadData}
        DeleteGroup={DeleteGroup}
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
        handleChange={handleChange}
        handleSubmit={handleSubmitCreate}
        modalheader={editGridHeader ? 'Edit Group Setup' : 'Add Group Setup'}
        errors={errors}
        setErrors={setErrors}
        open={open}
        setOpen={setOpen}
        isRequest={isRequest}
        setIsRequest={setIsRequest}
        searchRef={searchRef}
        handleSort={handleSort}
        sort={sort}
        setSorting={setSorting}
        setTriggerSearchData={setTriggerSearchData}
        setCurPage={setCurPage}
      />
    </>
  );
};

export default GroupSetup;
