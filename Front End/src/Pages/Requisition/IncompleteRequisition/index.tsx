import { AxiosResponse } from "axios";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import RequisitionType from "../../../Services/Requisition/RequisitionTypeService";
import { InputChangeEvent } from "../../../Shared/Type";
import BreadCrumbs from "../../../Utils/Common/Breadcrumb";
import { SortingTypeI, sortByRequisitionId } from "../../../Utils/consts";
import IncompleteRequisitionGrid from "./IncompleteRequisition";
import usePagination from "../../../Shared/hooks/usePagination";

const IncompleteRequisition = () => {
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
  }, [curPage]);
  //============================================================================================
  //====================================  PAGINATION END =======================================
  //============================================================================================

  const [incompleteRequisition, setIncompleteRequisition] = useState<any>([]);
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [isInitialRender2, setIsInitialRender2] = useState(false);
  const [loading, setLoading] = useState(false);

  let initialIncompleteReqSearchQuery = {
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
  let [searchRequestIncomplete, setSearchRequestIncomplete] = useState<any>(
    initialIncompleteReqSearchQuery
  );

  const onInputChangeSearchIncomplete = (
    e: React.ChangeEvent<InputChangeEvent>
  ) => {
    if (
      e.target.name === "DateOfBirth" ||
      e.target.name === "DateOfCollection"
    ) {
      setSearchRequestIncomplete({
        ...searchRequestIncomplete,
        [e.target.name]: e.target.value,
      });
    } else {
      setSearchRequestIncomplete({
        ...searchRequestIncomplete,
        [e.target.name]: e.target.value,
      });
    }
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
    const updatedSearchRequest = {
      ...searchRequestIncomplete,
      DateOfBirth: searchRequestIncomplete.DateOfBirth
        ? moment(searchRequestIncomplete.DateOfBirth).format("MM/DD/YYYY")
        : null,
      DateOfCollection: searchRequestIncomplete.DateOfCollection
        ? moment(searchRequestIncomplete.DateOfCollection).format("MM/DD/YYYY")
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
        toast.success(res?.data?.message);
        LoadDataIncompleteRequisition(false);
      }
    });
  };

  useEffect(() => {
    if (isInitialRender2) {
      setCurPage(1);
      LoadDataIncompleteRequisition(false);
    } else {
      setIsInitialRender2(true);
    }
  }, [pageSize]);

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <div className="app-toolbar py-2 py-lg-3">
          <div className="app-container container-fluid d-flex flex-wrap gap-4 justify-content-center justify-content-sm-between align-items-center">
            <BreadCrumbs />
          </div>
        </div>
        <div id="kt_app_content" className="app-content flex-column-fluid">
          <div
            id="kt_app_content_container"
            className="app-container container-fluid"
          >
            <div className="mb-5 hover-scroll-x">
              <div className="card">
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
                  loadData={LoadDataIncompleteRequisition}
                  searchRequest={searchRequestIncomplete}
                  setSearchRequest={setSearchRequestIncomplete}
                  searchQuery={onInputChangeSearchIncomplete}
                  resetSearch={resetSearch1}
                  Delete={DeleteRecord}
                  sort={sort}
                  searchRef={searchRef}
                  handleSort={handleSort}
                  initialSearchQuery={initialIncompleteReqSearchQuery}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default IncompleteRequisition;
