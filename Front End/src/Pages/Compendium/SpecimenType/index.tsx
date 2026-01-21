import { AxiosResponse } from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import SpecimenType from '../../../Services/Compendium/SpecimentType';
import { NavigatorsArray } from '../../../Utils/Compendium/NavigatorsDetail';
import { RouteSlice } from '../../../Utils/Compendium/RouteSlicer';
import SpecimenTypeGrid from './SpecimenType';
import useLang from 'Shared/hooks/useLanguage';
interface ISpecimenType {
  specimenTypeId: any;
  specimenType: string;
  specimenPreFix: string;
  specimenStatus: string | boolean;
}
export interface IFormValues {
  specimenType: string;
  specimenStatus: boolean;
  [key: string]: string | boolean;
}

interface IRequest {
  specimenType: string | '';
}
const SpecimenTypeComp = () => {
  const { t } = useLang();
  const [triggerSearchData, setTriggerSearchData] = useState(false);
  //============================================================================================
  //====================================  PAGINATION START =====================================
  //============================================================================================

  const [curPage, setCurPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [isRequest, setIsRequest] = useState(false);
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
  const [specimenTypeData, setSpecimenTypeData] = useState<any>([]);
  const [values, setValues] = useState<any>({
    specimenTypeId: 0,
    specimenType: '',

    specimenStatus: true,
  });
  const [editGridHeader, setEditGridHeader] = useState(false);
  const [searchRequest, setSearchRequest] = useState<IRequest>({
    specimenType: '',
  });
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
      specimenType: '',
    };
    if (reset) {
      setSearchRequest({
        specimenType: '',
      });
    }

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequest).map(([key, value]) => [
        key,
        typeof value === 'string' ? value.trim() : value,
      ])
    );

    SpecimenType.getAllSpecimenType({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset ? nullDataObj : trimmedSearchRequest,
      sortColumn: reset ? initialSorting.sortColumn : sort?.sortColumn,
      sortDirection: reset ? initialSorting.sortDirection : sort?.sortDirection,
    })
      .then((res: AxiosResponse) => {
        setSpecimenTypeData(res?.data?.result);
        setTotal(res?.data?.totalRecord);
        setLoading(false);
      })
      .catch((err: any) => {
        console.trace(err);
        setLoading(false);
      });
  };
  ////////////-----------------Sorting-------------------///////////////////
  const initialSorting = {
    sortColumn: 'specimenTypeId',
    sortDirection: 'desc',
  };
  const [sort, setSorting] = useState<any>(initialSorting);
  const searchRef = useRef<any>(null);
  const handleSort = (columnName: any) => {
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
    loadData(false);
  };

  ////////////-----------------Sorting-------------------///////////////////
  const statusChange = async (
    specimenTypeId: string,
    specimenStatus: boolean
  ) => {
    const objToSend = {
      specimenTypeId: specimenTypeId,
      specimenStatus: specimenStatus ? false : true,
    };
    await SpecimenType.changeSpecimenStatus(objToSend)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
        }
      })
      .catch((err: string) => {});
  };
  const DeleteSpecimenType = async (specimenTypeId: string) => {
    await SpecimenType.DeleteSpecimenType(specimenTypeId)
      .then((res: AxiosResponse) => {
        if (res?.data?.httpStatusCode === 200) {
          toast.success(t(res?.data?.message));
          setOpenModal(false);
          loadData(true);
        } else {
          toast.error(t(res?.data?.message));
        }
      })
      .catch((err: string) => {});
  };
  const [errors, setErrors] = useState({
    TypeError: '',
  });
  const validateForm = () => {
    let formIsValid = true;
    const newErrors: any = {};
    if (!values.specimenType) {
      newErrors.TypeError = t('Please Write a Specimen Type');
      formIsValid = false;
    }
    setErrors(newErrors);
    return formIsValid;
  };
  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validateForm()) {
      SpecimenType.saveSpecimenType(values)
        .then((res: AxiosResponse) => {
          if (res?.data?.httpStatusCode === 200) {
            toast.success(res?.data?.message);
            setOpenModal(false);
            loadData(true);
            setValues({
              specimenTypeId: 0,
              specimenType: '',
              specimenStatus: true,
            });
          } else if (res?.data?.httpStatusCode === 400) {
            toast.info(t(res?.data?.message));
          }
        })
        .finally(() => {
          setIsRequest(false);
        });
    }
  };

  const [open, setOpen] = useState(false);
  // const [openModal, setOpenModal] = useState(false);
  const handleChange = (e: any) => {
    const name = e.target.name;
    const value = e.target.value;
    let myBool = value === 'true';
    setSearchRequest((preVal: any) => {
      return {
        ...preVal,
        [name]: e.target.type === 'select-one' ? myBool : value,
      };
    });
  };
  const resetSearch = () => {
    loadData(true);
    setSorting(initialSorting);
  };

  return (
    <>
      <SpecimenTypeGrid
        rows={
          specimenTypeData?.length > 0
            ? specimenTypeData?.map((val: ISpecimenType, index: number) => ({
                specimenTypeId: val?.specimenTypeId,
                specimenType: val?.specimenType,
                specimenStatus: val?.specimenStatus,
              }))
            : []
        }
        NavigatorsArray={updatedNavigatorsArray}
        setOpenModal={setOpenModal}
        openModal={openModal}
        editGridHeader={editGridHeader}
        setEditGridHeader={setEditGridHeader}
        values={values}
        setValues={setValues}
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
        open={open}
        setOpen={setOpen}
        handleChange={handleChange}
        resetSearch={resetSearch}
        // handleOnChange={handleOnChange}
        handleSubmit={handleSubmit}
        errors={errors}
        setErrors={setErrors}
        isRequest={isRequest}
        setIsRequest={setIsRequest}
        searchRef={searchRef}
        handleSort={handleSort}
        sort={sort}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
        DeleteSpecimenType={DeleteSpecimenType}
      />
    </>
  );
};

export default SpecimenTypeComp;
