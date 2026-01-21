import useLang from "Shared/hooks/useLanguage";
import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { InputChangeEvent } from "../../../Shared/Type";
import usePagination from "../../../Shared/hooks/usePagination";
import { SortingTypeI, sortByRequisitionId } from "../../../Utils/consts";
import IncompleteRequisitionGrid from "./IncompleteRequisitionGrid";

const IncompleteRequisition = () => {
  const { t } = useLang();

  const [triggerSearchData, setTriggerSearchData] = useState(false);
  const [sort, setSorting] = useState<SortingTypeI>(sortByRequisitionId);
  
  //============================================================================================
  //====================================  PAGINATION START View Requisition Tabs  =====================================
  //============================================================================================
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

  useEffect(() => {
    LoadDataIncompleteRequisition(false);
  }, [curPage, pageSize, triggerSearchData]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [incompleteRequisition, setIncompleteRequisition] = useState<any>([]);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [loading, setLoading] = useState(false);

  const initialIncompleteReqSearchQuery = {
    AccessionNo: "",
    Order: "",
    Status: "",
    MissingInfo: "",
    FirstName: "",
    LastName: "",
    DateOfBirth: "",
    RequisitionTypeId: 0,
    RequisitionType: "",
    PhysicianName: "",
    ClientName: "",
    DateOfCollection: "",
    TimeOfCollection: "",
    AddedBy: "",
  };
  const [searchRequestIncomplete, setSearchRequestIncomplete] = useState<any>(
    initialIncompleteReqSearchQuery
  );

  const onInputChangeSearchIncomplete = (
    e: React.ChangeEvent<InputChangeEvent>
  ) => {
    setSearchRequestIncomplete({
      ...searchRequestIncomplete,
      [e.target.name]: e.target.value,
    });
  };

  function resetSearch1() {
    setSearchRequestIncomplete(initialIncompleteReqSearchQuery);
    setSorting(sortByRequisitionId);
    LoadDataIncompleteRequisition(true, sortByRequisitionId);
  }

  const LoadDataIncompleteRequisition = (
    reset: boolean,
    sortingState?: any
  ) => {
    setLoading(true);

    const trimmedSearchRequest = Object.fromEntries(
      Object.entries(searchRequestIncomplete).map(([key, value]) => [
        key,
        typeof value === "string" ? value.trim() : value,
      ])
    );
    const updatedSearchRequest = {
      ...trimmedSearchRequest,
      DateOfBirth: trimmedSearchRequest.DateOfBirth
        ? moment(trimmedSearchRequest.DateOfBirth).format("MM/DD/YYYY")
        : null,
      DateOfCollection: trimmedSearchRequest.DateOfCollection
        ? moment(trimmedSearchRequest.DateOfCollection).format("MM/DD/YYYY")
        : null,
    };

    RequisitionType.incompleteRequisition({
      pageNumber: curPage,
      pageSize: pageSize,
      queryModel: reset
        ? initialIncompleteReqSearchQuery
        : updatedSearchRequest,
      sortColumn: reset ? sortingState?.clickedIconData : sort?.clickedIconData,
      sortDirection: reset ? sortingState?.sortingOrder : sort?.sortingOrder,
    })
      .then((res: AxiosResponse) => {
        if (res?.data?.statusCode === 200) {
          setIncompleteRequisition(res?.data?.data);
          setTotal(res?.data?.total);
        }
      })
      .finally(() => setLoading(false));
  };

  const searchRef = useRef<any>(null);

  const handleSort = (columnName: any) => {
    searchRef.current.id = searchRef.current.id
      ? searchRef.current.id === "asc"
        ? (searchRef.current.id = "desc")
        : (searchRef.current.id = "asc")
      : (searchRef.current.id = "asc");

    setSorting({
      sortingOrder: searchRef?.current?.id,
      clickedIconData: columnName,
    });
  };

  useEffect(() => {
    if (isInitialRender) {
      LoadDataIncompleteRequisition(false);
    } else {
      setIsInitialRender(true);
    }
  }, [sort]);

  const DeleteRecord = (id: number) => {
    RequisitionType.DeleteIncomplete(id).then((res: AxiosResponse) => {
      if (res?.data?.httpStatusCode === 200) {
        toast.success(t(res?.data?.message));
        LoadDataIncompleteRequisition(false);
      }
    });
  };

  useEffect(() => {
    if (isInitialRender2) {
      LoadDataIncompleteRequisition(false);
    } else {
      setIsInitialRender2(true);
    }
  }, []);

  return (
    <>
      <IncompleteRequisitionGrid
        curPage={curPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        total={total}
        totalPages={totalPages}
        pageNumbers={pageNumbers}
        nextPage={nextPage}
        showPage={showPage}
        prevPage={prevPage}
        requisitionList={incompleteRequisition}
        loading={loading}
        searchRequest={searchRequestIncomplete}
        setSearchRequest={setSearchRequestIncomplete}
        searchQuery={onInputChangeSearchIncomplete}
        resetSearch={resetSearch1}
        Delete={DeleteRecord}
        sort={sort}
        searchRef={searchRef}
        handleSort={handleSort}
        initialSearchQuery={initialIncompleteReqSearchQuery}
        setCurPage={setCurPage}
        setTriggerSearchData={setTriggerSearchData}
      />
    </>
  );
};
export default IncompleteRequisition;
